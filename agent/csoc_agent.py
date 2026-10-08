import time
import socket
import psutil
import requests
import threading
import sys
from datetime import datetime

# Configuration
BACKEND_URL = "http://localhost:8000/api"
AGENT_ID = "SYS-01"
HOSTNAME = socket.gethostname()
OS_NAME = sys.platform
OS_VERSION = "1.0"
AGENT_VERSION = "1.0"

# Intervals
HEARTBEAT_INTERVAL = 15
METRICS_INTERVAL = 5
PROCESS_INTERVAL = 10

def register_agent():
    print(f"[{datetime.now()}] Registering agent...")
    data = {
        "agent_id": AGENT_ID,
        "hostname": HOSTNAME,
        "ip_address": socket.gethostbyname(HOSTNAME),
        "os_name": OS_NAME,
        "os_version": OS_VERSION,
        "agent_version": AGENT_VERSION
    }
    try:
        response = requests.post(f"{BACKEND_URL}/agents/register", json=data)
        if response.status_code == 200:
            print("Successfully registered.")
        else:
            print(f"Failed to register: {response.text}")
    except Exception as e:
        print(f"Connection error: {e}")

def send_heartbeat():
    while True:
        try:
            requests.post(f"{BACKEND_URL}/agents/heartbeat", json={"agent_id": AGENT_ID})
        except:
            pass
        time.sleep(HEARTBEAT_INTERVAL)

def collect_metrics():
    while True:
        try:
            uptime = time.time() - psutil.boot_time()
            disk_usage = psutil.disk_usage("/") if sys.platform != "win32" else psutil.disk_usage("C:\\")
            data = {
                "agent_id": AGENT_ID,
                "cpu_percent": psutil.cpu_percent(interval=1),
                "memory_percent": psutil.virtual_memory().percent,
                "disk_percent": disk_usage.percent,
                "uptime_seconds": int(uptime)
            }
            requests.post(f"{BACKEND_URL}/metrics", json=data)
        except Exception as e:
            print(f"Metrics collection error: {e}")
        time.sleep(METRICS_INTERVAL)

def collect_processes():
    while True:
        try:
            processes = []
            for p in psutil.process_iter(['pid', 'name', 'username', 'cpu_percent', 'memory_percent', 'num_threads', 'status', 'ppid']):
                try:
                    info = p.info
                    processes.append({
                        "pid": info['pid'],
                        "process_name": info['name'] or "unknown",
                        "username": info['username'] or "unknown",
                        "cpu_percent": round(info['cpu_percent'] or 0.0, 1),
                        "memory_percent": round(info['memory_percent'] or 0.0, 1),
                        "thread_count": info['num_threads'] or 0,
                        "state": info['status'] or "unknown",
                        "parent_pid": info['ppid']
                    })
                except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                    pass
            
            # Send top 50 CPU intensive processes
            processes = sorted(processes, key=lambda x: x['cpu_percent'], reverse=True)[:50]
            data = {
                "agent_id": AGENT_ID,
                "processes": processes
            }
            requests.post(f"{BACKEND_URL}/processes", json=data)
        except Exception as e:
            print(f"Process collection error: {e}")
        time.sleep(PROCESS_INTERVAL)

if __name__ == "__main__":
    register_agent()
    
    threads = [
        threading.Thread(target=send_heartbeat, daemon=True),
        threading.Thread(target=collect_metrics, daemon=True),
        threading.Thread(target=collect_processes, daemon=True)
    ]
    
    for t in threads:
        t.start()
        
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Agent stopped.")
