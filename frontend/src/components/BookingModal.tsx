import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Sun,
  Sunrise,
  Sunset
} from 'lucide-react';
import { Doctor, AppointmentCreate } from '../types';
import { fetchDoctorSlots } from '../services/api';

interface BookingModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onConfirmBooking: (appointmentData: AppointmentCreate) => Promise<void>;
  initialSymptoms?: string;
  initialAge?: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  doctor,
  onClose,
  onConfirmBooking,
  initialSymptoms = '',
  initialAge = 30
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [mode, setMode] = useState<string>('In-Clinic');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState(initialAge);
  const [symptoms, setSymptoms] = useState(initialSymptoms);

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Generate next 7 days for the date selector
  const dateOptions = React.useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isoDate = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dates.push({ isoDate, dayName, formatted });
    }
    return dates;
  }, []);

  // Set initial date on mount
  useEffect(() => {
    if (dateOptions.length > 0 && !selectedDate) {
      setSelectedDate(dateOptions[0].isoDate);
    }
  }, [dateOptions, selectedDate]);

  // Fetch slots whenever doctor or date changes
  useEffect(() => {
    if (!doctor || !selectedDate) return;

    let isMounted = true;
    setIsLoadingSlots(true);
    setSelectedSlot('');
    setErrorMsg(null);

    fetchDoctorSlots(doctor.id, selectedDate)
      .then((res) => {
        if (!isMounted) return;
        setAvailableSlots(res.available_slots);
        setBookedSlots(res.booked_slots);
        if (res.available_slots.length > 0) {
          setSelectedSlot(res.available_slots[0]);
        }
      })
      .catch((err) => {
        console.error("Error loading slots:", err);
        if (!isMounted) return;
        setAvailableSlots(doctor.slots);
        if (doctor.slots.length > 0) setSelectedSlot(doctor.slots[0]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [doctor, selectedDate]);

  if (!doctor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMsg("Please choose an available appointment time slot.");
      return;
    }
    if (!patientName.trim() || !patientPhone.trim()) {
      setErrorMsg("Please provide your full name and mobile number.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onConfirmBooking({
        doctor_id: doctor.id,
        doctor_name: doctor.name,
        doctor_system: doctor.system,
        doctor_specialty: doctor.specialty,
        clinic_name: doctor.clinic_name,
        clinic_address: doctor.address,
        patient_name: patientName,
        patient_phone: patientPhone,
        patient_email: patientEmail || "patient@trihealth.ai",
        patient_age: patientAge,
        appointment_date: selectedDate,
        appointment_time: selectedSlot,
        consultation_mode: mode,
        symptoms: symptoms,
        consultation_fee: doctor.consultation_fee
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to confirm appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] transition-colors">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <img
              src={doctor.image_url}
              alt={doctor.name}
              className="w-13 h-13 rounded-2xl object-cover border-2 border-teal-500/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">{doctor.name}</h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40">
                  {doctor.system}
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate max-w-sm">
                {doctor.specialty} • {doctor.clinic_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6 overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Date Selector */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Step 1: Choose Appointment Date</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {dateOptions.map((item) => {
                const isSelected = selectedDate === item.isoDate;
                return (
                  <button
                    key={item.isoDate}
                    type="button"
                    onClick={() => setSelectedDate(item.isoDate)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/30 scale-[1.03]'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                  >
                    <span className="block text-[10px] font-bold opacity-80">{item.dayName}</span>
                    <span className="block text-xs font-black">{item.formatted}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Slot Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Step 2: Select Time Slot</span>
              </label>
              {isLoadingSlots && (
                <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold animate-pulse">Checking live availability...</span>
              )}
            </div>

            {availableSlots.length === 0 && !isLoadingSlots ? (
              <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200 dark:border-amber-800">
                All slots are booked for this day. Please select another date above.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {doctor.slots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = selectedSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 px-2 rounded-2xl text-xs font-black border transition-all ${
                        isBooked
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-700 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/30'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-slate-750'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Consultation Mode */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Step 3: Consultation Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('In-Clinic')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  mode === 'In-Clinic'
                    ? 'border-teal-600 bg-teal-50/80 dark:bg-teal-950/50 text-teal-950 dark:text-teal-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs sm:text-sm">In-Clinic Visit</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{doctor.clinic_name}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('Video Consultation')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  mode === 'Video Consultation'
                    ? 'border-teal-600 bg-teal-50/80 dark:bg-teal-950/50 text-teal-950 dark:text-teal-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Video className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs sm:text-sm">Online Video Call</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Telehealth link via SMS & Pass</div>
                </div>
              </button>
            </div>
          </div>

          {/* 4. Patient Information */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Step 4: Patient Information
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Age</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={patientAge}
                  onChange={(e) => setPatientAge(parseInt(e.target.value) || 30)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Chief Symptoms for Doctor</label>
              <textarea
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Brief notes about your concerns..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Fee & Confirmation Summary */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span>Appointment:</span>
              <span className="font-extrabold text-teal-700 dark:text-teal-400">
                {selectedDate} at {selectedSlot || 'Select a slot'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-sm font-black text-slate-900 dark:text-white">Consultation Fee:</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">₹{doctor.consultation_fee}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !selectedSlot}
              className="w-full py-4 px-6 rounded-2xl font-black text-white text-sm bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 shadow-xl shadow-teal-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Confirming Slot...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Appointment Slot</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
