// Gemini API 설정
const GEMINI_API_KEY = "AIzaSyBZ7INgGfYNVrJ54CQdk7veNtHQ9f12xJs";
const GEMINI_MODEL = "gemini-2.5-pro";

// 음성 속도 및 반복 설정
let speechRate = 1.5; // 기본 속도 (보통)
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
        // 프롬프트 구성 (3문장 이내로 응답 요청)
        const prompt = `당신은 음식점 메뉴 추천 전문가입니다. 사용자의 요청에 대해 친절하고 자연스럽게 메뉴를 추천해주세요. 반드시 3문장 이내로 짧고 간결하게 대답해주세요. 한국어로 대답해주세요.\n\n사용자 요청: ${userMessage}`;
        
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
            // 마크다운 형식 제거 (순수 텍스트만 추출)
            // 코드 블록 먼저 제거
            responseText = responseText.replace(/```[\s\S]*?```/g, '');
            // 인라인 코드 제거 (내용은 유지)
            responseText = responseText.replace(/`([^`]+)`/g, '$1');
            // 링크 마크다운 제거 (텍스트만 유지)
            responseText = responseText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
            // 헤더 마크다운 제거
            responseText = responseText.replace(/#{1,6}\s+/g, '');
            // 볼드/이탤릭 마크다운 제거 (순서 중요: **, __ 먼저, 그 다음 *, _)
            responseText = responseText.replace(/\*\*/g, ''); // ** 제거
            responseText = responseText.replace(/__/g, ''); // __ 제거
            responseText = responseText.replace(/\*/g, ''); // 나머지 * 제거
            responseText = responseText.replace(/_/g, ''); // 나머지 _ 제거
            // 기타 마크다운 제거
            responseText = responseText.replace(/~~[\s\S]*?~~/g, ''); // 취소선 텍스트 제거
            responseText = responseText.replace(/>\s+/g, ''); // 인용 부호 제거
            // 대시(-) 기호를 공백으로 변환하여 음성 합성 시 읽히지 않도록 처리
            // 숫자 사이의 하이픈은 유지하기 위해 숫자-숫자 패턴은 보호
            // 먼저 숫자 사이의 하이픈을 임시로 보호
            const phonePattern = /\d+-\d+/g;
            const datePattern = /\d{4}-\d{2}-\d{2}/g;
            const protected = [];
            let match;
            let tempText = responseText;
            
            // 전화번호 패턴 보호
            while ((match = phonePattern.exec(responseText)) !== null) {
                protected.push(match[0]);
                tempText = tempText.replace(match[0], `__PROTECTED_${protected.length - 1}__`);
            }
            
            // 날짜 패턴 보호
            while ((match = datePattern.exec(tempText)) !== null) {
                protected.push(match[0]);
                tempText = tempText.replace(match[0], `__PROTECTED_${protected.length - 1}__`);
            }
            
            // 나머지 대시를 공백으로 변환
            tempText = tempText.replace(/\s*-\s*/g, ' ');
            
            // 보호된 패턴 복원
            protected.forEach((pattern, index) => {
                tempText = tempText.replace(`__PROTECTED_${index}__`, pattern);
            });
            
            responseText = tempText;
            // 문장 길이 제한: 3문장으로 제한 (마침표 기준으로 나누고 처음 3문장만)
            const sentences = responseText.split(/[.!?]\s+/).filter(s => s.trim().length > 0);
            if (sentences.length > 3) {
                responseText = sentences.slice(0, 3).join('. ') + '.';
            }
            // 공백 정리
            responseText = responseText.replace(/\s+/g, ' '); // 연속된 공백을 하나로
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
function speakText(text) {
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
            // 음성 합성이 끝나면 음성 인식 재개
            if (isListening) {
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
                // 음성 합성이 끝나면 음성 인식 재개
                if (isListening) {
                    setTimeout(() => {
                        restartVoiceRecognition();
                    }, 500);
                }
            }
        };
        
        utterance.onerror = () => {
            isSpeaking = false;
            // 오류 발생 시에도 음성 인식 재개
            if (isListening) {
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
            
            // 마지막 결과만 가져오기 (continuous 모드이므로)
            const resultIndex = event.results.length - 1;
            
            // 모바일에서는 final이 아닌 결과도 처리할 수 있도록 조정
            const currentResult = event.results[resultIndex];
            if (!isMobile && !currentResult.isFinal) {
                return;
            }
            
            // 모바일에서도 최종 결과 우선
            const finalResult = Array.from(event.results).find(r => r.isFinal);
            const useResult = finalResult || currentResult;
            
            if (!useResult || !useResult[0]) {
                return;
            }
            
            const transcript = useResult[0].transcript.trim();
            
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
            window.lastTranscript = transcript;
            window.lastTranscriptTime = currentTime;
            
            console.log('인식된 텍스트:', transcript);
            
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
                
                // 응답을 음성으로 재생 (음성 합성 중 음성 인식은 자동으로 재개됨)
                speakText(geminiResponse);
            } catch (error) {
                console.error('API 호출 오류:', error);
                speakText('죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.');
            } finally {
                // 처리 완료
                isProcessing = false;
            }
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
            
            // 의도적으로 중단된 게 아니라면 재시작
            // 모바일에서는 더 적극적으로 재시작
            if (isListening && !isSpeaking && isPageVisible) {
                const delay = isMobile ? 300 : 500;
                restartTimeout = setTimeout(() => {
                    restartVoiceRecognition();
                }, delay);
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
                // 이미 활성화되어 있으면 안내 메시지만
                speakText('음성 인식이 이미 활성화되어 있습니다. 말씀해주세요.');
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
            
            // 속도 설정 (1.0, 1.5, 2.0)
            speechRate = [1.0, 1.5, 2.0][index];
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

