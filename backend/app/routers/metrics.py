from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter(prefix="/api", tags=["metrics"])

def check_thresholds(agent_id: str, metric: schemas.SystemMetricCreate, db: Session):
    if metric.cpu_percent > 90:
        alert = models.Alert(agent_id=agent_id, severity="HIGH", alert_type="HIGH_CPU", title="High CPU Alert", description=f"CPU exceeded threshold with {metric.cpu_percent}%")
        db.add(alert)
    if metric.memory_percent > 90:
        alert = models.Alert(agent_id=agent_id, severity="HIGH", alert_type="HIGH_MEMORY", title="High Memory Alert", description=f"Memory exceeded threshold with {metric.memory_percent}%")
        db.add(alert)
    if metric.disk_percent > 80:
        alert = models.Alert(agent_id=agent_id, severity="MEDIUM", alert_type="HIGH_DISK", title="High Disk Usage Alert", description=f"Disk usage at {metric.disk_percent}%")
        db.add(alert)

@router.post("/metrics")
def submit_metrics(metric_data: schemas.SystemMetricCreate, db: Session = Depends(get_db)):
    db_metric = models.SystemMetric(
        agent_id=metric_data.agent_id,
        cpu_percent=metric_data.cpu_percent,
        memory_percent=metric_data.memory_percent,
        disk_percent=metric_data.disk_percent,
        uptime_seconds=metric_data.uptime_seconds
    )
    db.add(db_metric)
    
    check_thresholds(metric_data.agent_id, metric_data, db)
    db.commit()
    return {"success": True}

@router.post("/processes")
def submit_processes(process_data: schemas.ProcessBatchCreate, db: Session = Depends(get_db)):
    for p in process_data.processes:
        snapshot = models.ProcessSnapshot(
            agent_id=process_data.agent_id,
            pid=p.pid,
            process_name=p.process_name,
            username=p.username,
            cpu_percent=p.cpu_percent,
            memory_percent=p.memory_percent,
            thread_count=p.thread_count,
            state=p.state,
            parent_pid=p.parent_pid
        )
        db.add(snapshot)
        
        if p.cpu_percent > 80:
             alert = models.Alert(agent_id=process_data.agent_id, pid=p.pid, severity="HIGH", alert_type="HIGH_PROCESS_CPU", title="High Process CPU Alert", description=f"Process {p.process_name} (PID: {p.pid}) CPU usage is {p.cpu_percent}%")
             db.add(alert)

    db.commit()
    return {"success": True}
