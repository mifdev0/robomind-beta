import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'swiper/css';

const GameSlider = () => {
  const { i18n } = useTranslation();

  const originalGames = [
    {
      id: 'robo-jek',
      category: i18n.language === 'en' ? 'Moral & Ethics' : 'Moral & Etika Berkendara',
      categoryColor: 'from-amber-500 to-orange-500',
      title: 'ROBO-JEK: KOTA PINTAR',
      subtitle: i18n.language === 'en'
        ? 'Urban traffic navigation with driving etiquette and pedestrian safety rules.'
        : 'Navigasi kota pintar dengan kepatuhan etika berkendara & keselamatan pejalan kaki.',
      video: '/robo_jek_preview.mp4',
      poster: '/cover.jpg'
    },
    {
      id: 'robo-circuit',
      category: i18n.language === 'en' ? 'Logic & Coding' : 'Logika & Koding Sirkuit',
      categoryColor: 'from-cyan-500 to-blue-600',
      title: 'ROBOT CIRCUIT PUZZLE',
      subtitle: i18n.language === 'en'
        ? 'Sequential algorithm logic and electrical circuit path optimization.'
        : 'Logika algoritma sekuensial dan optimalisasi alur sirkuit listrik robot.',
      video: '/robo_circuit_preview.mp4',
      poster: '/rbt_ct.png'
    },
    {
      id: 'robo-link',
      category: i18n.language === 'en' ? 'Language & Literacy' : 'Literasi Bahasa & AI',
      categoryColor: 'from-purple-500 to-pink-500',
      title: 'ROBO LINK: KOSAKATA AI',
      subtitle: i18n.language === 'en'
        ? 'Structured semantic literacy, word chains, and conceptual language linking.'
        : 'Literasi semantik terarah, rangkaian kosakata, dan pemahaman konsep bahasa.',
      video: '/robo_link_preview.mp4',
      poster: '/rbt_link.png'
    },
    {
      id: 'robo-escape',
      category: i18n.language === 'en' ? 'Cognitive Flexibility' : 'Fleksibilitas Kognitif',
      categoryColor: 'from-emerald-500 to-teal-500',
      title: 'ROBOT ESCAPE: DRIFT & DODGE',
      subtitle: i18n.language === 'en'
        ? 'Dynamic obstacle avoidance, real-time spatial reflexes, and agile decision making.'
        : 'Refleks spasial dan kelincahan membuat keputusan menghadapi rintangan dinamis.',
      video: '/robo_escape_preview.mp4',
      poster: '/rbt_escp.png'
    },
    {
      id: 'robo-charge',
      category: i18n.language === 'en' ? 'Strategy & Planning' : 'Strategi & Manajemen Energi',
      categoryColor: 'from-blue-500 to-indigo-600',
      title: 'ROBO CHARGE: POWER GRID',
      subtitle: i18n.language === 'en'
        ? 'Energy resource management, battery preservation, and power station planning.'
        : 'Manajemen daya baterai robot dan perumusan strategi rute stasiun pengisian.',
      video: '/robo_charge_preview.mp4',
      poster: '/rbt_chrg.png'
    },
    {
      id: 'robo-circle',
      category: i18n.language === 'en' ? 'Inhibitory Control' : 'Fokus & Kontrol Impuls',
      categoryColor: 'from-rose-500 to-red-600',
      title: 'ROBO CIRCLE: PRECISION ORBIT',
      subtitle: i18n.language === 'en'
        ? 'Impulse control training, visual rhythm synchronization, and motor timing precision.'
        : 'Latihan kendali impuls, sinkronisasi ritme visual, dan ketepatan timing motorik.',
      video: '/robo_circle_preview.mp4',
      poster: '/rbt_circle.png'
    },
    {
      id: 'screw-spin',
      category: i18n.language === 'en' ? 'Visual Spatial' : 'Visual Spasial & Motorik',
      categoryColor: 'from-amber-400 to-yellow-600',
      title: 'SCREW SPIN: MEKANIKA BAUT',
      subtitle: i18n.language === 'en'
        ? 'Color sorting mechanics, rotational pattern puzzles, and fine motor coordination.'
        : 'Pemilahan warna presisi, teka-teki rotasi baut, dan koordinasi motorik halus.',
      video: '/screw_spin_preview.mp4',
      poster: '/Screw_Spin.png'
    },
    {
      id: 'energy-core',
      category: i18n.language === 'en' ? 'Working Memory' : 'Working Memory & Logika',
      categoryColor: 'from-sky-400 to-blue-700',
      title: 'ENERGY CORE: REACTOR MATRIX',
      subtitle: i18n.language === 'en'
        ? 'Working memory calculation, number balancing, and core reactor equilibrium.'
        : 'Kalkulasi memori kerja, balancing angka, dan stabilitas reaktor inti energi.',
      video: '/energy_core_preview.mp4',
      poster: '/enrg_cr.png'
    },
    {
      id: 'robo-delivery',
      category: i18n.language === 'en' ? 'Spatial Maze' : 'Labirin Logistik Spasial',
      categoryColor: 'from-teal-400 to-emerald-600',
      title: 'ROBO DELIVERY: MENARA LABIRIN',
      subtitle: i18n.language === 'en'
        ? 'Courier maze routing, architectural map orientation, and fast delivery logic.'
        : 'Perencanaan rute kurir, orientasi peta labirin, dan kecepatan pengantaran.',
      video: '/robo_delivery_preview.mp4',
      poster: '/cover.jpg'
    },
    {
      id: 'robo-bros',
      category: i18n.language === 'en' ? 'Computational Thinking' : 'Penalaran Komputasi',
      categoryColor: 'from-indigo-500 to-purple-600',
      title: 'ROBO BROS: PLATFORMER QUEST',
      subtitle: i18n.language === 'en'
        ? 'Computational puzzle platformer testing dexterity, logic sequencing, and problem solving.'
        : 'Petualangan platformer menguji ketangkasan motorik dan pemecahan masalah algoritma.',
      video: '/robo_bros_preview.mp4',
      poster: '/cover.jpg'
    },
    {
      id: 'robo-maze',
      category: i18n.language === 'en' ? '3D Problem Solving' : 'Spasial 3D & Problem Solving',
      categoryColor: 'from-violet-500 to-fuchsia-600',
      title: 'ROBO MAZE: LABIRIN ARSITEKTUR',
      subtitle: i18n.language === 'en'
        ? 'Multi-dimensional maze solving with topological navigation and compute keys.'
        : 'Penjelajahan labirin multi-dimensi dengan navigasi topologi dan kunci komputasi.',
      video: '/robo_maze_preview.mp4',
      poster: '/rbt_maze.png'
    }
  ];

  // Repeat the array for smooth infinite continuous loop
  const games = [...originalGames, ...originalGames];

  return (
    <section id="fitur-game" className="bg-white py-14 sm:py-16 border-b border-gray-100 overflow-hidden relative w-full">
      <div className="w-full mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="px-4 sm:px-6 lg:px-8 mb-8 flex justify-between items-end max-w-[1920px] mx-auto"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              {i18n.language === 'en' ? 'Live Gameplay Previews' : 'Preview Gameplay Asli'}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 font-fredoka uppercase tracking-tight">
              {i18n.language === 'en' ? 'Explore Game Features' : 'Eksplorasi Fitur Game'}
            </h2>
          </div>
          <Link to="/games" className="text-sm font-bold text-gray-900 border-b-2 border-cyan-500 pb-0.5 hover:text-cyan-600 hover:border-cyan-600 transition-all hidden sm:flex items-center gap-1 shrink-0 ml-4">
            <span>{i18n.language === 'en' ? 'View All 14+ Games' : 'Lihat Semua 14+ Game'}</span>
            <span>&rarr;</span>
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
            speed={6000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            allowTouchMove={true}
            breakpoints={{
              0: {
                slidesPerView: 1.15,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2.2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3.2,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 4.2,
                spaceBetween: 24,
              },
              1536: {
                slidesPerView: 5.2,
                spaceBetween: 24,
              }
            }}
            className="continuous-slider px-4 sm:px-6 lg:px-8 pb-8 w-full"
          >
            {games.map((game, index) => (
              <SwiperSlide key={`${game.id}-${index}`} className="flex-shrink-0 group cursor-grab active:cursor-grabbing">
                {/* Modern Game Card with Video Preview */}
                <div className="flex flex-col gap-3 w-full bg-slate-900/5 p-3 rounded-2xl border border-slate-200/80 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
                  {/* Video Thumbnail Container */}
                  <div className="w-full aspect-[4/3] bg-slate-950 overflow-hidden relative rounded-xl shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      poster={game.poster}
                      className="w-full h-full object-cover"
                    >
                      <source src={game.video} type="video/mp4" />
                    </video>

                    {/* Category Pill Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black text-white uppercase tracking-wider bg-gradient-to-r ${game.categoryColor} shadow-md backdrop-blur-md`}>
                        {game.category}
                      </span>
                    </div>

                    {/* Live Badge */}
                    <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-bold text-cyan-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      GAMEPLAY
                    </div>

                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  </div>
                  
                  {/* Game Info */}
                  <div className="flex flex-col px-1">
                    <h3 className="text-sm sm:text-base font-extrabold text-gray-900 font-fredoka uppercase tracking-tight line-clamp-1 group-hover:text-cyan-600 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-gray-600 font-outfit mt-1 line-clamp-2 leading-relaxed">
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
        /* Continuous smooth sliding animation */
        .continuous-slider .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  );
};

export default GameSlider;
