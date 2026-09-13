Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "         TriHealth AI - Tri-Paradigm Medical Platform                 " -ForegroundColor Green
Write-Host "     (Ayurveda + Homeopathy + Allopathy + Doctor Slot Booking)        " -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend
Write-Host "[*] Launching Backend Server on http://127.0.0.1:8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; ..\backend\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

# Start Frontend
Write-Host "[*] Launching Frontend Server on http://localhost:5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"
Write-Host "[✓] System running! Visit http://localhost:5173" -ForegroundColor Green
