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
        super().end_headers()

if __name__ == "__main__":
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print(f"프론트엔드 서버가 http://localhost:{PORT} 에서 실행 중입니다.")
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


