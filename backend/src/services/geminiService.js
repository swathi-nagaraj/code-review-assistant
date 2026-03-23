const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// fallback models — quota தீர்ந்தா next model try பண்ணும்
const MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.5-flash-lite',
  'gemma-3-27b-it',
];

const getPrompt = (language, code) => `
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
    "optimizedCode": "The fully refactored, highly efficient code as a string.",
    "improvementSuggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
    "complexityBefore": { "executionTime": "15ms (Example)", "time": "O(N)", "space": "O(1)" },
    "complexityAfter": { "executionTime": "2ms (Example)", "time": "O(1)", "space": "O(1)" },
    "performanceGain": "Percentage or quantitative improvement (e.g., 85% faster)",
    "seniorFeedback": {
      "beginnerFriendly": "A welcoming, easy-to-understand explanation of the code and flaws.",
      "advancedInsights": "Deeper technical insights and best practices."
    },
    "testCases": [
      { "title": "Base Case", "description": "Testing standard inputs", "code": "assert(func(x) == y)" },
      { "title": "Edge Case", "description": "Testing nulls or bounds", "code": "assert(func(null) throws error)" }
    ]
  }

  CRITICAL PERFORMANCE REQUIREMENTS:
  1. complexityAfter.executionTime MUST be strictly lower than complexityBefore.executionTime.
  2. The optimizedCode MUST be more efficient in terms of Time and/or Space Complexity whenever possible.
  3. All performance metrics must be realistic based on the provided code.
  4. The performanceGain field must reflect the improvement accurately.

  Here is the code:
  \n${code}\n

  Respond ONLY with valid JSON. Do not include markdown code block formatting like \`\`\`json around the response.
`;

exports.analyzeCode = async (code, language) => {
  if (!genAI) {
    throw new Error('Gemini API key is not configured.');
  }

  let lastError;

  for (const modelName of MODELS) {
    try {
      console.log(`Trying model: ${modelName}`);

      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(getPrompt(language, code));
      const responseText = result.response.text().trim();

      // clean JSON response
      let jsonStr = responseText
        .replace(/^```json/i, '')
        .replace(/```$/i, '')
        .trim();
      if (jsonStr.startsWith('```')) jsonStr = jsonStr.substring(3).trim();

      const parsed = JSON.parse(jsonStr);
      console.log(`Success with model: ${modelName}`);
      return parsed;

    } catch (error) {
      console.error(`Model ${modelName} failed:`, error.message);

      // 429 quota error → next model try பண்ணு
      if (
        error.message.includes('429') ||
        error.message.includes('quota') ||
        error.message.includes('Too Many Requests')
      ) {
        lastError = error;
        console.log(`Quota exceeded for ${modelName}, trying next model...`);
        continue;
      }

      // JSON parse error → same model வேற மாதிரி handle பண்ணு
      if (error instanceof SyntaxError) {
        throw new Error('AI returned invalid response format. Please try again.');
      }

      // other errors → stop
      throw new Error(`AI error: ${error.message}`);
    }
  }

  // எல்லா models-உம் fail ஆச்சு
  throw new Error(
    'All AI models quota exceeded. Please try again after midnight or get a new API key from aistudio.google.com'
  );
};