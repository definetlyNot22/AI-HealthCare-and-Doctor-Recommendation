import os
import random
import string
import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List, Optional
from models import AppointmentCreate, Appointment

# Fetch the cloud database URL from Vercel environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    # Connects to PostgreSQL instead of a local SQLite file
    if not DATABASE_URL:
        raise Exception("DATABASE_URL environment variable is not set.")
    return psycopg2.connect(DATABASE_URL)

def init_db():
    if not DATABASE_URL:
        print("Warning: DATABASE_URL not set. Skipping DB initialization.")
        return
        
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
    cursor.close()
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
    
    # Note: PostgreSQL uses %s instead of ? for parameter binding
    cursor.execute("""
    INSERT INTO appointments (
        id, booking_ref, doctor_id, doctor_name, doctor_system, doctor_specialty,
        clinic_name, clinic_address, patient_name, patient_phone, patient_email,
        patient_age, appointment_date, appointment_time, consultation_mode,
        symptoms, consultation_fee, status, created_at, qr_code_data
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        app_id, booking_ref, data.doctor_id, data.doctor_name, data.doctor_system,
        data.doctor_specialty, data.clinic_name, data.clinic_address, data.patient_name,
        data.patient_phone, data.patient_email, data.patient_age, data.appointment_date,
        data.appointment_time, data.consultation_mode, data.symptoms or "",
        data.consultation_fee, "Confirmed", created_at, qr_payload
    ))
    conn.commit()
    cursor.close()
    conn.close()
    
    return Appointment(
        id=app_id, booking_ref=booking_ref, doctor_id=data.doctor_id, doctor_name=data.doctor_name,
        doctor_system=data.doctor_system, doctor_specialty=data.doctor_specialty, clinic_name=data.clinic_name,
        clinic_address=data.clinic_address, patient_name=data.patient_name, patient_phone=data.patient_phone,
        patient_email=data.patient_email, patient_age=data.patient_age, appointment_date=data.appointment_date,
        appointment_time=data.appointment_time, consultation_mode=data.consultation_mode, symptoms=data.symptoms,
        consultation_fee=data.consultation_fee, status="Confirmed", created_at=created_at, qr_code_data=qr_payload
    )

def get_all_appointments(patient_phone: Optional[str] = None) -> List[Appointment]:
    conn = get_db_connection()
    # RealDictCursor allows row["column_name"] syntax just like sqlite3.Row
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    if patient_phone:
        cursor.execute("SELECT * FROM appointments WHERE patient_phone = %s ORDER BY created_at DESC", (patient_phone,))
    else:
        cursor.execute("SELECT * FROM appointments ORDER BY created_at DESC")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return [Appointment(**row) for row in rows]

def cancel_appointment(appointment_id: str) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE appointments SET status = 'Cancelled' WHERE id = %s OR booking_ref = %s", (appointment_id, appointment_id))
    rows_affected = cursor.rowcount
    conn.commit()
    cursor.close()
    conn.close()
    return rows_affected > 0

def get_booked_slots(doctor_id: str, date: str) -> List[str]:
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        "SELECT appointment_time FROM appointments WHERE doctor_id = %s AND appointment_date = %s AND status != 'Cancelled'",
        (doctor_id, date)
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return [row["appointment_time"] for row in rows]
