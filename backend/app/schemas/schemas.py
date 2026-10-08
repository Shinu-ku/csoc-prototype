from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AgentRegister(BaseModel):
    agent_id: str
    hostname: str
    ip_address: str
    os_name: str
    os_version: str
    agent_version: str

class AgentResponse(BaseModel): 
    success: bool
    agent_id: str

class Heartbeat(BaseModel):
    agent_id: str

class SystemMetricCreate(BaseModel):
    agent_id: str
    cpu_percent: float
    memory_percent: float
    disk_percent: float
    uptime_seconds: int

class ProcessCreate(BaseModel):
    pid: int
    process_name: str
    username: Optional[str] = None
    cpu_percent: float
    memory_percent: float
    thread_count: int
    state: str
    parent_pid: Optional[int] = None

class ProcessBatchCreate(BaseModel):
    agent_id: str
    processes: List[ProcessCreate]
