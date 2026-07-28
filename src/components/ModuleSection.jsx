import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const ModuleSection = () => {
  const { i18n } = useTranslation();
  const modules = [
    {
      id: 1,
      title: i18n.language === 'en' ? "Introduction to Robotics" : "Pengenalan Robotika",
      description: i18n.language === 'en' ? "Basic module to understand what robots are and how they work in the real world." : "Modul dasar untuk memahami apa itu robot dan bagaimana mereka bekerja di dunia nyata.",
      price: i18n.language === 'en' ? "Free" : "Gratis",
      img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
      isLocked: false,
    },
    {
      id: 2,
      title: i18n.language === 'en' ? "Basic Programming Logic" : "Logika Pemrograman Dasar",
      description: i18n.language === 'en' ? "Learn to think like a programmer with simple logic exercises." : "Pelajari cara berpikir layaknya seorang programmer dengan latihan logika sederhana.",
      price: i18n.language === 'en' ? "Free" : "Gratis",
      img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
      isLocked: false,
    },
    {
      id: 3,
      title: i18n.language === 'en' ? "Algorithm Exploration" : "Eksplorasi Algoritma",
      description: i18n.language === 'en' ? "Understand algorithm concepts by compiling systematic steps through games." : "Pahami konsep algoritma dengan menyusun langkah-langkah sistematis melalui game.",
      price: i18n.language === 'en' ? "Free" : "Gratis",
      img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80",
      isLocked: false,
    },
    {
      id: 4,
      title: i18n.language === 'en' ? "Block Programming Basics" : "Dasar Pemrograman Block",
      description: i18n.language === 'en' ? "Learn basic algorithm concepts using interactive block programming." : "Pelajari konsep dasar algoritma dengan menggunakan block programming yang interaktif.",
      price: "Rp 50.000",
      img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80",
      isLocked: false,
    },
    {
      id: 5,
      title: i18n.language === 'en' ? "Simple Animation" : "Animasi Sederhana",
      description: i18n.language === 'en' ? "Create your first animation and understand how frame by frame works in games." : "Buat animasi pertamamu dan pahami bagaimana frame by frame bekerja dalam game.",
      price: "Rp 75.000",
      img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
      isLocked: false,
    },
    {
      id: 6,
      title: i18n.language === 'en' ? "Advanced Logic & Basic AI" : "Logika Lanjutan & AI Dasar",
      description: i18n.language === 'en' ? "Premium module that teaches basic AI concepts and complex logic for 3D games." : "Modul premium yang mengajarkan konsep AI dasar dan logika kompleks untuk game 3D.",
      price: i18n.language === 'en' ? "Subscription" : "Berlangganan",
      img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80",
      isLocked: true,
    }
  ];

  return (
    <section id="modul-pembelajaran" className="bg-gray-50 py-10 sm:py-16 lg:py-24 border-b border-gray-100 w-full relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 font-fredoka uppercase tracking-tight">
            {i18n.language === 'en' ? 'Learning Modules' : 'Modul Pembelajaran'}
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 font-outfit max-w-2xl mx-auto px-2">
            {i18n.language === 'en' ? 'Improve your child\'s logic and creativity through interactive modules specially designed for fun learning.' : 'Tingkatkan kemampuan logika dan kreativitas anak melalui modul-modul interaktif yang dirancang khusus untuk pembelajaran menyenangkan.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {modules.map((modul, idx) => (
            <motion.div 
              key={modul.id} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-800 group flex flex-col relative"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img 
                  src={modul.img} 
                  alt={modul.title} 
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${modul.isLocked ? 'blur-sm brightness-75' : ''}`}
                />
                {modul.isLocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white z-10">
                    <div className="bg-white/20 p-3 sm:p-4 rounded-full backdrop-blur-md mb-2 sm:mb-3">
                      <Lock size={24} className="sm:size-[32] text-white" />
                    </div>
                    <span className="font-fredoka font-semibold text-sm sm:text-lg tracking-wide uppercase px-4 text-center">{i18n.language === 'en' ? 'Premium Module' : 'Modul Premium'}</span>
                  </div>
                )}
                {!modul.isLocked && (
                  <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-bold text-xs sm:text-sm font-fredoka shadow-sm ${modul.price === 'Gratis' || modul.price === 'Free' ? 'text-green-600' : 'text-gray-900'}`}>
                    {modul.price}
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 font-fredoka mb-1 sm:mb-2 line-clamp-2">
                  {modul.title}
                </h3>
                <p className="text-gray-500 font-outfit text-xs sm:text-sm mb-4 sm:mb-6 flex-grow leading-relaxed">
                  {modul.description}
                </p>
                {modul.isLocked ? (
                  <button className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-900 text-white font-bold rounded-lg sm:rounded-xl transition-all font-outfit flex justify-center items-center gap-2 shadow-md text-xs sm:text-sm cursor-pointer">
                    {i18n.language === 'en' ? 'Subscribe to Unlock' : 'Berlangganan untuk Membuka'}
                  </button>
                ) : (
                  <button className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 ${modul.price === 'Gratis' || modul.price === 'Free' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold rounded-lg sm:rounded-xl transition-colors font-outfit shadow-md hover:shadow-lg text-xs sm:text-sm cursor-pointer`}>
                    {modul.price === 'Gratis' || modul.price === 'Free' ? (i18n.language === 'en' ? 'Start Learning' : 'Mulai Belajar') : (i18n.language === 'en' ? 'Buy Module' : 'Beli Modul')}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-gray-200 hover:border-gray-900 text-gray-900 font-bold rounded-full transition-colors font-outfit uppercase tracking-wider text-xs sm:text-sm shadow-sm hover:shadow-md cursor-pointer">
            {i18n.language === 'en' ? 'View All Modules' : 'Lihat Semua Modul'}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ModuleSection;
