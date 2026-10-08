from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import agents, metrics, dashboard

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CSOC Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents.router)
app.include_router(metrics.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "Welcome to CSOC Platform API"}
