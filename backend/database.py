import sqlite3
from typing import List, Dict, Any
from contextlib import contextmanager

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
                    option_type TEXT NOT NULL, -- 'donkatsu' or 'set_meal'
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
