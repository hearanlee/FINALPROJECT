#!/usr/bin/env python3
"""
음성 주문 시스템 프론트엔드 실행 스크립트
"""
import subprocess
import sys
import webbrowser
import time
import threading

def start_frontend():
    """프론트엔드 서버 시작"""
    print("🌐 프론트엔드 서버를 시작합니다...")
    print("📱 접속 주소: http://localhost:3000/frontend.html")
    print("🛑 서버 중지: Ctrl+C")
    print("-" * 50)
    
    try:
        # Python HTTP 서버 시작
        subprocess.run([sys.executable, "-m", "http.server", "3000"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 프론트엔드 서버를 중지합니다...")
    except Exception as e:
        print(f"❌ 프론트엔드 서버 시작 실패: {e}")

def open_browser():
    """브라우저 열기"""
    time.sleep(2)  # 서버 시작 대기
    try:
        webbrowser.open("http://localhost:3000/frontend.html")
    except Exception as e:
        print(f"❌ 브라우저 열기 실패: {e}")

if __name__ == "__main__":
    # 브라우저 열기를 별도 스레드에서 시작
    browser_thread = threading.Thread(target=open_browser, daemon=True)
    browser_thread.start()
    
    # 프론트엔드 서버 시작
    start_frontend()
