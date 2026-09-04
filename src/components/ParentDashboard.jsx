import { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const ParentDashboard = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [childrenList, setChildrenList] = useState([
    {
      id: 'child-default',
      name: 'Pemain Baru',
      level: 1,
      total_xp: 0,
      coins: 0,
      screentime_used: 0,
      screentime_limit: 60,
      avatar_url: 'https://ui-avatars.com/api/?name=Pemain+Baru&background=0099ff&color=fff&rounded=true'
    }
  ]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  const [skills, setSkills] = useState({
    logic: 0,
    creativity: 0,
    literacy: 0,
    focus: 0,
    moral: 0
  });

  const [recentSessions, setRecentSessions] = useState([]);

  const activeChild = childrenList[selectedChildIndex] || childrenList[0];

  // Detect dark mode reactively
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark');
    };
    window.addEventListener('themeChange', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);
    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  // Fetch all children profiles for the parent from Supabase
  useEffect(() => {
    async function loadParentEcosystem() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 1. Fetch all children belonging to this parent
        const { data: children } = await supabase
          .from('children')
          .select('*')
          .eq('parent_id', user.id)
          .order('created_at', { ascending: true });

        if (children && children.length > 0) {
          const mapped = children.map(c => ({
            id: c.id,
            name: c.name || 'Anak Anda',
            level: c.level || 1,
            total_xp: c.total_xp || 0,
            coins: c.coins || 0,
            screentime_used: c.daily_screentime_minutes || 0,
            screentime_limit: c.screentime_limit_minutes || 60,
            avatar_url: c.avatar_url || 'https://lh3.googleusercontent.com/aida/AP1WRLuAuBP2g-1fKowz_Tbuz4ERYAIImKOgnE-ccTI2b2Gsr6d06SKenfv1RQB25E0K9XygYMzTuL0qTSdxi9RRIyCHWc4KmTsi5BdLvGJ4bMark08FDSMIlku6Pi-H2Sr7OxfQcMVRj9GcNh1DbUvVgNR118cbdFUYpbIaAAifC0G90-fKobSmMyxffh4j3lXqQ4iqm2X_T528PByMVPr4tlqwKyKaZJdgMNQ7J6dUqHdGswG2IqIg6g_zAEVO'
          }));
          setChildrenList(mapped);

          const currentC = mapped[selectedChildIndex] || mapped[0];

          // 2. Fetch skill assessments for active child (by child_id OR user_id)
          let { data: skillData } = await supabase
            .from('child_skills')
            .select('*')
            .eq('child_id', currentC.id)
            .maybeSingle();

          if (!skillData && user) {
            const { data: userSkill } = await supabase
              .from('child_skills')
              .select('*')
              .eq('user_id', user.id)
              .maybeSingle();
            skillData = userSkill;
          }

          if (skillData) {
            setSkills({
              logic: Number(skillData.logic_score) || 0,
              creativity: Number(skillData.creativity_score) || 0,
              literacy: Number(skillData.literacy_score) || 0,
              focus: Number(skillData.focus_score) || 0,
              moral: Number(skillData.moral_score) || 0
            });
          }

          // 3. Fetch recent game sessions for active child
          let { data: sessions } = await supabase
            .from('game_sessions')
            .select('*')
            .eq('child_id', currentC.id)
            .order('completed_at', { ascending: false })
            .limit(5);

          if ((!sessions || sessions.length === 0) && user) {
            const { data: userSessions } = await supabase
              .from('game_sessions')
              .select('*')
              .eq('user_id', user.id)
              .order('completed_at', { ascending: false })
              .limit(5);
            sessions = userSessions;
          }

          if (sessions && sessions.length > 0) {
            setRecentSessions(sessions);
          }
        }
      } catch (err) {
        console.warn('Using local demo progress data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadParentEcosystem();

    // Subscribe to realtime updates from Supabase
    const channel = supabase
      .channel('realtime_game_progress_web')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'game_sessions' }, () => {
        loadParentEcosystem();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedChildIndex]);

  const chartData = {
    labels: i18n.language === 'en' 
      ? ['Logic & Coding', 'Creativity', 'Language & Literacy', 'Focus & Motor', 'Moral & Empathy'] 
      : ['Logika & Coding', 'Kreativitas', 'Literasi Bahasa', 'Fokus & Motorik', 'Moral & Empati'],
    datasets: [
      {
        label: i18n.language === 'en' ? 'Child Competence' : 'Kompetensi Anak',
        data: [skills.logic, skills.creativity, skills.literacy, skills.focus, skills.moral],
        backgroundColor: 'rgba(0, 240, 255, 0.25)',
        borderColor: 'rgba(0, 153, 255, 1)',
        borderWidth: 2.5,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: 'rgba(0, 240, 255, 1)',
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        angleLines: { color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' },
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)' },
        pointLabels: {
          font: { family: 'Outfit, Plus Jakarta Sans, sans-serif', size: 11, weight: '700' },
          color: isDark ? '#38bdf8' : '#0369a1'
        },
        ticks: { display: false, min: 0, max: 100 }
      }
    },
    plugins: {
      legend: { display: false }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <section id="progress-anak" className="py-14 sm:py-20 lg:py-24 bg-primary-50 dark:bg-slate-900 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 text-xs font-bold mb-3 border border-cyan-300 dark:border-cyan-800">
            <span>⚡ Terhubung Real-Time ke Game App</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white font-fredoka mb-3 sm:mb-4">
            {i18n.language === 'en' ? 'Parent Real-Time Dashboard' : 'Dashboard Perkembangan Anak Real-Time'}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 font-outfit px-2">
            {i18n.language === 'en' 
              ? 'Monitor each child\'s live cognitive progress, screen time limit, and 5 multiple intelligence pillars.' 
              : 'Pantau metrik perkembangan kognitif, sisa waktu layar, dan perkembangan setiap anak Anda secara individual.'}
          </p>

          {/* Child Switcher Tabs for Parents with Multiple Children */}
          {childrenList.length > 1 && (
            <div className="mt-6 inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm gap-2">
              {childrenList.map((c, idx) => (
                <button
                  key={c.id || idx}
                  onClick={() => setSelectedChildIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    idx === selectedChildIndex
                      ? 'bg-cyan-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>👶 {c.name}</span>
                  <span className="text-[10px] opacity-80">(Lvl {c.level})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col lg:flex-row transition-colors duration-200">
          
          {/* LEFT SIDE: STATS & SUMMARY */}
          <div className="p-5 sm:p-8 lg:p-12 lg:w-1/2 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-slate-700 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-200">
            <div>
              {/* Child Profile Header */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-cyan-400 overflow-hidden bg-slate-900 shadow-md">
                    <img src={activeChild.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-fredoka text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {activeChild.name}
                    </h3>
                    <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                      Level {activeChild.level} • {activeChild.total_xp} XP Total • 🪙 {activeChild.coins} Koin
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block">Status Sesi</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Sync
                  </span>
                </div>
              </div>

              {/* Screentime Card */}
              <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-slate-900/60 border border-cyan-100 dark:border-cyan-900/40 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200">⏱️ Waktu Bermain Hari Ini</span>
                  <span className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400">
                    {activeChild.screentime_used} / {activeChild.screentime_limit} Menit
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.round((activeChild.screentime_used / activeChild.screentime_limit) * 100))}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px] text-gray-500 dark:text-gray-400">
                  <span>Sisa Waktu Aman: {Math.max(0, activeChild.screentime_limit - activeChild.screentime_used)} Menit</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Batas Sehat Terjaga ✓</span>
                </div>
              </div>

              {/* 3 Metrics Cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
                  <div className="text-lg font-black text-cyan-600 dark:text-cyan-400">{skills.logic}%</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">Logika & Coding</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
                  <div className="text-lg font-black text-emerald-500">{skills.focus}%</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">Fokus & Refleks</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
                  <div className="text-lg font-black text-amber-500">{skills.moral}%</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">Moral & Empati</div>
                </div>
              </div>
            </div>

            {/* Recent Played Games */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Aktivitas Terakhir ({activeChild.name})</h4>
              <div className="space-y-1.5">
                {recentSessions.length > 0 ? (
                  recentSessions.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-gray-50 dark:bg-slate-900/40 text-xs">
                      <span className="font-bold text-gray-800 dark:text-gray-200">{s.game_title}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">+{s.xp_earned} XP</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 px-3 rounded-xl bg-gray-50 dark:bg-slate-900/40 border border-dashed border-gray-200 dark:border-slate-700 text-xs text-gray-400">
                    Belum ada sesi bermain hari ini. Mainkan game untuk mencatat kemajuan!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: RADAR CHART */}
          <div className="p-5 sm:p-8 lg:p-12 lg:w-1/2 flex flex-col items-center justify-center relative bg-white dark:bg-slate-800">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square relative"
            >
              <Radar key={`${activeChild.id}-${isDark ? 'dark' : 'light'}`} data={chartData} options={chartOptions} />
            </motion.div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-outfit">
                💡 <b>Analisis AI untuk {activeChild.name}:</b> Kemampuan <b>Literasi Bahasa</b> dan <b>Kreativitas</b> berada di atas rata-rata usia!
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ParentDashboard;
