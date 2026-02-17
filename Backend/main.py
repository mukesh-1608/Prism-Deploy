import time
import jwt
import os
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

app = FastAPI()
security = HTTPBearer()

# --- CONFIGURATION ---
# In a real app, this comes from AWS. For now, it's our local secret.
SECRET_KEY = "prism-local-development-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15

# Enable CORS so your React Frontend can talk to this Python Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA MODELS ---
class LoginRequest(BaseModel):
    org_id: str

# --- 1. THE LOGIN ENDPOINT (Issues the Badge) ---
@app.post("/api/login")
async def login(request: LoginRequest):
    """
    Takes an Org ID, validates it (mock logic), and returns a signed JWT.
    """
    # MOCK VALIDATION: In real life, AWS checks the password here.
    # We just check if they typed something.
    if not request.org_id or len(request.org_id) < 3:
        raise HTTPException(status_code=400, detail="Invalid Organization ID")

    # Create the Badge (JWT)
    expiration = time.time() + (ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    
    token_data = {
        "sub": "user_dev_01",       # Subject (User ID)
        "org": request.org_id,      # Organization
        "role": "admin",            # Role
        "exp": expiration           # Expiration Time (15 mins from now)
    }
    
    # Sign the token using our secret key
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

# --- 2. THE BOUNCER (Verifies the Badge) ---
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Use this function to protect future routes. 
    It ensures the user has a valid, unexpired badge.
    """
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session Expired. Please login again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid Authentication Token")

# --- 3. SYSTEM CHECK ---
@app.get("/health")
async def health_check():
    return {"status": "Prism Auth System Online", "mode": "MOCK_AWS_SSO"}

# Run with: python main.py
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)