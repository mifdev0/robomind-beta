import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ScreeningQuiz from '../components/ScreeningQuiz';

const ScreeningPage = () => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  return (
    <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors font-medium">
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">{isEn ? 'Back to Home' : 'Kembali ke Beranda'}</span>
            <span className="sm:hidden">{isEn ? 'Back' : 'Kembali'}</span>
          </Link>
          <div className="font-fredoka text-xl font-bold text-gray-800">
            Robo <span className="text-primary-500">Mind</span> {isEn ? 'Screening' : 'Skrining'}
          </div>
          <div className="w-20 sm:w-36"></div> {/* Spacer to center the logo */}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        <ScreeningQuiz />
      </div>
    </div>
  );
};

export default ScreeningPage;
