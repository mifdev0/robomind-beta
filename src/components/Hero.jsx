import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Hero = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const swiperRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      swiperRef.current?.swiper?.autoplay?.stop();
    } else {
      swiperRef.current?.swiper?.autoplay?.start();
    }
    setIsPlaying(!isPlaying);
  };

  const { i18n } = useTranslation();

  const slides = [
    {
      id: 0,
      tag: i18n.language === 'en' ? "NEUROPSYCHOLOGICAL ECOSYSTEM" : "EKOSISTEM NEUROPSIKOLOGI",
      title: i18n.language === 'en' 
        ? "The First Integrated Neuropsychological Ecosystem Designed to Empower Children’s Brain Maturation" 
        : "Ekosistem Neuropsikologi Terintegrasi Pertama yang Dirancang untuk Mengoptimalkan Kematangan Otak Anak",
      subtitle: i18n.language === 'en' 
        ? "Transforming passive screen time into a scientifically calibrated catalyst for Prefrontal Cortex development in children aged 6 to 12." 
        : "Mengubah screen time pasif menjadi katalis terkalibrasi ilmiah untuk perkembangan Prefrontal Cortex pada anak usia 6 hingga 12 tahun.",
      img: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1920&auto=format&fit=crop&q=80"
    },
    {
      id: 1,
      tag: i18n.language === 'en' ? "FUTURE EDUCATION PLATFORM" : "PLATFORM EDUKASI MASA DEPAN",
      title: i18n.language === 'en' ? "Hone Children's Cognitive & Logic" : "Asah Potensi Kognitif & Logika Anak",
      subtitle: i18n.language === 'en' ? "Connect your child's game, monitor development metrics in real-time, and get specific recommendations from child psychologists." : "Hubungkan game anak Anda, pantau metrik perkembangannya secara real-time, dan dapatkan rekomendasi spesifik dari psikolog anak.",
      img: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1920&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      tag: i18n.language === 'en' ? "AI GAME TECHNOLOGY" : "TEKNOLOGI GAME AI",
      title: i18n.language === 'en' ? "Exciting Adventure Full of Challenges" : "Petualangan Seru Penuh Tantangan",
      subtitle: i18n.language === 'en' ? "Play while honing coding logic. Let your little one's imagination fly high without limits." : "Bermain sambil mengasah logika coding. Biarkan imajinasi si kecil terbang tinggi tanpa batas.",
      img: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1920&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      tag: i18n.language === 'en' ? "REAL-TIME MONITORING" : "PANTUAN REAL-TIME",
      title: i18n.language === 'en' ? "See Development Directly" : "Lihat Perkembangan Secara Langsung",
      subtitle: i18n.language === 'en' ? "Access an exclusive dashboard to track language competence, focus, and problem solving." : "Akses dashboard eksklusif untuk melacak kompetensi bahasa, fokus, dan pemecahan masalah.",
      img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <section id="beranda" className="relative w-full h-[85vh] min-h-[580px] sm:h-[70vh] md:h-[60vh] lg:h-[600px] bg-black overflow-hidden group">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        pagination={{
          el: '.custom-swiper-pagination',
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} custom-bullet"></span>`;
          }
        }}
        navigation={{
          prevEl: '.custom-swiper-prev',
          nextEl: '.custom-swiper-next',
        }}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="w-full h-full">
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img src={slide.img} alt={slide.title} className="w-full h-full object-cover object-center scale-105 animate-slow-zoom" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/35" />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-4xl w-full"
              >
                <span className="inline-block py-1 px-3 sm:py-1.5 sm:px-4 rounded-full bg-white/10 backdrop-blur-md text-white font-bold text-[9px] sm:text-[10px] md:text-xs tracking-[0.15em] sm:tracking-[0.2em] mb-3 sm:mb-4 md:mb-6 uppercase border border-white/20">
                  {slide.tag}
                </span>
                
                <h1 className={`${slide.id === 0 ? 'text-[15px] sm:text-2xl md:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl md:text-5xl lg:text-6xl'} font-extrabold text-white leading-tight sm:leading-[1.15] mb-3 sm:mb-4 md:mb-6 font-fredoka uppercase tracking-tight drop-shadow-2xl px-2`}>
                  {slide.title}
                </h1>
                
                <p className={`${slide.id === 0 ? 'text-[11px] sm:text-sm md:text-lg' : 'text-sm sm:text-base md:text-xl'} text-gray-200 mb-6 sm:mb-8 md:mb-10 font-outfit max-w-2xl mx-auto drop-shadow-md px-2 leading-relaxed`}>
                  {slide.subtitle}
                </p>
                
                {/* Responsive buttons container: Single vertical column on mobile, row wrapping on desktop */}
                <div className="flex flex-col gap-2.5 w-full max-w-[280px] mx-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 sm:max-w-none sm:mx-0 px-4 sm:px-0">
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="/screening" 
                    className="w-full sm:w-auto inline-flex justify-center items-center bg-white text-black px-6 py-3 rounded-full font-bold text-xs sm:text-base hover:bg-gray-200 transition-colors"
                  >
                    {i18n.language === 'en' ? 'Try Early Screening' : 'Coba Skrining Awal'}
                  </motion.a>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-transparent border border-white text-white px-6 py-3 rounded-full font-bold text-xs sm:text-base hover:bg-white/10 backdrop-blur-sm transition-colors cursor-pointer"
                  >
                    <Play size={14} fill="currentColor" />
                    {i18n.language === 'en' ? 'Watch Demo' : 'Tonton Demo'}
                  </motion.button>
                  
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="/chatbot" 
                    className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white/10 border border-white/30 text-white px-6 py-3 rounded-full font-bold text-xs sm:text-base hover:bg-white/20 backdrop-blur-sm transition-colors"
                  >
                    {i18n.language === 'en' ? 'Ask Chatbot' : 'Tanya Chatbot'}
                  </motion.a>
                  
                  <div className="flex flex-col gap-2.5 w-full sm:flex-row sm:gap-4 sm:w-auto sm:justify-center">
                    <motion.a 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="/community" 
                      className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white/10 border border-white/30 text-white px-6 py-3 rounded-full font-bold text-xs sm:text-base hover:bg-white/20 backdrop-blur-sm transition-colors"
                    >
                      {i18n.language === 'en' ? 'Community' : 'Komunitas'}
                    </motion.a>

                    <motion.a 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="/game-dashboard" 
                      className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full font-bold text-xs sm:text-base hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 transition-all cursor-pointer"
                    >
                      {i18n.language === 'en' ? 'Play Now' : 'Mainkan Sekarang'}
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Slide Navigation controls */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-8 z-20 flex items-center gap-2 md:gap-6">
        <button 
          onClick={togglePlay}
          className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
          aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
        >
          {isPlaying ? <Pause size={10} className="md:size-[14]" fill="currentColor" /> : <Play size={10} className="md:size-[14] ml-px" fill="currentColor" />}
        </button>

        <div className="custom-swiper-pagination flex gap-1 md:gap-2 items-center"></div>

        <div className="flex items-center gap-1 md:gap-2">
          <button className="custom-swiper-prev w-6 h-6 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors cursor-pointer">
            <ChevronLeft size={12} className="md:size-[16]" />
          </button>
          <button className="custom-swiper-next w-6 h-6 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors cursor-pointer">
            <ChevronRight size={12} className="md:size-[16]" />
          </button>
        </div>
      </div>
      
      <style>{`
        .custom-bullet { width: 6px; height: 6px; background-color: rgba(255,255,255,0.4); border-radius: 50%; cursor: pointer; transition: all 0.3s ease; }
        .swiper-pagination-bullet-active.custom-bullet { background-color: white; width: 18px; border-radius: 12px; }
        @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
        .animate-slow-zoom { animation: slow-zoom 20s ease-in-out infinite alternate; }
      `}</style>
    </section>
  );
};

export default Hero;
