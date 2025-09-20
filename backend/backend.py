#!/usr/bin/env python3
"""
음성 주문 시스템 백엔드 - FastAPI + SQLite
모든 백엔드 기능을 하나의 파일에 통합
"""
import sqlite3
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
from contextlib import contextmanager
import uuid

# Pydantic 모델들
class CategoryResponse(BaseModel):
    id: int
    name: str
    display_name: str
    description: Optional[str] = None
    created_at: datetime

class MenuItemResponse(BaseModel):
    id: int
    category_id: int
    name: str
    price: int
    description: Optional[str] = None
    is_available: bool = True
    created_at: datetime

class OptionResponse(BaseModel):
    id: int
    name: str
    price: int
    option_type: str
    is_available: bool = True
    created_at: datetime

class MenuItemWithCategory(MenuItemResponse):
    category_name: str

class OrderItemOption(BaseModel):
    option_id: int
    quantity: int = 1

class OrderItem(BaseModel):
    menu_item_id: int
    quantity: int = 1
    options: List[OrderItemOption] = []

class CreateOrderRequest(BaseModel):
    items: List[OrderItem]

class OrderResponse(BaseModel):
    id: int
    order_number: str
    total_amount: int
    status: str
    created_at: datetime

class VoiceGuideResponse(BaseModel):
    categories: List[CategoryResponse]
    sample_menus: dict

class MenuItemDetailResponse(MenuItemResponse):
    category_name: str
    available_options: List[OptionResponse]

