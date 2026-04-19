const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

export const generatePlanetDescription = async (planet) => {
  const prompt = `
You are an imaginative space explorer narrator.

Based on the NASA exoplanet data below, generate a vivid but scientifically grounded description.

Planet Name: ${planet.pl_name}
Radius (Earth radii): ${planet.pl_rade || 'Unknown'}
Mass (Earth masses): ${planet.pl_masse || 'Unknown'}
Orbital Period (days): ${planet.pl_orbper || 'Unknown'}
Equilibrium Temperature (K): ${planet.pl_eqt || 'Unknown'}
Star Temperature (K): ${planet.st_teff || 'Unknown'}
Distance from Earth (parsecs): ${planet.sy_dist || 'Unknown'}

IMPORTANT:
- Respond ONLY in valid JSON
- Do NOT include markdown or backticks
- Do NOT include any explanation

FORMAT:
{
  "appearance": "2-3 sentences",
  "sky": "2 sentences",
  "life": "2-3 sentences",
  "atmosphere": "2 sentences",
  "funFact": "One jaw-dropping fact"
}
`;

  const models = [
    "mistralai/mistral-7b-instruct:free",
    "openchat/openchat-3.5"
  ];

  for (let model of models) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "ExoPlanet Companion"
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 400 // safer for free models
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`Model ${model} failed:`, errText);
        continue; // try next model
      }

      const data = await response.json();
      let text = data.choices[0].message.content;

      // Clean output
      text = text.replace(/```json|```/g, '').trim();

      // Extract JSON safely
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      return JSON.parse(jsonMatch ? jsonMatch[0] : text);

    } catch (err) {
      console.error(`Error with model ${model}:`, err);
      continue;
    }
  }

  // 🚨 FINAL FALLBACK (never break your app)
  return {
    appearance: `A mysterious world known as ${planet.pl_name}, with extreme and unknown terrain shaped by cosmic forces.`,
    sky: "The sky shifts in strange colors due to its distant star.",
    life: "Life may exist in exotic microbial forms adapted to harsh conditions.",
    atmosphere: "The atmosphere is dense and unusual, possibly toxic to humans.",
    funFact: "This planet exists in real NASA data but remains largely unexplored."
  };
};