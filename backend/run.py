#!/usr/bin/env python3
"""
포핸즈 음식점 FastAPI 서버 실행 스크립트
"""

import uvicorn
from main import app

if __name__ == "__main__":
    print("🚀 포핸즈 음식점 API 서버를 시작합니다...")
    print("📍 서버 주소: http://localhost:8000")
    print("📚 API 문서: http://localhost:8000/docs")
    print("🎤 음성 대화: http://localhost:3000")
    print("=" * 50)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
