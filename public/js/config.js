// 설정 및 상수 정의
export const CONFIG = {
    // GitHub API 설정
    GITHUB_API_KEY: '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',
    GITHUB_API_URL: 'https://models.github.ai/inference/v1/chat/completions',
    
    // 음성 설정
    DEFAULT_SPEECH_RATE: 1.0,
    DEFAULT_REPEAT_COUNT: 1,
    SPEECH_LANG: 'ko-KR',
    
    // 음성 인식 설정
    RECOGNITION_LANG: 'ko-KR',
    RECOGNITION_CONTINUOUS: true,
    RECOGNITION_INTERIM_RESULTS: true,
    RECOGNITION_MAX_ALTERNATIVES: 1,
    
    // API 재시도 설정
    MAX_RETRIES: 3,
    BASE_DELAY: 1000,
    
    // UI 설정
    RESPONSE_DISPLAY_DURATION: 5000, // 5초
    RESPONSE_MAX_WIDTH: 400,
    RESPONSE_MIN_WIDTH: 300,
    
    // 애니메이션 설정
    PULSE_ANIMATION_DURATION: 1000,
    VOICE_RECOGNITION_RESTART_DELAY: 500
};

// 사용자 키워드 목록
export const USER_KEYWORDS = [
    '메뉴', '돈까스', '쌀국수', '주문', '음식', '추천', '도움', '안내', 
    '카레', '카츠', '오늘', '뭐', '어떤', '네', '예', '좋아', '싫어', 
    '맛있', '배고', '먹고', '마시', '드시', '할게', '할래', '싫어', 
    '싫다', '좋다', '좋아', '괜찮', '괜찮아', '괜찮다', '싶어', '싶다', 
    '원해', '원한다', '주문할게', '주문할래', '주문해', '주문해줘', '주문해주세요'
];

// 시스템 음성 필터링을 위한 환영메시지 단어들
export const WELCOME_WORDS = [
    '안녕하세요', '주문하고', '메뉴명을', '말씀해주시고', '못', '정하셨으면', 
    '메뉴라고', '말해', '주세요', '있으시면', '정하셨으면', '말씀해주시고'
];

// 정확한 시스템 음성 패턴
export const EXACT_SYSTEM_PHRASES = [
    '안녕하세요. 주문하고 싶은 메뉴가 있으시면',
    '메뉴명을 말씀해주시고, 못 정하셨으면',
    '메뉴라고 말해 주세요',
    '안녕하세요',
    '주문하고 싶은 메뉴가 있으시면',
    '메뉴명을 말씀해주시고',
    '못 정하셨으면',
    '메뉴라고 말해 주세요',
    '저희 포핸즈 메뉴를 소개해드리겠습니다',
    '카테고리에는',
    '등이 있습니다',
    '주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주세요',
    '죄송합니다. 처리 중 오류가 발생했습니다',
    '다시 말씀해주세요',
    '해당 메뉴를 찾을 수 없습니다',
    '메뉴를 확인하고 싶으시면',
    '첫번째',
    '두번째',
    '세번째',
    '번째',
    '버튼을 눌러주세요',
    '키오스크에 카드를 넣어주세요',
    '주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주세요',
    '주문을 도와드리겠습니다',
    '어떤 메뉴를 원하시나요',
    '추천이 필요하시면 말씀해 주세요'
];
