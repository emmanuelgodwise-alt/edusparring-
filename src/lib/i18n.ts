// Internationalization (i18n) Manager for EduSparring
// Supports 7 languages: English, Spanish, French, Chinese, Arabic, Hindi, Portuguese

export const LANGUAGES = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳', dir: 'ltr' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', dir: 'ltr' },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

// Country configurations
export const COUNTRIES: Record<string, { name: string; flag: string; language: LanguageCode }> = {
  US: { name: 'United States', flag: '🇺🇸', language: 'en' },
  GB: { name: 'United Kingdom', flag: '🇬🇧', language: 'en' },
  ES: { name: 'Spain', flag: '🇪🇸', language: 'es' },
  MX: { name: 'Mexico', flag: '🇲🇽', language: 'es' },
  FR: { name: 'France', flag: '🇫🇷', language: 'fr' },
  CN: { name: 'China', flag: '🇨🇳', language: 'zh' },
  TW: { name: 'Taiwan', flag: '🇹🇼', language: 'zh' },
  SA: { name: 'Saudi Arabia', flag: '🇸🇦', language: 'ar' },
  AE: { name: 'UAE', flag: '🇦🇪', language: 'ar' },
  IN: { name: 'India', flag: '🇮🇳', language: 'hi' },
  BR: { name: 'Brazil', flag: '🇧🇷', language: 'pt' },
  PT: { name: 'Portugal', flag: '🇵🇹', language: 'pt' },
  DE: { name: 'Germany', flag: '🇩🇪', language: 'en' },
  JP: { name: 'Japan', flag: '🇯🇵', language: 'en' },
  KR: { name: 'South Korea', flag: '🇰🇷', language: 'en' },
  RU: { name: 'Russia', flag: '🇷🇺', language: 'en' },
};

