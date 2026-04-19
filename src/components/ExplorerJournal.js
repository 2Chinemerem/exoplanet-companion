import React from 'react';

const ExplorerJournal = ({ visitedPlanets, onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
        <h2 style={styles.title}>📓 Explorer Journal</h2>
        <p style={styles.subtitle}>Planets you've discovered on this mission</p>

        {visitedPlanets.length === 0 ? (
          <div style={styles.empty}>
            <p>🌌 No planets explored yet.</p>
            <p style={{ color: '#666', fontSize: 13 }}>Start exploring to fill your journal!</p>
          </div>
        ) : (
          <div style={styles.list}>
            {visitedPlanets.map((name, i) => (
              <div key={i} style={styles.entry}>
                <span style={styles.entryNum}>{i + 1}</span>
                <span style={styles.entryName}>🪐 {name}</span>
                <span style={styles.entryCheck}>✓</span>
              </div>
            ))}
          </div>
        )}

        <div style={styles.footer}>
          {visitedPlanets.length} planet{visitedPlanets.length !== 1 ? 's' : ''} explored
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex', justifyContent: 'flex-end',
    zIndex: 999,
  },
  panel: {
    background: '#0d0d1a',
    border: '1px solid rgba(62,207,207,0.3)',
    width: '320px',
    height: '100%',
    padding: '30px 20px',
    overflowY: 'auto',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute', top: 16, right: 16,
    background: 'transparent', border: 'none',
    color: '#aaa', fontSize: 20, cursor: 'pointer',
  },
  title: { color: '#fff', fontSize: 20, margin: '0 0 6px' },
  subtitle: { color: '#666', fontSize: 13, margin: '0 0 24px' },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 60, lineHeight: 2 },
  list: { display: 'flex', flexDirection: 'column', gap: 10 },
  entry: {
    display: 'flex', alignItems: 'center', gap: 12,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10, padding: '10px 14px',
  },
  entryNum: { color: '#555', fontSize: 12, width: 16 },
  entryName: { color: '#fff', fontSize: 14, flex: 1 },
  entryCheck: { color: '#3ECFCF', fontWeight: 'bold' },
  footer: {
    marginTop: 30, textAlign: 'center',
    color: '#3ECFCF', fontSize: 13, fontWeight: 'bold',
  },
};

export default ExplorerJournal;