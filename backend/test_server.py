#!/usr/bin/env python3
"""
간단한 테스트 서버 - CORS 문제 해결
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="음성 주문 시스템 API", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "음성 주문 시스템 API"}

@app.get("/categories")
async def get_categories():
    """모든 카테고리 조회"""
    return [
        {"id": 1, "name": "쌀국수", "description": "맛있는 쌀국수 메뉴"},
        {"id": 2, "name": "돈카츠,카레", "description": "돈카츠와 카레 메뉴"},
        {"id": 3, "name": "1인정식", "description": "1인용 정식 메뉴"},
        {"id": 4, "name": "사이드&추가메뉴", "description": "사이드 메뉴와 추가 메뉴"}
    ]

@app.get("/categories/{category_id}/menu")
async def get_menu_by_category(category_id: int):
    """특정 카테고리의 메뉴 조회"""
    if category_id == 1:
        return [
            {"id": 1, "name": "차돌양지쌀국수", "price": 12000, "description": "부드러운 차돌양지가 들어간 쌀국수"},
            {"id": 2, "name": "한우쌀국수", "price": 15000, "description": "한우가 들어간 쌀국수"},
            {"id": 3, "name": "모듬쌀국수", "price": 13000, "description": "다양한 고기가 들어간 쌀국수"}
        ]
    elif category_id == 2:
        return [
            {"id": 4, "name": "프리미엄 로스카츠", "price": 18000, "description": "프리미엄 로스카츠"},
            {"id": 5, "name": "안심카츠", "price": 16000, "description": "부드러운 안심카츠"},
            {"id": 6, "name": "통모짜치즈돈카츠", "price": 17000, "description": "통모짜치즈가 들어간 돈카츠"}
        ]
    elif category_id == 3:
        return [
            {"id": 7, "name": "정식A", "price": 20000, "description": "정식A 세트"},
            {"id": 8, "name": "정식B", "price": 22000, "description": "정식B 세트"},
            {"id": 9, "name": "정식C", "price": 24000, "description": "정식C 세트"},
            {"id": 10, "name": "정식D", "price": 26000, "description": "정식D 세트"}
        ]
    elif category_id == 4:
        return [
            {"id": 11, "name": "공깃밥 추가", "price": 2000, "description": "공깃밥 추가"},
            {"id": 12, "name": "레몬추가", "price": 1000, "description": "레몬 추가"},
            {"id": 13, "name": "트러플오일 추가", "price": 3000, "description": "트러플오일 추가"}
        ]
    else:
        return []

@app.get("/voice-guide")
async def get_voice_guide():
    """음성 가이드 텍스트 조회"""
    return {
        "welcome_message": "안녕하세요. 반갑습니다. 주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주시고, 못 정하셨으면 '메뉴'라고 말해 주세요.",
        "menu_guide": "저희 매장에는 다음과 같은 메뉴가 있습니다. 쌀국수 탭을 누르시면 차돌양지쌀국수, 한우쌀국수, 모듬쌀국수 등의 메뉴가 있습니다. 돈카츠,카레 탭을 누르시면 프리미엄 로스카츠, 안심카츠, 통모짜치즈돈카츠 등의 메뉴가 있습니다. 1인정식 탭을 누르시면 정식A, 정식B, 정식C, 정식D 등의 메뉴가 있습니다. 사이드&추가메뉴 탭을 누르시면 공깃밥 추가, 레몬추가, 트러플오일 추가 등의 메뉴가 있습니다. 주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주세요."
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
