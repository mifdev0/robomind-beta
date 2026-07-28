import { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const ParentDashboard = () => {
  const { i18n } = useTranslation();
  const [difficulty, setDifficulty] = useState('Beginner');

  // Detect dark mode reactively
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark');
    };
    window.addEventListener('themeChange', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);
    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  const chartData = {
    labels: i18n.language === 'en' ? ['Logic', 'Creativity', 'Language', 'Focus', 'Problem Solving'] : ['Logika', 'Kreativitas', 'Bahasa', 'Fokus', 'Pemecahan Masalah'],
    datasets: [
      {
        label: i18n.language === 'en' ? 'Child Competence' : 'Kompetensi Anak',
        data: difficulty === 'Beginner' ? [40, 60, 80, 50, 45] : 
              difficulty === 'Intermediate' ? [70, 75, 85, 70, 80] : 
              [95, 90, 95, 85, 95],
        backgroundColor: 'rgba(20, 184, 166, 0.2)',
        borderColor: 'rgba(20, 184, 166, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        angleLines: { color: isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.1)' },
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.1)' },
        pointLabels: {
          font: { family: 'Outfit', size: 11, weight: '600' },
          color: isDark ? '#ffffff' : '#374151'
        },
        ticks: { display: false, min: 0, max: 100 }
      }
    },
    plugins: {
      legend: { display: false }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  const getRobotImage = () => {
    switch(difficulty) {
      case 'Advanced': return 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=400&q=80';
      case 'Intermediate': return 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80';
      case 'Beginner':
      default: return 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=400&q=80';
    }
  };

  return (
    <section id="progress-anak" className="py-14 sm:py-20 lg:py-24 bg-primary-50 dark:bg-slate-900 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white font-fredoka mb-3 sm:mb-4">
            {i18n.language === 'en' ? 'Parent Dashboard & Progress' : 'Parent Dashboard & Progress'}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 font-outfit px-2">
            {i18n.language === 'en' ? 'Monitor your child\'s development metrics in real-time and see their competence evaluation.' : 'Pantau metrik perkembangan anak Anda secara real-time dan lihat evaluasi kompetensi mereka.'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col lg:flex-row transition-colors duration-200">
          
          <div className="p-5 sm:p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-slate-700 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <span className="text-xs sm:text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">{i18n.language === 'en' ? 'Simulation Level' : 'Level Simulasi'}</span>
              <div className="flex gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                  <button 
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold rounded-full transition-colors cursor-pointer ${difficulty === level ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-6 sm:mb-8">
              <motion.div 
                key={difficulty}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-primary-100 dark:border-slate-700 overflow-hidden shadow-lg shrink-0"
              >
                <img src={getRobotImage()} alt="Robot Avatar" className="w-full h-full object-cover" />
              </motion.div>
              <div className="text-center sm:text-left">
                <h3 className="font-fredoka text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">{i18n.language === 'en' ? 'Robot Status' : 'Status Robot'}: <span className="text-secondary-500">{difficulty}</span></h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{i18n.language === 'en' ? 'Evolves according to the child\'s playing progress.' : 'Berkembang sesuai progres bermain anak.'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">{difficulty === 'Beginner' ? '5' : difficulty === 'Intermediate' ? '12' : '24'}</div>
                <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{i18n.language === 'en' ? 'Target Skills' : 'Keterampilan Target'}</div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary-500 mb-1">{difficulty === 'Beginner' ? '10+' : difficulty === 'Intermediate' ? '40+' : '100+'}</div>
                <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{i18n.language === 'en' ? 'Interactive Activities' : 'Aktivitas Interaktif'}</div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">{difficulty === 'Beginner' ? '5h' : difficulty === 'Intermediate' ? '20h' : '50h+'}</div>
                <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{i18n.language === 'en' ? 'Curriculum Size' : 'Ukuran Kurikulum'}</div>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8 lg:p-12 lg:w-1/2 flex items-center justify-center relative">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square relative"
            >
              <Radar key={isDark ? 'dark' : 'light'} data={chartData} options={chartOptions} />
            </motion.div>
            <div className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 px-2 sm:px-3 py-1 rounded-full border border-gray-100 dark:border-slate-700">
              Auto-sync: Real-time
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ParentDashboard;
