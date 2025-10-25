// 음성 안내 프로세스 관련 서비스

import { callGPTAPI } from './apiService.js';
import { 
    MENU_DATABASE, 
    getMenuSuggestions, 
    isDatabaseMenuName, 
    findMenuNameInInput, 
    getMenuInfo 
} from './menuDatabase.js';
import { 
    speakText, 
    cleanTextForSpeech, 
    isSystemVoice, 
    isSpeaking 
} from './speechService.js';
import { USER_KEYWORDS } from './config.js';

// 음성안내 프로세스 변수들
let isVoiceGuideActive = false;
let currentStep = 0;
let isWaitingForUserInput = false;
let isProcessing = false; // 중복 처리 방지 플래그
let lastMenuExplanation = null; // 이전 메뉴 설명 저장

// 음성안내 프로세스 함수들
export async function startVoiceGuide() {
    console.log('음성안내 시작');
    isVoiceGuideActive = true;
    currentStep = 1;
    isWaitingForUserInput = false;
    
    // 음성 목록 로드 대기
    if (window.speechSynthesis.getVoices().length === 0) {
        console.log('음성 목록 로드 대기 중...');
        window.speechSynthesis.addEventListener('voiceschanged', () => {
            console.log('음성 목록 로드 완료:', window.speechSynthesis.getVoices().length);
            proceedWithVoiceGuide();
        });
    } else {
        proceedWithVoiceGuide();
    }
    
    async function proceedWithVoiceGuide() {
        console.log('음성안내 프로세스 시작');
        
        try {
            console.log('🤖 ===== GPT API 호출 시작 (환영 메시지) =====');
            console.log('📝 GPT API에 환영 메시지 요청 중...');
            
            // GPT API를 사용한 환영 메시지 생성
            const gptResponse = await callGPTAPI("안녕하세요. 메뉴 추천을 시작합니다.");
            console.log('📦 GPT API 응답:', gptResponse);
            
            // GPT 응답을 음성으로 재생
            console.log('🔊 GPT 환영 메시지 음성 재생:', gptResponse);
            speakText(gptResponse, () => {
                console.log('✅ GPT 환영메시지 재생 완료 - 마이크 활성화');
                // 사용자 입력 대기 상태로 설정하고 음성 인식 시작
                isWaitingForUserInput = true;
                // startListening은 외부에서 호출해야 함
            });
            
        } catch (error) {
            console.error('❌ GPT API 호출 실패, 기본 메시지 사용:', error);
            
            // GPT API 실패 시 기본 메시지 사용
            const fallbackMessage = "안녕하세요. 주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주시고, 못 정하셨으면 '메뉴'라고 말해 주세요.";
            console.log('기본 메시지 음성 재생:', fallbackMessage);
            
            speakText(fallbackMessage, () => {
                console.log('기본 환영메시지 재생 완료 - 마이크 활성화');
                // 사용자 입력 대기 상태로 설정하고 음성 인식 시작
                isWaitingForUserInput = true;
                // startListening은 외부에서 호출해야 함
            });
        }
    }
}

export function stopVoiceGuide() {
    console.log('음성안내 중지');
    isVoiceGuideActive = false;
    currentStep = 0;
    isWaitingForUserInput = false;
    
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    
    // 마이크 아이콘 상태 초기화는 외부에서 처리
}

export function pauseVoiceGuide() {
    console.log('음성안내 일시 중지');
    
    // 음성 재생 중단
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
}

export function resumeVoiceGuide() {
    console.log('음성안내 재개');
    
    // 음성안내가 활성화되어 있다면 재개
    if (isVoiceGuideActive) {
        console.log('음성안내 재개 - 음성 인식 재시작');
        // startListening은 외부에서 호출해야 함
    }
}

