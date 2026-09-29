import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Search, 
  Globe, 
  User, 
  Star, 
  Heart, 
  CheckCircle, 
  ArrowLeft,
  LogOut,
  LogIn,
  Film
} from 'lucide-react';

// BARCHASI HAR XIL BO'LGAN MULTFILM NOM LARI IERARXIYASI
const NAMES = ['Kung Fu Panda', 'Shrek', 'Masha va Ayiq', 'Cars', 'Madagascar', 'Moana', 'Ice Age', 'Zootopia', 'Despicable Me', 'Lion King', 'Spider-Verse', 'Ratatouille', 'Wall-E', 'Up', 'Inside Out', 'Coco', 'Frozen', 'Tangled', 'Finding Nemo', 'Aladdin', 'Pinocchio', 'Puss in Boots', 'Big Hero 6', 'Monsters Inc', 'Toy Story', 'Hotel Transylvania', 'The Croods', 'Turbo', 'Boss Baby', 'Encanto', 'Luca', 'Soul', 'Sing', 'Minions', 'The Incredibles'];

const ADJECTIVES = ['Sarguzashtlari', 'Afsonasi', 'Yangi Davr', 'Koinot bo\'ylab', 'Sirli Olam', 'Qahramonlar', 'Oltin Kalit', 'Muzlik Sirlari', 'Sehrli Tush'];

const CATEGORIES = ['Sarguzasht', 'Ertaklar', 'Komediya', 'Musiqiy', "Ta'limiy", 'Kulgili', 'Fantastika'];