# 데이터베이스 관리 클래스
class DatabaseManager:
    def __init__(self, db_path: str = "menu.db"):
        self.db_path = db_path
        self.init_database()
    
    @contextmanager
    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
        finally:
            conn.close()
    
    def init_database(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # 카테고리 테이블
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    display_name TEXT NOT NULL,
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # 메뉴 테이블
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS menu_items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    category_id INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    price INTEGER NOT NULL,
                    description TEXT,
                    is_available BOOLEAN DEFAULT 1,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (category_id) REFERENCES categories (id)
                )
            ''')
            
            # 옵션 테이블
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS options (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    price INTEGER NOT NULL,
                    option_type TEXT NOT NULL,
                    is_available BOOLEAN DEFAULT 1,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # 주문 테이블
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_number TEXT UNIQUE NOT NULL,
                    total_amount INTEGER NOT NULL,
                    status TEXT DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # 주문 상세 테이블
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS order_items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_id INTEGER NOT NULL,
                    menu_item_id INTEGER NOT NULL,
                    quantity INTEGER DEFAULT 1,
                    item_price INTEGER NOT NULL,
                    total_price INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (order_id) REFERENCES orders (id),
                    FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
                )
            ''')
            
            # 주문 옵션 테이블
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS order_item_options (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_item_id INTEGER NOT NULL,
                    option_id INTEGER NOT NULL,
                    quantity INTEGER DEFAULT 1,
                    option_price INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (order_item_id) REFERENCES order_items (id),
                    FOREIGN KEY (option_id) REFERENCES options (id)
                )
            ''')
            
            conn.commit()
            self.seed_data()
    
    def seed_data(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # 기존 데이터 확인
            cursor.execute("SELECT COUNT(*) FROM categories")
            if cursor.fetchone()[0] > 0:
                return  # 이미 데이터가 있으면 스킵
            
            # 카테고리 데이터 삽입
            categories = [
                ("쌀국수", "쌀국수", "신선한 쌀국수 메뉴"),
                ("돈카츠,카레", "돈카츠,카레", "바삭한 돈카츠와 진한 카레 메뉴"),
                ("1인정식", "1인정식", "1인용 정식 메뉴"),
                ("사이드&추가메뉴", "사이드&추가메뉴", "사이드 메뉴와 추가 옵션")
            ]
            
            cursor.executemany(
                "INSERT INTO categories (name, display_name, description) VALUES (?, ?, ?)",
                categories
            )
            
            # 쌀국수 메뉴
            cursor.execute("SELECT id FROM categories WHERE name = '쌀국수'")
            ssalguksu_id = cursor.fetchone()[0]
            
            ssalguksu_items = [
                ("차돌양지쌀국수", 9900, "부드러운 차돌양지로 끓인 쌀국수"),
                ("한우쌀국수", 10900, "한우로 끓인 진한 쌀국수"),
                ("모듬 쌀국수", 11900, "다양한 고기가 들어간 쌀국수")
            ]
            
            for name, price, desc in ssalguksu_items:
                cursor.execute(
                    "INSERT INTO menu_items (category_id, name, price, description) VALUES (?, ?, ?, ?)",
                    (ssalguksu_id, name, price, desc)
                )
            
            # 돈카츠,카레 메뉴
            cursor.execute("SELECT id FROM categories WHERE name = '돈카츠,카레'")
            donkatsu_id = cursor.fetchone()[0]
            
            donkatsu_items = [
                ("프리미엄 로스카츠(등심)", 11900, "등심으로 만든 프리미엄 돈카츠"),
                ("프리미엄 히레츠(안심)", 12900, "안심으로 만든 프리미엄 돈카츠"),
                ("통모짜치즈돈카츠", 12900, "통모짜렐라 치즈가 들어간 돈카츠"),
                ("시그니처 경양식돈카츠", 11900, "경양식 스타일의 시그니처 돈카츠"),
                ("모듬카츠A[등심+안심]", 13900, "등심과 안심이 함께 들어간 모듬카츠"),
                ("모듬카츠B[등심+치즈]", 13900, "등심과 치즈가 함께 들어간 모듬카츠"),
                ("등심카츠 카레라이스", 10900, "등심카츠와 카레라이스"),
                ("안심카츠 카레라이스", 12900, "안심카츠와 카레라이스"),
                ("통모짜치즈 카레라이스", 12900, "통모짜렐라 치즈 카레라이스")
            ]
            
            for name, price, desc in donkatsu_items:
                cursor.execute(
                    "INSERT INTO menu_items (category_id, name, price, description) VALUES (?, ?, ?, ?)",
                    (donkatsu_id, name, price, desc)
                )
            
            # 1인정식 메뉴
            cursor.execute("SELECT id FROM categories WHERE name = '1인정식'")
            set_meal_id = cursor.fetchone()[0]
            
            set_meal_items = [
                ("정식A(쌀국수S+경양식)", 11900, "쌀국수와 경양식이 함께"),
                ("정식B(쌀국수S+등심)", 10900, "쌀국수와 등심이 함께"),
                ("정식C(쌀국수S+안심)", 12900, "쌀국수와 안심이 함께"),
                ("정식D(쌀국수S+치즈)", 12900, "쌀국수와 치즈가 함께")
            ]
            
            for name, price, desc in set_meal_items:
                cursor.execute(
                    "INSERT INTO menu_items (category_id, name, price, description) VALUES (?, ?, ?, ?)",
                    (set_meal_id, name, price, desc)
                )
            
            # 돈카츠,카레 옵션
            donkatsu_options = [
                ("밥많이", 0, "donkatsu"),
                ("공깃밥 추가", 1000, "donkatsu"),
                ("레몬추가", 500, "donkatsu"),
                ("트러플오일 추가 주문", 500, "donkatsu")
            ]
            
            for name, price, option_type in donkatsu_options:
                cursor.execute(
                    "INSERT INTO options (name, price, option_type) VALUES (?, ?, ?)",
                    (name, price, option_type)
                )
            
            # 정식 옵션
            set_meal_options = [
                ("쌀국수사이즈업", 3000, "set_meal"),
                ("밥추가", 1000, "set_meal"),
                ("고수추가", 500, "set_meal"),
                ("레몬추가", 500, "set_meal"),
                ("트러플오일 추가", 500, "set_meal")
            ]
            
            for name, price, option_type in set_meal_options:
                cursor.execute(
                    "INSERT INTO options (name, price, option_type) VALUES (?, ?, ?)",
                    (name, price, option_type)
                )
            
            conn.commit()
    
    def get_categories(self) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM categories ORDER BY id")
            return [dict(row) for row in cursor.fetchall()]
    
    def get_menu_items_by_category(self, category_id: int) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM menu_items WHERE category_id = ? AND is_available = 1 ORDER BY id",
                (category_id,)
            )
            return [dict(row) for row in cursor.fetchall()]
    
    def get_options_by_type(self, option_type: str) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM options WHERE option_type = ? AND is_available = 1 ORDER BY id",
                (option_type,)
            )
            return [dict(row) for row in cursor.fetchall()]
    
    def get_menu_item_by_id(self, item_id: int) -> Dict[str, Any]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT mi.*, c.name as category_name FROM menu_items mi JOIN categories c ON mi.category_id = c.id WHERE mi.id = ?",
                (item_id,)
            )
            row = cursor.fetchone()
            return dict(row) if row else None
    
    def create_order(self, order_data: Dict[str, Any]) -> int:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO orders (order_number, total_amount, status) VALUES (?, ?, ?)",
                (order_data['order_number'], order_data['total_amount'], order_data.get('status', 'pending'))
            )
            return cursor.lastrowid
    
    def add_order_item(self, order_id: int, item_data: Dict[str, Any]) -> int:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO order_items (order_id, menu_item_id, quantity, item_price, total_price) VALUES (?, ?, ?, ?, ?)",
                (order_id, item_data['menu_item_id'], item_data['quantity'], item_data['item_price'], item_data['total_price'])
            )
            return cursor.lastrowid
    
    def add_order_item_option(self, order_item_id: int, option_data: Dict[str, Any]) -> int:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO order_item_options (order_item_id, option_id, quantity, option_price) VALUES (?, ?, ?, ?)",
                (order_item_id, option_data['option_id'], option_data['quantity'], option_data['option_price'])
            )
            return cursor.lastrowid

# FastAPI 애플리케이션
app = FastAPI(title="음성 주문 시스템 API", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    print("🍽️ 음성 주문 시스템 백엔드 서버를 시작합니다...")
    print("📡 서버 주소: http://localhost:8000")
    print("📚 API 문서: http://localhost:8000/docs")
    print("🛑 서버 중지: Ctrl+C")
    print("-" * 50)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
