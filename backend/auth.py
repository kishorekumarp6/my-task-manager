from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
import bcrypt

# ============================================================================
# EDUCATIONAL MOCK AUTHENTICATION SYSTEM
# ============================================================================
# This is a simplified authentication system for lab/workshop purposes.
# In production, you would:
#   - Store users in a database (not in-memory)
#   - Use environment variables for SECRET_KEY
#   - Implement user registration, password reset, email verification
#   - Consider OAuth2 providers (Azure AD, Auth0, Okta)
# ============================================================================

SECRET_KEY = "demo-secret-key-change-in-production-use-env-variable"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Mock user database - No external identity provider needed!
# Pre-hashed passwords for immediate testing
MOCK_USERS = {
    "demo@example.com": {
        "username": "demo@example.com",
        "full_name": "Demo User",
        "email": "demo@example.com",
        # Password: "password123"
        "hashed_password": "$2b$12$PIEM1eYynJKev9TnCCL4J.jawnNZ3LPGnK76U0ys3HbEDA2RW9X2m"
    },
    "admin@example.com": {
        "username": "admin@example.com",
        "full_name": "Admin User",
        "email": "admin@example.com",
        # Password: "admin123"
        "hashed_password": "$2b$12$/AbvsebV1BCWgD4f4fPdaeDxCSF5i2yhiaXWCMOyZ/tfQinCK3E1a"
    }
}


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify that a plain text password matches the hashed password.
    Uses bcrypt for secure password hashing.
    """
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def get_password_hash(password: str) -> str:
    """
    Hash a plain text password using bcrypt.
    Useful if you want to add user registration functionality.
    """
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def authenticate_user(username: str, password: str) -> dict | None:
    """
    Authenticate a user by username and password.
    Returns user dict if credentials are valid, None otherwise.
    """
    user = MOCK_USERS.get(username)
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create a JWT access token with expiration.
    
    Args:
        data: Dictionary of claims to encode in the token (typically {"sub": username})
        expires_delta: Optional custom expiration time
    
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    """
    Dependency that validates JWT token and returns the current user's username.
    Raises HTTPException if token is invalid or expired.
    
    Usage in endpoints:
        @app.get("/protected/")
        async def protected_route(current_user: str = Depends(get_current_user)):
            return {"message": f"Hello {current_user}"}
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Verify user still exists in our mock database
    user = MOCK_USERS.get(username)
    if user is None:
        raise credentials_exception
    
    return username


async def get_current_user_optional(token: str | None = None) -> str | None:
    """
    Optional authentication dependency - returns username if token provided and valid,
    None if no token provided. Useful for endpoints that work with or without auth.
    
    NOTE: This is a simplified implementation. In the main endpoints,
    we'll keep authentication optional to maintain backward compatibility.
    """
    if token is None:
        return None
    
    try:
        return await get_current_user(token)
    except HTTPException:
        return None
