# 🌱 **EcoLoop 2080**

---

## 👥 **Team Members**  
- **Total:** 4  

---

## 📋 **Project Name**  
- **EcoLoop 2080**  

---

## 🔧 **Google Technologies Used**  
- Firebase Firestore  
- Google Maps API  
- Google Cloud Platform (GCP)  
- Gemini API  
- Firebase Authentication  
- Google Data Analytics  

---

## 🤖 **Google Gemini API Usage**  
- **Yes**  

---

## 🚨 **Problem Statement (2080 Scenario)**  
By 2080, climate change will dominate daily life, intensified by hyper-urbanization, resource scarcity, and extreme weather. Individuals will struggle to track and reduce their environmental footprint amid complex urban systems. Awareness exists, but people lack real-time feedback, localized guidance, and incentives to adopt sustainable habits in transportation, energy, water, and waste management. Governments alone can’t shift behaviors—sustainability demands a grassroots, tech-driven approach. Without personalized tools, urban dwellers will perpetuate unsustainable practices, worsening resource strain. Current gaps include the absence of intelligent, voice-enabled, data-driven systems to coach individuals effectively.

---

## 💡 **Proposed Solution**  
**EcoGuardians 2080**, powered by the Gemini API, is a voice-interactive sustainability coach designed for 2080’s urban challenges. It tracks eco-activities via Firebase Firestore, offering real-time insights and personalized tips. Users engage through natural voice commands, enabled by `react-speech-recognition` and `react-speech-kit`, for a seamless experience. Gemini analyzes data—like walking distance or water saved—delivering smart route suggestions via Google Maps API and motivational advice. A gamified points system rewards eco-actions, redeemable for sustainable products or services. Top performers earn public recognition and government perks (e.g., subsidies), fostering a collective movement. This scalable, AI-driven guide empowers sustainable living.

---

## 🧠 **Code Summary**  

**EcoLoop 2080** uses **React.js** for a dynamic frontend, with state managed via Hooks. Voice features leverage `react-speech-recognition` (speech-to-text) and `react-speech-kit` (text-to-speech). **Firebase Firestore** stores eco-data (e.g., `WalkingDistance`, `WaterSaved`) by `UniqueID`, enabling real-time tracking. On login, the app queries `ecoData`, displaying points across categories like Mobility and Energy. Data is normalized into strings (e.g., "Walked 4.5 km, saved 12L") and sent to the **Gemini API** via `fetch()` POST, with responses voiced using `speechSynthesis`. **Google Maps API** suggests eco-routes, justified by Gemini. Gamification assigns points, redeemable for rewards, with top users flagged for perks. The code is scalable for future analytics enhancements.