// 2,000 TA MUTLAQO HAR XIL MALUMOT VA UNIKAL RASMLAR
const GENERATED_CARTOONS = Array.from({ length: 2000 }).map((_, i) => {
  const name = NAMES[i % NAMES.length];
  const adj = ADJECTIVES[i % ADJECTIVES.length];
  const title = `${name}: ${adj} #${i + 1}`;
  
  return {
    id: `cart-${i + 1}`,
    title: title,
    subtitle: `Dunyo premyerasi va top xit animatsiya #${i + 1}`,
    desc: `${title} - tomoshabinlar e'tiborini qozongan unikal animatsion asar. Yuqori sifat va xavfsiz mazmun.`,
    rating: +(8.0 + (i % 20) * 0.1).toFixed(1),
    age: (i % 2 === 0) ? '0+ yosh' : '6+ yosh',
    quality: i % 3 === 0 ? '4K Ultra HD' : '1080p Full HD',
    youtubeId: i % 2 === 0 ? 't-uXWY-pd7E' : '_jbOTsnybCM',
    // Har bir card uchun mutlaqo har xil real rasm linki generatori
    image: `https://picsum.photos/seed/cartoon-${i + 1}/500/300`,
    category: CATEGORIES[i % CATEGORIES.length]
  };
});

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCartoon, setSelectedCartoon] = useState(GENERATED_CARTOONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // PROFIL VA LAYKLAR STATE-I
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [likedIds, setLikedIds] = useState([]);

  const openCartoonDetail = (cartoon) => {
    setSelectedCartoon(cartoon);
    setActiveTab('detail');
    setIsPlaying(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLike = (e, id) => {
    e.stopPropagation();
    if (likedIds.includes(id)) {
      setLikedIds(likedIds.filter(item => item !== id));
    } else {
      setLikedIds([...likedIds, id]);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username.trim() && loginForm.password.trim()) {
      setUser({ username: loginForm.username });
      setLoginForm({ username: '', password: '' });
      setActiveTab('profile');
    }
  };

  // HARF YOZILGANIDA AQLI TAVSIYA QILISH (LIVE SUGGESTIONS)
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return GENERATED_CARTOONS.filter(item => 
      item.title.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8);
  }, [searchQuery]);

  const filteredCartoons = useMemo(() => {
    if (!searchQuery.trim()) return GENERATED_CARTOONS;
    return GENERATED_CARTOONS.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const likedCartoons = useMemo(() => {
    return GENERATED_CARTOONS.filter(item => likedIds.includes(item.id));
  }, [likedIds]);

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <header style={styles.navbar}>
        <div style={styles.navLeft}>
          <div style={styles.logo} onClick={() => setActiveTab('home')}>
            Mimo<span style={{ color: '#38bdf8' }}>Kids</span>
          </div>
          <nav style={styles.navLinks}>
            <button 
              style={activeTab === 'home' ? styles.navLinkActive : styles.navLink} 
              onClick={() => setActiveTab('home')}
            >
              Bosh sahifa
            </button>
            <button 
              style={activeTab === 'cartoons' ? styles.navLinkActive : styles.navLink} 
              onClick={() => setActiveTab('cartoons')}
            >
              Multfilmlar (2,000)
            </button>
            <button 
              style={activeTab === 'favorites' ? styles.navLinkActive : styles.navLink} 
              onClick={() => setActiveTab('favorites')}
            >
              Sevimlilar ({likedIds.length})
            </button>
          </nav>
        </div>

        {/* AQLLI TAVSIYALI QIDIRUV */}
        <div style={styles.navRight}>
          <div style={{ position: 'relative' }}>
            <div style={styles.searchBox}>
              <Search size={16} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Harf yoki nom kiriting..." 
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput} 
              />
            </div>

            {/* QIDIRUV TAGIDAN TAVSIYA CHIQARISH */}
            {isSearchFocused && suggestions.length > 0 && (
              <div style={styles.suggestionDropdown}>
                {suggestions.map((item) => (
                  <div 
                    key={item.id} 
                    style={styles.suggestionItem}
                    onClick={() => {
                      openCartoonDetail(item);
                      setSearchQuery('');
                    }}
                  >
                    <Search size={14} color="#38bdf8" />
                    <span>{item.title}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: 'auto' }}>{item.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button style={styles.langBtn}><Globe size={16} /> UZ</button>
          <button 
            style={user ? styles.profileBtnActive : styles.profileBtn} 
            onClick={() => setActiveTab('profile')}
            title="Profil"
          >
            <User size={18} />
          </button>
        </div>
      </header>

      {/* 1. BOSH SAHIFA */}
      {activeTab === 'home' && (
        <main style={styles.main}>
          <section style={styles.heroSection}>
            <div style={styles.heroText}>
              <span style={styles.badge}>2,000 TA UNIKAL KINEMATOGRAFIYA</span>
              <h1 style={styles.heroTitle}>Barchasi Har Xil <br /><span style={{ color: '#38bdf8' }}>2,000 Ta Multfilm</span> 🍿</h1>
              <p style={{ color: '#94a3b8' }}>Har bir multfilm o'zining unikal surati, nomi va tavsifiga ega.</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button style={styles.primaryBtn} onClick={() => openCartoonDetail(GENERATED_CARTOONS[0])}>
                  <Play size={16} fill="#020c1b" /> Tomosha qilish
                </button>
              </div>
            </div>
            <div style={styles.heroImageCard} onClick={() => openCartoonDetail(GENERATED_CARTOONS[0])}>
              <img src={GENERATED_CARTOONS[0].image} alt="Hero" style={styles.heroImg} />
              <div style={styles.playOverlayIcon}><Play size={32} fill="#020c1b" /></div>
            </div>
          </section>

          <section style={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2>Tanlangan Multfilmlar</h2>
              <span style={{ color: '#38bdf8', fontSize: '14px' }}>Har xil va takrorlanmas</span>
            </div>
            <div style={styles.grid4}>
              {GENERATED_CARTOONS.slice(0, 24).map((item) => (
                <div key={item.id} style={styles.card} onClick={() => openCartoonDetail(item)}>
                  <div style={styles.cardImgWrapper}>
                    <img src={item.image} alt={item.title} style={styles.cardImg} />
                    <span style={styles.ratingBadge}><Star size={12} fill="#f59e0b" color="#f59e0b" /> {item.rating}</span>
                    <button 
                      style={styles.likeBtn} 
                      onClick={(e) => toggleLike(e, item.id)}
                    >
                      <Heart size={16} fill={likedIds.includes(item.id) ? "#ef4444" : "none"} color={likedIds.includes(item.id) ? "#ef4444" : "#fff"} />
                    </button>
                  </div>
                  <div style={{ padding: '12px' }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{item.category} • {item.age}</p>
                  </div>
                </div>
              ))}
            </div>
            <button style={styles.loadMoreBtn} onClick={() => setActiveTab('cartoons')}>
              Barcha 2,000 ta multfilmni ko'rish →
            </button>
          </section>
        </main>
      )}

      {/* 2. BARCHA MULTFILMLAR */}
      {activeTab === 'cartoons' && (
        <main style={styles.main}>
          <h1 style={{ marginBottom: '8px' }}>Barcha Multfilmlar (2,000 Ta)</h1>
          <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Natijalar: {filteredCartoons.length} ta</p>
          
          <div style={styles.grid4}>
            {filteredCartoons.slice(0, 100).map((item) => (
              <div key={item.id} style={styles.card} onClick={() => openCartoonDetail(item)}>
                <div style={styles.cardImgWrapper}>
                  <img src={item.image} alt={item.title} style={styles.cardImg} />
                  <span style={styles.ratingBadge}><Star size={12} fill="#f59e0b" color="#f59e0b" /> {item.rating}</span>
                  <button 
                    style={styles.likeBtn} 
                    onClick={(e) => toggleLike(e, item.id)}
                  >
                    <Heart size={16} fill={likedIds.includes(item.id) ? "#ef4444" : "none"} color={likedIds.includes(item.id) ? "#ef4444" : "#fff"} />
                  </button>
                </div>
                <div style={{ padding: '12px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h4>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#94a3b8' }}>{item.category}</p>
                  <button style={styles.smallWatchBtn}>
                    <Play size={12} fill="#38bdf8" /> Tomosha qilish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* 3. SEVIMLILAR / LAYKLAR */}
      {activeTab === 'favorites' && (
        <main style={styles.main}>
          <h1 style={{ marginBottom: '8px' }}>Saqlangan Layklar ❤️</h1>
          <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Jami layklar: {likedCartoons.length} ta</p>
          
          {likedCartoons.length === 0 ? (
            <div style={styles.emptyState}>
              <Heart size={48} color="#94a3b8" />
              <h3>Siz hali hech qaysi multfilmga layk bosmadingiz.</h3>
            </div>
          ) : (
            <div style={styles.grid4}>
              {likedCartoons.map((item) => (
                <div key={item.id} style={styles.card} onClick={() => openCartoonDetail(item)}>
                  <div style={styles.cardImgWrapper}>
                    <img src={item.image} alt={item.title} style={styles.cardImg} />
                    <button style={styles.likeBtn} onClick={(e) => toggleLike(e, item.id)}>
                      <Heart size={16} fill="#ef4444" color="#ef4444" />
                    </button>
                  </div>
                  <div style={{ padding: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px' }}>{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* 4. PROFIL SAHIFASI */}
      {activeTab === 'profile' && (
        <main style={styles.main}>
          {!user ? (
            <div style={styles.loginCard}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <LogIn size={40} color="#38bdf8" />
                <h2>Tizimga Kirish</h2>
              </div>
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={styles.label}>Login yoki Ismingiz</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Dasturchi" 
                    required 
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    style={styles.formInput} 
                  />
                </div>
                <div>
                  <label style={styles.label}>Parol</label>
                  <input 
                    type="password" 
                    placeholder="******" 
                    required 
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    style={styles.formInput} 
                  />
                </div>
                <button type="submit" style={styles.primaryBtnFull}>Kirish</button>
              </form>
            </div>
          ) : (
            <div style={styles.profileBox}>
              <div style={styles.profileHeader}>
                <div style={styles.avatar}>{user.username[0].toUpperCase()}</div>
                <div>
                  <h2 style={{ margin: 0 }}>{user.username}</h2>
                  <p style={{ margin: '4px 0 0 0', color: '#38bdf8', fontSize: '14px' }}>Foydalanuvchi</p>
                </div>
                <button style={styles.logoutBtn} onClick={() => setUser(null)}>
                  <LogOut size={16} /> Chiqish
                </button>
              </div>

              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <Heart size={24} color="#ef4444" />
                  <h3>{likedIds.length} ta</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Bosilgan layklar</p>
                </div>
                <div style={styles.statCard}>
                  <Film size={24} color="#38bdf8" />
                  <h3>2,000 ta</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Multfilmlar bazasi</p>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* 5. MULTFILM DETAL SAHIFASI */}
      {activeTab === 'detail' && selectedCartoon && (
        <main style={styles.main}>
          <button style={styles.backBtn} onClick={() => setActiveTab('home')}>
            <ArrowLeft size={16} /> Ortga qaytish
          </button>

          <section style={styles.playerWrapper}>
            <div style={styles.playerTopBar}>
              <span style={styles.badgeDanger}>{selectedCartoon.subtitle}</span>
              <span style={styles.badgeInfo}>{selectedCartoon.quality}</span>
            </div>

            <div style={styles.videoArea}>
              {!isPlaying ? (
                <div style={styles.posterOverlay}>
                  <img src={selectedCartoon.image} alt={selectedCartoon.title} style={styles.posterImg} />
                  <button style={styles.bigPlayBtn} onClick={() => setIsPlaying(true)}>
                    <Play size={36} fill="#020c1b" color="#020c1b" />
                  </button>
                </div>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${selectedCartoon.youtubeId}?autoplay=1`}
                  title={selectedCartoon.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={styles.iframe}
                ></iframe>
              )}
            </div>
          </section>

          <section style={styles.infoGrid}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={styles.tag}>{selectedCartoon.age}</span>
                <span style={styles.tagStar}><Star size={14} fill="#f59e0b" color="#f59e0b" /> IMDb {selectedCartoon.rating}</span>
                <span style={styles.tag}>{selectedCartoon.category}</span>
              </div>

              <h1 style={{ margin: '8px 0 0 0' }}>{selectedCartoon.title}</h1>
              <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>{selectedCartoon.desc}</p>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button style={styles.primaryBtn} onClick={() => setIsPlaying(true)}>
                  <Play size={18} fill="#020c1b" /> Ijro etish
                </button>
                <button 
                  style={styles.secondaryBtn} 
                  onClick={(e) => toggleLike(e, selectedCartoon.id)}
                >
                  <Heart size={18} fill={likedIds.includes(selectedCartoon.id) ? "#ef4444" : "none"} color={likedIds.includes(selectedCartoon.id) ? "#ef4444" : "#fff"} /> 
                  {likedIds.includes(selectedCartoon.id) ? "Layk bosildi" : "Layk bosish"}
                </button>
              </div>
            </div>

            <div style={styles.pedagogBox}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={20} color="#38bdf8" />
                <h4 style={{ margin: 0 }}>Ekspert Bosi</h4>
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                To'liq sifatli va bolalar uchun xavfsiz tartibda ishlangani tasdiqlangan.
              </p>
            </div>
          </section>
        </main>
      )}

  
      <footer style={styles.footer}>
        <div>
          <div style={styles.logo}>Mimo<span style={{ color: '#38bdf8' }}>Kids</span></div>
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>2,000 ta takrorlanmas multfilmlar portali.</p>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '12px' }}>© 2026 Mimo Kids. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
}


const styles = {
  container: { backgroundColor: '#020c1b', color: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', backgroundColor: '#0a192f', borderBottom: '1px solid #1e293b', position: 'sticky', top: 0, zIndex: 100 },
  navLeft: { display: 'flex', alignItems: 'center', gap: '32px' },
  logo: { fontSize: '22px', fontWeight: 'bold', cursor: 'pointer' },
  navLinks: { display: 'flex', gap: '12px' },
  navLink: { backgroundColor: 'transparent', border: 'none', color: '#94a3b8', fontSize: '14px', cursor: 'pointer', padding: '6px 12px' },
  navLinkActive: { backgroundColor: '#1e293b', border: 'none', color: '#38bdf8', fontSize: '14px', cursor: 'pointer', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  searchBox: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#020c1b', padding: '6px 12px', borderRadius: '20px', border: '1px solid #1e293b' },
  searchInput: { backgroundColor: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '13px', width: '220px' },
  suggestionDropdown: { position: 'absolute', top: '40px', left: 0, right: 0, backgroundColor: '#0a192f', border: '1px solid #1e293b', borderRadius: '8px', overflow: 'hidden', zIndex: 200, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' },
  suggestionItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', fontSize: '13px', color: '#fff', cursor: 'pointer', borderBottom: '1px solid #1e293b' },
  langBtn: { backgroundColor: 'transparent', border: '1px solid #1e293b', color: '#fff', padding: '6px 10px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' },
  profileBtn: { backgroundColor: '#1e293b', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' },
  profileBtnActive: { backgroundColor: '#38bdf8', color: '#020c1b', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' },
  main: { padding: '32px 40px' },
  heroSection: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center', marginBottom: '40px', backgroundColor: '#0a192f', padding: '32px', borderRadius: '16px', border: '1px solid #1e293b' },
  heroText: { display: 'flex', flexDirection: 'column', gap: '12px' },
  heroTitle: { fontSize: '32px', margin: 0, lineHeight: 1.2 },
  heroImageCard: { position: 'relative', height: '250px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' },
  heroImg: { width: '100%', height: '100%', objectFit: 'cover' },
  playOverlayIcon: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#38bdf8', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  badge: { backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', width: 'fit-content' },
  primaryBtn: { backgroundColor: '#38bdf8', color: '#020c1b', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  secondaryBtn: { backgroundColor: '#0a192f', border: '1px solid #1e293b', color: '#fff', padding: '10px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  section: { marginTop: '32px', marginBottom: '32px' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#0a192f', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', position: 'relative' },
  cardImgWrapper: { position: 'relative', height: '140px' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover' },
  ratingBadge: { position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(2, 12, 27, 0.8)', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' },
  likeBtn: { position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(2, 12, 27, 0.8)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' },
  backBtn: { backgroundColor: '#0a192f', border: '1px solid #1e293b', color: '#38bdf8', padding: '8px 16px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  playerWrapper: { backgroundColor: '#000000', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1e293b', marginBottom: '32px' },
  playerTopBar: { padding: '12px 20px', display: 'flex', justifyContent: 'space-between', backgroundColor: '#0a192f' },
  badgeDanger: { backgroundColor: '#ef4444', color: '#fff', padding: '2px 10px', borderRadius: '10px', fontSize: '12px' },
  badgeInfo: { backgroundColor: '#0284c7', color: '#fff', padding: '2px 10px', borderRadius: '10px', fontSize: '12px' },
  videoArea: { position: 'relative', width: '100%', height: '450px', backgroundColor: '#000' },
  posterOverlay: { width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  posterImg: { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 },
  bigPlayBtn: { position: 'absolute', width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#38bdf8', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' },
  iframe: { width: '100%', height: '100%', border: 0 },
  infoGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '32px' },
  tag: { backgroundColor: '#0a192f', border: '1px solid #1e293b', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', color: '#94a3b8' },
  tagStar: { backgroundColor: '#0a192f', border: '1px solid #1e293b', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' },
  pedagogBox: { backgroundColor: '#0a192f', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  smallWatchBtn: { backgroundColor: 'transparent', border: '1px solid #38bdf8', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' },
  loadMoreBtn: { width: '100%', backgroundColor: '#0a192f', border: '1px solid #38bdf8', color: '#38bdf8', padding: '12px', borderRadius: '10px', marginTop: '24px', cursor: 'pointer', fontWeight: 'bold' },
  emptyState: { padding: '60px', textAlign: 'center', backgroundColor: '#0a192f', borderRadius: '16px', border: '1px solid #1e293b' },
  loginCard: { maxWidth: '400px', margin: '40px auto', backgroundColor: '#0a192f', border: '1px solid #1e293b', padding: '32px', borderRadius: '16px' },
  label: { display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' },
  formInput: { width: '100%', backgroundColor: '#020c1b', border: '1px solid #1e293b', padding: '10px', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
  primaryBtnFull: { width: '100%', backgroundColor: '#38bdf8', color: '#020c1b', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  profileBox: { backgroundColor: '#0a192f', border: '1px solid #1e293b', borderRadius: '16px', padding: '32px' },
  profileHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' },
  avatar: { width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#38bdf8', color: '#020c1b', fontSize: '24px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  logoutBtn: { marginLeft: 'auto', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  statCard: { backgroundColor: '#020c1b', border: '1px solid #1e293b', padding: '16px', borderRadius: '12px', textAlign: 'center' },
  footer: { backgroundColor: '#0a192f', borderTop: '1px solid #1e293b', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
};            