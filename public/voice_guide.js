// 1. 필요한 HTML 요소들을 모두 찾습니다.
const speedBtn = document.getElementById('speedBtn');
const repeatBtn = document.getElementById('repeatBtn');
let voiceMicIcon = null; // 나중에 초기화

const speedModal = document.getElementById('speedModal');
const repeatModal = document.getElementById('repeatModal');

const overlay = document.querySelector('.modal-overlay');
const closeButtons = document.querySelectorAll('.close-button');

// 가운데 PNG 버튼 (음성 제어 버튼)
const centerVoiceBtn = document.querySelector('.center-voice-btn');

// 음성 관련 변수들
let isRecording = false;
let recognition = null;
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let repeatCount = 1;
let speechRate = 1.0;
let playCount = 0;

// 음성안내 프로세스 변수들
let isVoiceGuideActive = false;
let currentStep = 0;
let isWaitingForUserInput = false;
let isProcessing = false; // 중복 처리 방지 플래그
let lastMenuExplanation = null; // 이전 메뉴 설명 저장

// GitHub API 설정
const GITHUB_API_KEY = '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';
const GITHUB_API_URL = 'https://models.github.ai/inference/v1/chat/completions';

// 메뉴 데이터베이스 (database.py의 실제 데이터 사용)
const MENU_DATABASE = {
    categories: [
        {
            name: "쌀국수",
            items: [
                { id: 1, name: "차돌양지쌀국수", price: 9900, category: "쌀국수", hasOptions: false },
                { id: 2, name: "한우쌀국수", price: 10900, category: "쌀국수", hasOptions: false },
                { id: 3, name: "모듬 쌀국수", price: 11900, category: "쌀국수", hasOptions: false }
            ]
        },
        {
            name: "돈카츠,카레",
            items: [
                { id: 4, name: "프리미엄 로스카츠(등심)", price: 11900, category: "돈카츠,카레", hasOptions: true, options: ['밥많이', '공깃밥 추가', '레몬추가', '트러플오일 추가 주문'] },
                { id: 5, name: "프리미엄 히레츠(안심)", price: 12900, category: "돈카츠,카레", hasOptions: true, options: ['밥많이', '공깃밥 추가', '레몬추가', '트러플오일 추가 주문'] },
                { id: 6, name: "통모짜치즈돈카츠", price: 12900, category: "돈카츠,카레", hasOptions: true, options: ['밥많이', '공깃밥 추가', '레몬추가', '트러플오일 추가 주문'] },
                { id: 7, name: "시그니처 경양식돈카츠", price: 11900, category: "돈카츠,카레", hasOptions: true, options: ['밥많이', '공깃밥 추가', '레몬추가', '트러플오일 추가 주문'] },
                { id: 8, name: "모듬카츠A[등심+안심]", price: 13900, category: "돈카츠,카레", hasOptions: true, options: ['밥많이', '공깃밥 추가', '레몬추가', '트러플오일 추가 주문'] },
                { id: 9, name: "모듬카츠B[등심+치즈]", price: 13900, category: "돈카츠,카레", hasOptions: true, options: ['밥많이', '공깃밥 추가', '레몬추가', '트러플오일 추가 주문'] },
                { id: 10, name: "등심카츠 카레라이스", price: 10900, category: "돈카츠,카레", hasOptions: true, options: ['밥많이', '공깃밥 추가', '레몬추가', '트러플오일 추가 주문'] },
                { id: 11, name: "안심카츠 카레라이스", price: 12900, category: "돈카츠,카레", hasOptions: true, options: ['밥많이', '공깃밥 추가', '레몬추가', '트러플오일 추가 주문'] },
                { id: 12, name: "통모짜치즈 카레라이스", price: 12900, category: "돈카츠,카레", hasOptions: true, options: ['밥많이', '공깃밥 추가', '레몬추가', '트러플오일 추가 주문'] }
            ]
        },
        {
            name: "1인정식",
            items: [
                { id: 13, name: "정식A(쌀국수S+경양식)", price: 11900, category: "1인정식", hasOptions: true, options: ['쌀국수사이즈업', '밥추가', '고수추가', '레몬추가', '트러플오일 추가'] },
                { id: 14, name: "정식B(쌀국수S+등심)", price: 10900, category: "1인정식", hasOptions: true, options: ['쌀국수사이즈업', '밥추가', '고수추가', '레몬추가', '트러플오일 추가'] },
                { id: 15, name: "정식C(쌀국수S+안심)", price: 12900, category: "1인정식", hasOptions: true, options: ['쌀국수사이즈업', '밥추가', '고수추가', '레몬추가', '트러플오일 추가'] },
                { id: 16, name: "정식D(쌀국수S+치즈)", price: 12900, category: "1인정식", hasOptions: true, options: ['쌀국수사이즈업', '밥추가', '고수추가', '레몬추가', '트러플오일 추가'] }
            ]
        }
    ]
};

// 주문 절차 데이터베이스 (database.py의 procedures_data 사용)
const PROCEDURES_DATABASE = {
    1: [
        { step_order: 1, instruction: "상단 메뉴에서 '쌀국수' 버튼을 누르세요." },
        { step_order: 2, instruction: "'차돌양지쌀국수' 버튼을 선택하세요." },
        { step_order: 3, instruction: "하단의 '주문담기' 버튼을 누르세요." }
    ],
    2: [
        { step_order: 1, instruction: "상단 메뉴에서 '쌀국수' 버튼을 누르세요." },
        { step_order: 2, instruction: "'한우쌀국수' 버튼을 선택하세요." },
        { step_order: 3, instruction: "하단의 '주문담기' 버튼을 누르세요." }
    ],
    3: [
        { step_order: 1, instruction: "상단 메뉴에서 '쌀국수' 버튼을 누르세요." },
        { step_order: 2, instruction: "'모듬 쌀국수' 버튼을 선택하세요." },
        { step_order: 3, instruction: "하단의 '주문담기' 버튼을 누르세요." }
    ],
    4: [
        { step_order: 1, instruction: "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요." },
        { step_order: 2, instruction: "'프리미엄 로스카츠(등심)' 버튼을 선택하세요." },
        { step_order: 3, instruction: "옵션을 선택할 수 있습니다." },
        { step_order: 4, instruction: "하단의 '주문담기' 버튼을 누르세요." }
    ],
    5: [
        { step_order: 1, instruction: "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요." },
        { step_order: 2, instruction: "'프리미엄 히레츠(안심)' 버튼을 선택하세요." },
        { step_order: 3, instruction: "옵션을 선택할 수 있습니다." },
        { step_order: 4, instruction: "하단의 '주문담기' 버튼을 누르세요." }
    ],
    6: [
        { step_order: 1, instruction: "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요." },
        { step_order: 2, instruction: "'통모짜치즈돈카츠' 버튼을 선택하세요." },
        { step_order: 3, instruction: "옵션을 선택할 수 있습니다." },
        { step_order: 4, instruction: "하단의 '주문담기' 버튼을 누르세요." }
    ],
    7: [
        { step_order: 1, instruction: "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요." },
        { step_order: 2, instruction: "'시그니처 경양식돈카츠' 버튼을 선택하세요." },
        { step_order: 3, instruction: "옵션을 선택할 수 있습니다." },
        { step_order: 4, instruction: "하단의 '주문담기' 버튼을 누르세요." }
    ],
    8: [
        { step_order: 1, instruction: "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요." },
        { step_order: 2, instruction: "'모듬카츠A[등심+안심]' 버튼을 선택하세요." },
        { step_order: 3, instruction: "옵션을 선택할 수 있습니다." },
        { step_order: 4, instruction: "하단의 '주문담기' 버튼을 누르세요." }
    ],
    9: [
        { step_order: 1, instruction: "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요." },
        { step_order: 2, instruction: "'모듬카츠B[등심+치즈]' 버튼을 선택하세요." },
        { step_order: 3, instruction: "옵션을 선택할 수 있습니다." },
        { step_order: 4, instruction: "하단의 '주문담기' 버튼을 누르세요." }
    ],
    10: [
        { step_order: 1, instruction: "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요." },
        { step_order: 2, instruction: "'등심카츠 카레라이스' 버튼을 선택하세요." },
        { step_order: 3, instruction: "옵션을 선택할 수 있습니다." },
        { step_order: 4, instruction: "하단의 '주문담기' 버튼을 누르세요." }
    ],
    11: [
        { step_order: 1, instruction: "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요." },
        { step_order: 2, instruction: "'안심카츠 카레라이스' 버튼을 선택하세요." },
        { step_order: 3, instruction: "옵션을 선택할 수 있습니다." },
        { step_order: 4, instruction: "하단의 '주문담기' 버튼을 누르세요." }
    ],
    12: [
        { step_order: 1, instruction: "상단 메뉴에서 '돈카츠,카레' 버튼을 누르세요." },
        { step_order: 2, instruction: "'통모짜치즈 카레라이스' 버튼을 선택하세요." },
        { step_order: 3, instruction: "옵션을 선택할 수 있습니다." },
        { step_order: 4, instruction: "하단의 '주문담기' 버튼을 누르세요." }
    ],
    13: [
        { step_order: 1, instruction: "상단 메뉴에서 '1인정식' 버튼을 누르세요." },
        { step_order: 2, instruction: "'정식A(쌀국수S+경양식)' 버튼을 선택하세요." },
        { step_order: 3, instruction: "옵션을 선택할 수 있습니다." },
        { step_order: 4, instruction: "하단의 '주문담기' 버튼을 누르세요." }
    ],
    14: [
        { step_order: 1, instruction: "상단 메뉴에서 '1인정식' 버튼을 누르세요." },
        { step_order: 2, instruction: "'정식B(쌀국수S+등심)' 버튼을 선택하세요." },
        { step_order: 3, instruction: "옵션을 선택할 수 있습니다." },
        { step_order: 4, instruction: "하단의 '주문담기' 버튼을 누르세요." }
    ],
    15: [
        { step_order: 1, instruction: "상단 메뉴에서 '1인정식' 버튼을 누르세요." },
        { step_order: 2, instruction: "'정식C(쌀국수S+안심)' 버튼을 선택하세요." },
        { step_order: 3, instruction: "옵션을 선택할 수 있습니다." },
        { step_order: 4, instruction: "하단의 '주문담기' 버튼을 누르세요." }
    ],
    16: [
        { step_order: 1, instruction: "상단 메뉴에서 '1인정식' 버튼을 누르세요." },
        { step_order: 2, instruction: "'정식D(쌀국수S+치즈)' 버튼을 선택하세요." },
        { step_order: 3, instruction: "옵션을 선택할 수 있습니다." },
        { step_order: 4, instruction: "하단의 '주문담기' 버튼을 누르세요." }
    ]
};

