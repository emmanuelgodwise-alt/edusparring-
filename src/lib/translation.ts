// Translation Service for EduSparring
// Provides real-time translation using AI for multilingual communication

// Supported languages with their names and flags
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
  ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', rtl: false },
  ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false },
  nl: { name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', rtl: false },
  tr: { name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', rtl: false },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', rtl: false },
  th: { name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', rtl: false },
  id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', rtl: false },
  ms: { name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', rtl: false },
  sw: { name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', rtl: false },
  la: { name: 'Latin', nativeName: 'Latina', flag: '🏛️', rtl: false },
  el: { name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', rtl: false },
  he: { name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true },
  pl: { name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', rtl: false },
  uk: { name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', rtl: false },
  fa: { name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', rtl: true },
  bn: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', rtl: false },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇱🇰', rtl: false },
  ur: { name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true },
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Language pair for chat translation
export interface LanguagePair {
  myLanguage: LanguageCode;
  theirLanguage: LanguageCode;
}

// Translation result
export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  confidence: number;
  detectedLanguage?: LanguageCode;
}

// Get language info
export function getLanguageInfo(code: LanguageCode) {
  return SUPPORTED_LANGUAGES[code] || SUPPORTED_LANGUAGES.en;
}

// Get all languages as array
export function getAllLanguages() {
  return Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => ({
    code: code as LanguageCode,
    ...info
  }));
}

// Detect language from text (simple heuristic)
export function detectLanguage(text: string): LanguageCode {
  // Simple character-based detection
  const patterns: Record<string, RegExp> = {
    zh: /[\u4e00-\u9fff]/,
    ja: /[\u3040-\u309f\u30a0-\u30ff]/,
    ko: /[\uac00-\ud7af]/,
    ar: /[\u0600-\u06ff]/,
    he: /[\u0590-\u05ff]/,
    hi: /[\u0900-\u097f]/,
    ru: /[\u0400-\u04ff]/,
    th: /[\u0e00-\u0e7f]/,
    el: /[\u0370-\u03ff]/,
    fa: /[\u0600-\u06ff]/,
    bn: /[\u0980-\u09ff]/,
    ta: /[\u0b80-\u0bff]/,
    ur: /[\u0600-\u06ff]/,
  };

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) {
      return lang as LanguageCode;
    }
  }

  // Default to English for Latin script
  return 'en';
}

// Check if language is RTL
export function isRTL(language: LanguageCode): boolean {
  return SUPPORTED_LANGUAGES[language]?.rtl || false;
}

// Get language flag emoji
export function getLanguageFlag(language: LanguageCode): string {
  return SUPPORTED_LANGUAGES[language]?.flag || '🌐';
}

// Get language native name
export function getLanguageNativeName(language: LanguageCode): string {
  return SUPPORTED_LANGUAGES[language]?.nativeName || language.toUpperCase();
}

// Common phrases for each language (for quick translation reference)
export const COMMON_PHRASES: Record<LanguageCode, Record<string, string>> = {
  en: {
    hello: 'Hello!',
    howAreYou: 'How are you?',
    niceToMeetYou: 'Nice to meet you!',
    thankYou: 'Thank you!',
    goodbye: 'Goodbye!',
    yes: 'Yes',
    no: 'No',
    please: 'Please',
    sorry: 'Sorry',
    iUnderstand: 'I understand',
    iDontUnderstand: "I don't understand",
    canYouHelp: 'Can you help me?',
    whatIsThis: 'What is this?',
  },
  es: {
    hello: '¡Hola!',
    howAreYou: '¿Cómo estás?',
    niceToMeetYou: '¡Mucho gusto!',
    thankYou: '¡Gracias!',
    goodbye: '¡Adiós!',
    yes: 'Sí',
    no: 'No',
    please: 'Por favor',
    sorry: 'Lo siento',
    iUnderstand: 'Entiendo',
    iDontUnderstand: 'No entiendo',
    canYouHelp: '¿Puedes ayudarme?',
    whatIsThis: '¿Qué es esto?',
  },
  fr: {
    hello: 'Bonjour!',
    howAreYou: 'Comment allez-vous?',
    niceToMeetYou: 'Enchanté!',
    thankYou: 'Merci!',
    goodbye: 'Au revoir!',
    yes: 'Oui',
    no: 'Non',
    please: 'S\'il vous plaît',
    sorry: 'Désolé',
    iUnderstand: 'Je comprends',
    iDontUnderstand: 'Je ne comprends pas',
    canYouHelp: 'Pouvez-vous m\'aider?',
    whatIsThis: 'Qu\'est-ce que c\'est?',
  },
  zh: {
    hello: '你好!',
    howAreYou: '你好吗?',
    niceToMeetYou: '很高兴认识你!',
    thankYou: '谢谢!',
    goodbye: '再见!',
    yes: '是',
    no: '不',
    please: '请',
    sorry: '对不起',
    iUnderstand: '我明白了',
    iDontUnderstand: '我不明白',
    canYouHelp: '你能帮我吗?',
    whatIsThis: '这是什么?',
  },
  ja: {
    hello: 'こんにちは!',
    howAreYou: 'お元気ですか?',
    niceToMeetYou: 'はじめまして!',
    thankYou: 'ありがとう!',
    goodbye: 'さようなら!',
    yes: 'はい',
    no: 'いいえ',
    please: 'お願いします',
    sorry: 'ごめんなさい',
    iUnderstand: 'わかりました',
    iDontUnderstand: 'わかりません',
    canYouHelp: '手伝ってくれますか?',
    whatIsThis: 'これは何ですか?',
  },
  ko: {
    hello: '안녕하세요!',
    howAreYou: '어떻게 지내세요?',
    niceToMeetYou: '만나서 반갑습니다!',
    thankYou: '감사합니다!',
    goodbye: '안녕히 가세요!',
    yes: '네',
    no: '아니요',
    please: '부탁드립니다',
    sorry: '죄송합니다',
    iUnderstand: '이해했습니다',
    iDontUnderstand: '이해하지 못했습니다',
    canYouHelp: '도와주시겠어요?',
    whatIsThis: '이것은 무엇인가요?',
  },
  // Add more languages as needed...
  de: { hello: 'Hallo!', howAreYou: 'Wie geht es Ihnen?', niceToMeetYou: 'Freut mich!', thankYou: 'Danke!', goodbye: 'Auf Wiedersehen!', yes: 'Ja', no: 'Nein', please: 'Bitte', sorry: 'Entschuldigung', iUnderstand: 'Ich verstehe', iDontUnderstand: 'Ich verstehe nicht', canYouHelp: 'Können Sie mir helfen?', whatIsThis: 'Was ist das?' },
  pt: { hello: 'Olá!', howAreYou: 'Como você está?', niceToMeetYou: 'Prazer em conhecê-lo!', thankYou: 'Obrigado!', goodbye: 'Adeus!', yes: 'Sim', no: 'Não', please: 'Por favor', sorry: 'Desculpe', iUnderstand: 'Eu entendo', iDontUnderstand: 'Eu não entendo', canYouHelp: 'Você pode me ajudar?', whatIsThis: 'O que é isto?' },
  ru: { hello: 'Привет!', howAreYou: 'Как дела?', niceToMeetYou: 'Приятно познакомиться!', thankYou: 'Спасибо!', goodbye: 'До свидания!', yes: 'Да', no: 'Нет', please: 'Пожалуйста', sorry: 'Извините', iUnderstand: 'Я понимаю', iDontUnderstand: 'Я не понимаю', canYouHelp: 'Вы можете мне помочь?', whatIsThis: 'Что это?' },
  ar: { hello: 'مرحبا!', howAreYou: 'كيف حالك؟', niceToMeetYou: 'تشرفت بلقائك!', thankYou: 'شكرا!', goodbye: 'مع السلامة!', yes: 'نعم', no: 'لا', please: 'من فضلك', sorry: 'آسف', iUnderstand: 'أفهم', iDontUnderstand: 'لا أفهم', canYouHelp: 'هل يمكنك مساعدتي؟', whatIsThis: 'ما هذا؟' },
  hi: { hello: 'नमस्ते!', howAreYou: 'आप कैसे हैं?', niceToMeetYou: 'आपसे मिलकर खुशी हुई!', thankYou: 'धन्यवाद!', goodbye: 'अलविदा!', yes: 'हाँ', no: 'नहीं', please: 'कृपया', sorry: 'माफ़ करना', iUnderstand: 'मैं समझता हूँ', iDontUnderstand: 'मैं नहीं समझता', canYouHelp: 'क्या आप मेरी मदद कर सकते हैं?', whatIsThis: 'यह क्या है?' },
  it: { hello: 'Ciao!', howAreYou: 'Come stai?', niceToMeetYou: 'Piacere!', thankYou: 'Grazie!', goodbye: 'Arrivederci!', yes: 'Sì', no: 'No', please: 'Per favore', sorry: 'Scusa', iUnderstand: 'Capisco', iDontUnderstand: 'Non capisco', canYouHelp: 'Puoi aiutarmi?', whatIsThis: 'Cos\'è questo?' },
  nl: { hello: 'Hallo!', howAreYou: 'Hoe gaat het?', niceToMeetYou: 'Aangenaam!', thankYou: 'Dank je!', goodbye: 'Tot ziens!', yes: 'Ja', no: 'Nee', please: 'Alsjeblieft', sorry: 'Sorry', iUnderstand: 'Ik begrijp het', iDontUnderstand: 'Ik begrijp het niet', canYouHelp: 'Kun je me helpen?', whatIsThis: 'Wat is dit?' },
  tr: { hello: 'Merhaba!', howAreYou: 'Nasılsınız?', niceToMeetYou: 'Tanıştığımıza memnun oldum!', thankYou: 'Teşekkürler!', goodbye: 'Hoşça kalın!', yes: 'Evet', no: 'Hayır', please: 'Lütfen', sorry: 'Özür dilerim', iUnderstand: 'Anlıyorum', iDontUnderstand: 'Anlamıyorum', canYouHelp: 'Bana yardım edebilir misiniz?', whatIsThis: 'Bu nedir?' },
  vi: { hello: 'Xin chào!', howAreYou: 'Bạn khỏe không?', niceToMeetYou: 'Rất vui được gặp bạn!', thankYou: 'Cảm ơn!', goodbye: 'Tạm biệt!', yes: 'Có', no: 'Không', please: 'Làm ơn', sorry: 'Xin lỗi', iUnderstand: 'Tôi hiểu', iDontUnderstand: 'Tôi không hiểu', canYouHelp: 'Bạn có thể giúp tôi không?', whatIsThis: 'Đây là cái gì?' },
  th: { hello: 'สวัสดี!', howAreYou: 'คุณเป็นอย่างไร?', niceToMeetYou: 'ยินดีที่ได้รู้จัก!', thankYou: 'ขอบคุณ!', goodbye: 'ลาก่อน!', yes: 'ใช่', no: 'ไม่', please: 'กรุณา', sorry: 'ขอโทษ', iUnderstand: 'ฉันเข้าใจ', iDontUnderstand: 'ฉันไม่เข้าใจ', canYouHelp: 'คุณช่วยฉันได้ไหม?', whatIsThis: 'นี่คืออะไร?' },
  id: { hello: 'Halo!', howAreYou: 'Apa kabar?', niceToMeetYou: 'Senang bertemu dengan Anda!', thankYou: 'Terima kasih!', goodbye: 'Selamat tinggal!', yes: 'Ya', no: 'Tidak', please: 'Tolong', sorry: 'Maaf', iUnderstand: 'Saya mengerti', iDontUnderstand: 'Saya tidak mengerti', canYouHelp: 'Bisakah Anda membantu saya?', whatIsThis: 'Ini apa?' },
  ms: { hello: 'Helo!', howAreYou: 'Apa khabar?', niceToMeetYou: 'Seronok bertemu dengan anda!', thankYou: 'Terima kasih!', goodbye: 'Selamat tinggal!', yes: 'Ya', no: 'Tidak', please: 'Sila', sorry: 'Maaf', iUnderstand: 'Saya faham', iDontUnderstand: 'Saya tidak faham', canYouHelp: 'Boleh anda tolong saya?', whatIsThis: 'Ini apa?' },
  sw: { hello: 'Hujambo!', howAreYou: 'Habari yako?', niceToMeetYou: 'Ninafurahi kukutana nawe!', thankYou: 'Asante!', goodbye: 'Kwaheri!', yes: 'Ndio', no: 'Hapana', please: 'Tafadhali', sorry: 'Samahani', iUnderstand: 'Ninaelewa', iDontUnderstand: 'Sielewi', canYouHelp: 'Unaweza kunisaidia?', whatIsThis: 'Hii ni nini?' },
  la: { hello: 'Salve!', howAreYou: 'Quid agis?', niceToMeetYou: 'Libenter te cognovi!', thankYou: 'Gratias!', goodbye: 'Vale!', yes: 'Ita', no: 'Non', please: 'Sodes', sorry: 'Ignosce', iUnderstand: 'Intelligo', iDontUnderstand: 'Non intelligo', canYouHelp: 'Potesne me adiuvare?', whatIsThis: 'Quid est hoc?' },
  el: { hello: 'Γεια σου!', howAreYou: 'Τι κάνεις;', niceToMeetYou: 'Χαίρω πολύ!', thankYou: 'Ευχαριστώ!', goodbye: 'Αντίο!', yes: 'Ναι', no: 'Όχι', please: 'Παρακαλώ', sorry: 'Συγγνώμη', iUnderstand: 'Καταλαβαίνω', iDontUnderstand: 'Δεν καταλαβαίνω', canYouHelp: 'Μπορείς να με βοηθήσεις;', whatIsThis: 'Τι είναι αυτό;' },
  he: { hello: 'שלום!', howAreYou: 'מה שלומך?', niceToMeetYou: 'נעים מאוד!', thankYou: 'תודה!', goodbye: 'להתראות!', yes: 'כן', no: 'לא', please: 'בבקשה', sorry: 'סליחה', iUnderstand: 'אני מבין', iDontUnderstand: 'אני לא מבין', canYouHelp: 'אתה יכול לעזור לי?', whatIsThis: 'מה זה?' },
  pl: { hello: 'Cześć!', howAreYou: 'Jak się masz?', niceToMeetYou: 'Miło cię poznać!', thankYou: 'Dziękuję!', goodbye: 'Do widzenia!', yes: 'Tak', no: 'Nie', please: 'Proszę', sorry: 'Przepraszam', iUnderstand: 'Rozumiem', iDontUnderstand: 'Nie rozumiem', canYouHelp: 'Możesz mi pomóc?', whatIsThis: 'Co to jest?' },
  uk: { hello: 'Привіт!', howAreYou: 'Як справи?', niceToMeetYou: 'Приємно познайомитись!', thankYou: 'Дякую!', goodbye: 'До побачення!', yes: 'Так', no: 'Ні', please: 'Будь ласка', sorry: 'Вибачте', iUnderstand: 'Я розумію', iDontUnderstand: 'Я не розумію', canYouHelp: 'Ви можете мені допомогти?', whatIsThis: 'Що це?' },
  fa: { hello: 'سلام!', howAreYou: 'چطورید؟', niceToMeetYou: 'از دیدار شما خوشبختم!', thankYou: 'ممنون!', goodbye: 'خداحافظ!', yes: 'بله', no: 'نه', please: 'لطفاً', sorry: 'ببخشید', iUnderstand: 'می‌فهمم', iDontUnderstand: 'نمی‌فهمم', canYouHelp: 'می‌تونید کمکم کنید؟', whatIsThis: 'این چیه؟' },
  bn: { hello: 'হ্যালো!', howAreYou: 'আপনি কেমন আছেন?', niceToMeetYou: 'আপনার সাথে দেখা হয়ে ভালো লাগলো!', thankYou: 'ধন্যবাদ!', goodbye: 'বিদায়!', yes: 'হ্যাঁ', no: 'না', please: 'দয়া করে', sorry: 'দুঃখিত', iUnderstand: 'আমি বুঝতে পেরেছি', iDontUnderstand: 'আমি বুঝতে পারছি না', canYouHelp: 'আপনি কি আমাকে সাহায্য করতে পারেন?', whatIsThis: 'এটা কি?' },
  ta: { hello: 'வணக்கம்!', howAreYou: 'நீங்கள் எப்படி இருக்கிறீர்கள்?', niceToMeetYou: 'உங்களை சந்தித்ததில் மகிழ்ச்சி!', thankYou: 'நன்றி!', goodbye: 'பிரியாவிடை!', yes: 'ஆம்', no: 'இல்லை', please: 'தயவு செய்து', sorry: 'மன்னிக்கவும்', iUnderstand: 'நான் புரிந்துகொள்கிறேன்', iDontUnderstand: 'நான் புரிந்துகொள்ளவில்லை', canYouHelp: 'எனக்கு உதவ முடியுமா?', whatIsThis: 'இது என்ன?' },
  ur: { hello: 'سلام!', howAreYou: 'آپ کیسے ہیں؟', niceToMeetYou: 'آپ سے مل کر خوشی ہوئی!', thankYou: 'شکریہ!', goodbye: 'الوداع!', yes: 'ہاں', no: 'نہیں', please: 'براہ کرم', sorry: 'معافی', iUnderstand: 'میں سمجھتا ہوں', iDontUnderstand: 'میں نہیں سمجھتا', canYouHelp: 'کیا آپ میری مدد کر سکتے ہیں؟', whatIsThis: 'یہ کیا ہے؟' },
};

// Get common phrases for a language
export function getCommonPhrases(language: LanguageCode): Record<string, string> {
  return COMMON_PHRASES[language] || COMMON_PHRASES.en;
}
