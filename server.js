// Socket.IO Server for EduSparring Real-time Features
// Run with: node server.js

const { Server } = require('socket.io');

const io = new Server(3003, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    methods: ['GET', 'POST']
  }
});

// ===============================
// IN-MEMORY STORAGE
// ===============================

const matchmakingQueue = [];
const activeMatches = new Map();
const playerSockets = new Map();
const onlineUsers = new Map(); // userId -> { socketId, status, currentActivity }
const tournaments = new Map(); // tournamentId -> tournament data
const spectators = new Map(); // matchId -> Set of spectator socketIds
const friendChallenges = new Map(); // challengeId -> challenge data
const rematchRequests = new Map(); // matchId -> rematch data

// ===============================
// NAMESPACES
// ===============================

const mainNamespace = io.of('/');
const spectatorNamespace = io.of('/spectator');
const tournamentNamespace = io.of('/tournament');

console.log('🎮 EduSparring Socket.IO Server running on port 3003');

// ===============================
// MAIN NAMESPACE - Game Events
// ===============================

mainNamespace.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  playerSockets.set(socket.id, { socket, status: 'idle', userId: null });

  // ===============================
  // PRESENCE & ONLINE STATUS
  // ===============================

  socket.on('user-online', (data) => {
    const { userId, userName, knowledgeRating } = data;
    
    onlineUsers.set(userId, {
      socketId: socket.id,
      userName,
      knowledgeRating,
      status: 'online',
      currentActivity: 'browsing',
      lastSeen: Date.now()
    });

    socket.userId = userId;
    socket.userData = { userId, userName, knowledgeRating };

    // Update playerSockets
    playerSockets.set(socket.id, { 
      socket, 
      status: 'online', 
      userId,
      userData: { userName, knowledgeRating }
    });

    // Broadcast online status to friends
    mainNamespace.emit('presence-update', {
      userId,
      status: 'online',
      currentActivity: 'browsing'
    });

    console.log('User online:', userName, userId);
  });

  socket.on('update-activity', (data) => {
    const { userId, activity } = data;
    const user = onlineUsers.get(userId);
    
    if (user) {
      user.currentActivity = activity;
      user.lastSeen = Date.now();
      
      mainNamespace.emit('presence-update', {
        userId,
        status: 'online',
        currentActivity: activity
      });
    }
  });

  socket.on('get-online-friends', (data) => {
    const { friendIds } = data;
    const onlineFriends = [];

    for (const friendId of friendIds) {
      const user = onlineUsers.get(friendId);
      if (user) {
        onlineFriends.push({
          userId: friendId,
          userName: user.userName,
          status: user.status,
          currentActivity: user.currentActivity
        });
      }
    }

    socket.emit('online-friends-list', onlineFriends);
  });

  // ===============================
  // FRIEND CHALLENGES
  // ===============================

  socket.on('challenge-friend', (data) => {
    const { fromUserId, fromUserName, toUserId, subject, difficulty } = data;
    const targetUser = onlineUsers.get(toUserId);

    if (!targetUser) {
      socket.emit('challenge-error', { message: 'User is not online' });
      return;
    }

    const challengeId = `challenge-${Date.now()}`;
    const challengeData = {
      id: challengeId,
      fromUserId,
      fromUserName,
      fromSocketId: socket.id,
      toUserId,
      toSocketId: targetUser.socketId,
      subject,
      difficulty,
      status: 'pending',
      createdAt: Date.now()
    };

    friendChallenges.set(challengeId, challengeData);

    // Send challenge to target
    mainNamespace.to(targetUser.socketId).emit('friend-challenge', {
      challengeId,
      from: {
        id: fromUserId,
        name: fromUserName
      },
      subject,
      difficulty
    });

    console.log('Challenge sent:', fromUserName, '->', toUserId);
  });

  socket.on('accept-challenge', (data) => {
    const { challengeId } = data;
    const challenge = friendChallenges.get(challengeId);

    if (!challenge) {
      socket.emit('challenge-error', { message: 'Challenge no longer valid' });
      return;
    }

    challenge.status = 'accepted';

    // Create match
    const matchId = `match-${Date.now()}`;
    const matchData = {
      id: matchId,
      player1: {
        socketId: challenge.fromSocketId,
        id: challenge.fromUserId,
        name: challenge.fromUserName
      },
      player2: {
        socketId: socket.id,
        id: challenge.toUserId,
        name: socket.userData?.userName || 'Player'
      },
      subject: challenge.subject,
      difficulty: challenge.difficulty,
      status: 'waiting',
      player1Ready: false,
      player2Ready: false,
      currentRound: 1,
      player1Score: 0,
      player2Score: 0,
      messages: [],
      isFriendMatch: true,
      spectators: []
    };

    activeMatches.set(matchId, matchData);

    // Notify both players
    mainNamespace.to(challenge.fromSocketId).emit('match-found', {
      matchId,
      opponent: {
        id: challenge.toUserId,
        name: matchData.player2.name
      },
      subject: challenge.subject,
      difficulty: challenge.difficulty,
      isFriendMatch: true
    });

    socket.emit('match-found', {
      matchId,
      opponent: {
        id: challenge.fromUserId,
        name: challenge.fromUserName
      },
      subject: challenge.subject,
      difficulty: challenge.difficulty,
      isFriendMatch: true
    });

    friendChallenges.delete(challengeId);
    console.log('Challenge accepted, match created:', matchId);
  });

  socket.on('decline-challenge', (data) => {
    const { challengeId } = data;
    const challenge = friendChallenges.get(challengeId);

    if (challenge) {
      mainNamespace.to(challenge.fromSocketId).emit('challenge-declined', {
        toUserId: challenge.toUserId
      });
      friendChallenges.delete(challengeId);
    }
  });

  // ===============================
  // MATCHMAKING EVENTS
  // ===============================

  socket.on('join-queue', (data) => {
    console.log('Player joining queue:', data.player.name, 'Subject:', data.subject);
    
    const player = {
      socketId: socket.id,
      id: data.player.id,
      name: data.player.name,
      knowledgeRating: data.player.knowledgeRating,
      subject: data.subject,
      difficulty: data.difficulty,
      joinedAt: Date.now()
    };

    // Update user activity
    const user = onlineUsers.get(data.player.id);
    if (user) {
      user.currentActivity = 'matchmaking';
      mainNamespace.emit('presence-update', {
        userId: data.player.id,
        status: 'online',
        currentActivity: 'matchmaking'
      });
    }

    // Check for matching opponent
    const matchIndex = matchmakingQueue.findIndex(p => 
      p.subject === data.subject && 
      p.difficulty === data.difficulty &&
      Math.abs(p.knowledgeRating - data.player.knowledgeRating) <= 300
    );

    if (matchIndex !== -1) {
      // Match found!
      const opponent = matchmakingQueue[matchIndex];
      matchmakingQueue.splice(matchIndex, 1);

      const matchId = `match-${Date.now()}`;
      const matchData = {
        id: matchId,
        player1: opponent,
        player2: player,
        subject: data.subject,
        difficulty: data.difficulty,
        status: 'waiting',
        player1Ready: false,
        player2Ready: false,
        currentRound: 1,
        player1Score: 0,
        player2Score: 0,
        messages: [],
        spectators: []
      };

      activeMatches.set(matchId, matchData);

      // Update activities
      const oppUser = onlineUsers.get(opponent.id);
      if (oppUser) {
        oppUser.currentActivity = 'in-match';
        mainNamespace.emit('presence-update', {
          userId: opponent.id,
          status: 'online',
          currentActivity: 'in-match'
        });
      }

      if (user) {
        user.currentActivity = 'in-match';
        mainNamespace.emit('presence-update', {
          userId: data.player.id,
          status: 'online',
          currentActivity: 'in-match'
        });
      }

      // Notify both players
      mainNamespace.to(opponent.socketId).emit('match-found', {
        matchId,
        opponent: {
          id: player.id,
          name: player.name,
          knowledgeRating: player.knowledgeRating
        },
        subject: data.subject,
        difficulty: data.difficulty
      });

      socket.emit('match-found', {
        matchId,
        opponent: {
          id: opponent.id,
          name: opponent.name,
          knowledgeRating: opponent.knowledgeRating
        },
        subject: data.subject,
        difficulty: data.difficulty
      });

      console.log('Match created:', matchId);

    } else {
      // Add to queue
      matchmakingQueue.push(player);
      socket.player = player;
    }

    // Broadcast queue status
    mainNamespace.emit('queue-status', { playersInQueue: matchmakingQueue.length });
  });

  socket.on('leave-queue', () => {
    const index = matchmakingQueue.findIndex(p => p.socketId === socket.id);
    if (index !== -1) {
      const player = matchmakingQueue[index];
      matchmakingQueue.splice(index, 1);
      
      // Update activity
      const user = onlineUsers.get(player.id);
      if (user) {
        user.currentActivity = 'browsing';
        mainNamespace.emit('presence-update', {
          userId: player.id,
          status: 'online',
          currentActivity: 'browsing'
        });
      }
      
      console.log('Player left queue:', socket.id);
      mainNamespace.emit('queue-status', { playersInQueue: matchmakingQueue.length });
    }
  });

  // ===============================
  // MATCH EVENTS
  // ===============================

  socket.on('player-ready', (data) => {
    const match = activeMatches.get(data.matchId);
    if (!match) return;

    if (match.player1.socketId === socket.id) {
      match.player1Ready = true;
      mainNamespace.to(match.player2.socketId).emit('opponent-ready');
    } else if (match.player2.socketId === socket.id) {
      match.player2Ready = true;
      mainNamespace.to(match.player1.socketId).emit('opponent-ready');
    }

    // If both ready, start match
    if (match.player1Ready && match.player2Ready) {
      match.status = 'active';
      match.startedAt = Date.now();
      
      mainNamespace.to(match.player1.socketId).emit('match-start', { matchId: data.matchId });
      mainNamespace.to(match.player2.socketId).emit('match-start', { matchId: data.matchId });
      
      // Notify spectators
      spectatorNamespace.to(`match-${data.matchId}`).emit('match-started', {
        matchId: data.matchId,
        player1: { name: match.player1.name },
        player2: { name: match.player2.name }
      });
      
      console.log('Match started:', data.matchId);
    }
  });

  socket.on('cancel-match', (data) => {
    const match = activeMatches.get(data.matchId);
    if (!match) return;

    // Notify opponent
    const opponentSocketId = match.player1.socketId === socket.id 
      ? match.player2.socketId 
      : match.player1.socketId;
    
    mainNamespace.to(opponentSocketId).emit('opponent-disconnected');
    
    // Notify spectators
    spectatorNamespace.to(`match-${data.matchId}`).emit('match-ended', {
      reason: 'Player disconnected'
    });
    
    activeMatches.delete(data.matchId);
    console.log('Match cancelled:', data.matchId);
  });

  // ===============================
  // IN-GAME EVENTS
  // ===============================

  socket.on('send-question', (data) => {
    const match = activeMatches.get(data.matchId);
    if (!match) return;

    const opponentSocketId = match.player1.socketId === socket.id 
      ? match.player2.socketId 
      : match.player1.socketId;

    mainNamespace.to(opponentSocketId).emit('question-received', {
      question: data.question,
      from: socket.id
    });

    // Broadcast to spectators
    spectatorNamespace.to(`match-${data.matchId}`).emit('question-sent', {
      question: data.question,
      fromPlayer: match.player1.socketId === socket.id ? 'player1' : 'player2'
    });

    match.messages.push({
      type: 'question',
      playerId: socket.id,
      content: data.question,
      timestamp: Date.now()
    });
  });

  socket.on('send-answer', (data) => {
    const match = activeMatches.get(data.matchId);
    if (!match) return;

    const opponentSocketId = match.player1.socketId === socket.id 
      ? match.player2.socketId 
      : match.player1.socketId;

    mainNamespace.to(opponentSocketId).emit('answer-received', {
      answer: data.answer,
      isCorrect: data.isCorrect,
      from: socket.id
    });

    // Update scores
    if (match.player1.socketId === socket.id) {
      if (data.isCorrect) match.player1Score += data.points || 15;
    } else {
      if (data.isCorrect) match.player2Score += data.points || 15;
    }

    // Broadcast scores to spectators
    spectatorNamespace.to(`match-${data.matchId}`).emit('score-update', {
      player1Score: match.player1Score,
      player2Score: match.player2Score,
      answeredBy: match.player1.socketId === socket.id ? 'player1' : 'player2',
      isCorrect: data.isCorrect
    });

    match.messages.push({
      type: 'answer',
      playerId: socket.id,
      content: data.answer,
      isCorrect: data.isCorrect,
      timestamp: Date.now()
    });
  });

  socket.on('score-update', (data) => {
    const match = activeMatches.get(data.matchId);
    if (!match) return;

    mainNamespace.to(match.player1.socketId).emit('scores-updated', {
      player1Score: match.player1Score,
      player2Score: match.player2Score
    });
    mainNamespace.to(match.player2.socketId).emit('scores-updated', {
      player1Score: match.player1Score,
      player2Score: match.player2Score
    });
  });

  socket.on('round-complete', (data) => {
    const match = activeMatches.get(data.matchId);
    if (!match) return;

    match.currentRound++;

    const roundData = {
      round: match.currentRound,
      player1Score: match.player1Score,
      player2Score: match.player2Score
    };

    mainNamespace.to(match.player1.socketId).emit('new-round', roundData);
    mainNamespace.to(match.player2.socketId).emit('new-round', roundData);
    
    // Notify spectators
    spectatorNamespace.to(`match-${data.matchId}`).emit('new-round', roundData);
  });

  socket.on('game-end', (data) => {
    const match = activeMatches.get(data.matchId);
    if (!match) return;

    match.status = 'completed';
    match.endedAt = Date.now();

    // Determine winner
    let winner = 'draw';
    if (match.player1Score > match.player2Score) winner = 'player1';
    else if (match.player2Score > match.player1Score) winner = 'player2';

    // Notify both players
    mainNamespace.to(match.player1.socketId).emit('game-ended', {
      winner,
      yourScore: match.player1Score,
      opponentScore: match.player2Score,
      youWon: winner === 'player1',
      matchId: data.matchId
    });
    mainNamespace.to(match.player2.socketId).emit('game-ended', {
      winner,
      yourScore: match.player2Score,
      opponentScore: match.player1Score,
      youWon: winner === 'player2',
      matchId: data.matchId
    });

    // Notify spectators
    spectatorNamespace.to(`match-${data.matchId}`).emit('match-ended', {
      winner,
      player1Score: match.player1Score,
      player2Score: match.player2Score,
      player1Name: match.player1.name,
      player2Name: match.player2.name
    });

    // Update user activities
    [match.player1.id, match.player2.id].forEach(id => {
      const user = onlineUsers.get(id);
      if (user) {
        user.currentActivity = 'browsing';
        mainNamespace.emit('presence-update', {
          userId: id,
          status: 'online',
          currentActivity: 'browsing'
        });
      }
    });

    console.log('Match ended:', data.matchId, 'Winner:', winner);
  });

  // ===============================
  // REMATCH SYSTEM
  // ===============================

  socket.on('request-rematch', (data) => {
    const { matchId } = data;
    const match = activeMatches.get(matchId);
    
    if (!match) {
      socket.emit('rematch-error', { message: 'Original match not found' });
      return;
    }

    const opponentSocketId = match.player1.socketId === socket.id 
      ? match.player2.socketId 
      : match.player1.socketId;

    // Check if rematch already requested
    let rematch = rematchRequests.get(matchId);
    
    if (!rematch) {
      // First rematch request
      rematch = {
        player1Requested: match.player1.socketId === socket.id,
        player2Requested: match.player2.socketId === socket.id,
        createdAt: Date.now()
      };
      rematchRequests.set(matchId, rematch);
      
      mainNamespace.to(opponentSocketId).emit('rematch-requested');
    } else {
      // Second request - both want rematch
      const newMatchId = `match-${Date.now()}`;
      const newMatch = {
        ...match,
        id: newMatchId,
        status: 'waiting',
        player1Ready: false,
        player2Ready: false,
        currentRound: 1,
        player1Score: 0,
        player2Score: 0,
        messages: [],
        spectators: []
      };
      
      activeMatches.set(newMatchId, newMatch);
      rematchRequests.delete(matchId);
      
      // Notify both players
      mainNamespace.to(match.player1.socketId).emit('match-found', {
        matchId: newMatchId,
        opponent: {
          id: match.player2.id,
          name: match.player2.name,
          knowledgeRating: match.player2.knowledgeRating
        },
        subject: match.subject,
        difficulty: match.difficulty,
        isRematch: true
      });
      
      mainNamespace.to(match.player2.socketId).emit('match-found', {
        matchId: newMatchId,
        opponent: {
          id: match.player1.id,
          name: match.player1.name,
          knowledgeRating: match.player1.knowledgeRating
        },
        subject: match.subject,
        difficulty: match.difficulty,
        isRematch: true
      });
      
      console.log('Rematch created:', newMatchId);
    }
  });

  socket.on('decline-rematch', (data) => {
    const { matchId } = data;
    const match = activeMatches.get(matchId);
    
    if (match) {
      const opponentSocketId = match.player1.socketId === socket.id 
        ? match.player2.socketId 
        : match.player1.socketId;
      
      mainNamespace.to(opponentSocketId).emit('rematch-declined');
      rematchRequests.delete(matchId);
    }
  });

  // ===============================
  // CHAT EVENTS
  // ===============================

  socket.on('join-chat', (data) => {
    socket.join(`chat-${data.userId}`);
    console.log('Player joined chat room:', data.userId);
  });

  socket.on('send-message', (data) => {
    mainNamespace.to(`chat-${data.toUserId}`).emit('chat-message', data.message);
  });

  socket.on('typing', (data) => {
    mainNamespace.to(`chat-${data.toUserId}`).emit('user-typing', {
      userId: data.userId,
      isTyping: data.isTyping
    });
  });

  // ===============================
  // RECONNECTION HANDLING
  // ===============================

  socket.on('reconnect-to-match', (data) => {
    const { matchId, userId } = data;
    const match = activeMatches.get(matchId);
    
    if (!match) {
      socket.emit('reconnect-failed', { message: 'Match no longer exists' });
      return;
    }

    // Determine which player this is
    let playerKey = null;
    if (match.player1.id === userId) {
      playerKey = 'player1';
      match.player1.socketId = socket.id;
    } else if (match.player2.id === userId) {
      playerKey = 'player2';
      match.player2.socketId = socket.id;
    }

    if (playerKey) {
      socket.emit('reconnect-success', {
        matchId,
        matchData: {
          subject: match.subject,
          difficulty: match.difficulty,
          currentRound: match.currentRound,
          player1Score: match.player1Score,
          player2Score: match.player2Score,
          yourRole: playerKey,
          opponent: playerKey === 'player1' ? match.player2 : match.player1
        }
      });
      
      // Notify opponent of reconnection
      const opponentSocketId = playerKey === 'player1' ? match.player2.socketId : match.player1.socketId;
      mainNamespace.to(opponentSocketId).emit('opponent-reconnected');
      
      console.log('Player reconnected to match:', userId, matchId);
    } else {
      socket.emit('reconnect-failed', { message: 'Not a player in this match' });
    }
  });

  // ===============================
  // DISCONNECT
  // ===============================

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);

    // Remove from queue
    const queueIndex = matchmakingQueue.findIndex(p => p.socketId === socket.id);
    if (queueIndex !== -1) {
      const player = matchmakingQueue[queueIndex];
      matchmakingQueue.splice(queueIndex, 1);
      
      // Update activity
      const user = onlineUsers.get(player.id);
      if (user) {
        user.status = 'offline';
        user.lastSeen = Date.now();
        mainNamespace.emit('presence-update', {
          userId: player.id,
          status: 'offline'
        });
      }
      
      mainNamespace.emit('queue-status', { playersInQueue: matchmakingQueue.length });
    }

    // Handle active matches
    for (const [matchId, match] of activeMatches.entries()) {
      if (match.player1.socketId === socket.id || match.player2.socketId === socket.id) {
        const opponentSocketId = match.player1.socketId === socket.id 
          ? match.player2.socketId 
          : match.player1.socketId;
        
        // Give 30 seconds to reconnect
        match.disconnectedPlayer = match.player1.socketId === socket.id ? 'player1' : 'player2';
        match.disconnectTime = Date.now();
        
        mainNamespace.to(opponentSocketId).emit('opponent-disconnected', {
          matchId,
          gracePeriod: 30000
        });
        
        // Set timeout for final disconnect
        setTimeout(() => {
          const currentMatch = activeMatches.get(matchId);
          if (currentMatch && currentMatch.disconnectedPlayer) {
            mainNamespace.to(opponentSocketId).emit('opponent-forfeited');
            activeMatches.delete(matchId);
            console.log('Match forfeited due to disconnect:', matchId);
          }
        }, 30000);
      }
    }

    // Update online status
    if (socket.userId) {
      const user = onlineUsers.get(socket.userId);
      if (user) {
        user.status = 'offline';
        user.lastSeen = Date.now();
        mainNamespace.emit('presence-update', {
          userId: socket.userId,
          status: 'offline'
        });
      }
      onlineUsers.delete(socket.userId);
    }

    playerSockets.delete(socket.id);
  });
});

