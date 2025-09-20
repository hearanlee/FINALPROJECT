#!/usr/bin/env python3
"""
음성 주문 시스템 실행 스크립트
백엔드와 프론트엔드를 각각의 폴더에서 실행
"""
import subprocess
import sys
import time
import webbrowser
import threading
from pathlib import Path
import os

def start_backend():
    """백엔드 서버 시작"""
    print("🚀 백엔드 서버를 시작합니다...")
    try:
        # backend 폴더로 이동하여 실행
        backend_dir = Path(__file__).parent / "backend"
        subprocess.run([sys.executable, "run_backend.py"], cwd=backend_dir, check=True)
    except KeyboardInterrupt:
        print("\n🛑 백엔드 서버를 중지합니다...")
    except Exception as e:
        print(f"❌ 백엔드 서버 시작 실패: {e}")

def start_frontend():
    """프론트엔드 서버 시작"""
    print("🌐 프론트엔드 서버를 시작합니다...")
    try:
        # frontend 폴더로 이동하여 실행
        frontend_dir = Path(__file__).parent / "frontend"
        subprocess.run([sys.executable, "run_frontend.py"], cwd=frontend_dir, check=True)
    except KeyboardInterrupt:
        print("\n🛑 프론트엔드 서버를 중지합니다...")
    except Exception as e:
        print(f"❌ 프론트엔드 서버 시작 실패: {e}")

def open_browser():
    """브라우저 열기"""
    time.sleep(3)  # 서버 시작 대기
    print("🌐 브라우저를 열어주세요: http://localhost:3000/frontend.html")
    try:
        webbrowser.open("http://localhost:3000/frontend.html")
    except Exception as e:
        print(f"❌ 브라우저 열기 실패: {e}")

def main():
    """메인 실행 함수"""
    print("🍽️ 음성 주문 시스템 시작")
    print("=" * 50)
    
    # 필요한 폴더와 파일 확인
    backend_dir = Path("backend")
    frontend_dir = Path("frontend")
    
    if not backend_dir.exists():
        print("❌ backend 폴더가 없습니다.")
        return
    
    if not frontend_dir.exists():
        print("❌ frontend 폴더가 없습니다.")
        return
    
    backend_file = backend_dir / "app.py"
    frontend_file = frontend_dir / "frontend.html"
    
    if not backend_file.exists():
        print("❌ backend/app.py 파일이 없습니다.")
        return
    
    if not frontend_file.exists():
        print("❌ frontend/frontend.html 파일이 없습니다.")
        return
    
    print("✅ 모든 필요한 파일이 확인되었습니다.")
    print("📁 백엔드 폴더: backend/")
    print("📁 프론트엔드 폴더: frontend/")
    print("📡 백엔드 API: http://localhost:8000")
    print("🌐 프론트엔드: http://localhost:3000/frontend.html")
    print("🛑 중지하려면 Ctrl+C를 누르세요")
    print("-" * 50)
    
    try:
        # 백엔드 서버를 별도 스레드에서 시작
        backend_thread = threading.Thread(target=start_backend, daemon=True)
        backend_thread.start()
        
        # 브라우저 열기를 별도 스레드에서 시작
        browser_thread = threading.Thread(target=open_browser, daemon=True)
        browser_thread.start()
        
        # 프론트엔드 서버 시작 (메인 스레드)
        start_frontend()
        
    except KeyboardInterrupt:
        print("\n🛑 프로젝트를 중지합니다...")
    except Exception as e:
        print(f"❌ 프로젝트 실행 중 오류 발생: {e}")

if __name__ == "__main__":
    main()
