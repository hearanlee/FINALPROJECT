from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import openai
import os
import httpx
from dotenv import load_dotenv

from database import get_db, init_database, Store, Menu, Option, Procedure, MenuRecommendation
from models import Store as StoreModel, Menu as MenuModel, MenuWithDetails, VoiceResponse, MenuRecommendationRequest, MenuRecommendationResponse

# 환경 변수 로드
load_dotenv()

# FastAPI 앱 생성
app = FastAPI(title="포핸즈 음식점 API", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# OpenAI 클라이언트 설정
openai.api_key = os.getenv("GITHUB_PAT")
openai.base_url = os.getenv("AZURE_AI_ENDPOINT", "https://models.github.ai/inference")

# 데이터베이스 초기화
init_database()

# 루트 엔드포인트
@app.get("/")
async def root():
    return {"message": "포핸즈 음식점 API에 오신 것을 환영합니다!"}

# 카카오 길찾기 API 프록시 엔드포인트
@app.get("/api/directions")
async def get_directions(
    origin: str = Query(..., description="출발지 좌표 (경도,위도)"),
    destination: str = Query(..., description="도착지 좌표 (경도,위도)")
):
    try:
        # 카카오 길찾기 API URL 구성
        api_url = "https://apis-navi.kakaomobility.com/v1/directions"
        params = {
            "origin": origin,
            "destination": destination,
            "waypoints": "",
            "priority": "RECOMMEND",
            "car_fuel": "GASOLINE",
            "car_hipass": "false",
            "alternatives": "false",
            "road_details": "false"
        }
        
        headers = {
            "Authorization": "KakaoAK 749bffa5f8917cfcd65aae3b5addccc7",
            "Content-Type": "application/json"
        }
        
        # 카카오 API 호출
        async with httpx.AsyncClient() as client:
            response = await client.get(api_url, params=params, headers=headers)
            response.raise_for_status()
            return response.json()
            
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"카카오 API 오류: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서버 오류: {str(e)}")

# 매장 관련 엔드포인트
@app.get("/stores", response_model=List[StoreModel])
async def get_stores(db: Session = Depends(get_db)):
    stores = db.query(Store).all()
    return stores

@app.get("/stores/{store_id}", response_model=StoreModel)
async def get_store(store_id: int, db: Session = Depends(get_db)):
    store = db.query(Store).filter(Store.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="매장을 찾을 수 없습니다")
    return store

# 메뉴 관련 엔드포인트
@app.get("/menus", response_model=List[MenuWithDetails])
async def get_menus(
    store_id: Optional[int] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Menu)
    
    if store_id:
        query = query.filter(Menu.store_id == store_id)
    if category:
        query = query.filter(Menu.category == category)
    
    menus = query.all()
    return menus

@app.get("/menus/{menu_id}", response_model=MenuWithDetails)
async def get_menu(menu_id: int, db: Session = Depends(get_db)):
    menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="메뉴를 찾을 수 없습니다")
    return menu

@app.get("/categories")
async def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Menu.category).distinct().all()
    return [category[0] for category in categories]

# 음성 대화 엔드포인트
@app.post("/api/chat", response_model=VoiceResponse)
async def chat_with_gpt(message: dict, db: Session = Depends(get_db)):
    try:
        user_message = message.get("message", "")
        
        # GPT API 호출
        response = openai.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": """당신은 포핸즈 음식점의 친근한 직원입니다. 
                    고객의 질문에 대해 도움을 드리고, 메뉴를 추천해드립니다.
                    음성 대화를 위해 간결하고 명확하게 답변해주세요.
                    메뉴 카테고리: 쌀국수, 돈카츠,카레, 1인정식
                    주요 메뉴: 차돌양지쌀국수, 한우쌀국수, 프리미엄 로스카츠, 통모짜치즈돈카츠 등"""
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        gpt_response = response.choices[0].message.content
        
        # 메뉴 관련 키워드가 있으면 관련 메뉴 추천
        menu_suggestions = []
        if any(keyword in user_message.lower() for keyword in ['메뉴', '추천', '뭐', '어떤', '쌀국수', '돈카츠', '정식']):
            # 카테고리별 인기 메뉴 추천
            popular_menus = db.query(Menu).filter(Menu.store_id == 1).limit(6).all()
            menu_suggestions = popular_menus
        
        return VoiceResponse(
            response=gpt_response,
            menu_suggestions=menu_suggestions
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GPT API 오류: {str(e)}")

# 메뉴 검색 엔드포인트
@app.get("/search/menus")
async def search_menus(q: str, db: Session = Depends(get_db)):
    menus = db.query(Menu).filter(Menu.name.contains(q)).all()
    return menus

# 주문 절차 조회
@app.get("/menus/{menu_id}/procedures")
async def get_menu_procedures(menu_id: int, db: Session = Depends(get_db)):
    procedures = db.query(Procedure).filter(Procedure.menu_id == menu_id).order_by(Procedure.step_order).all()
    return procedures

# 메뉴 옵션 조회
@app.get("/menus/{menu_id}/options")
async def get_menu_options(menu_id: int, db: Session = Depends(get_db)):
    options = db.query(Option).filter(Option.menu_id == menu_id).all()
    return options

# 메뉴 추천 API
@app.post("/api/recommend-menu", response_model=MenuRecommendationResponse)
async def recommend_menu(
    request: MenuRecommendationRequest, 
    db: Session = Depends(get_db)
):
    """
    사용자의 선택에 따라 메뉴를 추천합니다.
    
    선택 옵션:
    - meal_type: "식사" 또는 "간식"
    - temperature: "따뜻한" 또는 "시원한"
    - spiciness: "매운" 또는 "안매운"
    - food_type: "밥" 또는 "면"
    """
    try:
        # 사용자 선택에 맞는 추천 규칙 찾기
        recommendation = db.query(MenuRecommendation).filter(
            MenuRecommendation.meal_type == request.meal_type,
            MenuRecommendation.temperature == request.temperature,
            MenuRecommendation.spiciness == request.spiciness,
            MenuRecommendation.food_type == request.food_type
        ).first()
        
        if not recommendation:
            # 정확한 매치가 없으면 기본 추천 (식사 + 따뜻한 + 안매운 + 면)
            recommendation = db.query(MenuRecommendation).filter(
                MenuRecommendation.meal_type == "식사",
                MenuRecommendation.temperature == "따뜻한",
                MenuRecommendation.spiciness == "안매운",
                MenuRecommendation.food_type == "면"
            ).first()
        
        if not recommendation:
            raise HTTPException(status_code=404, detail="추천할 메뉴를 찾을 수 없습니다")
        
        # 추천된 메뉴 ID들을 파싱
        menu_ids = [int(id.strip()) for id in recommendation.menu_ids.split(',')]
        
        # 메뉴 정보 조회
        recommended_menus = db.query(Menu).filter(Menu.id.in_(menu_ids)).all()
        
        # 선택 요약 생성
        selection_summary = f"{request.meal_type} - {request.temperature} 음식 - {request.spiciness} 음식 - {request.food_type}"
        
        return MenuRecommendationResponse(
            recommendations=recommended_menus,
            total_count=len(recommended_menus),
            selection_summary=selection_summary
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"메뉴 추천 중 오류가 발생했습니다: {str(e)}")

# 모든 추천 규칙 조회 (관리자용)
@app.get("/api/recommendation-rules")
async def get_recommendation_rules(db: Session = Depends(get_db)):
    """모든 메뉴 추천 규칙을 조회합니다."""
    rules = db.query(MenuRecommendation).all()
    return rules

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
