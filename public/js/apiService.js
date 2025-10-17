// GPT API 호출 관련 서비스

import { CONFIG } from './config.js';

// GitHub API 호출 (재시도 로직 포함)
export async function callGPTAPI(userInput, retryCount = 0) {
    const maxRetries = CONFIG.MAX_RETRIES;
    const baseDelay = CONFIG.BASE_DELAY;
    
    console.log('GitHub API 호출 시작');
    console.log('사용자 입력:', userInput);
    console.log('재시도 횟수:', retryCount);
    console.log('API URL:', CONFIG.GITHUB_API_URL);
    console.log('API 키:', CONFIG.GITHUB_API_KEY ? '설정됨' : '설정되지 않음');
    
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
        
        const response = await fetch(CONFIG.GITHUB_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.GITHUB_API_KEY}`
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

// GPT API 테스트 함수 (개발용)
export async function testGPTAPI() {
    console.log('GitHub API 테스트 시작...');
    try {
        const testResponse = await callGPTAPI('안녕하세요');
        console.log('GitHub API 테스트 성공:', testResponse);
        return { success: true, response: testResponse };
    } catch (error) {
        console.error('GitHub API 테스트 실패:', error);
        return { success: false, error: error.message };
    }
}
