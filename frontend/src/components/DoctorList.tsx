import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  ShieldCheck, 
  Video, 
  Building2, 
  Calendar, 
  Sparkles, 
  ArrowUpDown, 
  Filter, 
  CheckCircle,
  BadgeCheck
} from 'lucide-react';
import { Doctor } from '../types';

interface DoctorListProps {
  doctors: Doctor[];
  selectedSystem: 'Ayurveda' | 'Homeopathy' | 'Allopathy' | 'All';
  setSelectedSystem: (system: 'Ayurveda' | 'Homeopathy' | 'Allopathy' | 'All') => void;
  selectedCity: string;
  onBookDoctor: (doctor: Doctor) => void;
  isLoading: boolean;
}

export const DoctorList: React.FC<DoctorListProps> = ({
  doctors,
  selectedSystem,
  setSelectedSystem,
  selectedCity,
  onBookDoctor,
  isLoading
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<'All' | 'In-Clinic' | 'Video Consultation'>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'fee'>('rating');

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      // System filter
      if (selectedSystem !== 'All' && doc.system.toLowerCase() !== selectedSystem.toLowerCase()) {
        return false;
      }
      // Mode filter
      if (selectedMode !== 'All' && !doc.available_modes.includes(selectedMode)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          doc.name.toLowerCase().includes(q) ||
          doc.specialty.toLowerCase().includes(q) ||
          doc.clinic_name.toLowerCase().includes(q) ||
          doc.address.toLowerCase().includes(q) ||
          doc.match_reason.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'distance') return a.distance_km - b.distance_km;
      if (sortBy === 'fee') return a.consultation_fee - b.consultation_fee;
      return b.rating - a.rating;
    });
  }, [doctors, selectedSystem, selectedMode, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-700/50 text-xs font-bold mb-2 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Geo-Targeted Medical Specialists in {selectedCity}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Recommended Doctors & Specialists
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            Browse verified medical practitioners in {selectedCity} and book an appointment slot instantly.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 self-start md:self-auto">
          Showing <strong className="text-teal-600 dark:text-teal-400">{filteredDoctors.length}</strong> verified doctors
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-4">
        {/* System Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedSystem('All')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                selectedSystem === 'All'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Traditions
            </button>
            <button
              onClick={() => setSelectedSystem('Ayurveda')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedSystem === 'Ayurveda'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900'
              }`}
            >
              <span>🌿 Ayurveda</span>
            </button>
            <button
              onClick={() => setSelectedSystem('Homeopathy')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedSystem === 'Homeopathy'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900'
              }`}
            >
              <span>💧 Homeopathy</span>
            </button>
            <button
              onClick={() => setSelectedSystem('Allopathy')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedSystem === 'Allopathy'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900'
              }`}
            >
              <span>🔬 Allopathy</span>
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400 font-bold">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-800 dark:text-slate-200 font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="rating">Top Rated (4.8+)</option>
              <option value="distance">Nearest Distance (km)</option>
              <option value="fee">Lowest Consultation Fee</option>
            </select>
          </div>
        </div>

        {/* Search & Mode Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctor by name, clinic, medical specialty, or hospital..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedMode}
              onChange={(e: any) => setSelectedMode(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Visit Modes</option>
              <option value="In-Clinic">In-Clinic Visit Only</option>
              <option value="Video Consultation">Video Call Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {isLoading ? (
        <div className="text-center py-20 space-y-3">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Locating specialists in {selectedCity}...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
          <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">No specialists found matching filters</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try resetting your search query or selecting &quot;All Traditions&quot; to see doctors across all medical systems in {selectedCity}.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSystem('All');
              setSelectedMode('All');
            }}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-600/20"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => {
            const isAyurveda = doc.system === 'Ayurveda';
            const isHomeo = doc.system === 'Homeopathy';
            const badgeColor = isAyurveda
              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
              : isHomeo
              ? 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700'
              : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700';

            return (
              <div
                key={doc.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-lg shadow-slate-200/40 dark:shadow-slate-950/40 hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Card Header with image & basic info */}
                  <div className="p-6 pb-3">
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={doc.image_url}
                          alt={doc.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-700 shadow-md group-hover:scale-105 transition-transform"
                        />
                        {doc.available_today && (
                          <span 
                            className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" 
                            title="Available Today"
                          />
                        )}
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${badgeColor}`}>
                            {doc.system}
                          </span>
                          <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-md">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {doc.rating}
                            <span className="text-slate-400 font-medium">({doc.review_count})</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <h3 className="font-black text-slate-900 dark:text-white text-base truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {doc.name}
                          </h3>
                          <span title="Verified Specialist">
                            <BadgeCheck className="w-4 h-4 text-teal-500 shrink-0" />
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-semibold">
                          {doc.degrees}
                        </p>
                      </div>
                    </div>

                    {/* Specialty & Experience */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 truncate">{doc.specialty}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-semibold shrink-0 ml-2">{doc.experience_years} yrs exp</span>
                    </div>

                    {/* Clinic & Distance */}
                    <div className="mt-2 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{doc.clinic_name}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
                          {doc.address}
                        </span>
                        <span className="font-bold text-teal-800 dark:text-teal-300 shrink-0 bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800/60 px-2 py-0.5 rounded-full ml-1">
                          {doc.distance_km} km away
                        </span>
                      </div>
                    </div>

                    {/* AI Match Reason Pill */}
                    {doc.match_reason && (
                      <div className="mt-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-teal-900 dark:text-teal-300 font-bold">{doc.match_score}% AI Match:</strong> {doc.match_reason}
                        </span>
                      </div>
                    )}

                    {/* Consultation Modes */}
                    <div className="mt-2.5 flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                      {doc.available_modes.includes('In-Clinic') && (
                        <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                          <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> In-Clinic Visit
                        </span>
                      )}
                      {doc.available_modes.includes('Video Consultation') && (
                        <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400">
                          <Video className="w-3 h-3 text-teal-600 dark:text-teal-400" /> Video Call
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Slot Preview */}
                  <div className="px-6 py-2.5 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> Slots:
                    </span>
                    <div className="flex gap-1.5 overflow-x-auto py-0.5">
                      {doc.slots.slice(0, 3).map((slot, sIdx) => (
                        <span key={sIdx} className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 shadow-2xs">
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action & Fee */}
                <div className="p-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-white dark:bg-slate-900">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">Fee</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">₹{doc.consultation_fee}</span>
                  </div>

                  <button
                    onClick={() => onBookDoctor(doc)}
                    className="py-2.5 px-4 rounded-2xl text-xs font-black text-white bg-teal-600 hover:bg-teal-700 active:scale-95 shadow-md shadow-teal-600/25 transition-all flex items-center gap-1.5 group-hover:bg-teal-500"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Slot</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
