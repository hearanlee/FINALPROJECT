// --- main.js (최종본: 음성안내 + 글자크기 조절) ---

// --- 0. 기본 객체 및 변수 설정 ---
const synthesis = window.speechSynthesis; // 음성 합성 (TTS)
let recognition; // 음성 인식 (STT)
// speechDisplay 변수 삭제됨

// --- 1. TTS (Text-to-Speech) 함수 ---
/**
 * 텍스트를 음성으로 말하고, 말이 끝난 후 실행할 콜백을 지정합니다.
 * @param {string} text - 스피커로 말할 텍스트
 * @param {Function} [onEndCallback] - 음성 재생이 끝난 후 실행될 함수 (선택 사항)
 */
function speak(text, onEndCallback) {
    if (!text || !synthesis) return;

    if (synthesis.speaking) {
        synthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.1; // 음성 속도

    utterance.onstart = () => {
        console.log('💬 [TTS] 재생 시작:', text);
        if (recognition) {
            try { recognition.stop(); } catch (e) {}
        }
    };

    utterance.onend = () => {
        console.log('💬 [TTS] 재생 완료.');
        if (onEndCallback) {
            onEndCallback();
        }
    };

    utterance.onerror = (event) => {
        console.error('❌ [TTS] 재생 오류:', event.error);
        if (onEndCallback) {
            onEndCallback();
        }
    };

    synthesis.speak(utterance);
}

// --- 2. 음성 인식(STT) 설정 및 초기화 ---
function initializeSpeechRecognition() {
    try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            console.log('🎙️ [Speech] 음성 인식이 시작되었습니다. 말씀하세요...');
        };

        recognition.onend = () => {
            console.log('🛑 [Speech] 음성 인식이 종료되었습니다.');
            if (!synthesis.speaking) {
                setTimeout(() => {
                    try { recognition.start(); } catch (e) {}
                }, 1000);
            }
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = 0; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                console.log('🗣️ [User] 최종 인식된 텍스트:', finalTranscript);
                handleNavigation(finalTranscript);
            }
        };

        recognition.onerror = (event) => {
            console.error('❌ [Speech] 음성 인식 에러:', event.error);
            if (event.error === 'not-allowed') {
                alert('마이크 접근 권한이 필요합니다. 브라우저 설정을 확인해주세요.');
            }
        };
    } catch (e) {
        console.error('❌ [Speech] 이 브라우저는 Web Speech API를 지원하지 않습니다.');
        recognition = null;
    }
}

// --- 3. 페이지 이동 로직 ---
function handleNavigation(text) {
    if (text.includes("메뉴 추천")) {
        console.log('🚀 [App] "메뉴 추천" 감지! 이동합니다...');
        speak("메뉴 추천 페이지로 이동합니다.", () => {
            window.location.href = 'menu_recommend.html';
        });
    } 
    else if (text.includes("지도") || text.includes("음식점 검색")) {
        console.log('🚀 [App] "지도/음식점 검색" 감지! 이동합니다...');
        speak("음식점 검색 페이지로 이동합니다.", () => {
            window.location.href = 'map_main.html';
        });
    } 
    // "내정보" 기능 삭제됨
}

let currentFontSizeStep = 0;
// CSS 파일에 정의된 기본 폰트 크기
const baseSizes = {
    welcome: 23, // .welcome-card
    h2: 22,      // .feature-button h2
    p: 14        // .feature-button p
};
const stepAmount = 2; // 한 번에 2px씩 조절
const maxStep = 2;    // 최대 2단계 (총 +4px)
const minStep = -1;   // 최소 -1단계 (총 -2px)

/** 폰트 크기를 화면에 적용하는 함수 */
function applyFontSizes() {
    // 1. 대상 요소들 선택
    const welcomeCard = document.querySelector('.welcome-card');
    const h2Texts = document.querySelectorAll('.feature-button h2');
    const pTexts = document.querySelectorAll('.feature-button p');

    // 2. 새 폰트 크기 계산
    const newWelcomeSize = baseSizes.welcome + (currentFontSizeStep * stepAmount);
    const newH2Size = baseSizes.h2 + (currentFontSizeStep * stepAmount);
    const newPSize = baseSizes.p + (currentFontSizeStep * stepAmount);

    // 3. 폰트 크기 적용
    if (welcomeCard) {
        // welcome-card는 부모의 font-size를 조절
        welcomeCard.style.fontSize = `${newWelcomeSize}px`;
    }
    h2Texts.forEach(el => {
        el.style.fontSize = `${newH2Size}px`;
    });
    pTexts.forEach(el => {
        el.style.fontSize = `${newPSize}px`;
    });

    console.log(`[Font Size] 현재 단계: ${currentFontSizeStep}, (Welcome: ${newWelcomeSize}px)`);
}


// --- 4. 페이지 로드 시 자동 실행 ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 [Main] 페이지 로드 완료');
    
    // 음성 인식 기능 초기화
    initializeSpeechRecognition();

    if (recognition) {
        const welcomeMessage = "메인 페이지입니다. 음성으로 '메뉴 추천' 또는 '음식점 검색'이라고 말씀하시면 해당 페이지로 이동합니다.";
        
        speak(welcomeMessage, () => {
            try {
                recognition.start();
            } catch(e) {
                console.error('❌ [Speech] 마이크 시작 실패:', e.message);
            }
        });
    }

    const btnIncrease = document.getElementById('font-increase-btn');
    const btnDecrease = document.getElementById('font-decrease-btn');

    if (btnIncrease) {
        btnIncrease.addEventListener('click', () => {
            if (currentFontSizeStep < maxStep) {
                currentFontSizeStep++;
                applyFontSizes();
            }
        });
    }

    if (btnDecrease) {
        btnDecrease.addEventListener('click', () => {
            if (currentFontSizeStep > minStep) {
                currentFontSizeStep--;
                applyFontSizes();
            }
        });
    }

    // 페이지를 떠날 때 음성 기능 정리
    window.addEventListener('beforeunload', () => {
        if (recognition) {
            recognition.stop();
        }
        if (synthesis.speaking) {
            synthesis.cancel();
        }
    });
});