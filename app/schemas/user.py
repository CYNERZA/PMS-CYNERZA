"""
Pydantic schemas for user authentication.
"""

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    """Base user schema with common fields."""
    email: EmailStr


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str


class UserRead(UserBase):
    """Schema for reading user data."""
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """JWT token response schema."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token payload data."""
    email: Optional[str] = None


class LoginRequest(BaseModel):
    """Login request with email and password."""
    email: EmailStr
    password: str


class SetupStatus(BaseModel):
    """Public auth setup status for first-time onboarding."""
    signup_enabled: bool
    user_count: int
