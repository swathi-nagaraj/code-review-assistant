const AnalysisResult = require('../models/AnalysisResult');
const { analyzeCode } = require('../services/geminiService');

exports.runAnalysis = async (req, res) => {
  const { code, language } = req.body;
  if (!code || !language) {
    return res.status(400).json({ message: 'Code and language are required' });
  }

  try {
    const aiResult = await analyzeCode(code, language);

    const analysisRecord = await AnalysisResult.create({
      user: req.user._id,
      language,
      originalCode: code,
      deepAnalysis: aiResult.deepAnalysis,
      optimizedCode: aiResult.optimizedCode,
      improvementSuggestions: aiResult.improvementSuggestions,
      complexityBefore: aiResult.complexityBefore,
      complexityAfter: aiResult.complexityAfter,
      performanceGain: aiResult.performanceGain,
      seniorFeedback: aiResult.seniorFeedback,
      testCases: aiResult.testCases
    });

    res.status(201).json(analysisRecord);
  } catch (error) {
    console.error("Analysis Controller Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await AnalysisResult.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteHistoryItem = async (req, res) => {
  try {
    const item = await AnalysisResult.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).json({ message: 'History record not found.' });
    res.json({ message: 'Record deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
