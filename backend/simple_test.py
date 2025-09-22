#!/usr/bin/env python3
"""
간단한 HTTP 서버로 API 테스트
"""
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

class APIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # CORS 헤더 추가
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        # URL 파싱
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # 카테고리 데이터
        categories = [
            {"id": 1, "name": "쌀국수", "description": "맛있는 쌀국수 메뉴"},
            {"id": 2, "name": "돈카츠,카레", "description": "돈카츠와 카레 메뉴"},
            {"id": 3, "name": "1인정식", "description": "1인용 정식 메뉴"},
            {"id": 4, "name": "사이드&추가메뉴", "description": "사이드 메뉴와 추가 메뉴"}
        ]
        
        # 메뉴 데이터
        menu_items = {
            1: [
                {"id": 1, "name": "차돌양지쌀국수", "price": 12000, "description": "부드러운 차돌양지가 들어간 쌀국수"},
                {"id": 2, "name": "한우쌀국수", "price": 15000, "description": "한우가 들어간 쌀국수"},
                {"id": 3, "name": "모듬쌀국수", "price": 13000, "description": "다양한 고기가 들어간 쌀국수"}
            ],
            2: [
                {"id": 4, "name": "프리미엄 로스카츠", "price": 18000, "description": "프리미엄 로스카츠"},
                {"id": 5, "name": "안심카츠", "price": 16000, "description": "부드러운 안심카츠"},
                {"id": 6, "name": "통모짜치즈돈카츠", "price": 17000, "description": "통모짜치즈가 들어간 돈카츠"}
            ],
            3: [
                {"id": 7, "name": "정식A", "price": 20000, "description": "정식A 세트"},
                {"id": 8, "name": "정식B", "price": 22000, "description": "정식B 세트"},
                {"id": 9, "name": "정식C", "price": 24000, "description": "정식C 세트"},
                {"id": 10, "name": "정식D", "price": 26000, "description": "정식D 세트"}
            ],
            4: [
                {"id": 11, "name": "공깃밥 추가", "price": 2000, "description": "공깃밥 추가"},
                {"id": 12, "name": "레몬추가", "price": 1000, "description": "레몬 추가"},
                {"id": 13, "name": "트러플오일 추가", "price": 3000, "description": "트러플오일 추가"}
            ]
        }
        
        # 음성 가이드 데이터
        voice_guide = {
            "welcome_message": "안녕하세요. 반갑습니다. 주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주시고, 못 정하셨으면 '메뉴'라고 말해 주세요.",
            "menu_guide": "저희 매장에는 다음과 같은 메뉴가 있습니다. 쌀국수 탭을 누르시면 차돌양지쌀국수, 한우쌀국수, 모듬쌀국수 등의 메뉴가 있습니다. 돈카츠,카레 탭을 누르시면 프리미엄 로스카츠, 안심카츠, 통모짜치즈돈카츠 등의 메뉴가 있습니다. 1인정식 탭을 누르시면 정식A, 정식B, 정식C, 정식D 등의 메뉴가 있습니다. 사이드&추가메뉴 탭을 누르시면 공깃밥 추가, 레몬추가, 트러플오일 추가 등의 메뉴가 있습니다. 주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주세요."
        }
        
        # 라우팅
        if path == '/categories':
            response = categories
        elif path.startswith('/categories/') and path.endswith('/menu'):
            # /categories/1/menu 형태
            parts = path.split('/')
            category_id = int(parts[2])
            response = menu_items.get(category_id, [])
        elif path == '/voice-guide/text':
            response = voice_guide
        else:
            response = {"error": "Not found"}
        
        # JSON 응답
        self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
    
    def do_OPTIONS(self):
        # CORS preflight 요청 처리
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8000), APIHandler)
    print("서버 시작: http://localhost:8000")
    print("카테고리: http://localhost:8000/categories")
    print("메뉴: http://localhost:8000/categories/1/menu")
    print("음성 가이드: http://localhost:8000/voice-guide/text")
    server.serve_forever()
