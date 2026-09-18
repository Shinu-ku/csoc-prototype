# CSOC Platform — Interactive Prototype v2

A visual PBL prototype for **Cybersecurity Operations Center Platform**, focused on the Operating Systems syllabus covered in Review 1.

## What this prototype demonstrates

### Unit 1
- Linux monitoring concept
- CLI/shell scripting
- Automated system administration
- `ps`, `uptime`, `free`, `df`
- Shell variables/commands through the monitoring script

### Unit 2
- Process monitoring
- PID, state, CPU and memory information
- PCB concept (conceptual representation)
- CPU scheduling simulation:
  - FCFS
  - SJF
  - SRTF
  - Non-Preemptive Priority
  - Pre-emptive Priority
- Gantt chart
- Average waiting time
- Average turnaround time

### Cybersecurity layer
- Rule-based resource anomaly indicators
- Security alert dashboard
- High CPU/memory investigation workflow

## Run the visual prototype

No installation is required.

Open:

`frontend/index.html`

in a browser.

For a local server:

```bash
cd frontend
python3 -m http.server 5500
```

Then open:

`http://localhost:5500`

## Run the Linux shell demo

On Linux:

```bash
chmod +x scripts/system_monitor.sh
./scripts/system_monitor.sh
```

## Important project boundary

This is a **Review 1 prototype**, not an enterprise SOC.

The CPU scheduler is a simulation for the Operating Systems syllabus. It does not modify the Linux kernel scheduler.

The security alerts are rule-based demonstration indicators, not a production intrusion-detection system.

## Planned later expansion

As remaining OS syllabus units are covered, modules can be added for:

- Threads
- Synchronization
- Mutex/semaphores
- Race conditions
- Deadlock and Banker's Algorithm
- Memory management
- Paging and page replacement
- File management
- Disk scheduling
- Virtualization/GPU topics where applicable
