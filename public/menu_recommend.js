// Gemini API 설정
//const GEMINI_API_KEY = "AIzaSyBZ7INgGfYNVrJ54CQdk7veNtHQ9f12xJs";
const GEMINI_API_KEY = "AIzaSyBTPdAB550YvY6hSJPZqvSNTdXx8zzm9BM"
const GEMINI_MODEL = "gemini-2.5-pro";

// 음성 속도 및 반복 설정
let speechRate = 1.0; // 기본 속도 (보통)
let repeatCount = 1; // 기본 반복 횟수

// 음성 인식 및 합성 초기화
let recognition = null;
let synthesis = window.speechSynthesis;
let isListening = false; // 음성 인식 활성 상태
let isSpeaking = false; // 음성 합성 중인지 여부
let recognitionActive = false; // 음성 인식이 실제로 활성화되어 있는지
let isProcessing = false; // API 호출 중인지 여부 (중복 호출 방지)
let restartTimeout = null; // 재시작 타이머
let maxRestartAttempts = 5; // 최대 재시작 시도 횟수
let restartAttempts = 0; // 현재 재시작 시도 횟수
let speechEndTimeout = null; // 말이 끝난 후 처리하는 타이머
let lastSpeechTime = 0; // 마지막 음성 인식 시간

// 대화 상태 관리
let recommendedMenu = null; // 추천한 메뉴 (카레, 덮밥, 토스트)
let awaitingConfirmation = false; // 사용자의 메뉴 확인을 기다리는지 여부

// 모바일 환경 감지
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                 (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));

// 페이지 가시성 감지 (백그라운드/포그라운드)
let isPageVisible = true;
document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    if (isPageVisible && isListening && !isSpeaking && !recognitionActive) {
        // 페이지가 다시 보이면 음성 인식 재시작
        setTimeout(() => {
            restartVoiceRecognition();
        }, 500);
    }
});

// 포커스 감지 (모바일에서 중요)
window.addEventListener('focus', () => {
    if (isListening && !isSpeaking && !recognitionActive && isPageVisible) {
        setTimeout(() => {
            restartVoiceRecognition();
        }, 500);
    }
});

