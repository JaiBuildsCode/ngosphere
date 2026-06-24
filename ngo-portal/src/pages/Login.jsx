import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
        // 1. Send the data to your Node.js engine
        const response = await fetch('https://ngosphere.onrender.com//api/auth/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }) // The exact payload Postman used
        });

        const data = await response.json();

        // 2. Did the bouncer let us in? (Status 200 OK)
        if (response.ok) {
            // 3. SECURE THE KEYCARD: Save the JWT to the browser's local storage
            localStorage.setItem('adminToken', data.token);
            
            // 4. Open the door
            navigate('/admin');
        } else {
            // The bouncer kicked us out (400 Invalid Credentials)
            alert(data.error || "Login failed.");
        }
    } catch (err) {
        console.error("Network error:", err);
        alert("The server is unreachable. Is your backend running?");
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

          <button className="w-full py-3.5 md:py-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-base md:text-lg hover:scale-[1.02] active:scale-[0.98] transition shadow-lg shadow-blue-500/30">
            Login to Dashboard
          </button>
        </form>

        <button onClick={() => navigate('/')} className="w-full mt-6 text-slate-500 text-xs md:text-sm font-bold hover:text-white transition">
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default Login;