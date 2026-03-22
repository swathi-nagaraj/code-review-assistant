import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, Activity, MessageSquare, ClipboardCheck, ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

const AnalysisResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('deepAnalysis');

  if (!state?.result) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">No analysis data found</h2>
        <button onClick={() => navigate('/dashboard/editor')} className="text-blue-400 hover:text-blue-300">
          Go back to editor
        </button>
      </div>
    );
  }

  const result = state.result;

  const tabs = [
    { id: 'deepAnalysis', label: 'Deep Analysis', icon: <ShieldAlert className="w-4 h-4 mr-2" /> },
    { id: 'optimizedCode', label: 'AI Optimization', icon: <Zap className="w-4 h-4 mr-2" /> },
    { id: 'complexity', label: 'Complexity', icon: <Activity className="w-4 h-4 mr-2" /> },
    { id: 'developerReview', label: 'Developer Review', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
    { id: 'testCases', label: 'Test Cases', icon: <ClipboardCheck className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="mr-5 bg-gray-800 p-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-extrabold flex-1 leading-none tracking-tight">Analysis Results</h1>
      </div>

      <div className="flex space-x-2 border-b border-gray-700 mb-6 pb-2 overflow-x-auto custom-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-3 rounded-xl font-medium transition whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 border border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl p-6 md:p-8 overflow-auto shadow-inner relative custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, flex: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="text-gray-300"
          >
            {activeTab === 'deepAnalysis' && (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-4">Deep Code Analysis</h3>
                <div className="space-y-6">
                  {Array.isArray(result.deepAnalysis) ? result.deepAnalysis.map((item, index) => (
                    <div key={index} className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-md">
                      <div className="flex items-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
                        <h4 className="text-xl font-bold text-white mb-0">{item.category}</h4>
                      </div>
                      <p className="mb-5 text-gray-300 text-lg leading-relaxed">{item.description}</p>
                      {item.highlightedCode && (
                        <div className="bg-gray-950 p-5 rounded-lg border border-red-900/40 relative">
                          <span className="text-xs text-red-500 font-bold uppercase mb-3 block tracking-widest bg-red-900/20 w-max px-3 py-1 rounded">Highlighted Issue:</span>
                          <code className="text-red-400 font-mono text-sm whitespace-pre-wrap">{item.highlightedCode}</code>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="whitespace-pre-wrap leading-relaxed space-y-4">{result.deepAnalysis || "No analysis available."}</div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'optimizedCode' && (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-4">AI Optimization & Refactoring</h3>
                
                {Array.isArray(result.improvementSuggestions) && result.improvementSuggestions.length > 0 && (
                  <div className="mb-8 bg-blue-900/20 border border-blue-800/50 rounded-xl p-6">
                    <h4 className="text-blue-400 font-bold mb-4 flex items-center tracking-wider uppercase text-sm">
                      <Lightbulb className="w-5 h-5 mr-3" /> Targeted Performance Enhancements
                    </h4>
                    <ul className="space-y-4">
                      {result.improvementSuggestions.map((sug, i) => (
                        <li key={i} className="flex items-start text-gray-300 text-lg">
                          <CheckCircle2 className="w-6 h-6 text-green-500 mr-3 shrink-0 mt-0.5" />
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <h4 className="text-xl font-bold mb-4 text-white">Refactored / Optimized Code Output:</h4>
                <pre className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-700 overflow-x-auto shadow-inner">
                  <code className="whitespace-pre-wrap font-mono text-blue-300 text-[15px] leading-relaxed">{result.optimizedCode}</code>
                </pre>
              </div>
            )}
            
            {activeTab === 'complexity' && (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-4">Complexity & Execution Analysis</h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                   <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl relative">
                      <h4 className="text-blue-400 font-bold mb-6 uppercase tracking-widest text-sm relative z-10 border-b border-gray-800 pb-4">Before Optimization</h4>
                      <div className="space-y-6 relative z-10">
                        <div className="flex flex-col"><span className="text-gray-500 uppercase text-xs font-bold mb-1 tracking-wider">Estimated Execution Time</span> <span className="text-gray-300 text-xl font-medium">{result.complexityBefore?.executionTime || 'N/A'}</span></div>
                        <div className="flex flex-col"><span className="text-gray-500 uppercase text-xs font-bold mb-1 tracking-wider">Time Complexity</span> <span className="text-white text-xl bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 w-max">{result.complexityBefore?.time || 'N/A'}</span></div>
                        <div className="flex flex-col"><span className="text-gray-500 uppercase text-xs font-bold mb-1 tracking-wider">Space Complexity</span> <span className="text-white text-xl bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 w-max">{result.complexityBefore?.space || 'N/A'}</span></div>
                      </div>
                   </div>
                   <div className="bg-blue-900/10 border border-blue-500/30 p-8 rounded-2xl relative overflow-hidden ring-1 ring-inset ring-blue-500/20 shadow-[inset_0_0_50px_rgba(59,130,246,0.1)]">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                      <h4 className="text-green-400 font-bold mb-6 uppercase tracking-widest text-sm relative z-10 border-b border-blue-500/20 pb-4 flex items-center">After Optimization <Zap className="w-4 h-4 ml-2 text-yellow-400" /></h4>
                      <div className="space-y-6 relative z-10">
                        <div className="flex flex-col"><span className="text-blue-300/70 uppercase text-xs font-bold mb-1 tracking-wider">Estimated Execution Time</span> <span className="text-green-400 font-bold text-xl">{result.complexityAfter?.executionTime || 'Reduced!'}</span></div>
                        <div className="flex flex-col"><span className="text-blue-300/70 uppercase text-xs font-bold mb-1 tracking-wider">Time Complexity</span> <span className="text-white text-2xl font-bold bg-blue-600/20 px-4 py-2 rounded-lg border border-blue-500/30 w-max shadow-inner">{result.complexityAfter?.time || 'N/A'}</span></div>
                        <div className="flex flex-col"><span className="text-blue-300/70 uppercase text-xs font-bold mb-1 tracking-wider">Space Complexity</span> <span className="text-white text-2xl font-bold bg-blue-600/20 px-4 py-2 rounded-lg border border-blue-500/30 w-max shadow-inner">{result.complexityAfter?.space || 'N/A'}</span></div>
                        
                        {result.performanceGain && (
                          <div className="mt-8 bg-green-500/20 border border-green-500/40 rounded-xl p-4 flex items-center justify-between shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                            <div>
                              <span className="text-green-400 text-xs font-bold uppercase tracking-widest block mb-1">Overall Performance Gain</span>
                              <span className="text-white text-2xl font-black">{result.performanceGain}</span>
                            </div>
                            <div className="bg-green-500 rounded-full p-2 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                              <Zap className="w-6 h-6 text-white fill-white" />
                            </div>
                          </div>
                        )}
                      </div>
                   </div>
                </div>
              </div>
            )}
            
            {activeTab === 'developerReview' && (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-4">Senior Developer Review</h3>
                
                {result.seniorFeedback ? (
                  <div className="space-y-8">
                    <div className="bg-gray-900/80 p-8 rounded-xl border border-gray-700/50 shadow-inner">
                      <h4 className="text-blue-400 font-bold mb-4 uppercase tracking-widest text-sm flex items-center">
                        Beginner-Friendly Explanation
                      </h4>
                      <p className="leading-relaxed text-gray-300 text-lg">{result.seniorFeedback.beginnerFriendly}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-8 rounded-xl border border-indigo-500/40 shadow-xl relative overflow-hidden ring-1 ring-inset ring-purple-500/30">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                      <h4 className="text-purple-300 font-extrabold mb-4 uppercase tracking-widest text-sm flex items-center relative z-10">
                        <ShieldAlert className="w-5 h-5 mr-3 text-purple-400" /> Advanced Insights
                      </h4>
                      <p className="leading-relaxed text-white text-lg relative z-10">{result.seniorFeedback.advancedInsights}</p>
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap leading-relaxed text-lg bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 shadow-inner">{result.developerReview || "No feedback available. Ensure the AI prompt outputs seniorFeedback object."}</div>
                )}
              </div>
            )}
            
            {activeTab === 'testCases' && (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-4">Comprehensive Test Cases</h3>
                
                {Array.isArray(result.testCases) ? (
                  <div className="space-y-8">
                    {result.testCases.map((tc, idx) => (
                       <div key={idx} className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-xl ring-1 ring-black/50">
                         <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex justify-between items-center shadow-sm">
                           <h4 className="font-extrabold text-white text-lg flex items-center">
                              <ClipboardCheck className="w-5 h-5 mr-3 text-blue-400" /> {tc.title}
                           </h4>
                           <span className="bg-blue-900/30 border border-blue-500/30 text-blue-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold">Case {idx + 1}</span>
                         </div>
                         <div className="p-6">
                           <p className="text-gray-300 mb-5 text-lg">{tc.description}</p>
                           <pre className="bg-[#1a1a1a] p-5 rounded-lg border border-gray-800 shadow-inner">
                             <code className="text-green-400 font-mono text-[15px] whitespace-pre-wrap leading-relaxed">{tc.code}</code>
                           </pre>
                         </div>
                       </div>
                    ))}
                  </div>
                ) : (
                  <pre className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-700 overflow-x-auto"><code className="whitespace-pre-wrap font-mono text-purple-300 text-sm leading-relaxed">{result.testCases || "No array format recognized. Old format: " + JSON.stringify(result.testCases)}</code></pre>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalysisResults;
