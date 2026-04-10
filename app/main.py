"""
Hotel Property Management System - FastAPI Application

Main application entry point. Initializes FastAPI app with all routers,
middleware, and startup events.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import select

from app.core.database import create_tables, async_session_maker
from app.core.config import get_settings
from app.core.security import get_password_hash
from app.models.user import User
from app.routers import (
    auth_router,
    room_type_router,
    inventory_router,
    booking_router,
    customer_router,
    calendar_router,
    multi_room_booking_router,
    audit_log_router,
    analytics_router
)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan event handler.
    Runs on startup and shutdown.
    """
    # Startup
    print("🏨 Starting Hotel PMS API...")
    
    # Create database tables
    await create_tables()
    print("✅ Database tables created")
    
    # Optional admin bootstrap for environments that need fixed credentials.
    if settings.BOOTSTRAP_ADMIN_ON_STARTUP:
        async with async_session_maker() as session:
            result = await session.execute(
                select(User).where(User.email == settings.ADMIN_EMAIL)
            )
            admin = result.scalar_one_or_none()
            
            if not admin:
                admin = User(
                    email=settings.ADMIN_EMAIL,
                    hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                    is_active=True
                )
                session.add(admin)
                await session.commit()
                print(f"✅ Admin user created: {settings.ADMIN_EMAIL}")
            else:
                print(f"ℹ️  Admin user already exists: {settings.ADMIN_EMAIL}")
    else:
        print("ℹ️  Admin bootstrap disabled; first user must sign up")
    
    print("🚀 Hotel PMS API is ready!")
    print(f"📚 API docs available at: http://127.0.0.1:8000/docs")
    
    yield
    
    # Shutdown
    print("👋 Shutting down Hotel PMS API...")


# Create FastAPI application
app = FastAPI(
    title="Hotel Property Management System",
    description="""
    Backend API for Hotel Property Management System (PMS).
    
    ## Features
    
    * **Authentication**: JWT-based admin authentication
    * **Room Types**: CRUD operations for room categories
    * **Inventory**: Date-wise room availability management
    * **Bookings**: Transactional booking with overbooking prevention
    * **Multi-Room Bookings**: Support for multiple room types in single booking
    * **Customers**: CRM with booking history and balance tracking
    * **Calendar**: Availability grid and booking events for calendar UI
    * **Audit Logs**: Compliance and debugging trail for all system changes
    
    ## Getting Started
    
    1. Login with admin credentials to get a JWT token
    2. Use the token in the Authorization header for protected endpoints
    3. Create room types to auto-generate inventory
    4. Create bookings to manage reservations
    """,
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Explicit origins needed for allow_credentials=True
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions gracefully."""
    if isinstance(exc, HTTPException):
        raise exc
    
    # Log the error (in production, use proper logging)
    print(f"Unexpected error: {exc}")
    
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."}
    )


# Include routers
app.include_router(auth_router)
app.include_router(room_type_router)
app.include_router(inventory_router)
app.include_router(booking_router)
app.include_router(customer_router)
app.include_router(calendar_router)
app.include_router(multi_room_booking_router)
app.include_router(audit_log_router)
app.include_router(analytics_router)


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy", "service": "hotel-pms"}


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to Hotel PMS API",
        "docs": "/docs",
        "health": "/health"
    }