// 메뉴 추천 규칙 데이터베이스 (main.py의 menu_recommendations와 동일)
const MENU_RECOMMENDATION_RULES = [
    {
        meal_type: "식사",
        temperature: "따뜻한", 
        spiciness: "안매운",
        food_type: "면",
        menu_ids: [1, 2, 3], // 쌀국수 메뉴들
        created_at: "2024-01-01 00:00:00"
    },
    {
        meal_type: "식사",
        temperature: "따뜻한",
        spiciness: "안매운", 
        food_type: "밥",
        menu_ids: [10, 11, 12, 4, 5, 6, 7, 8, 9], // 카레라이스와 돈까스 메뉴들
        created_at: "2024-01-01 00:00:00"
    },
    {
        meal_type: "식사",
        temperature: "따뜻한",
        spiciness: "매운",
        food_type: "면", 
        menu_ids: [1, 2, 3], // 매운 쌀국수 (향후 확장)
        created_at: "2024-01-01 00:00:00"
    },
    {
        meal_type: "식사",
        temperature: "시원한",
        spiciness: "안매운",
        food_type: "면",
        menu_ids: [1, 2, 3], // 시원한 쌀국수 (향후 확장)
        created_at: "2024-01-01 00:00:00"
    },
    {
        meal_type: "간식",
        temperature: "따뜻한",
        spiciness: "안매운",
        food_type: "밥",
        menu_ids: [10, 11, 12], // 간식용 카레라이스
        created_at: "2024-01-01 00:00:00"
    }
];

// GPT API 호출 함수 (main.py와 동일한 로직 사용)
async function callGPTAPI(message) {
    try {
        console.log('GPT API 호출:', message);
        
        const response = await fetch(GITHUB_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `당신은 포핸즈 음식점의 친근한 직원입니다. 
                        고객의 질문에 대해 도움을 드리고, 메뉴를 추천해드립니다.
                        음성 대화를 위해 간결하고 명확하게 답변해주세요.
                        
                        고객이 메뉴 관련 질문을 하면 아래 실제 메뉴만 추천하고,
                        일반적인 질문(가격, 위치, 영업시간, 추천 등)에 대해서도 친근하게 답변해주세요.
                        
                        ⚠️ 중요: 절대 새로운 메뉴를 생성하지 마세요. 오직 아래 실제 메뉴만 추천하세요.
                        
                        📋 포핸즈 실제 메뉴 (database.py 기반):
                        
                        🍜 쌀국수 카테고리:
                        - 차돌양지쌀국수 (9,900원) - 부드러운 차돌양지와 진한 국물
                        - 한우쌀국수 (10,900원) - 프리미엄 한우와 깔끔한 국물
                        - 모듬 쌀국수 (11,900원) - 다양한 고기와 풍부한 맛
                        
                        🍖 돈카츠,카레 카테고리:
                        - 프리미엄 로스카츠(등심) (11,900원) - 부드러운 등심 돈카츠
                        - 프리미엄 히레츠(안심) (12,900원) - 최고급 안심 돈카츠
                        - 통모짜치즈돈카츠 (12,900원) - 치즈가 가득한 돈카츠
                        - 시그니처 경양식돈카츠 (11,900원) - 특별한 경양식 돈카츠
                        - 모듬카츠A[등심+안심] (13,900원) - 등심과 안심 조합
                        - 모듬카츠B[등심+치즈] (13,900원) - 등심과 치즈 조합
                        - 등심카츠 카레라이스 (10,900원) - 등심 돈카츠 + 카레
                        - 안심카츠 카레라이스 (12,900원) - 안심 돈카츠 + 카레
                        - 통모짜치즈 카레라이스 (12,900원) - 치즈 돈카츠 + 카레
                        
                        🍱 1인정식 카테고리:
                        - 정식A(쌀국수S+경양식) (11,900원) - 쌀국수 + 경양식 돈카츠
                        - 정식B(쌀국수S+등심) (10,900원) - 쌀국수 + 등심 돈카츠
                        - 정식C(쌀국수S+안심) (12,900원) - 쌀국수 + 안심 돈카츠
                        - 정식D(쌀국수S+치즈) (12,900원) - 쌀국수 + 치즈 돈카츠
                        
                        🎯 추천 가이드라인:
                        - "오늘 뭐먹지?", "추천해줘", "뭐가 좋을까?" → 상황에 맞는 메뉴 추천
                        - 시간대별 추천: 아침/점심(쌀국수), 저녁(돈카츠/정식)
                        - 가격대별 추천: 낮은가격격(쌀국수), 중간가격(돈카츠), 비교적 높은 가격격(정식)
                        - 취향별 추천: 국물(쌀국수), 바삭한(돈카츠), 든든한(정식)
                        
                        사용자가 "메뉴" 또는 "메뉴둘러보기"라고 하면:
                        1. 먼저 카테고리별로 간단히 소개해주세요
                        2. 각 카테고리의 대표 메뉴 2-3개를 가격과 함께 언급해주세요
                        3. "주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주세요"라고 안내해주세요
                        
                        특정 메뉴명을 말하면 해당 메뉴의 주문 절차를 안내해주세요.`
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('GPT API 응답:', data);
        
        const gpt_response = data.choices[0].message.content;
        
        // main.py와 동일한 메뉴 추천 로직
        const menu_suggestions = [];
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('메뉴') || lowerMessage.includes('추천') || 
            lowerMessage.includes('뭐') || lowerMessage.includes('어떤') || 
            lowerMessage.includes('쌀국수') || lowerMessage.includes('돈카츠') || 
            lowerMessage.includes('정식')) {
            
            // 카테고리별 인기 메뉴 추천 (main.py와 동일한 로직)
            const popularMenus = [];
            MENU_DATABASE.categories.forEach(category => {
                popularMenus.push(...category.items.slice(0, 2)); // 각 카테고리에서 2개씩
            });
            menu_suggestions.push(...popularMenus.slice(0, 6)); // 최대 6개
        }
        
        return {
            response: gpt_response,
            menu_suggestions: menu_suggestions
        };
        
    } catch (error) {
        console.error('GPT API 호출 실패:', error);
        throw error;
    }
}

// 메뉴 제안 함수 (main.py와 동일한 로직)
function getMenuSuggestions(message) {
    const suggestions = [];
    const lowerMessage = message.toLowerCase();
    
    // main.py와 동일한 키워드 체크
    if (lowerMessage.includes('메뉴') || lowerMessage.includes('추천') || 
        lowerMessage.includes('뭐') || lowerMessage.includes('어떤') || 
        lowerMessage.includes('쌀국수') || lowerMessage.includes('돈카츠') || 
        lowerMessage.includes('정식')) {
        
        // 카테고리별 인기 메뉴 추천 (각 카테고리에서 2개씩, 최대 6개)
        const popularMenus = [];
        MENU_DATABASE.categories.forEach(category => {
            popularMenus.push(...category.items.slice(0, 2));
        });
        suggestions.push(...popularMenus.slice(0, 6));
    }
    
    return suggestions;
}

// 메뉴 추천 함수 (main.py의 recommend_menu API와 동일한 로직)
function recommendMenu(mealType, temperature, spiciness, foodType) {
    console.log('메뉴 추천 요청:', { mealType, temperature, spiciness, foodType });
    
    try {
        // 사용자 선택에 맞는 추천 규칙 찾기
        let recommendation = MENU_RECOMMENDATION_RULES.find(rule => 
            rule.meal_type === mealType &&
            rule.temperature === temperature &&
            rule.spiciness === spiciness &&
            rule.food_type === foodType
        );
        
        if (!recommendation) {
            // 정확한 매치가 없으면 기본 추천 (식사 + 따뜻한 + 안매운 + 면)
            recommendation = MENU_RECOMMENDATION_RULES.find(rule => 
                rule.meal_type === "식사" &&
                rule.temperature === "따뜻한" &&
                rule.spiciness === "안매운" &&
                rule.food_type === "면"
            );
        }
        
        if (!recommendation) {
            throw new Error("추천할 메뉴를 찾을 수 없습니다");
        }
        
        // 추천된 메뉴 ID들로 메뉴 정보 조회
        const recommendedMenus = [];
        recommendation.menu_ids.forEach(menuId => {
            MENU_DATABASE.categories.forEach(category => {
                const menu = category.items.find(item => item.id === menuId);
                if (menu) {
                    recommendedMenus.push(menu);
                }
            });
        });
        
        // 선택 요약 생성
        const selectionSummary = `${mealType} - ${temperature} 음식 - ${spiciness} 음식 - ${foodType}`;
        
        return {
            recommendations: recommendedMenus,
            total_count: recommendedMenus.length,
            selection_summary: selectionSummary
        };
        
    } catch (error) {
        console.error('메뉴 추천 오류:', error);
        throw error;
    }
}

// 메뉴 검색 함수 (프론트엔드에서 직접 검색)
function searchMenu(menuName) {
    console.log('메뉴 검색:', menuName);
    
    const results = [];
    const lowerMenuName = menuName.toLowerCase();
    
    MENU_DATABASE.categories.forEach(category => {
        category.items.forEach(item => {
            if (item.name.toLowerCase().includes(lowerMenuName) || 
                lowerMenuName.includes(item.name.toLowerCase())) {
                results.push({
                    ...item,
                    category: category.name
                });
            }
        });
    });
    
    console.log('검색된 메뉴:', results);
    return results;
}

// 2. 팝업을 여는 함수를 만듭니다.
function openModal(modal) {
    if (modal) {
        modal.classList.add('active'); // 팝업창 보이기
        overlay.classList.add('active'); // 뒷배경 보이기
    }
}

// 3. 팝업을 닫는 함수를 만듭니다.
function closeModal() {
    if (speedModal.classList.contains('active')) {
        speedModal.classList.remove('active');
    }
    if (repeatModal.classList.contains('active')) {
        repeatModal.classList.remove('active');
    }
    overlay.classList.remove('active');
}

