#!/usr/bin/env python3
"""
API 테스트 스크립트
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_categories():
    """카테고리 조회 테스트"""
    print("🔍 카테고리 조회 테스트...")
    response = requests.get(f"{BASE_URL}/categories")
    if response.status_code == 200:
        categories = response.json()
        print(f"✅ 카테고리 {len(categories)}개 조회 성공:")
        for category in categories:
            print(f"  - {category['display_name']} (ID: {category['id']})")
    else:
        print(f"❌ 카테고리 조회 실패: {response.status_code}")
    print()

def test_menu_by_category(category_id):
    """특정 카테고리의 메뉴 조회 테스트"""
    print(f"🔍 카테고리 {category_id} 메뉴 조회 테스트...")
    response = requests.get(f"{BASE_URL}/categories/{category_id}/menu")
    if response.status_code == 200:
        menu_items = response.json()
        print(f"✅ 메뉴 {len(menu_items)}개 조회 성공:")
        for item in menu_items:
            print(f"  - {item['name']}: {item['price']:,}원")
    else:
        print(f"❌ 메뉴 조회 실패: {response.status_code}")
    print()

def test_menu_detail(item_id):
    """메뉴 상세 정보 조회 테스트"""
    print(f"🔍 메뉴 {item_id} 상세 정보 조회 테스트...")
    response = requests.get(f"{BASE_URL}/menu/{item_id}")
    if response.status_code == 200:
        menu_detail = response.json()
        print(f"✅ 메뉴 상세 정보 조회 성공:")
        print(f"  - 메뉴명: {menu_detail['name']}")
        print(f"  - 가격: {menu_detail['price']:,}원")
        print(f"  - 카테고리: {menu_detail['category_name']}")
        print(f"  - 사용 가능한 옵션: {len(menu_detail['available_options'])}개")
        for option in menu_detail['available_options']:
            print(f"    * {option['name']}: +{option['price']:,}원")
    else:
        print(f"❌ 메뉴 상세 정보 조회 실패: {response.status_code}")
    print()

def test_voice_guide():
    """음성 안내 테스트"""
    print("🔍 음성 안내 테스트...")
    response = requests.get(f"{BASE_URL}/voice-guide/text")
    if response.status_code == 200:
        guide_data = response.json()
        print("✅ 음성 안내 텍스트 생성 성공:")
        print(guide_data['guide_text'])
    else:
        print(f"❌ 음성 안내 테스트 실패: {response.status_code}")
    print()

def test_create_order():
    """주문 생성 테스트"""
    print("🔍 주문 생성 테스트...")
    
    # 돈카츠 주문 (옵션 포함)
    order_data = {
        "items": [
            {
                "menu_item_id": 5,  # 프리미엄 로스카츠(등심)
                "quantity": 1,
                "options": [
                    {"option_id": 1, "quantity": 1},  # 밥많이
                    {"option_id": 3, "quantity": 1}   # 레몬추가
                ]
            }
        ]
    }
    
    response = requests.post(f"{BASE_URL}/orders", json=order_data)
    if response.status_code == 200:
        order = response.json()
        print("✅ 주문 생성 성공:")
        print(f"  - 주문번호: {order['order_number']}")
        print(f"  - 총 금액: {order['total_amount']:,}원")
        print(f"  - 상태: {order['status']}")
    else:
        print(f"❌ 주문 생성 실패: {response.status_code}")
        print(f"  - 오류 내용: {response.text}")
    print()

def main():
    """전체 테스트 실행"""
    print("🧪 음성 주문 시스템 API 테스트 시작")
    print("=" * 50)
    
    try:
        # 기본 연결 테스트
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ 서버 연결 성공")
        else:
            print("❌ 서버 연결 실패")
            return
        print()
        
        # 각 테스트 실행
        test_categories()
        test_menu_by_category(1)  # 쌀국수
        test_menu_by_category(2)  # 돈카츠,카레
        test_menu_by_category(3)  # 1인정식
        test_menu_detail(5)  # 프리미엄 로스카츠
        test_menu_detail(14)  # 정식A
        test_voice_guide()
        test_create_order()
        
        print("🎉 모든 테스트 완료!")
        
    except requests.exceptions.ConnectionError:
        print("❌ 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.")
    except Exception as e:
        print(f"❌ 테스트 중 오류 발생: {e}")

if __name__ == "__main__":
    main()
