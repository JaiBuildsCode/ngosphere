/**
 * ====================================================================================================
 * PROJECT: NGOSphere
 * COMPONENT: RegisterNGO.jsx
 * AUTHOR: Rust
 * DESCRIPTION:
 * - Professional Registration Form for NGOs.
 * - Validates input and sends data to the backend for Admin Approval.
 * - Responsive "Glassmorphism" Design.
 * ====================================================================================================
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import '../App.css'; 

function RegisterNGO() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', category: 'Education', founder: '', established: '',
    contact: '', email: '', city: '', address: '', reg_no: '',
    goal: '', desc: '', image: '', lat: '', lng: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.title || !formData.email) return alert("Required fields missing.");

    const newNGO = {
      title: formData.title, category: formData.category, founder: formData.founder,
      founded: formData.established, phone: formData.contact, email: formData.email,
      city: formData.city, address: formData.address, reg_no: formData.reg_no || 'PENDING',
      desc: formData.desc, image: formData.image, goal: parseInt(formData.goal) || 100000,
      coords: [ parseFloat(formData.lat) || 19.0760, parseFloat(formData.lng) || 72.8777 ],
      status: 'Pending', raised: 0
    };

    try {
        await api.post('/ngos', newNGO);
        alert("✅ Application Submitted! Pending Admin Approval.");
        navigate('/');
    } catch (err) { alert("❌ Error: " + err.message); }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex justify-center items-center p-6 relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="bg-[#0b0f1a]/80 backdrop-blur-2xl border border-white/10 w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden relative z-10 p-8 md:p-12 animate-fade-in">
        
        <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Register Mission 🚀</h1>
            <p className="text-slate-400 text-sm">Join the national registry. Verification takes 24-48 hours.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LEFT COLUMN */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NGO Name</label>
                        <input name="title" onChange={handleChange} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition" placeholder="e.g. Hope Foundation" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Founder</label>
                        <input name="founder" onChange={handleChange} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                        <select name="category" onChange={handleChange} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition appearance-none">
                            <option>Education</option><option>Health</option><option>Animal Welfare</option><option>Environment</option><option>Food Security</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date Founded</label>
                        <input type="date" name="established" onChange={handleChange} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">City</label>
                        <input name="city" onChange={handleChange} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition" required />
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Official Email</label>
                        <input type="email" name="email" onChange={handleChange} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Phone</label>
                        <input type="tel" name="contact" onChange={handleChange} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registration No.</label>
                        <input name="reg_no" onChange={handleChange} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition" placeholder="Optional" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latitude</label>
                            <input name="lat" type="number" step="any" onChange={handleChange} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition" placeholder="19.07" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Longitude</label>
                            <input name="lng" type="number" step="any" onChange={handleChange} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition" placeholder="72.87" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Goal Amount (₹)</label>
                        <input type="number" name="goal" onChange={handleChange} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition" />
                    </div>
                </div>
            </div>

            {/* FULL WIDTH */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Address</label>
                <input name="address" onChange={handleChange} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition" required />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mission Description</label>
                <textarea name="desc" onChange={handleChange} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition h-32 resize-none" required />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cover Image URL</label>
                <input name="image" onChange={handleChange} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition" placeholder="https://..." required />
            </div>

            <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => navigate('/')} className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition">Cancel</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition">Submit Application</button>
            </div>

        </form>
      </div>
    </div>
  );
}

export default RegisterNGO;