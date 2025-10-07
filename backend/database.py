from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import sqlite3

# SQLite 데이터베이스 연결
SQLALCHEMY_DATABASE_URL = "sqlite:///./pohands.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# 데이터베이스 모델 정의
class Store(Base):
    __tablename__ = "stores"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    
    # 관계 설정
    menus = relationship("Menu", back_populates="store")

class Menu(Base):
    __tablename__ = "menus"
    
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"))
    name = Column(String, index=True)
    category = Column(String, index=True)
    price = Column(Integer)
    
    # 관계 설정
    store = relationship("Store", back_populates="menus")
    options = relationship("Option", back_populates="menu")
    procedures = relationship("Procedure", back_populates="menu")

class Option(Base):
    __tablename__ = "options"
    
    id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(Integer, ForeignKey("menus.id"))
    option_name = Column(String)
    price = Column(Integer)
    
    # 관계 설정
    menu = relationship("Menu", back_populates="options")

class Procedure(Base):
    __tablename__ = "procedures"
    
    id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(Integer, ForeignKey("menus.id"))
    step_order = Column(Integer)
    instruction = Column(String)
    
    # 관계 설정
    menu = relationship("Menu", back_populates="procedures")

class MenuRecommendation(Base):
    __tablename__ = "menu_recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    meal_type = Column(String)  # "식사" 또는 "간식"
    temperature = Column(String)  # "따뜻한" 또는 "시원한"
    spiciness = Column(String)  # "매운" 또는 "안매운"
    food_type = Column(String)  # "밥" 또는 "면"
    menu_ids = Column(String)  # 추천 메뉴 ID들을 콤마로 구분하여 저장
    created_at = Column(String)  # 생성 시간

# 데이터베이스 테이블 생성
def create_tables():
    Base.metadata.create_all(bind=engine)

