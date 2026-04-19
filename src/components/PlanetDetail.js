import React, { useState, useEffect } from 'react';
import { generatePlanetDescription } from '../services/aiService';
import { savePlanetToJournal } from '../services/backboardService';

const PlanetDetail = ({ planet, threadId, onClose, onSaved }) => {
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const desc = await generatePlanetDescription(planet);
        setDescription(desc);
      } catch (err) {
        setError('Failed to generate description. Check your API key.');
        console.log(err)
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [planet]);

  const handleSave = async () => {
    if (!threadId || saved) return;
    try {
      setSaving(true);
      await savePlanetToJournal(threadId, planet, description);
      setSaved(true);
      onSaved(planet.pl_name);
    } catch (err) {
      setError('Failed to save to journal.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
        <h2 style={styles.title}>🪐 {planet.pl_name}</h2>

        <div style={styles.stats}>
          <Stat label="Radius" value={planet.pl_rade ? `${planet.pl_rade.toFixed(2)}x Earth` : 'Unknown'} />
          <Stat label="Mass" value={planet.pl_masse ? `${planet.pl_masse.toFixed(2)}x Earth` : 'Unknown'} />
          <Stat label="Orbital Period" value={planet.pl_orbper ? `${planet.pl_orbper.toFixed(1)} days` : 'Unknown'} />
          <Stat label="Temperature" value={planet.pl_eqt ? `${planet.pl_eqt}K` : 'Unknown'} />
          <Stat label="Star Temp" value={planet.st_teff ? `${planet.st_teff}K` : 'Unknown'} />
          <Stat label="Distance" value={planet.sy_dist ? `${planet.sy_dist.toFixed(1)} pc` : 'Unknown'} />
        </div>

        {loading && (
          <div style={styles.loadingBox}>
            <div style={styles.spinner} />
            <p style={{ color: '#aaa', marginTop: 12 }}>AI is imagining this world...</p>
          </div>
        )}

        {error && <p style={{ color: '#FF6B6B', textAlign: 'center' }}>{error}</p>}

        {description && !loading && (
          <div style={styles.descContainer}>
            <Section icon="🌌" title="Appearance" text={description.appearance} />
            <Section icon="🌅" title="The Sky" text={description.sky} />
            <Section icon="🧬" title="Could Life Exist?" text={description.life} />
            <Section icon="💨" title="Atmosphere" text={description.atmosphere} />
            <div style={styles.funFact}>
              <span>⚡ </span>{description.funFact}
            </div>

            <button
              style={{ ...styles.saveBtn, opacity: saved ? 0.6 : 1 }}
              onClick={handleSave}
              disabled={saving || saved}
            >
              {saved ? '✅ Saved to Journal!' : saving ? '💾 Saving...' : '📓 Save to Explorer Journal'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 12px', textAlign: 'center' }}>
    <div style={{ color: '#aaa', fontSize: 11 }}>{label}</div>
    <div style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>{value}</div>
  </div>
);

const Section = ({ icon, title, text }) => (
  <div style={{ marginBottom: 16 }}>
    <h4 style={{ color: '#6C63FF', margin: '0 0 6px', fontSize: 14 }}>{icon} {title}</h4>
    <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{text}</p>
  </div>
);

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '20px',
  },
  modal: {
    background: '#0f0f1a',
    border: '1px solid rgba(108,99,255,0.4)',
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '85vh',
    overflowY: 'auto',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute', top: 16, right: 16,
    background: 'transparent', border: 'none',
    color: '#aaa', fontSize: 20, cursor: 'pointer',
  },
  title: { color: '#fff', fontSize: 22, marginBottom: 16, textAlign: 'center' },
  stats: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10, marginBottom: 20,
  },
  loadingBox: { textAlign: 'center', padding: '30px 0' },
  spinner: {
    width: 40, height: 40,
    border: '3px solid #333',
    borderTop: '3px solid #6C63FF',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  },
  descContainer: { marginTop: 10 },
  funFact: {
    background: 'rgba(108,99,255,0.15)',
    border: '1px solid rgba(108,99,255,0.4)',
    borderRadius: 12,
    padding: '12px 16px',
    color: '#fff',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 1.6,
  },
  saveBtn: {
    width: '100%', padding: '14px',
    borderRadius: '30px', border: 'none',
    background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
    color: '#fff', fontWeight: 'bold',
    fontSize: 15, cursor: 'pointer',
  },
};

export default PlanetDetail;