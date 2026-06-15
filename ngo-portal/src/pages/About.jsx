import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  // 1. SEPARATE YOU FROM THE GROUP
  const leadDev = {
      name: "Jayesh Patil",
      role: "Lead Architect & Full Stack Developer",
      bio: "The engineering brain behind NGOSphere. Jayesh designed the database schemas, built the secure Node.js backend, and crafted the responsive React frontend. He managed the entire deployment pipeline.",
      tasks: ["System Architecture", "MERN Stack", "Payment Integration", "Server Security"],
      tech: ["React.js", "Node.js", "MongoDB", "Tailwind", "Razorpay"],
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80" 
  };

  const supportTeam = [
    {
      name: "Ojas More",
      role: "Strategy & Outreach",
      bio: "Focused on the project narrative, stakeholder requirements, and high-level conceptual feedback.",
      tasks: ["Ideation", "Pitch Deck", "User Feedback"],
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Disha Desale",
      role: "Project Coordinator",
      bio: "Managed the project timeline, documentation formatting, and administrative organization.",
      tasks: ["Scheduling", "Documentation", "Coordination"],
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const timeline = [
    { week: "Phase 1", title: "The Foundation", desc: "Server setup, MongoDB Schema Design, and Git Repo initialization." },
    { week: "Phase 2", title: "Core Logic", desc: "API Route creation, Authentication (JWT), and Backend Security." },
    { week: "Phase 3", title: "Frontend Architecture", desc: "React Component design, State Management, and Map Integration." },
    { week: "Phase 4", title: "System Integration", desc: "Connecting Payment Gateway, Admin Dashboard, and Database." },
    { week: "Phase 5", title: "Final Polish", desc: "Documentation, Bug Fixes, and Production Deployment." }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500 selection:text-white pb-20">
      
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-xl font-black tracking-tighter text-white cursor-pointer flex items-center gap-3" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/30">NP</div>
                <span>NGO<span className="text-blue-500">SPHERE</span></span>
            </div>
            <button onClick={() => navigate('/')} className="text-sm font-bold text-slate-400 hover:text-white transition">
                ← Return Home
            </button>
        </div>
      </nav>

      {/* 2. HERO HEADER */}
      <div className="relative pt-20 pb-32 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] -z-10"></div>
        <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Impact.</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A full-stack solution bridging the gap between resources and those in need. 
            Engineered with modern web technologies for speed, security, and scalability.
        </p>
      </div>

      {/* 3. THE ARCHITECT SECTION (PRIORITIZING YOU) */}
      <div className="max-w-5xl mx-auto px-6 mb-24 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent blur-3xl -z-10 transform translate-y-10"></div>
        
        <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-10 md:gap-16">
            
            {/* Image Side */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-lg opacity-50"></div>
                <img src={leadDev.image} className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-slate-900 relative z-10 shadow-2xl" />
                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full border-4 border-slate-900 shadow-lg z-20">
                    LEAD DEV
                </div>
            </div>

            {/* Content Side */}
            <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">{leadDev.name}</h2>
                <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-6">{leadDev.role}</p>
                
                <p className="text-slate-300 leading-relaxed mb-8 text-lg">
                    {leadDev.bio}
                </p>

                {/* Tech Stack Badges */}
                <div className="mb-8">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-3">Core Tech Stack</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {leadDev.tech.map(t => (
                            <span key={t} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-blue-300 hover:border-blue-500 transition cursor-default">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Tasks */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {leadDev.tasks.map(task => (
                        <div key={task} className="flex items-center gap-2 text-sm text-slate-400">
                            <span className="text-emerald-500">✓</span> {task}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* 4. THE SUPPORT TEAM */}
      <div className="max-w-5xl mx-auto px-6 mb-32">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-4">
            <span className="w-8 h-[2px] bg-slate-700"></span>
            Project Support
            <span className="w-full h-[2px] bg-slate-700"></span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportTeam.map((member, index) => (
                <div key={index} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex items-start gap-5 hover:bg-slate-900 transition">
                    <img src={member.image} className="w-16 h-16 rounded-xl object-cover bg-slate-800" />
                    <div>
                        <h4 className="text-lg font-bold text-white">{member.name}</h4>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">{member.role}</p>
                        <p className="text-sm text-slate-400 leading-relaxed mb-3">{member.bio}</p>
                        <div className="flex flex-wrap gap-2">
                            {member.tasks.map(task => (
                                <span key={task} className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-300 border border-white/5">
                                    {task}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* 5. DEVELOPMENT ROADMAP */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white">The Engineering Journey</h2>
            <p className="text-slate-500 text-sm mt-2">From concept to deployment in 5 weeks.</p>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
            {timeline.map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    
                    {/* Icon/Dot */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]"></div>
                    </div>
                    
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white">{item.title}</span>
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{item.week}</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
}

export default About;