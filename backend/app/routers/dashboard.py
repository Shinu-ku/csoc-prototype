from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import models

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/")
def get_dashboard_data(db: Session = Depends(get_db)):
    agents = db.query(models.Agent).all()
    
    systems = []
    for agent in agents:
        latest_metric = db.query(models.SystemMetric).filter(models.SystemMetric.agent_id == agent.agent_id).order_by(desc(models.SystemMetric.timestamp)).first()
        process_count = db.query(models.ProcessSnapshot).filter(models.ProcessSnapshot.agent_id == agent.agent_id).count()
        
        system_data = {
            "agent_id": agent.agent_id,
            "hostname": agent.hostname,
            "ip_address": agent.ip_address,
            "os_name": agent.os_name,
            "status": agent.status,
            "last_seen": agent.last_seen,
            "cpu": latest_metric.cpu_percent if latest_metric else 0,
            "ram": latest_metric.memory_percent if latest_metric else 0,
            "disk": latest_metric.disk_percent if latest_metric else 0,
            "uptime": latest_metric.uptime_seconds if latest_metric else 0,
            "process_count": process_count
        }
        systems.append(system_data)

    alerts = db.query(models.Alert).order_by(desc(models.Alert.created_at)).limit(5).all()
    
    # We'll just fetch recent processes for SYS-01 as default, or any online agent
    processes = []
    if systems:
        processes = db.query(models.ProcessSnapshot).filter(models.ProcessSnapshot.agent_id == systems[0]["agent_id"]).order_by(desc(models.ProcessSnapshot.cpu_percent)).limit(5).all()

    # Time series for chart (last 20 metrics for SYS-01)
    chart_metrics = []
    if systems:
        metrics = db.query(models.SystemMetric).filter(models.SystemMetric.agent_id == systems[0]["agent_id"]).order_by(desc(models.SystemMetric.timestamp)).limit(20).all()
        metrics.reverse()
        chart_metrics = [
            {
                "time": m.timestamp.strftime("%H:%M:%S"),
                "cpu": m.cpu_percent,
                "ram": m.memory_percent,
                "disk": m.disk_percent
            } for m in metrics
        ]

    return {
        "systems": systems,
        "alerts": alerts,
        "processes": processes,
        "chart_metrics": chart_metrics
    }
