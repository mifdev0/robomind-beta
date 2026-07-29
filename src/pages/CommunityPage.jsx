import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  MessageSquare, Heart, Share2, Plus, Search, Filter, 
  Sparkles, Users, BookOpen, ThumbsUp, Check, AlertCircle, Send, Globe, MessageCircle,
  FileText, Shield, Sparkle, LogIn, ChevronRight, PenTool
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data as initial fallback
const INITIAL_POSTS = [
  {
    id: 'post-1',
    title: 'Tips Melatih Logika Anak Tanpa Gadget',
    content: 'Seringkali kita bingung bagaimana mengajarkan logika ke anak tanpa screen time berlebih. Di rumah, saya suka pakai balok susun warna-warni dan permainan tebak arah mata angin. Anak saya yang umur 6 tahun jadi lebih cepat memahami konsep instruksi sekuensial sebelum masuk ke game Robo Mind!',
    category: 'parenting',
    author_name: 'Bunda Sarah',
    author_avatar: 'https://ui-avatars.com/api/?name=Bunda+Sarah&background=14B8A6&color=fff&rounded=true',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    likes: 12,
    comments: [
      { id: 'c-1', author_name: 'Ayah Rian', content: 'Sangat setuju bunda! Permainan unplugged seperti itu sangat membantu membangun fondasi berpikir algoritmik.', created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
      { id: 'c-2', author_name: 'Mama Alisa', content: 'Wah makasih tipsnya, mau dicoba nanti sore.', created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString() }
    ],
    liked_by: []
  },
  {
    id: 'post-2',
    title: 'Game Pinch & Drop Sangat Membantu Motorik Halus',
    content: 'Baru seminggu coba fitur game Pinch & Drop di web Robo Mind. Awalnya anak agak kaku menyeret angka-angka di layar tablet, tapi sekarang koordinasi motorik halusnya jauh lebih terlatih, ditambah dia jadi suka hitung-hitungan sederhana.',
    category: 'games',
    author_name: 'Papa Dedi',
    author_avatar: 'https://ui-avatars.com/api/?name=Papa+Dedi&background=3B82F6&color=fff&rounded=true',
    created_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(), // 12 hours ago
    likes: 8,
    comments: [
      { id: 'c-3', author_name: 'Bunda Sarah', content: 'Betul pa, anak saya juga betah banget main game itu.', created_at: new Date(Date.now() - 1000 * 60 * 500).toISOString() }
    ],
    liked_by: []
  },
  {
    id: 'post-3',
    title: 'Mengenalkan Computational Thinking sejak Usia 5 Tahun',
    content: 'Computational thinking bukan berarti memaksa anak belajar menulis kode syntax pemrograman rumit. Ini tentang pemecahan masalah (problem solving): dekomposisi, pengenalan pola, abstraksi, dan algoritma dasar. Bagus sekali kurikulum Robo Mind ini merancang tahapannya dengan rapi.',
    category: 'logic',
    author_name: 'Dr. Indah (Praktisi Edukasi)',
    author_avatar: 'https://ui-avatars.com/api/?name=Dr+Indah&background=EC4899&color=fff&rounded=true',
    created_at: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 1 day ago
    likes: 24,
    comments: [],
    liked_by: []
  }
];

const CATEGORIES = [
  { id: 'all', label: { id: 'Semua Kategori', en: 'All Categories' }, icon: <Globe size={18} /> },
  { id: 'sharing', label: { id: 'Sharing Cerita', en: 'Sharing Stories' }, icon: <BookOpen size={18} /> },
  { id: 'parenting', label: { id: 'Tips Parenting', en: 'Parenting Tips' }, icon: <Heart size={18} /> },
  { id: 'games', label: { id: 'Logika & Game', en: 'Logic & Games' }, icon: <Sparkles size={18} /> },
  { id: 'logic', label: { id: 'Kurikulum & Belajar', en: 'Curriculum' }, icon: <FileText size={18} /> },
  { id: 'general', label: { id: 'Diskusi Umum', en: 'General Discussion' }, icon: <MessageCircle size={18} /> }
];

const CommunityPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Post Creation form states
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('sharing');
  const [customAuthorName, setCustomAuthorName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Comments input map (postId -> text)
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [showShareToast, setShowShareToast] = useState(false);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);

  // Fetch posts from Supabase or fallback to LocalStorage
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw new Error('Supabase query failed');

        if (data && data.length > 0) {
          setPosts(data);
          setIsUsingSupabase(true);
        } else {
          // If empty, seed with initial mock data
          const { error: seedError } = await supabase.from('community_posts').insert(
            INITIAL_POSTS.map(p => ({
              id: p.id,
              title: p.title,
              content: p.content,
              category: p.category,
              author_name: p.author_name,
              author_avatar: p.author_avatar,
              created_at: p.created_at,
              likes: p.likes,
              comments: p.comments,
              liked_by: p.liked_by
            }))
          );
          
          if (!seedError) {
            const { data: seededData } = await supabase
              .from('community_posts')
              .select('*')
              .order('created_at', { ascending: false });
            if (seededData) {
              setPosts(seededData);
              setIsUsingSupabase(true);
            }
          } else {
            loadFromLocalStorage();
          }
        }
      } catch (err) {
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const loadFromLocalStorage = () => {
    setIsUsingSupabase(false);
    const local = localStorage.getItem('robomind_community_posts');
    if (local) {
      try {
        setPosts(JSON.parse(local));
      } catch {
        setPosts(INITIAL_POSTS);
        localStorage.setItem('robomind_community_posts', JSON.stringify(INITIAL_POSTS));
      }
    } else {
      setPosts(INITIAL_POSTS);
      localStorage.setItem('robomind_community_posts', JSON.stringify(INITIAL_POSTS));
    }
  };

  const savePostsState = async (updatedPosts) => {
    setPosts(updatedPosts);
    if (!isUsingSupabase) {
      localStorage.setItem('robomind_community_posts', JSON.stringify(updatedPosts));
    }
  };

  // Scroll to top and set page title / SEO meta
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = i18n.language === 'en' ? "Parent Hub & Community - Robo Mind" : "Komunitas & Hub Orang Tua - Robo Mind";
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', i18n.language === 'en' 
        ? "Join the Robo Mind parent community to share stories, parenting tips, child logic game stimulation, and game-based education updates."
        : "Bergabunglah dengan komunitas orang tua Robo Mind untuk berbagi cerita, tips parenting, stimulasi kecerdasan logika anak, dan perkembangan edukasi berbasis game.");
    }
  }, [i18n.language]);

  // Filter & Search Logic
  useEffect(() => {
    let result = posts;

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => p.title.toLowerCase().includes(q) || 
             p.content.toLowerCase().includes(q) ||
             p.author_name.toLowerCase().includes(q)
      );
    }

    setFilteredPosts(result);
  }, [posts, activeCategory, searchQuery]);

  // Handle Like
  const handleLike = async (postId) => {
    const userIdentifier = user?.email || 'anonymous-user';
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const likedBy = post.liked_by || [];
        const isLiked = likedBy.includes(userIdentifier);
        
        let newLikedBy;
        let newLikesCount;

        if (isLiked) {
          newLikedBy = likedBy.filter(id => id !== userIdentifier);
          newLikesCount = Math.max(0, post.likes - 1);
        } else {
          newLikedBy = [...likedBy, userIdentifier];
          newLikesCount = post.likes + 1;
        }

        if (isUsingSupabase) {
          supabase
            .from('community_posts')
            .update({ likes: newLikesCount, liked_by: newLikedBy })
            .eq('id', postId)
            .then(({ error }) => {
              if (error) console.error('Failed to sync like count to Supabase:', error);
            });
        }

        return { ...post, likes: newLikesCount, liked_by: newLikedBy };
      }
      return post;
    });

    savePostsState(updatedPosts);
  };

  // Toggle Comments list view
  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Submit new comment
  const handleAddComment = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const authorName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Orang Tua';
    const newComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author_name: authorName,
      content: text,
      created_at: new Date().toISOString()
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const postComments = post.comments || [];
        const newComments = [...postComments, newComment];

        if (isUsingSupabase) {
          supabase
            .from('community_posts')
            .update({ comments: newComments })
            .eq('id', postId)
            .then(({ error }) => {
              if (error) console.error('Failed to sync comments to Supabase:', error);
            });
        }

        return { ...post, comments: newComments };
      }
      return post;
    });

    savePostsState(updatedPosts);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Handle file/photo selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setSubmitError(i18n.language === 'en' ? 'File size must be under 5MB' : 'Ukuran file harus di bawah 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: event.target.result
      });
      setSubmitError('');
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Clear input value so same file can be selected again
  };

  const triggerFileUpload = () => {
    setShowCreateModal(true);
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, 150);
  };

  // Submit new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (!newContent.trim()) {
      setSubmitError(i18n.language === 'en' ? 'Content cannot be empty' : 'Konten tidak boleh kosong');
      return;
    }

    setIsSubmitting(true);

    const authorName = customAuthorName.trim() || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Orang Tua';
    const authorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=0D9488&color=fff&rounded=true`;

    // Derive title from content
    const contentLines = newContent.trim().split('\n');
    let derivedTitle = contentLines[0] || 'Cerita Baru';
    if (derivedTitle.length > 50) {
      derivedTitle = derivedTitle.substring(0, 50) + '...';
    }

    const isImage = selectedFile?.type.startsWith('image/');

    const newPost = {
      id: `post-${Date.now()}`,
      title: derivedTitle,
      content: newContent.trim(),
      category: newCategory,
      author_name: authorName,
      author_avatar: authorAvatar,
      created_at: new Date().toISOString(),
      likes: 0,
      comments: [],
      liked_by: [],
      image_url: isImage ? selectedFile.dataUrl : null,
      file_name: !isImage && selectedFile ? selectedFile.name : null,
      file_data: !isImage && selectedFile ? selectedFile.dataUrl : null
    };

    try {
      if (isUsingSupabase) {
        const { error } = await supabase
          .from('community_posts')
          .insert([newPost]);

        if (error) throw error;
        setPosts([newPost, ...posts]);
      } else {
        const updated = [newPost, ...posts];
        savePostsState(updated);
      }

      setSubmitSuccess(true);
      setNewContent('');
      setCustomAuthorName('');
      setSelectedFile(null);
      
      setTimeout(() => {
        setShowCreateModal(false);
        setSubmitSuccess(false);
      }, 1000);

    } catch (err) {
      console.error(err);
      setSubmitError(i18n.language === 'en' ? 'Failed to publish post to database' : 'Gagal mempublikasikan cerita ke database');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = (post) => {
    const textToCopy = `[Robo Mind Community] "${post.title}" oleh ${post.author_name}. Baca selengkapnya di http://localhost:3000/community`;
    navigator.clipboard.writeText(textToCopy);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  const formatTimeAgo = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return i18n.language === 'en' ? 'Just now' : 'Baru saja';
    if (diffMins < 60) return i18n.language === 'en' ? `${diffMins}m` : `${diffMins} mnt`;
    if (diffHours < 24) return i18n.language === 'en' ? `${diffHours}h` : `${diffHours} jam`;
    if (diffDays === 1) return i18n.language === 'en' ? 'Yesterday' : 'Kemarin';
    return date.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'id-ID', {
      day: 'numeric',
      month: 'short'
    });
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Orang Tua';
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D9488&color=fff&rounded=true`;

  const totalComments = posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0);
  const totalLikes = posts.reduce((acc, p) => acc + (p.likes || 0), 0);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col font-outfit text-gray-800">
      <Navbar />

      <div className="flex-grow pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main 3-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* LEFT COLUMN: Shortcuts / Navigation (Sticky) */}
            <div className="hidden lg:block lg:sticky lg:top-24 space-y-4">
              {/* User Profile Card */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-200/60 transition-colors cursor-pointer">
                <img src={avatarUrl} alt="User Profile" className="w-9 h-9 rounded-full border border-gray-200" />
                <span className="font-bold text-gray-800 text-sm truncate">{displayName}</span>
              </div>

              {/* Shortcuts Header */}
              <div className="px-2 pt-2 pb-1 text-xs font-bold text-gray-500 uppercase tracking-wider">
                {i18n.language === 'en' ? 'Shortcut Categories' : 'Kategori Diskusi'}
              </div>

              {/* Category Links (styled like FB Shortcuts) */}
              <div className="space-y-1">
                {CATEGORIES.map((category) => {
                  const isActive = activeCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-white text-primary-600 shadow-sm border-l-4 border-primary-500 pl-2' 
                          : 'text-gray-600 hover:bg-gray-200/60'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${isActive ? 'bg-primary-50 text-primary-600' : 'bg-gray-200/50 text-gray-500'}`}>
                        {category.icon}
                      </div>
                      <span className="truncate">{i18n.language === 'en' ? category.label.en : category.label.id}</span>
                    </button>
                  );
                })}
              </div>

              {/* Divider line */}
              <hr className="border-gray-200 my-4" />

              {/* Source/Database state box */}
              <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-gray-700">
                  <div className={`w-2.5 h-2.5 rounded-full ${isUsingSupabase ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                  <span>{isUsingSupabase ? 'Database Cloud Terkoneksi' : 'Mode Demo Offline'}</span>
                </div>
                <p className="text-gray-500 leading-relaxed">
                  {isUsingSupabase 
                    ? 'Koneksi database Supabase cloud aktif. Cerita disinkronkan secara real-time.' 
                    : 'Penyimpanan berjalan di Local Sandbox browser Anda. Semua data aman tersimpan secara lokal.'}
                </p>
              </div>
            </div>

            {/* CENTER COLUMN: Feeds & Posting (Main) */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* FACEBOOK STYLE: What's on your mind? Post Creator Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <img src={avatarUrl} alt="Author" className="w-10 h-10 rounded-full border border-gray-100" />
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="flex-grow bg-gray-100 hover:bg-gray-200/80 text-gray-500 hover:text-gray-600 text-left text-sm py-3 px-5 rounded-full transition-colors cursor-pointer border border-transparent font-medium"
                  >
                    {i18n.language === 'en' 
                      ? `What's on your mind, ${displayName.split(' ')[0]}?` 
                      : `Apa yang ingin Anda ceritakan, ${displayName.split(' ')[0]}?`}
                  </button>
                </div>

                {/* Divider Line */}
                <hr className="border-gray-100" />

                {/* Quick actions buttons under the search-like box */}
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 gap-1">
                  <button 
                    onClick={() => { setNewCategory('sharing'); setShowCreateModal(true); }}
                    className="flex-grow flex items-center justify-center gap-1.5 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <BookOpen size={15} className="text-pink-500 shrink-0" />
                    <span className="truncate">{i18n.language === 'en' ? 'Stories' : 'Berbagi Cerita'}</span>
                  </button>
                  
                  <button 
                    onClick={() => { setNewCategory('parenting'); setShowCreateModal(true); }}
                    className="flex-grow flex items-center justify-center gap-1.5 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Heart size={15} className="text-teal-500 shrink-0" />
                    <span className="truncate">{i18n.language === 'en' ? 'Parenting' : 'Parenting'}</span>
                  </button>

                  <button 
                    onClick={() => { setNewCategory('games'); setShowCreateModal(true); }}
                    className="flex-grow flex items-center justify-center gap-1.5 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Sparkles size={15} className="text-blue-500 shrink-0" />
                    <span className="truncate">{i18n.language === 'en' ? 'Logic' : 'Tanya Logika'}</span>
                  </button>

                  <button 
                    onClick={triggerFileUpload}
                    className="flex-grow flex items-center justify-center gap-1.5 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer hover:text-green-600 text-gray-500"
                  >
                    <Plus size={15} className="text-green-500 shrink-0" />
                    <span className="truncate">{i18n.language === 'en' ? 'Photo/File' : 'Foto/File'}</span>
                  </button>
                </div>
              </div>

              {/* Mobile Search/Filter Header bar */}
              <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm lg:hidden flex gap-2 items-center">
                <div className="relative flex-grow">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text"
                    placeholder={i18n.language === 'en' ? 'Search community...' : 'Cari di komunitas...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                  />
                </div>
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-full px-3 py-2 text-xs font-bold text-gray-600 focus:outline-none"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>
                      {i18n.language === 'en' ? c.label.en : c.label.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search results banner */}
              {searchQuery && (
                <div className="text-xs font-bold text-gray-500 px-1 py-0.5">
                  Menampilkan hasil pencarian untuk: <span className="text-gray-800 italic">"{searchQuery}"</span>
                </div>
              )}

              {/* Feed Content Loader */}
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(skeleton => (
                    <div key={skeleton} className="bg-white rounded-xl p-5 border border-gray-200 animate-pulse space-y-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
                        <div className="space-y-2 flex-grow">
                          <div className="h-3.5 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-2.5 bg-gray-100 rounded w-1/6"></div>
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <div className="h-3.5 bg-gray-200 rounded w-full"></div>
                        <div className="h-3.5 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mx-auto mb-3">
                    <AlertCircle size={24} />
                  </div>
                  <h3 className="text-base font-bold font-fredoka text-gray-800 mb-1.5">
                    {i18n.language === 'en' ? 'No Feed Available' : 'Diskusi Belum Ditemukan'}
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto text-xs leading-relaxed">
                    {i18n.language === 'en' 
                      ? 'Try modifying your search text, or select another category from the sidebar.' 
                      : 'Cari dengan kata kunci lain, atau buat kiriman baru untuk memicu diskusi hangat.'}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredPosts.map((post) => {
                    const categoryObj = CATEGORIES.find(c => c.id === post.category) || CATEGORIES[1];
                    const userIdentifier = user?.email || 'anonymous-user';
                    const isLiked = (post.liked_by || []).includes(userIdentifier);
                    const isExpanded = !!expandedComments[post.id];

                    return (
                      <motion.article
                        key={post.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col"
                      >
                        {/* Feed Card Content */}
                        <div className="p-4 sm:p-5 flex-grow">
                          
                          {/* Header section: Avatar, Author, Time, Category */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-3 items-center">
                              <img 
                                src={post.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_name)}&background=0D9488&color=fff&rounded=true`}
                                alt={post.author_name} 
                                className="w-10 h-10 rounded-full border border-gray-100" 
                              />
                              <div>
                                <h4 className="font-bold text-gray-900 text-sm leading-snug">{post.author_name}</h4>
                                <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                                  <span>{formatTimeAgo(post.created_at)}</span>
                                  <span>•</span>
                                  <span className="lowercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[9px] font-bold">
                                    #{i18n.language === 'en' ? categoryObj.label.en : categoryObj.label.id}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Post Title */}
                          {post.title && 
                           !(post.content.startsWith(post.title) || 
                             post.title.replace('...', '') === post.content.substring(0, post.title.replace('...', '').length)) && (
                            <h3 className="text-base font-bold text-gray-900 font-fredoka mb-2 leading-tight">
                              {post.title}
                            </h3>
                          )}

                          {/* Post Content Body */}
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line mb-4">
                            {post.content}
                          </p>

                          {/* Image Attachment Rendering */}
                          {post.image_url && (
                            <div className="mt-3 rounded-xl overflow-hidden border border-gray-150 max-h-96 bg-gray-50 flex items-center justify-center">
                              <img 
                                src={post.image_url} 
                                alt="Post Attachment" 
                                className="w-full max-h-96 object-contain"
                              />
                            </div>
                          )}

                          {/* Document Attachment Rendering */}
                          {post.file_data && post.file_name && (
                            <a 
                              href={post.file_data} 
                              download={post.file_name}
                              className="mt-3 flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-xs font-semibold text-gray-700"
                            >
                              <FileText size={20} className="text-primary-500 shrink-0" />
                              <div className="flex-grow truncate">
                                <p className="font-bold truncate text-gray-800">{post.file_name}</p>
                                <p className="text-[10px] text-gray-400">Klik untuk mengunduh file</p>
                              </div>
                            </a>
                          )}

                          {/* Interactions Counters (Summary row like FB) */}
                          {(post.likes > 0 || (post.comments?.length || 0) > 0) && (
                            <div className="flex justify-between items-center text-xs text-gray-500 pb-3 border-b border-gray-100 mb-2">
                              {post.likes > 0 ? (
                                <div className="flex items-center gap-1.5 font-medium">
                                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                                    <ThumbsUp size={9} fill="currentColor" />
                                  </div>
                                  <span>{post.likes} {i18n.language === 'en' ? 'likes' : 'menyukai'}</span>
                                </div>
                              ) : <div></div>}
                              
                              {(post.comments?.length || 0) > 0 && (
                                <button 
                                  onClick={() => toggleComments(post.id)}
                                  className="hover:underline font-medium cursor-pointer"
                                >
                                  {post.comments.length} {i18n.language === 'en' ? 'comments' : 'komentar'}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Action Buttons Row (Like, Comment, Share) */}
                          <div className="flex items-center justify-between text-gray-600 text-xs font-bold pt-1">
                            
                            {/* Like Button */}
                            <button 
                              onClick={() => handleLike(post.id)}
                              className={`flex-grow flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer ${
                                isLiked ? 'text-primary-600' : 'hover:text-gray-800'
                              }`}
                            >
                              <ThumbsUp size={16} fill={isLiked ? "currentColor" : "none"} />
                              <span>{i18n.language === 'en' ? 'Like' : 'Suka'}</span>
                            </button>

                            {/* Comment Toggle Button */}
                            <button 
                              onClick={() => toggleComments(post.id)}
                              className={`flex-grow flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer ${
                                isExpanded ? 'text-primary-600' : 'hover:text-gray-800'
                              }`}
                            >
                              <MessageSquare size={16} />
                              <span>{i18n.language === 'en' ? 'Comment' : 'Komentar'}</span>
                            </button>

                            {/* Share Button */}
                            <button 
                              onClick={() => handleShare(post)}
                              className="flex-grow flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer hover:text-gray-800"
                            >
                              <Share2 size={16} />
                              <span>{i18n.language === 'en' ? 'Share' : 'Bagikan'}</span>
                            </button>

                          </div>

                          {/* Collapsible Comments List & Comment Input */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mt-4 pt-4 border-t border-gray-100 space-y-4"
                              >
                                {/* Comments Feed */}
                                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                                  {(!post.comments || post.comments.length === 0) ? (
                                    <p className="text-xs text-gray-400 italic py-2">
                                      {i18n.language === 'en' ? 'No comments yet. Write the first comment!' : 'Belum ada komentar. Berikan tanggapan pertama Anda!'}
                                    </p>
                                  ) : (
                                    post.comments.map((comment) => (
                                      <div key={comment.id} className="flex gap-2.5 items-start">
                                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs shrink-0 uppercase mt-0.5 border border-primary-200">
                                          {comment.author_name[0]}
                                        </div>
                                        <div className="bg-gray-100 rounded-2xl px-3.5 py-2.5 max-w-[90%] space-y-0.5 shadow-sm border border-gray-200/50">
                                          <div className="flex justify-between items-center gap-4">
                                            <span className="font-bold text-gray-900 text-xs">{comment.author_name}</span>
                                            <span className="text-[9px] text-gray-400 font-medium shrink-0">
                                              {formatTimeAgo(comment.created_at)}
                                            </span>
                                          </div>
                                          <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">{comment.content}</p>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>

                                {/* Write Comment Input Box */}
                                <div className="flex gap-2.5 items-center">
                                  <img src={avatarUrl} alt="Current User" className="w-8 h-8 rounded-full border border-gray-200 shrink-0" />
                                  <div className="flex-grow relative">
                                    <input
                                      type="text"
                                      placeholder={i18n.language === 'en' ? 'Write a comment...' : 'Tulis komentar...'}
                                      value={commentInputs[post.id] || ''}
                                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddComment(post.id);
                                      }}
                                      className="w-full bg-gray-100 border border-gray-200 rounded-full pl-4 pr-10 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium text-gray-700"
                                    />
                                    <button
                                      onClick={() => handleAddComment(post.id)}
                                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 text-primary-500 rounded-full transition-colors cursor-pointer"
                                    >
                                      <Send size={12} />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* RIGHT COLUMN: Search Filter & Rules Info */}
            <div className="hidden lg:block lg:sticky lg:top-24 space-y-6">
              
              {/* Search Widget */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
                <h4 className="font-bold text-gray-900 font-fredoka text-sm uppercase">Cari Diskusi</h4>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text"
                    placeholder={i18n.language === 'en' ? 'Search community...' : 'Cari di komunitas...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                  />
                </div>
              </div>

              {/* Stats Mini Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3.5">
                <h4 className="font-bold text-gray-900 font-fredoka text-sm uppercase">Statistik Hub</h4>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Cerita</span>
                    <h5 className="font-bold text-lg text-primary-600 font-fredoka">{posts.length}</h5>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Suka</span>
                    <h5 className="font-bold text-lg text-primary-600 font-fredoka">{totalLikes}</h5>
                  </div>
                </div>
              </div>

              {/* Community Rules Widget */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
                <h4 className="font-bold text-gray-900 font-fredoka text-sm uppercase flex items-center gap-2">
                  <Shield size={16} className="text-teal-600" />
                  <span>Tata Tertib Sharing</span>
                </h4>
                <ul className="space-y-2 text-xs text-gray-500 leading-relaxed list-decimal list-inside font-semibold">
                  <li>{i18n.language === 'en' ? 'Be kind and respect others' : 'Bersikap sopan & saling menghargai'}</li>
                  <li>{i18n.language === 'en' ? 'Focus on childrens development' : 'Fokus seputar tumbuh kembang logika anak'}</li>
                  <li>{i18n.language === 'en' ? 'No spam, ads or promotional links' : 'Tidak spamming, iklan, atau link jualan'}</li>
                  <li>{i18n.language === 'en' ? 'Protect childrens privacy/names' : 'Jaga privasi & identitas lengkap anak'}</li>
                </ul>
              </div>

            </div>

          </div>

        </div>
      </div>

      <Footer />

      {/* Share Toast Notification Alert */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 z-50 text-xs font-bold"
          >
            <Check size={14} className="text-green-400 shrink-0" />
            <span>{i18n.language === 'en' ? 'Link details copied to clipboard!' : 'Tautan disalin ke clipboard!'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story Creator Modal Form (Facebook-style) */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setShowCreateModal(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            ></motion.div>

            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 z-10"
              >
                <form onSubmit={handleCreatePost} className="p-5 space-y-4">
                  
                  {/* Modal Header */}
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-900 font-fredoka uppercase text-center w-full">
                      {i18n.language === 'en' ? 'Create Post' : 'Buat Postingan'}
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => setShowCreateModal(false)} 
                      disabled={isSubmitting}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 font-bold p-1 shrink-0 text-sm cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 flex items-center gap-2">
                      <AlertCircle size={14} />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {submitSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl p-3 flex items-center gap-2">
                      <Check size={14} />
                      <span>{i18n.language === 'en' ? 'Post published successfully!' : 'Cerita berhasil diterbitkan!'}</span>
                    </div>
                  )}

                  {/* Facebook Style: Profile details row with Category Selector */}
                  <div className="flex items-center gap-3">
                    <img src={avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full border border-gray-200" />
                    <div className="space-y-1">
                      <span className="font-bold text-gray-900 text-sm leading-tight block">{displayName}</span>
                      <div className="relative inline-block">
                        <select 
                          value={newCategory} 
                          onChange={(e) => setNewCategory(e.target.value)} 
                          className="appearance-none bg-gray-100 border border-gray-200 hover:bg-gray-200/80 rounded-full pl-3 pr-7 py-1 text-[10px] font-black text-gray-500 focus:outline-none cursor-pointer leading-none transition-colors uppercase tracking-wider"
                        >
                          {CATEGORIES.slice(1).map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {i18n.language === 'en' ? cat.label.en : cat.label.id}
                            </option>
                          ))}
                        </select>
                        <ChevronRight size={10} className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Textarea for post */}
                  <textarea 
                    placeholder={i18n.language === 'en' ? `What's on your mind, ${displayName.split(' ')[0]}?` : `Apa yang ingin Anda ceritakan, Bunda/Ayah?`}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={6}
                    className="w-full bg-transparent text-sm sm:text-base focus:outline-none resize-none font-medium leading-relaxed placeholder-gray-400 py-2 border-none focus:ring-0 focus:border-none"
                    maxLength={1000}
                    required
                  />

                  {/* Hidden file input */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" 
                  />

                  {/* Selected File / Attachment Preview section */}
                  {selectedFile && (
                    <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-2 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="absolute top-2 right-2 p-1.5 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full transition-colors cursor-pointer z-10 font-bold leading-none text-xs"
                      >
                        ✕
                      </button>
                      
                      {selectedFile.type.startsWith('image/') ? (
                        <img src={selectedFile.dataUrl} alt="Preview Attachment" className="w-full max-h-60 object-contain rounded-lg shadow-sm" />
                      ) : (
                        <div className="w-full flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                          <FileText className="text-primary-500 shrink-0" size={24} />
                          <div className="flex-grow truncate text-left">
                            <p className="font-bold text-xs text-gray-800 truncate">{selectedFile.name}</p>
                            <p className="text-[10px] text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Guest Name input (only if guest) */}
                  {!user && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tulis sebagai:</span>
                      <input 
                        type="text" 
                        placeholder="Masukkan nama panggilan Anda (Opsional)"
                        value={customAuthorName}
                        onChange={(e) => setCustomAuthorName(e.target.value)}
                        className="flex-grow bg-transparent text-xs font-semibold focus:outline-none text-gray-700 placeholder-gray-400 py-1"
                        maxLength={25}
                      />
                    </div>
                  )}

                  {/* FB Style Decorative widget */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-between border border-gray-200 rounded-xl p-3 bg-white shadow-sm text-xs font-bold text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <span>Tambahkan ke postingan Anda</span>
                    <div className="flex gap-2.5 text-gray-400">
                      <BookOpen size={16} className="text-pink-500 shrink-0" />
                      <Heart size={16} className="text-teal-500 shrink-0" />
                      <Plus size={16} className="text-green-500 shrink-0 hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !newContent.trim()}
                    className="w-full py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold rounded-xl text-xs hover:shadow-md hover:shadow-primary-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                        <span>{i18n.language === 'en' ? 'Publishing...' : 'Menerbitkan...'}</span>
                      </>
                    ) : (
                      <span>{i18n.language === 'en' ? 'Post' : 'Posting'}</span>
                    )}
                  </button>
                  
                </form>
              </motion.div>
            </div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CommunityPage;
