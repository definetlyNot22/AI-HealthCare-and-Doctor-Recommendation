import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SymptomChecker } from './components/SymptomChecker';
import { TriParadigmResults } from './components/TriParadigmResults';
import { DoctorList } from './components/DoctorList';
import { BookingModal } from './components/BookingModal';
import { AppointmentPass } from './components/AppointmentPass';
import { MyAppointments } from './components/MyAppointments';
import { ApiKeyModal } from './components/ApiKeyModal';

import { 
  SymptomAnalysisRequest, 
  SymptomAnalysisResponse, 
  Doctor, 
  AppointmentCreate, 
  Appointment 
} from './types';

import { 
  analyzeSymptoms, 
  fetchDoctors, 
  fetchCities, 
  bookAppointment, 
  fetchAppointments, 
  cancelAppointment, 
  checkHealth 
} from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'symptoms' | 'doctors' | 'appointments'>('symptoms');
  const [selectedCity, setSelectedCity] = useState<string>('Patna');
  const [cities, setCities] = useState<string[]>([
    "Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga",
    "Lucknow", "Varanasi", "Kanpur", "Prayagraj", "Agra", "Gorakhpur", "Noida",
    "Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Pune", 
    "Chennai", "Kolkata", "Jaipur", "Ahmedabad", "Chandigarh"
  ]);

  // Theme state (Dark / Light mode + Accent theme)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('trihealth_theme') as 'light' | 'dark') || 'light';
  });
  const [accentTheme, setAccentTheme] = useState<'emerald' | 'teal' | 'indigo'>(() => {
    return (localStorage.getItem('trihealth_accent') as 'emerald' | 'teal' | 'indigo') || 'teal';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('trihealth_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('trihealth_accent', accentTheme);
  }, [accentTheme]);

  // AI & Symptom state
  const [analysisResult, setAnalysisResult] = useState<SymptomAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastSymptoms, setLastSymptoms] = useState('');
  const [lastAge, setLastAge] = useState(30);

  // Doctor recommendations state
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<'Ayurveda' | 'Homeopathy' | 'Allopathy' | 'All'>('All');
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  // Booking & Passes state
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [confirmedPass, setConfirmedPass] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  // AI Configuration state
  const [userApiKey, setUserApiKey] = useState<string>(() => localStorage.getItem('trihealth_gemini_key') || '');
  const [isBackendKeySet, setIsBackendKeySet] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // On initial mount: load cities, health, and recent appointments
  useEffect(() => {
    fetchCities().then(setCities).catch(console.error);

    checkHealth().then((health) => {
      setIsBackendKeySet(health.gemini_api_configured);
    }).catch(console.error);

    loadAppointments();
  }, []);

  // Fetch doctors when city changes
  useEffect(() => {
    loadDoctors();
  }, [selectedCity]);

  const loadDoctors = async (systemFilter?: string) => {
    setIsLoadingDoctors(true);
    try {
      const data = await fetchDoctors({
        city: selectedCity,
        system: systemFilter || (selectedSystem !== 'All' ? selectedSystem : undefined)
      });
      setDoctors(data);
    } catch (err) {
      console.error("Failed to load doctors:", err);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  const loadAppointments = async () => {
    setIsLoadingAppointments(true);
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const handleAnalyzeSymptoms = async (request: SymptomAnalysisRequest) => {
    setIsAnalyzing(true);
    setLastSymptoms(request.symptoms);
    setLastAge(request.age);
    try {
      const response = await analyzeSymptoms({
        ...request,
        api_key: userApiKey || undefined
      });
      setAnalysisResult(response);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      alert(`Symptom analysis failed: ${err.message || 'Please check connection'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSystemAndFindDoctors = (system: 'Ayurveda' | 'Homeopathy' | 'Allopathy' | 'All') => {
    setSelectedSystem(system);
    setActiveTab('doctors');
    loadDoctors(system !== 'All' ? system : undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBooking = async (appointmentData: AppointmentCreate) => {
    const newAppointment = await bookAppointment(appointmentData);
    setBookingDoctor(null);
    setConfirmedPass(newAppointment);
    setAppointments(prev => [newAppointment, ...prev]);
  };

  const handleCancelAppointment = async (id: string) => {
    await cancelAppointment(id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
    if (confirmedPass?.id === id) {
      setConfirmedPass(null);
    }
  };

  const handleSaveApiKey = (newKey: string) => {
    setUserApiKey(newKey);
    if (newKey) {
      localStorage.setItem('trihealth_gemini_key', newKey);
    } else {
      localStorage.removeItem('trihealth_gemini_key');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'bg-mesh-dark text-slate-100' : 'bg-mesh-light text-slate-900'
    }`}>
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        cities={cities}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        isAiConfigured={isBackendKeySet || Boolean(userApiKey)}
        appointmentCount={appointments.filter(a => a.status !== 'Cancelled').length}
        theme={theme}
        setTheme={setTheme}
        accentTheme={accentTheme}
        setAccentTheme={setAccentTheme}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 pb-16">
        {activeTab === 'symptoms' && (
          <>
            {!analysisResult ? (
              <SymptomChecker
                onAnalyze={handleAnalyzeSymptoms}
                isLoading={isAnalyzing}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                cities={cities}
              />
            ) : (
              <TriParadigmResults
                data={analysisResult}
                onSelectSystem={handleSelectSystemAndFindDoctors}
                onReset={() => setAnalysisResult(null)}
                city={selectedCity}
              />
            )}
          </>
        )}

        {activeTab === 'doctors' && (
          <DoctorList
            doctors={doctors}
            selectedSystem={selectedSystem}
            setSelectedSystem={(sys) => {
              setSelectedSystem(sys);
              loadDoctors(sys !== 'All' ? sys : undefined);
            }}
            selectedCity={selectedCity}
            onBookDoctor={(doc) => setBookingDoctor(doc)}
            isLoading={isLoadingDoctors}
          />
        )}

        {activeTab === 'appointments' && (
          <MyAppointments
            appointments={appointments}
            onCancelAppointment={handleCancelAppointment}
            onViewPass={(apt) => setConfirmedPass(apt)}
            onBookNew={() => setActiveTab('doctors')}
            isLoading={isLoadingAppointments}
          />
        )}
      </main>

      {/* Slot Booking Modal */}
      {bookingDoctor && (
        <BookingModal
          doctor={bookingDoctor}
          onClose={() => setBookingDoctor(null)}
          onConfirmBooking={handleConfirmBooking}
          initialSymptoms={lastSymptoms}
          initialAge={lastAge}
        />
      )}

      {/* Digital Appointment Pass Modal */}
      {confirmedPass && (
        <AppointmentPass
          appointment={confirmedPass}
          onClose={() => setConfirmedPass(null)}
          onViewAllBookings={() => {
            setConfirmedPass(null);
            setActiveTab('appointments');
          }}
        />
      )}

      {/* API Key / Engine Settings Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={userApiKey}
        onSaveApiKey={handleSaveApiKey}
        isBackendKeySet={isBackendKeySet}
      />

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 py-10 px-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-3 transition-colors">
        <div className="flex items-center justify-center gap-2 font-black text-slate-800 dark:text-white text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
          <span>TriHealth AI • Integrative Healthcare & Doctor Recommendation Ecosystem</span>
        </div>
        <p className="max-w-xl mx-auto leading-relaxed text-slate-500 dark:text-slate-400">
          Unifying the ancient wisdom of <strong>🌿 Ayurveda</strong>, the gentle constitutional totality of <strong>💧 Homeopathy</strong>, and the modern diagnostic precision of <strong>🔬 Allopathy</strong> across Bihar, Uttar Pradesh, and India&apos;s leading medical centers.
        </p>
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
          <span>78+ Verified Specialists</span>
          <span>•</span>
          <span>22 Cities Covered</span>
          <span>•</span>
          <span>Live Slot Telehealth & In-Clinic</span>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} TriHealth AI. For life-threatening medical emergencies, please dial emergency services (112 / 108) immediately.
        </p>
      </footer>
    </div>
  );
};

export default App;
