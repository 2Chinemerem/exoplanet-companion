const BACKBOARD_API_KEY = process.env.REACT_APP_BACKBOARD_API_KEY;
const BACKBOARD_ASSISTANT_ID = process.env.REACT_APP_BACKBOARD_ASSISTANT_ID;
const BASE_URL = 'https://app.backboard.io/api';

const headers = {
  'X-API-Key': BACKBOARD_API_KEY,
  'Content-Type': 'application/json'
};

export const createThread = async () => {
  const response = await fetch(`${BASE_URL}/assistants/${BACKBOARD_ASSISTANT_ID}/threads`, {
    method: 'POST',
    headers,
    body: JSON.stringify({})
  });

  const data = await response.json();
  console.log('Thread creation response:', JSON.stringify(data));

  if (!response.ok) throw new Error(data.detail || 'Failed to create thread');
  return data.thread_id || data.id;
};

export const savePlanetToJournal = async (threadId, planet, description) => {
  const content = `
    Explorer visited: ${planet.pl_name}
    Distance: ${planet.sy_dist ? planet.sy_dist.toFixed(1) + ' parsecs' : 'Unknown'}
    Appearance: ${description.appearance}
    Fun Fact: ${description.funFact}
    Date visited: ${new Date().toLocaleDateString()}
  `;

  const formData = new FormData();
  formData.append('content', content);
  formData.append('stream', 'false');
  formData.append('memory', 'Auto');

  const response = await fetch(`${BASE_URL}/threads/${threadId}/messages`, {
    method: 'POST',
    headers: { 'X-API-Key': BACKBOARD_API_KEY },
    body: formData
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to save to journal');
  return data;
};

export const getJournalHistory = async (threadId) => {
  const response = await fetch(`${BASE_URL}/threads/${threadId}/messages`, {
    method: 'GET',
    headers: { 'X-API-Key': BACKBOARD_API_KEY }
  });
  if (!response.ok) throw new Error('Failed to fetch journal');
  return await response.json();
};