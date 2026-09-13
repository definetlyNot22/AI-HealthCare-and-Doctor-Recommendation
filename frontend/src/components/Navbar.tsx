import React from 'react';
import { 
  Stethoscope, 
  MapPin, 
  Sparkles, 
  Calendar, 
  Key, 
  AlertCircle, 
  Sun, 
  Moon,
  Palette
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'symptoms' | 'doctors' | 'appointments';
  setActiveTab: (tab: 'symptoms' | 'doctors' | 'appointments') => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cities: string[];
  onOpenApiKeyModal: () => void;
  isAiConfigured: boolean;
  appointmentCount: number;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  accentTheme: 'emerald' | 'teal' | 'indigo';
  setAccentTheme: (accent: 'emerald' | 'teal' | 'indigo') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCity,
  setSelectedCity,
  cities,
  onOpenApiKeyModal,
  isAiConfigured,
  appointmentCount,
  theme,
  setTheme,
  accentTheme,
  setAccentTheme,
}) => {
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const getAccentBtnClass = () => {
    if (accentTheme === 'emerald') return 'bg-emerald-600 shadow-emerald-600/30 text-white';
    if (accentTheme === 'indigo') return 'bg-indigo-600 shadow-indigo-600/30 text-white';
    return 'bg-teal-600 shadow-teal-600/30 text-white';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300 shadow-xs">
      {/* Emergency Notice Ribbon */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-medium text-slate-300">TriHealth AI • Integrative Medical Protocol (Ayurveda + Homeopathy + Allopathy)</span>
          </span>
          <div className="flex items-center gap-3 sm:gap-5 text-slate-300">
            <span className="hidden md:flex items-center gap-1 text-rose-400 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> Emergency Helpline: 112 / 108
            </span>

            {/* Accent color picker */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700">
              <span className="text-[10px] text-slate-400 font-medium hidden lg:inline">Accent:</span>
              <button
                onClick={() => setAccentTheme('emerald')}
                className={`w-3.5 h-3.5 rounded-full bg-emerald-500 transition-transform ${accentTheme === 'emerald' ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                title="Emerald Herbal Theme"
              />
              <button
                onClick={() => setAccentTheme('teal')}
                className={`w-3.5 h-3.5 rounded-full bg-teal-500 transition-transform ${accentTheme === 'teal' ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                title="Teal Vitality Theme"
              />
              <button
                onClick={() => setAccentTheme('indigo')}
                className={`w-3.5 h-3.5 rounded-full bg-indigo-500 transition-transform ${accentTheme === 'indigo' ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                title="Indigo Clinical Theme"
              />
            </div>

            <button 
              onClick={onOpenApiKeyModal}
              className="hover:text-white flex items-center gap-1 transition-colors text-slate-400 hover:text-slate-200 text-[11px]"
              title="AI Engine Settings"
            >
              <Key className="w-3 h-3 text-teal-400" />
              <span>AI Engine</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('symptoms')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
            <Stethoscope className="w-5 h-5 text-white drop-shadow-xs" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-teal-800 to-slate-900 dark:from-white dark:via-teal-300 dark:to-slate-200 bg-clip-text text-transparent">
                TriHealth
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-300/40 uppercase tracking-widest shadow-2xs">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Ayurveda • Homeopathy • Allopathy
            </p>
          </div>
        </div>

        {/* City Selector Pill */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-full px-3 py-1.5 transition-all border border-slate-200/80 dark:border-slate-700 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 mr-1.5 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer pr-1"
            >
              <optgroup label="Bihar" className="font-bold text-teal-800 bg-slate-50 dark:bg-slate-900">
                <option value="Patna">Patna (पटना)</option>
                <option value="Gaya">Gaya (गया)</option>
                <option value="Muzaffarpur">Muzaffarpur (मुजफ्फरपुर)</option>
                <option value="Bhagalpur">Bhagalpur (भागलपुर)</option>
                <option value="Darbhanga">Darbhanga (दरभंगा)</option>
              </optgroup>
              <optgroup label="Uttar Pradesh (UP)" className="font-bold text-indigo-800 bg-slate-50 dark:bg-slate-900">
                <option value="Lucknow">Lucknow (लखनऊ)</option>
                <option value="Varanasi">Varanasi / Kashi (वाराणसी)</option>
                <option value="Kanpur">Kanpur (कानपुर)</option>
                <option value="Prayagraj">Prayagraj (प्रयागराज)</option>
                <option value="Agra">Agra (आगरा)</option>
                <option value="Gorakhpur">Gorakhpur (गोरखपुर)</option>
                <option value="Noida">Noida (नोएडा)</option>
              </optgroup>
              <optgroup label="Other Metros" className="font-bold text-slate-700 bg-slate-50 dark:bg-slate-900">
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Chandigarh">Chandigarh</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Navigation Tabs & Theme Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Navigation links */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setActiveTab('symptoms')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'symptoms'
                  ? `${getAccentBtnClass()} shadow-md scale-[1.02]`
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Symptom AI</span>
            </button>

            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'doctors'
                  ? `${getAccentBtnClass()} shadow-md scale-[1.02]`
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctors</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 relative ${
                activeTab === 'appointments'
                  ? `${getAccentBtnClass()} shadow-md scale-[1.02]`
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bookings</span>
              {appointmentCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center -ml-0.5 animate-pulse">
                  {appointmentCount}
                </span>
              )}
            </button>
          </nav>

          {/* Theme Toggle Button (Light/Dark) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:scale-105 active:scale-95 transition-all shadow-2xs ml-1"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
