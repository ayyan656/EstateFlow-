
import React, { useState } from 'react';
import { 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Phone, 
  Mail, 
  MessageCircle, 
  ArrowUp, 
  Quote,
  LayoutDashboard,
  Users,
  TrendingUp,
  Handshake
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AuthModal } from '../components/auth/AuthModal';
import { ChatWidget } from '../components/ChatWidget';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const WORKFLOW_STEPS = [
  {
    id: 1,
    title: "List & Showcase Properties",
    description: "Easily add property listings with high-res images and AI-generated descriptions. Manage your inventory of homes, condos, and land in one centralized hub.",
    icon: <Building2 className="w-8 h-8 text-white" />,
    color: "bg-blue-600",
    shadow: "shadow-blue-200"
  },
  {
    id: 2,
    title: "Manage Buyer Leads",
    description: "Capture inquiries directly from your landing page. Profile potential buyers, track their budget and preferences, and organize them by readiness.",
    icon: <Users className="w-8 h-8 text-white" />,
    color: "bg-purple-600",
    shadow: "shadow-purple-200"
  },
  {
    id: 3,
    title: "Connect & Close Deals",
    description: "Match the perfect buyer with the right seller. Facilitate negotiations, track deal stages on our Kanban board, and sign contracts faster.",
    icon: <Handshake className="w-8 h-8 text-white" />,
    color: "bg-green-600",
    shadow: "shadow-green-200"
  }
];

const TESTIMONIALS = [
  {
    id: 1,
    quote: "EstateFlow transformed how we manage listings. The ability to instantly match a new property with existing buyer leads is incredible!",
    name: "Sarah Jenkins",
    role: "Senior Agent",
    company: "Luxury Living",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 2,
    quote: "Finally, a CRM that understands the relationship between seller inventory and buyer requirements. It's the bridge we needed.",
    name: "Michael Ross",
    role: "Founder",
    company: "Ross Realty",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 3,
    quote: "Adding properties is so fast, and the visual pipeline helps me keep track of which deals are ready to close.",
    name: "Emily Chen",
    role: "Realtor",
    company: "Urban Spaces",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80"
  }
];

