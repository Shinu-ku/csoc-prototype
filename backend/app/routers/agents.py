from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter(prefix="/api/agents", tags=["agents"])

@router.post("/register", response_model=schemas.AgentResponse)
def register_agent(agent_data: schemas.AgentRegister, db: Session = Depends(get_db)):
    db_agent = db.query(models.Agent).filter(models.Agent.agent_id == agent_data.agent_id).first()
    
    if db_agent:
        db_agent.hostname = agent_data.hostname
        db_agent.ip_address = agent_data.ip_address
        db_agent.os_name = agent_data.os_name
        db_agent.os_version = agent_data.os_version
        db_agent.agent_version = agent_data.agent_version
        db_agent.status = "ONLINE"
        db_agent.last_seen = datetime.now(timezone.utc)
    else:
        db_agent = models.Agent(
            agent_id=agent_data.agent_id,
            hostname=agent_data.hostname,
            ip_address=agent_data.ip_address,
            os_name=agent_data.os_name,
            os_version=agent_data.os_version,
            agent_version=agent_data.agent_version,
            status="ONLINE"
        )
        db.add(db_agent)
    
    log = models.SystemLog(agent_id=agent_data.agent_id, event_type="AGENT_REGISTERED", message="Agent registered successfully", severity="INFO")
    db.add(log)
    db.commit()
    return {"success": True, "agent_id": db_agent.agent_id}

@router.post("/heartbeat")
def agent_heartbeat(heartbeat: schemas.Heartbeat, db: Session = Depends(get_db)):
    db_agent = db.query(models.Agent).filter(models.Agent.agent_id == heartbeat.agent_id).first()
    if not db_agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    db_agent.last_seen = datetime.now(timezone.utc)
    db_agent.status = "ONLINE"
    db.commit()
    return {"success": True}

@router.get("/")
def get_agents(db: Session = Depends(get_db)):
    return db.query(models.Agent).all()
