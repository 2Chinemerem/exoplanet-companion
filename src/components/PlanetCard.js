import React from 'react';

const planetColors = [
  '#FF6B6B', '#FFA500', '#6C63FF', '#3ECFCF',
  '#FF8C94', '#A8FF78', '#F7971E', '#56CCF2'
];

const PlanetCard = ({ planet, onClick, isVisited }) => {
  const color = planetColors[Math.abs(planet.pl_name.charCodeAt(0)) % planetColors.length];
  const size = planet.pl_rade
    ? Math.min(Math.max(planet.pl_rade * 12, 40), 90)
    : 55;

  return (
    <div style={styles.card} onClick={() => onClick(planet)}>
      {isVisited && <div style={styles.visitedBadge}>✓ Visited</div>}
      <div style={{ ...styles.planet, width: size, height: size, background: `radial-gradient(circle at 35% 35%, white, ${color})`, boxShadow: `0 0 20px ${color}88` }} />
      <div style={styles.info}>
        <h3 style={styles.name}>{planet.pl_name}</h3>
        <p style={styles.detail}>
          {planet.pl_rade ? `🌍 ${planet.pl_rade.toFixed(2)}x Earth` : '🌍 Size unknown'}
        </p>
        <p style={styles.detail}>
          {planet.sy_dist ? `📡 ${planet.sy_dist.toFixed(1)} parsecs away` : '📡 Distance unknown'}
        </p>
        <p style={styles.detail}>
          {planet.pl_eqt ? `🌡️ ${planet.pl_eqt}K surface temp` : '🌡️ Temp unknown'}
        </p>
      </div>
      <div style={styles.exploreBtn}>Explore →</div>
    </div>
  );
};

const styles = {
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '20px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    transition: 'transform 0.2s, border-color 0.2s',
    position: 'relative',
  },
  planet: {
    borderRadius: '50%',
    flexShrink: 0,
  },
  info: {
    textAlign: 'center',
    width: '100%',
  },
  name: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    margin: '0 0 6px',
  },
  detail: {
    color: '#aaa',
    fontSize: '12px',
    margin: '3px 0',
  },
  exploreBtn: {
    color: '#6C63FF',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  visitedBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: '#3ECFCF',
    color: '#000',
    fontSize: '10px',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '10px',
  },
};

export default PlanetCard;