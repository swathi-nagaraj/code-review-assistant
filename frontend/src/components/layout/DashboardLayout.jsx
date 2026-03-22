import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, History, LogOut, Home } from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard Home', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'New Analysis', path: '/dashboard/editor', icon: <Code2 className="w-5 h-5" /> },
    { name: 'History', path: '/dashboard/history', icon: <History className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-gray-800 border-r border-gray-700 flex flex-col shadow-2xl z-10">
        <div className="p-8 flex items-center border-b border-gray-700 mb-4">
          <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mr-4 border border-blue-500/30">
            <Code2 className="text-blue-400 w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">CodeReview<span className="text-blue-500">AI</span></span>
        </div>
        
        <div className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`flex items-center px-4 py-3.5 rounded-xl transition ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-gray-700/50 text-gray-400 hover:text-white'}`}
              >
                <span className={`mr-4 ${isActive ? 'text-white' : 'text-gray-500'}`}>{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
        
        <div className="p-6 border-t border-gray-700 m-4 rounded-2xl bg-gray-900/50">
          <button onClick={handleLogout} className="flex items-center text-gray-400 hover:text-red-400 transition w-full font-medium">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-900 custom-scrollbar">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
