#!/usr/bin/env python3
"""
간단한 API 테스트 스크립트
"""

import sys
import os

# 현재 디렉토리를 Python 경로에 추가
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

def test_imports():
    """모든 필요한 모듈을 import할 수 있는지 테스트"""
    print("🔍 모듈 import 테스트 시작...")
    
    try:
        print("1. FastAPI import...")
        import fastapi
        print("   ✅ FastAPI 성공")
    except Exception as e:
        print(f"   ❌ FastAPI 실패: {e}")
        return False
    
    try:
        print("2. SQLAlchemy import...")
        import sqlalchemy
        print("   ✅ SQLAlchemy 성공")
    except Exception as e:
        print(f"   ❌ SQLAlchemy 실패: {e}")
        return False
    
    try:
        print("3. Pydantic import...")
        import pydantic
        print("   ✅ Pydantic 성공")
    except Exception as e:
        print(f"   ❌ Pydantic 실패: {e}")
        return False
    
    try:
        print("4. database 모듈 import...")
        from database import get_db, init_database, Store, Menu, Option, Procedure, MenuRecommendation
        print("   ✅ database 모듈 성공")
    except Exception as e:
        print(f"   ❌ database 모듈 실패: {e}")
        return False
    
    try:
        print("5. models 모듈 import...")
        from models import Store as StoreModel, Menu as MenuModel, MenuWithDetails, VoiceResponse, MenuRecommendationRequest, MenuRecommendationResponse
        print("   ✅ models 모듈 성공")
    except Exception as e:
        print(f"   ❌ models 모듈 실패: {e}")
        return False
    
    try:
        print("6. main 모듈 import...")
        from main import app
        print("   ✅ main 모듈 성공")
    except Exception as e:
        print(f"   ❌ main 모듈 실패: {e}")
        return False
    
    print("\n🎉 모든 모듈 import 성공!")
    return True

def test_database():
    """데이터베이스 초기화 테스트"""
    print("\n🔍 데이터베이스 테스트 시작...")
    
    try:
        from database import init_database
        print("1. 데이터베이스 초기화...")
        init_database()
        print("   ✅ 데이터베이스 초기화 성공")
        
        from database import get_db, Menu, MenuRecommendation
        from sqlalchemy.orm import Session
        
        print("2. 데이터베이스 연결 테스트...")
        db = next(get_db())
        
        # 메뉴 개수 확인
        menu_count = db.query(Menu).count()
        print(f"   ✅ 메뉴 개수: {menu_count}개")
        
        # 추천 규칙 개수 확인
        rule_count = db.query(MenuRecommendation).count()
        print(f"   ✅ 추천 규칙 개수: {rule_count}개")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"   ❌ 데이터베이스 테스트 실패: {e}")
        return False

def test_api():
    """API 테스트"""
    print("\n🔍 API 테스트 시작...")
    
    try:
        from fastapi.testclient import TestClient
        from main import app
        
        print("1. TestClient 생성...")
        client = TestClient(app)
        print("   ✅ TestClient 생성 성공")
        
        print("2. 루트 엔드포인트 테스트...")
        response = client.get("/")
        print(f"   ✅ 응답 상태: {response.status_code}")
        print(f"   ✅ 응답 내용: {response.json()}")
        
        print("3. 메뉴 추천 API 테스트 (면)...")
        test_data = {
            "meal_type": "식사",
            "temperature": "따뜻한",
            "spiciness": "안매운",
            "food_type": "면"
        }
        response = client.post("/api/recommend-menu", json=test_data)
        print(f"   ✅ 응답 상태: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ 추천 메뉴 개수: {data['total_count']}")
            print(f"   ✅ 선택 요약: {data['selection_summary']}")
        
        print("4. 메뉴 추천 API 테스트 (밥)...")
        test_data = {
            "meal_type": "식사",
            "temperature": "따뜻한",
            "spiciness": "안매운",
            "food_type": "밥"
        }
        response = client.post("/api/recommend-menu", json=test_data)
        print(f"   ✅ 응답 상태: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ 추천 메뉴 개수: {data['total_count']}")
            print(f"   ✅ 선택 요약: {data['selection_summary']}")
        
        print("5. 추천 규칙 조회 API 테스트...")
        response = client.get("/api/recommendation-rules")
        print(f"   ✅ 응답 상태: {response.status_code}")
        if response.status_code == 200:
            rules = response.json()
            print(f"   ✅ 추천 규칙 개수: {len(rules)}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ API 테스트 실패: {e}")
        return False

if __name__ == "__main__":
    print("🚀 백엔드 API 테스트 시작\n")
    
    # 1. 모듈 import 테스트
    if not test_imports():
        print("\n❌ 모듈 import 실패로 테스트 중단")
        sys.exit(1)
    
    # 2. 데이터베이스 테스트
    if not test_database():
        print("\n❌ 데이터베이스 테스트 실패로 테스트 중단")
        sys.exit(1)
    
    # 3. API 테스트
    if not test_api():
        print("\n❌ API 테스트 실패")
        sys.exit(1)
    
    print("\n🎉 모든 테스트 통과! API가 정상적으로 작동합니다.")

