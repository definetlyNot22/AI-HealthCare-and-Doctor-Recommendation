import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Activity, 
  AlertCircle, 
  Leaf, 
  Droplet, 
  Cross, 
  ShieldAlert,
  Clock,
  User,
  MapPin,
  CheckCircle,
  Building,
  Users
} from 'lucide-react';
import { SymptomAnalysisRequest } from '../types';

interface SymptomCheckerProps {
  onAnalyze: (request: SymptomAnalysisRequest) => void;
  isLoading: boolean;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cities: string[];
}

const QUICK_SYMPTOM_PRESETS = [
  {
    title: "Acid Reflux & Heartburn",
    symptoms: "Severe burning sensation in chest after eating, acid regurgitation in throat, and stomach bloating for 2 weeks.",
    badge: "Digestive",
    icon: "🔥"
  },
  {
    title: "Throbbing Migraine",
    symptoms: "Unilateral pulsating headache on the right temple, sensitivity to light, mild nausea, and eye strain for 5 days.",
    badge: "Neurological",
    icon: "⚡"
  },
  {
    title: "Knee Joint Pain & Stiffness",
    symptoms: "Persistent morning stiffness in both knee joints, cracking sound on stairs, and difficulty bending legs for over a month.",
    badge: "Orthopedic",
    icon: "🦴"
  },
  {
    title: "Persistent Dry Cough & Cold",
    symptoms: "Incessant dry barking cough worse at night, tickling in throat, nasal congestion, and mild fatigue for 10 days.",
    badge: "Respiratory",
    icon: "🫁"
  },
  {
    title: "Eczema & Itchy Skin Rashes",
    symptoms: "Red, dry scaly patches on elbows and neck with intense itching that worsens at night and after hot showers.",
    badge: "Dermatology",
    icon: "🌿"
  },
  {
    title: "Chronic Anxiety & Insomnia",
    symptoms: "Difficulty falling asleep, restless thoughts at night, daytime exhaustion, muscle tension in neck and shoulders.",
    badge: "Mind-Body",
    icon: "🌙"
  }
];

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({
  onAnalyze,
  isLoading,
  selectedCity,
  setSelectedCity,
  cities,
}) => {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('Male');
  const [duration, setDuration] = useState('1-2 weeks');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
    }
  }, []);

  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your symptoms.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() || symptoms.length < 5) {
      alert("Please describe your symptoms in at least a few words.");
      return;
    }

    onAnalyze({
      symptoms,
      age,
      gender,
      duration,
      severity,
      city: selectedCity,
    });
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 transition-colors duration-300">
      {/* Ambient background glow orbs */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-72 h-72 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      {/* Hero Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-700/50 text-teal-800 dark:text-teal-300 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
          <span>Integrative Tri-Paradigm Medical Intelligence</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Describe Your Health Concern,
          <br />
          <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-indigo-600 dark:from-teal-400 dark:via-emerald-300 dark:to-indigo-400 bg-clip-text text-transparent drop-shadow-xs">
            Discover 3 Healing Paradigms
          </span>
        </h1>

        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
          Share how you feel. TriHealth AI evaluates your condition across <span className="font-bold text-emerald-700 dark:text-emerald-400">Ayurveda</span>, <span className="font-bold text-teal-700 dark:text-teal-400">Homeopathy</span>, and <span className="font-bold text-blue-700 dark:text-blue-400">Allopathy</span>, then matches you with the best doctors in your city for instant slot booking.
        </p>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto pt-3">
          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 backdrop-blur-md shadow-2xs">
            <div className="text-lg font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> 3 Systems
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Ayurveda • Homeo • Allopath</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 backdrop-blur-md shadow-2xs">
            <div className="text-lg font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
              <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" /> 22 Cities
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Bihar, UP & Metro Hubs</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 backdrop-blur-md shadow-2xs">
            <div className="text-lg font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> 78+ Doctors
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Verified & Available</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 backdrop-blur-md shadow-2xs">
            <div className="text-lg font-black text-teal-600 dark:text-teal-400 flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4" /> Live Slots
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Instant Digital Passes</div>
          </div>
        </div>
      </div>

      {/* Main Form Glass Card */}
      <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-slate-950/60 border border-slate-200/90 dark:border-slate-800 overflow-hidden backdrop-blur-xl transition-all">
        {/* Card Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base tracking-tight block">AI Clinical Triage Intake</span>
              <span className="text-[10px] text-slate-400 block">Personalized Holistic Analysis</span>
            </div>
          </div>
          <span className="text-xs text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-400" /> Target: <strong>{selectedCity}</strong>
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Symptoms Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="symptoms" className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>What health concerns or symptoms are you experiencing?</span>
                <span className="text-rose-500">*</span>
              </label>

              {speechSupported && (
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all ${
                    isListening 
                      ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300/60 dark:border-slate-700'
                  }`}
                  title="Speak your symptoms aloud"
                >
                  {isListening ? (
                    <>
                      <div className="flex items-center gap-0.5 h-4">
                        <span className="w-1 bg-white soundwave-bar rounded-full"></span>
                        <span className="w-1 bg-white soundwave-bar rounded-full"></span>
                        <span className="w-1 bg-white soundwave-bar rounded-full"></span>
                        <span className="w-1 bg-white soundwave-bar rounded-full"></span>
                      </div>
                      <span>Listening...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Voice Input</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="relative">
              <textarea
                id="symptoms"
                rows={4}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Example: I've had severe acidity, burning chest sensation after dinner, and sour regurgitation for 2 weeks. It worsens when I lie down..."
                className="w-full px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-sm leading-relaxed shadow-inner"
                required
              />
            </div>
          </div>

          {/* Quick Symptom Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Or Choose a Common Health Pattern:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {QUICK_SYMPTOM_PRESETS.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => setSymptoms(preset.symptoms)}
                  className="text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:border-teal-400 dark:hover:border-teal-500 text-slate-700 dark:text-slate-300 hover:text-teal-900 dark:hover:text-teal-200 transition-all text-left flex items-start gap-2 group shadow-2xs"
                >
                  <span className="text-base shrink-0 group-hover:scale-110 transition-transform">{preset.icon}</span>
                  <div className="min-w-0">
                    <div className="font-bold truncate">{preset.title}</div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{preset.badge}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Patient Context Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Age */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Patient Age
              </label>
              <input
                type="number"
                min={1}
                max={110}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 30)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value="Few days (1-3 days)">Few days (1-3 days)</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="1-3 months">1-3 months</option>
                <option value="Chronic (> 6 months)">Chronic (&gt; 6 months)</option>
              </select>
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> City / Location
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <optgroup label="Bihar" className="font-bold text-teal-700">
                  <option value="Patna">Patna (पटना)</option>
                  <option value="Gaya">Gaya (गया)</option>
                  <option value="Muzaffarpur">Muzaffarpur (मुजफ्फरपुर)</option>
                  <option value="Bhagalpur">Bhagalpur (भागलपुर)</option>
                  <option value="Darbhanga">Darbhanga (दरभंगा)</option>
                </optgroup>
                <optgroup label="Uttar Pradesh (UP)" className="font-bold text-indigo-700">
                  <option value="Lucknow">Lucknow (लखनऊ)</option>
                  <option value="Varanasi">Varanasi / Kashi (वाराणसी)</option>
                  <option value="Kanpur">Kanpur (कानपुर)</option>
                  <option value="Prayagraj">Prayagraj (प्रयागराज)</option>
                  <option value="Agra">Agra (आगरा)</option>
                  <option value="Gorakhpur">Gorakhpur (गोरखपुर)</option>
                  <option value="Noida">Noida (नोएडा)</option>
                </optgroup>
                <optgroup label="Other Metros">
                  {cities.filter(c => !["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Lucknow", "Varanasi", "Kanpur", "Prayagraj", "Agra", "Gorakhpur", "Noida"].includes(c)).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Severity Radio Buttons */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Symptom Severity Level:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Mild', 'Moderate', 'Severe'] as const).map((level) => {
                const isSelected = severity === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSeverity(level)}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? level === 'Mild'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30 scale-[1.02]'
                          : level === 'Moderate'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/30 scale-[1.02]'
                          : 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30 scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                  >
                    <span>{level === 'Mild' ? '🟢' : level === 'Moderate' ? '🟡' : '🔴'}</span>
                    <span>{level}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl font-black text-white text-base bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 shadow-xl shadow-teal-600/25 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>TriHealth AI is Analyzing Symptoms Across 3 Paradigms...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Analyze Health Problem & Compare 3 Paradigms</span>
                </>
              )}
            </button>
          </div>

          {/* Disclaimer */}
          <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-normal">
              <strong>Medical Disclaimer:</strong> TriHealth AI provides clinical comparative insights across Ayurveda, Homeopathy, and Allopathy to assist doctor matching. In cases of severe emergency, contact local emergency services (112 / 108) immediately.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
