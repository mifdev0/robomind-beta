import { motion } from 'framer-motion';
import { BrainCircuit, Eye, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ScreeningPillars = () => {
  const { i18n } = useTranslation();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.92, rotate: -1 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 80,
        damping: 14
      } 
    }
  };

  const pillars = [
    {
      id: 1,
      icon: <BrainCircuit size={28} className="sm:size-[32] text-orange-500" />,
      title: i18n.language === 'en' ? "Basic Cognitive Evaluation" : "Evaluasi Kognitif Dasar",
      desc: i18n.language === 'en' ? "Initial logic mapping to determine base game difficulty (dynamic difficulty adaptive)." : "Pemetaan logika awal untuk menentukan tingkat kesulitan dasar game (dynamic difficulty adaptive).",
      bgColor: "bg-orange-50"
    },
    {
      id: 2,
      icon: <Eye size={28} className="sm:size-[32] text-green-500" />,
      title: i18n.language === 'en' ? "Learning Style Identification" : "Identifikasi Gaya Belajar",
      desc: i18n.language === 'en' ? "Find out if your child leans towards Visual, Auditory, or Kinesthetic learning styles." : "Mengetahui apakah anak condong ke gaya Visual, Auditori, atau Kinestetik.",
      bgColor: "bg-green-50"
    },
    {
      id: 3,
      icon: <Sparkles size={28} className="sm:size-[32] text-blue-500" />,
      title: i18n.language === 'en' ? "Interest & Talent Mapping" : "Pemetaan Minat & Bakat",
      desc: i18n.language === 'en' ? "Interactive basic psychological screening to uncover your child's hidden potential." : "Skrining psikologi dasar interaktif untuk melihat potensi terpendam anak.",
      bgColor: "bg-blue-50"
    }
  ];

  return (
    <section id="skrining-awal" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 font-fredoka mb-3 sm:mb-4">
            {i18n.language === 'en' ? '3 Pillars of Early Screening' : '3 Pilar Skrining Awal'}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 font-outfit px-2">
            {i18n.language === 'en' ? 'Understand your child\u2019s unique learning profile before they begin their educational adventure with Robo Mind.' : 'Kenali profil belajar unik anak Anda sebelum mereka memulai petualangan edukasi bersama Robo Mind.'}
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {pillars.map((pillar) => (
            <motion.div 
              key={pillar.id}
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
              }}
              className="p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm sm:shadow-lg bg-white relative overflow-hidden group transition-all duration-300"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl ${pillar.bgColor} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                {pillar.icon}
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold font-fredoka text-gray-900 mb-2 sm:mb-3">{pillar.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 font-outfit leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ScreeningPillars;
