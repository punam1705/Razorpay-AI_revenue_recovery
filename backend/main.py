
from fastapi import FastAPI
from sqlalchemy import text

from database import Base, engine
from models.customer import Customer
from models.payment import Payment
from models.recovery import Recovery
from routes.payment_routes import router as payment_router
from routes.customer_routes import router as customer_router
from routes.recovery_routes import router as recovery_router
from routes.ai_routes import router as ai_router
from fastapi.middleware.cors import CORSMiddleware
from routes.dashboard_routes import router as dashboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Revenue Recovery API",
    description="AI-powered payment recovery system",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://razorpay-ai-revenue-recovery.vercel.app/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payment_router)
app.include_router(customer_router)
app.include_router(recovery_router)
app.include_router(ai_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {
        "message": "AI Revenue Recovery API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/health/database")
def database_health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected",
        }

    except Exception as error:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(error),
        }