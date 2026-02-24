"""
Startup script for AXENT AI Backend
Run from: backend/ai_service/
"""
import subprocess
import sys
import os

def main():
    print("=" * 60)
    print("🚀 AXENT AI Backend - Starting...")
    print("=" * 60)
    
    # Check if in venv
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("\n⚠️  WARNING: Virtual environment not activated!")
        print("   Please run: .\\venv\\Scripts\\activate (Windows)")
        print("   Or: source venv/bin/activate (Unix/Mac)\n")
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            return
    
    # Check dependencies
    try:
        import fastapi
        import uvicorn
        print("✓ Dependencies found")
    except ImportError:
        print("\n❌ Missing dependencies!")
        print("   Run: pip install -r requirements.txt\n")
        return
    
    # Check .env file
    if not os.path.exists('.env'):
        print("\n⚠️  .env file not found, using defaults")
        print("   Copy .env.example to .env for custom configuration\n")
    
    print("\nStarting FastAPI server...")
    print("📊 API Docs: http://localhost:8000/docs")
    print("🏥 Health Check: http://localhost:8000/health")
    print("\nPress Ctrl+C to stop\n")
    print("=" * 60)
    
    # Start uvicorn
    subprocess.run([
        sys.executable, "-m", "uvicorn",
        "app.main:app",
        "--reload",
        "--host", "0.0.0.0",
        "--port", "8000"
    ])

if __name__ == "__main__":
    main()