// ===============================
// SPECTATOR NAMESPACE
// ===============================

spectatorNamespace.on('connection', (socket) => {
  console.log('Spectator connected:', socket.id);

  socket.on('join-match', (data) => {
    const { matchId } = data;
    const match = activeMatches.get(matchId);
    
    if (!match) {
      socket.emit('error', { message: 'Match not found' });
      return;
    }

    socket.join(`match-${matchId}`);
    socket.matchId = matchId;

    // Add to spectators
    if (!match.spectators) match.spectators = [];
    match.spectators.push(socket.id);

    // Send current match state
    socket.emit('match-state', {
      matchId,
      player1: {
        name: match.player1.name,
        score: match.player1Score
      },
      player2: {
        name: match.player2.name,
        score: match.player2Score
      },
      currentRound: match.currentRound,
      status: match.status,
      subject: match.subject
    });

    // Notify players of new spectator count
    const spectatorCount = match.spectators.length;
    mainNamespace.to(match.player1.socketId).emit('spectator-count', spectatorCount);
    mainNamespace.to(match.player2.socketId).emit('spectator-count', spectatorCount);

    console.log('Spectator joined match:', matchId);
  });

  socket.on('leave-match', (data) => {
    const matchId = data.matchId || socket.matchId;
    const match = activeMatches.get(matchId);
    
    if (match && match.spectators) {
      match.spectators = match.spectators.filter(id => id !== socket.id);
      
      // Notify players
      const spectatorCount = match.spectators.length;
      mainNamespace.to(match.player1.socketId).emit('spectator-count', spectatorCount);
      mainNamespace.to(match.player2.socketId).emit('spectator-count', spectatorCount);
    }
    
    socket.leave(`match-${matchId}`);
  });

  socket.on('disconnect', () => {
    if (socket.matchId) {
      const match = activeMatches.get(socket.matchId);
      if (match && match.spectators) {
        match.spectators = match.spectators.filter(id => id !== socket.id);
        
        // Notify players
        const spectatorCount = match.spectators.length;
        mainNamespace.to(match.player1.socketId).emit('spectator-count', spectatorCount);
        mainNamespace.to(match.player2.socketId).emit('spectator-count', spectatorCount);
      }
    }
    console.log('Spectator disconnected:', socket.id);
  });
});

