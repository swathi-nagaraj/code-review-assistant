import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Zap, Shield, Sparkles } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans overflow-hidden">
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2 text-xl font-bold">
          <Code2 className="text-blue-500" />
          <span>CodeReviewAI</span>
        </div>
        <div className="space-x-4">
          <Link to="/auth" className="text-gray-300 hover:text-white transition">Login</Link>
          <Link to="/auth?mode=signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition shadow-lg shadow-blue-500/30">Get Started</Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-20 pb-16 text-center">
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Get Your Code <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Reviewed & Optimized</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Boost code quality, eliminate syntax errors, and speed up every code response with AI-powered deep analysis.
        </motion.p>
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-gray-900 font-bold px-8 py-4 rounded-full text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-xl">
            Start Analyzing Now <Zap className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <FeatureCard icon={<Shield className="text-green-400 w-8 h-8"/>} title="Deep Code Analysis" desc="Detect bugs, security risks, and architectural flaws instantly." />
          <FeatureCard icon={<Sparkles className="text-purple-400 w-8 h-8"/>} title="AI Optimization" desc="Automatically refactor your code for maximum performance." />
          <FeatureCard icon={<Code2 className="text-blue-400 w-8 h-8"/>} title="Test Cases" desc="Generate boundary test cases and examples in seconds." />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-lg text-left"
  >
    <div className="mb-4 bg-gray-900 w-16 h-16 flex items-center justify-center rounded-full border border-gray-700">{icon}</div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400">{desc}</p>
  </motion.div>
);

export default LandingPage;