export const Landing: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Navbar */}
      <nav className="border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-2xl">
            <Building2 className="text-accent h-8 w-8" />
            <span>EstateFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button onClick={() => navigate('/plans')} size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                v2.0 is now live
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-backwards">
                Manage Your <br />
                <span className="text-accent">Real Estate</span> Empire
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-backwards">
                 The all-in-one CRM designed for modern real estate agents. Track leads, manage properties, and close deals faster with our AI-powered platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-backwards">
                <Button size="lg" onClick={() => navigate('/plans')} icon={<ArrowRight size={20} />}>
                  Start Free Trial
                </Button>
                <Button size="lg" variant="secondary" onClick={() => setIsAuthModalOpen(true)}>
                  View Demo
                </Button>
              </div>

              <div className="pt-8 flex items-center gap-8 text-sm text-slate-500 dark:text-slate-400 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-backwards">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-500" />
                  <span>Unlimited Listings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-500" />
                  <span>Smart Lead Tracking</span>
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative animate-in fade-in slide-in-from-right-12 duration-1000 ease-out">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-2xl transform rotate-2 opacity-50 blur-lg"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80" 
                  alt="Modern Real Estate Dashboard" 
                  className="w-full h-auto object-cover"
                />
                
                {/* Floating Element 1 */}
                <div className="absolute top-8 right-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-backwards">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">New Listing Added</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Seaside Villa</p>
                  </div>
                </div>

                {/* Floating Element 2 */}
                <div className="absolute bottom-8 left-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-backwards">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                    <Handshake size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Offer Accepted</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">$850,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow / How It Works Section */}
        <section className="py-20 bg-white dark:bg-slate-950 relative transition-colors duration-200">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20">
                 <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-6">
                   Streamline your deals in <span className="text-accent">3 easy steps</span>
                 </h2>
                 <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                   EstateFlow simplifies the journey from listing a property to closing the deal, ensuring no opportunity is missed.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                 {/* Connector Line for Desktop */}
                 <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-blue-100 via-purple-100 to-green-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-green-900/30 -z-10 rounded-full"></div>

                 {WORKFLOW_STEPS.map((step) => (
                    <div key={step.id} className="relative flex flex-col items-center text-center group">
                       <div className={`w-24 h-24 rounded-full ${step.color} flex items-center justify-center shadow-lg ${step.shadow} mb-8 border-8 border-white dark:border-slate-950 z-10 transition-transform group-hover:scale-110 duration-300`}>
                          {step.icon}
                       </div>
                       <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 w-full border border-slate-100 dark:border-slate-800 h-full hover:shadow-xl transition-shadow duration-300 hover:border-blue-100 dark:hover:border-slate-700">
                          <div className="inline-block px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-500 dark:text-slate-400 mb-5">
                             STEP 0{step.id}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{step.title}</h3>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                            {step.description}
                          </p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-slate-50 dark:bg-slate-900 py-24 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
               <div className="text-center md:text-left">
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Success Stories</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Trusted by over 5,000 real estate professionals.</p>
               </div>
               <div className="hidden md:block h-1 w-32 bg-accent rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t) => (
                <div key={t.id} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="mb-6">
                    <Quote className="text-blue-100 dark:text-blue-900/50 h-10 w-10 fill-current" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-8 font-medium leading-relaxed min-h-[72px]">"{t.quote}"</p>
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-50 dark:border-slate-700">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-50 dark:ring-slate-700" />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.role}, {t.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-[#F0F9FF] dark:bg-slate-950 pt-20 pb-10 relative overflow-hidden mt-auto border-t border-blue-100 dark:border-slate-800 transition-colors duration-200">
        {/* Decorative Background Illustration (Simulated) */}
        <div className="absolute bottom-0 right-0 opacity-30 dark:opacity-10 pointer-events-none text-blue-200 dark:text-blue-900">
            <svg width="400" height="300" viewBox="0 0 400 300" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 300 L100 200 L150 300 Z" /> 
                <path d="M120 300 L200 150 L280 300 Z" />
                <path d="M250 300 L320 180 L390 300 Z" />
                <circle cx="350" cy="100" r="30" fill="#BAE6FD" />
                <rect x="0" y="280" width="400" height="20" />
            </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Top Row: Logo and Socials */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-2xl">
                    <Building2 className="text-accent h-8 w-8" />
                    <span>EstateFlow</span>
                </div>
                <div className="flex items-center gap-6 text-blue-400">
                    <a href="#" className="hover:text-accent transition-colors"><Facebook size={20} /></a>
                    <a href="#" className="hover:text-accent transition-colors"><Twitter size={20} /></a>
                    <a href="#" className="hover:text-accent transition-colors"><Instagram size={20} /></a>
                    <a href="#" className="hover:text-accent transition-colors"><Youtube size={20} /></a>
                </div>
            </div>

            {/* Middle Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                {/* Column 1: Description */}
                <div className="lg:col-span-5 text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                    <p className="mb-6">
                        EstateFlow is the leading Real Estate CRM platform. We bridge the gap between properties and people, helping you manage listings, nurture leads, and close deals efficiently.
                    </p>
                </div>

                {/* Column 2: Links */}
                <div className="lg:col-span-2">
                    <ul className="space-y-4 text-slate-600 dark:text-slate-400 font-medium text-sm">
                        <li><a href="#" className="hover:text-accent transition-colors">Home</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Properties Listing</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
                        <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
                    </ul>
                </div>

                {/* Column 3: Search */}
                <div className="lg:col-span-5">
                    <div className="flex shadow-sm rounded-full overflow-hidden bg-white dark:bg-slate-800 max-w-md ml-auto lg:mr-0 mr-auto border border-transparent dark:border-slate-700">
                        <input 
                            type="text" 
                            placeholder="Search properties..." 
                            className="flex-grow px-6 py-3 text-sm text-slate-700 dark:text-slate-200 bg-transparent focus:outline-none"
                        />
                        <button className="bg-accent hover:bg-blue-700 text-white px-8 py-3 font-medium text-sm transition-colors">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Need Help Bar */}
            <div className="bg-[#E0F2FE]/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl p-4 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 mb-16 shadow-sm border border-blue-100 dark:border-slate-800 max-w-5xl mx-auto lg:ml-0">
                <span className="text-slate-800 dark:text-slate-200 font-bold text-lg whitespace-nowrap">Need Help?</span>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <a href="tel:18005554321" className="flex items-center justify-center gap-3 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-3 rounded-full text-sm font-semibold transition-colors shadow-sm min-w-[180px]">
                        <Phone size={18} className="text-accent" />
                        1-800-555-4321
                    </a>
                    <button 
                        onClick={() => setIsChatOpen(true)}
                        className="flex items-center justify-center gap-3 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-3 rounded-full text-sm font-semibold transition-colors shadow-sm min-w-[180px]"
                    >
                        <MessageCircle size={18} className="text-accent" />
                        Live Chat
                    </button>
                    <a href="mailto:hello@estateflow.com" className="flex items-center justify-center gap-3 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-3 rounded-full text-sm font-semibold transition-colors shadow-sm min-w-[180px]">
                        <Mail size={18} className="text-accent" />
                        Email Us
                    </a>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-blue-100 dark:border-slate-800 gap-4">
                <p className="text-xs text-slate-500 dark:text-slate-500">
                    © 2023 EstateFlow. All rights reserved.
                </p>
                
                <button 
                    onClick={scrollToTop}
                    className="bg-accent hover:bg-blue-700 text-white p-3 rounded-lg shadow-lg transition-transform hover:-translate-y-1"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={20} />
                </button>
            </div>
        </div>
      </footer>

      {/* Floating Chat Launcher */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-tr from-accent to-blue-500 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group"
          aria-label="Open Live Chat"
        >
          {/* Pulse Effect */}
          <span className="absolute top-0 right-0 flex h-3 w-3 -mt-1 -mr-1">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-accent"></span>
          </span>
          <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};