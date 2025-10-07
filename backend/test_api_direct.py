#!/usr/bin/env python3
"""
API 직접 테스트 스크립트
백엔드 서버를 직접 실행하고 API를 테스트합니다.
"""

import sys
import os
import asyncio
from fastapi.testclient import TestClient

# 현재 디렉토리를 Python 경로에 추가
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import app

def test_api():
    print("🔍 API 직접 테스트 시작...")
    
    # TestClient 생성
    client = TestClient(app)
    
    # 1. 서버 상태 확인
    print("\n1. 서버 상태 확인...")
    try:
        response = client.get("/")
        print(f"✅ 서버 응답: {response.status_code}")
        print(f"   응답 내용: {response.json()}")
    except Exception as e:
        print(f"❌ 서버 연결 실패: {e}")
        return
    
    # 2. 메뉴 추천 API 테스트 - 쌀국수 추천
    print("\n2. 메뉴 추천 API 테스트 (식사 → 따뜻한 → 안매운 → 면)...")
    try:
        test_data = {
            "meal_type": "식사",
            "temperature": "따뜻한",
            "spiciness": "안매운",
            "food_type": "면"
        }
        
        response = client.post("/api/recommend-menu", json=test_data)
        print(f"✅ 응답 상태: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   추천 메뉴 개수: {data['total_count']}")
            print(f"   선택 요약: {data['selection_summary']}")
            print("   추천 메뉴들:")
            for menu in data['recommendations']:
                print(f"     - {menu['name']} ({menu['price']:,}원)")
        else:
            print(f"❌ 오류 응답: {response.text}")
            
    except Exception as e:
        print(f"❌ 메뉴 추천 API 호출 실패: {e}")
    
    # 3. 메뉴 추천 API 테스트 - 밥 추천
    print("\n3. 메뉴 추천 API 테스트 (식사 → 따뜻한 → 안매운 → 밥)...")
    try:
        test_data = {
            "meal_type": "식사",
            "temperature": "따뜻한",
            "spiciness": "안매운",
            "food_type": "밥"
        }
        
        response = client.post("/api/recommend-menu", json=test_data)
        print(f"✅ 응답 상태: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   추천 메뉴 개수: {data['total_count']}")
            print(f"   선택 요약: {data['selection_summary']}")
            print("   추천 메뉴들:")
            for menu in data['recommendations']:
                print(f"     - {menu['name']} ({menu['price']:,}원)")
        else:
            print(f"❌ 오류 응답: {response.text}")
            
    except Exception as e:
        print(f"❌ 메뉴 추천 API 호출 실패: {e}")
    
    # 4. 추천 규칙 조회 API 테스트
    print("\n4. 추천 규칙 조회 API 테스트...")
    try:
        response = client.get("/api/recommendation-rules")
        print(f"✅ 응답 상태: {response.status_code}")
        
        if response.status_code == 200:
            rules = response.json()
            print(f"   등록된 추천 규칙 개수: {len(rules)}")
            for rule in rules:
                print(f"     - {rule['meal_type']} → {rule['temperature']} → {rule['spiciness']} → {rule['food_type']}")
        else:
            print(f"❌ 오류 응답: {response.text}")
            
    except Exception as e:
        print(f"❌ 추천 규칙 조회 API 호출 실패: {e}")
    
    # 5. 기존 메뉴 조회 API 테스트
    print("\n5. 기존 메뉴 조회 API 테스트...")
    try:
        response = client.get("/menus")
        print(f"✅ 응답 상태: {response.status_code}")
        
        if response.status_code == 200:
            menus = response.json()
            print(f"   전체 메뉴 개수: {len(menus)}")
            print("   메뉴 카테고리별 개수:")
            categories = {}
            for menu in menus:
                cat = menu['category']
                categories[cat] = categories.get(cat, 0) + 1
            for cat, count in categories.items():
                print(f"     - {cat}: {count}개")
        else:
            print(f"❌ 오류 응답: {response.text}")
            
    except Exception as e:
        print(f"❌ 메뉴 조회 API 호출 실패: {e}")
    
    print("\n🎉 API 테스트 완료!")

if __name__ == "__main__":
    test_api()

