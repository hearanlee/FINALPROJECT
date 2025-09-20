#!/usr/bin/env python3
"""
음성 주문 시스템 백엔드 서버 실행 스크립트
"""
import uvicorn
from main import app

if __name__ == "__main__":
    print("🍽️ 음성 주문 시스템 백엔드 서버를 시작합니다...")
    print("📡 서버 주소: http://localhost:8000")
    print("📚 API 문서: http://localhost:8000/docs")
    print("🛑 서버 중지: Ctrl+C")
    print("-" * 50)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,  # 개발 중 코드 변경 시 자동 재시작
        log_level="info"
    )