// 음성 입력 처리
export async function processVoiceInput(transcript) {
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
            console.log('🤖 ===== GPT API 직접 호출 시작 =====');
            console.log('📝 사용자 입력:', transcript);
            console.log('⏰ 호출 시간:', new Date().toLocaleString());
            
            const response = await callGPTAPI(transcript);
            console.log('📦 GPT API 응답 수신:', response);
            
            // 응답 유효성 검사 (문자열 응답도 처리)
            if (response) {
                let responseText;
                
                // GPT API 응답 형식 확인
                if (typeof response === 'string') {
                    // 직접 문자열 응답
                    responseText = response;
                    console.log('✅ 문자열 응답 처리:', responseText);
                } else if (response.response) {
                    // 객체 형태의 응답
                    responseText = response.response;
                    console.log('✅ 객체 응답 처리:', responseText);
                } else {
                    // 기타 형식의 응답
                    responseText = String(response);
                    console.log('✅ 기타 형식 응답 처리:', responseText);
                }
        
                console.log('🔊 GPT 응답 음성 재생 시작:', responseText);
                // GPT 응답을 음성으로 재생
                speakText(responseText);
                console.log('🎉 ===== GPT API 직접 호출 성공 =====');
                
                // 화면에 응답 표시는 외부에서 처리
                return { userInput: transcript, response: responseText };
            } else {
                console.error('API 응답이 유효하지 않습니다:', response);
                const errorMessage = '죄송합니다. 응답을 받을 수 없습니다. 다시 말씀해주세요.';
                speakText(errorMessage);
                return { userInput: transcript, response: errorMessage };
            }
        }
    } catch (error) {
        console.error('음성 입력 처리 오류:', error);
        const errorMessage = '죄송합니다. 처리 중 오류가 발생했습니다.';
        speakText(errorMessage);
        return { userInput: transcript, response: errorMessage };
    } finally {
        // 처리 완료 후 플래그 해제
        isProcessing = false;
        console.log('✅ 음성 입력 처리 완료');
    }
}

