from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import uuid
from datetime import datetime

from database import DatabaseManager
from models import (
    CategoryResponse, MenuItemResponse, OptionResponse, MenuItemWithCategory,
    CreateOrderRequest, OrderResponse, VoiceGuideResponse, MenuItemDetailResponse
)

app = FastAPI(title="음성 주문 시스템 API", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인만 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 데이터베이스 매니저 인스턴스
db_manager = DatabaseManager()

@app.get("/")
async def root():
    return {"message": "음성 주문 시스템 API"}

@app.get("/categories", response_model=List[CategoryResponse])
async def get_categories():
    """모든 카테고리 조회"""
    return db_manager.get_categories()

@app.get("/categories/{category_id}/menu", response_model=List[MenuItemResponse])
async def get_menu_by_category(category_id: int):
    """특정 카테고리의 메뉴 조회"""
    menu_items = db_manager.get_menu_items_by_category(category_id)
    if not menu_items:
        raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다.")
    return menu_items

@app.get("/menu/{item_id}", response_model=MenuItemDetailResponse)
async def get_menu_item_detail(item_id: int):
    """특정 메뉴 아이템의 상세 정보 조회 (옵션 포함)"""
    menu_item = db_manager.get_menu_item_by_id(item_id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="메뉴 아이템을 찾을 수 없습니다.")
    
    # 카테고리에 따른 옵션 타입 결정
    category_name = menu_item['category_name']
    if category_name == "돈카츠,카레":
        option_type = "donkatsu"
    elif category_name == "1인정식":
        option_type = "set_meal"
    else:
        option_type = None
    
    available_options = []
    if option_type:
        available_options = db_manager.get_options_by_type(option_type)
    
    return MenuItemDetailResponse(
        **menu_item,
        available_options=available_options
    )

@app.get("/options/{option_type}", response_model=List[OptionResponse])
async def get_options_by_type(option_type: str):
    """옵션 타입별 옵션 조회"""
    if option_type not in ["donkatsu", "set_meal"]:
        raise HTTPException(status_code=400, detail="올바른 옵션 타입을 입력해주세요. (donkatsu, set_meal)")
    
    return db_manager.get_options_by_type(option_type)

@app.post("/orders", response_model=OrderResponse)
async def create_order(order_request: CreateOrderRequest):
    """주문 생성"""
    order_number = f"ORD-{datetime.now().strftime('%Y%m%d%H%M%S')}-{str(uuid.uuid4())[:8]}"
    
    # 총 금액 계산
    total_amount = 0
    order_items_data = []
    
    for item in order_request.items:
        menu_item = db_manager.get_menu_item_by_id(item.menu_item_id)
        if not menu_item:
            raise HTTPException(status_code=404, detail=f"메뉴 아이템 ID {item.menu_item_id}를 찾을 수 없습니다.")
        
        # 메뉴 아이템 기본 가격
        item_total = menu_item['price'] * item.quantity
        
        # 옵션 가격 추가
        for option in item.options:
            options = db_manager.get_options_by_type("donkatsu" if menu_item['category_name'] == "돈카츠,카레" else "set_meal")
            option_data = next((opt for opt in options if opt['id'] == option.option_id), None)
            if not option_data:
                raise HTTPException(status_code=404, detail=f"옵션 ID {option.option_id}를 찾을 수 없습니다.")
            item_total += option_data['price'] * option.quantity
        
        total_amount += item_total
        order_items_data.append({
            'menu_item_id': item.menu_item_id,
            'quantity': item.quantity,
            'item_price': menu_item['price'],
            'total_price': item_total,
            'options': item.options
        })
    
    # 주문 생성
    order_id = db_manager.create_order({
        'order_number': order_number,
        'total_amount': total_amount,
        'status': 'pending'
    })
    
    # 주문 아이템들 추가
    for item_data in order_items_data:
        order_item_id = db_manager.add_order_item(order_id, item_data)
        
        # 옵션들 추가
        for option in item_data['options']:
            option_data = next((opt for opt in db_manager.get_options_by_type("donkatsu" if menu_item['category_name'] == "돈카츠,카레" else "set_meal") if opt['id'] == option.option_id), None)
            if option_data:
                db_manager.add_order_item_option(order_item_id, {
                    'option_id': option.option_id,
                    'quantity': option.quantity,
                    'option_price': option_data['price']
                })
    
    return OrderResponse(
        id=order_id,
        order_number=order_number,
        total_amount=total_amount,
        status='pending',
        created_at=datetime.now()
    )

@app.get("/voice-guide", response_model=VoiceGuideResponse)
async def get_voice_guide():
    """음성 안내를 위한 카테고리 및 샘플 메뉴 정보"""
    categories = db_manager.get_categories()
    
    # 각 카테고리별 샘플 메뉴 (최대 3개)
    sample_menus = {}
    for category in categories:
        menu_items = db_manager.get_menu_items_by_category(category['id'])
        sample_menus[category['display_name']] = [item['name'] for item in menu_items[:3]]
    
    return VoiceGuideResponse(
        categories=categories,
        sample_menus=sample_menus
    )

@app.get("/voice-guide/text")
async def get_voice_guide_text():
    """음성 안내 텍스트 생성"""
    categories = db_manager.get_categories()
    
    guide_text = "안녕하세요. 반갑습니다. 주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주시고, 못 정하셨으면 '메뉴'라고 말해 주세요.\n\n"
    guide_text += "저희 매장에는 다음과 같은 메뉴가 있습니다:\n\n"
    
    for category in categories:
        menu_items = db_manager.get_menu_items_by_category(category['id'])
        sample_menus = [item['name'] for item in menu_items[:3]]
        
        guide_text += f"• {category['display_name']} 탭을 누르시면 "
        if sample_menus:
            guide_text += f"{', '.join(sample_menus)} 등의 메뉴가 있습니다.\n"
        else:
            guide_text += "다양한 메뉴가 있습니다.\n"
    
    guide_text += "\n주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주세요."
    
    return {"guide_text": guide_text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
