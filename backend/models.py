from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SymptomAnalysisRequest(BaseModel):
    symptoms: str = Field(..., description="Detailed description of symptoms or health concerns")
    age: Optional[int] = Field(32, description="Patient age in years")
    gender: Optional[str] = Field("Prefer not to say", description="Patient gender")
    duration: Optional[str] = Field("1-2 weeks", description="How long symptoms have persisted")
    severity: Optional[str] = Field("Moderate", description="Mild, Moderate, or Severe")
    city: Optional[str] = Field("Bengaluru", description="Current city for doctor matching")
    api_key: Optional[str] = Field(None, description="Optional Gemini API key from user")

class HerbalRemedy(BaseModel):
    name: str
    sanskrit_name: Optional[str] = ""
    purpose: str
    dosage: str
    form: str = "Powder / Churna"

class AyurvedaRecommendation(BaseModel):
    dosha_imbalance: str
    dosha_breakdown: Dict[str, int] = {"Vata": 40, "Pitta": 45, "Kapha": 15}
    herbal_remedies: List[HerbalRemedy]
    dietary_guidelines: List[str]
    lifestyle_guidelines: List[str]
    recommended_therapies: List[str]
    expected_timeline: str
    philosophy: str
    specialist_type: str

class HomeopathicRemedy(BaseModel):
    name: str
    potency: str
    key_indication: str
    dosage: str

class HomeopathyRecommendation(BaseModel):
    constitutional_type: str
    totality_of_symptoms: str
    remedies: List[HomeopathicRemedy]
    lifestyle_precautions: List[str]
    mode_of_action: str
    expected_timeline: str
    philosophy: str
    specialist_type: str

class MedicationClass(BaseModel):
    drug_class: str
    common_examples: str
    role: str

class AllopathyRecommendation(BaseModel):
    probable_diagnosis: str
    clinical_summary: str
    diagnostic_tests: List[str]
    conventional_medications: List[MedicationClass]
    red_flags: List[str]
    lifestyle_advice: List[str]
    expected_timeline: str
    philosophy: str
    specialist_type: str

class ComparisonSummary(BaseModel):
    speed_of_relief: Dict[str, str]
    root_cause_focus: Dict[str, str]
    side_effect_profile: Dict[str, str]
    lifestyle_dependency: Dict[str, str]
    approx_cost_level: Dict[str, str]

class SymptomAnalysisResponse(BaseModel):
    symptom_summary: str
    severity_assessment: str
    ayurveda: AyurvedaRecommendation
    homeopathy: HomeopathyRecommendation
    allopathy: AllopathyRecommendation
    comparison: ComparisonSummary
    generated_by: str = "Clinical Intelligence Core"

class Doctor(BaseModel):
    id: str
    name: str
    system: str  # "Ayurveda" | "Homeopathy" | "Allopathy"
    specialty: str
    degrees: str
    experience_years: int
    rating: float
    review_count: int
    clinic_name: str
    address: str
    city: str
    distance_km: float
    consultation_fee: int
    available_today: bool
    available_modes: List[str]
    image_url: str
    match_score: int
    match_reason: str
    slots: List[str]
    phone: Optional[str] = "+91 98765 43210"

class AppointmentCreate(BaseModel):
    doctor_id: str
    doctor_name: str
    doctor_system: str
    doctor_specialty: str
    clinic_name: str
    clinic_address: str
    patient_name: str
    patient_phone: str
    patient_email: str
    patient_age: int
    appointment_date: str
    appointment_time: str
    consultation_mode: str = "In-Clinic"
    symptoms: Optional[str] = ""
    consultation_fee: int = 500

class Appointment(AppointmentCreate):
    id: str
    booking_ref: str
    status: str = "Confirmed"
    created_at: str
    qr_code_data: str
