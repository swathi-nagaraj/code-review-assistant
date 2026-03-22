const mongoose = require('mongoose');

const analysisResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  language: { type: String, required: true },
  originalCode: { type: String, required: true },
  deepAnalysis: { type: mongoose.Schema.Types.Mixed },
  optimizedCode: { type: String },
  improvementSuggestions: { type: mongoose.Schema.Types.Mixed },
  complexityBefore: { type: mongoose.Schema.Types.Mixed },
  complexityAfter: { type: mongoose.Schema.Types.Mixed },
  seniorFeedback: { type: mongoose.Schema.Types.Mixed },
  testCases: { type: mongoose.Schema.Types.Mixed },
  performanceGain: { type: String }
}, { timestamps: true });

const AnalysisResult = mongoose.model('AnalysisResult', analysisResultSchema);
module.exports = AnalysisResult;
