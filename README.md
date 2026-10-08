# CSOC Platform

CSOC Platform is a centralized cybersecurity operations and system-monitoring platform designed for multiple Linux systems. Lightweight CSOC agents collect operating-system-level telemetry including CPU, memory, disk, process and system-status information and transmit it to a central FastAPI backend. The backend validates and stores the data, applies transparent rule-based analysis, generates security alerts for abnormal resource and process behavior, and exposes the results through a centralized administrator dashboard. The platform also includes an Operating Systems learning module implementing CPU scheduling algorithms such as FCFS, SJF, SRTF, Non-Preemptive Priority and Pre-emptive Priority, along with Linux shell automation for system administration tasks.

## Architecture

- **Frontend**: React + Vite (Dashboard)
- **Backend**: FastAPI + SQLite (Central Receiver and Analysis Engine)
- **Agent**: Python + psutil (Linux telemetry collector)

## Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# Activate venv: source .venv/bin/activate (Linux/Mac) or .venv\Scripts\activate (Windows)
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Agent Setup
```bash
cd agent
pip install -r requirements.txt
python csoc_agent.py
```

## Documentation
- [Architecture](docs/architecture.md)
- [API Reference](docs/api.md)
- [Syllabus Mapping](docs/syllabus-mapping.md)
- [Demo Guide](docs/demo-guide.md)
