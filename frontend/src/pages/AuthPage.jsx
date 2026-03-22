import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isSignup = searchParams.get('mode') === 'signup';
  const isForgot = searchParams.get('mode') === 'forgot';

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(isSignup ? 'register' : isForgot ? 'forgot' : 'login');
  const [error, setError] = useState('');

  useEffect(() => {
    setStep(isSignup ? 'register' : isForgot ? 'forgot' : 'login');
  }, [isSignup, isForgot]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (step === 'register') {
        await api.post('/auth/register', { username, email, password });
        setStep('otp');
      } else if (step === 'login') {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify({ email: res.data.email }));
        navigate('/dashboard');
      } else if (step === 'forgot') {
        await api.post('/auth/forgot-password', { email });
        setStep('reset');
      } else if (step === 'reset') {
        await api.post('/auth/reset-password', { email, otp, newPassword });
        setStep('login');
        setError('Password reset successful. Please login with your new password.');
      } else if (step === 'otp') {
        const res = await api.post('/auth/verify-otp', { email, otp });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify({ email: res.data.email }));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <motion.div 
        className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          {step === 'register' ? 'Create Account' : step === 'login' ? 'Welcome Back' : step === 'forgot' ? 'Forgot Password' : step === 'reset' ? 'Reset Password' : 'Verify Email'}
        </h2>
        
        {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg mb-6 text-sm flex items-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 'forgot' && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <p className="text-sm text-gray-500 mt-3 text-center">We will send an OTP to your email.</p>
            </div>
          )}

          {step === 'reset' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">OTP</label>
                <input 
                  type="text" 
                  required 
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-center tracking-widest text-lg"
                  value={otp} onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {(step === 'login' || step === 'register') && (
            <>
              {step === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={username} onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required 
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <Link 
                    to="/auth?mode=forgot" 
                    className="text-sm text-blue-400 hover:text-blue-300 transition"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </>
          )}

          {step === 'otp' && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">One-Time Password (OTP)</label>
              <input 
                type="text" 
                required 
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-center tracking-widest text-lg"
                value={otp} onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
              />
              <p className="text-sm text-gray-500 mt-3 text-center">We've sent a 6-digit code to your email.</p>
            </div>
          )}

          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3.5 rounded-lg transition shadow-[0_0_15px_rgba(37,99,235,0.3)] mt-6">
            {step === 'register' ? 'Sign Up' : step === 'login' ? 'Login' : step === 'forgot' ? 'Send OTP' : step === 'reset' ? 'Reset Password' : 'Verify & Login'}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400 text-sm">
          {step === 'login' ? (
            <p>Don't have an account? <Link to="/auth?mode=signup" className="text-blue-400 hover:text-blue-300 font-semibold ml-1">Sign Up</Link></p>
          ) : step === 'register' ? (
            <p>Already have an account? <Link to="/auth" className="text-blue-400 hover:text-blue-300 font-semibold ml-1">Login</Link></p>
          ) : step === 'forgot' ? (
            <div className="space-y-2">
              <p>Remember your password? <Link to="/auth" className="text-blue-400 hover:text-blue-300 font-semibold ml-1">Login</Link></p>
              <p>Don't have an account? <Link to="/auth?mode=signup" className="text-blue-400 hover:text-blue-300 font-semibold ml-1">Sign Up</Link></p>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
