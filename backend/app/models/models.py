from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from datetime import datetime, timezone
from app.database import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, unique=True, index=True)
    hostname = Column(String)
    ip_address = Column(String)
    os_name = Column(String)
    os_version = Column(String)
    status = Column(String, default="ONLINE")
    agent_version = Column(String)
    last_seen = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SystemMetric(Base):
    __tablename__ = "system_metrics"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, index=True)
    cpu_percent = Column(Float)
    memory_percent = Column(Float)
    disk_percent = Column(Float)
    uptime_seconds = Column(Integer)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ProcessSnapshot(Base):
    __tablename__ = "process_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, index=True)
    pid = Column(Integer)
    process_name = Column(String)
    username = Column(String)
    cpu_percent = Column(Float)
    memory_percent = Column(Float)
    thread_count = Column(Integer)
    state = Column(String)
    parent_pid = Column(Integer, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, index=True)
    pid = Column(Integer, nullable=True)
    severity = Column(String)
    alert_type = Column(String)
    title = Column(String)
    description = Column(String)
    status = Column(String, default="OPEN")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    acknowledged_at = Column(DateTime, nullable=True)

class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, index=True)
    event_type = Column(String)
    message = Column(String)
    severity = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SchedulingResult(Base):
    __tablename__ = "scheduling_results"

    id = Column(Integer, primary_key=True, index=True)
    algorithm = Column(String)
    process_data = Column(String)
    gantt_data = Column(String)
    average_waiting_time = Column(Float)
    average_turnaround_time = Column(Float)
    average_response_time = Column(Float)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
