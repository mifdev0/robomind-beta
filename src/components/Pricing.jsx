import React, { useState } from 'react';
import { Check, Star, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PaymentModal from './PaymentModal';

const plans = [
  {
    id: 'bronze',
    name: {
      en: 'Bronze (Free)',
      id: 'Bronze (Gratis)'
    },
    price: 'Rp 0',
    period: {
      en: 'forever',
      id: 'selamanya'
    },
    desc: {
      en: 'Early access to get to know the world of basic logic.',
      id: 'Akses awal untuk mengenal dunia logika dasar.'
    },
    features: [
      { text: { en: 'Access to basic game modules', id: 'Akses modul game dasar' }, included: true },
      { text: { en: 'Monthly general development chart', id: 'Diagram perkembangan umum bulanan' }, included: true },
      { text: { en: 'Weekly AI-powered analysis', id: 'Analisis bertenaga AI mingguan' }, included: false },
      { text: { en: 'Expert consultation via AI Chatbot', id: 'Konsultasi ahli via Chatbot AI' }, included: false }
    ],
    buttonText: {
      en: 'Start for Free',
      id: 'Mulai Gratis'
    },
    styles: {
      card: 'bg-white border-gray-200 shadow-sm hover:shadow-md text-gray-900',
      name: 'text-gray-900',
      price: 'text-gray-900',
      period: 'text-gray-500',
      desc: 'text-gray-600',
      featureText: 'text-gray-600',
      featureIcon: 'text-green-500',
      button: 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold font-outfit'
    },
    icon: 'star',
    iconColor: 'text-orange-500'
  },
  {
    id: 'silver',
    name: {
      en: 'Silver',
      id: 'Silver'
    },
    price: 'Rp 49.000',
    period: {
      en: 'month',
      id: 'bulan'
    },
    desc: {
      en: 'Intermediate features for step-by-step cognitive growth.',
      id: 'Fitur tingkat menengah untuk pertumbuhan kognitif bertahap.'
    },
    features: [
      { text: { en: 'Access to basic & intermediate game modules', id: 'Akses modul game dasar & menengah' }, included: true },
      { text: { en: 'Bi-weekly development chart', id: 'Diagram perkembangan 2 mingguan' }, included: true },
      { text: { en: 'Weekly AI-powered analysis (Standard)', id: 'Analisis bertenaga AI mingguan (Standar)' }, included: true },
      { text: { en: 'AI Chatbot consultation (50 msgs/day)', id: 'Konsultasi Chatbot AI (50 pesan/hari)' }, included: true }
    ],
    buttonText: {
      en: 'Choose Silver',
      id: 'Pilih Silver'
    },
    styles: {
      card: 'bg-white border-slate-200 shadow-sm hover:shadow-md text-slate-900',
      name: 'text-slate-900',
      price: 'text-slate-900',
      period: 'text-slate-500',
      desc: 'text-slate-600',
      featureText: 'text-slate-600',
      featureIcon: 'text-primary-500',
      button: 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-outfit'
    },
    icon: 'zap',
    iconColor: 'text-slate-500'
  },
  {
    id: 'gold',
    name: {
      en: 'Gold',
      id: 'Gold'
    },
    price: 'Rp 99.000',
    period: {
      en: 'month',
      id: 'bulan'
    },
    desc: {
      en: 'Full assistance to maximize your little one\'s potential.',
      id: 'Pendampingan penuh untuk memaksimalkan potensi si kecil.'
    },
    features: [
      { text: { en: 'Access to all interactive game modules', id: 'Akses ke semua modul game interaktif' }, included: true },
      { text: { en: 'Weekly in-depth AI-powered analysis', id: 'Analisis mendalam bertenaga AI secara mingguan' }, included: true },
      { text: { en: '24/7 Unlimited AI Chatbot consultation', id: 'Konsultasi Chatbot AI 24/7 tanpa batas' }, included: true },
      { text: { en: 'Monthly psychologist recommendations', id: 'Rekomendasi bulanan dari Psikolog Anak' }, included: true }
    ],
    buttonText: {
      en: 'Subscribe Gold',
      id: 'Langganan Gold'
    },
    featured: true,
    badge: {
      en: 'Most Popular',
      id: 'Paling Populer'
    },
    styles: {
      card: 'bg-gray-900 border-amber-500/40 shadow-2xl shadow-amber-500/10 ring-2 ring-amber-500 text-white',
      name: 'text-white',
      price: 'text-amber-400',
      period: 'text-gray-400',
      desc: 'text-gray-300',
      featureText: 'text-gray-300',
      featureIcon: 'text-amber-400',
      button: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold shadow-lg shadow-amber-500/20 font-outfit'
    },
    icon: 'star',
    iconColor: 'text-amber-400 fill-amber-400'
  },
  {
    id: 'platinum',
    name: {
      en: 'Platinum',
      id: 'Platinum'
    },
    price: 'Rp 199.000',
    period: {
      en: 'month',
      id: 'bulan'
    },
    desc: {
      en: 'Ultimate package with direct expert child psychologist consultation.',
      id: 'Paket terlengkap dengan konsultasi langsung psikolog anak ahli.'
    },
    features: [
      { text: { en: 'Access to all game modules & early beta features', id: 'Akses seluruh modul game & fitur beta awal' }, included: true },
      { text: { en: 'Real-time AI diagnostic & analysis reports', id: 'Analisis AI real-time & laporan diagnostik' }, included: true },
      { text: { en: 'Priority 24/7 AI + human expert chat', id: 'Konsultasi prioritas 24/7 AI + psikolog anak' }, included: true },
      { text: { en: '1-on-1 monthly video session with Psychologist', id: 'Sesi video 1-on-1 bulanan dengan Psikolog Anak' }, included: true }
    ],
    buttonText: {
      en: 'Go Platinum',
      id: 'Pilih Platinum'
    },
    styles: {
      card: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/40 shadow-xl text-white',
      name: 'text-white',
      price: 'text-indigo-400',
      period: 'text-gray-400',
      desc: 'text-gray-300',
      featureText: 'text-gray-300',
      featureIcon: 'text-indigo-400',
      button: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/20 font-outfit'
    },
    icon: 'award',
    iconColor: 'text-indigo-400'
  }
];

const getIcon = (iconName, colorClass) => {
  switch (iconName) {
    case 'zap':
      return <Zap size={20} className={`sm:size-[24] ${colorClass}`} />;
    case 'award':
      return <Award size={20} className={`sm:size-[24] ${colorClass}`} />;
    case 'star':
    default:
      return <Star size={20} className={`sm:size-[24] ${colorClass}`} />;
  }
};

const Pricing = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'id';

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanClick = (plan) => {
    if (plan.id === 'bronze') {
      localStorage.setItem('user_subscription', JSON.stringify({ plan: 'bronze', active: true }));
      window.dispatchEvent(new Event('subscriptionChange'));
      alert(lang === 'en' ? 'Bronze Plan activated successfully!' : 'Paket Bronze berhasil diaktifkan!');
      return;
    }

    setSelectedPlan(plan);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (planId) => {
    localStorage.setItem('user_subscription', JSON.stringify({ plan: planId, active: true }));
    window.dispatchEvent(new Event('subscriptionChange'));
  };

  return (
    <section id="berlangganan" className="py-14 sm:py-20 lg:py-24 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-200">
      <div className="absolute top-0 inset-x-0 h-48 sm:h-64 bg-gradient-to-b from-primary-50 to-white dark:from-primary-950/20 dark:to-slate-900 z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 font-fredoka mb-3 sm:mb-4">
            {lang === 'en' ? 'Subscribe & Optimize Potential' : 'Berlangganan & Optimalkan Potensi'}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 font-outfit px-2">
            {lang === 'en' ? 'Choose the package that suits your child\'s evaluation and guidance needs.' : 'Pilih paket yang sesuai dengan kebutuhan evaluasi dan bimbingan anak Anda.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto items-stretch">
          {plans.map((plan) => {
            const isFeatured = plan.featured;
            const cardStyles = plan.styles.card;
            
            return (
              <motion.div 
                key={plan.id}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 border transition-all flex flex-col justify-between relative overflow-hidden ${cardStyles}`}
              >
                {isFeatured && plan.badge && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-primary-500 to-secondary-500 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-bl-xl uppercase tracking-wider">
                    {plan.badge[lang]}
                  </div>
                )}
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getIcon(plan.icon, plan.iconColor)}
                    <h3 className={`text-xl sm:text-2xl font-bold font-fredoka ${plan.styles.name}`}>
                      {plan.name[lang]}
                    </h3>
                  </div>
                  
                  <div className={`text-3xl sm:text-4xl font-extrabold mb-4 sm:mb-6 ${plan.styles.price}`}>
                    {plan.price}{' '}
                    <span className={`text-sm sm:text-base font-medium ${plan.styles.period}`}>
                      /{plan.period[lang]}
                    </span>
                  </div>
                  
                  <p className={`text-sm sm:text-base mb-6 font-outfit leading-relaxed ${plan.styles.desc}`}>
                    {plan.desc[lang]}
                  </p>
                  
                  <ul className="space-y-3 sm:space-y-4 mb-8">
                    {plan.features.map((feature, idx) => {
                      const isIncluded = feature.included;
                      return (
                        <li 
                          key={idx} 
                          className={`flex items-start gap-3 ${!isIncluded ? 'opacity-40' : ''}`}
                        >
                          <Check 
                            size={18} 
                            className={`shrink-0 mt-0.5 ${isIncluded ? plan.styles.featureIcon : 'text-gray-400'}`} 
                          />
                          <span className={`text-sm sm:text-base font-outfit ${isIncluded ? plan.styles.featureText : 'text-gray-400'}`}>
                            {feature.text[lang]}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                
                <button 
                  onClick={() => handlePlanClick(plan)}
                  className={`w-full py-3 sm:py-3.5 px-4 rounded-full font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer ${plan.styles.button}`}
                >
                  {plan.buttonText[lang]}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Manual Payment Gateway Modal */}
      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        plan={selectedPlan}
        onSuccess={handlePaymentSuccess}
      />
    </section>
  );
};

export default Pricing;
