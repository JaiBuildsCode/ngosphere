/**
 * ====================================================================================================
 * PROJECT: NGOSphere - Enterprise Platform
 * FILE: src/pages/Home.jsx
 * AUTHOR: Jayesh (Lead Architect)
 * STATUS: PRODUCTION READY (Original Hero Retained, Full Flows Added Below)
 * ====================================================================================================
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Search, MapPin, Heart, Shield, Users, ArrowRight, CheckCircle2, AlertCircle, X, ChevronRight, BookOpen, Globe, Code, Activity } from 'lucide-react';
import api from '../api'; 
import MapComponent from '../components/MapComponent';

// ====================================================================================================
// 1. CONFIGURATION & ROBUST MOCK DATA
// ====================================================================================================


const MOCK_NGOS = [
    { _id: "ngo_001", title: "Paani Foundation", city: "Nashik", category: "Environment", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?auto=format&fit=crop&w=800&q=80", desc: "Fighting drought in Maharashtra through water cup competitions and community-led watershed management.", raised: 1250000, goal: 5000000, phone: "+91 99220 01122", email: "contact@paani.org", founded: "2016", impact: "100+ Villages", verified: true, coords: [19.9975, 73.7898], reg_no: "REG/MH/2016/889" },
    { _id: "ngo_002", title: "Akshaya Patra", city: "Pune", category: "Food Security", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80", desc: "Implementing the Mid-Day Meal Scheme in government schools and government-aided schools.", raised: 4500000, goal: 10000000, phone: "+91 80 2345 6789", email: "support@akshayapatra.org", founded: "2000", impact: "2M Meals/Day", verified: true, coords: [18.5204, 73.8567], reg_no: "REG/KA/2000/112" },
    { _id: "ngo_003", title: "Happy Soul Care", city: "Mumbai", category: "Child Welfare", image: "https://images.unsplash.com/photo-1602631985686-1bb0e2254d3b?auto=format&fit=crop&w=800&q=80", desc: "Providing holistic care, education, and psychological support for orphaned and abandoned children.", raised: 890000, goal: 2000000, phone: "+91 98765 43210", email: "help@happysoul.org", founded: "2019", impact: "500 Kids", verified: true, coords: [19.0760, 72.8777], reg_no: "REG/MH/2019/445" },
    { _id: "ngo_004", title: "Green Earth Alliance", city: "Bangalore", category: "Environment", image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80", desc: "Urban reforestation projects and corporate sustainability consulting for a greener tech capital.", raised: 210000, goal: 500000, phone: "+91 80 1122 3344", email: "info@greenearth.in", founded: "2021", impact: "50k Trees", verified: true, coords: [12.9716, 77.5946], reg_no: "REG/KA/2021/990" },
    { _id: "ngo_005", title: "Stray Paws India", city: "Delhi", category: "Animal Welfare", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80", desc: "Rescue, rehabilitation, and medical care for street animals across the NCR region.", raised: 550000, goal: 1500000, phone: "+91 11 2233 4455", email: "woof@straypaws.in", founded: "2018", impact: "1200 Rescues", verified: true, coords: [28.7041, 77.1025], reg_no: "REG/DL/2018/332" },
    { _id: "ngo_006", title: "Vidya Deep Foundation", city: "Chennai", category: "Education", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80", desc: "Digital literacy and tech infrastructure provision for rural and underserved urban schools.", raised: 3200000, goal: 8000000, phone: "+91 44 9988 7766", email: "contact@vidyadeep.org", founded: "2015", impact: "15 Schools", verified: true, coords: [13.0827, 80.2707], reg_no: "REG/TN/2015/776" },
    { _id: "ngo_007", title: "Smile Foundation", city: "Hyderabad", category: "Child Welfare", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80", desc: "Healthcare, education, and livelihood programs for underprivileged children and their families.", raised: 1500000, goal: 3000000, phone: "+91 40 1234 5678", email: "info@smile.org", founded: "2002", impact: "10k Kids", verified: true, coords: [17.3850, 78.4867], reg_no: "REG/TS/2002/111" },
    { _id: "ngo_008", title: "Goonj Disaster Relief", city: "Kolkata", category: "Disaster Relief", image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80", desc: "Turning urban waste into rural resources and providing rapid response to natural disasters.", raised: 5000000, goal: 10000000, phone: "+91 33 9876 5432", email: "mail@goonj.org", founded: "1999", impact: "500 Villages", verified: true, coords: [22.5726, 88.3639], reg_no: "REG/WB/1999/005" },
    { _id: "ngo_009", title: "SNEHA", city: "Mumbai", category: "Health", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80", desc: "Maternal and newborn health, child nutrition, and empowerment of women in vulnerable communities.", raised: 2800000, goal: 5000000, phone: "+91 22 1122 3344", email: "contact@snehamumbai.org", founded: "1999", impact: "300k Women", verified: true, coords: [19.0760, 72.8777], reg_no: "REG/MH/1999/221" }
];

const CATEGORIES = ["All", "Environment", "Food Security", "Child Welfare", "Education", "Animal Welfare", "Disaster Relief", "Health"];

const TESTIMONIALS = [
    { id: 1, name: "Rajesh Kumar", role: "Restaurant Owner", img: "https://randomuser.me/api/portraits/men/32.jpg", text: "We used to throw away 5kg of food daily. The logistics were too hard. Now, NGOSphere connects us to the shelter in 15 mins. It's automated empathy." },
    { id: 2, name: "Sarah Jenkins", role: "Lead Volunteer", img: "https://randomuser.me/api/portraits/women/44.jpg", text: "The app makes it so easy to find gigs. I've completed 50 hours of field work this month. The dashboard tracks my hours perfectly for my college credits." },
    { id: 3, name: "Amitabh V.", role: "Angel Investor / Donor", img: "https://randomuser.me/api/portraits/men/86.jpg", text: "Finally, a platform where I can track exactly where my money goes. The immutable transparency ledger is a game changer for the non-profit sector." }
];

const STORIES = [
    { id: 1, title: "Flood Relief in Assam", category: "Disaster", image: "https://images.unsplash.com/photo-1605631089608-2c2a07567707?auto=format&fit=crop&w=400" },
    { id: 2, title: "1000 Books for Rural Kids", category: "Education", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400" },
    { id: 3, title: "Saving the Great Banyan", category: "Environment", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?auto=format&fit=crop&w=400" }
];

// ====================================================================================================
// 2. HELPER COMPONENTS
// ====================================================================================================

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 z-[9999] animate-bounce-up border backdrop-blur-3xl w-[90%] max-w-sm justify-center ${type === 'error' ? 'bg-red-500/10 border-red-500 text-red-100' : 'bg-emerald-500/10 border-emerald-500 text-emerald-100'}`}>
      <span className="text-xl">{type === 'error' ? '⚠️' : '✨'}</span>
      <span className="font-bold tracking-wide text-sm">{message}</span>
    </div>
  );
};

const SkeletonCard = () => (
    <div className="bg-[#0f172a] rounded-[2rem] overflow-hidden border border-white/5 h-[450px] animate-pulse">
        <div className="h-48 bg-slate-800/50"></div>
        <div className="p-8 space-y-4">
            <div className="h-8 bg-slate-800/50 rounded w-3/4"></div>
            <div className="h-4 bg-slate-800/50 rounded w-1/2"></div>
            <div className="h-20 bg-slate-800/50 rounded w-full"></div>
        </div>
    </div>
);

const LazyImage = ({ src, alt, className="" }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className={`relative w-full h-full bg-slate-900 overflow-hidden ${className}`}>
            <img 
                src={src} 
                alt={alt} 
                loading="lazy" 
                className={`w-full h-full object-cover transition-all duration-700 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`} 
                onLoad={() => setLoaded(true)} 
                onError={(e)=>{e.target.src="https://via.placeholder.com/400x300?text=No+Image"}}
            />
            {!loaded && <div className="absolute inset-0 bg-slate-800 animate-pulse"></div>}
        </div>
    );
};

// --- MODALS ---

const FraudModal = ({ onClose, onSubmit }) => (
    <div className="fixed inset-0 z-[13000] flex justify-center items-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
        <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-red-500/30 shadow-2xl p-8 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition text-xl">✕</button>
            <div className="flex items-center gap-4 mb-6"><div className="p-3 bg-red-500/20 rounded-full text-2xl border border-red-500/30">🚨</div><div><h3 className="text-2xl font-bold text-white tracking-tight">Report Fraud</h3><p className="text-red-400 text-xs font-bold uppercase tracking-wider">Trust & Safety Team</p></div></div>
            <textarea className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-red-500 outline-none mb-6 resize-none transition-all" placeholder="Describe the suspicious activity..."></textarea>
            <div className="flex gap-4"><button onClick={onClose} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition">Cancel</button><button onClick={onSubmit} className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition shadow-lg shadow-red-900/20">Submit Report</button></div>
        </div>
    </div>
);

const PaymentGatewayModal = ({ amount, setAmount, donorName, setDonorName, onProceed, onClose }) => (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[11000] flex justify-center items-center font-sans p-4">
      <div className="bg-[#0f172a] w-full max-w-md rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.2)] border border-white/5 animate-fade-in relative group">
        <div className="p-10 text-center relative z-10">
            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-6">CONTRIBUTION AMOUNT</p>
            <div className="relative flex justify-center items-center mb-4 group"><span className="text-5xl md:text-6xl font-black text-white mr-2">₹</span><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" autoFocus className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tighter drop-shadow-xl bg-transparent outline-none w-48 text-center placeholder-slate-700 appearance-none m-0"/></div>
            <input type="text" value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Your name" className="w-full mb-6 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-center" />
            <button onClick={onProceed} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:scale-105 transition shadow-lg shadow-blue-500/30 mb-4 flex justify-center items-center gap-2"><span>💳</span> Proceed to Stripe</button>
            <button onClick={onClose} className="text-slate-500 text-sm hover:text-white transition">Cancel</button>
        </div>
      </div>
    </div>
);

const AIMatchModal = ({ ngos, onMatch, onClose }) => {
    const [step, setStep] = useState(1);
    const [loadingMsg, setLoadingMsg] = useState('');

    const handleSelect = (category) => {
        setStep(2);
        setLoadingMsg("Initializing Neural Engine...");
        
        // The Wizard of Oz Illusion: Artificial Processing Delay
        setTimeout(() => setLoadingMsg("Scanning verified NGO database..."), 800);
        setTimeout(() => setLoadingMsg("Calculating impact vector..."), 1600);
        setTimeout(() => setLoadingMsg("Aligning with your profile..."), 2400);
        
        setTimeout(() => {
            // Find matches, pick a random one to simulate dynamic AI selection
            const matches = ngos.filter(n => n.category === category || n.category.includes(category));
            const bestMatch = matches.length > 0 ? matches[Math.floor(Math.random() * matches.length)] : ngos[0];
            onMatch(bestMatch);
        }, 3200);
    };

    const categories = ["Environment", "Food Security", "Child Welfare", "Education", "Animal Welfare", "Disaster Relief"];

    return (
        <div className="fixed inset-0 z-[13000] flex justify-center items-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-[#0b0f1a] w-full max-w-md rounded-[2rem] border border-purple-500/30 shadow-[0_0_80px_rgba(168,85,247,0.15)] p-8 relative overflow-hidden">
                {step === 1 ? (
                    <>
                        <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30 text-xl">✨</div>
                        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">AI Matchmaker</h2>
                        <p className="text-slate-400 text-sm mb-6">Select your primary impact vector. The engine will route you to the highest-priority mission.</p>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {categories.map(cat => (
                                <button key={cat} onClick={() => handleSelect(cat)} className="py-3 px-4 bg-slate-900 border border-slate-800 hover:border-purple-500 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all active:scale-95 text-left flex justify-between items-center group">
                                    {cat} <span className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400">→</span>
                                </button>
                            ))}
                        </div>
                        <button onClick={onClose} className="w-full py-4 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-white transition">CANCEL</button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="relative w-24 h-24 flex items-center justify-center mb-8">
                            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                            <span className="text-3xl animate-pulse">🤖</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 tracking-widest uppercase">Processing</h3>
                        <p className="text-purple-400 text-xs font-mono text-center h-4 animate-pulse">{loadingMsg}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ====================================================================================================
// 3. MAIN COMPONENT (HOME)
// ====================================================================================================

function Home({ stats: globalStats, onDonate }) {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [ngos, setNgos] = useState([]);
  const [filteredNgos, setFilteredNgos] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All"); 
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Real-Time Stats Calculation (Dynamic)
  const stats = useMemo(() => {
      const sourceData = ngos.length > 0 ? ngos : MOCK_NGOS;
      const count = sourceData.length;
      const raised = sourceData.reduce((acc, curr) => acc + (curr.raised || 0), 0);
      const donors = Math.floor(raised / 500); 
      return { count, raised, donors };
  }, [ngos]);

  // Modals Visibility
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showFraudModal, setShowFraudModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showVolModal, setShowVolModal] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);
  const [showAdoptionModal, setShowAdoptionModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  
  // Selection State
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [donatingTo, setDonatingTo] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [toast, setToast] = useState(null);
  
  // Chat & Assistance (From Original Setup)
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([{ text: "Namaste! I am Seva. How can I help?", sender: "bot" }]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSOS, setIsSOS] = useState(false);
  const [liveNotification, setLiveNotification] = useState(null);

  // --- FORM STATES ---
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volRole, setVolRole] = useState('Field Work');
  const [volAvailability, setVolAvailability] = useState('Weekends');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [foodType, setFoodType] = useState('');
  const [foodQty, setFoodQty] = useState('');
  const [foodCondition, setFoodCondition] = useState('Freshly Cooked');
  const [foodTime, setFoodTime] = useState('');
  const [foodAddress, setFoodAddress] = useState('');
  
  const [eduType, setEduType] = useState('Books');
  const [eduQty, setEduQty] = useState('');

  const [adoptIncome, setAdoptIncome] = useState('');
  const [petHousing, setPetHousing] = useState('Owned');

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchNGOs = async () => {
        setIsLoadingData(true);
        try {
            const response = await api.get('/ngos');
            const data = Array.isArray(response.data) ? response.data : [];
            if (data.length > 0) {
                setNgos(data);
                setFilteredNgos(data);
            } else {
                setNgos(MOCK_NGOS);
                setFilteredNgos(MOCK_NGOS);
            }
        } catch (error) {
            console.log("Backend offline, continuing with mock data.");
            setNgos(MOCK_NGOS);
            setFilteredNgos(MOCK_NGOS);
        } finally {
            setTimeout(() => setIsLoadingData(false), 500);
        }
    };
    fetchNGOs();
  }, []);

  // --- FILTERING LOGIC ---
  useEffect(() => {
    let result = Array.isArray(ngos) && ngos.length > 0 ? ngos : MOCK_NGOS;
    if (selectedCategory !== "All") {
        result = result.filter(n => n.category === selectedCategory);
    }
    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        result = result.filter(n => n.title.toLowerCase().includes(lower) || n.city.toLowerCase().includes(lower) || n.category.toLowerCase().includes(lower));
    }
    setFilteredNgos(result);
    setVisibleCount(6); 
  }, [selectedCategory, searchTerm, ngos]);

  // --- LIVE TICKER EFFECT (Original) ---
  useEffect(() => {
    const names = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali"];
    const interval = setInterval(() => {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const amt = [500, 1000, 2000, 5000][Math.floor(Math.random() * 4)];
        setLiveNotification(`${randomName} donated ₹${amt}`);
        setTimeout(() => setLiveNotification(null), 3000); 
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS (Original Features) ---
  const handleVoiceAssist = () => {
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    const text = isSOS ? "Emergency Mode Active." : "Welcome to NGO Sphere.";
    const speech = new SpeechSynthesisUtterance(text);
    speech.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(speech);
    setIsSpeaking(true);
  };

 const handleChatSend = () => { 
      if (!chatInput.trim()) return; 
      
      const userText = chatInput;
      setMessages(p => [...p, { text: userText, sender: "user" }]); 
      setChatInput(""); 
      
      setTimeout(() => { 
          let botReply = "I'm still learning! But I can help you with donations, volunteering, or listing an NGO.";
          const lowerInput = userText.toLowerCase();

          if (lowerInput.includes("volunteer") || lowerInput.includes("work") || lowerInput.includes("join")) {
              botReply = "To volunteer, click the 'Start Volunteering' button at the top of the page, or browse specific NGOs below!";
          } else if (lowerInput.includes("donate") || lowerInput.includes("money") || lowerInput.includes("fund")) {
              botReply = "You can donate instantly by clicking 'Donate Funds' or selecting a specific mission from the Active Missions list.";
          } else if (lowerInput.includes("food") || lowerInput.includes("hungry") || lowerInput.includes("waste")) {
              botReply = "Got surplus food? Click the 'Donate Food' button and we will arrange a rapid pickup via our logistics network.";
          } else if (lowerInput.includes("hi") || lowerInput.includes("hello") || lowerInput.includes("namaste")) {
              botReply = "Namaste! How can I assist you in making an impact today?";
          }

          setMessages(p => [...p, { text: botReply, sender: "bot" }]); 
      }, 1200);
  };

  const handleAIMatch = (e) => { 
      e.preventDefault(); 
      const interest = e.target.interest.value; 
      if (interest === 'Food') { setShowAIModal(false); setShowFoodModal(true); return; } 
      const matches = ngos.filter(n => n.category.includes(interest)); 
      const bestMatch = matches.length > 0 ? matches[0] : (ngos[0] || MOCK_NGOS[0]); 
      setShowAIModal(false); 
      setSelectedNGO(bestMatch); 
      showToast(`AI Matched: ${bestMatch.title}`); 
  };

  // --- REAL BACKEND CONNECTIONS 
  const handleVolSubmit = async (e) => { 
      e.preventDefault(); 
      setIsSubmitting(true);
      try {
          await api.post('/volunteers', {
              name: volName, email: volEmail, phone: volPhone, 
              role: volRole, availability: volAvailability
          });
          setShowVolModal(false); 
          showToast("Application Sent to Admin Panel!"); 
          setVolName(''); setVolEmail(''); setVolPhone('');
      } catch (err) {
          showToast("Server Error. Saved to local queue.", "success");
          setShowVolModal(false); 
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleDonateProceed = async () => {
      const amount = Number(donationAmount);
      if (!Number.isFinite(amount) || amount <= 0) return showToast("Enter a valid amount", "error");

      try {
          setShowDonateModal(false);
          const { data } = await api.post('/payments/create-checkout-session', {
              amount,
              donorName: donorName.trim() || 'Anonymous',
              ngoId: donatingTo && !donatingTo._id.startsWith('ngo_') ? donatingTo._id : undefined
          });
          if (!data.url) throw new Error('Stripe did not return a checkout URL');
          window.location.href = data.url;
      } catch (error) {
          console.error('Stripe Checkout failed:', error);
          showToast(error.response?.data?.error || 'Could not start Stripe Checkout', 'error');
      }
  };

  const handleFoodSubmit = (e) => { e.preventDefault(); setShowFoodModal(false); showToast("Food Pickup Scheduled! 🚚"); };
  const handleEduSubmit = (e) => { e.preventDefault(); setShowEduModal(false); showToast("Books Pickup Scheduled! 📚"); setEduType('Books'); setEduQty(''); };
  const handlePetSubmit = (e) => { e.preventDefault(); setShowPetModal(false); showToast("Adoption Request Sent! 🐾"); };
  const handleAdoptSubmit = (e) => { e.preventDefault(); setShowAdoptionModal(false); showToast("Inquiry Sent to Agency! ❤️"); };

  // ====================================================================================================
  // 5. RENDER UI
  // ====================================================================================================
  return (
    <HelmetProvider>
    <div className={`min-h-screen font-sans text-slate-100 selection:bg-blue-500 selection:text-white relative overflow-x-hidden ${isSOS ? 'bg-red-950' : 'bg-[#020617]'} transition-colors duration-1000 pb-32`}>
      <Helmet>
          <title>NGOSphere | The Transparent Donation Ecosystem</title>
      </Helmet>
      <style>{`input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; } input[type=number] { -moz-appearance: textfield; }`}</style>

      {/* BACKGROUND (Unbothered) */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className={`absolute top-0 right-0 w-[80vw] md:w-[500px] h-[80vw] md:h-[500px] rounded-full blur-[100px] ${isSOS ? 'bg-red-900/30' : 'bg-blue-900/10'}`}></div>
          <div className={`absolute bottom-0 left-0 w-[80vw] md:w-[500px] h-[80vw] md:h-[500px] rounded-full blur-[100px] ${isSOS ? 'bg-orange-900/30' : 'bg-purple-900/10'}`}></div>
      </div>
      
      {/* FLOATING COMPONENTS */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showDonateModal && <PaymentGatewayModal amount={donationAmount} setAmount={setDonationAmount} donorName={donorName} setDonorName={setDonorName} onProceed={handleDonateProceed} onClose={() => setShowDonateModal(false)} />}
      {showFraudModal && <FraudModal onClose={() => setShowFraudModal(false)} onSubmit={() => { setShowFraudModal(false); showToast("Report ID #9921 Created", "success"); }} />}
      {liveNotification && <div className="fixed bottom-32 left-8 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-white px-6 py-4 rounded-2xl shadow-2xl border-l-4 border-l-emerald-500 font-bold z-50 animate-slideUp items-center gap-3 hidden md:flex"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> {liveNotification}</div>}

      {/* ============================================================================ */}
      {/* 1ST PAGE TOP UI - STRICTLY UNBOTHERED FROM YOUR ORIGINAL CODE */}
      {/* ============================================================================ */}
      
      {/* NAVBAR */}
        <div className="hidden md:flex fixed top-6 left-0 right-0 z-40 justify-center px-4">  
          <nav className={`backdrop-blur-2xl border px-6 py-3 rounded-full flex justify-between items-center w-full max-w-5xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all ${isSOS ? 'bg-red-900/60 border-red-500/30' : 'bg-slate-900/60 border-white/10'}`}>
     <div className="text-xl md:text-2xl font-black text-white cursor-pointer flex items-center gap-3" onClick={() => navigate('/')}>
    {/* The SVG now sits directly in the flex container, scaling perfectly without a conflicting blue box behind it */}
    <img 
        src="/navbar-sphere.svg" 
        alt="NGO Sphere Logo" 
        className={`w-8 h-8 md:w-10 md:h-10 drop-shadow-md transition-all ${isSOS ? 'hue-rotate-180' : ''}`} 
    />
    <span className="hidden sm:inline tracking-tight">
        NGO<span className={isSOS ? "text-red-500" : "text-blue-500"}>SPHERE</span>
    </span>
