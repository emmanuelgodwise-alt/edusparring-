import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create achievements
  const achievements = [
    {
      name: 'First Blood',
      description: 'Win your first battle',
      icon: '⚔️',
      category: 'battle',
      requirement: 'Win 1 match',
      rarity: 'common'
    },
    {
      name: 'Winning Streak',
      description: 'Win 5 matches in a row',
      icon: '🔥',
      category: 'battle',
      requirement: 'Win 5 consecutive matches',
      rarity: 'rare'
    },
    {
      name: 'Unstoppable',
      description: 'Win 10 matches in a row',
      icon: '💪',
      category: 'battle',
      requirement: 'Win 10 consecutive matches',
      rarity: 'epic'
    },
    {
      name: 'Legend',
      description: 'Win 50 matches total',
      icon: '👑',
      category: 'battle',
      requirement: 'Win 50 matches',
      rarity: 'legendary'
    },
    {
      name: 'Quick Learner',
      description: 'Answer 10 questions correctly',
      icon: '📚',
      category: 'learning',
      requirement: 'Answer 10 questions correctly',
      rarity: 'common'
    },
    {
      name: 'Knowledge Seeker',
      description: 'Answer 50 questions correctly',
      icon: '🎓',
      category: 'learning',
      requirement: 'Answer 50 questions correctly',
      rarity: 'rare'
    },
    {
      name: 'Brain Master',
      description: 'Answer 100 questions correctly',
      icon: '🧠',
      category: 'learning',
      requirement: 'Answer 100 questions correctly',
      rarity: 'epic'
    },
    {
      name: 'Perfect Score',
      description: 'Get all questions correct in a match',
      icon: '💯',
      category: 'battle',
      requirement: 'Answer all questions correctly in a single match',
      rarity: 'rare'
    },
    {
      name: 'Speed Demon',
      description: 'Answer a question in under 3 seconds',
      icon: '⚡',
      category: 'battle',
      requirement: 'Answer correctly in under 3 seconds',
      rarity: 'rare'
    },
    {
      name: 'Social Butterfly',
      description: 'Add 5 friends',
      icon: '🦋',
      category: 'social',
      requirement: 'Add 5 friends',
      rarity: 'common'
    },
    {
      name: 'Rising Star',
      description: 'Reach 1000 Knowledge Rating',
      icon: '⭐',
      category: 'special',
      requirement: 'Reach KR 1000',
      rarity: 'rare'
    },
    {
      name: 'Elite Scholar',
      description: 'Reach 1600 Knowledge Rating',
      icon: '🏆',
      category: 'special',
      requirement: 'Reach KR 1600',
      rarity: 'epic'
    },
    {
      name: 'Grandmaster',
      description: 'Reach 2000 Knowledge Rating',
      icon: '🏅',
      category: 'special',
      requirement: 'Reach KR 2000',
      rarity: 'legendary'
    },
    {
      name: 'Math Champion',
      description: 'Win 20 Math battles',
      icon: '📐',
      category: 'battle',
      requirement: 'Win 20 Math matches',
      rarity: 'rare'
    },
    {
      name: 'Science Wizard',
      description: 'Win 20 Science battles',
      icon: '🔬',
      category: 'battle',
      requirement: 'Win 20 Science matches',
      rarity: 'rare'
    }
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: achievement,
      create: achievement
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
