const NASA_BASE_URL = 'http://localhost:3001/nasa/TAP/sync';

export const fetchExoplanets = async (limit = 20) => {
  const query = `
    SELECT pl_name, pl_rade, pl_masse, pl_orbper, pl_eqt, 
           st_teff, st_rad, sy_dist, pl_bmasse, pl_dens
    FROM pscomppars 
    WHERE pl_rade > 0 AND st_teff > 0
    ORDER BY sy_dist ASC
  `;

  const url = `${NASA_BASE_URL}?query=${encodeURIComponent(query)}&format=json&maxrec=${limit}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch NASA data');
  return await response.json();
};

export const searchExoplanet = async (name) => {
  const query = `
    SELECT pl_name, pl_rade, pl_masse, pl_orbper, pl_eqt,
           st_teff, st_rad, sy_dist, pl_bmasse, pl_dens
    FROM pscomppars 
    WHERE pl_name LIKE '%${name}%'
  `;

  const url = `${NASA_BASE_URL}?query=${encodeURIComponent(query)}&format=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Search failed');
  return await response.json();
};