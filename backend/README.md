# 🍽️ 음성 주문 시스템 - 백엔드

FastAPI와 SQLite를 사용한 음성 주문 시스템의 백엔드 API입니다.

## 🚀 시작하기

### 1. 의존성 설치
```bash
pip install -r requirements.txt
```

### 2. 서버 실행
```bash
python run_backend.py
```

또는

```bash
python backend.py
```

### 3. API 문서 확인
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📊 데이터베이스 구조

### 테이블
- **categories**: 메뉴 카테고리 (쌀국수, 돈카츠카레, 1인정식, 사이드&추가메뉴)
- **menu_items**: 메뉴 아이템
- **options**: 옵션 (돈카츠용, 정식용)
- **orders**: 주문
- **order_items**: 주문 상세
- **order_item_options**: 주문 옵션

## 🔗 API 엔드포인트

### 기본 정보
- `GET /` - API 상태 확인

### 카테고리 및 메뉴
- `GET /categories` - 모든 카테고리 조회
- `GET /categories/{category_id}/menu` - 특정 카테고리의 메뉴 조회
- `GET /menu/{item_id}` - 메뉴 상세 정보 조회 (옵션 포함)
- `GET /options/{option_type}` - 옵션 타입별 옵션 조회

### 주문
- `POST /orders` - 주문 생성

### 음성 안내
- `GET /voice-guide` - 음성 안내용 카테고리 및 샘플 메뉴
- `GET /voice-guide/text` - 음성 안내 텍스트

## 📝 메뉴 데이터

### 카테고리
1. **쌀국수**
   - 차돌양지쌀국수 (9,900원)
   - 한우쌀국수 (10,900원)
   - 모듬 쌀국수 (11,900원)

2. **돈카츠,카레**
   - 프리미엄 로스카츠(등심) (11,900원)
   - 프리미엄 히레츠(안심) (12,900원)
   - 통모짜치즈돈카츠 (12,900원)
   - 시그니처 경양식돈카츠 (11,900원)
   - 모듬카츠A[등심+안심] (13,900원)
   - 모듬카츠B[등심+치즈] (13,900원)
   - 등심카츠 카레라이스 (10,900원)
   - 안심카츠 카레라이스 (12,900원)
   - 통모짜치즈 카레라이스 (12,900원)

3. **1인정식**
   - 정식A(쌀국수S+경양식) (11,900원)
   - 정식B(쌀국수S+등심) (10,900원)
   - 정식C(쌀국수S+안심) (12,900원)
   - 정식D(쌀국수S+치즈) (12,900원)

### 옵션

#### 돈카츠,카레 옵션
- 밥많이 (+0원)
- 공깃밥 추가 (+1,000원)
- 레몬추가 (+500원)
- 트러플오일 추가 주문 (+500원)

#### 정식 옵션
- 쌀국수사이즈업 (+3,000원)
- 밥추가 (+1,000원)
- 고수추가 (+500원)
- 레몬추가 (+500원)
- 트러플오일 추가 (+500원)

## 🔧 개발 정보

- **Python**: 3.8+
- **FastAPI**: 0.104.1
- **SQLite**: 내장
- **Pydantic**: 2.5.0

## 📁 파일 구조

```
backend/
├── app.py                  # FastAPI 애플리케이션 (메인)
├── database.py             # 데이터베이스 관리
├── models.py               # Pydantic 모델
├── main.py                 # API 엔드포인트 (레거시)
├── backend.py              # 통합 백엔드 (레거시)
├── run_backend.py          # 백엔드 실행 스크립트
├── run_server.py           # 서버 실행 스크립트 (레거시)
├── test_api.py             # API 테스트
├── start_project.py        # 프로젝트 시작 스크립트 (레거시)
├── requirements.txt        # 의존성
├── README.md              # 백엔드 문서
└── menu.db                # SQLite 데이터베이스 (자동 생성)
```
