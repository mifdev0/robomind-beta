import { useState, useEffect } from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NewsSection = () => {
  const { i18n } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/tag/education');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        if (data.status !== 'ok') throw new Error('RSS to JSON conversion failed');

        const validNews = data.items.slice(0, 4).map((item, index) => {
          const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
          const cleanDesc = item.description.replace(/<[^>]+>/g, '').trim();

          return {
            id: index,
            title: item.title,
            description: cleanDesc.length > 120 ? cleanDesc.substring(0, 120) + "..." : cleanDesc || "Berita dan wawasan terbaru seputar dunia pendidikan dan kurikulum.",
            img: imgMatch ? imgMatch[1] : "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80",
            url: item.link,
            source: item.author || "Global Education",
            date: new Date(item.pubDate).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          };
        });

        if (validNews.length > 0) {
          setNews(validNews);
        } else {
          setNews(fallbackNews);
        }
      } catch (error) {
        console.error("Gagal mengambil berita:", error);
        setNews(fallbackNews);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const fallbackNews = [
    {
      id: 1,
      title: "Update Kurikulum 2026: Fokus pada Keterampilan Abad 21",
      description: "Kementerian Pendidikan mengumumkan penyesuaian kurikulum baru yang menitikberatkan pada pemrograman dan AI sejak pendidikan dasar.",
      img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80",
      url: "#",
      source: "Detik Edukasi",
      date: "23 Juni 2026"
    },
    {
      id: 2,
      title: "Teknologi AI Ubah Lanskap Pembelajaran Global",
      description: "Berbagai sekolah di seluruh dunia mulai mengintegrasikan asisten virtual pintar untuk membantu personalisasi pembelajaran siswa.",
      img: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&auto=format&fit=crop&q=80",
      url: "#",
      source: "Tech News Global",
      date: "22 Juni 2026"
    },
    {
      id: 3,
      title: "Pentingnya Belajar Robotika Sejak Dini",
      description: "Studi terbaru menunjukkan anak yang belajar robotika memiliki kemampuan problem solving 40% lebih baik.",
      img: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&auto=format&fit=crop&q=80",
      url: "#",
      source: "Science Daily",
      date: "20 Juni 2026"
    },
    {
      id: 4,
      title: "Keterampilan Digital Jadi Syarat Utama Lulusan 2026",
      description: "Menteri Pendidikan Global menyepakati bahwa literasi digital adalah kunci utama untuk kesuksesan karir generasi mendatang.",
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
      url: "#",
      source: "Education Week",
      date: "18 Juni 2026"
    }
  ];

  return (
    <section id="berita-terupdate" className="bg-white dark:bg-slate-900 py-10 sm:py-16 lg:py-24 border-b border-gray-100 dark:border-slate-800 w-full relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-8 sm:mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white font-fredoka uppercase tracking-tight mb-2">
              ROBO NEWS
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-primary-600 dark:text-primary-400 font-bold tracking-wider uppercase mb-3">
              {i18n.language === 'en' ? 'News & Updates' : 'Berita & Update'}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 font-outfit max-w-xl">
              {i18n.language === 'en' ? 'Latest information about technology, new curriculums, and innovations in the global learning world.' : 'Informasi terkini seputar teknologi, kurikulum baru, dan inovasi dalam dunia pembelajaran global.'}
            </p>
          </div>
          <a href="#" className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-4 sm:mt-0 pb-1 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 font-outfit">
            {i18n.language === 'en' ? 'View All News' : 'Lihat Semua Berita'} <ExternalLink size={14} className="sm:size-[16]" />
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((skeleton) => (
              <div key={skeleton} className="bg-gray-100 rounded-xl sm:rounded-2xl h-[320px] sm:h-[400px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {news.map((item) => (
              <a 
                key={item.id} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-800 group flex flex-col"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-blue-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold font-outfit rounded-full uppercase tracking-wider">
                    {item.source}
                  </div>
                </div>
                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-[10px] sm:text-xs text-gray-500 font-outfit mb-2 sm:mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12} className="sm:size-[14]" /> {item.date}</span>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 font-fredoka mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 font-outfit text-xs sm:text-sm line-clamp-3 mb-3 sm:mb-4 flex-grow leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-auto flex items-center text-xs sm:text-sm font-bold text-blue-600 font-outfit">
                    {i18n.language === 'en' ? 'Read More' : 'Baca Selengkapnya'} <ExternalLink size={12} className="sm:size-[16] ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
        
        <div className="mt-6 sm:mt-8 text-center sm:hidden">
          <a href="#" className="inline-flex items-center justify-center w-full py-3 px-4 bg-gray-50 border border-gray-200 text-gray-900 font-bold rounded-full transition-colors font-outfit text-sm">
            {i18n.language === 'en' ? 'View All News' : 'Lihat Semua Berita'}
          </a>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
