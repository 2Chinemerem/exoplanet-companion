import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import PlanetCard from './components/PlanetCard';
import PlanetDetail from './components/PlanetDetail';
import ExplorerJournal from './components/ExplorerJournal';
import { fetchExoplanets, searchExoplanet } from './services/nasaService';
import { createThread } from './services/backboardService';

const App = () => {
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [threadId, setThreadId] = useState(null);
  const [visitedPlanets, setVisitedPlanets] = useState([]);
  const [showJournal, setShowJournal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stars, setStars] = useState([]);

  // Generate random stars for background
  useEffect(() => {
    const generated = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      duration: Math.random() * 3 + 2,
    }));
    setStars(generated);
  }, []);

  // Initialize Backboard thread on load
  useEffect(() => {
    const initThread = async () => {
      try {
        const id = await createThread();
        setThreadId(id);
      } catch (err) {
        console.warn('Backboard thread failed:', err.message);
      }
    };
    initThread();
  }, []);

  const handleLoadRandom = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchExoplanets(20);
      setPlanets(data);
    } catch (err) {
      setError('Failed to load planets. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchExoplanet(query);
      if (data.length === 0) {
        setError(`No planets found matching "${query}". Try "Kepler" or "TRAPPIST".`);
      }
      setPlanets(data);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanetSaved = (planetName) => {
    setVisitedPlanets((prev) =>
      prev.includes(planetName) ? prev : [...prev, planetName]
    );
  };

  return (
    <div style={styles.app}>
      {/* Starfield background */}
      <div style={styles.starfield}>
        {stars.map((star) => (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              background: '#fff',
              opacity: star.opacity,
              animation: `twinkle ${star.duration}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🪐</span>
          <div>
            <h1 style={styles.logoTitle}>ExoPlanet Companion</h1>
            <p style={styles.logoSub}>Discover Alien Worlds · Powered by NASA & Open-Source AI</p>
          </div>
        </div>
        <button style={styles.journalBtn} onClick={() => setShowJournal(true)}>
          📓 Journal
          {visitedPlanets.length > 0 && (
            <span style={styles.badge}>{visitedPlanets.length}</span>
          )}
        </button>
      </header>

      {/* Hero */}
      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>
          Explore <span style={styles.highlight}>6,000+</span> Real Alien Worlds
        </h2>
        <p style={styles.heroSub}>
          Real NASA exoplanet data · AI-generated descriptions · Your personal explorer journal
        </p>
        <SearchBar
          onSearch={handleSearch}
          onLoadRandom={handleLoadRandom}
          loading={loading}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>⚠️ {error}</div>
      )}

      {/* Empty state */}
      {planets.length === 0 && !loading && !error && (
        <div style={styles.emptyState}>
          <div style={styles.emptyPlanet}>🌌</div>
          <p style={styles.emptyText}>The universe awaits. Search a planet or discover random worlds.</p>
        </div>
      )}

      {/* Planet Grid */}
      {planets.length > 0 && (
        <div style={styles.grid}>
          {planets.map((planet, i) => (
            <PlanetCard
              key={i}
              planet={planet}
              onClick={setSelectedPlanet}
              isVisited={visitedPlanets.includes(planet.pl_name)}
            />
          ))}
        </div>
      )}

      {/* Planet Detail Modal */}
      {selectedPlanet && (
        <PlanetDetail
          planet={selectedPlanet}
          threadId={threadId}
          onClose={() => setSelectedPlanet(null)}
          onSaved={handlePlanetSaved}
        />
      )}

      {/* Explorer Journal */}
      {showJournal && (
        <ExplorerJournal
          visitedPlanets={visitedPlanets}
          onClose={() => setShowJournal(false)}
        />
      )}

      {/* CSS Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060612; font-family: 'Inter', sans-serif; }
        @keyframes twinkle {
          from { opacity: 0.2; transform: scale(1); }
          to { opacity: 1; transform: scale(1.3); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a15; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>
    </div>
  );
};

const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #060612 0%, #0a0a1f 50%, #060612 100%)',
    color: '#fff',
    position: 'relative',
    overflowX: 'hidden',
  },
  starfield: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    position: 'relative',
    zIndex: 10,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  logoIcon: { fontSize: 36 },
  logoTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#fff',
  },
  logoSub: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  journalBtn: {
    padding: '10px 20px',
    borderRadius: '30px',
    border: '1px solid rgba(62,207,207,0.4)',
    background: 'rgba(62,207,207,0.08)',
    color: '#3ECFCF',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  badge: {
    background: '#3ECFCF',
    color: '#000',
    borderRadius: '50%',
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 'bold',
  },
  hero: {
    textAlign: 'center',
    padding: '60px 20px 40px',
    position: 'relative',
    zIndex: 10,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 12,
    lineHeight: 1.2,
  },
  highlight: {
    background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSub: {
    color: '#888',
    fontSize: 16,
    marginBottom: 30,
  },
  errorBox: {
    background: 'rgba(255,107,107,0.1)',
    border: '1px solid rgba(255,107,107,0.3)',
    color: '#FF6B6B',
    borderRadius: 12,
    padding: '12px 20px',
    maxWidth: 600,
    margin: '0 auto 20px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 10,
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    position: 'relative',
    zIndex: 10,
  },
  emptyPlanet: { fontSize: 80, marginBottom: 20 },
  emptyText: { color: '#555', fontSize: 16 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 20,
    padding: '20px 40px 60px',
    position: 'relative',
    zIndex: 10,
  },
};

export default App;