import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const completeLogin = (response) => {
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('userRole', response.data.user.role);
    window.location.href = '/admin';
};

const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await api.post('/auth/login', { email, password });
        completeLogin(response);
    } catch (err) {
        console.error("Login Error:", err);
        alert(err.response?.data?.error || err.response?.data?.message || "Login failed.");
    } finally {
        setLoading(false);
    }
};

const handleDemoLogin = async () => {
    setLoading(true);
    try {
        completeLogin(await api.post('/auth/demo-login'));
    } catch (err) {
        alert(err.response?.data?.error || "Demo login failed.");
    } finally {
        setLoading(false);
    }
};
 return (
    <div className="min-h-screen w-full bg-slate-950 flex justify-center items-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Decor - Responsive sizing to prevent mobile overflow/lag */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 md:w-[500px] md:h-[500px] bg-blue-600/20 rounded-full blur-[80px] md:blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 md:w-[500px] md:h-[500px] bg-purple-600/20 rounded-full blur-[80px] md:blur-[120px]"></div>

      {/* Form Container - Dynamic padding for mobile breathing room */}
      <div className="bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-3xl w-full max-w-md border border-slate-700 shadow-2xl relative z-10 animate-fade-in mx-auto">
        <div className="text-center mb-6 md:mb-8">
            <div className="inline-block p-3 rounded-xl bg-blue-600 mb-3 md:mb-4 shadow-lg shadow-blue-600/40">
                <span className="text-xl md:text-2xl text-white">🔐</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Admin Portal</h2>
            <p className="text-slate-400 text-xs md:text-sm mt-2">Restricted access for NGO verifiers.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 md:space-y-6">
          <div>
            <label className="text-slate-500 text-[10px] md:text-xs font-bold uppercase mb-1.5 md:mb-2 block ml-1">Email ID</label>
            <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3.5 md:p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 focus:bg-slate-900 transition font-medium text-sm md:text-base"
                placeholder="username@ngosphere.com"
            />
          </div>
          
          <div>
            <label className="text-slate-500 text-[10px] md:text-xs font-bold uppercase mb-1.5 md:mb-2 block ml-1">Password</label>
            <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3.5 md:p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 focus:bg-slate-900 transition font-medium text-sm md:text-base"
                placeholder="••••••••"
            />
          </div>

          <button disabled={loading} className="w-full py-3.5 md:py-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-base md:text-lg hover:scale-[1.02] active:scale-[0.98] transition shadow-lg shadow-blue-500/30 disabled:opacity-60">
            {loading ? 'Signing in...' : 'Login to Dashboard'}
          </button>
          <button type="button" disabled={loading} onClick={handleDemoLogin} className="w-full py-3.5 mt-3 bg-amber-300 text-slate-950 rounded-xl font-black text-sm md:text-base hover:bg-amber-200 transition shadow-lg shadow-amber-500/30 disabled:opacity-60">
            {loading ? 'Signing in...' : 'Instant Demo Admin Login (Read-Only)'}
          </button>
          <p className="text-center text-slate-400 text-xs">Demo access is read-only and uses sample data.</p>
        </form>

        <button onClick={() => navigate('/')} className="w-full mt-6 text-slate-500 text-xs md:text-sm font-bold hover:text-white transition">
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default Login;