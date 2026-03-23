const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;
if(process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

exports.analyzeCode = async (code, language) => {
  if(!genAI) {
     throw new Error("Gemini API key is not configured.");
  }
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
  You are an expert Senior Software Engineer and Performance Specialist. Review the following ${language} code and provide a JSON response STRICTLY matching this exact structure:
  {
    "deepAnalysis": [
      { "category": "Syntax errors", "description": "Explanation here", "highlightedCode": "Specific code snippet" },
      { "category": "Logical issues", "description": "Explanation here", "highlightedCode": "Specific code snippet" },
      { "category": "Scope and reusability", "description": "Explanation here", "highlightedCode": "Specific code snippet" },
      { "category": "Input validation", "description": "Explanation here", "highlightedCode": "Specific code snippet" },
      { "category": "Architectural modularity", "description": "Explanation here", "highlightedCode": "Specific code snippet" },
      { "category": "Error handling", "description": "Explanation here", "highlightedCode": "Specific code snippet" }
    ],
    "optimizedCode": "The fully refactored, highly efficient code as a string. Focus on modern clean code principles (DRY, KISS, SOLID) and performance optimizations.",
    "improvementSuggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
    "complexityBefore": { "executionTime": "15ms (Example)", "time": "O(N)", "space": "O(1)" },
    "complexityAfter": { "executionTime": "2ms (Example)", "time": "O(1)", "space": "O(1)" },
    "performanceGain": "Percentage or quantitative improvement (e.g., 85% faster)",
    "seniorFeedback": {
      "beginnerFriendly": "A welcoming, easy-to-understand explanation of the code and flaws.",
      "advancedInsights": "Deeper technical insights and best practices focusing on why the optimized version is better."
    },
    "testCases": [
      { "title": "Base Case", "description": "Testing standard inputs", "code": "assert(func(x) == y)" },
      { "title": "Edge Case", "description": "Testing nulls or bounds", "code": "assert(func(null) throws error)" }
    ]
  }

  CRITICAL PERFORMANCE REQUIREMENTS:
  1. complexityAfter.executionTime MUST be strictly lower than complexityBefore.executionTime.
  2. The optimizedCode MUST be more efficient in terms of Time Complexity (time) and/or Space Complexity (space) whenever possible.
  3. All performance metrics must be realistic based on the provided code.
  4. The performanceGain field must reflect the improvement accurately.

  Here is the code:
  \n${code}\n

  Respond ONLY with valid JSON. Do not include markdown code block formatting like \`\`\`json around the response.
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    let jsonStr = responseText.replace(/^```json/i, '').replace(/```$/i, '').trim();
    if(jsonStr.startsWith('```')) jsonStr = jsonStr.substring(3).trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini AI API Error:", error.message);
    throw new Error(`AI error: ${error.message} - or the response format was invalid.`);
  }
};
