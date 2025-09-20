# 🍽️ 음성 주문 시스템

FastAPI와 SQLite를 사용한 음성 주문 시스템입니다. 키오스크 이미지를 참고하여 실제 메뉴 데이터를 기반으로 구축되었습니다.

## 🚀 빠른 시작

### 방법 1: 통합 실행 (권장)
```bash
# 1. 의존성 설치
cd backend
pip install -r requirements.txt
cd ..

# 2. 통합 실행
python run.py
```

### 방법 2: 개별 실행
```bash
# 백엔드 실행 (터미널 1)
cd backend
pip install -r requirements.txt
python run_backend.py

# 프론트엔드 실행 (터미널 2)
cd frontend
python run_frontend.py
```

### 3. 접속
- **프론트엔드**: http://localhost:3000/frontend.html
- **백엔드 API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs

## 📁 프로젝트 구조

```
├── backend/                    # 백엔드 폴더
│   ├── app.py                 # FastAPI 애플리케이션 (메인)
│   ├── database.py            # 데이터베이스 관리
│   ├── models.py              # Pydantic 모델
│   ├── main.py                # API 엔드포인트 (레거시)
│   ├── backend.py             # 통합 백엔드 (레거시)
│   ├── run_backend.py         # 백엔드 실행 스크립트
│   ├── test_api.py            # API 테스트
│   ├── requirements.txt       # Python 의존성
│   ├── README.md             # 백엔드 문서
│   └── menu.db               # SQLite 데이터베이스 (자동 생성)
├── frontend/                   # 프론트엔드 폴더
│   ├── frontend.html          # 통합 프론트엔드 (권장)
│   ├── index.html             # 홈페이지
│   ├── menu.html              # 메뉴 페이지
│   ├── order.html             # 주문 페이지
│   ├── *.css                  # 스타일 파일들
│   ├── *.js                   # JavaScript 파일들
│   ├── run_frontend.py        # 프론트엔드 실행 스크립트
│   └── README.md             # 프론트엔드 문서
├── run.py                     # 메인 실행 스크립트
└── README.md                 # 프로젝트 문서
```

## 🎯 주요 기능

### 1. 음성 인터페이스
- **TTS (Text-to-Speech)**: 한국어 음성 안내
- **STT (Speech-to-Text)**: 음성 명령 인식
- **동적 안내**: 백엔드에서 실제 메뉴 데이터를 기반으로 음성 안내 생성

### 2. 메뉴 시스템
- **카테고리별 메뉴**: 쌀국수, 돈카츠카레, 1인정식, 사이드&추가메뉴
- **옵션 선택**: 돈카츠용/정식용 옵션 분리
- **실시간 데이터**: 백엔드 API를 통한 동적 메뉴 로드

### 3. 주문 관리
- **옵션 포함 주문**: 메뉴별 맞춤 옵션 선택
- **주문 확인**: 실시간 주문 요약 및 총액 계산
- **주문 저장**: 로컬 스토리지를 통한 주문 임시 저장

## 🗄️ 데이터베이스 구조

### 메뉴 데이터 (키오스크 이미지 기반)
- **쌀국수**: 차돌양지쌀국수, 한우쌀국수, 모듬쌀국수
- **돈카츠,카레**: 9개 메뉴 (프리미엄 로스카츠, 안심카츠 등)
- **1인정식**: 4개 정식 메뉴 (A, B, C, D)

### 옵션 시스템
- **돈카츠 옵션**: 밥많이, 공깃밥추가, 레몬추가, 트러플오일추가
- **정식 옵션**: 쌀국수사이즈업, 밥추가, 고수추가, 레몬추가, 트러플오일추가

## 🔧 API 엔드포인트

### 기본 정보
- `GET /` - API 상태 확인

### 카테고리 및 메뉴
- `GET /categories` - 모든 카테고리 조회
- `GET /categories/{id}/menu` - 특정 카테고리의 메뉴 조회
- `GET /menu/{id}` - 메뉴 상세 정보 (옵션 포함)
- `GET /options/{type}` - 옵션 타입별 옵션 조회

### 주문
- `POST /orders` - 주문 생성

### 음성 안내
- `GET /voice-guide/text` - 음성 안내 텍스트

## 🎤 음성 사용법

1. **시작**: 페이지를 클릭하거나 "🎤 음성 시작하기" 버튼 클릭
2. **안내 듣기**: 시스템이 메뉴 안내를 음성으로 제공
3. **명령 입력**: "메뉴" 또는 "주문"이라고 말하기
4. **메뉴 선택**: 메뉴 모달에서 원하는 메뉴 선택
5. **옵션 선택**: 돈카츠/정식 메뉴의 경우 옵션 선택
6. **주문 확인**: 주문 모달에서 최종 확인

## 🛠️ 개발 정보

- **백엔드**: Python 3.8+, FastAPI, SQLite
- **프론트엔드**: HTML5, CSS3, JavaScript (ES6+)
- **음성**: Web Speech API (TTS/STT)
- **데이터베이스**: SQLite (자동 생성)

## 📱 브라우저 지원

- **Chrome**: 완전 지원 (권장)
- **Edge**: 완전 지원
- **Firefox**: 제한적 지원
- **Safari**: 제한적 지원

## 🔍 문제 해결

### 음성이 재생되지 않는 경우
1. 브라우저에서 자동 재생 정책 확인
2. 페이지를 클릭하여 사용자 상호작용 활성화
3. 브라우저 설정에서 음성 재생 허용 확인

### 음성 인식이 작동하지 않는 경우
1. 마이크 권한 허용 확인
2. HTTPS 환경에서 사용 (로컬에서는 localhost 사용)
3. 지원되는 브라우저 사용 확인

### API 연결 오류
1. 백엔드 서버가 실행 중인지 확인 (http://localhost:8000)
2. CORS 설정 확인
3. 네트워크 연결 상태 확인

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.