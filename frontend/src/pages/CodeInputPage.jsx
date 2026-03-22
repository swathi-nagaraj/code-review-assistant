import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Play, Loader2, Upload, FileCode } from 'lucide-react';
import api from '../api/axios';

const CodeInputPage = () => {
  const navigate = useNavigate();
  const languagePlaceholders = {
    javascript: '// Paste your JavaScript code here\n',
    python: '# Paste your Python code here\n',
    java: '// Paste your Java code here\n',
    cpp: '// Paste your C++ code here\n',
    c: '// Paste your C code here\n',
    html: '<!-- Paste your HTML code here -->\n',
    css: '/* Paste your CSS code here */\n',
    typescript: '// Paste your TypeScript code here\n',
    ruby: '# Paste your Ruby code here\n',
    go: '// Paste your Go code here\n',
    rust: '// Paste your Rust code here\n',
    php: '<?php\n// Paste your PHP code here\n',
    swift: '// Paste your Swift code here\n',
    kotlin: '// Paste your Kotlin code here\n',
    csharp: '// Paste your C# code here\n',
  };

  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(languagePlaceholders['javascript']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const languages = [
    { id: 'javascript', name: 'JavaScript', ext: 'js' },
    { id: 'python', name: 'Python', ext: 'py' },
    { id: 'java', name: 'Java', ext: 'java' },
    { id: 'cpp', name: 'C++', ext: 'cpp' },
    { id: 'c', name: 'C', ext: 'c' },
    { id: 'html', name: 'HTML', ext: 'html' },
    { id: 'css', name: 'CSS', ext: 'css' },
    { id: 'typescript', name: 'TypeScript', ext: 'ts' },
    { id: 'ruby', name: 'Ruby', ext: 'rb' },
    { id: 'go', name: 'Go', ext: 'go' },
    { id: 'rust', name: 'Rust', ext: 'rs' },
    { id: 'php', name: 'PHP', ext: 'php' },
    { id: 'swift', name: 'Swift', ext: 'swift' },
    { id: 'kotlin', name: 'Kotlin', ext: 'kt' },
    { id: 'csharp', name: 'C#', ext: 'cs' },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();
    const detectedLang = languages.find(l => l.ext === extension);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setCode(content);
      if (detectedLang) {
        setLanguage(detectedLang.id);
      }
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!code.trim() || Object.values(languagePlaceholders).includes(code)) {
      setError('Please provide some code to analyze.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const res = await api.post('/analysis/analyze', { code, language });
      navigate('/dashboard/results', { state: { result: res.data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-[calc(100vh-2rem)] flex flex-col relative">
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute inset-0 z-50 bg-gray-900/90 backdrop-blur-md flex flex-col items-center justify-center rounded-xl"
        >
          <Loader2 className="w-20 h-20 text-blue-500 animate-spin mb-8" />
          <h2 className="text-4xl font-black tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Analyzing Code...</span>
          </h2>
          <p className="text-gray-400 text-xl font-medium">Detecting bugs, optimizing logic, and generating insights</p>
        </motion.div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">New Analysis</h1>
          <p className="text-gray-400">Select language and enter your code below.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-lg font-medium transition border border-gray-700 cursor-pointer group">
            <Upload className="w-4 h-4 mr-2 group-hover:text-blue-400" />
            <span>Upload File</span>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileUpload}
              accept=".js,.py,.java,.cpp,.c,.html,.css,.ts,.rb,.go,.rs,.php,.swift,.kt,.cs"
            />
          </label>

          <select 
            value={language} 
            onChange={(e) => {
              const newLang = e.target.value;
              if (!code.trim() || Object.values(languagePlaceholders).includes(code)) {
                setCode(languagePlaceholders[newLang]);
              }
              setLanguage(newLang);
            }}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 pointer-events-auto focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent appearance-none min-w-[140px]"
            disabled={loading}
          >
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
          
          <button 
            onClick={handleAnalyze} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center transition shadow-lg shadow-blue-500/30 disabled:opacity-50 hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 mr-2.5 fill-current" /> Analyze Code
          </button>
        </div>
      </div>

      {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg mb-6">{error}</div>}

      <div className="flex-1 rounded-xl overflow-hidden border border-gray-700 shadow-2xl relative bg-[#1e1e1e]">
        <Editor
          height="100%"
          theme="vs-dark"
          language={language === 'c' || language === 'cpp' ? 'cpp' : language}
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            padding: { top: 24 },
            scrollBeyondLastLine: false,
            fontFamily: "'Fira Code', 'Monaco', 'Courier New', monospace",
            wordWrap: 'on'
          }}
        />
      </div>
    </div>
  );
};

export default CodeInputPage;
