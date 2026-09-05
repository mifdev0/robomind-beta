import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/ChatbotWidget';
import { ScrollProgressBar, ScrollToTopButton } from '../components/ScrollEffects';
import { Download, Smartphone, ShieldCheck, Gamepad2, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const DownloadPage = () => {
  return (
    <div className="min-h-screen font-outfit text-gray-800 dark:text-gray-100 bg-slate-950 overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <ScrollProgressBar />

      <main className="flex-grow pt-28 pb-16 px-4 max-w-5xl mx-auto w-full">
        {/* Hero Download Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-xs font-bold mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <Sparkles size={16} /> Aplikasi Android Resmi RoboMind
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl font-black text-white font-fredoka mb-4 leading-tight"
          >
            Unduh Game <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">RoboMind APK</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-medium"
          >
            Dapatkan pengalaman bermain 14 game edukasi robotika dan coding yang super lancar, tanpa iklan, dan bebas dari gangguan di perangkat Android anak Anda.
          </motion.p>
        </div>

        {/* Download Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-b from-[#0d1b33] to-[#070d1e] rounded-3xl border border-cyan-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: App Showcase */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg mb-4 flex items-center justify-center">
                <img src="/robomind_robot_avatar.png" alt="RoboMind App Icon" className="w-full h-full object-cover rounded-3xl" />
              </div>
              
              <h2 className="text-2xl font-black text-white font-fredoka mb-1">RoboMind Cyber Game v1.0</h2>
              <p className="text-cyan-400 text-xs font-bold mb-4">Untuk Android 7.0 (Nougat) & Lebih Baru</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6 text-xs text-slate-300">
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700">📦 Ukuran: ~45 MB</span>
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700">⚡ Bebas Iklan</span>
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700">🎮 14 Mini Game</span>
              </div>

              {/* Direct Download Link */}
              <a
                href="https://github.com/mifdev0/robomind-coba/releases/latest/download/RoboMind.apk"
                download="RoboMind.apk"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white font-black text-base shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] active:scale-95 transition-all cursor-pointer"
              >
                <Download size={22} className="animate-bounce" />
                <span>UNDUH APK SEKARANG (.APK)</span>
              </a>
              <span className="text-[10px] text-slate-400 mt-2">Versi Terbuka Aman • 100% Bebas Virus & Bebas Biaya</span>
            </div>

            {/* Right: Features List */}
            <div className="bg-[#050a16]/80 rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                <Gamepad2 size={18} className="text-cyan-400" /> Keunggulan Versi Aplikasi Mobile:
              </h3>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300"><strong className="text-white">Langsung Main Tanpa Lewat Web:</strong> Begitu aplikasi dibuka di HP, anak langsung disambut oleh Cyber Game Dashboard.</p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300"><strong className="text-white">Autentikasi Otomatis:</strong> Login 1x di awal, sesi akan tersimpan seterusnya tanpa perlu ketik ulang.</p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300"><strong className="text-white">Live Telemetry Supabase:</strong> Progres bermain, poin XP, dan koin di HP otomatis terhubung ke Dashboard Orang Tua Anda.</p>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300"><strong className="text-white">Pengontrol Waktu Bermain (Screentime):</strong> Fitur pembatas waktu otomatis 60 menit terintegrasi langsung di aplikasi.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How to Install Steps */}
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Smartphone className="text-cyan-400" /> Cara Memasang File APK di HP Android:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center mb-2">1</span>
              <p className="font-bold text-white mb-1">Unduh File APK</p>
              <p>Klik tombol <strong>Unduh APK Sekarang</strong> di atas dan tunggu hingga unduhan selesai di browser HP Anda.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center mb-2">2</span>
              <p className="font-bold text-white mb-1">Izinkan Sumber Tidak Dikenal</p>
              <p>Jika muncul peringatan keamanan, buka <i>Pengaturan ➔ Keamanan ➔ Izinkan Penginstallan dari Sumber Ini</i>.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center mb-2">3</span>
              <p className="font-bold text-white mb-1">Buka & Mainkan</p>
              <p>Klik file <code>RoboMind.apk</code> yang diunduh, tekan <strong>Install</strong>, dan aplikasi siap dimainkan anak Anda!</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTopButton />
      <ChatbotWidget />
    </div>
  );
};

export default DownloadPage;
