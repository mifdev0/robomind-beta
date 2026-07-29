import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { TrendingUp, Smartphone, HeartHandshake, Eye, CheckCircle2 } from 'lucide-react';

const InsightPage = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'id';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      {/* Hero section mimicking home hero style */}
      <section className="relative w-full h-[50vh] min-h-[400px] bg-black overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&auto=format&fit=crop&q=80" 
            alt="Insight Banner" 
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
                ★ {lang === 'en' ? 'PARENT MONITORING TECHNOLOGY' : 'TEKNOLOGI PENGAWASAN ORANG TUA'} ★
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight font-fredoka uppercase tracking-tight mb-4 drop-shadow-2xl">
              {lang === 'en' ? 'ROBO MIND INSIGHT' : 'ROBO MIND INSIGHT'}
            </h1>
            
            <p className="text-sm sm:text-lg md:text-xl text-gray-200 font-outfit max-w-2xl mx-auto drop-shadow-md leading-relaxed">
              {lang === 'en' ? 'Follow your child\'s learning journey, track cognitive competence, and read reports anytime, anywhere.' : 'Ikuti perjalanan belajar anak Anda, pantau kompetensi kognitif, dan baca laporan kapan saja, di mana saja.'}
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
                {lang === 'en' ? 'Real-Time Metrical Insights' : 'Wawasan Metrik secara Real-Time'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-outfit">
                {lang === 'en' ? 'Robo Mind Insight is an integrated parent dashboard. As your child plays, the system logs response latency, problem-solving accuracy, and focus intervals. These data points are processed into clear metrics, allowing parents to see areas of excellence and cognitive milestones.' : 'Robo Mind Insight adalah dashboard terintegrasi untuk orang tua. Saat anak Anda bermain, sistem mencatat latensi respons, akurasi pemecahan masalah, dan interval fokus untuk diolah menjadi data metrik yang jelas.'}
              </p>
              
              <ul className="space-y-3.5">
                {[
                  lang === 'en' ? 'Real-time metrics synchronization on dashboard' : 'Sinkronisasi metrik real-time pada dashboard',
                  lang === 'en' ? 'Psychological pediatric recommendations' : 'Rekomendasi ahli psikologi perkembangan anak',
                  lang === 'en' ? 'Milestone alerts for cognitive achievements' : 'Notifikasi target capaian kognitif anak'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                    <CheckCircle2 className="text-primary-500 shrink-0 w-5 h-5" />
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
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80" 
                alt="Mobile dashboard" 
                className="w-full h-full object-cover" 
              />
            </motion.div>
          </div>

          {/* Pillars Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-950/30 rounded-xl flex items-center justify-center text-primary-500 mb-4">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-bold font-fredoka text-gray-900 dark:text-white">
                {lang === 'en' ? 'Insight App' : 'Aplikasi Insight'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit leading-relaxed">
                {lang === 'en' ? 'Access your dashboard from any smartphone or desktop browser securely.' : 'Akses dashboard Anda dari smartphone atau browser desktop apa pun secara aman.'}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-secondary-50 dark:bg-secondary-950/30 rounded-xl flex items-center justify-center text-secondary-500 mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold font-fredoka text-gray-900 dark:text-white">
                {lang === 'en' ? 'Development Charts' : 'Grafik Perkembangan'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit leading-relaxed">
                {lang === 'en' ? 'Beautiful interactive radar charts illustrating kid-level logic improvements.' : 'Bagan radar interaktif yang menggambarkan peningkatan logika dan kognitif anak secara visual.'}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/30 rounded-xl flex items-center justify-center text-teal-500 mb-4">
                <Eye size={24} />
              </div>
              <h3 className="text-xl font-bold font-fredoka text-gray-900 dark:text-white">
                {lang === 'en' ? 'Direct Guidance' : 'Bimbingan Langsung'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit leading-relaxed">
                {lang === 'en' ? 'Get monthly suggestions from certified psychologists based on child results.' : 'Dapatkan saran bulanan dari psikolog bersertifikasi berdasarkan hasil bermain anak.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InsightPage;
