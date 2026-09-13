import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  Video, 
  User, 
  Phone, 
  Trash2, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  Plus 
} from 'lucide-react';
import { Appointment } from '../types';

interface MyAppointmentsProps {
  appointments: Appointment[];
  onCancelAppointment: (id: string) => Promise<void>;
  onViewPass: (appointment: Appointment) => void;
  onBookNew: () => void;
  isLoading: boolean;
}

export const MyAppointments: React.FC<MyAppointmentsProps> = ({
  appointments,
  onCancelAppointment,
  onViewPass,
  onBookNew,
  isLoading
}) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [filterPhone, setFilterPhone] = useState('');

  const filtered = appointments.filter(apt => {
    if (!filterPhone.trim()) return true;
    return apt.patient_phone.includes(filterPhone.trim()) || apt.booking_ref.toLowerCase().includes(filterPhone.toLowerCase().trim());
  });

  const handleCancel = async (id: string, ref: string) => {
    if (window.confirm(`Are you sure you want to cancel appointment ${ref}?`)) {
      setCancellingId(id);
      try {
        await onCancelAppointment(id);
      } finally {
        setCancellingId(null);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Bookings & Consultations
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            Manage your doctor appointments, view confirmed digital passes, and track consultation schedules.
          </p>
        </div>

        <button
          onClick={onBookNew}
          className="py-3 px-5 rounded-2xl text-xs font-black text-white bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-600/25 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Consultation</span>
        </button>
      </div>

      {/* Filter by Phone or Ref */}
      {appointments.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 max-w-md shadow-xs">
          <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 ml-1" />
          <input
            type="text"
            value={filterPhone}
            onChange={(e) => setFilterPhone(e.target.value)}
            placeholder="Filter by phone number or booking ref..."
            className="w-full text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent focus:outline-hidden"
          />
        </div>
      )}

      {/* Appointment Cards List */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Loading your consultations...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto border border-teal-200/50 dark:border-teal-800/40">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">No appointments found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              You haven&apos;t booked any doctor appointments yet, or no bookings match your search.
            </p>
          </div>
          <button
            onClick={onBookNew}
            className="py-2.5 px-5 rounded-xl font-black text-xs text-white bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-700 transition-colors shadow-md"
          >
            Find a Doctor & Book Slot
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((apt) => {
            const isCancelled = apt.status === 'Cancelled';

            return (
              <div
                key={apt.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border p-6 sm:p-7 shadow-sm transition-all ${
                  isCancelled
                    ? 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50 dark:bg-slate-850'
                    : 'border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 hover:shadow-xl'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 font-black text-base shrink-0 shadow-2xs">
                      {apt.doctor_system === 'Ayurveda' ? '🌿' : apt.doctor_system === 'Homeopathy' ? '💧' : '🔬'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 dark:text-white text-base">{apt.doctor_name}</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                          {apt.doctor_system}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {apt.doctor_specialty} • {apt.clinic_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-mono font-black text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      {apt.booking_ref}
                    </span>
                    {isCancelled ? (
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 px-3 py-1 rounded-xl flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Cancelled
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-xl flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 dark:text-slate-500 font-medium block">Appointment Time</span>
                    <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{apt.appointment_date}</span>
                    </div>
                    <div className="font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{apt.appointment_time}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 dark:text-slate-500 font-medium block">Consultation Type</span>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {apt.consultation_mode === 'In-Clinic' ? (
                        <Building2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      ) : (
                        <Video className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      )}
                      <span>{apt.consultation_mode}</span>
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 block font-semibold">Fee: ₹{apt.consultation_fee}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 dark:text-slate-500 font-medium block">Patient Info</span>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{apt.patient_name} ({apt.patient_age} yrs)</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.patient_phone}</span>
                    </div>
                  </div>
                </div>

                {/* Address & Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate max-w-md font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{apt.clinic_address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewPass(apt)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <QrCode className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>View Pass</span>
                    </button>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancel(apt.id, apt.booking_ref)}
                        disabled={cancellingId === apt.id}
                        className="px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 font-bold text-xs transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{cancellingId === apt.id ? 'Cancelling...' : 'Cancel'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