// ===============================
// TOURNAMENT NAMESPACE
// ===============================

tournamentNamespace.on('connection', (socket) => {
  console.log('Tournament connection:', socket.id);

  socket.on('join-tournament', (data) => {
    const { tournamentId, userId, userName } = data;
    socket.join(`tournament-${tournamentId}`);
    socket.tournamentId = tournamentId;
    socket.userId = userId;
    
    // Initialize tournament if needed
    if (!tournaments.has(tournamentId)) {
      tournaments.set(tournamentId, {
        id: tournamentId,
        participants: [],
        bracket: [],
        matches: [],
        status: 'waiting'
      });
    }
    
    const tournament = tournaments.get(tournamentId);
    tournament.participants.push({ userId, userName, socketId: socket.id });
    
    // Broadcast updated participant list
    tournamentNamespace.to(`tournament-${tournamentId}`).emit('participants-update', {
      participants: tournament.participants.map(p => ({
        id: p.userId,
        name: p.userName
      }))
    });
    
    console.log('User joined tournament:', userName, tournamentId);
  });

  socket.on('start-tournament', (data) => {
    const { tournamentId } = data;
    const tournament = tournaments.get(tournamentId);
    
    if (tournament && tournament.participants.length >= 2) {
      tournament.status = 'active';
      tournament.bracket = generateBracket(tournament.participants);
      
      tournamentNamespace.to(`tournament-${tournamentId}`).emit('tournament-started', {
        bracket: tournament.bracket
      });
      
      console.log('Tournament started:', tournamentId);
    }
  });

  socket.on('get-bracket', (data) => {
    const { tournamentId } = data;
    const tournament = tournaments.get(tournamentId);
    
    if (tournament) {
      socket.emit('bracket-update', {
        bracket: tournament.bracket,
        status: tournament.status
      });
    }
  });

  socket.on('report-match-result', (data) => {
    const { tournamentId, matchId, winnerId } = data;
    const tournament = tournaments.get(tournamentId);
    
    if (tournament) {
      // Update bracket with result
      const match = tournament.bracket.flat().find(m => m.id === matchId);
      if (match) {
        match.winner = winnerId;
        match.status = 'completed';
        
        // Broadcast updated bracket
        tournamentNamespace.to(`tournament-${tournamentId}`).emit('bracket-update', {
          bracket: tournament.bracket,
          status: tournament.status
        });
      }
    }
  });

  socket.on('leave-tournament', (data) => {
    const { tournamentId, userId } = data;
    const tournament = tournaments.get(tournamentId);
    
    if (tournament) {
      tournament.participants = tournament.participants.filter(p => p.userId !== userId);
      
      tournamentNamespace.to(`tournament-${tournamentId}`).emit('participants-update', {
        participants: tournament.participants.map(p => ({
          id: p.userId,
          name: p.userName
        }))
      });
    }
    
    socket.leave(`tournament-${tournamentId}`);
  });

  socket.on('disconnect', () => {
    console.log('Tournament disconnect:', socket.id);
  });
});

