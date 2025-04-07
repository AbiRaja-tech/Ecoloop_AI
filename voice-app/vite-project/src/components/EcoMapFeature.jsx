// src/components/EcoMapFeature.jsx
import React, { useState } from 'react';
import EcoMap from './EcoMap';
import { getGeminiResponse } from '../utils/geminiApi';

export default function EcoMapFeature({ user }) {
  const [origin, setOrigin] = useState(null); // { lat, lng }
  const [destination, setDestination] = useState(null); // { lat, lng }
  const [ecoAdvice, setEcoAdvice] = useState("");
  const [pointsSelected, setPointsSelected] = useState(false);

  const handleMapPointsSelected = ({ origin, destination }) => {
    setOrigin(origin);
    setDestination(destination);
    setPointsSelected(true); // Hide map once both points are selected
  };

  const handleGetEcoRoute = async () => {
    if (!origin || !destination) {
      setEcoAdvice("Please select both origin and destination.");
      return;
    }

    try {
      const prompt = `
        As an eco-friendly assistant, suggest the most sustainable way to travel between two points:
        Origin: (${origin.lat}, ${origin.lng})
        Destination: (${destination.lat}, ${destination.lng})
        Consider options like walking, cycling, public transport, or carpooling. 
        Provide the response in plain text (no Markdown, no asterisks, no special characters) with:
        Recommended Mode: [Your suggestion]
        Details: 
        - [First detail]
        - [Second detail]
        Carbon Impact: [CO2 savings estimate, e.g., "Reduces CO2 by X kg compared to driving"]
      `;
      const response = await getGeminiResponse(prompt);
      setEcoAdvice(response);
    } catch (error) {
      setEcoAdvice("Failed to fetch eco-friendly route advice.");
      console.error("Gemini API error:", error);
    }
  };

  return (
    <div>
      <h1>EcoLoop 2080</h1>
      {!pointsSelected ? (
        <EcoMap onPointsSelected={handleMapPointsSelected} />
      ) : (
        <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <p><strong>Origin:</strong> ({origin.lat.toFixed(4)}, {origin.lng.toFixed(4)})</p>
          <p><strong>Destination:</strong> ({destination.lat.toFixed(4)}, {destination.lng.toFixed(4)})</p>
          <button onClick={handleGetEcoRoute}>Get Eco Route</button>
          {ecoAdvice && (
            <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
              {ecoAdvice.split('\n').map((line, index) => {
                if (line.startsWith('Recommended Mode:')) {
                  return <h3 key={index} style={{ margin: '1rem 0 0.5rem 0' }}>{line}</h3>;
                } else if (line.startsWith('Details:')) {
                  return <h4 key={index} style={{ margin: '0.5rem 0' }}>{line}</h4>;
                } else if (line.startsWith('-')) {
                  return <p key={index} style={{ margin: '0.2rem 0 0 1rem' }}>{line.replace('- ', '')}</p>;
                } else if (line.startsWith('Carbon Impact:')) {
                  return <p key={index} style={{ margin: '0.5rem 0', fontStyle: 'italic' }}>{line}</p>;
                } else {
                  return <p key={index} style={{ margin: '0.5rem 0' }}>{line}</p>;
                }
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}