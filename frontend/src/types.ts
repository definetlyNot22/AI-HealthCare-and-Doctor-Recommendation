export interface SymptomAnalysisRequest {
  symptoms: string;
  age: number;
  gender: string;
  duration: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  city: string;
  api_key?: string;
}

export interface HerbalRemedy {
  name: string;
  sanskrit_name?: string;
  purpose: string;
  dosage: string;
  form: string;
}

export interface AyurvedaRecommendation {
  dosha_imbalance: string;
  dosha_breakdown: { [key: string]: number };
  herbal_remedies: HerbalRemedy[];
  dietary_guidelines: string[];
  lifestyle_guidelines: string[];
  recommended_therapies: string[];
  expected_timeline: string;
  philosophy: string;
  specialist_type: string;
}

export interface HomeopathicRemedy {
  name: string;
  potency: string;
  key_indication: string;
  dosage: string;
}

export interface HomeopathyRecommendation {
  constitutional_type: string;
  totality_of_symptoms: string;
  remedies: HomeopathicRemedy[];
  lifestyle_precautions: string[];
  mode_of_action: string;
  expected_timeline: string;
  philosophy: string;
  specialist_type: string;
}

export interface MedicationClass {
  drug_class: string;
  common_examples: string;
  role: string;
}

export interface AllopathyRecommendation {
  probable_diagnosis: string;
  clinical_summary: string;
  diagnostic_tests: string[];
  conventional_medications: MedicationClass[];
  red_flags: string[];
  lifestyle_advice: string[];
  expected_timeline: string;
  philosophy: string;
  specialist_type: string;
}

export interface ComparisonSummary {
  speed_of_relief: { [system: string]: string };
  root_cause_focus: { [system: string]: string };
  side_effect_profile: { [system: string]: string };
  lifestyle_dependency: { [system: string]: string };
  approx_cost_level: { [system: string]: string };
}

export interface SymptomAnalysisResponse {
  symptom_summary: string;
  severity_assessment: string;
  ayurveda: AyurvedaRecommendation;
  homeopathy: HomeopathyRecommendation;
  allopathy: AllopathyRecommendation;
  comparison: ComparisonSummary;
  generated_by: string;
}

export interface Doctor {
  id: string;
  name: string;
  system: 'Ayurveda' | 'Homeopathy' | 'Allopathy';
  specialty: string;
  degrees: string;
  experience_years: number;
  rating: number;
  review_count: number;
  clinic_name: string;
  address: string;
  city: string;
  distance_km: number;
  consultation_fee: number;
  available_today: boolean;
  available_modes: string[];
  image_url: string;
  match_score: number;
  match_reason: string;
  slots: string[];
  phone?: string;
}

export interface AppointmentCreate {
  doctor_id: string;
  doctor_name: string;
  doctor_system: string;
  doctor_specialty: string;
  clinic_name: string;
  clinic_address: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  patient_age: number;
  appointment_date: string;
  appointment_time: string;
  consultation_mode: string;
  symptoms?: string;
  consultation_fee: number;
}

export interface Appointment extends AppointmentCreate {
  id: string;
  booking_ref: string;
  status: string;
  created_at: string;
  qr_code_data: string;
}
