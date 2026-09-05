import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';

const Hero = () => {
  const { i18n } = useTranslation();

  const heroData = {
    tag: i18n.language === 'en' ? "NEUROPSYCHOLOGICAL ECOSYSTEM" : "EKOSISTEM NEUROPSIKOLOGI",
    title: i18n.language === 'en' 
      ? "The First Integrated Neuropsychological Ecosystem Designed to Empower Children’s Brain Maturation" 
      : "Ekosistem Neuropsikologi Terintegrasi Pertama yang Dirancang untuk Mengoptimalkan Kematangan Otak Anak",
    subtitle: i18n.language === 'en' 
      ? "Transforming passive screen time into a scientifically calibrated catalyst for Prefrontal Cortex development in children aged 6 to 12." 
      : "Mengubah screen time pasif menjadi katalis terkalibrasi ilmiah untuk perkembangan Prefrontal Cortex pada anak usia 6 hingga 12 tahun.",
    img: "/hero-web.png"
  };

  return (
    <section id="beranda" className="relative w-full h-[85vh] min-h-[580px] sm:h-[70vh] md:h-[60vh] lg:h-[620px] bg-slate-950 overflow-hidden">
      {/* Background Image Container with Full Cover Rendering */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
        <img 
          src={heroData.img} 
          alt="RoboMind Hero Banner" 
          className="w-full h-full object-cover object-center"
        />
        {/* Contrast Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/35" />
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl w-full"
        >
          <span className="inline-block py-1 px-3 sm:py-1.5 sm:px-4 rounded-full bg-white/15 backdrop-blur-md text-cyan-300 font-bold text-[9px] sm:text-[10px] md:text-xs tracking-[0.15em] sm:tracking-[0.2em] mb-3 sm:mb-4 md:mb-6 uppercase border border-cyan-400/30 shadow-sm">
            {heroData.tag}
          </span>
          
          <h1 className="text-[17px] sm:text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight sm:leading-[1.15] mb-3 sm:mb-4 md:mb-6 font-fredoka uppercase tracking-tight drop-shadow-2xl px-2">
            {heroData.title}
          </h1>
          
          <p className="text-[12px] sm:text-sm md:text-base lg:text-lg text-slate-200 mb-6 sm:mb-8 md:mb-10 font-outfit max-w-2xl mx-auto drop-shadow-md px-2 leading-relaxed">
            {heroData.subtitle}
          </p>
          
          {/* Responsive Buttons Container */}
          <div className="flex flex-col gap-2.5 w-full max-w-[280px] mx-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 sm:max-w-none sm:mx-0 px-4 sm:px-0">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/screening" 
              className="w-full sm:w-auto inline-flex justify-center items-center bg-white text-black px-6 py-3 rounded-full font-bold text-xs sm:text-base hover:bg-gray-200 transition-colors shadow-lg"
            >
              {i18n.language === 'en' ? 'Try Early Screening' : 'Coba Skrining Awal'}
            </motion.a>
            
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/chatbot" 
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white/15 border border-white/30 text-white px-6 py-3 rounded-full font-bold text-xs sm:text-base hover:bg-white/25 backdrop-blur-sm transition-colors"
            >
              {i18n.language === 'en' ? 'Ask Chatbot' : 'Tanya Chatbot'}
            </motion.a>
            
            <div className="flex flex-col gap-2.5 w-full sm:flex-row sm:gap-4 sm:w-auto sm:justify-center">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/community" 
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white/15 border border-white/30 text-white px-6 py-3 rounded-full font-bold text-xs sm:text-base hover:bg-white/25 backdrop-blur-sm transition-colors"
              >
                {i18n.language === 'en' ? 'Community' : 'Komunitas'}
              </motion.a>

              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/download" 
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold text-xs sm:text-base hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
              >
                {i18n.language === 'en' ? 'Play Now' : 'Mainkan Sekarang'}
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
