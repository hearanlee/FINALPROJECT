# 🍜 포핸즈 음식점 FastAPI 백엔드

FastAPI와 SQLite를 사용한 포핸즈 음식점 메뉴 관리 시스템입니다.

## ✨ 주요 기능

- 🍽️ **메뉴 관리**: 쌀국수, 돈카츠, 1인정식 메뉴 관리
- 🎤 **음성 대화**: GPT와 음성으로 메뉴 문의 및 추천
- 📱 **REST API**: 메뉴 조회, 검색, 주문 절차 안내
- 🗄️ **SQLite DB**: 메뉴, 옵션, 주문 절차 데이터 관리

## 🚀 설치 및 실행

### 1. Python 환경 설정
```bash
# Python 3.8+ 필요
python --version

# 가상환경 생성 (선택사항)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. 의존성 설치
```bash
cd backend
pip install -r requirements.txt
```

### 3. 환경 변수 설정
`.env` 파일 생성:
```env
GITHUB_PAT=your_github_pat_here
AZURE_AI_ENDPOINT=https://models.github.ai/inference
```

### 4. 서버 실행
```bash
python run.py
```

## 📚 API 엔드포인트

### 기본 정보
- **서버**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 주요 엔드포인트

#### 매장 관리
- `GET /stores` - 모든 매장 조회
- `GET /stores/{store_id}` - 특정 매장 조회

#### 메뉴 관리
- `GET /menus` - 모든 메뉴 조회
- `GET /menus?store_id=1&category=쌀국수` - 필터링된 메뉴 조회
- `GET /menus/{menu_id}` - 특정 메뉴 상세 조회
- `GET /search/menus?q=쌀국수` - 메뉴 검색

#### 음성 대화
- `POST /api/chat` - GPT와 음성 대화

#### 주문 관련
- `GET /menus/{menu_id}/procedures` - 메뉴 주문 절차
- `GET /menus/{menu_id}/options` - 메뉴 옵션

## 🗄️ 데이터베이스 구조

### 테이블
- **stores**: 매장 정보
- **menus**: 메뉴 정보
- **options**: 메뉴 옵션
- **procedures**: 주문 절차

### 샘플 데이터
- 포핸즈 매장 (ID: 1)
- 16개 메뉴 (쌀국수, 돈카츠, 1인정식)
- 각 메뉴별 옵션 및 주문 절차

## 🛠️ 기술 스택

- **FastAPI**: 웹 프레임워크
- **SQLAlchemy**: ORM
- **SQLite**: 데이터베이스
- **Pydantic**: 데이터 검증
- **OpenAI API**: 음성 대화

## 📝 사용 예시

### 메뉴 조회
```bash
curl http://localhost:8000/menus?category=쌀국수
```

### 음성 대화
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "쌀국수 추천해주세요"}'
```

## 🔧 개발

### 데이터베이스 초기화
```python
from database import init_database
init_database()
```

### 새 메뉴 추가
```python
from database import get_db, Menu
from sqlalchemy.orm import Session

def add_menu(db: Session, store_id: int, name: str, category: str, price: int):
    menu = Menu(store_id=store_id, name=name, category=category, price=price)
    db.add(menu)
    db.commit()
    return menu
```
