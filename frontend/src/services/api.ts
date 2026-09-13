import {
  SymptomAnalysisRequest,
  SymptomAnalysisResponse,
  Doctor,
  AppointmentCreate,
  Appointment
} from '../types';

const BASE_URL = '/api';

export async function checkHealth(): Promise<{ status: string; gemini_api_configured: boolean; total_doctors: number }> {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    console.error('Health check error:', err);
    return { status: 'offline', gemini_api_configured: false, total_doctors: 0 };
  }
}

export async function fetchCities(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/cities`);
    if (!res.ok) throw new Error('Failed to fetch cities');
    return await res.json();
  } catch (err) {
    console.error('Failed to load cities, using fallback:', err);
    return [
      "Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga",
      "Lucknow", "Varanasi", "Kanpur", "Prayagraj", "Agra", "Gorakhpur", "Noida",
      "Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Pune", "Chennai", "Kolkata", "Jaipur", "Ahmedabad", "Chandigarh"
    ];
  }
}

export async function analyzeSymptoms(request: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse> {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Analysis failed' }));
    throw new Error(errorData.detail || 'Failed to analyze symptoms');
  }

  return await res.json();
}

export interface DoctorFilterParams {
  city?: string;
  system?: string;
  specialty?: string;
  mode?: string;
  sort_by?: string;
  search?: string;
}

export async function fetchDoctors(params: DoctorFilterParams = {}): Promise<Doctor[]> {
  const url = new URL(`${window.location.origin}${BASE_URL}/doctors`);
  if (params.city) url.searchParams.set('city', params.city);
  if (params.system) url.searchParams.set('system', params.system);
  if (params.specialty) url.searchParams.set('specialty', params.specialty);
  if (params.mode) url.searchParams.set('mode', params.mode);
  if (params.sort_by) url.searchParams.set('sort_by', params.sort_by);
  if (params.search) url.searchParams.set('search', params.search);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch doctor recommendations');
  return await res.json();
}

export async function fetchDoctorSlots(doctorId: string, date: string): Promise<{ all_slots: string[]; booked_slots: string[]; available_slots: string[] }> {
  const res = await fetch(`${BASE_URL}/doctors/${doctorId}/slots?date=${encodeURIComponent(date)}`);
  if (!res.ok) throw new Error('Failed to fetch available slots');
  return await res.json();
}

export async function bookAppointment(data: AppointmentCreate): Promise<Appointment> {
  const res = await fetch(`${BASE_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Failed to book slot' }));
    throw new Error(errorData.detail || 'Slot booking failed');
  }

  return await res.json();
}

export async function fetchAppointments(phone?: string): Promise<Appointment[]> {
  let url = `${BASE_URL}/appointments`;
  if (phone) url += `?phone=${encodeURIComponent(phone)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return await res.json();
}

export async function cancelAppointment(appointmentId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/appointments/${appointmentId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to cancel appointment');
}
