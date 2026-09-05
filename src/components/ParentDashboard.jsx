
function generateAccessCode() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

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

  
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState(7);
  const [createdCodeAlert, setCreatedCodeAlert] = useState(null);

  const handleCreateChildProfile = async (e) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    const accessCode = generateAccessCode();
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(newChildName.trim())}&background=0099ff&color=fff&rounded=true`;

    const newChildObj = {
      name: newChildName.trim(),
      age: parseInt(newChildAge) || 7,
      level: 1,
      total_xp: 0,
      coins: 100,
      access_token: accessCode,
      access_code: accessCode,
      avatar_url: avatarUrl,
      daily_screentime_minutes: 0,
      screentime_limit_minutes: 60
    };

    if (user) {
      newChildObj.parent_id = user.id;
      try {
        const { data, error } = await supabase
          .from('children')
          .insert(newChildObj)
          .select()
          .single();

        if (error) {
          console.error("Supabase insert child error:", error);
          alert(`⚠️ Profil "${newChildObj.name}" gagal disimpan ke server: ${error.message}. Kode akses tidak akan bisa dipakai di game. Coba buka Dashboard Pemantauan lalu ulangi.`);
          return;
        }

        if (data) {
          newChildObj.id = data.id;
        }
      } catch (err) {
        console.error("Error creating child profile in Supabase:", err);
        alert(`⚠️ Gagal menyimpan profil "${newChildObj.name}" ke server. Pastikan Anda sudah login dan cek koneksi internet.`);
        return;
      }
    } else {
      newChildObj.id = 'child-' + Date.now();
    }

    setChildrenList(prev => [...prev, newChildObj]);
    setSelectedChildIndex(childrenList.length);
    setShowAddChildModal(false);
    setNewChildName('');
    setCreatedCodeAlert({ name: newChildName.trim(), code: accessCode });
  };

  const resetScreentime = async (childId) => {
    if (!window.confirm('Apakah yakin ingin mereset waktu bermain harian untuk anak ini? Waktu akan direset ke 0 menit.')) return;
    
    // Optimistic UI update
    setChildrenList(prev => prev.map(c => c.id === childId ? { ...c, screentime_used: 0 } : c));

    if (user && childId && !String(childId).startsWith('child-')) {
      try {
        const { error } = await supabase
          .from('children')
          .update({ daily_screentime_minutes: 0, updated_at: new Date().toISOString() })
          .eq('id', childId);
        if (error) {
          console.error("Screentime reset Supabase error:", error);
        }
      } catch (err) {
        console.error("Screentime reset error:", err);
      }
    }
    alert('✅ Waktu bermain telah direset ke 0 menit!');
  };

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
          const mapped = children.map(c => {
            const code = c.access_token || c.access_code || generateAccessCode();
            if (!c.access_token && !c.access_code && user) {
              supabase.from('children').update({ access_token: code, access_code: code }).eq('id', c.id)
                .then(r => { if (r.error) console.error("Supabase update child access code error:", r.error); })
                .catch(err => console.error("Supabase update child access code error:", err));
            }
            return {
              id: c.id,
              name: c.name || 'Anak Anda',
              level: c.level || 1,
              total_xp: c.total_xp || 0,
              coins: c.coins || 0,
              access_code: code,
              screentime_used: c.daily_screentime_minutes || 0,
              screentime_limit: c.screentime_limit_minutes || 60,
              avatar_url: c.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(c.name || 'Anak') + '&background=0099ff&color=fff&rounded=true'
            };
          });
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

          // 3. Fetch recent game sessions for active child
          let { data: sessions } = await supabase
            .from('game_sessions')
            .select('*')
            .eq('child_id', currentC.id)
            .order('completed_at', { ascending: false })
            .limit(10);

          if ((!sessions || sessions.length === 0) && user) {
            const { data: userSessions } = await supabase
              .from('game_sessions')
              .select('*')
              .eq('user_id', user.id)
              .order('completed_at', { ascending: false })
              .limit(10);
            sessions = userSessions;
          }

          if (sessions && sessions.length > 0) {
            setRecentSessions(sessions);
          }

          // Compute skills with base default (50%) + increments from played sessions if skillData is fresh
          let computedLogic = skillData ? Number(skillData.logic_score) || 0 : 50;
          let computedCreativity = skillData ? Number(skillData.creativity_score) || 0 : 50;
          let computedLiteracy = skillData ? Number(skillData.literacy_score) || 0 : 50;
          let computedFocus = skillData ? Number(skillData.focus_score) || 0 : 50;
          let computedMoral = skillData ? Number(skillData.moral_score) || 0 : 50;

          // If scores in DB are 0 or no row existed, compute baseline from session count
          if (sessions && sessions.length > 0 && (computedLogic === 0 && computedFocus === 0)) {
            computedLogic = 50; computedCreativity = 50; computedLiteracy = 50; computedFocus = 50; computedMoral = 50;
            sessions.forEach(s => {
              const cat = (s.category || '').toLowerCase();
              const gId = (s.game_id || s.game_title || '').toLowerCase();
              if (cat.includes('fokus') || gId.includes('screw') || gId.includes('rogue')) computedFocus = Math.min(100, computedFocus + 5);
              else if (cat.includes('literasi') || gId.includes('link')) computedLiteracy = Math.min(100, computedLiteracy + 5);
              else if (cat.includes('moral') || gId.includes('jek')) computedMoral = Math.min(100, computedMoral + 5);
              else if (cat.includes('kognitif') || gId.includes('escape') || gId.includes('circuit')) {
                computedLogic = Math.min(100, computedLogic + 5);
                computedCreativity = Math.min(100, computedCreativity + 3);
              }
            });
          }

          setSkills({
            logic: computedLogic || 50,
            creativity: computedCreativity || 50,
            literacy: computedLiteracy || 50,
            focus: computedFocus || 50,
            moral: computedMoral || 50
          });
        }
      } catch (err) {
        console.warn('Using local demo progress data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadParentEcosystem();

    // Subscribe to realtime updates from Supabase for sessions, skills, and children
    const channel = supabase
      .channel('realtime_game_progress_web')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions' }, () => {
        loadParentEcosystem();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'child_skills' }, () => {
        loadParentEcosystem();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'children' }, () => {
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

          {/* Add Child & Switcher Tabs */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setShowAddChildModal(true)}
                className="px-4 py-2 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>➕ Tambah Anak Baru (Buat Kode Akses)</span>
              </button>
            </div>
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

                    {/* 8-Digit Access Code Badge */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-700 text-xs">
                        <span className="font-bold text-gray-700 dark:text-gray-200">🔑 Kode Akses Game:</span>
                        <span className="font-mono font-black text-cyan-700 dark:text-cyan-300 tracking-widest text-sm">
                          {activeChild.access_code ? `${activeChild.access_code.slice(0, 4)} - ${activeChild.access_code.slice(4)}` : '1234 - 5678'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const code = activeChild.access_code || '12345678';
                          navigator.clipboard.writeText(code);
                          alert(`✅ Kode Akses (${code}) disalin! Berikan kode ini ke anak untuk masuk di Aplikasi Game.`);
                        }}
                        className="text-xs font-extrabold px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white transition-all shadow-sm active:scale-95 flex items-center gap-1"
                      >
                        📋 Salin Kode
                      </button>
                    </div>
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
                  <button
                    onClick={() => resetScreentime(activeChild.id)}
                    className="ml-2 text-xs font-bold text-cyan-400 hover:text-white">
                    🔄 Reset
                  </button>
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

            {/* Recent Played Games with Impacted PFC Pillars */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Aktivitas Terbaru ({activeChild.name})
                </h4>
                {recentSessions.length > 5 && (
                  <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950 px-2 py-0.5 rounded-md">
                    Scroll untuk lihat semua ({recentSessions.length})
                  </span>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700">
                {recentSessions.length > 0 ? (
                  recentSessions.map((s, idx) => {
                    const title = s.game_title || s.game_id || 'Robo Game';
                    const cat = (s.category || '').toLowerCase();
                    const gId = (s.game_id || title).toLowerCase();
                    
                    let pfcBadge = '🧠 Working Memory +5%';
                    let badgeColor = 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800';

                    if (cat.includes('fokus') || gId.includes('screw') || gId.includes('rogue') || gId.includes('circle')) {
                      pfcBadge = '🎯 Inhibitory Control +5%';
                      badgeColor = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
                    } else if (cat.includes('literasi') || gId.includes('link')) {
                      pfcBadge = '📚 Language & Literacy +5%';
                      badgeColor = 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800';
                    } else if (cat.includes('moral') || gId.includes('jek') || gId.includes('drop')) {
                      pfcBadge = '🤝 Moral & Empathy +5%';
                      badgeColor = 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800';
                    } else if (gId.includes('escape') || gId.includes('charge') || gId.includes('maze')) {
                      pfcBadge = '🔄 Cognitive Flexibility +5%';
                      badgeColor = 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800';
                    }

                    // Format timestamp
                    let timeFormatted = 'Baru saja';
                    if (s.completed_at || s.created_at) {
                      try {
                        const dateObj = new Date(s.completed_at || s.created_at);
                        const hours = String(dateObj.getHours()).padStart(2, '0');
                        const mins = String(dateObj.getMinutes()).padStart(2, '0');
                        const isToday = new Date().toDateString() === dateObj.toDateString();
                        timeFormatted = isToday ? `${hours}:${mins}` : `${dateObj.getDate()}/${dateObj.getMonth() + 1} ${hours}:${mins}`;
                      } catch (e) {}
                    }

                    return (
                      <div key={idx} className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-gray-900 dark:text-white">{title}</span>
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Level {s.level_reached || 1}</span>
                            <span className="text-[9px] font-extrabold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-300 dark:border-cyan-800 flex items-center gap-0.5">
                              🕒 {timeFormatted}
                            </span>
                          </div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold border w-max ${badgeColor}`}>
                            {pfcBadge}
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-emerald-600 dark:text-emerald-400 font-black block">+{s.xp_earned || 50} XP</span>
                          <span className="text-[10px] text-amber-500 font-bold block">🪙 +{s.coins_earned || 20} Koin</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 px-3 rounded-xl bg-gray-50 dark:bg-slate-900/40 border border-dashed border-gray-200 dark:border-slate-700 text-xs text-gray-400">
                    Belum ada sesi bermain hari ini. Mainkan game untuk mencatat kemajuan!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: RADAR CHART & PFC EXECUTIVE FUNCTION ANALYSIS */}
          <div className="p-5 sm:p-8 lg:p-10 lg:w-1/2 flex flex-col items-center justify-between relative bg-white dark:bg-slate-800">
            <div className="w-full text-center mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800">
                🧠 Prefrontal Cortex (PFC) Analysis
              </span>
              <h4 className="text-base font-extrabold text-gray-900 dark:text-white mt-1 font-fredoka">
                Analisis Fungsi Eksekutif Otak ({activeChild.name})
              </h4>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square relative my-2"
            >
              <Radar key={`${activeChild.id}-${isDark ? 'dark' : 'light'}`} data={chartData} options={chartOptions} />
            </motion.div>
            
            {/* LAYER 2 & 3: PFC BRAIN PROFILE BADGE & ACTIONABLE AI RECOMMENDATIONS */}
            {(() => {
              // Calculate dominant PFC strength & brain archetype
              const pfcScores = [
                { name: 'Working Memory (Logika)', score: skills.logic, key: 'logic', color: 'from-cyan-500 to-blue-500', games: 'Robot Circuit, Energy Core, Robo Link' },
                { name: 'Cognitive Flexibility (Kreativitas)', score: skills.creativity, key: 'creativity', color: 'from-amber-500 to-orange-500', games: 'Robot Escape, Robo Charge, Robo Maze' },
                { name: 'Language & Literacy', score: skills.literacy, key: 'literacy', color: 'from-purple-500 to-indigo-500', games: 'Robo Link, Word Puzzle' },
                { name: 'Inhibitory Control & Focus', score: skills.focus, key: 'focus', color: 'from-emerald-500 to-teal-500', games: 'Screw Spin, Robo Circle, Rogue Soul' },
                { name: 'Moral Reasoning & Empathy', score: skills.moral, key: 'moral', color: 'from-rose-500 to-pink-500', games: 'Robo-Jek, Pick and Drop' },
              ];

              const sorted = [...pfcScores].sort((a, b) => b.score - a.score);
              const topPfc = sorted[0];
              const lowestPfc = sorted[sorted.length - 1];

              let archetypeTitle = "🚀 Strategic Problem Solver";
              let archetypeDesc = "Memiliki keseimbangan logika spasial dan daya pemecahan masalah yang baik.";

              if (topPfc.key === 'logic') {
                archetypeTitle = "🧩 Strategic Logic Thinker";
                archetypeDesc = "Sangat kuat dalam logika berurutan, Working Memory, dan pemecahan puzzle skematis.";
              } else if (topPfc.key === 'focus') {
                archetypeTitle = "🎯 High-Focus Tactician";
                archetypeDesc = "Unggul dalam Inhibitory Control (kontrol impuls), ketahanan fokus, dan respons taktis.";
              } else if (topPfc.key === 'creativity') {
                archetypeTitle = "🔄 Flexible Adaptor & Creator";
                archetypeDesc = "Memiliki Fleksibilitas Kognitif tinggi, mampu berpikir cepat saat situasi tantangan berubah.";
              } else if (topPfc.key === 'moral') {
                archetypeTitle = "🤝 Empathic Social Leader";
                archetypeDesc = "Unggul dalam pertimbangan etis, empati sosial, dan pengambilan keputusan bermoral.";
              } else if (topPfc.key === 'literacy') {
                archetypeTitle = "📚 Linguistic Conceptualizer";
                archetypeDesc = "Kuat dalam pengenalan pola bahasa, memori verbal, dan komunikasi konsep.";
              }

              return (
                <div className="w-full space-y-3 mt-2">
                  {/* Layer 2: Brain Archetype Badge */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase text-cyan-400">Profil Karakter Otak (PFC Profile)</span>
                      <span className="text-xs font-bold text-amber-400">Skor Tertinggi: {topPfc.score}%</span>
                    </div>
                    <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                      <span>{archetypeTitle}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                      {archetypeDesc}
                    </p>
                  </div>

                  {/* Layer 3: Actionable AI Insight */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-700 text-left text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-gray-200">
                      <span>💡 <b>Rekomendasi Pendampingan Orang Tua:</b></span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                      • <b>Kekuatan PFC Utama:</b> <span className="text-emerald-600 dark:text-emerald-400 font-bold">{topPfc.name} ({topPfc.score}%)</span> terasah dengan baik lewat game <i>{topPfc.games}</i>.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                      • <b>Saran Penguatan:</b> Untuk mengasah area <span className="text-cyan-600 dark:text-cyan-400 font-bold">{lowestPfc.name} ({lowestPfc.score}%)</span>, ajak {activeChild.name} lebih sering memainkan mini-game <i>{lowestPfc.games}</i> atau latihan interaksi langsung di rumah.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

        </div>
      </div>
    
      {/* MODAL: TAMBAH PROFIL ANAK & CODE GENERATOR */}
      {showAddChildModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full border border-cyan-400 shadow-2xl relative">
            <button 
              onClick={() => setShowAddChildModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white font-bold"
            >
              ✕
            </button>
            
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-2 text-2xl">
                👶
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-fredoka">Tambah Profil Anak</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sistem akan membuatkan 8-digit Kode Akses Game secara otomatis</p>
            </div>

            <form onSubmit={handleCreateChildProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Nama Panggilan Anak</label>
                <input
                  type="text"
                  placeholder="Contoh: Kenzo, Aira, Rafa..."
                  value={newChildName}
                  onChange={e => setNewChildName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Usia Anak (Tahun)</label>
                <input
                  type="number"
                  min="3"
                  max="15"
                  value={newChildAge}
                  onChange={e => setNewChildAge(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                Buat Profil & Generate Kode Akses
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ALERT MODAL: HASIL KODE AKSES CREATED */}
      {createdCodeAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full border-2 border-emerald-400 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-500 flex items-center justify-center mx-auto mb-3 text-3xl">
              🎉
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-fredoka mb-1">
              Profil "{createdCodeAlert.name}" Berhasil Dibuat!
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Berikan Kode Akses 8-Digit ini kepada anak untuk masuk di Aplikasi Game:
            </p>

            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 mb-4">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">🔑 KODE AKSES GAME</span>
              <span className="font-mono font-black text-2xl text-cyan-600 dark:text-cyan-400 tracking-widest">
                {createdCodeAlert.code.slice(0, 4)} - {createdCodeAlert.code.slice(4)}
              </span>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(createdCodeAlert.code);
                alert('✅ Kode Akses disalin ke clipboard!');
                setCreatedCodeAlert(null);
              }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              Salin Kode & Selesai
            </button>
          </div>
        </div>
      )}

    </section>
  );
};

export default ParentDashboard;
