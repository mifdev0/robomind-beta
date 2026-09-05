import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { Brain, Target, Shield, Rocket, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesPage = () => {
  const { i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    { id: 'all', label: i18n.language === 'en' ? 'All Games' : 'Semua Game' },
    { id: 'logic', label: i18n.language === 'en' ? 'Logic & Coding' : 'Logika & Koding' },
    { id: 'focus', label: i18n.language === 'en' ? 'Focus & Control' : 'Fokus & Kontrol Diri' },
    { id: 'literacy', label: i18n.language === 'en' ? 'Language & AI' : 'Literasi & Bahasa' },
    { id: 'moral', label: i18n.language === 'en' ? 'Moral & Empathy' : 'Moral & Empati' },
    { id: 'spatial', label: i18n.language === 'en' ? 'Visual & Spatial' : 'Visual & Spasial' },
  ];

  const features = [
    {
      id: 'robo-jek',
      category: 'moral',
      title: 'Robo-Jek: Kota Pintar',
      pillar: 'Moral Reasoning & Empathy',
      pillarIcon: <Shield className="w-4 h-4 text-amber-500" />,
      tagColor: 'from-amber-500 to-orange-500',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      focusArea: i18n.language === 'en' ? 'Traffic Rules & Pedestrian Empathy' : 'Kepatuhan Rambu & Empati Pejalan Kaki',
      difficulty: i18n.language === 'en' ? 'Adaptive Traffic' : 'Lalu Lintas Adaptif',
      desc: i18n.language === 'en' 
        ? 'A 2D top-down delivery racing game teaching traffic etiquette, pedestrian safety, and moral decision making.'
        : 'Simulasi berkendara kota pintar 2D yang melatih kepatuhan rambu lalu lintas, empati pejalan kaki, dan etika berkendara.',
      video: '/robo_jek_preview.mp4',
      poster: '/cover.jpg'
    },
    {
      id: 'robo-circuit',
      category: 'logic',
      title: 'Robot Circuit Puzzle',
      pillar: 'Sequential Working Memory',
      pillarIcon: <Brain className="w-4 h-4 text-cyan-500" />,
      tagColor: 'from-cyan-500 to-blue-600',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      focusArea: i18n.language === 'en' ? 'Sequential Logic & Circuit Routing' : 'Logika Sekuensial & Alur Listrik',
      difficulty: i18n.language === 'en' ? 'Multi-Level Puzzles' : 'Teka-Teki Multi-Level',
      desc: i18n.language === 'en'
        ? 'Assemble electrical circuits and solve logic pathways to power up the robot core using sequential coding thinking.'
        : 'Menyusun alur sirkuit listrik dan memecahkan teka-teki logika sekuensial algoritma untuk menghidupkan inti robot.',
      video: '/robo_circuit_preview.mp4',
      poster: '/rbt_ct.png'
    },
    {
      id: 'robo-link',
      category: 'literacy',
      title: 'Robo Link: Kosakata AI',
      pillar: 'Language & Semantic Processing',
      pillarIcon: <Sparkles className="w-4 h-4 text-purple-500" />,
      tagColor: 'from-purple-500 to-pink-500',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      focusArea: i18n.language === 'en' ? 'Word Chains & Semantic Literacy' : 'Rangkaian Kata & Literasi Semantik',
      difficulty: i18n.language === 'en' ? 'Adaptive Vocabulary' : 'Kosakata Adaptif',
      desc: i18n.language === 'en'
        ? 'Structured word linking and conceptual language puzzles to expand vocabulary and contextual reading comprehension.'
        : 'Menghubungkan kata, frasa, dan konsep bahasa terarah untuk melatih kemampuan literasi semantik dan pemahaman konteks.',
      video: '/robo_link_preview.mp4',
      poster: '/rbt_link.png'
    },
    {
      id: 'robo-escape',
      category: 'logic',
      title: 'Robot Escape: Drift & Dodge',
      pillar: 'Cognitive Flexibility & Reflexes',
      pillarIcon: <Rocket className="w-4 h-4 text-emerald-500" />,
      tagColor: 'from-emerald-500 to-teal-500',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      focusArea: i18n.language === 'en' ? 'Fast Reflexes & Dynamic Avoidance' : 'Refleks Cepat & Penghindaran Hambatan',
      difficulty: i18n.language === 'en' ? 'Speed Ramp-Up' : 'Kecepatan Dinamis',
      desc: i18n.language === 'en'
        ? 'Navigate dynamic obstacles, test quick reflexes, and practice adaptive decision making under changing speeds.'
        : 'Navigasi rintangan dinamis di jalan raya kota untuk mengasah fleksibilitas kognitif dan ketangkasan adaptasi situasi.',
      video: '/robo_escape_preview.mp4',
      poster: '/rbt_escp.png'
    },
    {
      id: 'robo-charge',
      category: 'logic',
      title: 'Robo Charge: Power Grid',
      pillar: 'Strategic Planning & Resource Management',
      pillarIcon: <Target className="w-4 h-4 text-blue-500" />,
      tagColor: 'from-blue-500 to-indigo-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      focusArea: i18n.language === 'en' ? 'Energy Balancing & Route Strategy' : 'Manajemen Baterai & Rute Strategis',
      difficulty: i18n.language === 'en' ? 'Resource Optimization' : 'Optimasi Sumber Daya',
      desc: i18n.language === 'en'
        ? 'Strategic resource management where kids calculate power usage and plan optimal charging station routes.'
        : 'Manajemen daya dan perencanaan strategis untuk mengoptimalkan rute baterai robot menuju stasiun pengisian energi.',
      video: '/robo_charge_preview.mp4',
      poster: '/rbt_chrg.png'
    },
    {
      id: 'robo-circle',
      category: 'focus',
      title: 'Robo Circle: Precision Orbit',
      pillar: 'Inhibitory Control & Timing',
      pillarIcon: <Target className="w-4 h-4 text-rose-500" />,
      tagColor: 'from-rose-500 to-red-600',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      focusArea: i18n.language === 'en' ? 'Impulse Control & Motor Timing' : 'Kontrol Impuls & Ketepatan Timing',
      difficulty: i18n.language === 'en' ? 'Precision Orbit Sync' : 'Presisi Sinkronisasi Orbit',
      desc: i18n.language === 'en'
        ? 'Train impulse inhibition and precise motor timing by timing orbit jumps without hitting obstacles.'
        : 'Latihan kendali impuls dan fokus ketepatan timing motorik saat berpindah orbit tanpa menabrak penghalang berputar.',
      video: '/robo_circle_preview.mp4',
      poster: '/rbt_circle.png'
    },
    {
      id: 'screw-spin',
      category: 'spatial',
      title: 'Screw Spin: Mekanika Baut',
      pillar: 'Visual Spatial & Fine Motor Coordination',
      pillarIcon: <Brain className="w-4 h-4 text-amber-600" />,
      tagColor: 'from-amber-400 to-yellow-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      focusArea: i18n.language === 'en' ? 'Color Sorting & Rotational Mechanics' : 'Pemilahan Warna & Mekanika Rotasi',
      difficulty: i18n.language === 'en' ? 'Multi-Layer Boards' : 'Papan Multi-Layer',
      desc: i18n.language === 'en'
        ? 'Color sorting and rotational bolt mechanics that develop spatial reasoning and fine motor precision.'
        : 'Pemilahan warna presisi dan teka-teki pelepasan baut rotasional untuk mengasah koordinasi visual-spasial.',
      video: '/screw_spin_preview.mp4',
      poster: '/Screw_Spin.png'
    },
    {
      id: 'energy-core',
      category: 'logic',
      title: 'Energy Core: Reactor Matrix',
      pillar: 'Working Memory Calculation',
      pillarIcon: <Brain className="w-4 h-4 text-sky-500" />,
      tagColor: 'from-sky-400 to-blue-700',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      focusArea: i18n.language === 'en' ? 'Mental Math & Equilibrium Logic' : 'Kalkulasi Mental & Keseimbangan',
      difficulty: i18n.language === 'en' ? 'Reactor Matrix Puzzles' : 'Matriks Reaktor Bertingkat',
      desc: i18n.language === 'en'
        ? 'Calculate energy equations in working memory to balance reactor cores and prevent system overload.'
        : 'Kalkulasi angka di memori kerja (working memory) untuk menyeimbangkan stabilitas reaktor inti energi robot.',
      video: '/energy_core_preview.mp4',
      poster: '/enrg_cr.png'
    },
    {
      id: 'robo-delivery',
      category: 'spatial',
      title: 'Robo Delivery: Menara Labirin',
      pillar: 'Spatial Orientation & Logistics Mapping',
      pillarIcon: <Rocket className="w-4 h-4 text-teal-600" />,
      tagColor: 'from-teal-400 to-emerald-600',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
      focusArea: i18n.language === 'en' ? 'Multi-Floor Labyrinth Orientation' : 'Orientasi Labirin Multi-Lantai',
      difficulty: i18n.language === 'en' ? 'Complex Architectural Maps' : 'Denah Arsitektur Kompleks',
      desc: i18n.language === 'en'
        ? 'Courier maze routing through multi-floor architectural maps to test spatial orientation and memory.'
        : 'Navigasi kurir pengantar barang dalam denah gedung bertingkat untuk menguji orientasi arah dan pemetaan spasial.',
      video: '/robo_delivery_preview.mp4',
      poster: '/cover.jpg'
    },
    {
      id: 'robo-bros',
      category: 'logic',
      title: 'Robo Bros: Platformer Quest',
      pillar: 'Computational Problem Solving',
      pillarIcon: <Sparkles className="w-4 h-4 text-indigo-500" />,
      tagColor: 'from-indigo-500 to-purple-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      focusArea: i18n.language === 'en' ? 'Algorithmic Sequencing & Agility' : 'Sekuensing Algoritma & Ketangkasan',
      difficulty: i18n.language === 'en' ? 'Progressive Platform Stages' : 'Tahapan Platformer Progresif',
      desc: i18n.language === 'en'
        ? 'Retro computational platformer that blends hand-eye coordination with algorithmic step-by-step logic.'
        : 'Petualangan platformer komputasi klasik yang menguji ketangkasan koordinasi tangan-mata dan logika bertahap.',
      video: '/robo_bros_preview.mp4',
      poster: '/cover.jpg'
    },
    {
      id: 'robo-maze',
      category: 'spatial',
      title: 'Robo Maze: Labirin Arsitektur',
      pillar: '3D Spatial Topology & Key Routing',
      pillarIcon: <Target className="w-4 h-4 text-violet-500" />,
      tagColor: 'from-violet-500 to-fuchsia-600',
      badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
      focusArea: i18n.language === 'en' ? 'Isometric Navigation & Key Routing' : 'Navigasi Isometrik & Rute Kunci',
      difficulty: i18n.language === 'en' ? 'Topological Mazes' : 'Labirin Topologi Menantang',
      desc: i18n.language === 'en'
        ? 'Explore intricate isometric labyrinths to collect algorithm keycards and unlock complex gates.'
        : 'Eksplorasi labirin isometrik rumit untuk mengumpulkan kunci algoritma dan membuka gerbang komputasi.',
      video: '/robo_maze_preview.mp4',
      poster: '/rbt_maze.png'
    },
    {
      id: 'robo-pose',
      category: 'focus',
      title: 'Robo Pose: Sensor Gerak AI',
      pillar: 'Motor Coordination & Body Control',
      pillarIcon: <Shield className="w-4 h-4 text-rose-500" />,
      tagColor: 'from-rose-500 to-pink-600',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      focusArea: i18n.language === 'en' ? 'Kinesthetic Sensor & Pose Matching' : 'Sensor Kinestetik & Peniruan Pose',
      difficulty: i18n.language === 'en' ? 'Real-time Camera AI' : 'Kamera AI Real-time',
      desc: i18n.language === 'en'
        ? 'Interactive camera motion tracking where kids match robotic poses to train physical focus and body control.'
        : 'Game sensor gerak kamera AI di mana anak menirukan pose robot untuk melatih koordinasi fisik dan kontrol motorik.',
      video: '/robo_adventures_preview.mp4',
      poster: '/robomind_character_2d.png'
    }
  ];

  const filteredFeatures = activeCategory === 'all'
    ? features
    : features.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col font-outfit bg-slate-50 text-slate-900">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100/80 border border-cyan-300 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              {i18n.language === 'en' ? 'Neurocognitive Game Catalog' : 'Katalog Fitur Game Neurokognitif'}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 font-fredoka mb-4 uppercase tracking-tight">
              {i18n.language === 'en' ? 'Explore Game Features' : 'Eksplorasi Fitur Game'}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {i18n.language === 'en' 
                ? 'Comprehensive showcase of 12+ neurocognitive games developed to stimulate core Prefrontal Cortex (PFC) executive functions in children aged 6–12.' 
                : 'Katalog lengkap 12+ game neurokognitif yang dirancang khusus untuk menstimulasi fungsi eksekutif Korteks Prefrontal (PFC) anak usia 6–12 tahun.'}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-cyan-300 shadow-md shadow-slate-900/20 scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Game Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredFeatures.map((feature, index) => (
              <motion.div 
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 group flex flex-col hover:-translate-y-1"
              >
                {/* Video Preview Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    poster={feature.poster}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  >
                    <source src={feature.video} type="video/mp4" />
                  </video>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black text-white uppercase tracking-wider bg-gradient-to-r ${feature.tagColor} shadow-md backdrop-blur-md`}>
                      {feature.title.split(':')[0]}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-cyan-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    GAMEPLAY
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  {/* PFC Brain Pillar Indicator */}
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border mb-3 w-max ${feature.badgeBg}`}>
                    {feature.pillarIcon}
                    <span>{feature.pillar}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-fredoka uppercase tracking-tight mb-2 group-hover:text-cyan-600 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed flex-grow line-clamp-3 mb-4">
                    {feature.desc}
                  </p>

                  {/* Educational Specifications / Tags Display */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        {i18n.language === 'en' ? 'Focus Area:' : 'Fokus Stimulasi:'}
                      </span>
                      <span className="font-bold text-slate-700 text-right truncate max-w-[170px]">
                        {feature.focusArea}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-cyan-500" />
                        {i18n.language === 'en' ? 'Mechanic:' : 'Tingkat Tantangan:'}
                      </span>
                      <span className="font-bold text-slate-700">
                        {feature.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
