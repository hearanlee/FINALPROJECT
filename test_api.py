import requests
import json
import time

def test_api():
    base_url = "http://localhost:8000"
    
    print("🔍 API 테스트 시작...")
    
    # 1. 서버 상태 확인
    try:
        print("\n1. 서버 상태 확인...")
        response = requests.get(f"{base_url}/", timeout=5)
        print(f"✅ 서버 응답: {response.status_code}")
        print(f"   응답 내용: {response.json()}")
    except requests.exceptions.RequestException as e:
        print(f"❌ 서버 연결 실패: {e}")
        return
    
    # 2. 메뉴 추천 API 테스트 - 쌀국수 추천
    try:
        print("\n2. 메뉴 추천 API 테스트 (식사 → 따뜻한 → 안매운 → 면)...")
        test_data = {
            "meal_type": "식사",
            "temperature": "따뜻한",
            "spiciness": "안매운",
            "food_type": "면"
        }
        
        response = requests.post(
            f"{base_url}/api/recommend-menu",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
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
            
    except requests.exceptions.RequestException as e:
        print(f"❌ 메뉴 추천 API 호출 실패: {e}")
    
    # 3. 메뉴 추천 API 테스트 - 밥 추천
    try:
        print("\n3. 메뉴 추천 API 테스트 (식사 → 따뜻한 → 안매운 → 밥)...")
        test_data = {
            "meal_type": "식사",
            "temperature": "따뜻한",
            "spiciness": "안매운",
            "food_type": "밥"
        }
        
        response = requests.post(
            f"{base_url}/api/recommend-menu",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
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
            
    except requests.exceptions.RequestException as e:
        print(f"❌ 메뉴 추천 API 호출 실패: {e}")
    
    # 4. 추천 규칙 조회 API 테스트
    try:
        print("\n4. 추천 규칙 조회 API 테스트...")
        response = requests.get(f"{base_url}/api/recommendation-rules", timeout=10)
        
        print(f"✅ 응답 상태: {response.status_code}")
        if response.status_code == 200:
            rules = response.json()
            print(f"   등록된 추천 규칙 개수: {len(rules)}")
            for rule in rules:
                print(f"     - {rule['meal_type']} → {rule['temperature']} → {rule['spiciness']} → {rule['food_type']}")
        else:
            print(f"❌ 오류 응답: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ 추천 규칙 조회 API 호출 실패: {e}")
    
    print("\n🎉 API 테스트 완료!")

if __name__ == "__main__":
    test_api()

