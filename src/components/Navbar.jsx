import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bot, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const { user, signOut } = useAuth();
  const [subscription, setSubscription] = useState(() => {
    try {
      const stored = localStorage.getItem('user_subscription');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const { t, i18n } = useTranslation();

  // Apply theme class to documentElement
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    window.dispatchEvent(new Event('themeChange'));
  }, [theme]);

  useEffect(() => {
    const handleSubChange = () => {
      try {
        const storedSub = localStorage.getItem('user_subscription');
        setSubscription(storedSub ? JSON.parse(storedSub) : null);
      } catch (err) {
        console.error(err);
      }
    };

    window.addEventListener('subscriptionChange', handleSubChange);
    return () => {
      window.removeEventListener('subscriptionChange', handleSubChange);
    };
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'id' ? 'en' : 'id';
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = async () => {
    await signOut();
    window.dispatchEvent(new Event('subscriptionChange'));
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff&rounded=true`;

  const renderBadge = () => {
    if (!subscription || !subscription.active) return null;
    
    const plan = subscription.plan;
    let badgeStyle = '';
    let label = '';
    
    switch (plan) {
      case 'bronze':
        badgeStyle = 'bg-gradient-to-r from-orange-400 to-amber-600 text-white';
        label = 'Bronze';
        break;
      case 'silver':
        badgeStyle = 'bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500 text-white shadow-sm';
        label = 'Silver';
        break;
      case 'gold':
        badgeStyle = 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-white shadow-md shadow-amber-500/25 ring-1 ring-amber-400';
        label = 'Gold';
        break;
      case 'platinum':
        badgeStyle = 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-400 animate-pulse';
        label = 'Platinum';
        break;
      default:
        return null;
    }

    return (
      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider ${badgeStyle}`}>
        {label}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary-500 p-2 rounded-xl text-white group-hover:bg-primary-600 transition-colors">
                <Bot size={28} />
              </div>
              <span className="font-fredoka text-2xl font-bold text-gray-800 dark:text-white tracking-wide">
                Robo <span className="text-primary-500">Mind</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            <a href="/#beranda" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">{t('navbar.home')}</a>
            
            {/* Dropdown: Child's Journey */}
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors py-2 cursor-pointer focus:outline-none"
              >
                <span>{t('navbar.journey')}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-1 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 z-50"
                  >
                    <a href="/#fitur-game" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-250 hover:bg-primary-50 dark:hover:bg-slate-700/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                      {t('navbar.features')}
                    </a>
                    <a href="/#skrining-awal" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-250 hover:bg-primary-50 dark:hover:bg-slate-700/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                      {t('navbar.screening')}
                    </a>
                    <a href="/#progress-anak" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-250 hover:bg-primary-50 dark:hover:bg-slate-700/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                      {t('navbar.progress')}
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="/#berlangganan" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">{t('navbar.pricing')}</a>
            
            {/* Community link next to Subscription */}
            <Link to="/community" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              {t('navbar.community')}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Login button (only visible if not logged in) */}
            {!user && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2.5 rounded-full font-medium shadow-md shadow-primary-500/30 hover:shadow-lg hover:shadow-primary-500/40 transition-all text-sm inline-block"
                >
                  {t('navbar.login')}
                </Link>
              </motion.div>
            )}

            {/* Profile Dropdown (Personalized if user, default if guest) */}
            <div className="relative group">
              <button className="flex items-center focus:outline-none cursor-pointer">
                <img 
                  src={user ? avatarUrl : "https://ui-avatars.com/api/?name=Guest&background=9CA3AF&color=fff&rounded=true"} 
                  alt="Profile" 
                  className="w-9 h-9 rounded-full border-2 border-primary-100 hover:border-primary-500 transition-colors" 
                />
              </button>
              
              <div className="absolute right-0 top-10 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-4 min-w-[240px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {user ? (
                  <div className="space-y-1.5">
                    <p className="font-bold text-gray-800 dark:text-gray-100 font-outfit text-sm truncate">{displayName}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    <div className="mt-1.5">{renderBadge()}</div>
                    <hr className="my-2.5 border-gray-100 dark:border-slate-700" />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-bold text-gray-800 dark:text-gray-100 font-outfit text-sm">{i18n.language === 'en' ? 'Guest Account' : 'Akun Tamu'}</p>
                    <p className="text-xs text-gray-400">{i18n.language === 'en' ? 'Sign in to access features' : 'Masuk untuk akses fitur'}</p>
                    <hr className="my-2.5 border-gray-100 dark:border-slate-700" />
                  </div>
                )}

                <div className="space-y-3.5">
                  {/* Language Selector inside profile dropdown */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">{i18n.language === 'en' ? 'Language' : 'Bahasa'}</span>
                    <button 
                      onClick={toggleLanguage} 
                      className="bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 px-2.5 py-1.5 rounded-lg font-bold transition-colors uppercase"
                    >
                      {i18n.language}
                    </button>
                  </div>

                  {/* Dark/Light Mode switch inside profile dropdown */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">{i18n.language === 'en' ? 'Dark Mode' : 'Mode Gelap'}</span>
                    <button 
                      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                      className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 flex items-center justify-center text-sm transition-colors"
                    >
                      {theme === 'light' ? '☀️' : '🌙'}
                    </button>
                  </div>

                  {/* Settings Link inside dropdown */}
                  <div className="text-xs">
                    <a 
                      href="/#progress-anak" 
                      className="block text-gray-600 dark:text-gray-300 hover:text-primary-500 font-medium py-1"
                    >
                      ⚙️ {i18n.language === 'en' ? 'Settings & Dashboard' : 'Pengaturan & Dashboard'}
                    </a>
                  </div>

                  {user ? (
                    <>
                      <hr className="border-gray-100 dark:border-slate-700" />
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        🚪 {t('navbar.logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <hr className="border-gray-100 dark:border-slate-700" />
                      <Link 
                        to="/login"
                        className="block text-center text-xs text-primary-500 hover:text-primary-600 font-bold border border-primary-500 rounded-full py-2 hover:bg-primary-50 dark:hover:bg-primary-950/10 transition-colors"
                      >
                        {i18n.language === 'en' ? 'Login / Sign Up' : 'Masuk / Daftar'}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800"
        >
          <div className="px-4 pt-2 pb-4 space-y-1">
            <a href="/#beranda" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800">{t('navbar.home')}</a>
            
            {/* Mobile Dropdown: Child's Journey */}
            <div className="space-y-1">
              <button 
                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800 text-left focus:outline-none"
              >
                <span>{t('navbar.journey')}</span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isMobileDropdownOpen && (
                <div className="pl-4 space-y-1 border-l border-gray-200 dark:border-slate-700 ml-4">
                  <a href="/#fitur-game" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800">{t('navbar.features')}</a>
                  <a href="/#skrining-awal" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800">{t('navbar.screening')}</a>
                  <a href="/#progress-anak" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800">{t('navbar.progress')}</a>
                </div>
              )}
            </div>

            <a href="/#berlangganan" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800">{t('navbar.pricing')}</a>
            
            {/* Mobile Community Link */}
            <Link to="/community" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800">
              {t('navbar.community')}
            </Link>

            <div className="pt-4 flex flex-col gap-2.5 px-3">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-1">
                    <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full shrink-0" />
                    <div className="truncate">
                      <span className="font-bold text-gray-800 dark:text-gray-100 font-outfit text-sm truncate block">{displayName}</span>
                      <span className="text-xs text-gray-400 truncate block">{user.email}</span>
                      {renderBadge()}
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2.5 text-base font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-md shadow-primary-500/20">
                  {t('navbar.login')}
                </Link>
              )}
              
              <hr className="border-gray-100 dark:border-slate-800" />
              
              {/* Settings / Language / Theme Switcher in mobile menu */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{i18n.language === 'en' ? 'Language' : 'Bahasa'}</span>
                  <button onClick={toggleLanguage} className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold uppercase">
                    {i18n.language}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{i18n.language === 'en' ? 'Theme' : 'Tema'}</span>
                  <button 
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-lg"
                  >
                    {theme === 'light' ? '☀️' : '🌙'}
                  </button>
                </div>

                <a href="/#progress-anak" onClick={() => setIsOpen(false)} className="block text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500 font-medium py-1">
                  ⚙️ {i18n.language === 'en' ? 'Settings & Dashboard' : 'Pengaturan & Dashboard'}
                </a>
              </div>

              {user && (
                <>
                  <hr className="border-gray-100 dark:border-slate-800" />
                  <button 
                    onClick={() => { setIsOpen(false); handleLogout(); }} 
                    className="block w-full text-center px-4 py-2.5 text-sm font-medium text-red-600 border border-red-200 dark:border-red-950/20 rounded-full hover:bg-red-50 dark:hover:bg-red-950/10"
                  >
                    {t('navbar.logout_acc')}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