// ===============================
// HELPER FUNCTIONS
// ===============================

function generateBracket(participants) {
  const numParticipants = participants.length;
  const rounds = Math.ceil(Math.log2(numParticipants));
  const bracket = [];
  
  // First round
  const firstRound = [];
  for (let i = 0; i < numParticipants; i += 2) {
    firstRound.push({
      id: `match-r1-${i/2}`,
      player1: participants[i],
      player2: participants[i + 1] || null,
      winner: null,
      status: 'pending'
    });
  }
  bracket.push(firstRound);
  
  // Subsequent rounds (empty)
  let currentSize = Math.ceil(numParticipants / 2);
  for (let r = 1; r < rounds; r++) {
    const round = [];
    for (let i = 0; i < currentSize; i += 2) {
      round.push({
        id: `match-r${r+1}-${i/2}`,
        player1: null,
        player2: null,
        winner: null,
        status: 'pending'
      });
    }
    bracket.push(round);
    currentSize = Math.ceil(currentSize / 2);
  }
  
  return bracket;
}

// ===============================
// HEALTH CHECK & STATS
// ===============================

setInterval(() => {
  console.log('📊 Server Stats:', {
    onlineUsers: onlineUsers.size,
    activeMatches: activeMatches.size,
    playersInQueue: matchmakingQueue.length,
    tournaments: tournaments.size
  });
}, 60000);