// 4. 음성 인식 초기화
function initSpeechRecognition() {
    console.log('음성 인식 초기화 시작');
    console.log('Web Speech API 지원 여부:', 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    
    if ('webkitSpeechRecognition' in window) {
        console.log('webkitSpeechRecognition 사용');
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        console.log('SpeechRecognition 사용');
        recognition = new SpeechRecognition();
    } else {
        console.error('음성 인식을 지원하지 않는 브라우저입니다.');
        alert('음성 인식을 지원하지 않는 브라우저입니다.');
        return false;
    }

    // 음성 인식 설정(사용자 음성 인식 최적화)
    recognition.continuous = true;  // 연속 인식
    recognition.interimResults = true;  // 중간 결과도 받기
    recognition.lang = 'ko-KR';  // 한국어 설정
    recognition.maxAlternatives = 1;  // 최대 대안 수
    
    // Chrome/Edge용 추가 설정 (사용자 음성 인식 최적화)
    if ('webkitSpeechRecognition' in window) {
        try {
            // 문법 설정 제거 (사용자 음성 인식 방해 방지)
            recognition.grammars = null;
            recognition.serviceURI = null;
            
            console.log('Chrome/Edge 음성 인식 설정 완료 (사용자 음성 최적화)');
        } catch (e) {
            console.log('Chrome/Edge 추가 설정 실패 (무시됨):', e.message);
            // 설정 실패해도 기본 기능은 작동
        }
    }
    
    console.log('음성 인식 설정 완료:', {
        continuous: recognition.continuous,
        interimResults: recognition.interimResults,
        lang: recognition.lang
    });

    recognition.onstart = function() {
        console.log('🎤 음성 인식 시작');
        isRecording = true;
        voiceMicIcon.style.animation = 'pulse 1s infinite';
    };

    recognition.onresult = function(event) {
        console.log('음성 인식 결과 이벤트:', event);
        
        // 이미 처리 중이면 무시 (중복 호출 방지)
        if (isProcessing) {
            console.log('⏳ 이미 처리 중 - 중복 호출 방지');
            return;
        }
        
        let finalTranscript = '';
        let interimTranscript = '';
        
        // 최종 결과와 중간 결과 분리
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        
        console.log('📝 최종 텍스트:', finalTranscript);
        console.log('🔄 중간 텍스트:', interimTranscript);
        
        // 최종 결과가 있을 때만 처리 (중간 결과는 무시하여 중복 호출 방지)
        if (finalTranscript.trim()) {
            console.log('✅ 인식된 최종 텍스트:', finalTranscript);
            
            // 먼저 시스템 음성 필터링 (환영메시지 등 시스템음성 우선 차단)
            if (isSystemVoice(finalTranscript)) {
                console.log('❌ 시스템 음성으로 판단되어 무시:', finalTranscript);
                return;
            }
            
            // 사용자 키워드 감지 (환영메시지 중에 사용자가 말하는 경우)
            // 단, 환영메시지에 포함된 단어들은 제외
            const userKeywords = ['메뉴', '돈까스', '쌀국수', '주문', '음식', '추천', '도움', '안내', '카레', '카츠', '오늘', '뭐', '어떤', '네', '예', '좋아', '싫어', '맛있', '배고', '먹고', '마시', '드시', '할게', '할래', '싫어', '싫다', '좋다', '좋아', '괜찮', '괜찮아', '괜찮다', '싶어', '싶다', '원해', '원한다', '주문할게', '주문할래', '주문해', '주문해줘', '주문해주세요'];
            const isUserKeyword = userKeywords.some(keyword => finalTranscript.toLowerCase().includes(keyword.toLowerCase()));
            
            // 음성 재생 중이면 즉시 중단하고 처리 (사용자 입력 최우선)
            if (speechSynthesis.speaking) {
                if (isUserKeyword) {
                    console.log('⏹️ 사용자 키워드 감지 - 음성 재생 즉시 중단:', finalTranscript);
                    speechSynthesis.cancel();
                    console.log('🎯 사용자 키워드 처리 시작:', finalTranscript);
                    processVoiceInput(finalTranscript);
                    return;
                } else {
                    console.log('❌ 시스템이 말하는 중 - 사용자 키워드가 아님, 무시:', finalTranscript);
                    return;
                }
            }
            
            console.log('🎯 사용자 음성 처리 시작:', finalTranscript);
            processVoiceInput(finalTranscript);
        }
    };

    recognition.onerror = function(event) {
        console.error('❌ 음성 인식 오류:', event.error);
        isRecording = false;
        if (voiceMicIcon) {
        voiceMicIcon.style.animation = 'none';
        }
        
        // 모든 오류에 대해 자동 재시작 (버튼을 누르기 전까지 계속)
        if (isVoiceGuideActive && isWaitingForUserInput) {
            console.log('🔄 음성 인식 오류로 인한 재시작 시도 (버튼 누를 때까지 계속)');
            setTimeout(() => {
                if (isVoiceGuideActive && isWaitingForUserInput && !isRecording) {
                    console.log('🔄 음성 인식 재시작');
                    try {
                        recognition.start();
                        isRecording = true;
                    } catch (error) {
                        console.error('❌ 음성 인식 재시작 실패:', error);
                        isRecording = false;
                    }
                }
            }, 1000); // 더 빠른 재시작
        }
    };

    recognition.onend = function() {
        console.log('⏹️ 음성 인식 종료');
        isRecording = false;
        if (voiceMicIcon) {
        voiceMicIcon.style.animation = 'none';
        }
        
        // 음성 안내가 활성화되어 있고 사용자 입력을 기다리는 상태라면 즉시 다시 시작 (버튼을 누르기 전까지 계속)
        if (isVoiceGuideActive && isWaitingForUserInput) {
            console.log('🔄 음성 인식 즉시 재시작 (버튼 누를 때까지 계속)');
            setTimeout(() => {
                if (isVoiceGuideActive && isWaitingForUserInput && !isRecording) {
                    console.log('🔄 음성 인식 재시작 실행');
                    try {
                        recognition.start();
                        isRecording = true;
                    } catch (error) {
                        console.error('❌ 음성 인식 재시작 실패:', error);
                        isRecording = false;
                    }
                }
            }, 500); // 더 빠른 재시작
        }
    };

    console.log('음성 인식 초기화 완료');
    return true;
}

// 5. GitHub API 호출 (재시도 로직 포함)
async function callGPTAPI(userInput, retryCount = 0) {
    const maxRetries = 3;
    const baseDelay = 1000; // 1초
    
    console.log('GitHub API 호출 시작');
    console.log('사용자 입력:', userInput);
    console.log('재시도 횟수:', retryCount);
    console.log('API URL:', GITHUB_API_URL);
    console.log('API 키:', GITHUB_API_KEY ? '설정됨' : '설정되지 않음');
    
    try {
        const requestBody = {
            model: 'openai/gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `당신은 포핸즈 음식점의 친근한 직원입니다.
고객의 질문에 대해 도움을 드리고, 메뉴를 추천해드립니다.
음성 대화를 위해 간결하고 명확하게 답변해주세요.

⚠️ 중요 제약사항:
1. 절대 새로운 메뉴를 생성하지 마세요. 오직 아래 실제 메뉴만 추천하세요.
2. 절대 새로운 옵션을 생성하지 마세요. 오직 아래 실제 옵션만 안내하세요.
3. 메뉴나 옵션에 대한 질문이면 반드시 아래 데이터베이스의 내용만 사용하세요.

📋 실제 메뉴 데이터베이스:

쌀국수 카테고리 (옵션 없음):
- 차돌양지쌀국수 (9,900원)
- 한우쌀국수 (10,900원)  
- 모듬 쌀국수 (11,900원)

돈카츠,카레 카테고리 (옵션 있음):
- 프리미엄 로스카츠(등심) (11,900원)
- 프리미엄 히레츠(안심) (12,900원)
- 통모짜치즈돈카츠 (12,900원)
- 시그니처 경양식돈카츠 (11,900원)
- 모듬카츠A[등심+안심] (13,900원)
- 모듬카츠B[등심+치즈] (13,900원)
- 등심카츠 카레라이스 (10,900원)
- 안심카츠 카레라이스 (12,900원)
- 통모짜치즈 카레라이스 (12,900원)

1인정식 카테고리 (옵션 있음):
- 정식A(쌀국수S+경양식) (11,900원)
- 정식B(쌀국수S+등심) (11,900원)
- 정식C(쌀국수S+안심) (11,900원)
- 정식D(쌀국수S+치즈) (11,900원)

옵션 정보:
돈카츠,카레 메뉴 옵션: 밥많이(무료), 공깃밥추가(1,000원), 레몬추가(500원), 트러플오일추가(500원)
1인정식 메뉴 옵션: 쌀국수사이즈업(3,000원), 밥추가(1,000원), 고수추가(500원), 레몬추가(500원), 트러플오일추가(500원)

고객이 메뉴 관련 질문을 하면 위 실제 메뉴만 추천하고,
일반적인 질문(가격, 위치, 영업시간, 추천 등)에 대해서도 친근하게 답변해주세요.

⚠️ 절대 금지사항:
- 새로운 메뉴명 생성
- 새로운 옵션명 생성  
- 데이터베이스에 없는 메뉴나 옵션 언급
- 가격 정보 임의 변경`
                },
                {
                    role: 'user',
                    content: userInput
                }
            ],
            max_tokens: 1000, // 토큰 수 줄임
            temperature: 0.7, // 온도 낮춤
            top_p: 0.9
        };
        
        console.log('요청 본문:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(GITHUB_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GITHUB_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        console.log('응답 상태:', response.status);
        console.log('응답 헤더:', response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API 응답 오류:', errorText);
            
            // 429 오류 (Too Many Requests)인 경우 재시도
            if (response.status === 429 && retryCount < maxRetries) {
                const delay = baseDelay * Math.pow(2, retryCount); // 지수 백오프
                console.log(`429 오류 - ${delay}ms 후 재시도 (${retryCount + 1}/${maxRetries})`);
                
                await new Promise(resolve => setTimeout(resolve, delay));
                return await callGPTAPI(userInput, retryCount + 1);
            }
            
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('GitHub API 응답:', data);
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const content = data.choices[0].message.content;
            console.log('GitHub API 응답 내용:', content);
            return content;
        } else {
            console.error('예상치 못한 응답 구조:', data);
            return '죄송합니다. 응답을 처리할 수 없습니다.';
        }
    } catch (error) {
        console.error('GitHub API 호출 오류:', error);
        
        // 네트워크 오류나 기타 오류인 경우 재시도
        if (retryCount < maxRetries && !error.message.includes('HTTP error! status: 429')) {
            const delay = baseDelay * Math.pow(2, retryCount);
            console.log(`네트워크 오류 - ${delay}ms 후 재시도 (${retryCount + 1}/${maxRetries})`);
            
            await new Promise(resolve => setTimeout(resolve, delay));
            return await callGPTAPI(userInput, retryCount + 1);
        }
        
        return '죄송합니다. 잠시 문제가 생겼네요. 메뉴에 대해 궁금한 것이 있으시면 말씀해주세요.';
    }
}

// 6. 음성 입력 처리
async function processVoiceInput(transcript) {
    // 중복 처리 방지
    if (isProcessing) {
        console.log('⏳ 이미 처리 중 - processVoiceInput 중복 호출 방지');
        return;
    }
    
    isProcessing = true;
    console.log('🔄 음성 입력 처리 시작:', transcript);
    
    try {
        // 음성안내 프로세스에서 사용자 입력 처리
        if (isVoiceGuideActive) {
            await handleUserInput(transcript);
        } else {
            // GPT API 직접 호출 (음성안내가 비활성화된 경우)
            const response = await callGPTAPI(transcript);
            
            // 응답 유효성 검사 (문자열 응답도 처리)
            if (response) {
                let responseText;
                
                // GPT API 응답 형식 확인
                if (typeof response === 'string') {
                    // 직접 문자열 응답
                    responseText = response;
                } else if (response.response) {
                    // 객체 형태의 응답
                    responseText = response.response;
                } else {
                    // 기타 형식의 응답
                    responseText = String(response);
                }
        
        // GPT 응답을 음성으로 재생
                speakText(responseText);
                
                // 화면에 응답 표시
                showResponse(transcript, responseText);
            } else {
                console.error('API 응답이 유효하지 않습니다:', response);
                speakText('죄송합니다. 응답을 받을 수 없습니다. 다시 말씀해주세요.');
            }
        }
    } catch (error) {
        console.error('음성 입력 처리 오류:', error);
        speakText('죄송합니다. 처리 중 오류가 발생했습니다.');
    } finally {
        // 처리 완료 후 플래그 해제
        isProcessing = false;
        console.log('✅ 음성 입력 처리 완료');
    }
}

// 음성안내 프로세스 함수들
async function startVoiceGuide() {
    console.log('음성안내 시작');
    isVoiceGuideActive = true;
    currentStep = 1;
    isWaitingForUserInput = false;
    
    // 음성 목록 로드 대기
    if (speechSynthesis.getVoices().length === 0) {
        console.log('음성 목록 로드 대기 중...');
        speechSynthesis.addEventListener('voiceschanged', () => {
            console.log('음성 목록 로드 완료:', speechSynthesis.getVoices().length);
            proceedWithVoiceGuide();
        });
    } else {
        proceedWithVoiceGuide();
    }
    
    async function proceedWithVoiceGuide() {
        console.log('음성안내 프로세스 시작');
        
        // 기본 안내 메시지 사용 (GPT API 없이)
        const initialMessage = "안녕하세요. 주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주시고, 못 정하셨으면 '메뉴'라고 말해 주세요.";
        console.log('기본 메시지 음성 재생:', initialMessage);
        
        // 환영메시지 재생 후 마이크 활성화
        speakText(initialMessage, () => {
            console.log('환영메시지 재생 완료 - 마이크 활성화');
            // 사용자 입력 대기 상태로 설정하고 음성 인식 시작
            isWaitingForUserInput = true;
            startListening();
        });
    }
}

function stopVoiceGuide() {
    console.log('음성안내 중지');
    isVoiceGuideActive = false;
    currentStep = 0;
    isWaitingForUserInput = false;
    
    if (recognition) {
        recognition.stop();
    }
    
    if (currentUtterance) {
        speechSynthesis.cancel();
    }
}

async function handleUserInput(userInput) {
    console.log('사용자 입력 처리:', userInput);
    
    if (!isVoiceGuideActive) return;
    
    try {
        const lowerInput = userInput.toLowerCase();
        
        // 1. '메뉴' 키워드 처리 (GPT API 호출하지 않음)
        if (lowerInput.includes('메뉴')) {
            console.log('메뉴 키워드 감지 - GPT API 호출하지 않음');
            const menuResponse = getMenuResponse();
            speakText(menuResponse);
            showResponse(userInput, menuResponse);
            isWaitingForUserInput = true;
            return;
        }
        
        // 2. database.py 메뉴명 처리 (GPT API 호출하지 않음)
        if (isDatabaseMenuName(lowerInput)) {
            console.log('데이터베이스 메뉴명 감지 - GPT API 호출하지 않음');
            const menuName = findMenuNameInInput(lowerInput);
            if (menuName) {
                handleSpecificMenuOrder(menuName);
            } else {
                const menuResponse = getMenuResponse();
                speakText(menuResponse);
                showResponse(userInput, menuResponse);
            }
            isWaitingForUserInput = true;
            return;
        }
        
        // 3. '다시' 키워드 처리 (GPT API 호출하지 않음)
        if (lowerInput.includes('다시') || lowerInput.includes('다시설명') || lowerInput.includes('설명')) {
            console.log('다시 키워드 감지 - GPT API 호출하지 않음');
            if (lastMenuExplanation) {
                // 이전 메뉴 설명 반복
                let message = `${lastMenuExplanation.menuName} 주문 방법을 다시 안내해드리겠습니다.\n\n`;
                message += `가격: ${lastMenuExplanation.price.toLocaleString()}원\n\n`;
                
                if (lastMenuExplanation.procedures && lastMenuExplanation.procedures.length > 0) {
                    message += `주문 방법:\n`;
                    lastMenuExplanation.procedures.forEach((procedure, index) => {
                        message += `${index + 1}번째 ${procedure.instruction}\n`;
                    });
                } else {
                    message += `주문 방법:\n`;
                    message += `첫번째 쌀국수에서 ${lastMenuExplanation.menuName}을 눌러주세요.\n`;
                    message += `두번째 하단에 메뉴가 담긴것이 보이면 + 버튼을 눌러 수량을 추가하실 수 있습니다.\n`;
                    message += `세번째 우측하단에 결제하기 버튼을 눌러주시고 키오스크에 카드를 넣어주세요.`;
                }
                
                message += `\n\n다시 들으시려면 다시라고 말씀해주세요.`;
                
                const cleanMessage = cleanTextForSpeech(message);
                speakText(cleanMessage);
                showResponse(userInput, cleanMessage);
            } else {
                const message = "이전에 설명한 메뉴가 없습니다. 먼저 메뉴를 선택해주세요.";
                speakText(message);
                showResponse(userInput, message);
            }
            isWaitingForUserInput = true;
            return;
        }
        
        // 4. 메뉴 카테고리 처리 (GPT API 호출하지 않음)
        if (lowerInput.includes('쌀국수') || lowerInput.includes('쌀국') || 
            lowerInput.includes('국수') || lowerInput.includes('면')) {
            
            console.log('쌀국수 카테고리 감지 - GPT API 호출하지 않음');
            const phoResponse = "어떤 쌀국수를 원하세요? 차돌양지쌀국수, 한우쌀국수, 모듬 쌀국수가 있습니다. 주문하시고 싶은 메뉴를 알려달세요.";
            speakText(phoResponse);
            showResponse(userInput, phoResponse);
            isWaitingForUserInput = true;
            return;
        }
        
        if (lowerInput.includes('돈까스') || lowerInput.includes('돈카츠') || 
            lowerInput.includes('카츠') || lowerInput.includes('카레')) {
            
            console.log('돈까스/카레 카테고리 감지 - GPT API 호출하지 않음');
            const katsuResponse = "어떤 돈까스를 원하세요? 프리미엄 로스카츠(등심), 프리미엄 히레츠(안심), 통모짜치즈돈카츠, 시그니처 경양식돈카츠, 모듬카츠A[등심+안심], 모듬카츠B[등심+치즈]가 있습니다. 주문하시고 싶은 메뉴를 알려달세요.";
            speakText(katsuResponse);
            showResponse(userInput, katsuResponse);
            isWaitingForUserInput = true;
            return;
        }
        
        // 4-1. 돈까스/카레 개별 메뉴 처리 (GPT API 호출하지 않음)
        const katsuMenuNames = [
            '프리미엄 로스카츠(등심)', '프리미엄 히레츠(안심)', '통모짜치즈돈카츠', 
            '시그니처 경양식돈카츠', '모듬카츠A[등심+안심]', '모듬카츠B[등심+치즈]',
            '등심카츠 카레라이스', '안심카츠 카레라이스', '통모짜치즈 카레라이스'
        ];
        
        const foundKatsuMenu = katsuMenuNames.find(menuName => 
            lowerInput.includes(menuName.toLowerCase().replace(/\s+/g, '')) ||
            menuName.toLowerCase().replace(/\s+/g, '').includes(lowerInput.replace(/\s+/g, ''))
        );
        
        if (foundKatsuMenu) {
            console.log('돈까스/카레 개별 메뉴 감지 - GPT API 호출하지 않음:', foundKatsuMenu);
            handleSpecificMenuOrder(foundKatsuMenu);
            isWaitingForUserInput = true;
            return;
        }
        
        if (lowerInput.includes('정식') || lowerInput.includes('1인정식')) {
            
            console.log('1인정식 카테고리 감지 - GPT API 호출하지 않음');
            const setResponse = "어떤 정식을 원하세요? 정식A(쌀국수S+경양식), 정식B(쌀국수S+등심), 정식C(쌀국수S+안심), 정식D(쌀국수S+치즈)가 있습니다. 주문하시고 싶은 메뉴를 알려달세요.";
            speakText(setResponse);
            showResponse(userInput, setResponse);
            isWaitingForUserInput = true;
            return;
        }
        
        // 5. 불완전한 문장 처리 (GPT API 호출하지 않음)
        if (lowerInput.includes('주문하고') || lowerInput.includes('주문하') || 
            lowerInput.includes('주문') || lowerInput.includes('하고싶')) {
            
            console.log('주문 관련 불완전한 문장 감지 - GPT API 호출하지 않음');
            
            // 주문 관련 안내 메시지
            const orderResponse = "주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주세요. 메뉴를 확인하고 싶으시면 '메뉴'라고 말해주세요.";
            speakText(orderResponse);
            showResponse(userInput, orderResponse);
            
            // 사용자 입력 대기 상태로 전환 (음성 재생 완료 후 자동으로 인식 시작됨)
            isWaitingForUserInput = true;
            return;
        }
        
        // 6. 기타 사용자 입력 처리 (GPT API 호출)
        console.log('기타 사용자 입력 감지 - GPT API 호출');
        const response = await callGPTAPI(userInput);
        
        if (response) {
            let responseText;
            
            // GPT API 응답 형식 확인
            if (typeof response === 'string') {
                responseText = response;
            } else if (response.response) {
                responseText = response.response;
            } else {
                responseText = String(response);
            }
    
            // GPT 응답을 음성으로 재생
            speakText(responseText);
            
            // 화면에 응답 표시
            showResponse(userInput, responseText);
        } else {
            console.error('GPT API 응답이 유효하지 않습니다:', response);
            speakText('죄송합니다. 응답을 받을 수 없습니다. 다시 말씀해주세요.');
        }
        
        // 사용자 입력 대기 상태로 전환
        isWaitingForUserInput = true;
        
    } catch (error) {
        console.error('사용자 입력 처리 오류:', error);
        speakText('죄송합니다. 처리 중 오류가 발생했습니다. 다시 말씀해주세요.');
        
        isWaitingForUserInput = true;
    }
}

// 마크다운 문법 제거 및 숫자 읽기 개선 함수
function cleanTextForSpeech(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1')  // **텍스트** → 텍스트
        .replace(/\*(.*?)\*/g, '$1')      // *텍스트* → 텍스트
        .replace(/^- /gm, '')             // - 시작하는 줄에서 - 제거
        .replace(/\n\n+/g, '\n')          // 여러 줄바꿈을 하나로
        .replace(/1번째/g, '첫번째,')      // 1번째 → 첫번째,
        .replace(/2번째/g, '두번째,')      // 2번째 → 두번째,
        .replace(/3번째/g, '세번째,')      // 3번째 → 세번째,
        .replace(/4번째/g, '네번째,')      // 4번째 → 네번째,
        .replace(/5번째/g, '다섯번째,')    // 5번째 → 다섯번째,
        .replace(/첫번째 /g, '첫번째, ')   // 첫번째 → 첫번째,
        .replace(/두번째 /g, '두번째, ')   // 두번째 → 두번째,
        .replace(/세번째 /g, '세번째, ')   // 세번째 → 세번째,
        .replace(/네번째 /g, '네번째, ')   // 네번째 → 네번째,
        .replace(/마지막으로 /g, '마지막으로, ') // 마지막으로 → 마지막으로,
        .trim();
}

// database.py의 메뉴명인지 확인하는 함수
function isDatabaseMenuName(transcript) {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    // database.py의 모든 메뉴명 목록
    const menuNames = [
        '차돌양지쌀국수', '한우쌀국수', '모듬 쌀국수',
        '프리미엄 로스카츠(등심)', '프리미엄 히레츠(안심)', '통모짜치즈돈카츠', 
        '시그니처 경양식돈카츠', '모듬카츠A[등심+안심]', '모듬카츠B[등심+치즈]',
        '등심카츠 카레라이스', '안심카츠 카레라이스', '통모짜치즈 카레라이스',
        '정식A(쌀국수S+경양식)', '정식B(쌀국수S+등심)', '정식C(쌀국수S+안심)', '정식D(쌀국수S+치즈)'
    ];
    
    // 입력 정규화 (대소문자, 공백, 특수문자 제거)
    const normalizedInput = lowerTranscript
        .replace(/\s+/g, '')           // 공백 제거
        .replace(/[()\[\]+]/g, '')     // 괄호, 대괄호, 플러스 제거
        .replace(/[가-힣]/g, match => {
            // 한글 발음 유사성 고려
            const similarChars = {
                'ㅏ': ['ㅓ', 'ㅗ', 'ㅜ'],
                'ㅓ': ['ㅏ', 'ㅗ', 'ㅜ'],
                'ㅗ': ['ㅏ', 'ㅓ', 'ㅜ'],
                'ㅜ': ['ㅏ', 'ㅓ', 'ㅗ'],
                'ㅡ': ['ㅓ', 'ㅜ'],
                'ㅣ': ['ㅔ', 'ㅐ'],
                'ㅔ': ['ㅣ', 'ㅐ'],
                'ㅐ': ['ㅣ', 'ㅔ']
            };
            return match;
        })
        // 어눌한 발음 패턴 정규화
        .replace(/통모짜치즈/gi, '통모짜치즈')
        .replace(/돈카츠/gi, '돈카츠')
        .replace(/돈까스/gi, '돈카츠')
        .replace(/카츠/gi, '돈카츠')
        .replace(/프리미엄/gi, '프리미엄')
        .replace(/로스카츠/gi, '로스카츠')
        .replace(/히레츠/gi, '히레츠')
        .replace(/시그니처/gi, '시그니처')
        .replace(/경양식/gi, '경양식')
        .replace(/모듬카츠/gi, '모듬카츠')
        .replace(/등심/gi, '등심')
        .replace(/안심/gi, '안심')
        .replace(/치즈/gi, '치즈')
        .replace(/카레라이스/gi, '카레라이스')
        .replace(/정식/gi, '정식')
        .replace(/쌀국수/gi, '쌀국수')
        .replace(/차돌양지/gi, '차돌양지')
        .replace(/한우/gi, '한우')
        .replace(/모듬/gi, '모듬');
    
    // 메뉴명이 포함되어 있는지 확인 (유연한 매칭)
    return menuNames.some(menuName => {
        const normalizedMenuName = menuName.toLowerCase()
            .replace(/\s+/g, '')           // 공백 제거
            .replace(/[()\[\]+]/g, '');    // 괄호, 대괄호, 플러스 제거
        
        // 정확한 매칭
        if (normalizedInput === normalizedMenuName) {
            return true;
        }
        
        // 부분 매칭 (입력이 메뉴명에 포함되거나 그 반대)
        if (normalizedInput.includes(normalizedMenuName) || normalizedMenuName.includes(normalizedInput)) {
            return true;
        }
        
        // 유사성 매칭 (80% 이상 일치)
        const similarity = calculateSimilarity(normalizedInput, normalizedMenuName);
        if (similarity >= 0.8) {
            return true;
        }
        
        return false;
    });
}

// 입력에서 메뉴명을 찾는 함수
function findMenuNameInInput(transcript) {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    // database.py의 모든 메뉴명 목록
    const menuNames = [
        '차돌양지쌀국수', '한우쌀국수', '모듬 쌀국수',
        '프리미엄 로스카츠(등심)', '프리미엄 히레츠(안심)', '통모짜치즈돈카츠', 
        '시그니처 경양식돈카츠', '모듬카츠A[등심+안심]', '모듬카츠B[등심+치즈]',
        '등심카츠 카레라이스', '안심카츠 카레라이스', '통모짜치즈 카레라이스',
        '정식A(쌀국수S+경양식)', '정식B(쌀국수S+등심)', '정식C(쌀국수S+안심)', '정식D(쌀국수S+치즈)'
    ];
    
    // 입력 정규화 (대소문자, 공백, 특수문자 제거)
    const normalizedInput = lowerTranscript
        .replace(/\s+/g, '')           // 공백 제거
        .replace(/[()\[\]+]/g, '')     // 괄호, 대괄호, 플러스 제거
        // 어눌한 발음 패턴 정규화
        .replace(/통모짜치즈/gi, '통모짜치즈')
        .replace(/돈카츠/gi, '돈카츠')
        .replace(/돈까스/gi, '돈카츠')
        .replace(/카츠/gi, '돈카츠')
        .replace(/프리미엄/gi, '프리미엄')
        .replace(/로스카츠/gi, '로스카츠')
        .replace(/히레츠/gi, '히레츠')
        .replace(/시그니처/gi, '시그니처')
        .replace(/경양식/gi, '경양식')
        .replace(/모듬카츠/gi, '모듬카츠')
        .replace(/등심/gi, '등심')
        .replace(/안심/gi, '안심')
        .replace(/치즈/gi, '치즈')
        .replace(/카레라이스/gi, '카레라이스')
        .replace(/정식/gi, '정식')
        .replace(/쌀국수/gi, '쌀국수')
        .replace(/차돌양지/gi, '차돌양지')
        .replace(/한우/gi, '한우')
        .replace(/모듬/gi, '모듬');
    
    // 메뉴명이 포함되어 있는지 확인하고 해당 메뉴명 반환 (유연한 매칭)
    for (const menuName of menuNames) {
        const normalizedMenuName = menuName.toLowerCase()
            .replace(/\s+/g, '')           // 공백 제거
            .replace(/[()\[\]+]/g, '');    // 괄호, 대괄호, 플러스 제거
        
        // 정확한 매칭
        if (normalizedInput === normalizedMenuName) {
            return menuName;
        }
        
        // 부분 매칭 (입력이 메뉴명에 포함되거나 그 반대)
        if (normalizedInput.includes(normalizedMenuName) || normalizedMenuName.includes(normalizedInput)) {
            return menuName;
        }
        
        // 유사성 매칭 (80% 이상 일치)
        const similarity = calculateSimilarity(normalizedInput, normalizedMenuName);
        if (similarity >= 0.8) {
            return menuName;
        }
    }
    
    return null;
}

// 문자열 유사성 계산 함수 (레벤슈타인 거리 기반)
function calculateSimilarity(str1, str2) {
    if (str1 === str2) return 1.0;
    if (str1.length === 0 || str2.length === 0) return 0.0;
    
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;
    
    // 2차원 배열 초기화
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [];
        for (let j = 0; j <= len2; j++) {
            matrix[i][j] = 0;
        }
    }
    
    // 첫 번째 행과 열 초기화
    for (let i = 0; i <= len1; i++) {
        matrix[i][0] = i;
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }
    
    // 레벤슈타인 거리 계산
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // 삭제
                matrix[i][j - 1] + 1,      // 삽입
                matrix[i - 1][j - 1] + cost // 치환
            );
        }
    }
    
    const distance = matrix[len1][len2];
    const maxLength = Math.max(len1, len2);
    return 1 - (distance / maxLength);
}

// 특정 메뉴 주문 안내 함수
function handleSpecificMenuOrder(menuName) {
    console.log('특정 메뉴 주문 안내:', menuName);
    
    // 메뉴 정보 가져오기
    const menuInfo = getMenuInfo(menuName);
    if (!menuInfo) {
        const message = "해당 메뉴를 찾을 수 없습니다. 메뉴를 다시 확인해주세요.";
        speakText(message);
        showResponse(menuName, message);
        return;
    }
    
    // 주문 안내 메시지 생성
    let message = `${menuName} 주문 방법을 안내해드리겠습니다.\n\n`;
    
    // 주문 절차 안내 (procedures의 instruction을 그대로 사용)
    if (menuInfo.procedures && menuInfo.procedures.length > 0) {
        menuInfo.procedures.forEach((procedure, index) => {
            message += `${procedure.instruction}\n`;
        });
    } else {
        message += `첫번째 쌀국수에서 ${menuName}을 눌러주세요.\n`;
        message += `두번째 하단에 메뉴가 담긴것이 보이면 + 버튼을 눌러 수량을 추가하실 수 있습니다.\n`;
        message += `세번째 우측하단에 결제하기 버튼을 눌러주시고 키오스크에 카드를 넣어주세요.`;
    }
    
    message += `\n\n다시 들으시려면 다시라고 말씀해주세요.`;
    
    // 이전 메뉴 설명 저장
    lastMenuExplanation = {
        menuName: menuName,
        price: menuInfo.price,
        procedures: menuInfo.procedures || []
    };
    
    const cleanMessage = cleanTextForSpeech(message);
    speakText(cleanMessage);
    showResponse(menuName, cleanMessage);
}

// 메뉴 정보 가져오기 함수
function getMenuInfo(menuName) {
    // database.py의 메뉴 데이터 (실제로는 API에서 가져와야 함)
    const menuData = {
        '차돌양지쌀국수': {
            price: 9900,
            options: null,
            procedures: [
                { instruction: '첫번째 상단 메뉴에서 쌀국수 버튼을 누르세요' },
                { instruction: '두번째 차돌양지쌀국수 버튼을 선택하세요' },
                { instruction: '세번째 하단의 주문담기 버튼을 누르세요' },
                { instruction: '마지막으로 우측 하단에 결제하기 버튼을 누르시고 카드를 키오스크에 넣어주세요' }
            ]
        },
        '한우쌀국수': {
            price: 10900,
            options: null,
            procedures: [
                { instruction: '첫번째 상단 메뉴에서 쌀국수 버튼을 누르세요' },
                { instruction: '두번째 한우쌀국수 버튼을 선택하세요' },
                { instruction: '세번째 하단의 주문담기 버튼을 누르세요' },
                { instruction: '마지막으로 우측 하단에 결제하기 버튼을 누르시고 카드를 키오스크에 넣어주세요' }
            ]
        },
        '모듬 쌀국수': {
            price: 11900,
            options: null,
            procedures: [
                { instruction: '첫번째 상단 메뉴에서 쌀국수 버튼을 누르세요' },
                { instruction: '두번째 모듬 쌀국수 버튼을 선택하세요' },
                { instruction: '세번째 하단의 주문담기 버튼을 누르세요' },
                { instruction: '마지막으로 우측 하단에 결제하기 버튼을 누르시고 카드를 키오스크에 넣어주세요' }
            ]
        },
        '프리미엄 로스카츠(등심)': {
            price: 11900,
            options: [
                { name: '밥많이', price: 0 },
                { name: '공깃밥 추가', price: 1000 },
                { name: '레몬추가', price: 500 },
                { name: '트러플오일 추가 주문', price: 500 }
            ],
            procedures: [
                { instruction: '첫번째 상단 메뉴에서 돈카츠, 카레 버튼을 누르세요' },
                { instruction: '두번째 프리미엄 로스카츠(등심) 버튼을 선택하세요' },
                { instruction: '세번째 옵션을 선택하실 수 있습니다. 밥많이는 무료, 공깃밥추가는 1000원, 레몬추가는 500원, 트러플오일추가는 500원 입니다. 원하시는 옵션이 있으시면 선택해주시고 하단의 주문담기 버튼을 누르세요' },
                { instruction: '마지막으로 우측 하단에 결제하기 버튼을 누르시고 카드를 키오스크에 넣어주세요' }
            ]
        },
        '프리미엄 히레츠(안심)': {
            price: 12900,
            options: [
                { name: '밥많이', price: 0 },
                { name: '공깃밥 추가', price: 1000 },
                { name: '레몬추가', price: 500 },
                { name: '트러플오일 추가 주문', price: 500 }
            ],
            procedures: [
                { instruction: '첫번째 상단 메뉴에서 돈카츠, 카레 버튼을 누르세요' },
                { instruction: '두번째 프리미엄 히레츠(안심) 버튼을 선택하세요' },
                { instruction: '세번째 옵션을 선택하실 수 있습니다. 밥많이는 무료, 공깃밥추가는 1000원, 레몬추가는 500원, 트러플오일추가는 500원 입니다. 원하시는 옵션이 있으시면 선택해주시고 하단의 주문담기 버튼을 누르세요' },
                { instruction: '마지막으로 우측 하단에 결제하기 버튼을 누르시고 카드를 키오스크에 넣어주세요' }
            ]
        },
        '통모짜치즈돈카츠': {
            price: 12900,
            options: [
                { name: '밥많이', price: 0 },
                { name: '공깃밥 추가', price: 1000 },
                { name: '레몬추가', price: 500 },
                { name: '트러플오일 추가 주문', price: 500 }
            ],
            procedures: [
                { instruction: '첫번째 상단 메뉴에서 돈카츠, 카레 버튼을 누르세요' },
                { instruction: '두번째 통모짜치즈돈카츠 버튼을 선택하세요' },
                { instruction: '세번째 옵션을 선택하실 수 있습니다. 밥많이는 무료, 공깃밥추가는 1000원, 레몬추가는 500원, 트러플오일추가는 500원 입니다. 원하시는 옵션이 있으시면 선택해주시고 하단의 주문담기 버튼을 누르세요' },
                { instruction: '마지막으로 우측 하단에 결제하기 버튼을 누르시고 카드를 키오스크에 넣어주세요' }
            ]
        },
        '정식A(쌀국수S+경양식)': {
            price: 11900,
            options: [
                { name: '쌀국수사이즈업', price: 3000 },
                { name: '밥추가', price: 1000 },
                { name: '고수추가', price: 500 },
                { name: '레몬추가', price: 500 },
                { name: '트러플오일 추가', price: 500 }
            ],
            procedures: [
                { instruction: '첫번째 상단 메뉴에서 1인정식 버튼을 누르세요' },
                { instruction: '두번째 정식A(쌀국수S+경양식) 버튼을 선택하세요' },
                { instruction: '세번째 옵션을 선택하실 수 있습니다. 쌀국수 사이즈업은 3000원, 밥추가는 1000원, 고수추가는 500원, 레몬추가는 500원, 트러플오일추가는 500원 입니다. 원하시는 옵션이 있으시면 선택해주시고 하단의 주문담기 버튼을 누르세요' },
                { instruction: '마지막으로 우측 하단에 결제하기 버튼을 누르시고 카드를 키오스크에 넣어주세요' }
            ]
        },
        '정식B(쌀국수S+등심)': {
            price: 10900,
            options: [
                { name: '쌀국수사이즈업', price: 3000 },
                { name: '밥추가', price: 1000 },
                { name: '고수추가', price: 500 },
                { name: '레몬추가', price: 500 },
                { name: '트러플오일 추가', price: 500 }
            ],
            procedures: [
                { instruction: '첫번째 상단 메뉴에서 1인정식 버튼을 누르세요' },
                { instruction: '두번째 정식B(쌀국수S+등심) 버튼을 선택하세요' },
                { instruction: '세번째 옵션을 선택하실 수 있습니다. 쌀국수 사이즈업은 3000원, 밥추가는 1000원, 고수추가는 500원, 레몬추가는 500원, 트러플오일추가는 500원 입니다. 원하시는 옵션이 있으시면 선택해주시고 하단의 주문담기 버튼을 누르세요' },
                { instruction: '마지막으로 우측 하단에 결제하기 버튼을 누르시고 카드를 키오스크에 넣어주세요' }
            ]
        },
        '정식C(쌀국수S+안심)': {
            price: 12900,
            options: [
                { name: '쌀국수사이즈업', price: 3000 },
                { name: '밥추가', price: 1000 },
                { name: '고수추가', price: 500 },
                { name: '레몬추가', price: 500 },
                { name: '트러플오일 추가', price: 500 }
            ],
            procedures: [
                { instruction: '첫번째 상단 메뉴에서 1인정식 버튼을 누르세요' },
                { instruction: '두번째 정식C(쌀국수S+안심) 버튼을 선택하세요' },
                { instruction: '세번째 옵션을 선택하실 수 있습니다. 쌀국수 사이즈업은 3000원, 밥추가는 1000원, 고수추가는 500원, 레몬추가는 500원, 트러플오일추가는 500원 입니다. 원하시는 옵션이 있으시면 선택해주시고 하단의 주문담기 버튼을 누르세요' },
                { instruction: '마지막으로 우측 하단에 결제하기 버튼을 누르시고 카드를 키오스크에 넣어주세요' }
            ]
        },
        '정식D(쌀국수S+치즈)': {
            price: 12900,
            options: [
                { name: '쌀국수사이즈업', price: 3000 },
                { name: '밥추가', price: 1000 },
                { name: '고수추가', price: 500 },
                { name: '레몬추가', price: 500 },
                { name: '트러플오일 추가', price: 500 }
            ],
            procedures: [
                { instruction: '첫번째 상단 메뉴에서 1인정식 버튼을 누르세요' },
                { instruction: '두번째 정식D(쌀국수S+치즈) 버튼을 선택하세요' },
                { instruction: '세번째 옵션을 선택하실 수 있습니다. 쌀국수 사이즈업은 3000원, 밥추가는 1000원, 고수추가는 500원, 레몬추가는 500원, 트러플오일추가는 500원 입니다. 원하시는 옵션이 있으시면 선택해주시고 하단의 주문담기 버튼을 누르세요' },
                { instruction: '마지막으로 우측 하단에 결제하기 버튼을 누르시고 카드를 키오스크에 넣어주세요' }
            ]
        }
        // 다른 메뉴들도 추가 가능
    };
    
    return menuData[menuName] || null;
}

// 시스템 음성 필터링 함수 (환영메시지 우선 차단)
function isSystemVoice(transcript) {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    // 1. 사용자 키워드 최우선 확인 (시스템이 말하는 중이어도 사용자 키워드면 사용자 음성)
    const isMenuKeyword = lowerTranscript.includes('메뉴');
    const isDatabaseMenu = isDatabaseMenuName(lowerTranscript);
    const isUserFoodKeyword = lowerTranscript.includes('쌀국수') || lowerTranscript.includes('돈까스') || 
                             lowerTranscript.includes('돈카츠') || lowerTranscript.includes('카레') || 
                             lowerTranscript.includes('카츠') || lowerTranscript.includes('먹고') || 
                             lowerTranscript.includes('싶어') || lowerTranscript.includes('싶다');
    
    if (isMenuKeyword || isDatabaseMenu || isUserFoodKeyword) {
        console.log('✅ 사용자 키워드 감지 - 사용자 음성으로 판단:', transcript);
        return false; // 사용자 음성으로 처리
    }
    
    // 2. 환영메시지 단어들 차단 (사용자 키워드가 아닌 경우만)
    const welcomeWords = ['안녕하세요', '주문하고', '메뉴명을', '말씀해주시고', '못', '정하셨으면', '메뉴라고', '말해', '주세요', '있으시면', '정하셨으면', '말씀해주시고'];
    const hasWelcomeWord = welcomeWords.some(word => lowerTranscript.includes(word));
    
    if (hasWelcomeWord) {
        console.log('❌ 환영메시지 단어 감지 - 시스템음성으로 판단 (절대 사용자 음성 아님):', transcript);
        return true;
    }
    
    // 3. 시스템이 말하는 중이면 나머지 입력은 시스템음성으로 판단
    if (speechSynthesis.speaking) {
        console.log('❌ 시스템이 말하는 중 - 시스템음성으로 판단:', transcript);
        return true;
    }
    
    // 4. 반복되는 단어 패턴 감지 (시스템음성 특징)
    const repeatedWords = ['주문하고', '주문하고', '주문하고', '주문하고'];
    const hasRepeatedPattern = repeatedWords.some(word => {
        const count = (lowerTranscript.match(new RegExp(word, 'g')) || []).length;
        return count >= 3; // 3번 이상 반복되면 시스템음성으로 판단
    });
    
    if (hasRepeatedPattern) {
        console.log('❌ 반복 패턴 감지 - 시스템 음성으로 판단:', transcript);
        return true;
    }
    
    // 5. 매우 명확한 시스템 음성 패턴만 필터링 (완전한 문장 매칭)
    const exactSystemPhrases = [
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
    
    // 정확한 시스템 음성 패턴 확인 (완전한 문장 매칭만)
    for (const phrase of exactSystemPhrases) {
        if (lowerTranscript === phrase.toLowerCase()) {
            console.log('❌ 시스템 음성 감지됨 (완전한 문장 매칭):', phrase);
            return true;
        }
    }
    
    // 6. 사용자 입력으로 판단 (사용자 입력 최우선 정책)
    console.log('✅ 사용자 음성으로 판단 (사용자 입력 최우선):', transcript);
    return false;
}

// 메뉴 응답 생성 함수 (database.py의 실제 메뉴만 사용)
function getMenuResponse() {
    console.log('데이터베이스 메뉴로 응답 생성');
    
    let response = "포핸즈 메뉴를 소개해드리겠습니다.\n\n";
    
    MENU_DATABASE.categories.forEach(category => {
        // 카테고리별로 2-3개 메뉴만 언급 (가격 미포함)
        const sampleItems = category.items.slice(0, 3);
        const itemNames = sampleItems.map(item => item.name).join(', ');
        
        if (category.name === '쌀국수') {
            response += `쌀국수 카테고리에는 ${itemNames} 등이 있습니다.\n`;
        } else if (category.name === '돈카츠,카레') {
            response += `돈카츠, 카레 카테고리에는 ${itemNames} 등이 있습니다. 이 메뉴들은 옵션을 선택할 수 있습니다.\n`;
        } else if (category.name === '1인정식') {
            response += `1인정식 카테고리에는 ${itemNames} 등이 있습니다. 이 메뉴들은 옵션을 선택할 수 있습니다.\n`;
        } else if (category.name === '사이드와 추가메뉴') {
            response += `사이드와 추가메뉴 카테고리에는 ${itemNames} 등이 있습니다.\n`;
        } else {
            response += `${category.name} 카테고리에는 ${itemNames} 등이 있습니다.\n`;
        }
    });
    
    response += "\n주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주세요.";
    
    return cleanTextForSpeech(response);
}

// 쌀국수 메뉴 응답 생성 함수 (사용자가 쌀국수를 원할 때)
function getPhoMenuResponse() {
    console.log('쌀국수 메뉴 응답 생성');
    
    // database.py의 실제 쌀국수 메뉴 데이터
    const phoMenus = [
        { name: "차돌양지쌀국수", price: 9900 },
        { name: "한우쌀국수", price: 10900 },
        { name: "모듬 쌀국수", price: 11900 }
    ];
    
    let response = "쌀국수를 원하시는군요! 저희 포핸즈에는 ";
    
    phoMenus.forEach((menu, index) => {
        if (index === phoMenus.length - 1) {
            response += `${menu.name}이 있습니다.`;
        } else {
            response += `${menu.name}, `;
        }
    });
    
    response += " 어떤 쌀국수를 주문하시겠어요?";
    
    return cleanTextForSpeech(response);
}

// 돈까스 메뉴 응답 생성 함수 (사용자가 돈까스를 원할 때)
function getKatsuMenuResponse() {
    console.log('돈까스 메뉴 응답 생성');
    
    // database.py의 실제 돈까스 메뉴 데이터
    const katsuMenus = [
        { name: "프리미엄 로스카츠(등심)", price: 11900 },
        { name: "프리미엄 히레츠(안심)", price: 12900 },
        { name: "통모짜치즈돈카츠", price: 12900 },
        { name: "시그니처 경양식돈카츠", price: 11900 },
        { name: "모듬카츠A[등심+안심]", price: 13900 },
        { name: "모듬카츠B[등심+치즈]", price: 13900 },
        { name: "등심카츠 카레라이스", price: 10900 },
        { name: "안심카츠 카레라이스", price: 12900 },
        { name: "통모짜치즈 카레라이스", price: 12900 }
    ];
    
    let response = "돈까스를 원하시는군요! 저희 포핸즈에는 ";
    
    // 처음 3개 메뉴만 언급
    const firstThreeMenus = katsuMenus.slice(0, 3);
    firstThreeMenus.forEach((menu, index) => {
        if (index === firstThreeMenus.length - 1) {
            response += `${menu.name}이 있습니다.`;
        } else {
            response += `${menu.name}, `;
        }
    });
    
    response += " 이 메뉴들은 옵션을 선택할 수 있습니다. 어떤 돈까스를 주문하시겠어요?";
    
    return cleanTextForSpeech(response);
}

// 특정 쌀국수 메뉴 주문 안내 함수
function handleSpecificPhoMenuOrder(userInput) {
    console.log('특정 쌀국수 메뉴 주문 안내:', userInput);
    
    try {
        // 사용자 입력에서 메뉴명 추출 (공백 제거하여 비교)
        let menuName = '';
        let menuPrice = 0;
        const normalizedInput = userInput.toLowerCase().replace(/\s+/g, ''); // 공백 제거
        
        if (normalizedInput.includes('차돌양지')) {
            menuName = '차돌양지쌀국수';
            menuPrice = 9900;
        } else if (normalizedInput.includes('한우')) {
            menuName = '한우쌀국수';
            menuPrice = 10900;
        } else if (normalizedInput.includes('모듬')) {
            menuName = '모듬 쌀국수';
            menuPrice = 11900;
        } else {
            // 기본값
            menuName = '쌀국수';
            menuPrice = 9900;
        }
        
        // getMenuInfo를 사용하여 일관된 주문 안내 제공
        handleSpecificMenuOrder(menuName);
        
    } catch (error) {
        console.error('쌀국수 메뉴 주문 안내 오류:', error);
        const errorMessage = '죄송합니다. 주문 안내 중 오류가 발생했습니다. 다시 말씀해주세요.';
        speakText(errorMessage);
        showResponse(userInput, errorMessage);
    }
}

// 특정 메뉴 주문 안내 함수 (getMenuInfo의 procedures 사용)
function handleSpecificMenuOrder(menuName) {
    console.log('특정 메뉴 주문 안내:', menuName);
    
    // 메뉴 정보 가져오기
    const menuInfo = getMenuInfo(menuName);
    if (!menuInfo) {
        const message = "해당 메뉴를 찾을 수 없습니다. 메뉴를 다시 확인해주세요.";
        speakText(message);
        showResponse(menuName, message);
        return;
    }
    
    // 주문 안내 메시지 생성
    let message = `${menuName} 주문 방법을 안내해드리겠습니다.\n\n`;
    
    // 주문 절차 안내 (procedures의 instruction을 그대로 사용)
    if (menuInfo.procedures && menuInfo.procedures.length > 0) {
        menuInfo.procedures.forEach((procedure, index) => {
            message += `${procedure.instruction}\n`;
        });
    } else {
        message += `첫번째 쌀국수에서 ${menuName}을 눌러주세요.\n`;
        message += `두번째 하단에 메뉴가 담긴것이 보이면 + 버튼을 눌러 수량을 추가하실 수 있습니다.\n`;
        message += `세번째 우측하단에 결제하기 버튼을 눌러주시고 키오스크에 카드를 넣어주세요.`;
    }
    
    message += `\n\n다시 들으시려면 다시라고 말씀해주세요.`;
    
    // 이전 메뉴 설명 저장
    lastMenuExplanation = {
        menuName: menuName,
        price: menuInfo.price,
        procedures: menuInfo.procedures || []
    };
    
    const cleanMessage = cleanTextForSpeech(message);
    speakText(cleanMessage);
    showResponse(menuName, cleanMessage);
}

function startListening() {
    console.log('🎤 startListening 호출됨');
    console.log('음성 안내 활성화:', isVoiceGuideActive);
    console.log('사용자 입력 대기:', isWaitingForUserInput);
    
    if (!isVoiceGuideActive || !isWaitingForUserInput) {
        console.log('❌ 음성 인식 시작 조건 미충족');
        return;
    }
    
    console.log('🎤 음성 인식 시작');
    
    if (recognition) {
        // 이미 인식 중이면 무시 (중복 시작 방지)
        if (isRecording) {
            console.log('⏳ 이미 인식 중 - 중복 시작 방지');
            return;
        }
        
        console.log('🆕 새로운 음성 인식 시작');
        try {
            recognition.start();
            isRecording = true;
            console.log('✅ 음성 인식 시작 성공');
        } catch (error) {
            console.error('❌ 음성 인식 시작 실패:', error);
            isRecording = false;
            
            // InvalidStateError인 경우 잠시 후 재시도
            if (error.name === 'InvalidStateError') {
                console.log('🔄 InvalidStateError - 500ms 후 재시도');
                setTimeout(() => {
                    try {
                        recognition.start();
                        isRecording = true;
                        console.log('✅ 음성 인식 재시도 성공');
                    } catch (retryError) {
                        console.error('❌ 음성 인식 재시도 실패:', retryError);
                        isRecording = false;
                    }
                }, 500);
            }
        }
    } else {
        console.error('❌ 음성 인식 객체가 없습니다');
    }
}

// 7. 텍스트를 음성으로 변환
function speakText(text, callback) {
    console.log('=== speakText 함수 호출됨 ===');
    console.log('원본 텍스트:', text);
    
    // 텍스트 유효성 검사
    if (!text || text === undefined || text === null) {
        console.error('❌ speakText에 유효하지 않은 텍스트가 전달됨:', text);
        return;
    }
    
    // 마크다운 문법 제거
    const cleanText = cleanTextForSpeech(text);
    console.log('정리된 텍스트:', cleanText);
    
    console.log('SpeechSynthesis 지원 여부:', 'speechSynthesis' in window);
    console.log('현재 음성 목록 개수:', speechSynthesis.getVoices().length);
    console.log('speechSynthesis 객체:', speechSynthesis);
    
    if (!('speechSynthesis' in window)) {
        console.error('이 브라우저는 음성 합성을 지원하지 않습니다.');
        alert('이 브라우저는 음성 합성을 지원하지 않습니다.');
        return;
    }
    
    if (!cleanText || cleanText.trim() === '') {
        console.error('재생할 텍스트가 없습니다.');
        return;
    }

    if (currentUtterance) {
        speechSynthesis.cancel();
    }

    currentUtterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance.lang = 'ko-KR';
    currentUtterance.rate = speechRate;
    currentUtterance.pitch = 1;
    currentUtterance.volume = 1;

    // 이벤트 리스너 추가
    currentUtterance.onstart = function() {
        console.log('음성 재생 시작됨');
        // 음성 재생 시작 시 자막 표시
        showResponse('', cleanText);
    };

    currentUtterance.onend = function() {
        console.log('음성 재생 종료됨');
        playCount++;
        if (playCount < repeatCount) {
            console.log('반복 재생:', playCount + 1, '/', repeatCount);
            setTimeout(() => {
            speechSynthesis.speak(currentUtterance);
            }, 1000);
        } else {
            // 반복 재생 완료 시 카운트 초기화
            playCount = 0;
            // 음성 재생 완료 시 자막 제거
            const existingResponse = document.querySelector('.response-display');
            if (existingResponse) {
                existingResponse.remove();
            }
            
            // 콜백 함수 호출 (음성 재생 완료 후)
            if (callback && typeof callback === 'function') {
                console.log('음성 재생 완료 - 콜백 함수 호출');
                callback();
            }
        }
    };

    currentUtterance.onerror = function(event) {
        console.log('음성 재생 상태 변경:', event.error);
        
        // interrupted는 정상적인 중단이므로 오류로 처리하지 않음
        if (event.error === 'interrupted') {
            console.log('음성 재생이 중단되었습니다 (새로운 음성 시작)');
            return;
        }
        
        // 기타 오류만 알림
        console.error('음성 재생 오류:', event.error);
        alert('음성 재생 중 오류가 발생했습니다: ' + event.error);
    };

    // 한국어 음성 찾기
    const voices = speechSynthesis.getVoices();
    const koreanVoice = voices.find(voice => 
        voice.lang.includes('ko') || voice.lang.includes('KR')
    );
    
    if (koreanVoice) {
        currentUtterance.voice = koreanVoice;
        console.log('한국어 음성 사용:', koreanVoice.name);
    } else {
        console.log('한국어 음성을 찾을 수 없어 기본 음성 사용');
    }

    console.log('음성 재생 시도 중...');
    console.log('음성 설정:', {
        text: cleanText,
        lang: currentUtterance.lang,
        voice: currentUtterance.voice ? currentUtterance.voice.name : '기본',
        rate: currentUtterance.rate,
        volume: currentUtterance.volume
    });
    
    try {
    speechSynthesis.speak(currentUtterance);
        console.log('speechSynthesis.speak() 호출 완료');
    } catch (error) {
        console.error('speechSynthesis.speak() 호출 오류:', error);
        alert('음성 재생을 시작할 수 없습니다: ' + error.message);
    }
}

// 음성 테스트 함수 (디버깅용)
function testVoice() {
    console.log('음성 테스트 시작');
    const testText = "안녕하세요. 음성 테스트입니다.";
    speakText(testText);
}

// 8. 응답 화면 표시
function showResponse(userInput, gptResponse) {
    // 기존 응답 제거
    const existingResponse = document.querySelector('.response-display');
    if (existingResponse) {
        existingResponse.remove();
    }

    // 새 응답 생성
    const responseDiv = document.createElement('div');
    responseDiv.className = 'response-display';
    responseDiv.innerHTML = `
        <div class="response-card">
            <h3>사용자: ${userInput}</h3>
            <p>안내: ${gptResponse}</p>
        </div>
    `;
    
    // 스타일 추가 - 화면 오른쪽에 고정
    responseDiv.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        z-index: 1000;
        max-width: 400px;
        min-width: 300px;
        max-height: 80vh;
        overflow-y: auto;
        text-align: left;
        font-size: 14px;
        line-height: 1.4;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;

    document.body.appendChild(responseDiv);

    // 자동 제거하지 않음 - 다음 음성으로 갱신될 때까지 유지
    console.log('자막 표시됨:', gptResponse);
}

// 9. 음성 마이크 아이콘 클릭 이벤트 설정
function setupVoiceMicIcon() {
    voiceMicIcon = document.querySelector('.voice-mic-icon');
    console.log('마이크 아이콘 요소 찾기:', voiceMicIcon);
    
    if (!voiceMicIcon) {
        console.error('마이크 아이콘을 찾을 수 없습니다!');
        return;
    }
    
    voiceMicIcon.addEventListener('click', function() {
        console.log('=== 마이크 아이콘 클릭됨 ===');
        console.log('현재 음성안내 상태:', isVoiceGuideActive);
        console.log('음성안내 활성 상태:', isVoiceGuideActive);
        
        if (isVoiceGuideActive) {
            // 음성안내 중지
            console.log('음성안내 중지 시도');
            stopVoiceGuide();
            voiceMicIcon.style.animation = 'none';
            voiceMicIcon.style.backgroundColor = '';
        } else {
            // 음성안내 시작
            console.log('음성안내 시작 시도');
            startVoiceGuide();
            voiceMicIcon.style.animation = 'pulse 1s infinite';
            voiceMicIcon.style.backgroundColor = '#ff6b6b';
        }
    });
    
    console.log('마이크 아이콘 이벤트 리스너 설정 완료');
}

// 10. 각 버튼에 클릭 이벤트를 연결합니다.
speedBtn.addEventListener('click', () => openModal(speedModal));
repeatBtn.addEventListener('click', () => openModal(repeatModal));

// 모든 닫기 버튼에 클릭 이벤트를 연결합니다.
closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
});

// 뒷배경을 클릭해도 닫히도록 이벤트를 연결합니다.
overlay.addEventListener('click', closeModal);

// 11. 슬라이더 이벤트 처리
document.addEventListener('DOMContentLoaded', function() {
    // 속도 조절 슬라이더
    const speedPoints = document.querySelectorAll('#speedModal .slider-point');
    speedPoints.forEach((point, index) => {
        point.addEventListener('click', function() {
            speedPoints.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            
            const labels = document.querySelectorAll('#speedModal .label-item');
            labels.forEach(l => l.classList.remove('active'));
            labels[index].classList.add('active');
            
            speechRate = index === 0 ? 0.7 : index === 1 ? 1.0 : 1.3;
            closeModal();
        });
    });

    // 반복 횟수 슬라이더
    const repeatPoints = document.querySelectorAll('#repeatModal .slider-point');
    repeatPoints.forEach((point, index) => {
        point.addEventListener('click', function() {
            repeatPoints.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            
            const labels = document.querySelectorAll('#repeatModal .label-item');
            labels.forEach(l => l.classList.remove('active'));
            labels[index].classList.add('active');
            
            repeatCount = index + 1;
            closeModal();
        });
    });
});

// 12. 페이지 로드 시 음성 인식 초기화
window.addEventListener('load', function() {
    console.log('페이지 로드 완료, 초기화 시작');
    
    // 마이크 아이콘 이벤트 설정
    setupVoiceMicIcon();
    
    // 음성 인식 초기화
    initSpeechRecognition();
    
    // GitHub API 테스트 함수 (개발용)
    window.testGPTAPI = async function() {
        console.log('GitHub API 테스트 시작...');
        try {
            const testResponse = await callGPTAPI('안녕하세요');
            console.log('GitHub API 테스트 성공:', testResponse);
            alert('GitHub API 테스트 성공!\n응답: ' + testResponse);
        } catch (error) {
            console.error('GitHub API 테스트 실패:', error);
            alert('GitHub API 테스트 실패: ' + error.message);
        }
    };
    
    // 테스트 버튼 추가 (개발용)
    const testButton = document.createElement('button');
    testButton.textContent = 'GitHub API 테스트';
    testButton.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 9999;
        background: #007bff;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
    `;
    testButton.onclick = window.testGPTAPI;
    document.body.appendChild(testButton);
    
    console.log('초기화 완료');
});

// 페이지를 벗어날 때 음성안내 종료
window.addEventListener('beforeunload', function() {
    console.log('페이지를 벗어남 - 음성안내 종료');
    stopVoiceGuide();
});

// 페이지 숨김/표시 이벤트 (탭 전환 등)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('페이지 숨김 - 음성안내 일시 중지');
        pauseVoiceGuide();
    } else {
        console.log('페이지 표시 - 음성안내 재개');
        resumeVoiceGuide();
    }
});

