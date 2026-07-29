import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'swiper/css';

const GameSlider = () => {
  const { i18n } = useTranslation();

  // Repeating the array to ensure the continuous loop feels full even on large screens
  const originalGames = [
    {
      id: 1,
      title: i18n.language === 'en' ? "ROBOT LOGIC MODULE" : "MODUL LOGIKA ROBOT",
      subtitle: i18n.language === 'en' ? "Basic coding adventure." : "Petualangan coding dasar.",
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      title: i18n.language === 'en' ? "CREATIVE MATH MISSION" : "MISI MATEMATIKA KREATIF",
      subtitle: i18n.language === 'en' ? "Numerical case solving." : "Penyelesaian kasus numerik.",
      img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      title: i18n.language === 'en' ? "PROBLEM SOLVING CHALLENGE" : "TANTANGAN PROBLEM SOLVING",
      subtitle: i18n.language === 'en' ? "Honing left brain agility." : "Mengasah ketangkasan otak kiri.",
      img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
    }
  ];

  const games = [...originalGames, ...originalGames, ...originalGames];

  return (
    <section id="fitur-game" className="bg-white py-12 border-b border-gray-100 overflow-hidden relative w-full">
      <div className="w-full mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="px-4 sm:px-6 lg:px-8 mb-6 flex justify-between items-end max-w-[1920px] mx-auto"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 font-fredoka uppercase tracking-tight">
            {i18n.language === 'en' ? 'Explore Game Features' : 'Eksplorasi Fitur Game'}
          </h2>
          <Link to="/games" className="text-sm font-bold text-black border-b border-black pb-0.5 hover:text-gray-600 transition-colors hidden sm:block shrink-0 ml-4">
            {i18n.language === 'en' ? 'View All Game Features' : 'Lihat Semua Fitur Game'}
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="w-full"
        >
          <Swiper
            modules={[Autoplay]}
            loop={true}
            speed={5000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            allowTouchMove={true}
            breakpoints={{
              0: {
                slidesPerView: 1.2,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2.5,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3.5,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 4.5,
                spaceBetween: 24,
              }
            }}
            className="continuous-slider px-4 sm:px-6 lg:px-8 pb-8 w-full"
          >
            {games.map((game, index) => (
              <SwiperSlide key={`${game.id}-${index}`} className="flex-shrink-0 group cursor-grab active:cursor-grabbing">
                {/* Polaroid / Film-Strip Container */}
                <div className="flex flex-col gap-3 sm:gap-4 w-full">
                  <div className="w-full aspect-[3/4] max-h-[320px] md:max-h-[360px] bg-gray-100 overflow-hidden relative rounded-sm">
                    <img 
                      src={game.img} 
                      alt={game.title} 
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" 
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Text Caps */}
                  <div className="flex flex-col pr-4">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 font-fredoka uppercase tracking-tight line-clamp-1">
                      {game.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 font-outfit mt-0.5 sm:mt-1 line-clamp-2">
                      {game.subtitle}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>

      <style>{`
        /* Make the transition linear so it doesn't ease in and out per slide */
        .continuous-slider .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  );
};

export default GameSlider;
