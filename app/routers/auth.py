"""
Authentication router for user login and JWT token generation.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import timedelta

from app.core.database import get_db
from app.core.security import (
    verify_password,
    create_access_token,
    get_current_user,
    get_password_hash,
)
from app.core.config import get_settings
from app.models.user import User
from app.schemas.user import Token, LoginRequest, UserRead, UserCreate, SetupStatus

router = APIRouter(prefix="/auth", tags=["Authentication"])
settings = get_settings()


def normalize_email(email: str) -> str:
    """Normalize email values for consistent auth lookups."""
    return email.strip().lower()


async def get_user_count(db: AsyncSession) -> int:
    """Get total number of users in the auth table."""
    result = await db.execute(select(func.count(User.id)))
    return int(result.scalar_one() or 0)


def create_user_token(email: str) -> Token:
    """Create a bearer token for the provided user email."""
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": email},
        expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.get("/setup-status", response_model=SetupStatus)
async def setup_status(db: AsyncSession = Depends(get_db)):
    """
    Return whether public signup is enabled.
    """
    user_count = await get_user_count(db)
    signup_enabled = settings.PUBLIC_SIGNUP_ENABLED or user_count == 0
    return SetupStatus(signup_enabled=signup_enabled, user_count=user_count)


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(
    payload: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Public signup endpoint for user registration.
    """
    user_count = await get_user_count(db)
    signup_enabled = settings.PUBLIC_SIGNUP_ENABLED or user_count == 0
    if not signup_enabled:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Signup is disabled"
        )

    normalized_email = normalize_email(str(payload.email))

    existing_user_result = await db.execute(
        select(User).where(User.email == normalized_email)
    )
    existing_user = existing_user_result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )

    new_user = User(
        email=normalized_email,
        hashed_password=get_password_hash(payload.password),
        is_active=True
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return create_user_token(new_user.email)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate user and return JWT token.
    
    - **username**: User email address
    - **password**: User password
    
    Returns a JWT access token for authenticating subsequent requests.
    """
    # Find user by email (OAuth2 uses 'username' field)
    normalized_email = normalize_email(form_data.username)
    result = await db.execute(select(User).where(User.email == normalized_email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    
    return create_user_token(user.email)


@router.post("/login/json", response_model=Token)
async def login_json(
    credentials: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate user with JSON body and return JWT token.
    
    Alternative to form-based login for API clients.
    """
    normalized_email = normalize_email(str(credentials.email))
    result = await db.execute(select(User).where(User.email == normalized_email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    
    return create_user_token(user.email)


@router.get("/me", response_model=UserRead)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user information.
    
    Requires valid JWT token in Authorization header.
    """
    return current_user
