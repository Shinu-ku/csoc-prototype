from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psutil
from algorithms import fcfs, sjf, srtf, priority

app = FastAPI(title="CSOC Prototype API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def processes():
    rows=[]
    for p in psutil.process_iter(["pid","name","cpu_percent","memory_percent","status"]):
        try:
            x=p.info
            rows.append({"pid":x["pid"],"name":x["name"] or "unknown","cpu":round(x["cpu_percent"] or 0,1),"memory":round(x["memory_percent"] or 0,1),"state":x["status"]})
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    return sorted(rows,key=lambda x:x["cpu"],reverse=True)

@app.get("/api/health")
def health(): return {"status":"online"}

@app.get("/api/system")
def system():
    cpu=psutil.cpu_percent(interval=0.2); mem=psutil.virtual_memory(); disk=psutil.disk_usage('/')
    alerts=[]
    if cpu >= 80: alerts.append({"severity":"critical","message":f"High CPU usage: {cpu}%"})
    if mem.percent >= 85: alerts.append({"severity":"warning","message":f"High memory usage: {mem.percent}%"})
    for p in processes()[:20]:
        if p["cpu"] >= 90: alerts.append({"severity":"critical","message":f"High CPU process: {p['name']} (PID {p['pid']})"})
    return {"cpu":cpu,"memory":mem.percent,"disk":disk.percent,"processes":len(processes()),"alerts":alerts}

@app.get("/api/processes")
def process_list(): return processes()[:50]

@app.post("/api/schedule/{algorithm}")
def schedule(algorithm: str, jobs: list[dict]):
    funcs={"fcfs":fcfs,"sjf":sjf,"srtf":srtf,"priority":priority}
    if algorithm not in funcs: return {"error":"Unknown algorithm"}
    return funcs[algorithm](jobs)
