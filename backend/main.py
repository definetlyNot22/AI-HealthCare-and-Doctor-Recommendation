import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

load_dotenv()

from models import (
    SymptomAnalysisRequest,
    SymptomAnalysisResponse,
    Doctor,
    AppointmentCreate,
    Appointment,
)
from doctor_data import DOCTORS_DATABASE, CITIES
from ai_engine import analyze_symptoms_with_gemini, generate_fallback_response
from database import init_db, create_appointment, get_all_appointments, cancel_appointment, get_booked_slots

# Initialize Database
init_db()

app = FastAPI(
    title="TriHealth AI - Healthcare & Doctor Recommendation Engine",
    description="Integrative AI clinical reasoning across Ayurveda, Homeopathy, and Allopathy with location-based doctor matching and slot booking.",
    version="1.0.0"
)

# CORS configuration for local development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    gemini_key_configured = bool(os.getenv("GEMINI_API_KEY"))
    return {
        "status": "healthy",
        "service": "TriHealth AI Backend",
        "gemini_api_configured": gemini_key_configured,
        "available_cities": len(CITIES),
        "total_doctors": len(DOCTORS_DATABASE)
    }

@app.get("/api/cities", response_model=List[str])
def get_cities():
    return CITIES

@app.post("/api/analyze", response_model=SymptomAnalysisResponse)
async def analyze_symptoms(request: SymptomAnalysisRequest):
    if not request.symptoms or len(request.symptoms.strip()) < 3:
        raise HTTPException(status_code=400, detail="Please provide a valid symptom description.")

    api_key = request.api_key or os.getenv("GEMINI_API_KEY")
    response = None

    if api_key:
        response = await analyze_symptoms_with_gemini(request, api_key)

    # If Gemini wasn't called or failed, use our comprehensive clinical intelligence engine
    if not response:
        response = generate_fallback_response(request)

    return response

@app.get("/api/doctors", response_model=List[Doctor])
def get_doctors(
    city: Optional[str] = Query("Bengaluru", description="City to filter doctors"),
    system: Optional[str] = Query("All", description="Ayurveda, Homeopathy, Allopathy, or All"),
    specialty: Optional[str] = Query(None, description="Filter by doctor medical specialty"),
    mode: Optional[str] = Query("All", description="In-Clinic, Video Consultation, or All"),
    sort_by: Optional[str] = Query("rating", description="rating, distance, or fee"),
    search: Optional[str] = Query(None, description="Search doctor name, hospital, or keywords")
):
    filtered = DOCTORS_DATABASE.copy()

    # City filter
    if city and city.lower() != "all":
        city_lower = city.lower().strip()
        filtered = [d for d in filtered if city_lower in d["city"].lower() or d["city"].lower() in city_lower]
        # If no doctors found in that specific city, return all or nearest
        if not filtered:
            filtered = DOCTORS_DATABASE.copy()

    # System filter
    if system and system.lower() != "all":
        filtered = [d for d in filtered if d["system"].lower() == system.lower()]

    # Specialty filter
    if specialty and specialty.strip():
        sp_lower = specialty.lower().strip()
        filtered = [d for d in filtered if sp_lower in d["specialty"].lower() or sp_lower in d["match_reason"].lower()]

    # Consultation Mode filter
    if mode and mode.lower() != "all":
        filtered = [d for d in filtered if mode in d.get("available_modes", [])]

    # Keyword Search
    if search and search.strip():
        q = search.lower().strip()
        filtered = [
            d for d in filtered
            if q in d["name"].lower() or q in d["specialty"].lower() or q in d["clinic_name"].lower() or q in d["address"].lower()
        ]

    # Sorting
    if sort_by == "distance":
        filtered.sort(key=lambda x: x.get("distance_km", 99.0))
    elif sort_by == "fee":
        filtered.sort(key=lambda x: x.get("consultation_fee", 9999))
    else:  # default: rating
        filtered.sort(key=lambda x: (x.get("rating", 0.0), x.get("match_score", 0)), reverse=True)

    return [Doctor(**doc) for doc in filtered]

@app.get("/api/doctors/{doctor_id}", response_model=Doctor)
def get_doctor_by_id(doctor_id: str):
    for doc in DOCTORS_DATABASE:
        if doc["id"] == doctor_id:
            return Doctor(**doc)
    raise HTTPException(status_code=404, detail="Doctor not found")

@app.get("/api/doctors/{doctor_id}/slots")
def get_doctor_slots(doctor_id: str, date: str = Query(..., description="Date YYYY-MM-DD")):
    doc = next((d for d in DOCTORS_DATABASE if d["id"] == doctor_id), None)
    if not doc:
        raise HTTPException(status_code=404, detail="Doctor not found")

    booked = get_booked_slots(doctor_id, date)
    all_slots = doc.get("slots", ["09:30 AM", "11:00 AM", "02:30 PM", "04:30 PM", "06:00 PM"])

    available = [s for s in all_slots if s not in booked]
    return {
        "doctor_id": doctor_id,
        "date": date,
        "all_slots": all_slots,
        "booked_slots": booked,
        "available_slots": available
    }

@app.post("/api/appointments", response_model=Appointment)
def book_appointment(appointment: AppointmentCreate):
    # Check if slot is already booked for this doctor and date
    booked = get_booked_slots(appointment.doctor_id, appointment.appointment_date)
    if appointment.appointment_time in booked:
        raise HTTPException(
            status_code=409,
            detail=f"The time slot '{appointment.appointment_time}' on {appointment.appointment_date} has just been booked. Please choose another slot."
        )

    return create_appointment(appointment)

@app.get("/api/appointments", response_model=List[Appointment])
def list_appointments(phone: Optional[str] = None):
    return get_all_appointments(patient_phone=phone)

@app.delete("/api/appointments/{appointment_id}")
def cancel_existing_appointment(appointment_id: str):
    success = cancel_appointment(appointment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Appointment not found or already cancelled")
    return {"message": "Appointment cancelled successfully", "id": appointment_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
