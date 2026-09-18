# CSOC Platform Prototype

Operating Systems PBL prototype for a Cybersecurity Operations Center Platform.

## Current scope
- Linux/system monitoring prototype
- Process monitoring
- Security alert rules for high CPU/memory
- CPU scheduling simulations: FCFS, SJF, SRTF, Priority (preemptive/non-preemptive)
- Bash monitoring script
- Minimal web dashboard

## Run
### Backend
```bash
cd backend
python -m venv .venv
# Linux/macOS: source .venv/bin/activate
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
Open `frontend/index.html` directly, or serve the repo with a local HTTP server. Set API URL in `frontend/app.js` if needed.

### Linux script
```bash
chmod +x scripts/system_monitor.sh
./scripts/system_monitor.sh
```
