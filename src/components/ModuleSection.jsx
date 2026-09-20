import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const ModuleSection = () => {
  const { i18n } = useTranslation();
  const modules = [
    {
      id: 1,
      title: i18n.language === 'en' ? "Intro to Logic & Robotics" : "Pengenalan Logika & Robotika",
      description: i18n.language === 'en' ? "Starter module: understand robots, simple instructions, and step-by-step sequences through Robo Mind mini-games." : "Modul dasar: memahami robot, instruksi sederhana, dan urutan langkah lewat mini-game Robo Mind.",
      price: i18n.language === 'en' ? "Free" : "Gratis",
      img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
      isLocked: false,
    },
    {
      id: 2,
      title: i18n.language === 'en' ? "Circuits & Logic Reasoning" : "Sirkuit & Penalaran Logika",
      description: i18n.language === 'en' ? "Train working memory and problem solving by connecting circuits, managing energy, and linking data paths." : "Latih working memory dan pemecahan masalah dengan menyambung sirkuit, mengatur energi, dan menghubungkan jalur data.",
      price: i18n.language === 'en' ? "Free" : "Gratis",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
      isLocked: false,
    },
    {
      id: 3,
      title: i18n.language === 'en' ? "Language Literacy & AI Concepts" : "Literasi Bahasa & Konsep AI",
      description: i18n.language === 'en' ? "Build vocabulary and conceptual understanding through word games and interactive language puzzles." : "Membangun kosakata dan pemahaman konsep melalui permainan kata dan teka-teki bahasa interaktif.",
      price: i18n.language === 'en' ? "Free" : "Gratis",
      img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80",
      isLocked: false,
    },
    {
      id: 4,
      title: i18n.language === 'en' ? "Focus & Self-Control" : "Fokus & Kontrol Diri",
      description: i18n.language === 'en' ? "Strengthen inhibitory control, rhythm, and timing accuracy through fast-paced attention games." : "Melatih inhibitory control, ritme, dan ketepatan timing lewat game atensi yang cepat (Screw Spin, Robo Circle).",
      price: "Rp 50.000",
      img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80",
      isLocked: false,
    },
    {
      id: 5,
      title: i18n.language === 'en' ? "Visual-Spatial & Motor Skills" : "Spasial Visual & Motorik",
      description: i18n.language === 'en' ? "Develop hand-eye coordination and spatial orientation through mazes and 3D challenge games." : "Mengembangkan koordinasi mata-tangan dan orientasi ruang lewat labirin dan game tantangan 3D.",
      price: "Rp 75.000",
      img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
      isLocked: false,
    },
    {
      id: 6,
      title: i18n.language === 'en' ? "Strategy, Empathy & Advanced AI" : "Strategi, Empati & AI Lanjutan",
      description: i18n.language === 'en' ? "Premium module for ethical reasoning, social empathy, and advanced logic in complex strategy games." : "Modul premium untuk penalaran etis, empati sosial, dan logika tingkat lanjut dalam game strategi kompleks.",
      price: i18n.language === 'en' ? "Subscription" : "Berlangganan",
      img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80",
      isLocked: true,
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.94 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: "spring",
        stiffness: 80,
        damping: 14
      } 
    }
  };

  return (
    <section id="modul-pembelajaran" className="bg-gray-50 py-10 sm:py-16 lg:py-24 border-b border-gray-100 w-full relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 font-fredoka uppercase tracking-tight">
            {i18n.language === 'en' ? 'Learning Modules' : 'Modul Pembelajaran'}
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 font-outfit max-w-2xl mx-auto px-2">
            {i18n.language === 'en' ? 'Interactive modules that train your child\'s logic, focus, language, and spatial skills — aligned with Robo Mind neuro-games.' : 'Modul interaktif yang melatih logika, fokus, bahasa, dan spasial anak — selaras dengan neuro-game Robo Mind.'}
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {modules.map((modul) => (
            <motion.div 
              key={modul.id} 
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
              }}
              className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-800 group flex flex-col relative"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img 
                  src={modul.img} 
                  alt={modul.title} 
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${modul.isLocked ? 'blur-sm brightness-75' : ''}`}
                />
                {modul.isLocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white z-10">
                    <div className="bg-white/20 p-3 sm:p-4 rounded-full backdrop-blur-md mb-2 sm:mb-3">
                      <Lock size={24} className="sm:size-[32] text-white" />
                    </div>
                    <span className="font-fredoka font-semibold text-sm sm:text-lg tracking-wide uppercase px-4 text-center">{i18n.language === 'en' ? 'Premium Module' : 'Modul Premium'}</span>
                  </div>
                )}
                {!modul.isLocked && (
                  <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-bold text-xs sm:text-sm font-fredoka shadow-sm ${modul.price === 'Gratis' || modul.price === 'Free' ? 'text-green-600' : 'text-gray-900'}`}>
                    {modul.price}
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 font-fredoka mb-1 sm:mb-2 line-clamp-2">
                  {modul.title}
                </h3>
                <p className="text-gray-500 font-outfit text-xs sm:text-sm mb-4 sm:mb-6 flex-grow leading-relaxed">
                  {modul.description}
                </p>
                {modul.isLocked ? (
                  <button className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-900 text-white font-bold rounded-lg sm:rounded-xl transition-all font-outfit flex justify-center items-center gap-2 shadow-md text-xs sm:text-sm cursor-pointer">
                    {i18n.language === 'en' ? 'Subscribe to Unlock' : 'Berlangganan untuk Membuka'}
                  </button>
                ) : (
                  <button className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 ${modul.price === 'Gratis' || modul.price === 'Free' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold rounded-lg sm:rounded-xl transition-colors font-outfit shadow-md hover:shadow-lg text-xs sm:text-sm cursor-pointer`}>
                    {modul.price === 'Gratis' || modul.price === 'Free' ? (i18n.language === 'en' ? 'Start Learning' : 'Mulai Belajar') : (i18n.language === 'en' ? 'Buy Module' : 'Beli Modul')}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-gray-200 hover:border-gray-900 text-gray-900 font-bold rounded-full transition-colors font-outfit uppercase tracking-wider text-xs sm:text-sm shadow-sm hover:shadow-md cursor-pointer">
            {i18n.language === 'en' ? 'View All Modules' : 'Lihat Semua Modul'}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ModuleSection;
