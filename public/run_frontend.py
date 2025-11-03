#!/usr/bin/env python3
"""
간단한 HTTP 서버를 실행하여 프론트엔드 파일들을 제공합니다.
"""

import http.server
import socketserver
import os
import sys

# 현재 디렉토리를 웹 루트로 설정
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORT = 3000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORS 헤더 추가
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # .mjs 파일에 대한 올바른 MIME 타입 설정
        if self.path.endswith('.mjs'):
            self.send_header('Content-Type', 'application/javascript')
        super().end_headers()

if __name__ == "__main__":
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            import socket
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
            
            # 모든 네트워크 인터페이스의 IP 주소 찾기
            try:
                # 가장 일반적인 로컬 IP 주소 가져오기
                s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                s.connect(("8.8.8.8", 80))
                local_ip = s.getsockname()[0]
                s.close()
            except:
                pass
            
            print("=" * 60)
            print(f"✅ 프론트엔드 서버가 실행 중입니다!")
            print("=" * 60)
            print(f"📍 로컬 접속:")
            print(f"   http://localhost:{PORT}")
            print(f"   http://127.0.0.1:{PORT}")
            print(f"")
            print(f"📱 모바일 접속 (같은 Wi-Fi 필요):")
            print(f"   http://{local_ip}:{PORT}")
            print("=" * 60)
            print("종료하려면 Ctrl+C를 누르세요.")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n서버가 종료되었습니다.")
        sys.exit(0)
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"포트 {PORT}이 이미 사용 중입니다. 다른 포트를 사용하거나 기존 프로세스를 종료하세요.")
        else:
            print(f"서버 시작 중 오류가 발생했습니다: {e}")
        sys.exit(1)


