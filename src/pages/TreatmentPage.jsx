import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Sparkles, CheckCircle, Target, Activity, Heart } from 'lucide-react';

const TreatmentPage = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'id';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      {/* Hero section mimicking home hero style */}
      <section className="relative w-full h-[50vh] min-h-[400px] bg-black overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&auto=format&fit=crop&q=80" 
            alt="Treatment Banner" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="mb-3">
              <span className="text-[10px] sm:text-xs font-bold text-teal-300 dark:text-teal-200 tracking-widest uppercase bg-teal-950/60 border border-teal-500/40 px-3.5 py-1 rounded-full inline-block shadow-md">
                ★ {lang === 'en' ? 'CLINICAL GAMEPLAY METHODOLOGY' : 'METODE PEMBELAJARAN KLINIS'} ★
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight font-fredoka uppercase tracking-tight mb-4 drop-shadow-2xl">
              {lang === 'en' ? 'THE TREATMENT' : 'METODE TERAPI'}
            </h1>
            
            <p className="text-sm sm:text-lg md:text-xl text-gray-200 font-outfit max-w-2xl mx-auto drop-shadow-md leading-relaxed">
              {lang === 'en' ? 'A clinically backed video game approach designed to train children\'s logic, focus, and cognitive execution.' : 'Pendekatan video game berbasis klinis yang dirancang untuk melatih logika, fokus, dan eksekusi kognitif anak.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main explanation content */}
      <section className="py-14 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl font-bold font-fredoka text-gray-900 dark:text-white">
                {lang === 'en' ? 'How Robo Mind Trains the Brain' : 'Bagaimana Robo Mind Melatih Otak'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-outfit">
                {lang === 'en' ? 'Unlike typical entertainment games, Robo Mind utilizes adaptive algorithms that stimulate key regions of the prefrontal cortex. As children solve logic paths, guide robots, and debug instructions, they practice attention control, working memory, and cognitive flexibility.' : 'Berbeda dengan game hiburan biasa, Robo Mind memanfaatkan algoritma adaptif yang menstimulasi area utama korteks prefrontal. Saat anak memecahkan jalur logika, mengarahkan robot, dan mendeteksi kesalahan instruksi, mereka melatih kontrol fokus, memori kerja, dan fleksibilitas kognitif.'}
              </p>
              
              <ul className="space-y-3.5">
                {[
                  lang === 'en' ? 'Targeted sensory-motor stimulation for focus' : 'Stimulasi sensori-motorik tertarget untuk fokus',
                  lang === 'en' ? 'Adaptive difficulty tailored to individual child speed' : 'Kesulitan adaptif yang disesuaikan dengan kecepatan anak',
                  lang === 'en' ? 'Structured logic puzzles for executive functions' : 'Teka-teki logika terstruktur untuk fungsi eksekutif'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                    <CheckCircle className="text-primary-500 shrink-0 w-5 h-5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-150 dark:border-slate-800 aspect-video bg-gray-100"
            >
              <img 
                src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80" 
                alt="Child playing" 
                className="w-full h-full object-cover" 
              />
            </motion.div>
          </div>

          {/* Pillars Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-950/30 rounded-xl flex items-center justify-center text-primary-500 mb-4">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold font-fredoka text-gray-900 dark:text-white">
                {lang === 'en' ? 'Targeted Metrics' : 'Metrik Tertarget'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit leading-relaxed">
                {lang === 'en' ? 'Focuses specifically on attention control, logical deduction, reasoning speed, and mistake troubleshooting.' : 'Berfokus khusus pada kontrol fokus, deduksi logis, kecepatan bernalar, dan pemecahan masalah/kesalahan.'}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-secondary-50 dark:bg-secondary-950/30 rounded-xl flex items-center justify-center text-secondary-500 mb-4">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-bold font-fredoka text-gray-900 dark:text-white">
                {lang === 'en' ? 'Play Schedule' : 'Jadwal Bermain'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit leading-relaxed">
                {lang === 'en' ? 'Recommended play session is 25 minutes a day, 5 days a week, for optimal cognitive growth.' : 'Rekomendasi durasi bermain adalah 25 menit sehari, 5 hari seminggu, untuk pertumbuhan kognitif optimal.'}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-950/30 rounded-xl flex items-center justify-center text-red-500 mb-4">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold font-fredoka text-gray-900 dark:text-white">
                {lang === 'en' ? 'No Bad Side Effects' : 'Tanpa Efek Samping Buruk'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit leading-relaxed">
                {lang === 'en' ? 'Unlike high-dopamine action games, our logic-based pacing ensures kids remain calm, focused, and stress-free.' : 'Berbeda dengan game aksi ber-dopamin tinggi, tempo berbasis logika kami memastikan anak tetap tenang, fokus, dan bebas stres.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TreatmentPage;
