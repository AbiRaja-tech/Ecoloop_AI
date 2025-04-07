// src/utils/geminiApi.js
export async function getGeminiResponse(prompt) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyA_PiJzgCoN1wUyeNuRbQafFPAYRc5nB2g`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
  
    const data = await response.json();
    console.log("Gemini raw data:", JSON.stringify(data, null, 2));
  
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No explanation available.";
  }