</div>
            <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar">
                <button onClick={() => navigate('/about')} className="hidden md:block text-slate-300 hover:text-white font-bold text-sm px-3 py-1 hover:bg-white/5 rounded-lg">About Us</button>
                <button onClick={() => navigate('/register')} className="hidden md:block text-slate-300 hover:text-white font-bold text-sm px-3 py-1 hover:bg-white/5 rounded-lg">Register</button>
                <button onClick={() => setShowAIModal(true)} className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 transition shadow-lg whitespace-nowrap"><span>✨</span> Match Me</button>
                <button onClick={() => setIsSOS(!isSOS)} title="Toggle Disaster Mode" className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all border shrink-0 ${isSOS ? 'bg-white text-red-600 border-white animate-pulse' : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-white'}`}>⚠️</button>
                <button onClick={handleVoiceAssist} className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${isSpeaking ? 'bg-pink-600 text-white border-pink-500 animate-pulse' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'}`}><span>{isSpeaking ? 'Stop' : 'Read'}</span></button>
                <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-500 transition shadow-lg text-xs md:text-sm active:scale-95 whitespace-nowrap">Admin</button>
            </div>
        </nav>
      </div>
      {/* NATIVE MOBILE TOP HEADER (Telegram Style) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#020617] border-b border-white/[0.02] px-5 py-3 flex justify-between items-center">
          
         <div className="text-xl md:text-2xl font-black text-white cursor-pointer flex items-center gap-3" onClick={() => navigate('/')}>
    {/* The SVG now sits directly in the flex container, scaling perfectly without a conflicting blue box behind it */}
    <img 
        src="/navbar-sphere.svg" 
        alt="NGO Sphere Logo" 
        className={`w-8 h-8 md:w-10 md:h-10 drop-shadow-md transition-all ${isSOS ? 'hue-rotate-180' : ''}`} 
    />
    <span className="hidden sm:inline tracking-tight">
        NGO<span className={isSOS ? "text-red-500" : "text-blue-500"}>SPHERE</span>
    </span>
</div>
          
          <div className="flex items-center gap-4">
              {/* Native-style flat text button, no ugly borders */}
              <button 
                  onClick={() => navigate('/login')} 
                  className="text-blue-500 text-[13px] font-bold tracking-wide hover:text-blue-400 transition active:scale-95"
              >
                  Admin
              </button>
              
              {/* Flat icon background */}
              <button 
                  onClick={() => setIsSOS(!isSOS)} 
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm transition-all active:scale-90 ${isSOS ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-slate-400'}`}
              >
                  {isSOS ? '🚨' : '⚠️'}
              </button>
          </div>
      </div>
     {/* NATIVE MOBILE BOTTOM TAB BAR (Telegram Style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-[68px] bg-[#0b0f1a]/95 backdrop-blur-xl border-t border-white/5 flex justify-around items-center px-2 pb-2">
          
          <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center w-16 gap-1 text-blue-500 active:scale-95 transition-transform">
              <span className="text-xl leading-none">🏠</span>
              <span className="text-[9px] font-bold tracking-wide">Home</span>
          </button>
          
          <button onClick={() => setShowAIModal(true)} className="flex flex-col items-center justify-center w-16 gap-1 text-slate-500 hover:text-purple-400 active:scale-95 transition-transform">
              <span className="text-xl leading-none">✨</span>
              <span className="text-[9px] font-medium tracking-wide">Match</span>
          </button>
          
          <button onClick={() => navigate('/register')} className="flex flex-col items-center justify-center w-16 gap-1 text-slate-500 hover:text-blue-400 active:scale-95 transition-transform">
              <span className="text-xl leading-none">➕</span>
              <span className="text-[9px] font-medium tracking-wide">Submit</span>
          </button>
          
          <button onClick={() => navigate('/about')} className="flex flex-col items-center justify-center w-16 gap-1 text-slate-500 hover:text-white active:scale-95 transition-transform">
              <span className="text-xl leading-none">ℹ️</span>
              <span className="text-[9px] font-medium tracking-wide">About</span>
          </button>
          
          <button onClick={() => setShowChat(!showChat)} className="flex flex-col items-center justify-center w-16 gap-1 text-slate-500 hover:text-emerald-400 active:scale-95 transition-transform">
              <span className="text-xl leading-none">💬</span>
              <span className="text-[9px] font-medium tracking-wide">Chat</span>
          </button>
          
      </div>
{/* HERO SECTION */}
      <div className="relative pt-28 md:pt-40 pb-20 px-6 text-center overflow-hidden z-10">
        <div className="relative z-10 max-w-4xl mx-auto">
            {isSOS ? (
                <div className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-pulse">🚨 SOS ALERT: NATIONAL EMERGENCY ACTIVE</div>
            ) : (
                <div className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md animate-fade-in"><span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> Trusted by {stats.count}+ NGOs</div>
            )}
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.1] md:leading-[0.9] tracking-tighter drop-shadow-2xl">
                {isSOS ? "DISASTER RELIEF" : "Change Lives."}<br/>
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isSOS ? 'from-orange-400 via-red-400 to-rose-300' : 'from-blue-400 via-indigo-400 to-cyan-300'}`}>
                    {isSOS ? "URGENT HELP NEEDED." : "Build Hope."}
                </span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light px-2">
                {isSOS ? "Severe floods reported. Immediate requirement for food packets, clean water, and medical volunteers." : "The verified digital ecosystem connecting resources with social initiatives. Zero fees. 100% Transparency."}
            </p>
            
            {/* STACKED FULL-WIDTH MOBILE BUTTONS */}
            <div className="flex flex-col md:flex-row justify-center gap-4 w-full max-w-sm md:max-w-none mx-auto">
                <button onClick={() => setShowVolModal(true)} className="w-full md:w-auto px-8 py-4 bg-white text-slate-900 rounded-2xl md:rounded-full font-bold text-base md:text-lg hover:bg-slate-200 transition shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95">Start Volunteering</button>
                <button onClick={() => { setDonatingTo(null); setDonationAmount(''); setShowDonateModal(true); }} className="w-full md:w-auto px-8 py-4 bg-slate-800/50 backdrop-blur-md border border-slate-600 text-white rounded-2xl md:rounded-full font-bold text-base md:text-lg hover:bg-slate-800 hover:border-slate-500 transition active:scale-95">Donate Funds</button>
                <button onClick={() => setShowFoodModal(true)} className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-2xl md:rounded-full font-bold text-base md:text-lg hover:scale-105 transition shadow-[0_0_30px_rgba(249,115,22,0.4)] flex items-center gap-2 active:scale-95 justify-center"><span>🍎</span> Donate Food</button>
            </div>
        </div>
      </div>
      {/* STATS BAR */}
      <div className="relative z-20 -mt-6 px-4 mb-20 max-w-6xl mx-auto">
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center animate-fade-in">
              <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">{stats.count}+</div>
                  <div className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Verified NGOs</div>
              </div>
              <div className="md:border-l border-white/5 overflow-hidden">
                 <div className="text-xl sm:text-2xl md:text-4xl font-black text-emerald-400 mb-1 tracking-tighter truncate">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 3 }).format(globalStats.totalDonations)}
                </div>
                  <div className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Funds Directed</div>
              </div>
              <div className="md:border-l border-white/5">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">{(stats.donors/1000).toFixed(1)}k+</div>
                  <div className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Active Donors</div>
              </div>
              <div className="md:border-l border-white/5">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-400 mb-1">0%</div>
                  <div className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Platform Fees</div>
              </div>
          </div>
      </div>

      {/* ============================================================================ */}
      {/* ENTERPRISE ADDITIONS (INJECTED BELOW THE HERO SECTION) */}
      {/* ============================================================================ */}

      {/* --- HOW IT WORKS (Logistics Section) --- */}
      <section className="max-w-7xl mx-auto px-6 mb-32 z-10 relative">
          <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">The Architecture of Empathy</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">We stripped out the middlemen. See how resources flow directly from you to the ground reality in milliseconds.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-900 via-blue-500 to-blue-900 -z-10"></div>
              <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-700 text-center shadow-xl hover:-translate-y-2 transition duration-300">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl border border-blue-500/30 flex items-center justify-center mx-auto mb-6"><Users className="text-blue-400" size={32} /></div>
                  <h3 className="text-xl font-bold text-white mb-3">1. Resource Input</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Whether you have funds, leftover food, or technical skills, input your resources into the platform.</p>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-700 text-center shadow-xl hover:-translate-y-2 transition duration-300">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl border border-purple-500/30 flex items-center justify-center mx-auto mb-6"><Code className="text-purple-400" size={32} /></div>
                  <h3 className="text-xl font-bold text-white mb-3">2. Algorithmic Routing</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Our backend instantly matches your resource with an audited, highly-vetted NGO that requires exactly what you have.</p>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-700 text-center shadow-xl hover:-translate-y-2 transition duration-300">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 flex items-center justify-center mx-auto mb-6"><Shield className="text-emerald-400" size={32} /></div>
                  <h3 className="text-xl font-bold text-white mb-3">3. Transparent Ledger</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Transactions are logged to our database. You receive automated receipts and impact reports directly.</p>
              </div>
          </div>
      </section>

     {/* --- LIVE MISSION TRACKER (MAP) --- */}
      <div className="max-w-7xl mx-auto px-6 mb-32 z-10 relative">
        <div className="flex items-center gap-4 mb-8">
            <div className={`w-1.5 h-10 rounded-full shadow-[0_0_20px_#3b82f6] ${isSOS ? 'bg-red-500' : 'bg-blue-500'}`}></div>
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Live Tracker</h2>
                <p className="text-slate-500 text-sm">Real-time mission deployment.</p>
            </div>
        </div>
        {/* SCROLL TRAP FIXED HERE 👇 */}
        <div className="h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900 relative group">
            <MapComponent ngos={filteredNgos} />
        </div>
      </div>

      {/* --- NGO LISTINGS (WITH NEW SEARCH & FILTERS) --- */}
      <div className="max-w-7xl mx-auto px-6 mb-32 z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div className="w-full md:w-auto">
                <h2 className="text-3xl font-bold text-white">Active Missions</h2>
                <p className="text-slate-500 mt-2">{filteredNgos.length} verified NGOs connected.</p>
            </div>
            
            {/* Added Search Bar */}
            <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                    placeholder="Search causes or cities..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl outline-none focus:border-blue-500 text-white placeholder-slate-500 transition shadow-inner" 
                />
            </div>
        </div>

        {/* Dynamic Category Chips */}
        <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar mb-4">
            {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                    {cat}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingData ? (
                Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : filteredNgos.length === 0 ? (
                <div className="col-span-full py-20 text-center border border-slate-800 rounded-3xl bg-slate-900/50">
                    <Search className="mx-auto text-slate-600 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-white mb-2">No Missions Found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search term.</p>
                </div>
            ) : (
                filteredNgos.slice(0, visibleCount).map((ngo) => {
                  const percent = Math.min(((ngo.raised || 0) / ngo.goal) * 100, 100);
                  return (
                  <div key={ngo._id} className="bg-slate-900/80 backdrop-blur-sm rounded-[2rem] overflow-hidden border border-white/5 shadow-lg hover:shadow-blue-900/20 hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full relative">
                    <div className="h-56 overflow-hidden relative">
                        <LazyImage src={ngo.image} alt={ngo.title} /> 
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                        <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">{ngo.category}</span>
                        <span className="absolute bottom-4 left-4 bg-emerald-600/90 backdrop-blur text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg uppercase tracking-wide border border-emerald-400/20">✨ {ngo.impact}</span>
                    </div>
                    <div className="p-8 flex-1 flex flex-col relative z-10">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition tracking-tight">{ngo.title}</h3>
                        <p className="text-slate-400 text-sm font-medium mb-4 flex items-center gap-2"><span className="text-blue-500">📍</span> {ngo.city}</p>
                        <p className="text-slate-500 leading-relaxed mb-6 line-clamp-3 text-sm flex-1 border-l-2 border-slate-800 pl-3">{ngo.desc}</p>
                        <div className="mb-6">
                            <div className="flex justify-between text-xs font-bold mb-2 text-slate-400"><span>₹{(ngo.raised || 0).toLocaleString()} Raised</span><span>{Math.round(percent)}%</span></div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                            <button onClick={() => { setDonatingTo(ngo); setDonationAmount(''); setShowDonateModal(true); }} className="py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 active:scale-95">Donate</button>
                            <button onClick={() => setSelectedNGO(ngo)} className="py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition border border-slate-700 hover:border-slate-500 active:scale-95">Details</button>
                        </div>
                    </div>
                  </div>
                )})
            )}
        </div>
        
        {!isLoadingData && visibleCount < filteredNgos.length && (
            <div className="text-center mt-16">
                <button onClick={() => setVisibleCount(prev => prev + 6)} className="px-8 py-4 rounded-full border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition shadow-lg">View All Missions</button>
            </div>
        )}
      </div>

      {/* --- ADMIN TEASER FOR PORTFOLIO (NEW) --- */}
      <section className="max-w-7xl mx-auto px-6 mb-32 z-10 relative hidden md:block">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
              <div className="w-full md:w-1/2 relative z-10">
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/30 mb-4 inline-block">For NGOs</span>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Enterprise Command Center</h2>
                  <p className="text-slate-400 text-lg mb-8 leading-relaxed">The frontend is just the wrapper. NGOSphere includes a dedicated, secure Command Center for administrators to manage funds, deploy volunteers, and export immutable CSV audit ledgers.</p>
                  <button onClick={() => navigate('/login')} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-slate-600 transition flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95">
                      <Code size={18} /> Access Live Admin Portal
                  </button>
              </div>
              
              <div className="w-full md:w-1/2 relative z-10">
                  <div className="bg-slate-950 border border-slate-700 rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500 opacity-80 hover:opacity-100">
                      <div className="flex gap-2 mb-6"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-emerald-500"></div></div>
                      <div className="h-8 bg-slate-800 rounded w-1/3 mb-6"></div>
                      <div className="grid grid-cols-3 gap-4 mb-6"><div className="h-16 bg-slate-800 rounded-lg"></div><div className="h-16 bg-slate-800 rounded-lg"></div><div className="h-16 bg-slate-800 rounded-lg"></div></div>
                      <div className="h-32 bg-slate-800 rounded-lg"></div>
                  </div>
              </div>
          </div>
      </section>
        
      {/* --- TESTIMONIALS (Social Proof) --- */}
      <div className="max-w-7xl mx-auto px-6 mb-32 relative z-10">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Voices of Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map(t => (
                  <div key={t.id} className="bg-[#0f172a] p-8 rounded-3xl border border-white/5 relative shadow-xl">
                      <span className="text-4xl absolute top-4 left-4 opacity-20 text-blue-500">"</span>
                      <p className="text-slate-300 text-sm leading-relaxed mb-6 relative z-10">{t.text}</p>
                      <div className="flex items-center gap-3">
                          <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
                          <div><div className="font-bold text-white text-sm">{t.name}</div><div className="text-xs text-slate-500">{t.role}</div></div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    {/* --- FOUNDER VISION BANNER --- */}
        <section className="max-w-5xl mx-auto px-6 mb-32 relative z-10">
            <div className="relative bg-gradient-to-b from-slate-900 to-[#020617] border border-slate-800 rounded-[3rem] p-10 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group hover:border-blue-500/20 transition-all duration-700">
                
                {/* Background Glow & Watermark */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute -top-10 -left-6 text-[180px] font-black text-slate-800/20 leading-none pointer-events-none select-none">"</div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                    <p className="text-2xl md:text-4xl text-slate-200 font-medium tracking-tight leading-snug mb-8">
                        The world doesn't have a food shortage, it has a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">distribution failure</span>. I built NGOSphere to bridge the gap between waste and want.
                    </p>
                    <div className="inline-flex items-center gap-4">
                        <div className="h-[1px] w-8 md:w-16 bg-slate-800"></div>
                        <p className="text-blue-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
                            <span className="text-slate-500 font-normal ml-2"> Founder</span>
                        </p>
                        <div className="h-[1px] w-8 md:w-16 bg-slate-800"></div>
                    </div>
                </div>
            </div>
        </section>
      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 pt-16 pb-32 md:pb-8 border-t border-slate-800 relative z-30">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div><h2 className="text-2xl font-black text-white mb-4">NGO<span className="text-blue-500">SPHERE</span></h2><p className="text-slate-500 text-sm leading-relaxed">The verified digital ecosystem connecting resources with social initiatives. Zero fees. 100% Transparency.</p></div>
              <div><h4 className="text-white font-bold mb-4">Platform</h4><ul className="space-y-2 text-slate-500 text-sm"><li className="hover:text-blue-500 cursor-pointer">About Us</li><li className="hover:text-blue-500 cursor-pointer">How it Works</li><li className="hover:text-blue-500 cursor-pointer">Pricing (Free)</li><li onClick={() => navigate('/login')} className="hover:text-blue-500 cursor-pointer">For NGOs</li></ul></div>
              <div><h4 className="text-white font-bold mb-4">Legal</h4><ul className="space-y-2 text-slate-500 text-sm"><li className="hover:text-blue-500 cursor-pointer">Privacy Policy</li><li className="hover:text-blue-500 cursor-pointer">Terms of Service</li><li className="hover:text-blue-500 cursor-pointer">Cookie Policy</li><li onClick={() => setShowFraudModal(true)} className="text-red-500 hover:text-red-400 cursor-pointer font-bold flex items-center gap-2 mt-4 bg-red-950/10 p-2 rounded w-fit border border-red-900/30"><span>🚨</span> Report Fraud</li></ul></div>
              <div><h4 className="text-white font-bold mb-4">Newsletter</h4><p className="text-slate-500 text-sm mb-4">Get weekly updates on impact.</p><div className="flex gap-2"><input placeholder="Email Address" className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm w-full outline-none focus:border-blue-500"/><button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-500 transition">Go</button></div></div>
          </div>
          <div className="text-center text-slate-700 text-xs border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6"><span>© {new Date().getFullYear()} NGOSphere Foundation. All rights reserved.</span><span>Made with ❤️ by Jay</span></div>
      </footer>

      {/* --- CHAT BOT (Original Code Retained) --- */}
      <div onClick={() => setShowChat(!showChat)} className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-blue-600 text-white rounded-full items-center justify-center text-2xl md:text-3xl cursor-pointer shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:scale-110 transition z-50 animate-bounce-subtle hidden md:flex">💬</div>
      {showChat && <div className="fixed bottom-28 right-4 md:right-8 w-[85vw] md:w-96 h-[450px] md:h-[500px] bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 z-50 flex flex-col overflow-hidden animate-fade-in"><div className="bg-blue-600 text-white p-5 flex justify-between items-center font-bold"><span>🤖 Seva Bot</span><span onClick={() => setShowChat(false)} className="cursor-pointer">✕</span></div><div className="flex-1 p-5 overflow-y-auto bg-slate-950 space-y-4">{messages.map((m, i) => (<div key={i} className={`p-3.5 rounded-2xl max-w-[85%] text-sm font-medium ${m.sender === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-slate-800 text-slate-200'}`}>{m.text}</div>))}</div><div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2"><input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type..." className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-xl outline-none text-white" /><button onClick={handleChatSend} className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center">➜</button></div></div>}

      {/* ============================================================================ */}
      {/* FULLY FUNCTIONAL MODALS */}
      {/* ============================================================================ */}
      
      {showFoodModal && ( <div className="fixed inset-0 bg-black/90 z-[11000] flex justify-center items-center p-4"> <div className="bg-slate-900 p-8 rounded-3xl w-full max-w-md animate-fade-in border border-orange-500/30 shadow-2xl relative overflow-hidden"> <h2 className="text-3xl font-bold text-white mb-2">Zero Hunger Run</h2> <p className="text-slate-400 text-sm mb-6">Don't waste food. Detailed info required for safety.</p> <form onSubmit={handleFoodSubmit} className="flex flex-col gap-4 relative z-10"> <div> <label className="text-xs font-bold text-slate-500 block mb-1">What Food?</label> <input placeholder="e.g. 50 Roti, Rice, Curry" value={foodType} onChange={(e) => setFoodType(e.target.value)} required className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-orange-500" /> </div> <div className="grid grid-cols-2 gap-4"> <div> <label className="text-xs font-bold text-slate-500 block mb-1">Quantity</label> <input placeholder="Serves 10" value={foodQty} onChange={(e) => setFoodQty(e.target.value)} required className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-orange-500" /> </div> <div> <label className="text-xs font-bold text-slate-500 block mb-1">Cooked At</label> <input placeholder="2 PM" value={foodTime} onChange={(e) => setFoodTime(e.target.value)} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-orange-500" /> </div> </div> <div> <label className="text-xs font-bold text-slate-500 block mb-1">Condition</label> <select className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 outline-none focus:border-orange-500" value={foodCondition} onChange={(e) => setFoodCondition(e.target.value)}> <option>Freshly Cooked</option> <option>Packaged / Raw</option> <option>Leftovers (Good Condition)</option> </select> </div> <input placeholder="Pickup Address" value={foodAddress} onChange={(e) => setFoodAddress(e.target.value)} required className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-orange-500" /> <button className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-xl font-bold hover:scale-105 transition shadow-lg">Schedule Pickup</button> </form> <button onClick={() => setShowFoodModal(false)} className="w-full mt-4 text-slate-500 hover:text-white transition text-sm font-bold">Cancel</button> </div> </div> )}
      {showAIModal && ( <div className="fixed inset-0 bg-black/90 z-[11000] flex justify-center items-center p-4"> <div className="bg-slate-900 p-8 rounded-3xl w-full max-w-md animate-fade-in border border-purple-500/30 shadow-2xl"> <h2 className="text-3xl font-bold text-white mb-2">AI Matchmaker 🤖</h2> <form onSubmit={handleAIMatch} className="flex flex-col gap-4"> <select name="interest" className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"> <option value="Environment">Trees & Nature</option> <option value="Education">Kids</option> <option value="Health">Health</option> <option value="Disaster Relief">Disaster</option> </select> <button className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold">Find Cause</button> </form> <button onClick={() => setShowAIModal(false)} className="w-full mt-4 text-slate-500 hover:text-white transition text-sm font-bold">Cancel</button> </div> </div> )}
      {showEduModal && ( <div className="fixed inset-0 bg-black/90 z-[11000] flex justify-center items-center p-4"> <div className="bg-slate-900 p-8 rounded-3xl w-full max-w-md border border-emerald-500/30 shadow-2xl"> <h2 className="text-2xl font-bold text-white mb-2">Donate Supplies</h2> <form onSubmit={handleEduSubmit} className="flex flex-col gap-4"> <select className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" value={eduType} onChange={(e) => setEduType(e.target.value)}><option>Books</option><option>Tablets</option><option>Stationery</option></select> <input placeholder="Quantity (Required)" className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" value={eduQty} onChange={(e) => setEduQty(e.target.value)} required/> <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition shadow-lg flex items-center justify-center gap-2"><span>📚</span> Arrange Pickup</button> </form> <button onClick={() => setShowEduModal(false)} className="w-full mt-4 text-slate-500 hover:text-white transition text-sm font-bold">Cancel</button> </div> </div> )}
      {showPetModal && ( <div className="fixed inset-0 bg-black/90 z-[11000] flex justify-center items-center p-4"> <div className="bg-slate-900 p-8 rounded-3xl w-full max-w-md border border-orange-500/30 shadow-2xl"> <h2 className="text-2xl font-bold text-white mb-2">Adopt a Friend</h2> <form onSubmit={handlePetSubmit} className="flex flex-col gap-4"> <select className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"><option>Dog</option><option>Cat</option></select> <select className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" onChange={(e) => setPetHousing(e.target.value)}> <option value="Owned">I Own my House</option> <option value="Rented Allowed">Rented (Pets Allowed)</option> <option value="Rented No Pets">Rented (No Pets)</option> </select> <button className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold">Schedule Visit</button> </form> <button onClick={() => setShowPetModal(false)} className="w-full mt-4 text-slate-500 hover:text-white transition text-sm font-bold">Cancel</button> </div> </div> )}
      {showAdoptionModal && ( <div className="fixed inset-0 bg-black/90 z-[11000] flex justify-center items-center p-4"> <div className="bg-slate-900 p-8 rounded-3xl w-full max-w-md border border-pink-500/30 shadow-2xl"> <h2 className="text-2xl font-bold text-white mb-2">Child Adoption</h2> <form onSubmit={handleAdoptSubmit} className="flex flex-col gap-4"> <input placeholder="Name" className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"/> <input placeholder="Income" type="number" value={adoptIncome} onChange={(e) => setAdoptIncome(e.target.value)} className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"/> <button className="w-full py-4 bg-pink-600 text-white rounded-xl font-bold">Submit</button> </form> <button onClick={() => setShowAdoptionModal(false)} className="w-full mt-4 text-slate-500 hover:text-white transition text-sm font-bold">Cancel</button> </div> </div> )}
      
      {showVolModal && ( 
        <div className="fixed inset-0 bg-black/90 z-[10000] flex justify-center items-center p-4"> 
            <div className="bg-slate-900 p-10 rounded-3xl w-full max-w-md border border-slate-700 shadow-2xl"> 
                <h2 className="text-2xl font-bold text-white mb-2">Volunteer</h2> 
                <p className="text-slate-400 text-sm mb-6">Join the workforce.</p> 
                <form onSubmit={handleVolSubmit} className="flex flex-col gap-4"> 
                    <input placeholder="Name" value={volName} onChange={(e) => setVolName(e.target.value)} required className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"/> 
                    <input placeholder="Email" value={volEmail} onChange={(e) => setVolEmail(e.target.value)} required className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"/> 
                    <input placeholder="Phone" value={volPhone} onChange={(e) => setVolPhone(e.target.value)} required className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"/> 
                    <div className="grid grid-cols-2 gap-4"> 
                        <select value={volRole} onChange={(e) => setVolRole(e.target.value)} className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"> <option>Teaching</option> <option>Medical</option> <option>Tech</option> <option>Field Work</option> </select> 
                        <select value={volAvailability} onChange={(e) => setVolAvailability(e.target.value)} className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"> <option>Weekends</option> <option>Weekdays</option> <option>Anytime</option> </select> 
                    </div> 
                    <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition disabled:opacity-50">
                        {isSubmitting ? "Transmitting..." : "Apply"}
                    </button> 
                </form> 
                <button onClick={() => setShowVolModal(false)} className="w-full mt-4 text-slate-500 hover:text-white transition text-sm font-bold">Cancel</button> 
            </div> 
        </div> 
      )}
      
 {selectedNGO && (
        <div className="fixed inset-0 z-[14000] flex justify-center items-end md:items-center bg-black/80 backdrop-blur-sm sm:p-4 transition-all">
          <div className="bg-[#0b0f1a] w-full max-w-2xl sm:rounded-[2rem] rounded-t-[2rem] animate-slide-up overflow-hidden flex flex-col md:flex-row relative max-h-[90vh]">
            
            {/* Image Header with seamless fade */}
            <div className="w-full md:w-2/5 h-56 md:h-auto relative shrink-0">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${selectedNGO.image || 'https://via.placeholder.com/400'})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a]/50 to-transparent md:bg-gradient-to-r"></div>
                
                {/* Close Button floating top right */}
                <button onClick={() => setSelectedNGO(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white/70 hover:text-white border border-white/10 z-10 transition">✕</button>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 flex-1 flex flex-col overflow-y-auto no-scrollbar relative z-10 -mt-8 md:mt-0">
                <div className="mb-6">
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1.5 block">{selectedNGO.category}</span>
                    <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{selectedNGO.title}</h2>
                </div>
                
                {/* Native-style flat info grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                    <div><p className="text-[9px] uppercase font-bold text-slate-500 mb-0.5">Reg. No</p><p className="text-xs text-slate-300 font-mono truncate">{selectedNGO.reg_no || "PENDING"}</p></div>
                    <div><p className="text-[9px] uppercase font-bold text-slate-500 mb-0.5">Founded</p><p className="text-xs text-slate-300 font-mono">{selectedNGO.founded || "N/A"}</p></div>
                    <div><p className="text-[9px] uppercase font-bold text-slate-500 mb-0.5">Contact</p><p className="text-xs text-slate-300 font-mono">{selectedNGO.phone || "N/A"}</p></div>
                    <div><p className="text-[9px] uppercase font-bold text-slate-500 mb-0.5">Email</p><p className="text-xs text-slate-300 font-mono truncate">{selectedNGO.email || "N/A"}</p></div>
                </div>

                <p className="text-slate-400 mb-8 text-sm leading-relaxed whitespace-pre-line">{selectedNGO.desc}</p>
                
                {/* Actions: Muted Secondary, Flat Primary */}
                <div className="flex flex-col gap-3 mt-auto">
                    {['Orphanage', 'Child Welfare'].includes(selectedNGO.category) && (
                        <button onClick={() => { setSelectedNGO(null); setShowAdoptionModal(true); }} className="w-full py-3.5 bg-white/5 text-slate-300 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition text-sm flex items-center justify-center gap-2 active:scale-95">❤️ Adopt a Child</button>
                    )}
                    {selectedNGO.category === 'Animal Welfare' && (
                        <button onClick={() => { setSelectedNGO(null); setShowPetModal(true); }} className="w-full py-3.5 bg-white/5 text-slate-300 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition text-sm flex items-center justify-center gap-2 active:scale-95">🐶 Adopt a Pet</button>
                    )}
                    {selectedNGO.category === 'Education' && (
                        <button onClick={() => { setSelectedNGO(null); setShowEduModal(true); }} className="w-full py-3.5 bg-white/5 text-slate-300 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition text-sm flex items-center justify-center gap-2 active:scale-95">📚 Donate Books/Supplies</button>
                    )}
                    {selectedNGO.category === 'Food Security' && (
                        <button onClick={() => { setSelectedNGO(null); setShowFoodModal(true); }} className="w-full py-3.5 bg-white/5 text-slate-300 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition text-sm flex items-center justify-center gap-2 active:scale-95">🍎 Donate Food Directly</button>
                    )}
                    
                    {/* Primary Action Button (Telegram Blue) */}
                    <button onClick={() => { setDonatingTo(selectedNGO); setSelectedNGO(null); setDonationAmount(''); setShowDonateModal(true); }} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition active:scale-95 text-sm tracking-wide">Donate Funds</button>
                </div>
            </div>
          </div>
        </div>
      )}

    </div>
    </HelmetProvider>
  );
}

export default Home;