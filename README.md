##<<<<<<< HEAD
# TriHealth AI - Integrative Healthcare & Doctor Recommendation Platform

> **Tri-Paradigm Clinical Intelligence**: Patients share their health problem, receive instant comparative medical perspectives across **Ayurveda**, **Homeopathy**, and **Allopathy**, select their preferred healing path, get matched with the top-rated doctors in their city, and book appointment slots with confirmed digital passes.

---

## 🌟 Key Features

### 1. 🩺 Smart Patient Symptom Intake
- **Natural Language & Voice Input**: Patients can type or speak their symptoms aloud using Web Speech recognition.
- **Quick Health Patterns**: Pre-configured symptom clusters (e.g., Acid Reflux, Throbbing Migraines, Knee Joint Pain, Chronic Cough, Eczema, Anxiety).
- **Patient Context**: Input age, gender, duration, perceived severity, and city location.

### 2. 🌿💧🔬 Tri-Paradigm Medical Engine
When symptoms are submitted, the AI generates a multi-dimensional comparative analysis across three medical philosophies:
- **🌿 Ayurveda (आयुर्वेद)**:
  - Root cause diagnosis through **Dosha Balance** (Vata, Pitta, Kapha visual ratio meter).
  - Classical herbal formulations (e.g., Avipattikar Churna, Kamadudha Ras, Ashwagandha) with Sanskrit names, purpose, form, and dosage.
  - Dietary (**Ahara**) and lifestyle routines (**Vihara**), plus Panchakarma therapies.
- **💧 Homeopathy (होम्योपैथी)**:
  - Constitutional totality assessment & patient miasm.
  - Selected homeopathic remedies with potencies (e.g., *Nux Vomica 30C*, *Arsenicum Album 200CH*, *Rhus Tox*).
  - Gentle minimum-dose healing with zero chemical toxicity.
  - Dietary precautions (avoiding coffee, menthol, raw onion).
- **🔬 Allopathy (एलोपैथी)**:
  - Evidence-based differential diagnosis and etiology.
  - Recommended standard clinical investigations (Endoscopy, Blood tests, MRI, Ultrasound).
  - Standard pharmacotherapy classes (PPIs, NSAIDs, Antihistamines, etc.).
  - **Red Flag Signs**: Urgent warning signs that mandate immediate ER care.
- **Comparative Decision Matrix**: Side-by-side comparison of speed of relief, root cause focus, side effect profile, lifestyle dependency, and cost level.

### 3. 📍 City-Based Doctor Recommendation Engine
- Recommends verified doctors filtered by the patient's chosen medical paradigm (**Ayurveda**, **Homeopathy**, **Allopathy**, or **All**).
- **Geo-Location & Distance**: Real-time proximity calculation (e.g., "1.4 km away in Indiranagar, Bengaluru").
- **AI Match Score**: Explains why each doctor is specifically matched for the patient's condition (e.g. *"98% Match: Specialized in chronic gut health and Pitta dosha balancing"*).
- Filter by consultation mode (**In-Clinic Visit** vs **Online Video Consultation**), sort by rating, distance, or fee.

### 4. 📅 Interactive Slot Booking & Digital Appointment Pass
- Interactive 7-day calendar and morning/afternoon/evening time slots with live availability checks to prevent double-booking.
- **Celebratory Confetti & Boarding Pass**: Confirmed booking reference ID (`APT-2026-XXXXX`), QR code representation, clinic navigation, and prep instructions.
- **Calendar Integration**: Download `.ics` calendar invite or print digital appointment slip.

### 5. 🗂️ Patient Dashboard ("My Bookings")
- Review all active and past appointments.
- Real-time cancellation and status updates.
- Persistent SQLite database storage.

### 6. 🧠 Dual-Intelligence AI Architecture
- **Google Gemini API**: Uses Gemini 2.5 Flash for dynamic clinical synthesis when an API key is provided.
- **Clinical Intelligence Core**: Built-in comprehensive knowledge engine covering 20+ disease categories as an offline, verified fallback. Works 100% out of the box with zero required API keys!

---

## 🚀 Quick Start Guide

### Option 1: One-Click Launcher (Windows)
Double-click `start.bat` or run:
```powershell
.\start.bat
```
*(Automatically sets up Python venv, installs packages, installs npm dependencies, and boots both servers simultaneously).*

### Option 2: Manual Setup

#### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*API Swagger Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)*

#### 2. Frontend Setup (React + Vite + Tailwind)
```bash
cd frontend
npm install
npm run dev
```
*Frontend URL: [http://localhost:5173](http://localhost:5173)*

---

## 🏛️ Project Directory Structure

```
AI Healthcare/
├── backend/
│   ├── main.py              # FastAPI server & REST endpoints
│   ├── models.py            # Pydantic schemas for AI, doctors & bookings
│   ├── ai_engine.py         # Dual Gemini API + Clinical fallback core
│   ├── doctor_data.py       # Verified doctor database across Indian cities
│   ├── database.py          # SQLite database for persistent appointments
│   └── requirements.txt     # Backend Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Header, city selector, AI settings
│   │   │   ├── SymptomChecker.tsx     # Voice/text symptom intake & triage
│   │   │   ├── TriParadigmResults.tsx # Ayurveda, Homeopathy, Allopathy comparison
│   │   │   ├── DoctorList.tsx         # Doctor cards, filters, match scores
│   │   │   ├── BookingModal.tsx       # Live slot picker & patient details
│   │   │   ├── AppointmentPass.tsx    # Digital boarding pass & calendar .ics
│   │   │   ├── MyAppointments.tsx     # Patient bookings portal
│   │   │   └── ApiKeyModal.tsx        # Gemini AI settings
│   │   ├── services/api.ts            # REST client communication
│   │   ├── types.ts                   # TypeScript interfaces
│   │   ├── App.tsx                    # Master application state
│   │   └── main.tsx                   # React root entrypoint
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── start.bat                # Windows 1-click batch launcher
├── run.ps1                  # PowerShell launcher
└── README.md
```

---

## 🛡️ Medical Disclaimer
TriHealth AI is an educational decision-support tool comparing treatment paradigms across Ayurveda, Homeopathy, and Allopathy. It does not provide definitive medical diagnoses and does not replace emergency medical treatment. In cases of severe emergency, contact local emergency services (112 / 108) immediately.
=======
# AI-HealthCare-and-Doctor-Recommendation
>>>>>>> e5c16460986dd25baa78632d0532f49181635419
