import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { CheckCircle2, ChevronRight, ChevronLeft, AlertCircle, ArrowRight, Lock, Activity, Sparkles, Bot } from 'lucide-react';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const QUESTIONS = [
  { id: 1, text: "1. Dapat mempedulikan perasaan orang lain", subscale: "prososial" },
  { id: 2, text: "2. Gelisah, terlalu aktif, tidak dapat diam", subscale: "hiperaktivitas" },
  { id: 3, text: "3. Sering mengeluh sakit kepala atau sakit perut", subscale: "emosional" },
  { id: 4, text: "4. Bersedia berbagi dengan anak-anak lain", subscale: "prososial" },
  { id: 5, text: "5. Sering marah atau kehilangan kesabaran", subscale: "perilaku" },
  { id: 6, text: "6. Cenderung main sendirian", subscale: "sebaya" },
  { id: 7, text: "7. Pada umumnya bertingkah laku baik", subscale: "perilaku" },
  { id: 8, text: "8. Banyak kekhawatiran, sering cemas", subscale: "emosional" },
  { id: 9, text: "9. Suka menolong anak lain", subscale: "prososial" },
  { id: 10, text: "10. Terus menerus bergerak dengan resah", subscale: "hiperaktivitas" },
  { id: 11, text: "11. Punya teman baik", subscale: "sebaya" },
  { id: 12, text: "12. Sering berkelahi dengan anak lain", subscale: "perilaku" },
  { id: 13, text: "13. Sering tampak sedih atau murung", subscale: "emosional" },
  { id: 14, text: "14. Disukai oleh anak-anak lain", subscale: "sebaya" },
  { id: 15, text: "15. Mudah beralih perhatiannya", subscale: "hiperaktivitas" },
  { id: 16, text: "16. Gugup pada situasi baru", subscale: "emosional" },
  { id: 17, text: "17. Baik hati pada yang lebih muda", subscale: "prososial" },
  { id: 18, text: "18. Sering berbohong", subscale: "perilaku" },
  { id: 19, text: "19. Diganggu anak lain", subscale: "sebaya" },
  { id: 20, text: "20. Menawarkan diri untuk membantu orang tua/guru", subscale: "prososial" },
  { id: 21, text: "21. Berpikir sebelum bertindak", subscale: "hiperaktivitas" },
  { id: 22, text: "22. Mencuri dari rumah/sekolah", subscale: "perilaku" },
  { id: 23, text: "23. Lebih akrab dengan orang dewasa dibanding anak sebayanya", subscale: "sebaya" },
  { id: 24, text: "24. Banyak ketakutan", subscale: "emosional" },
  { id: 25, text: "25. Mampu menyelesaikan tugas", subscale: "hiperaktivitas" }
];

const REVERSE_SCORED = [7, 14, 15, 17, 18];
const QUESTIONS_PER_PAGE = 5;

const ScreeningQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scores, setScores] = useState(null);

  const totalPages = Math.ceil(QUESTIONS.length / QUESTIONS_PER_PAGE);
  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const currentQuestions = QUESTIONS.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const isCurrentPageComplete = () => {
    return currentQuestions.every(q => answers[q.id] !== undefined);
  };

  const calculateResults = () => {
    const subScores = {
      emosional: 0,
      perilaku: 0,
      hiperaktivitas: 0,
      sebaya: 0,
      prososial: 0
    };

    QUESTIONS.forEach(q => {
      let score = answers[q.id] || 0;
      if (REVERSE_SCORED.includes(q.id)) {
        if (score === 2) score = 0;
        else if (score === 0) score = 2;
        // 1 remains 1
      }
      subScores[q.subscale] += score;
    });

    const totalDifficulties = subScores.emosional + subScores.perilaku + subScores.hiperaktivitas + subScores.sebaya;
    
    setScores({
      subScores,
      totalDifficulties
    });
    setIsSubmitted(true);
  };

  // Automatically scroll to the top of the page smoothly when current page or submission state changes
  useEffect(() => {
    const handleScroll = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const timer = setTimeout(handleScroll, 80);
    return () => clearTimeout(timer);
  }, [currentPage, isSubmitted]);

  const nextStep = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const prevStep = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Status mapping
  const getTotalStatus = (score) => {
    if (score <= 13) return { label: 'Normal', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score <= 16) return { label: 'Borderline', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { label: 'Abnormal / Perlu Perhatian', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' };
  };

  const getHyperStatus = (score) => {
    if (score <= 5) return 'Normal';
    if (score === 6) return 'Borderline';
    return 'Abnormal';
  };

  // Radar Chart Setup
  const chartData = scores ? {
    labels: ['Emosional', 'Perilaku', 'Hiperaktivitas', 'Masalah Sebaya', 'Prososial'],
    datasets: [
      {
        label: 'Skor Anak',
        data: [
          scores.subScores.emosional, 
          scores.subScores.perilaku, 
          scores.subScores.hiperaktivitas, 
          scores.subScores.sebaya, 
          scores.subScores.prososial
        ],
        backgroundColor: 'rgba(20, 184, 166, 0.2)', // primary-500 cyan-ish
        borderColor: 'rgba(20, 184, 166, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)', // amber
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(20, 184, 166, 1)',
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    scales: {
      r: {
        angleLines: { color: 'rgba(0,0,0,0.05)' },
        grid: { color: 'rgba(0,0,0,0.05)' },
        pointLabels: {
          font: { family: 'Outfit', size: 11, weight: '600' },
          color: '#4b5563'
        },
        ticks: { display: false, min: 0, max: 10, stepSize: 2 }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: { family: 'Outfit', size: 13 },
        bodyFont: { family: 'Outfit', size: 12 },
        padding: 10,
        cornerRadius: 8,
      }
    }
  };

  return (
    <section id="skrining-quiz-section" className="py-12 bg-gray-50 border-t border-gray-100 min-h-[calc(100vh-80px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        {!isSubmitted && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary-100 text-primary-700 font-bold text-xs tracking-wider mb-4 uppercase">
              Modul SDQ Terintegrasi
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-fredoka mb-4">
              Kuesioner Skrining Awal
            </h2>
            <p className="text-lg text-gray-600 font-outfit">
              Jawablah {QUESTIONS.length} pertanyaan berikut berdasarkan perilaku anak Anda selama 6 bulan terakhir.
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
            >
              {/* Progress Bar */}
              <div className="bg-gray-100 h-2 w-full">
                <div 
                  className="bg-primary-500 h-full transition-all duration-500" 
                  style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                />
              </div>

              <div className="p-6 md:p-10">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-fredoka text-xl font-bold text-gray-800">Bagian {currentPage + 1} dari {totalPages}</h3>
                  <span className="text-sm font-bold text-gray-400 font-outfit">{Object.keys(answers).length} / {QUESTIONS.length} Terjawab</span>
                </div>

                <div className="space-y-6 md:space-y-8">
                  {currentQuestions.map(q => (
                    <div key={q.id} className="bg-gray-50 rounded-2xl p-5 md:p-6 border border-gray-100 hover:border-primary-200 transition-colors">
                      <p className="text-base md:text-lg font-medium text-gray-800 font-outfit mb-4">{q.text}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { label: 'Tidak Benar', val: 0 },
                          { label: 'Agak Benar', val: 1 },
                          { label: 'Selalu Benar', val: 2 }
                        ].map((opt) => (
                          <button
                            key={opt.val}
                            onClick={() => handleAnswer(q.id, opt.val)}
                            className={`py-3 px-4 rounded-xl font-outfit font-medium text-sm md:text-base border transition-all duration-200 ${
                              answers[q.id] === opt.val 
                              ? 'bg-primary-500 border-primary-500 text-white shadow-md shadow-primary-500/20' 
                              : 'bg-white border-gray-200 text-gray-600 hover:border-primary-300 hover:bg-primary-50'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div className="mt-10 flex items-center justify-between pt-6 border-t border-gray-100">
                  <button 
                    onClick={prevStep}
                    disabled={currentPage === 0}
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-0 transition-all"
                  >
                    <ChevronLeft size={20} /> Kembali
                  </button>
                  <button 
                    onClick={nextStep}
                    disabled={!isCurrentPageComplete()}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full font-bold text-white shadow-md shadow-primary-500/20 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {currentPage === totalPages - 1 ? 'Kirim Hasil' : 'Selanjutnya'} 
                    {currentPage === totalPages - 1 ? <CheckCircle2 size={20} /> : <ChevronRight size={20} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="text-center max-w-3xl mx-auto mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-fredoka mb-4">
                  Laporan Analitik SDQ
                </h2>
                <p className="text-lg text-gray-600 font-outfit">
                  Berdasarkan instrumen skrining standar klinis. Berikut adalah interpretasi profil kognitif anak Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Column - Radar Chart */}
                <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center">
                  <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-6 flex items-center gap-2">
                    <Activity className="text-primary-500" />
                    Peta Distribusi Perilaku
                  </h3>
                  <div className="w-full max-w-md aspect-square relative">
                    {chartData && <Radar data={chartData} options={chartOptions} />}
                  </div>
                  <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-outfit">
                      <span className="w-3 h-3 rounded-full bg-primary-500"></span> Area Kognitif Anak
                    </div>
                  </div>
                </div>

                {/* Right Column - Professional Diagnostics */}
                <div className="space-y-6">
                  
                  {/* Summary Card */}
                  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                      <Bot size={100} />
                    </div>
                    <div className="relative z-10">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 font-outfit">Indeks Kesulitan Keseluruhan</h4>
                      <div className="flex items-end gap-3 mb-4">
                        <span className="text-5xl font-black text-gray-900 font-fredoka leading-none">{scores.totalDifficulties}</span>
                        <span className="text-lg font-bold text-gray-500 mb-1">/ 40</span>
                      </div>
                      
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getTotalStatus(scores.totalDifficulties).bg} ${getTotalStatus(scores.totalDifficulties).border}`}>
                        <AlertCircle size={18} className={getTotalStatus(scores.totalDifficulties).color} />
                        <span className={`font-bold text-sm ${getTotalStatus(scores.totalDifficulties).color}`}>
                          Kategori: {getTotalStatus(scores.totalDifficulties).label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Insight Text */}
                  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100">
                    <h4 className="text-lg font-bold font-fredoka text-gray-800 mb-4 flex items-center gap-2">
                      <Sparkles className="text-secondary-500" size={20} />
                      Insight Adaptasi Game
                    </h4>
                    <p className="text-gray-600 font-outfit leading-relaxed">
                      Berdasarkan skrining awal, tingkat <strong>Atensi & Hiperaktivitas</strong> Ananda berada di kategori <span className="font-bold underline decoration-secondary-500 decoration-2 underline-offset-4">{getHyperStatus(scores.subScores.hiperaktivitas)}</span>. 
                      Game Robo Mind akan mengadaptasikan tingkat kesulitan awal pada modul <em>Logika Robot</em> dan <em>Misi Matematika</em> untuk mengoptimalkan tingkat fokus dan interaksi spesifik ini.
                    </p>
                  </div>

                  {/* SaaS Upsell */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-gray-900 p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-800 relative overflow-hidden group"
                  >
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 blur-3xl rounded-full transition-transform group-hover:scale-150 duration-700"></div>
                    
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                      <div className="p-2 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-lg text-white">
                        <Lock size={18} />
                      </div>
                      <h4 className="text-xl font-bold font-fredoka text-white">Buka Potensi Penuh</h4>
                    </div>
                    
                    <p className="text-gray-300 font-outfit text-sm leading-relaxed mb-6 relative z-10">
                      Ingin Laporan Analisis Mingguan Mendalam & Rekomendasi Aktivitas Nyata dari Psikolog Anak? Hubungkan Akun Game Anda dan Berlangganan Paket Premium SaaS Sekarang.
                    </p>
                    
                    <button className="w-full relative z-10 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-gray-900 bg-gradient-to-r from-secondary-400 to-secondary-500 hover:from-secondary-300 hover:to-secondary-400 shadow-lg shadow-secondary-500/25 transition-all">
                      Aktifkan Premium SaaS Analysis <ArrowRight size={18} />
                    </button>
                  </motion.div>

                  <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                    <Link to="/chatbot" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-100 hover:text-primary-700 rounded-xl font-bold shadow-sm transition-all">
                      <Bot size={20} /> Konsultasi Hasil
                    </Link>
                    <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-bold shadow-sm transition-all">
                      <CheckCircle2 size={20} className="text-emerald-500" /> Selesai & Kembali
                    </Link>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ScreeningQuiz;