// 음성안내 종료 함수
function stopVoiceGuide() {
    console.log('음성안내 완전 종료');
    
    // 음성 재생 중단
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    
    // 음성 인식 중단
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
    }
    
    // 음성안내 상태 초기화
    isVoiceGuideActive = false;
    isWaitingForUserInput = false;
    currentStep = 0;
    lastMenuExplanation = null;
    
    // 마이크 아이콘 상태 초기화
    if (voiceMicIcon) {
        voiceMicIcon.classList.remove('recording');
        voiceMicIcon.style.animation = 'none';
    }
    
    console.log('음성안내 종료 완료');
}

// 음성안내 일시 중지 함수
function pauseVoiceGuide() {
    console.log('음성안내 일시 중지');
    
    // 음성 재생 중단
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    
    // 음성 인식 중단
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
    }
    
    // 마이크 아이콘 상태 초기화
    if (voiceMicIcon) {
        voiceMicIcon.classList.remove('recording');
        voiceMicIcon.style.animation = 'none';
    }
}

// 음성안내 재개 함수
function resumeVoiceGuide() {
    console.log('음성안내 재개');
    
    // 음성안내가 활성화되어 있다면 재개
    if (isVoiceGuideActive) {
        console.log('음성안내 재개 - 음성 인식 재시작');
        startListening();
    }
}

