# Demo Guide

1. **Start backend**: `cd backend && uvicorn app.main:app --reload`
2. **Start frontend**: `cd frontend && npm run dev`
3. **Start Agent**: `cd agent && python csoc_agent.py`
4. **Dashboard View**: Open `http://localhost:5173` to see systems coming online.
5. **Open Process Monitor**: See real-time processes from the Linux agent.
6. **Trigger CPU Spike**: Run a high CPU task (e.g. `yes > /dev/null`) on the agent machine.
7. **Agent Detection**: The agent captures the >90% CPU jump.
8. **Analysis & Alerts**: Backend registers the anomaly and generates an alert.
9. **Dashboard Alert**: Navigate to Security Alerts to see the HIGH CPU alert with PID details.
10. **Run Shell Scripts**: Execute `./scripts/system_monitor.sh` directly to show shell scripting automation of the same concept.
11. **Stop Agent**: Terminate `csoc_agent.py`. The dashboard will reflect OFFLINE status soon after missing heartbeats.
