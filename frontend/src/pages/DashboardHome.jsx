import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Code2, History, Zap } from 'lucide-react';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUserEmail(JSON.parse(userStr).email);
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  return (
    <div className="p-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-extrabold mb-2">Welcome back,</h1>
        <p className="text-blue-400 text-xl font-medium">{userEmail}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          icon={<Code2 className="w-8 h-8 text-blue-400"/>} 
          title="New Analysis" 
          desc="Paste your code or upload a file for AI review." 
          onClick={() => navigate('/dashboard/editor')} 
        />
        <DashboardCard 
          icon={<History className="w-8 h-8 text-purple-400"/>} 
          title="History" 
          desc="View past reviews and performance improvements." 
          onClick={() => navigate('/dashboard/history')} 
        />

      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, desc, onClick }) => (
  <motion.button 
    whileHover={{ y: -5, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl text-left hover:border-blue-500/50 transition w-full group overflow-hidden relative"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-700/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
    <div className="mb-6 bg-gray-900 w-16 h-16 flex items-center justify-center rounded-xl border border-gray-700 shadow-inner z-10 relative">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-3 z-10 relative text-white">{title}</h3>
    <p className="text-gray-400 z-10 relative leading-relaxed">{desc}</p>
  </motion.button>
);

export default DashboardHome;