// Translations
export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Common
    'common.play': 'Play',
    'common.settings': 'Settings',
    'common.back': 'Back',
    'common.search': 'Search',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Navigation
    'nav.battle': 'Battle',
    'nav.stats': 'Stats',
    'nav.ranks': 'Ranks',
    'nav.profile': 'Profile',
    
    // Sparring
    'sparring.title': 'Knowledge Sparring',
    'sparring.vsBot': 'Play vs Bot',
    'sparring.vsPlayer': 'Play vs Player',
    'sparring.chooseSubject': 'Choose Your Subject',
    'sparring.selectDifficulty': 'Select Difficulty',
    'sparring.startSparring': 'Start Sparring',
    'sparring.round': 'Round',
    'sparring.of': 'of',
    'sparring.ptsCorrect': 'pts/correct',
    'sparring.yourTurn': 'Your turn to ask',
    'sparring.selectAnswer': 'Select your answer',
    'sparring.askQuestion': 'Ask a question',
    'sparring.quickQuestions': 'Quick Questions',
    'sparring.questionsRemaining': 'questions remaining',
    'sparring.showMore': 'Show more',
    'sparring.youWin': 'You Win!',
    'sparring.botWins': 'Bot Wins!',
    'sparring.draw': "It's a Draw!",
    'sparring.finalScore': 'Final',
    'sparring.playAgain': 'Play Again',
    
    // How it works
    'howToPlay.title': 'How Sparring Works',
    'howToPlay.step1': 'You Ask: Type a question. If the opponent answers correctly, they score points!',
    'howToPlay.step2': "They Ask: Answer the question. If you're correct, you score!",
    'howToPlay.step3': 'Learn: Wrong answers get coaching explanations!',
    
    // Difficulty
    'difficulty.easy': 'Easy',
    'difficulty.medium': 'Medium',
    'difficulty.hard': 'Hard',
    
    // Social
    'social.title': 'Social Hub',
    'social.friends': 'Friends',
    'social.chat': 'Chat',
    'social.feed': 'Feed',
    'social.badges': 'Badges',
    'social.friendsOnline': 'friends online',
    'social.friendRequests': 'Friend Requests',
    'social.searchPlayers': 'Search players...',
    'social.typeMessage': 'Type a message...',
    'social.selectFriend': 'Select a friend to start chatting',
    
    // Leaderboard
    'leaderboard.title': 'Global Leaderboard',
    'leaderboard.filterByCountry': 'Filter by Country',
    'leaderboard.allCountries': 'All Countries',
    'leaderboard.rank': 'Rank',
    'leaderboard.player': 'Player',
    'leaderboard.rating': 'Rating',
    'leaderboard.wins': 'Wins',
    
    // Profile
    'profile.knowledgeRating': 'Knowledge Rating',
    'profile.wins': 'Wins',
    'profile.losses': 'Losses',
    'profile.streak': 'Streak',
    'profile.country': 'Country',
    'profile.language': 'Language',
  },
  
  es: {
    'common.play': 'Jugar',
    'common.settings': 'Configuración',
    'common.back': 'Atrás',
    'common.search': 'Buscar',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.save': 'Guardar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    
    'nav.battle': 'Batalla',
    'nav.stats': 'Estadísticas',
    'nav.ranks': 'Rangos',
    'nav.profile': 'Perfil',
    
    'sparring.title': 'Combate de Conocimiento',
    'sparring.vsBot': 'Jugar vs Bot',
    'sparring.vsPlayer': 'Jugar vs Jugador',
    'sparring.chooseSubject': 'Elige Tu Materia',
    'sparring.selectDifficulty': 'Selecciona Dificultad',
    'sparring.startSparring': 'Iniciar Combate',
    'sparring.round': 'Ronda',
    'sparring.of': 'de',
    'sparring.ptsCorrect': 'pts/correcta',
    'sparring.yourTurn': 'Tu turno para preguntar',
    'sparring.selectAnswer': 'Selecciona tu respuesta',
    'sparring.askQuestion': 'Haz una pregunta',
    'sparring.quickQuestions': 'Preguntas Rápidas',
    'sparring.questionsRemaining': 'preguntas restantes',
    'sparring.showMore': 'Mostrar más',
    'sparring.youWin': '¡Ganaste!',
    'sparring.botWins': '¡Bot Gana!',
    'sparring.draw': '¡Empate!',
    'sparring.finalScore': 'Final',
    'sparring.playAgain': 'Jugar de Nuevo',
    
    'howToPlay.title': 'Cómo Funciona el Combate',
    'howToPlay.step1': 'Tú Preguntas: Escribe una pregunta. Si el oponente responde correctamente, ¡gana puntos!',
    'howToPlay.step2': 'Ellos Preguntan: Responde la pregunta. Si aciertas, ¡puntuas!',
    'howToPlay.step3': 'Aprende: ¡Las respuestas incorrectas reciben explicaciones!',
    
    'difficulty.easy': 'Fácil',
    'difficulty.medium': 'Medio',
    'difficulty.hard': 'Difícil',
    
    'social.title': 'Centro Social',
    'social.friends': 'Amigos',
    'social.chat': 'Chat',
    'social.feed': 'Feed',
    'social.badges': 'Insignias',
    'social.friendsOnline': 'amigos en línea',
    'social.friendRequests': 'Solicitudes de Amistad',
    'social.searchPlayers': 'Buscar jugadores...',
    'social.typeMessage': 'Escribe un mensaje...',
    'social.selectFriend': 'Selecciona un amigo para chatear',
    
    'leaderboard.title': 'Clasificación Global',
    'leaderboard.filterByCountry': 'Filtrar por País',
    'leaderboard.allCountries': 'Todos los Países',
    'leaderboard.rank': 'Rango',
    'leaderboard.player': 'Jugador',
    'leaderboard.rating': 'Puntuación',
    'leaderboard.wins': 'Victorias',
    
    'profile.knowledgeRating': 'Clasificación de Conocimiento',
    'profile.wins': 'Victorias',
    'profile.losses': 'Derrotas',
    'profile.streak': 'Racha',
    'profile.country': 'País',
    'profile.language': 'Idioma',
  },
  
  fr: {
    'common.play': 'Jouer',
    'common.settings': 'Paramètres',
    'common.back': 'Retour',
    'common.search': 'Rechercher',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.save': 'Sauvegarder',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    
    'sparring.title': 'Combat de Connaissances',
    'sparring.vsBot': 'Jouer vs Bot',
    'sparring.vsPlayer': 'Jouer vs Joueur',
    'sparring.chooseSubject': 'Choisissez Votre Matière',
    'sparring.selectDifficulty': 'Sélectionnez la Difficulté',
    'sparring.startSparring': 'Commencer le Combat',
    'sparring.youWin': 'Vous Gagnez!',
    'sparring.botWins': 'Bot Gagne!',
    'sparring.draw': 'Match Nul!',
    'sparring.playAgain': 'Rejouer',
    
    'difficulty.easy': 'Facile',
    'difficulty.medium': 'Moyen',
    'difficulty.hard': 'Difficile',
    
    'social.title': 'Centre Social',
    'social.friends': 'Amis',
    'social.chat': 'Chat',
    'social.feed': 'Fil',
    'social.badges': 'Badges',
  },
  
  zh: {
    'common.play': '开始',
    'common.settings': '设置',
    'common.back': '返回',
    'common.search': '搜索',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.save': '保存',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    
    'sparring.title': '知识对战',
    'sparring.vsBot': '对战机器人',
    'sparring.vsPlayer': '对战玩家',
    'sparring.chooseSubject': '选择科目',
    'sparring.selectDifficulty': '选择难度',
    'sparring.startSparring': '开始对战',
    'sparring.round': '回合',
    'sparring.of': '/',
    'sparring.ptsCorrect': '分/正确',
    'sparring.yourTurn': '轮到你提问',
    'sparring.selectAnswer': '选择你的答案',
    'sparring.askQuestion': '提问一个问题',
    'sparring.quickQuestions': '快速提问',
    'sparring.questionsRemaining': '个问题剩余',
    'sparring.showMore': '显示更多',
    'sparring.youWin': '你赢了！',
    'sparring.botWins': '机器人获胜！',
    'sparring.draw': '平局！',
    'sparring.finalScore': '最终',
    'sparring.playAgain': '再玩一次',
    
    'howToPlay.title': '对战规则',
    'howToPlay.step1': '你提问：输入一个问题。如果对手回答正确，他们得分！',
    'howToPlay.step2': '对手提问：回答问题。如果正确，你得分！',
    'howToPlay.step3': '学习：错误答案会得到指导解释！',
    
    'difficulty.easy': '简单',
    'difficulty.medium': '中等',
    'difficulty.hard': '困难',
    
    'social.title': '社交中心',
    'social.friends': '好友',
    'social.chat': '聊天',
    'social.feed': '动态',
    'social.badges': '徽章',
    'social.friendsOnline': '位好友在线',
    
    'leaderboard.title': '全球排行榜',
    'leaderboard.filterByCountry': '按国家筛选',
    'leaderboard.allCountries': '所有国家',
    'leaderboard.rank': '排名',
    'leaderboard.player': '玩家',
    'leaderboard.rating': '积分',
    'leaderboard.wins': '胜场',
    
    'profile.knowledgeRating': '知识积分',
    'profile.wins': '胜场',
    'profile.losses': '负场',
    'profile.streak': '连胜',
    'profile.country': '国家',
    'profile.language': '语言',
  },
  
  ar: {
    'common.play': 'العب',
    'common.settings': 'الإعدادات',
    'common.back': 'رجوع',
    'common.search': 'بحث',
    'common.cancel': 'إلغاء',
    'common.confirm': 'تأكيد',
    'common.save': 'حفظ',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجاح',
    
    'sparring.title': 'مباراة المعرفة',
    'sparring.vsBot': 'العب ضد الروبوت',
    'sparring.vsPlayer': 'العب ضد لاعب',
    'sparring.chooseSubject': 'اختر مادتك',
    'sparring.selectDifficulty': 'اختر الصعوبة',
    'sparring.startSparring': 'ابدأ المباراة',
    'sparring.youWin': 'فزت!',
    'sparring.botWins': 'الروبوت يفوز!',
    'sparring.draw': 'تعادل!',
    'sparring.playAgain': 'العب مرة أخرى',
    
    'difficulty.easy': 'سهل',
    'difficulty.medium': 'متوسط',
    'difficulty.hard': 'صعب',
    
    'social.title': 'المركز الاجتماعي',
    'social.friends': 'أصدقاء',
    'social.chat': 'محادثة',
    'social.feed': 'الأخبار',
    'social.badges': 'شارات',
  },
  
  hi: {
    'common.play': 'खेलें',
    'common.settings': 'सेटिंग्स',
    'common.back': 'वापस',
    'common.search': 'खोजें',
    'common.cancel': 'रद्द करें',
    'common.confirm': 'पुष्टि करें',
    'common.save': 'सेव करें',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफल',
    
    'sparring.title': 'ज्ञान स्पैरिंग',
    'sparring.vsBot': 'बॉट के साथ खेलें',
    'sparring.vsPlayer': 'खिलाड़ी के साथ खेलें',
    'sparring.chooseSubject': 'अपना विषय चुनें',
    'sparring.selectDifficulty': 'कठिनाई चुनें',
    'sparring.startSparring': 'स्पैरिंग शुरू करें',
    'sparring.youWin': 'आप जीते!',
    'sparring.botWins': 'बॉट जीता!',
    'sparring.draw': 'ड्रॉ!',
    'sparring.playAgain': 'फिर से खेलें',
    
    'difficulty.easy': 'आसान',
    'difficulty.medium': 'मध्यम',
    'difficulty.hard': 'कठिन',
    
    'social.title': 'सामाजिक केंद्र',
    'social.friends': 'दोस्त',
    'social.chat': 'चैट',
    'social.feed': 'फीड',
    'social.badges': 'बैज',
  },
  
  pt: {
    'common.play': 'Jogar',
    'common.settings': 'Configurações',
    'common.back': 'Voltar',
    'common.search': 'Pesquisar',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.save': 'Salvar',
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    
    'sparring.title': 'Combate de Conhecimento',
    'sparring.vsBot': 'Jogar vs Bot',
    'sparring.vsPlayer': 'Jogar vs Jogador',
    'sparring.chooseSubject': 'Escolha Sua Matéria',
    'sparring.selectDifficulty': 'Selecione a Dificuldade',
    'sparring.startSparring': 'Iniciar Combate',
    'sparring.youWin': 'Você Venceu!',
    'sparring.botWins': 'Bot Vence!',
    'sparring.draw': 'Empate!',
    'sparring.playAgain': 'Jogar Novamente',
    
    'difficulty.easy': 'Fácil',
    'difficulty.medium': 'Médio',
    'difficulty.hard': 'Difícil',
    
    'social.title': 'Centro Social',
    'social.friends': 'Amigos',
    'social.chat': 'Chat',
    'social.feed': 'Feed',
    'social.badges': 'Emblemas',
  },
};

