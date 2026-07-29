import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Gamepad2, Brain, BarChart3, ChevronRight } from 'lucide-react';

const WhyRoboMind = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'id';

  const items = [
    {
      id: 'treatment',
      icon: <Gamepad2 className="w-10 h-10 text-primary-500" />,
      title: lang === 'en' ? 'The First ASEAN PFC-Certified Logic Game' : 'Game Logika Pertama Bersertifikasi ASEAN PFC',
      desc: lang === 'en' ? 'Robo Mind is clinically recognized to enhance child logic, attention span, and left-brain cognitive development.' : 'Robo Mind diakui secara klinis membantu meningkatkan logika kognitif, konsentrasi, dan perkembangan otak kiri anak.',
      linkText: lang === 'en' ? 'The Treatment' : 'Metode Pembelajaran',
      linkUrl: '/treatment'
    },
    {
      id: 'research',
      icon: <Brain className="w-10 h-10 text-secondary-500" />,
      title: lang === 'en' ? 'Rooted in Science' : 'Berbasis Riset & Sains',
      desc: lang === 'en' ? 'Developed in collaboration with child psychologists to target key areas of focus, decision making, and logical thinking.' : 'Dirancang bersama psikolog anak untuk melatih area otak yang berperan pada fokus, pengambilan keputusan, dan logika.',
      linkText: lang === 'en' ? 'The Research' : 'Penelitian & Sains',
      linkUrl: '/the-research'
    },
    {
      id: 'insight',
      icon: <BarChart3 className="w-10 h-10 text-teal-500" />,
      title: lang === 'en' ? 'Real-Time Experience' : 'Pengalaman Real-Time',
      desc: lang === 'en' ? 'The game adjusts dynamically to each child\'s unique pace, and parents can follow metrics via the insight dashboard.' : 'Game beradaptasi secara dinamis dengan kecepatan anak, dan orang tua dapat memantau metrik via dashboard insight.',
      linkText: lang === 'en' ? 'Robo Mind Insight' : 'Robo Mind Insight',
      linkUrl: '/insight'
    }
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white font-fredoka mb-3 sm:mb-4 tracking-tight">
            Why <span className="text-primary-500">Robo Mind?</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 font-outfit px-2">
            {lang === 'en' ? 'Clinically developed cognitive training through games kids actually love.' : 'Pelatihan kognitif terstruktur yang dirancang secara klinis melalui game yang disukai anak.'}
          </p>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {items.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Icon Wrapper */}
              <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-full mb-6 flex items-center justify-center border border-gray-100 dark:border-slate-800 shadow-inner">
                {item.icon}
              </div>

              {/* Text content */}
              <h3 className="font-fredoka text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 min-h-[56px] flex items-center justify-center">
                {item.title}
              </h3>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit leading-relaxed mb-6 flex-grow">
                {item.desc}
              </p>

              {/* Link */}
              <div className="mt-auto">
                <Link 
                  to={item.linkUrl}
                  className="inline-flex items-center gap-1 text-sm font-bold text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-wider group"
                >
                  <span>{item.linkText}</span>
                  <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyRoboMind;