// 사용자 입력 처리
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
            isWaitingForUserInput = true;
            return { userInput, response: menuResponse };
        }
        
        // 2. database.py 메뉴명 처리 (GPT API 호출하지 않음)
        if (isDatabaseMenuName(lowerInput)) {
            console.log('데이터베이스 메뉴명 감지 - GPT API 호출하지 않음');
            const menuName = findMenuNameInInput(lowerInput);
            if (menuName) {
                return handleSpecificMenuOrder(menuName);
            } else {
                const menuResponse = getMenuResponse();
                speakText(menuResponse);
                isWaitingForUserInput = true;
                return { userInput, response: menuResponse };
            }
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
                isWaitingForUserInput = true;
                return { userInput, response: cleanMessage };
            } else {
                const message = "이전에 설명한 메뉴가 없습니다. 먼저 메뉴를 선택해주세요.";
                speakText(message);
                isWaitingForUserInput = true;
                return { userInput, response: message };
            }
        }
        
        // 4. 메뉴 카테고리 처리 (GPT API 호출하지 않음)
        if (lowerInput.includes('쌀국수') || lowerInput.includes('쌀국') || 
            lowerInput.includes('국수') || lowerInput.includes('면')) {
            
            console.log('쌀국수 카테고리 감지 - GPT API 호출하지 않음');
            const phoResponse = "어떤 쌀국수를 원하세요? 차돌양지쌀국수, 한우쌀국수, 모듬 쌀국수가 있습니다. 주문하시고 싶은 메뉴를 알려달세요.";
            speakText(phoResponse);
            isWaitingForUserInput = true;
            return { userInput, response: phoResponse };
        }
        
        if (lowerInput.includes('돈까스') || lowerInput.includes('돈카츠') || 
            lowerInput.includes('카츠') || lowerInput.includes('카레')) {
            
            console.log('돈까스/카레 카테고리 감지 - GPT API 호출하지 않음');
            const katsuResponse = "어떤 돈까스를 원하세요? 프리미엄 로스카츠(등심), 프리미엄 히레츠(안심), 통모짜치즈돈카츠, 시그니처 경양식돈카츠, 모듬카츠A[등심+안심], 모듬카츠B[등심+치즈]가 있습니다. 주문하시고 싶은 메뉴를 알려달세요.";
            speakText(katsuResponse);
            isWaitingForUserInput = true;
            return { userInput, response: katsuResponse };
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
            isWaitingForUserInput = true;
            return handleSpecificMenuOrder(foundKatsuMenu);
        }
        
        if (lowerInput.includes('정식') || lowerInput.includes('1인정식')) {
            
            console.log('1인정식 카테고리 감지 - GPT API 호출하지 않음');
            const setResponse = "어떤 정식을 원하세요? 정식A(쌀국수S+경양식), 정식B(쌀국수S+등심), 정식C(쌀국수S+안심), 정식D(쌀국수S+치즈)가 있습니다. 주문하시고 싶은 메뉴를 알려달세요.";
            speakText(setResponse);
            isWaitingForUserInput = true;
            return { userInput, response: setResponse };
        }
        
        // 5. 불완전한 문장 처리 (GPT API 호출하지 않음)
        if (lowerInput.includes('주문하고') || lowerInput.includes('주문하') || 
            lowerInput.includes('주문') || lowerInput.includes('하고싶')) {
            
            console.log('주문 관련 불완전한 문장 감지 - GPT API 호출하지 않음');
            
            // 주문 관련 안내 메시지
            const orderResponse = "주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주세요. 메뉴를 확인하고 싶으시면 '메뉴'라고 말해주세요.";
            speakText(orderResponse);
            
            // 사용자 입력 대기 상태로 전환 (음성 재생 완료 후 자동으로 인식 시작됨)
            isWaitingForUserInput = true;
            return { userInput, response: orderResponse };
        }
        
        // 6. 기타 사용자 입력 처리 (GPT API 호출)
        console.log('🤖 ===== 기타 사용자 입력 감지 - GPT API 호출 =====');
        console.log('📝 사용자 입력:', userInput);
        console.log('⏰ 호출 시간:', new Date().toLocaleString());
        
        const response = await callGPTAPI(userInput);
        console.log('📦 GPT API 응답 수신:', response);
        
        if (response) {
            let responseText;
            
            // GPT API 응답 형식 확인
            if (typeof response === 'string') {
                responseText = response;
                console.log('✅ 문자열 응답 처리:', responseText);
            } else if (response.response) {
                responseText = response.response;
                console.log('✅ 객체 응답 처리:', responseText);
            } else {
                responseText = String(response);
                console.log('✅ 기타 형식 응답 처리:', responseText);
            }
    
            console.log('🔊 GPT 응답 음성 재생 시작:', responseText);
            // GPT 응답을 음성으로 재생
            speakText(responseText);
            console.log('🎉 ===== GPT API 호출 성공 =====');
        } else {
            console.error('❌ GPT API 응답이 유효하지 않습니다:', response);
            const errorMessage = '죄송합니다. 응답을 받을 수 없습니다. 다시 말씀해주세요.';
            speakText(errorMessage);
            console.log('🚫 ===== GPT API 호출 실패 =====');
            return { userInput, response: errorMessage };
        }
        
        // 사용자 입력 대기 상태로 전환
        isWaitingForUserInput = true;
        return { userInput, response: responseText };
        
    } catch (error) {
        console.error('사용자 입력 처리 오류:', error);
        const errorMessage = '죄송합니다. 처리 중 오류가 발생했습니다. 다시 말씀해주세요.';
        speakText(errorMessage);
        
        isWaitingForUserInput = true;
        return { userInput, response: errorMessage };
    }
}

// 특정 메뉴 주문 안내 함수
function handleSpecificMenuOrder(menuName) {
    console.log('특정 메뉴 주문 안내:', menuName);
    
    // 메뉴 정보 가져오기
    const menuInfo = getMenuInfo(menuName);
    if (!menuInfo) {
        const message = "해당 메뉴를 찾을 수 없습니다. 메뉴를 다시 확인해주세요.";
        speakText(message);
        return { userInput: menuName, response: message };
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
    return { userInput: menuName, response: cleanMessage };
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

// 상태 확인 함수들
export function getVoiceGuideState() {
    return {
        isVoiceGuideActive,
        currentStep,
        isWaitingForUserInput,
        isProcessing
    };
}

export function setVoiceGuideState(state) {
    if (state.isVoiceGuideActive !== undefined) isVoiceGuideActive = state.isVoiceGuideActive;
    if (state.currentStep !== undefined) currentStep = state.currentStep;
    if (state.isWaitingForUserInput !== undefined) isWaitingForUserInput = state.isWaitingForUserInput;
    if (state.isProcessing !== undefined) isProcessing = state.isProcessing;
}
