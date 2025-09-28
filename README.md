# 🎤 GPT 음성 대화 앱

Web Speech API를 사용하여 GPT와 실시간 음성 대화를 할 수 있는 웹 애플리케이션입니다.

## ✨ 주요 기능

- 🎤 **음성 인식**: 마이크를 통해 음성을 텍스트로 변환
- 🔊 **음성 합성**: GPT의 응답을 자연스러운 음성으로 재생
- 💬 **실시간 대화**: GPT와 자연스러운 음성 대화
- 🎨 **모던한 UI**: 반응형 디자인과 애니메이션
- ⚙️ **음성 설정**: 음성 선택, 속도 조절 가능

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`env.example` 파일을 `.env`로 복사하고 GitHub Personal Access Token을 설정하세요:
```bash
copy env.example .env
```

`.env` 파일에서 `GITHUB_PAT` 값을 실제 토큰으로 설정하세요.

### 3. 서버 실행
```bash
npm run server
```

### 4. 브라우저에서 접속
http://localhost:3000 에서 음성 대화를 시작하세요!

## 🎯 사용법

1. **음성 인식 시작**: 🎤 버튼을 클릭하고 말하세요
2. **음성 설정**: 음성 종류와 속도를 조절할 수 있습니다
3. **자연스러운 대화**: GPT가 음성으로 답변해줍니다

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (Web Speech API)
- **Backend**: Node.js, Express.js
- **AI**: OpenAI API (Azure AI Inference)
- **Styling**: CSS Grid, Flexbox, 애니메이션

## 📁 프로젝트 구조

```
gpt/
├── public/           # 프론트엔드 파일
│   ├── index.html   # 메인 HTML
│   ├── style.css    # 스타일시트
│   └── script.js    # 음성 대화 로직
├── src/             # TypeScript 소스
│   └── index.ts     # CLI 버전
├── server.js        # Express 서버
├── package.json     # 의존성 관리
└── .env            # 환경 변수
```

## 🔧 환경 변수

- `GITHUB_PAT`: GitHub Personal Access Token (필수)
- `AZURE_AI_ENDPOINT`: Azure AI Inference 엔드포인트
- `PORT`: 서버 포트 (기본값: 3000)

## 🌐 브라우저 지원

- Chrome/Edge: 완전 지원
- Firefox: 기본 지원
- Safari: 제한적 지원

## 📝 스크립트

- `npm run server`: 웹 서버 실행
- `npm run dev`: TypeScript CLI 버전 실행
- `npm run build`: TypeScript 컴파일
