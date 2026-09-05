import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/ChatbotWidget';
import { ScrollProgressBar, ScrollToTopButton } from '../components/ScrollEffects';
import { Download, Smartphone, ShieldCheck, Gamepad2, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const DownloadPage = () => {
  return (
    <div className="min-h-screen font-outfit text-gray-800 bg-gradient-to-b from-primary-50/40 via-white to-slate-50 overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <ScrollProgressBar />

      <main className="flex-grow pt-28 pb-16 px-4 max-w-5xl mx-auto w-full">
        {/* Hero Download Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-bold mb-4 shadow-sm"
          >
            <Sparkles size={16} className="text-primary-600" /> Aplikasi Android Resmi RoboMind
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl font-black text-gray-900 font-fredoka mb-4 leading-tight"
          >
            Unduh Game <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-indigo-600 to-cyan-600">RoboMind APK</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto font-medium"
          >
            Dapatkan pengalaman bermain 14 game edukasi robotika dan coding yang super lancar, tanpa iklan, dan bebas dari gangguan di perangkat Android anak Anda.
          </motion.p>
        </div>

        {/* Download Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xl shadow-primary-500/5 relative overflow-hidden mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: App Showcase */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary-500 to-indigo-600 p-0.5 shadow-md shadow-primary-500/20 mb-4 flex items-center justify-center">
                <img src="/robomind_robot_avatar.png" alt="RoboMind App Icon" className="w-full h-full object-cover rounded-3xl" />
              </div>
              
              <h2 className="text-2xl font-black text-gray-900 font-fredoka mb-1">RoboMind Cyber Game v1.0</h2>
              <p className="text-primary-600 text-xs font-bold mb-4">Untuk Android 7.0 (Nougat) & Lebih Baru</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6 text-xs text-gray-600">
                <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-medium">📦 Ukuran: ~45 MB</span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-medium">⚡ Bebas Iklan</span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-medium">🎮 14 Mini Game</span>
              </div>

              {/* Direct Download Link */}
              <a
                href="https://github.com/mifdev0/robomind-coba/releases/latest/download/RoboMind.apk"
                download="RoboMind.apk"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 via-indigo-600 to-cyan-600 text-white font-black text-base shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <Download size={22} className="animate-bounce" />
                <span>UNDUH APK SEKARANG (.APK)</span>
              </a>
              <span className="text-[11px] text-gray-500 mt-2.5 font-medium">Versi Terbuka Aman • 100% Bebas Virus & Bebas Biaya</span>
            </div>

            {/* Right: Features List */}
            <div className="bg-gradient-to-br from-primary-50/60 to-indigo-50/40 rounded-2xl p-6 border border-primary-100/80 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-2">
                <Gamepad2 size={18} className="text-primary-600" /> Keunggulan Versi Aplikasi Mobile:
              </h3>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600"><strong className="text-gray-900">Langsung Main Tanpa Lewat Web:</strong> Begitu aplikasi dibuka di HP, anak langsung disambut oleh Cyber Game Dashboard.</p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600"><strong className="text-gray-900">Autentikasi Otomatis:</strong> Login 1x di awal, sesi akan tersimpan seterusnya tanpa perlu ketik ulang.</p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600"><strong className="text-gray-900">Live Telemetry Supabase:</strong> Progres bermain, poin XP, dan koin di HP otomatis terhubung ke Dashboard Orang Tua Anda.</p>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600"><strong className="text-gray-900">Pengontrol Waktu Bermain (Screentime):</strong> Fitur pembatas waktu otomatis 60 menit terintegrasi langsung di aplikasi.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How to Install Steps */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-lg shadow-gray-200/50">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Smartphone className="text-primary-600" /> Cara Memasang File APK di HP Android:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-primary-200 transition-all">
              <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center mb-3 text-xs">1</span>
              <p className="font-bold text-gray-900 mb-1 text-sm">Unduh File APK</p>
              <p className="leading-relaxed">Klik tombol <strong className="text-gray-900">Unduh APK Sekarang</strong> di atas dan tunggu hingga unduhan selesai di browser HP Anda.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-primary-200 transition-all">
              <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center mb-3 text-xs">2</span>
              <p className="font-bold text-gray-900 mb-1 text-sm">Izinkan Sumber Tidak Dikenal</p>
              <p className="leading-relaxed">Jika muncul peringatan keamanan, buka <i className="text-gray-800">Pengaturan ➔ Keamanan ➔ Izinkan Penginstallan dari Sumber Ini</i>.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-primary-200 transition-all">
              <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center mb-3 text-xs">3</span>
              <p className="font-bold text-gray-900 mb-1 text-sm">Buka & Mainkan</p>
              <p className="leading-relaxed">Klik file <code className="bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded font-mono text-[11px]">RoboMind.apk</code> yang diunduh, tekan <strong className="text-gray-900">Install</strong>, dan aplikasi siap dimainkan anak Anda!</p>
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
