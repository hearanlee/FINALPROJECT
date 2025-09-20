#!/usr/bin/env python3
"""
음성 주문 시스템 전체 프로젝트 실행 스크립트
"""
import subprocess
import sys
import time
import webbrowser
import threading
from pathlib import Path

def start_backend():
    """백엔드 서버 시작"""
    print("🚀 백엔드 서버를 시작합니다...")
    try:
        subprocess.run([sys.executable, "run_server.py"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 백엔드 서버를 중지합니다...")
    except Exception as e:
        print(f"❌ 백엔드 서버 시작 실패: {e}")

def start_frontend():
    """프론트엔드 서버 시작"""
    print("🌐 프론트엔드 서버를 시작합니다...")
    try:
        # Python HTTP 서버 시작
        subprocess.run([sys.executable, "-m", "http.server", "3000"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 프론트엔드 서버를 중지합니다...")
    except Exception as e:
        print(f"❌ 프론트엔드 서버 시작 실패: {e}")

def open_browser():
    """브라우저 열기"""
    time.sleep(3)  # 서버 시작 대기
    print("🌐 브라우저를 열어주세요: http://localhost:3000")
    try:
        webbrowser.open("http://localhost:3000")
    except Exception as e:
        print(f"❌ 브라우저 열기 실패: {e}")

def main():
    """메인 실행 함수"""
    print("🍽️ 음성 주문 시스템 시작")
    print("=" * 50)
    
    # 현재 디렉토리 확인
    current_dir = Path.cwd()
    print(f"📁 작업 디렉토리: {current_dir}")
    
    # 필요한 파일 확인
    required_files = [
        "main.py", "database.py", "models.py", "run_server.py",
        "index.html", "menu.html", "order.html", "script.js", "api.js"
    ]
    
    missing_files = [f for f in required_files if not Path(f).exists()]
    if missing_files:
        print(f"❌ 필요한 파일이 없습니다: {', '.join(missing_files)}")
        return
    
    print("✅ 모든 필요한 파일이 확인되었습니다.")
    
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
