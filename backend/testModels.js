const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function run() {
  try {
     const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
     const data = await res.json();
     
     if(data.models) {
        const generateModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
        console.log("Supported Models for generateContent:");
        generateModels.forEach(m => console.log(m.name.replace("models/", "")));
     } else {
        console.log("Response:", data);
     }
  } catch (e) {
     console.error("Error", e);
  }
}
run();
