// 메뉴 데이터베이스 및 관련 유틸리티 함수들

// 메뉴 데이터베이스 (database.py의 실제 데이터 사용)
export const MENU_DATABASE = {
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
export const PROCEDURES_DATABASE = {
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
export const MENU_RECOMMENDATION_RULES = [
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

// 메뉴 정보 데이터베이스 (상세 정보 포함)
export const MENU_INFO_DATABASE = {
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
};

// 메뉴 관련 유틸리티 함수들

// 메뉴 제안 함수
export function getMenuSuggestions(message) {
    const suggestions = [];
    const lowerMessage = message.toLowerCase();
    
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

// 메뉴 추천 함수
export function recommendMenu(mealType, temperature, spiciness, foodType) {
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

// 메뉴 검색 함수
export function searchMenu(menuName) {
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

// 메뉴 정보 가져오기 함수
export function getMenuInfo(menuName) {
    return MENU_INFO_DATABASE[menuName] || null;
}

// database.py의 메뉴명인지 확인하는 함수
export function isDatabaseMenuName(transcript) {
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
export function findMenuNameInInput(transcript) {
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
