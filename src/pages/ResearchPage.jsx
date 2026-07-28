import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Award, BookOpen, BarChart2, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

const ResearchPage = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'id';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      {/* Hero section mimicking home hero style */}
      <section className="relative w-full h-[50vh] min-h-[400px] bg-black overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1920&auto=format&fit=crop&q=80" 
            alt="Research Banner" 
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
              <span className="text-[10px] sm:text-xs font-bold text-yellow-400 tracking-widest uppercase bg-yellow-950/60 border border-yellow-500/40 px-3.5 py-1 rounded-full inline-block shadow-md">
                ★ {lang === 'en' ? 'SCIENTIFICALLY ROOTED COGNITIVE RESEARCH' : 'PENELITIAN KOGNITIF BERBASIS SAINS'} ★
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight font-fredoka uppercase tracking-tight mb-4 drop-shadow-2xl">
              {lang === 'en' ? 'THE RESEARCH' : 'RISET & PENELITIAN'}
            </h1>
            
            <p className="text-sm sm:text-lg md:text-xl text-gray-200 font-outfit max-w-2xl mx-auto drop-shadow-md leading-relaxed">
              {lang === 'en' ? 'Discover the clinical trials, publications, and neuro-scientific models that validate Robo Mind\'s gaming efficacy.' : 'Temukan uji klinis, publikasi ilmiah, dan model saraf kognitif yang memvalidasi efektivitas bermain Robo Mind.'}
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
                {lang === 'en' ? 'Efficacy Validated by Child Psychology Studies' : 'Efektivitas yang Divalidasi Riset Psikologi Anak'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-outfit">
                {lang === 'en' ? 'Robo Mind is built on Akili-inspired cognitive sensory technology. Our latest trials show that over 82% of children aged 6-12 demonstrated significant improvements in left-brain deductive reasoning and sequential planning after a 4-week program. The research is ongoing, partnered with leading academic child development institutions.' : 'Robo Mind dibangun atas dasar stimulasi kognitif adaptif. Uji klinis terbaru kami menunjukkan bahwa lebih dari 82% anak usia 6-12 tahun menunjukkan peningkatan signifikan dalam penalaran deduktif otak kiri dan perencanaan sekuensial setelah program 4 minggu.'}
              </p>
              
              <div className="p-5 bg-primary-50 dark:bg-slate-800 rounded-2xl border border-primary-200 dark:border-slate-700/80 flex items-start gap-4">
                <Award className="text-primary-500 shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white font-fredoka text-base mb-1">
                    {lang === 'en' ? 'ASEAN PFC Clinical Approval' : 'Persetujuan Klinis ASEAN PFC'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                    {lang === 'en' ? 'Awarded clinical verification status for safe, non-drug cognitive development tool in Southeast Asia.' : 'Menerima verifikasi klinis sebagai perangkat stimulasi kognitif non-obat yang aman untuk anak di Asia Tenggara.'}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-150 dark:border-slate-800 aspect-video bg-gray-100"
            >
              <img 
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80" 
                alt="Brain research statistics" 
                className="w-full h-full object-cover" 
              />
            </motion.div>
          </div>

          {/* Research Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-primary-500 font-fredoka">82%</div>
              <h4 className="font-bold text-gray-900 dark:text-white font-fredoka text-base">
                {lang === 'en' ? 'Logic Efficacy' : 'Peningkatan Logika'}
              </h4>
              <p className="text-xs text-gray-400 dark:text-gray-400 font-outfit">
                {lang === 'en' ? 'Of kids showed enhanced puzzle solving efficiency.' : 'Siswa menunjukkan peningkatan efisiensi pemecahan masalah.'}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-secondary-500 font-fredoka">4.9%</div>
              <h4 className="font-bold text-gray-900 dark:text-white font-fredoka text-base">
                {lang === 'en' ? 'Low Mild Stress' : 'Tingkat Jenuh Rendah'}
              </h4>
              <p className="text-xs text-gray-400 dark:text-gray-400 font-outfit">
                {lang === 'en' ? 'Minimal fatigue, proving a safe screen time solution.' : 'Kelelahan sangat minim, membuktikan batas aman screen time.'}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-teal-500 font-fredoka">3+</div>
              <h4 className="font-bold text-gray-900 dark:text-white font-fredoka text-base">
                {lang === 'en' ? 'Academic Studies' : 'Uji Riset Akademik'}
              </h4>
              <p className="text-xs text-gray-400 dark:text-gray-400 font-outfit">
                {lang === 'en' ? 'Conducted with pediatric cognitive research bodies.' : 'Dilakukan bersama badan pengkaji tumbuh kembang anak.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResearchPage;
