import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Data terjemahan
const resources = {
  id: {
    translation: {
      "navbar": {
        "home": "Beranda",
        "features": "Fitur Game",
        "screening": "Skrining Awal",
        "progress": "Progress Anak",
        "pricing": "Berlangganan",
        "journey": "Perjalanan Anak",
        "community": "Komunitas",
        "login": "Masuk Akun",
        "start_screening": "Mainkan Sekarang",
        "logout": "Keluar",
        "logout_acc": "Keluar Akun",
        "welcome": "Selamat Datang!",
        "login_desc": "Pilih metode masuk untuk melanjutkan ke dunia Robo Mind.",
        "continue_google": "Masuk dengan Google",
        "continue_apple": "Masuk dengan Apple",
        "continue_yahoo": "Masuk dengan Yahoo",
        "continue_email": "Masuk dengan Email",
        "or": "atau",
        "terms": "Dengan masuk, Anda menyetujui <1>Syarat Ketentuan</1> dan <3>Kebijakan Privasi</3> kami."
      },
      "hero": {
        "title1": "Belajar Coding & Logika dengan",
        "title2": "Game Interaktif",
        "subtitle": "Platform pembelajaran berbasis game pertama di Indonesia yang mengasah otak kiri anak melalui tantangan logika yang seru dan mengedukasi.",
        "cta1": "Mulai Petualangan",
        "cta2": "Lihat Fitur"
      }
      // Add other keys later if needed for full translation
    }
  },
  en: {
    translation: {
      "navbar": {
        "home": "Home",
        "features": "Game Features",
        "screening": "Early Screening",
        "progress": "Child Progress",
        "pricing": "Subscription",
        "journey": "Child's Journey",
        "community": "Community",
        "login": "Sign In",
        "start_screening": "Play Now",
        "logout": "Sign Out",
        "logout_acc": "Log Out Account",
        "welcome": "Welcome Back!",
        "login_desc": "Choose a login method to continue to the Robo Mind world.",
        "continue_google": "Continue with Google",
        "continue_apple": "Continue with Apple",
        "continue_yahoo": "Continue with Yahoo",
        "continue_email": "Continue with Email",
        "or": "or",
        "terms": "By signing in, you agree to our <1>Terms of Service</1> and <3>Privacy Policy</3>."
      },
      "hero": {
        "title1": "Learn Coding & Logic with",
        "title2": "Interactive Games",
        "subtitle": "The first game-based learning platform in Indonesia that sharpens children's left brain through fun and educational logic challenges.",
        "cta1": "Start Adventure",
        "cta2": "View Features"
      }
    }
  }
};

const LANG_STORAGE_KEY = 'robomind_lang';

// Restore the last language chosen by the user so it survives page reloads / full navigations
const getInitialLanguage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'en' || saved === 'id') return saved;
    }
  } catch (e) {
    // ignore storage access errors
  }
  return 'id';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(), // default language (or last saved)
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

// Persist the selected language and keep <html lang> in sync
i18n.on('languageChanged', (lng) => {
  const normalized = lng === 'en' ? 'en' : 'id';
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LANG_STORAGE_KEY, normalized);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = normalized;
    }
  } catch (e) {
    // ignore storage access errors
  }
});

try {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = i18n.language === 'en' ? 'en' : 'id';
  }
} catch (e) {
  // ignore
}

export default i18n;