# 데이터베이스 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 데이터베이스 초기화 및 샘플 데이터 삽입
def init_database():
    create_tables()
    
    # SQLite 연결로 직접 데이터 삽입
    conn = sqlite3.connect('pohands.db')
    cursor = conn.cursor()
    
    # 매장 데이터 삽입
    cursor.execute("INSERT OR IGNORE INTO stores (id, name, location) VALUES (1, '포핸즈', '서울 동대문구')")
    cursor.execute("INSERT OR IGNORE INTO stores (id, name, location) VALUES (2, '시사', '서울 동대문구')")
    
    # 메뉴 데이터 삽입
    menus_data = [
        # 쌀국수 카테고리
        (1, '차돌양지쌀국수', '쌀국수', 9900),
        (1, '한우쌀국수', '쌀국수', 10900),
        (1, '모듬 쌀국수', '쌀국수', 11900),
        
        # 돈카츠,카레 카테고리
        (1, '프리미엄 로스카츠(등심)', '돈카츠,카레', 11900),
        (1, '프리미엄 히레츠(안심)', '돈카츠,카레', 12900),
        (1, '통모짜치즈돈카츠', '돈카츠,카레', 12900),
        (1, '시그니처 경양식돈카츠', '돈카츠,카레', 11900),
        (1, '모듬카츠A[등심+안심]', '돈카츠,카레', 13900),
        (1, '모듬카츠B[등심+치즈]', '돈카츠,카레', 13900),
        (1, '등심카츠 카레라이스', '돈카츠,카레', 10900),
        (1, '안심카츠 카레라이스', '돈카츠,카레', 12900),
        (1, '통모짜치즈 카레라이스', '돈카츠,카레', 12900),
        
        # 1인정식 카테고리
        (1, '정식A(쌀국수S+경양식)', '1인정식', 11900),
        (1, '정식B(쌀국수S+등심)', '1인정식', 10900),
        (1, '정식C(쌀국수S+안심)', '1인정식', 12900),
        (1, '정식D(쌀국수S+치즈)', '1인정식', 12900),
    ]
    
    for menu in menus_data:
        cursor.execute("INSERT OR IGNORE INTO menus (store_id, name, category, price) VALUES (?, ?, ?, ?)", menu)
    
    # 옵션 데이터 삽입
    options_data = [
        # 돈카츠,카레 메뉴 옵션들 (메뉴 ID 4-12)
        (4, '밥많이', 0), (4, '공깃밥 추가', 1000), (4, '레몬추가', 500), (4, '트러플오일 추가 주문', 500),
        (5, '밥많이', 0), (5, '공깃밥 추가', 1000), (5, '레몬추가', 500), (5, '트러플오일 추가 주문', 500),
        (6, '밥많이', 0), (6, '공깃밥 추가', 1000), (6, '레몬추가', 500), (6, '트러플오일 추가 주문', 500),
        (7, '밥많이', 0), (7, '공깃밥 추가', 1000), (7, '레몬추가', 500), (7, '트러플오일 추가 주문', 500),
        (8, '밥많이', 0), (8, '공깃밥 추가', 1000), (8, '레몬추가', 500), (8, '트러플오일 추가 주문', 500),
        (9, '밥많이', 0), (9, '공깃밥 추가', 1000), (9, '레몬추가', 500), (9, '트러플오일 추가 주문', 500),
        (10, '밥많이', 0), (10, '공깃밥 추가', 1000), (10, '레몬추가', 500), (10, '트러플오일 추가 주문', 500),
        (11, '밥많이', 0), (11, '공깃밥 추가', 1000), (11, '레몬추가', 500), (11, '트러플오일 추가 주문', 500),
        (12, '밥많이', 0), (12, '공깃밥 추가', 1000), (12, '레몬추가', 500), (12, '트러플오일 추가 주문', 500),
        
        # 1인정식 메뉴 옵션들 (메뉴 ID 13-16)
        (13, '쌀국수사이즈업', 3000), (13, '밥추가', 1000), (13, '고수추가', 500), (13, '레몬추가', 500), (13, '트러플오일 추가', 500),
        (14, '쌀국수사이즈업', 3000), (14, '밥추가', 1000), (14, '고수추가', 500), (14, '레몬추가', 500), (14, '트러플오일 추가', 500),
        (15, '쌀국수사이즈업', 3000), (15, '밥추가', 1000), (15, '고수추가', 500), (15, '레몬추가', 500), (15, '트러플오일 추가', 500),
        (16, '쌀국수사이즈업', 3000), (16, '밥추가', 1000), (16, '고수추가', 500), (16, '레몬추가', 500), (16, '트러플오일 추가', 500),
    ]
    
    for option in options_data:
        cursor.execute("INSERT OR IGNORE INTO options (menu_id, option_name, price) VALUES (?, ?, ?)", option)
    
    # 주문 절차 데이터 삽입
    procedures_data = [
        # 쌀국수 주문 절차
        (1, 1, "상단 메뉴에서 '쌀국수' 버튼을 누르세요."), (1, 2, "'차돌양지쌀국수' 버튼을 선택하세요."), (1, 3, "하단의 '주문담기' 버튼을 누르세요."),
        (2, 1, "상단 메뉴에서 '쌀국수' 버튼을 누르세요."), (2, 2, "'한우쌀국수' 버튼을 선택하세요."), (2, 3, "하단의 '주문담기' 버튼을 누르세요."),
        (3, 1, "상단 메뉴에서 '쌀국수' 버튼을 누르세요."), (3, 2, "'모듬 쌀국수' 버튼을 선택하세요."), (3, 3, "하단의 '주문담기' 버튼을 누르세요."),
        
        # 돈카츠,카레 주문 절차
        (4, 1, "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요."), (4, 2, "'프리미엄 로스카츠(등심)' 버튼을 선택하세요."), (4, 3, "옵션을 선택할 수 있습니다."), (4, 4, "하단의 '주문담기' 버튼을 누르세요."),
        (5, 1, "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요."), (5, 2, "'프리미엄 히레츠(안심)' 버튼을 선택하세요."), (5, 3, "옵션을 선택할 수 있습니다."), (5, 4, "하단의 '주문담기' 버튼을 누르세요."),
        (6, 1, "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요."), (6, 2, "'통모짜치즈돈카츠' 버튼을 선택하세요."), (6, 3, "옵션을 선택할 수 있습니다."), (6, 4, "하단의 '주문담기' 버튼을 누르세요."),
        (7, 1, "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요."), (7, 2, "'시그니처 경양식돈카츠' 버튼을 선택하세요."), (7, 3, "옵션을 선택할 수 있습니다."), (7, 4, "하단의 '주문담기' 버튼을 누르세요."),
        (8, 1, "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요."), (8, 2, "'모듬카츠A[등심+안심]' 버튼을 선택하세요."), (8, 3, "옵션을 선택할 수 있습니다."), (8, 4, "하단의 '주문담기' 버튼을 누르세요."),
        (9, 1, "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요."), (9, 2, "'모듬카츠B[등심+치즈]' 버튼을 선택하세요."), (9, 3, "옵션을 선택할 수 있습니다."), (9, 4, "하단의 '주문담기' 버튼을 누르세요."),
        (10, 1, "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요."), (10, 2, "'등심카츠 카레라이스' 버튼을 선택하세요."), (10, 3, "옵션을 선택할 수 있습니다."), (10, 4, "하단의 '주문담기' 버튼을 누르세요."),
        (11, 1, "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요."), (11, 2, "'안심카츠 카레라이스' 버튼을 선택하세요."), (11, 3, "옵션을 선택할 수 있습니다."), (11, 4, "하단의 '주문담기' 버튼을 누르세요."),
        (12, 1, "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요."), (12, 2, "'통모짜치즈 카레라이스' 버튼을 선택하세요."), (12, 3, "옵션을 선택할 수 있습니다."), (12, 4, "하단의 '주문담기' 버튼을 누르세요."),
        
        # 1인정식 주문 절차
        (13, 1, "상단 메뉴에서 '1인정식' 버튼을 누르세요."), (13, 2, "'정식A(쌀국수S+경양식)' 버튼을 선택하세요."), (13, 3, "옵션을 선택할 수 있습니다."), (13, 4, "하단의 '주문담기' 버튼을 누르세요."),
        (14, 1, "상단 메뉴에서 '1인정식' 버튼을 누르세요."), (14, 2, "'정식B(쌀국수S+등심)' 버튼을 선택하세요."), (14, 3, "옵션을 선택할 수 있습니다."), (14, 4, "하단의 '주문담기' 버튼을 누르세요."),
        (15, 1, "상단 메뉴에서 '1인정식' 버튼을 누르세요."), (15, 2, "'정식C(쌀국수S+안심)' 버튼을 선택하세요."), (15, 3, "옵션을 선택할 수 있습니다."), (15, 4, "하단의 '주문담기' 버튼을 누르세요."),
        (16, 1, "상단 메뉴에서 '1인정식' 버튼을 누르세요."), (16, 2, "'정식D(쌀국수S+치즈)' 버튼을 선택하세요."), (16, 3, "옵션을 선택할 수 있습니다."), (16, 4, "하단의 '주문담기' 버튼을 누르세요."),
    ]
    
    for procedure in procedures_data:
        cursor.execute("INSERT OR IGNORE INTO procedures (menu_id, step_order, instruction) VALUES (?, ?, ?)", procedure)
    
    # 메뉴 추천 규칙 데이터 삽입
    import datetime
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    recommendation_rules = [
        # 식사 -> 따뜻한 음식 -> 안매운 음식 -> 면 -> 쌀국수
        ("식사", "따뜻한", "안매운", "면", "1,2,3", current_time),  # 쌀국수 메뉴들 (ID: 1,2,3)
        
        # 식사 -> 따뜻한 음식 -> 안매운 음식 -> 밥 -> 카레라이스, 돈까스
        ("식사", "따뜻한", "안매운", "밥", "10,11,12,4,5,6,7,8,9", current_time),  # 카레라이스와 돈까스 메뉴들
        
        # 추가 규칙들 (확장 가능)
        ("식사", "따뜻한", "매운", "면", "1,2,3", current_time),  # 매운 쌀국수 (향후 확장)
        ("식사", "시원한", "안매운", "면", "1,2,3", current_time),  # 시원한 쌀국수 (향후 확장)
        ("간식", "따뜻한", "안매운", "밥", "10,11,12", current_time),  # 간식용 카레라이스
    ]
    
    for rule in recommendation_rules:
        cursor.execute("""
            INSERT OR IGNORE INTO menu_recommendations 
            (meal_type, temperature, spiciness, food_type, menu_ids, created_at) 
            VALUES (?, ?, ?, ?, ?, ?)
        """, rule)
    
    conn.commit()
    conn.close()