// 가운데 PNG 버튼 클릭 이벤트 리스너
if (centerVoiceBtn) {
    centerVoiceBtn.addEventListener('click', function() {
        console.log('가운데 PNG 버튼 클릭');
        
        if (speechSynthesis.speaking) {
            // 음성이 재생 중이면 중지
            console.log('음성 재생 중지');
            speechSynthesis.cancel();
            
            // 음성 인식도 중지
            if (recognition && isRecording) {
                recognition.stop();
                isRecording = false;
            }
            
            // 마이크 아이콘 상태 초기화
            if (voiceMicIcon) {
                voiceMicIcon.classList.remove('recording');
                voiceMicIcon.style.animation = 'none';
            }
            
            // 음성안내 완전 종료
            stopVoiceGuide();
        } else {
            // 음성이 재생 중이 아니면 음성안내 시작
            console.log('음성안내 시작');
            startVoiceGuide();
        }
    });
} else {
    console.warn('가운데 PNG 버튼을 찾을 수 없습니다.');
}

// 13. CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .voice-mic-icon {
        cursor: pointer;
        transition: transform 0.2s ease;
        user-select: none;
        border-radius: 50%;
        padding: 10px;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .voice-mic-icon:hover {
        transform: scale(1.05);
    }
    
    .voice-mic-icon:active {
        transform: scale(0.95);
    }
    
    .response-card {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin: 10px 0;
    }
    
    .response-card h3 {
        color: #0D2A5C;
        margin-bottom: 10px;
        font-size: 14px;
    }
    
    .response-card p {
        color: #333;
        line-height: 1.4;
        font-size: 13px;
    }
`;
document.head.appendChild(style);