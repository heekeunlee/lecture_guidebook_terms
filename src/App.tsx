import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import terminologyData from './data/terminology.json';

const SplashScreen = () => {
  return (
    <motion.div 
      className="splash-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="splash-content">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="splash-logo"
        >
          <img src={(import.meta.env.BASE_URL || '') + 'logo.png'} alt="내일도 렛유인 Edu" style={{ height: '80px', width: 'auto', marginBottom: '1.5rem', objectFit: 'contain' }} />
          <div className="splash-text-group">
            <h1 className="splash-title">업계용어 100</h1>
            <p className="splash-subtitle">for Display Engineering</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="loading-bar-container"
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        >
          <div className="loading-bar-fill" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTermCat, setActiveTermCat] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 30;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const filteredTerms = terminologyData.filter(t => 
    (activeTermCat === '전체' || t.category === activeTermCat) &&
    (t.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
     t.desc.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => a.term.localeCompare(b.term));

  const pageCount = Math.ceil(filteredTerms.length / itemsPerPage);
  const currentTerms = filteredTerms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!isAuthenticated) {
    return (
      <div className="login-screen-outer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'var(--bg-tertiary)', padding: '3rem', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
        >
          <Lock size={48} style={{ margin: '0 auto 1.5rem auto', color: 'var(--accent)' }} />
          <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 600 }}>접근 권한 확인</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>패스워드를 입력해주세요</p>
          <input 
            type="password" 
            maxLength={4}
            placeholder="••••"
            value={password}
            onChange={(e) => {
              const val = e.target.value;
              setPassword(val);
              if(val === '1234') {
                setTimeout(() => setIsAuthenticated(true), 200);
              }
            }}
            autoFocus
            style={{
              fontSize: '2rem',
              letterSpacing: '0.8rem',
              textAlign: 'left',
              width: '160px',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: '2px solid var(--border)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.5 }}
        >
          <img 
            src={(import.meta.env.BASE_URL || '') + 'logo.png'} 
            alt="내일도 렛유인 Edu" 
            style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
          />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isLoading && <SplashScreen key="splash" />}
      </AnimatePresence>

      <div className="app-container">
      <nav className="main-nav" style={{ justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <div className="nav-group">
          <button onClick={toggleTheme} className="icon-button">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <header>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="logo-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <img src={(import.meta.env.BASE_URL || '') + 'logo.png'} alt="내일도 렛유인 Edu" style={{ height: '36px', width: 'auto', objectFit: 'contain', filter: theme === 'dark' ? 'brightness(1.5)' : 'none' }} />
          </div>
          <h1>디스플레이 업계용어 100선</h1>
          <p className="header-subtitle">실무에서 바로 만나는 엔지니어 핵심 가이드</p>
        </motion.div>
      </header>

      <main>
        <div className="terminology-container">
          <div className="terminology-nav" style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            {['전체', '디스플레이', '공정', '데이터 처리', '코딩'].map(cat => (
              <button 
                key={cat} 
                className={`term-cat-btn ${activeTermCat === cat ? 'active' : ''}`}
                onClick={() => { setActiveTermCat(cat); setCurrentPage(1); }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="search-wrapper" style={{ position: 'relative', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <Search className="search-icon" size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder={`${activeTermCat} 분야 용어 검색...`} 
              className="terminology-search"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>

          {pageCount > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1} 
                className="nav-btn"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="page-indicator">{currentPage} / {pageCount}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))} 
                disabled={currentPage === pageCount} 
                className="nav-btn"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          <div className="terminology-grid">
            {currentTerms.map((t, idx) => (
              <motion.div 
                key={t.term}
                className="term-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.01, 0.5) }}
              >
                <div className="term-header">
                  <span className="term-cat-tag">{t.category}</span>
                  <h2 className="term-word">{t.term}</h2>
                </div>
                <div className="term-full">{t.full}</div>
                <p className="term-desc">{t.desc}</p>
              </motion.div>
            ))}
          </div>
          {filteredTerms.length === 0 && (
            <div className="no-results">찾으시는 검색 결과가 없습니다.</div>
          )}
        </div>
      </main>

      <footer style={{ display: 'flex', justifyContent: 'center', marginTop: '6rem', paddingBottom: '2rem', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
        <img src={(import.meta.env.BASE_URL || '') + 'logo.png'} alt="내일도 렛유인 Edu" style={{ height: '40px', width: 'auto', objectFit: 'contain', filter: theme === 'dark' ? 'brightness(1.5)' : 'none', opacity: 0.8 }} />
      </footer>
      </div>
      
      <style>{`
        .icon-button {
          background: var(--bg-tertiary); border: 1px solid var(--border);
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .terminology-container { display: flex; flex-direction: column; gap: 2rem; }
        .term-cat-btn {
          background: var(--bg-secondary); border: 1px solid var(--border);
          padding: 8px 20px; border-radius: 20px; color: var(--text-secondary);
          font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .term-cat-btn:hover { border-color: var(--accent); color: var(--accent); }
        .term-cat-btn.active { background: var(--accent); color: white; border-color: var(--accent); }
        .terminology-search { 
          width: 100%; padding: 16px 16px 16px 48px; border-radius: 12px;
          border: 2px solid var(--border); background: var(--bg-secondary);
          color: var(--text-primary); font-size: 1.1rem; box-sizing: border-box; outline: none; transition: border-color 0.2s;
        }
        .terminology-search:focus { border-color: var(--accent); }
        .terminology-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .term-card {
          background: var(--bg-tertiary); border: 1px solid var(--border);
          padding: 1.5rem; border-radius: 16px; transition: transform 0.2s, box-shadow 0.2s;
        }
        .term-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); }
        .term-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 8px; flex-wrap: wrap; }
        .term-cat-tag { background: rgba(0, 113, 227, 0.1); color: var(--accent); padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; white-space: nowrap; }
        .term-word { font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin: 0; }
        .term-full { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 12px; font-family: monospace; }
        .term-desc { color: var(--text-primary); font-size: 0.95rem; line-height: 1.6; margin: 0; }
        .no-results { text-align: center; padding: 4rem; color: var(--text-secondary); font-size: 1.2rem; }
        
        @media (max-width: 768px) {
          .terminology-grid { grid-template-columns: 1fr; gap: 1rem; }
        }
      `}</style>
    </>
  );
}
