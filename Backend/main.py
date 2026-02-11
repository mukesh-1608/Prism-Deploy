from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import os
import socket

app = FastAPI()

# 1. ENABLE CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. DATA MODEL
class DeploymentRequest(BaseModel):
    repo_name: str

# 3. HELPER: FIND FREE PORT
def find_free_port(start_port=3000):
    port = start_port
    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            in_use = s.connect_ex(('localhost', port)) == 0
            if not in_use:
                return port
            port += 1

# 4. HELPER: RUN SCRIPT
def run_shell_script(repo_name: str, fe_port: int, be_port: int):
    # POINTING TO YOUR SPECIFIC FILE NAME
    script_path = "../MyScriptIO373.sh" 
    
    # Check if script exists
    if not os.path.exists(script_path):
        print(f"❌ ERROR: Script not found at {os.path.abspath(script_path)}")
        return

    print(f"🚀 STARTING SCRIPT: {repo_name} | FE: {fe_port} | BE: {be_port}")
    
    try:
        # We use "bash" to run the script. Ensure you have Git Bash installed.
        process = subprocess.Popen(
            ["bash", script_path, repo_name, str(fe_port), str(be_port)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        stdout, stderr = process.communicate()
        
        if process.returncode == 0:
            print(f"✅ SUCCESS for {repo_name}:\n{stdout}")
        else:
            print(f"⚠️ FAILED for {repo_name}:\n{stderr}")
            
    except Exception as e:
        print(f"❌ EXCEPTION: {str(e)}")

# 5. API ENDPOINT
@app.post("/deploy")
async def deploy_project(request: DeploymentRequest, background_tasks: BackgroundTasks):
    
    fe_port = find_free_port(3000)
    be_port = find_free_port(8000)
    
    background_tasks.add_task(run_shell_script, request.repo_name, fe_port, be_port)
    
    return {
        "status": "queued",
        "message": f"Deployment started for {request.repo_name}",
        "ports": {
            "frontend": fe_port,
            "backend": be_port
        },
        "url": f"https://{request.repo_name}.srm-tech.com"
    }

@app.get("/")
def read_root():
    return {"status": "Backend is running!"}