import os
import sqlite3
import random
import string
import datetime
from typing import List, Dict, Any, Optional
from models import AppointmentCreate, Appointment

if os.environ.get("VERCEL"):
    DB_PATH = "/tmp/trihealth_appointments.db"
else:
    DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "trihealth_appointments.db")

def get_db_connection():
    first_time = not os.path.exists(DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    if first_time:
        cursor = conn.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS appointments (
            id TEXT PRIMARY KEY,
            booking_ref TEXT UNIQUE NOT NULL,
            doctor_id TEXT NOT NULL,
            doctor_name TEXT NOT NULL,
            doctor_system TEXT NOT NULL,
            doctor_specialty TEXT NOT NULL,
            clinic_name TEXT NOT NULL,
            clinic_address TEXT NOT NULL,
            patient_name TEXT NOT NULL,
            patient_phone TEXT NOT NULL,
            patient_email TEXT NOT NULL,
            patient_age INTEGER,
            appointment_date TEXT NOT NULL,
            appointment_time TEXT NOT NULL,
            consultation_mode TEXT NOT NULL,
            symptoms TEXT,
            consultation_fee INTEGER,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            qr_code_data TEXT NOT NULL
        )
        """)
        conn.commit()
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        booking_ref TEXT UNIQUE NOT NULL,
        doctor_id TEXT NOT NULL,
        doctor_name TEXT NOT NULL,
        doctor_system TEXT NOT NULL,
        doctor_specialty TEXT NOT NULL,
        clinic_name TEXT NOT NULL,
        clinic_address TEXT NOT NULL,
        patient_name TEXT NOT NULL,
        patient_phone TEXT NOT NULL,
        patient_email TEXT NOT NULL,
        patient_age INTEGER,
        appointment_date TEXT NOT NULL,
        appointment_time TEXT NOT NULL,
        consultation_mode TEXT NOT NULL,
        symptoms TEXT,
        consultation_fee INTEGER,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        qr_code_data TEXT NOT NULL
    )
    """)
    conn.commit()
    conn.close()

def generate_booking_ref() -> str:
    chars = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
    year = datetime.datetime.now().year
    return f"APT-{year}-{chars}"

def create_appointment(data: AppointmentCreate) -> Appointment:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    app_id = f"apt-{random.randint(100000, 999999)}"
    booking_ref = generate_booking_ref()
    created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    qr_payload = f"TRIHEALTH|{booking_ref}|{data.doctor_name}|{data.appointment_date}|{data.appointment_time}|{data.patient_name}"
    
    cursor.execute("""
    INSERT INTO appointments (
        id, booking_ref, doctor_id, doctor_name, doctor_system, doctor_specialty,
        clinic_name, clinic_address, patient_name, patient_phone, patient_email,
        patient_age, appointment_date, appointment_time, consultation_mode,
        symptoms, consultation_fee, status, created_at, qr_code_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        app_id, booking_ref, data.doctor_id, data.doctor_name, data.doctor_system,
        data.doctor_specialty, data.clinic_name, data.clinic_address, data.patient_name,
        data.patient_phone, data.patient_email, data.patient_age, data.appointment_date,
        data.appointment_time, data.consultation_mode, data.symptoms or "",
        data.consultation_fee, "Confirmed", created_at, qr_payload
    ))
    conn.commit()
    conn.close()
    
    return Appointment(
        id=app_id,
        booking_ref=booking_ref,
        doctor_id=data.doctor_id,
        doctor_name=data.doctor_name,
        doctor_system=data.doctor_system,
        doctor_specialty=data.doctor_specialty,
        clinic_name=data.clinic_name,
        clinic_address=data.clinic_address,
        patient_name=data.patient_name,
        patient_phone=data.patient_phone,
        patient_email=data.patient_email,
        patient_age=data.patient_age,
        appointment_date=data.appointment_date,
        appointment_time=data.appointment_time,
        consultation_mode=data.consultation_mode,
        symptoms=data.symptoms,
        consultation_fee=data.consultation_fee,
        status="Confirmed",
        created_at=created_at,
        qr_code_data=qr_payload
    )

def get_all_appointments(patient_phone: Optional[str] = None) -> List[Appointment]:
    conn = get_db_connection()
    cursor = conn.cursor()
    if patient_phone:
        cursor.execute("SELECT * FROM appointments WHERE patient_phone = ? ORDER BY created_at DESC", (patient_phone,))
    else:
        cursor.execute("SELECT * FROM appointments ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for row in rows:
        results.append(Appointment(
            id=row["id"],
            booking_ref=row["booking_ref"],
            doctor_id=row["doctor_id"],
            doctor_name=row["doctor_name"],
            doctor_system=row["doctor_system"],
            doctor_specialty=row["doctor_specialty"],
            clinic_name=row["clinic_name"],
            clinic_address=row["clinic_address"],
            patient_name=row["patient_name"],
            patient_phone=row["patient_phone"],
            patient_email=row["patient_email"],
            patient_age=row["patient_age"],
            appointment_date=row["appointment_date"],
            appointment_time=row["appointment_time"],
            consultation_mode=row["consultation_mode"],
            symptoms=row["symptoms"],
            consultation_fee=row["consultation_fee"],
            status=row["status"],
            created_at=row["created_at"],
            qr_code_data=row["qr_code_data"]
        ))
    return results

def cancel_appointment(appointment_id: str) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE appointments SET status = 'Cancelled' WHERE id = ? OR booking_ref = ?", (appointment_id, appointment_id))
    rows_affected = cursor.rowcount
    conn.commit()
    conn.close()
    return rows_affected > 0

def get_booked_slots(doctor_id: str, date: str) -> List[str]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT appointment_time FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND status != 'Cancelled'",
        (doctor_id, date)
    )
    rows = cursor.fetchall()
    conn.close()
    return [row["appointment_time"] for row in rows]
