import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Download, 
  Printer, 
  ArrowRight,
  Building2,
  Video,
  QrCode,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentPassProps {
  appointment: Appointment;
  onClose: () => void;
  onViewAllBookings: () => void;
}

export const AppointmentPass: React.FC<AppointmentPassProps> = ({
  appointment,
  onClose,
  onViewAllBookings,
}) => {
  useEffect(() => {
    // Trigger celebratory confetti burst
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadIcs = () => {
    const startTime = appointment.appointment_time.replace(/[^0-9:]/g, '');
    const dateFormatted = appointment.appointment_date.replace(/-/g, '');
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TriHealth AI//Doctor Appointment//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${appointment.booking_ref}@trihealth.ai
SUMMARY:Doctor Appointment with ${appointment.doctor_name} (${appointment.doctor_system})
DESCRIPTION:Consultation with ${appointment.doctor_name} at ${appointment.clinic_name}. Mode: ${appointment.consultation_mode}. Booking Ref: ${appointment.booking_ref}
LOCATION:${appointment.clinic_address}
DTSTART:${dateFormatted}T090000Z
DTEND:${dateFormatted}T094500Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `appointment_${appointment.booking_ref}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
        {/* Pass Top Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-6 text-white text-center space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
          <div className="w-13 h-13 rounded-full bg-white text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/20">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Appointment Confirmed!</h2>
          <p className="text-xs text-teal-100 font-medium">
            Your consultation slot is officially reserved with {appointment.doctor_name}.
          </p>
        </div>

        {/* Digital Boarding Pass Ticket Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Reference & QR Header */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                Booking Reference
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-wider">
                {appointment.booking_ref}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Confirmed & Active
              </span>
            </div>

            {/* Digital QR Badge */}
            <div className="w-16 h-16 bg-white dark:bg-slate-700 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-600 shadow-xs flex flex-col items-center justify-center text-center">
              <QrCode className="w-10 h-10 text-slate-900 dark:text-white" />
              <span className="text-[8px] font-mono text-slate-500 dark:text-slate-300 font-bold">DIGITAL PASS</span>
            </div>
          </div>

          {/* Ticket Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 dark:text-slate-500 font-medium block">Doctor</span>
              <span className="font-extrabold text-slate-900 dark:text-white block text-sm">{appointment.doctor_name}</span>
              <span className="text-teal-700 dark:text-teal-400 font-semibold block">{appointment.doctor_system} • {appointment.doctor_specialty}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 dark:text-slate-500 font-medium block">Consultation Mode</span>
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1 text-sm">
                {appointment.consultation_mode === 'In-Clinic' ? (
                  <>
                    <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>In-Clinic Visit</span>
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Video Consultation</span>
                  </>
                )}
              </div>
              <span className="text-slate-500 dark:text-slate-400 block font-semibold">Fee: ₹{appointment.consultation_fee}</span>
            </div>

            <div className="space-y-1 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 dark:text-slate-500 font-medium block">Date & Time</span>
              <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{appointment.appointment_date}</span>
              </div>
              <div className="font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{appointment.appointment_time}</span>
              </div>
            </div>

            <div className="space-y-1 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 dark:text-slate-500 font-medium block">Patient Name</span>
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1 text-sm">
                <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{appointment.patient_name} ({appointment.patient_age} yrs)</span>
              </div>
              <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{appointment.patient_phone}</span>
              </div>
            </div>
          </div>

          {/* Clinic Address */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Clinic Address:
            </span>
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              {appointment.clinic_name}, {appointment.clinic_address}
            </p>
          </div>

          {/* Pre-consult instructions */}
          <div className="text-[11px] text-teal-900 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 p-3.5 rounded-2xl border border-teal-100 dark:border-teal-800/60 space-y-0.5">
            <strong className="block font-bold">Pre-Consultation Instructions:</strong>
            <p className="leading-normal">
              Please arrive 10-15 minutes prior to your slot. Bring past medical prescriptions, blood tests, or diagnostic scans with you.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleDownloadIcs}
              className="flex-1 py-3 px-3 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Save to Calendar</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-3 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Print Slip</span>
            </button>
          </div>

          <div>
            <button
              onClick={onViewAllBookings}
              className="w-full py-3.5 px-4 rounded-2xl font-black text-white text-xs sm:text-sm bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <span>View in My Bookings Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
