import React, { useState } from 'react';

const SearchBar = ({ onSearch, onLoadRandom, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Search a planet... (e.g. Kepler-452b)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button style={styles.searchBtn} type="submit" disabled={loading}>
          {loading ? '🔭 Searching...' : '🔍 Search'}
        </button>
      </form>
      <button style={styles.randomBtn} onClick={onLoadRandom} disabled={loading}>
        {loading ? '🌀 Loading...' : '🎲 Discover Random Planets'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    width: '100%',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '12px 18px',
    borderRadius: '30px',
    border: '1px solid #444',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
  },
  searchBtn: {
    padding: '12px 22px',
    borderRadius: '30px',
    border: 'none',
    background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
  },
  randomBtn: {
    padding: '10px 28px',
    borderRadius: '30px',
    border: '1px solid #6C63FF',
    background: 'transparent',
    color: '#6C63FF',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default SearchBar;