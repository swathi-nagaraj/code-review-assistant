import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader2, Calendar, FileCode2, ChevronRight, Trash2 } from 'lucide-react';
import api from '../api/axios';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/analysis/history');
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis record?')) return;
    try {
      await api.delete(`/analysis/${id}`);
      setHistory(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("Failed to delete history record");
    }
  };

  return (
    <div className="p-8 h-[calc(100vh-2rem)] flex flex-col">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight">Analysis History</h1>

      {loading ? (
        <div className="flex justify-center items-center flex-1">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <div className="bg-gray-800 p-8 rounded-full mb-6 border border-gray-700 shadow-xl">
            <FileCode2 className="w-12 h-12 text-gray-500" />
          </div>
          <p className="text-xl font-medium text-white mb-2">No history found</p>
          <p className="text-sm">Analyze some code to see your history here.</p>
          <button 
            onClick={() => navigate('/dashboard/editor')} 
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition shadow-lg shadow-blue-500/20"
          >
            Start Analyzing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 overflow-auto pb-8 custom-scrollbar pr-4">
          {history.map((item, index) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate('/dashboard/results', { state: { result: item } })}
              className="bg-gray-800 border border-gray-700 hover:border-blue-500/50 hover:bg-gray-800/80 p-6 rounded-2xl cursor-pointer transition group relative shadow-lg"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center">
                   <div className="bg-gray-900 border border-gray-700 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-blue-400 mr-4 tracking-wider uppercase">
                     {item.language}
                   </div>
                   <div className="flex items-center text-sm font-medium text-gray-400">
                     <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                     {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center group-hover:bg-blue-600/20 group-hover:border-blue-500/30 transition">
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition transform group-hover:translate-x-0.5" />
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, item._id)}
                    className="w-10 h-10 rounded-full bg-red-900/10 border border-transparent flex items-center justify-center hover:bg-red-600/20 hover:border-red-500/50 transition ml-3 group/btn"
                    title="Delete Record"
                  >
                    <Trash2 className="w-5 h-5 text-gray-600 group-hover/btn:text-red-400 transition" />
                  </button>
                </div>
              </div>
              <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl p-5 h-36 overflow-hidden relative shadow-inner">
                <pre className="text-sm font-mono text-gray-300 leading-relaxed font-medium">
                  {item.originalCode.substring(0, 300)}
                  {item.originalCode.length > 300 ? '...' : ''}
                </pre>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1e1e1e] to-transparent"></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