// Get translation
export function t(key: string, lang: LanguageCode = 'en'): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}

// Detect browser language
export function detectBrowserLanguage(): LanguageCode {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.split('-')[0];
  if (browserLang in LANGUAGES) {
    return browserLang as LanguageCode;
  }
  return 'en';
}

// Format number by locale
export function formatNumber(num: number, lang: LanguageCode = 'en'): string {
  const localeMap: Record<LanguageCode, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    zh: 'zh-CN',
    ar: 'ar-SA',
    hi: 'hi-IN',
    pt: 'pt-BR',
  };
  
  return new Intl.NumberFormat(localeMap[lang]).format(num);
}

// Format date by locale
export function formatDate(date: Date, lang: LanguageCode = 'en'): string {
  const localeMap: Record<LanguageCode, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    zh: 'zh-CN',
    ar: 'ar-SA',
    hi: 'hi-IN',
    pt: 'pt-BR',
  };
  
  return new Intl.DateTimeFormat(localeMap[lang], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// Check if language is RTL
export function isRTL(lang: LanguageCode): boolean {
  return LANGUAGES[lang]?.dir === 'rtl';
}

// Get language info
export function getLanguageInfo(lang: LanguageCode) {
  return LANGUAGES[lang] || LANGUAGES.en;
}

// Get all languages
export function getAllLanguages() {
  return Object.entries(LANGUAGES).map(([code, info]) => ({
    code: code as LanguageCode,
    ...info
  }));
}

// Get all countries
export function getAllCountries() {
  return Object.entries(COUNTRIES).map(([code, info]) => ({
    code,
    ...info
  }));
}

// Get country flag by country code
export function getCountryFlag(countryCode: string): string {
  const country = COUNTRIES[countryCode];
  return country?.flag || '🌍';
}

// Load translation (alias for getting translations)
export function loadTranslation(lang: LanguageCode): Record<string, string> {
  return translations[lang] || translations.en;
}