// Gemini API 호출 함수
async function callGeminiAPI(userMessage) {
    try {
        // ▼▼▼▼▼ 여기부터 프롬프트가 수정되었습니다 ▼▼▼▼▼

        // 추천 가능한 메뉴 목록
        const menuList = ["카레", "덮밥", "토스트"];
        const menuListStr = menuList.join(", ");

        // 사용자의 긍정적인 반응을 감지하는 키워드
        const positiveKeywords = ["좋", "괜찮", "맞", "그래", "예", "응", "네", "좋아", "좋다", "괜찮다", "맞아", "그래요", "좋아요"];
        
        // 대화 흐름에 따른 프롬프트 생성
        let prompt = "";
        
        // 메뉴 추천 프롬프트
        if (awaitingConfirmation && recommendedMenu) {
            // 사용자가 메뉴를 좋다고 확인한 경우 체크
            const userMessageLower = userMessage.toLowerCase();
            const isPositive = positiveKeywords.some(keyword => userMessageLower.includes(keyword));
            
            if (isPositive) {
                // 긍정적 반응이면 바로 응답 반환 (페이지 이동은 recognition.onresult에서 처리)
                return `${recommendedMenu}를 파는 음식점을 추천해드릴게요.`;
            }
            // 확인 대기 중일 때는 확인 질문에 대한 응답 처리
            prompt = `
[시스템 지시]
너는 메뉴를 추천하는 AI이다. 음식점 사장님 AI가 아니므로 "맛있게 만들어준다", "만들어드린다" 같은 표현은 절대 사용하지 말아라.

[현재 상황]
이전에 ${recommendedMenu}를 추천했고, 사용자에게 "${recommendedMenu}가 좋으시면 ${recommendedMenu}를 파는 음식점을 추천해드릴까요?"라고 물어봤다.

[대화 규칙]
1. 사용자와 자연스럽게 대화하되, 친절하고 편안한 말투를 사용해라.
2. 응답은 반드시 1문장으로 간결하게 작성해라.
3. 한국어로 대답해라.
4. 사용자가 긍정적인 반응을 보이면 그 메뉴가 확정된 것으로 이해해라.
5. 사용자가 부정적인 반응을 보이면 다른 메뉴(카레, 덮밥, 토스트 중 ${recommendedMenu}가 아닌 다른 메뉴)를 특징과 함께 추천해라.
6. 사용자가 말한 내용의 맥락을 유지해라. 이전에 어떤 메뉴에 대해 말했는지 기억하고 있어라.

[사용자 요청]
${userMessage}

[AI 응답]
`;
        } else {
            // 일반적인 메뉴 추천
            prompt = `
[시스템 지시]
너는 메뉴를 추천하는 AI이다. 음식점 사장님 AI가 아니므로 "맛있게 만들어준다", "만들어드린다" 같은 표현은 절대 사용하지 말아라.
목표: 사용자가 원하는 메뉴를 찾아서 음식점 리스트 페이지까지 도달시키는 것이 목표다.

[추천 가능한 메뉴 및 특징]
오직 다음 3가지 메뉴 중에서만 추천할 수 있다:
- 덮밥: 따뜻한 밥 위에 고기나 생선 등을 올린 일식 요리
- 카레: 짙은 국물이 특징인 매운 맛의 요리
- 토스트: 빵에 다양한 재료를 올린 간편한 식사
절대로 이 목록에 없는 다른 메뉴를 추천하거나 언급해서는 안 된다.

[대화 규칙]
1. 사용자와 자연스럽게 대화하되, 친절하고 편안한 말투를 사용해라.
2. 응답은 반드시 1문장으로 간결하게 작성해라.
3. 한국어로 대답해라.
4. 메뉴를 추천할 때는 해당 메뉴의 특징을 간단히 언급하면서 추천해라.
   예: "따뜻한 덮밥 어떠세요?", "짙은 국물의 카레 어떠세요?", "간편한 토스트 어떠세요?"
5. 메뉴 이름(덮밥, 카레, 토스트 중 하나)을 명확히 언급해라.
6. 사용자가 이전에 추천받은 메뉴에 대해 긍정적인 반응을 보이면, 그 메뉴가 확정된 것으로 이해해라.
7. 사용자가 이전에 추천받은 메뉴에 대해 부정적인 반응을 보이면, 다른 메뉴(3가지 중 다른 것)를 특징과 함께 추천해라.
8. 꼭 사용자가 메뉴를 선택하도록 대화를 이끌어가라.
9. 사용자가 말한 내용의 맥락을 유지해라. 예를 들어 "국물요리 어떠세요?"라고 했다면 사용자가 좋다고 했을 때 국물요리(카레)를 확정해야 한다.

[사용자 요청]
${userMessage}

[AI 응답]
`;
        }
        // ▲▲▲▲▲ 여기까지 프롬프트가 수정되었습니다 ▲▲▲▲▲
        
        // REST API로 Gemini 호출
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API 호출 실패: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        
        // 응답 파싱
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            let responseText = data.candidates[0].content.parts[0].text;
            
            // ... (이하 마크다운 제거 및 텍스트 처리 부분은 그대로 유지) ...
            
            // (마크다운 제거 코드...)
            responseText = responseText.replace(/```[\s\S]*?```/g, '');
            responseText = responseText.replace(/`([^`]+)`/g, '$1');
            responseText = responseText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
sponseText = responseText.replace(/#{1,6}\s+/g, '');
            responseText = responseText.replace(/\*\*/g, ''); 
            responseText = responseText.replace(/__/g, ''); 
            responseText = responseText.replace(/\*/g, ''); 
            responseText = responseText.replace(/_/g, ''); 
            responseText = responseText.replace(/~~[\s\S]*?~~/g, '');
            responseText = responseText.replace(/>\s+/g, ''); 

            // (대시 기호 처리 코드...)
            const phonePattern = /\d+-\d+/g;
            const datePattern = /\d{4}-\d{2}-\d{2}/g;
            const protected = [];
            let match;
            let tempText = responseText;
            
            while ((match = phonePattern.exec(responseText)) !== null) {
                protected.push(match[0]);
                tempText = tempText.replace(match[0], `__PROTECTED_${protected.length - 1}__`);
            }
            while ((match = datePattern.exec(tempText)) !== null) {
                protected.push(match[0]);
                tempText = tempText.replace(match[0], `__PROTECTED_${protected.length - 1}__`);
            }
            tempText = tempText.replace(/\s*-\s*/g, ' ');
            protected.forEach((pattern, index) => {
                tempText = tempText.replace(`__PROTECTED_${index}__`, pattern);
            });
            
            responseText = tempText;

            // (문장 길이 제한 및 공백 정리 코드...)
            const sentences = responseText.split(/[.!?]\s+/).filter(s => s.trim().length > 0);
            if (sentences.length > 3) {
                responseText = sentences.slice(0, 3).join('. ') + '.';
            }
            responseText = responseText.replace(/\s+/g, ' ');
            responseText = responseText.trim();
            return responseText;

        } else {
            throw new Error('응답 형식이 올바르지 않습니다.');
        }
    } catch (error) {
        console.error('Gemini API 호출 중 오류:', error);
        return '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.';
    }
}

// 음성 합성 함수
function speakText(text, onComplete) {
    // 이전 음성 중지
    synthesis.cancel();
    
    // 음성 합성 시작 시 음성 인식 일시 중지
    if (recognition && recognitionActive) {
        try {
            recognition.stop();
            recognitionActive = false;
        } catch (e) {
            console.log('음성 인식 중지 중 오류:', e);
        }
    }
    
    isSpeaking = true;
    let currentRepeat = 0;
    
    const speakOnce = () => {
        if (currentRepeat >= repeatCount) {
            isSpeaking = false;
            // 음성 합성이 끝나면 콜백 실행
            if (onComplete) {
                onComplete();
            }
            // 음성 합성이 끝나면 음성 인식 재개 (콜백이 없는 경우만)
            if (isListening && !onComplete) {
                setTimeout(() => {
                    restartVoiceRecognition();
                }, 500);
            }
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = speechRate;
        
        utterance.onend = () => {
            currentRepeat++;
            if (currentRepeat < repeatCount) {
                setTimeout(speakOnce, 500);
            } else {
                isSpeaking = false;
                // 음성 합성이 끝나면 콜백 실행
                if (onComplete) {
                    onComplete();
                }
                // 음성 합성이 끝나면 음성 인식 재개 (콜백이 없는 경우만)
                if (isListening && !onComplete) {
                    setTimeout(() => {
                        restartVoiceRecognition();
                    }, 500);
                }
            }
        };
        
        utterance.onerror = () => {
            isSpeaking = false;
            // 오류 발생 시에도 콜백 실행
            if (onComplete) {
                onComplete();
            }
            // 오류 발생 시에도 음성 인식 재개 (콜백이 없는 경우만)
            if (isListening && !onComplete) {
                setTimeout(() => {
                    restartVoiceRecognition();
                }, 500);
            }
        };
        
        synthesis.speak(utterance);
    };
    
    speakOnce();
}

// 음성 인식 재개 함수 (음성 합성이 끝난 후)
function restartVoiceRecognition() {
    if (!isListening || isSpeaking || !recognition || !isPageVisible) {
        return;
    }
    
    // 재시작 타이머 정리
    if (restartTimeout) {
        clearTimeout(restartTimeout);
        restartTimeout = null;
    }
    
    // 재시작 시도 횟수 제한
    if (restartAttempts >= maxRestartAttempts) {
        console.log('최대 재시작 시도 횟수 도달, 재시도 중단');
        restartAttempts = 0;
        return;
    }
    
    try {
        if (!recognitionActive) {
            recognition.start();
            recognitionActive = true;
            restartAttempts = 0; // 성공 시 재시도 횟수 초기화
        }
    } catch (e) {
        console.log('음성 인식 재시작 중 오류:', e);
        restartAttempts++;
        // 이미 실행 중이면 무시
        if (e.name !== 'InvalidStateError') {
            restartTimeout = setTimeout(() => {
                restartVoiceRecognition();
            }, isMobile ? 2000 : 1000);
        } else {
            // InvalidStateError는 이미 실행 중이라는 의미이므로 재시도 횟수 초기화
            restartAttempts = 0;
        }
    }
}

// 음성 인식 시작 함수
function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
        return;
    }

    // 이미 인식이 실행 중이면 재생성하지 않음
    if (!recognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
            return;
        }
        
        recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        // 모바일에서도 continuous 모드 시도 (일부 브라우저에서는 제한적)
        recognition.continuous = true;
        recognition.interimResults = isMobile; // 모바일에서는 interim 결과도 받음
        
        // 모바일 최적화 설정
        if (isMobile) {
            recognition.maxAlternatives = 1; // 모바일에서는 최대 대안 수 제한
        }

        recognition.onstart = () => {
            console.log('음성 인식 시작');
            recognitionActive = true;
            // 아이콘에 시각적 피드백 추가
            const icon = document.querySelector('.voice-mic-icon');
            if (icon) icon.style.opacity = '0.7';
        };

        recognition.onresult = async (event) => {
            // 음성 합성 중이거나 처리 중이면 사용자 음성 무시
            if (isSpeaking || isProcessing || !isPageVisible) {
                console.log('시스템 처리 중 또는 페이지 비활성 - 사용자 음성 무시');
                return;
            }
            
            // final 결과만 찾기
            const finalResults = Array.from(event.results).filter(r => r.isFinal);
            
            // final 결과가 없으면 임시 결과만 있으므로 대기
            if (finalResults.length === 0) {
                return;
            }
            
            // 마지막 final 결과 사용
            const lastFinalResult = finalResults[finalResults.length - 1];
            if (!lastFinalResult || !lastFinalResult[0]) {
                return;
            }
            
            const transcript = lastFinalResult[0].transcript.trim();
            
            // 빈 문자열이거나 너무 짧으면 무시
            if (!transcript || transcript.length < 1) {
                return;
            }
            
            // 중복 방지: 같은 텍스트가 연속으로 들어오면 무시
            const currentTime = Date.now();
            if (window.lastTranscript === transcript && window.lastTranscriptTime && (currentTime - window.lastTranscriptTime < 2000)) {
                console.log('중복 음성 인식 무시:', transcript);
                return;
            }
            
            // 마지막 음성 인식 시간 업데이트
            lastSpeechTime = currentTime;
            
            // 이전 타이머 취소
            if (speechEndTimeout) {
                clearTimeout(speechEndTimeout);
                speechEndTimeout = null;
            }
            
            // 사용자가 말이 끝나자마자 바로 처리 (즉시 응답)
            speechEndTimeout = setTimeout(async () => {
                // 처리 중이거나 음성 합성 중이면 취소
                if (isProcessing || isSpeaking) {
                    return;
                }
                
                // 최신 트랜스크립트 확인
                window.lastTranscript = transcript;
                window.lastTranscriptTime = currentTime;
                
                console.log('인식된 텍스트 (최종):', transcript);
                
                // 처리 시작
                isProcessing = true;
                
                // 음성 인식 일시 중지 (Gemini 응답 대기)
                try {
                    recognition.stop();
                    recognitionActive = false;
                } catch (e) {
                    console.log('음성 인식 중지 중 오류:', e);
                }
            
                // Gemini API 호출
                try {
                    const geminiResponse = await callGeminiAPI(transcript);
                
                // 응답에서 추천된 메뉴 확인 (카레, 덮밥, 토스트)
                const menuList = ["카레", "덮밥", "토스트"];
                const recommendedMenuInResponse = menuList.find(menu => 
                    geminiResponse.includes(menu)
                );
                
                // 긍정적인 반응 키워드 확인
                const positiveKeywords = ["좋", "괜찮", "맞", "그래", "예", "응", "네", "좋아", "좋다", "괜찮다", "맞아", "그래요", "좋아요", "좋아요", "그렇게", "그래요", "그렇다"];
                const transcriptLower = transcript.toLowerCase();
                const isPositive = positiveKeywords.some(keyword => transcriptLower.includes(keyword));
                
                console.log('디버그 - awaitingConfirmation:', awaitingConfirmation);
                console.log('디버그 - isPositive:', isPositive);
                console.log('디버그 - recommendedMenu:', recommendedMenu);
                console.log('디버그 - transcript:', transcript);
                
                // 확인 대기 중이고 사용자가 긍정적으로 답한 경우 -> 메시지 재생 후 페이지 이동
                if (awaitingConfirmation && isPositive && recommendedMenu) {
                    console.log('페이지 이동 조건 충족:', { recommendedMenu, isPositive, awaitingConfirmation });
                    // 음성으로 메시지 재생 (재생 완료 후 페이지 이동)
                    const menuPages = {
                        "카레": "restaurant_list_c.html",
                        "덮밥": "restaurant_list_b.html",
                        "토스트": "restaurant_list_t.html"
                    };
                    
                    const targetPage = menuPages[recommendedMenu];
                    
                    if (targetPage) {
                        console.log(`페이지 이동 준비: ${recommendedMenu} -> ${targetPage}`);
                        // 메뉴 이름 저장 (콜백에서 사용하기 위해)
                        const menuToNavigate = recommendedMenu;
                        const pageToNavigate = targetPage;
                        
                        speakText(geminiResponse, () => {
                            // 음성 재생이 완료된 후 페이지 이동
                            console.log(`${menuToNavigate} 선택됨, 페이지 이동 실행: ${pageToNavigate}`);
                            // 페이지 이동
                            setTimeout(() => {
                                console.log('실제 페이지 이동 실행:', pageToNavigate);
                                window.location.href = pageToNavigate;
                            }, 100);
                        });
                        
                        // 상태 초기화는 페이지 이동 직전에
                        // (콜백이 실행되지 않을 경우를 대비해서 약간의 지연 후에도 초기화)
                    } else {
                        console.error('타겟 페이지를 찾을 수 없음:', recommendedMenu);
                        speakText(geminiResponse);
                    }
                    return;
                }
                // 메뉴가 추천되었고, 사용자가 긍정적인 반응을 보인 경우 -> 바로 페이지 이동
                else if (recommendedMenuInResponse && isPositive && !awaitingConfirmation) {
                    // 긍정적 반응이면 바로 음식점 리스트로 이동
                    const menuPages = {
                        "카레": "restaurant_list_c.html",
                        "덮밥": "restaurant_list_b.html",
                        "토스트": "restaurant_list_t.html"
                    };
                    
                    const targetPage = menuPages[recommendedMenuInResponse];
                    
                    if (targetPage) {
                        console.log(`긍정적 반응 - 바로 페이지 이동: ${recommendedMenuInResponse} -> ${targetPage}`);
                        speakText(geminiResponse, () => {
                            window.location.href = targetPage;
                        });
                        return;
                    }
                } else if (recommendedMenuInResponse && !awaitingConfirmation) {
                    // 메뉴가 추천된 경우 -> 확인 질문 추가 (새로운 형식)
                    recommendedMenu = recommendedMenuInResponse;
                    awaitingConfirmation = true;
                    const confirmationQuestion = `${recommendedMenuInResponse}가 좋으시면 ${recommendedMenuInResponse}를 파는 음식점을 추천해드릴까요?`;
                    const fullResponse = geminiResponse + (geminiResponse.endsWith('.') || geminiResponse.endsWith('!') || geminiResponse.endsWith('?') ? ' ' : '. ') + confirmationQuestion;
                    speakText(fullResponse);
                } else {
                    // 부정적 반응이거나 다른 메뉴를 요청한 경우
                    const negativeKeywords = ["싫", "안 좋", "아니", "못", "그만", "다른", "싫어", "안 좋아"];
                    const isNegative = negativeKeywords.some(keyword => transcriptLower.includes(keyword));
                    
                    if (isNegative && awaitingConfirmation && recommendedMenu) {
                        // 부정적 반응 -> 다른 메뉴 추천하도록 상태 초기화
                        recommendedMenu = null;
                        awaitingConfirmation = false;
                        // AI가 다른 메뉴를 추천하도록 응답
                        speakText(geminiResponse);
                    } else {
                        // 일반 응답
                        speakText(geminiResponse);
                        // 응답에 메뉴가 포함되어 있으면 저장
                        if (recommendedMenuInResponse && !awaitingConfirmation) {
                            recommendedMenu = recommendedMenuInResponse;
                            awaitingConfirmation = true;
                            // 메뉴가 추천되면 바로 확인 질문 추가 (새로운 형식)
                            setTimeout(() => {
                                const confirmationQuestion = `${recommendedMenu}가 좋으시면 ${recommendedMenu}를 파는 음식점을 추천해드릴까요?`;
                                speakText(confirmationQuestion);
                            }, 2000); // AI 응답 후 2초 뒤 확인 질문
                        } else if (!recommendedMenuInResponse && awaitingConfirmation) {
                            // 메뉴 추천이 없으면 상태 초기화
                            recommendedMenu = null;
                            awaitingConfirmation = false;
                        }
                    }
                }
            } catch (error) {
                console.error('API 호출 오류:', error);
                speakText('죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.');
            } finally {
                // 처리 완료
                isProcessing = false;
                    speechEndTimeout = null;
                }
            }, 300); // 사용자가 말을 끝낸 후 0.3초 대기 (즉시 응답)
        };

        recognition.onerror = (event) => {
            console.error('음성 인식 오류:', event.error);
            recognitionActive = false;
            
            // 일부 오류는 무시하고 계속 진행
            if (event.error === 'no-speech') {
                // 음성이 없으면 계속 대기 (모바일에서는 자동 재시작)
                if (isMobile && isListening && !isSpeaking && isPageVisible) {
                    restartTimeout = setTimeout(() => {
                        restartVoiceRecognition();
                    }, 1000);
                }
                return;
            } else if (event.error === 'aborted') {
                // 의도적으로 중단된 경우 (하지만 모바일에서는 재시작)
                if (isMobile && isListening && !isSpeaking && isPageVisible) {
                    restartTimeout = setTimeout(() => {
                        restartVoiceRecognition();
                    }, 500);
                }
                return;
            } else if (event.error === 'not-allowed') {
                // 권한 거부
                console.error('음성 인식 권한이 거부되었습니다.');
                alert('음성 인식을 사용하려면 마이크 권한이 필요합니다. 브라우저 설정에서 권한을 허용해주세요.');
                isListening = false;
                return;
            }
            
            // 심각한 오류인 경우에만 처리
            if (event.error === 'network') {
                console.error('네트워크 오류 발생');
                // 네트워크 오류는 재시도
                restartTimeout = setTimeout(() => {
                    if (isListening && !isSpeaking && isPageVisible) {
                        restartVoiceRecognition();
                    }
                }, 2000);
            } else if (event.error === 'service-not-allowed') {
                console.error('음성 인식 서비스가 허용되지 않음');
                alert('음성 인식 서비스에 접근할 수 없습니다. 브라우저 설정을 확인해주세요.');
                isListening = false;
            }
        };

        recognition.onend = () => {
            console.log('음성 인식 종료');
            recognitionActive = false;
            
            // 음성 인식이 끝난 후에도 speechEndTimeout이 실행되도록 대기
            // 만약 아직 처리 중이 아니고 말이 끝난 상태라면 처리
            if (isListening && !isSpeaking && isPageVisible && !isProcessing) {
                // speechEndTimeout이 설정되어 있으면 그대로 진행
                // 없으면 바로 재시작
                if (!speechEndTimeout) {
                    const delay = isMobile ? 500 : 800;
                    restartTimeout = setTimeout(() => {
                        restartVoiceRecognition();
                    }, delay);
                } else {
                    // speechEndTimeout이 실행되면 그 후에 재시작
                    // onresult에서 처리 완료 후 재시작하도록 함
                }
            }
        };
    }
    
    // 음성 인식 시작
    if (isListening && !isSpeaking && !recognitionActive && isPageVisible) {
        try {
            recognition.start();
            recognitionActive = true;
            restartAttempts = 0; // 성공 시 재시도 횟수 초기화
        } catch (e) {
            console.log('음성 인식 시작 중 오류:', e);
            // 이미 실행 중이면 무시
            if (e.name !== 'InvalidStateError') {
                restartAttempts++;
                restartTimeout = setTimeout(() => {
                    if (restartAttempts < maxRestartAttempts) {
                        restartVoiceRecognition();
                    }
                }, isMobile ? 2000 : 1000);
            } else {
                // InvalidStateError는 이미 실행 중이라는 의미
                recognitionActive = true;
                restartAttempts = 0;
            }
        }
    }
}

// 음성 인식 중지 함수
function stopVoiceRecognition() {
    isListening = false;
    restartAttempts = 0;
    if (restartTimeout) {
        clearTimeout(restartTimeout);
        restartTimeout = null;
    }
    if (recognition && recognitionActive) {
        try {
            recognition.stop();
            recognitionActive = false;
        } catch (e) {
            console.log('음성 인식 중지 중 오류:', e);
        }
    }
}

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 메뉴 책 아이콘 클릭 이벤트
    const menuBookIcon = document.querySelector('.voice-mic-icon');
    if (menuBookIcon) {
        menuBookIcon.addEventListener('click', async () => {
            if (!isListening) {
                // 음성 인식 시작
                // 모바일에서 권한 확인
                if (isMobile && navigator.permissions) {
                    try {
                        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
                        if (permissionStatus.state === 'denied') {
                            alert('음성 인식을 사용하려면 마이크 권한이 필요합니다. 브라우저 설정에서 권한을 허용해주세요.');
                            return;
                        }
                    } catch (e) {
                        console.log('권한 확인 불가:', e);
                    }
                }
                
                // 음성 인식 활성화
                isListening = true;
                restartAttempts = 0;
                // 안내 메시지 재생 후 음성 인식 시작
                speakText('어떤 메뉴를 추천해드릴까요? 말씀해주세요.');
                setTimeout(() => {
                    startVoiceRecognition();
                }, isMobile ? 2500 : 2000); // 모바일에서는 조금 더 대기
            } else {
                // 이미 활성화되어 있으면 음성 인식 종료
                isListening = false;
                stopVoiceRecognition();
                
                // 타이머 정리
                if (speechEndTimeout) {
                    clearTimeout(speechEndTimeout);
                    speechEndTimeout = null;
                }
                
                // 상태 초기화
                recommendedMenu = null;
                awaitingConfirmation = false;
                isProcessing = false;
                
                // 종료 메시지 재생
                speakText('음성 대화가 종료되었습니다.');
                console.log('음성 인식 종료됨');
            }
        });
        
        // 호버 효과
        menuBookIcon.style.cursor = 'pointer';
        menuBookIcon.style.transition = 'opacity 0.3s';
    }

    // 음성 속도 조절 모달
    const speedBtn = document.getElementById('speedBtn');
    const speedModal = document.getElementById('speedModal');
    const repeatBtn = document.getElementById('repeatBtn');
    const repeatModal = document.getElementById('repeatModal');
    const closeButtons = document.querySelectorAll('.close-button');
    const overlay = document.querySelector('.modal-overlay');

    if (speedBtn && speedModal) {
        speedBtn.addEventListener('click', () => {
            speedModal.classList.add('active');
            overlay.classList.add('active');
        });
    }

    if (repeatBtn && repeatModal) {
        repeatBtn.addEventListener('click', () => {
            repeatModal.classList.add('active');
            overlay.classList.add('active');
        });
    }

    // 모달 닫기
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            speedModal.classList.remove('active');
            repeatModal.classList.remove('active');
            overlay.classList.remove('active');
        });
    });

    if (overlay) {
        overlay.addEventListener('click', () => {
            speedModal.classList.remove('active');
            repeatModal.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // 속도 조절 슬라이더
    const speedPoints = document.querySelectorAll('#speedModal .slider-point');
    speedPoints.forEach((point, index) => {
        point.addEventListener('click', () => {
            // 모든 포인트에서 active 제거
            speedPoints.forEach(p => p.classList.remove('active'));
            document.querySelectorAll('#speedModal .label-item').forEach(item => item.classList.remove('active'));
            
            // 선택한 포인트에 active 추가
            point.classList.add('active');
            document.querySelectorAll('#speedModal .label-item')[index].classList.add('active');
            
            // 속도 설정 (느림 0.7, 보통 1.0, 빠름 1.5)
            speechRate = [0.7, 1.0, 1.5][index];
            console.log('음성 속도 설정:', speechRate);
        });
    });

    // 반복 횟수 슬라이더
    const repeatPoints = document.querySelectorAll('#repeatModal .slider-point');
    repeatPoints.forEach((point, index) => {
        point.addEventListener('click', () => {
            // 모든 포인트에서 active 제거
            repeatPoints.forEach(p => p.classList.remove('active'));
            document.querySelectorAll('#repeatModal .label-item').forEach(item => item.classList.remove('active'));
            
            // 선택한 포인트에 active 추가
            point.classList.add('active');
            document.querySelectorAll('#repeatModal .label-item')[index].classList.add('active');
            
            // 반복 횟수 설정 (1, 2, 3)
            repeatCount = index + 1;
            console.log('반복 횟수 설정:', repeatCount);
        });
    });

    // 볼륨 컨트롤 (현재는 구현하지 않지만 UI는 존재)
    const volumeBtns = document.querySelectorAll('.volume-btn');
    volumeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 볼륨 조절 기능은 나중에 구현 가능
            console.log('볼륨 조절');
        });
    });
});

