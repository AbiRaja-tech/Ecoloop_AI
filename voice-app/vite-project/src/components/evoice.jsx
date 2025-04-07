// src/components/EcoVoice.jsx
import React, { useState, useEffect, useCallback } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";

const GEMINI_API_KEY = "AIzaSyD3-cF29QoWvsxq51X1pF9hknvVi7YtzHE";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default function EcoVoice({ user }) {
  const [model, setModel] = useState(null);
  const [userCode, setUserCode] = useState(user?.UniqueID || "");
  const [conversation, setConversation] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [userName, setUserName] = useState(user?.Name || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [micOn, setMicOn] = useState(true);

  const { speak } = useSpeechSynthesis();
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    const loadModel = async () => {
      const _model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      setModel(_model);
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (transcript.trim() && summaryData) {
      const timeout = setTimeout(() => {
        if (!isProcessing && micOn) handleAsk(transcript.trim());
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [transcript, micOn, isProcessing, summaryData]);

  const fetchUserData = async () => {
    try {
      const q = query(collection(db, "ecoData"), where("UniqueID", "==", userCode));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map((doc) => doc.data());

      if (docs.length === 0) {
        alert("No data found for this user.");
        return;
      }

      console.log("📥 Raw Firestore Entries:", docs);

      const name = docs.find((d) => d.Name)?.Name || userCode;
      setUserName(name);

      const summary = {
        name,
        total_walk_km: 0,
        cycled_km: 0,
        compost_kg: 0,
        donation_count: 0,
        energy_points: 0,
        water_points: 0,
        community_points: 0,
        carbon_footprint_goods: 0,
        total_points: 0,
        gardening_hours: 0,
        ac_reduction_hours: 0,
        cleanup_hours: 0,
        entries: docs.length,
      };

      docs.forEach((entry) => {
        summary.total_walk_km += entry?.Mobility?.["Walking Distance (km)"] ?? 0;
        summary.cycled_km += entry?.Mobility?.["Cycled Distance (km)"] ?? 0;
        summary.compost_kg += entry?.Waste?.["Compost Used (kg)"] ?? 0;
        summary.donation_count += entry?.Waste?.["Donation Made"] ?? 0;
        summary.energy_points += entry?.Energy?.Points ?? 0;
        summary.water_points += entry?.Water?.Points ?? 0;
        summary.community_points += entry?.Community?.Points ?? 0;
        summary.carbon_footprint_goods += entry?.Consumption?.["Carbon Footprint Goods"] ?? 0;
        summary.gardening_hours += entry?.Community?.["Urban Gardening Assistance"]?.hoursContributed ?? 0;
        summary.cleanup_hours += entry?.Community?.["Cleanup Drives"]?.hoursContributed ?? 0;
        summary.ac_reduction_hours += entry?.Energy?.["AC Usage Reduction"]?.reducedToHours ?? 0;
        summary.total_points += entry?.TotalPoints ?? 0;
      });

      setSummaryData(summary);
      const greet = `Hi ${name}! Your eco data has been loaded. Ask me anything.`;
      setConversation((prev) => [...prev, { role: "system", text: greet }]);
      speak({ text: greet });

      if (micOn) SpeechRecognition.startListening({ continuous: true });
    } catch (err) {
      console.error("❌ Firestore Error:", err);
      alert("Something went wrong. Check console.");
    }
  };

  const handleAsk = useCallback(async (text) => {
      setIsProcessing(true);
      setConversation((prev) => [...prev, { role: "user", text }]);
      resetTranscript();

      let response = "";

      try {
        const lowerText = text.toLowerCase();

        const isImproveQuestion =
          lowerText.includes("improve") ||
          lowerText.includes("how can i get better") ||
          lowerText.includes("what should i do better") ||
          lowerText.includes("how to increase my score");

        if (isImproveQuestion) {
          const summary = summaryData;
          response = `
  I'm still learning to give personalized improvement tips! 💡 In the meantime:
  
  🧭 **Check your dashboard** to see your performance in different areas.
  🗺️ **Use maps** to plan sustainable travel options like walking, cycling, or public transport.
  
  Here’s a quick profile summary:
  
  - 🚶 Walking: ${summary.total_walk_km} km
  - 🚲 Cycled: ${summary.cycled_km} km
  - 🌱 Compost: ${summary.compost_kg} kg, Donations: ${summary.donation_count}
  - ⚡ Energy Points: ${summary.energy_points}
  - 💧 Water Points: ${summary.water_points}
  - 🤝 Community Points: ${summary.community_points}
  - 🧠 Carbon Footprint (Goods): ${summary.carbon_footprint_goods}
  - 🏆 Total Reward Points: ${summary.total_points}
  
  You're doing great, ${summary.name}! Keep going 💚
          `.trim();
        } else {
          const prompt = `
  You are a friendly eco-coach. Here's the user's profile:
  
  Name: ${summaryData.name}
  Total Walked: ${summaryData.total_walk_km} km
  Cycled: ${summaryData.cycled_km} km
  Compost Used: ${summaryData.compost_kg} kg
  Donations Made: ${summaryData.donation_count}
  Energy Points: ${summaryData.energy_points}
  Water Points: ${summaryData.water_points}
  Community Points: ${summaryData.community_points}
  Cleanup Drive Hours: ${summaryData.cleanup_hours}
  Gardening Hours: ${summaryData.gardening_hours}
  AC Usage Reduction: ${summaryData.ac_reduction_hours} hrs
  Carbon Footprint (Goods): ${summaryData.carbon_footprint_goods}
  Total Eco Points: ${summaryData.total_points}
  
  Now answer the following question helpfully and in one paragraph:
  "${text}"
          `;

          const result = await model.generateContent(prompt);
          response = result.response.text();
        }
      } catch (err) {
        if (err.message.includes("429")) {
          response = "⚠️ I’ve hit my request limit. Try again later or upgrade the plan.";
        } else {
          response = "Something went wrong while answering.";
          console.error("Gemini error:", err);
        }
      }

      setConversation((prev) => [...prev, { role: "eco", text: response }]);
      speak({ text: response });
      setIsProcessing(false);
      if (micOn) setTimeout(() => SpeechRecognition.startListening({ continuous: true }), 300);
    },
    [summaryData, model, micOn, resetTranscript, speak]
  );

  const toggleMic = () => {
    if (micOn) SpeechRecognition.stopListening();
    else SpeechRecognition.startListening({ continuous: true });
    setMicOn(!micOn);
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <div className="flex-grow flex items-center justify-center w-full max-w-[800px] min-h-[650px] p-0 min-h-0">
        <div className="overflow-y-auto max-h-[calc(100vh-200px)] w-full p-4 space-y-2">
          <input
            placeholder="Enter your User ID (e.g., user_002)"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            //className="eco-input"
          />
          <button onClick={fetchUserData} className="glass-button">
            Load Data
          </button>
            <button
              onClick={toggleMic}
              //className={`glass-button ${micOn ? "mic-on" : "mic-off"}`}
            >
              {micOn ? "Mute Mic" : "Unmute Mic"}
            </button>
            {summaryData && (
          <button
            onClick={() => alert(JSON.stringify(summaryData, null, 2))}
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              background: "#6D28D9",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
            }}
          >
            View Summary
          </button>
        )}
          </div>
          <div style={{ marginTop: "1rem", maxWidth: "600px" }}>
        <ul>
          {conversation.map((msg, i) => (
            <li key={i} style={{ marginBottom: "10px" }}>
              <strong>{msg.role === "user" ? "You" : msg.role === "eco" ? "Eco" : "System"}:</strong> {msg.text}
            </li>
          ))}
        </ul>
        {listening && !isProcessing && <p style={{ color: "gray" }}>🎤 Listening…</p>}
        {isProcessing && <p style={{ color: "orange" }}>🤖 Thinking…</p>}
      </div> 
      )
    </div>
  );
}