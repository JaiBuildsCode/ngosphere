import React, { useState, useEffect } from 'react';
import api from './api';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// COMPONENTS
//import Navbar from './components/Navbar'; // Assuming you have one
//import Footer from './components/Footer'; // Professional apps always have one

// PAGES
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import About from './pages/About';
import RegisterNGO from './pages/RegisterNGO';
import NotFound from './pages/NotFound'; // Better UX than a random redirect

function App() {
  const [platformStats, setPlatformStats] = useState({
    totalDonations: 0,
    livesImpacted: 0,
    activeMissions: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        // We still fetch /ngos, but we set a loading state so the UI doesn't look broken
        const response = await api.get('/ngos');
        const liveNgos = Array.isArray(response.data) ? response.data : [];
        
        const realTotalDonations = liveNgos.reduce((sum, ngo) => sum + (ngo.raised || 0), 0);
        
        setPlatformStats({
          totalDonations: realTotalDonations,
          livesImpacted: Math.floor(realTotalDonations / 500), 
          activeMissions: liveNgos.length
        });
      } catch (error) {
        console.error("Backend Sync Failed:", error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false); // Kill the spinner regardless of success/fail
      }
    };
    
    fetchRealStats();
  }, []);

  // Updates UI state immediately after a successful donation in Home.jsx
  const processDonation = (amount) => {
    setPlatformStats(prev => ({
      ...prev,
      totalDonations: prev.totalDonations + amount,
      livesImpacted: Math.floor((prev.totalDonations + amount) / 500)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-blue-500 border-gray-700 mx-auto"></div>
          <p className="mt-4 text-lg font-semibold tracking-widest">WAKING UP NGOSPHERE...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/*<Navbar />*/}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home stats={platformStats} onDonate={processDonation} />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin stats={platformStats} />} />
            <Route path="/register" element={<RegisterNGO />} /> 
            
            {/* 404 Page is better for SEO and Professionalism than a wildcard redirect */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        {/*<Footer />*/}
      </div>
    </Router>
  )
}

export default App;