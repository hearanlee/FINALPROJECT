// --- main.js (수정본) ---

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

    // [중요] 음성 재생이 시작되면, 마이크를 끕니다.
    utterance.onstart = () => {
        console.log('💬 [TTS] 재생 시작:', text);
        if (recognition) {
            try { recognition.stop(); } catch (e) {}
        }
    };

    // [중요] 음성 재생이 끝나면, 콜백 함수(마이크 켜기)를 실행합니다.
    utterance.onend = () => {
        console.log('💬 [TTS] 재생 완료.');
        if (onEndCallback) {
            onEndCallback();
        }
    };

    utterance.onerror = (event) => {
        console.error('❌ [TTS] 재생 오류:', event.error);
        // 오류가 나도 콜백(마이크 켜기) 실행
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
        recognition.continuous = true;  // 계속 듣기
        recognition.interimResults = true; // 말하는 도중에도 결과 받기
        recognition.maxAlternatives = 1;

        // 마이크가 켜졌을 때
        recognition.onstart = () => {
            console.log('🎙️ [Speech] 음성 인식이 시작되었습니다. 말씀하세요...');
        };

        // 마이크가 꺼졌을 때
        recognition.onend = () => {
            console.log('🛑 [Speech] 음성 인식이 종료되었습니다.');
            // (TTS가 말하는 중이 아닐 때) 1초 뒤 자동 재시작
            if (!synthesis.speaking) {
                setTimeout(() => {
                    try { recognition.start(); } catch (e) {}
                }, 1000);
            }
        };

        // 음성 결과가 도착했을 때
        recognition.onresult = (event) => {
            let finalTranscript = '';

            for (let i = 0; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            
            // 화면 표시 로직 삭제됨

            // 최종 인식이 완료되면 (말이 끝나면) 페이지 이동 검사
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
    // "메뉴 추천" 키워드 감지
    if (text.includes("메뉴 추천")) {
        console.log('🚀 [App] "메뉴 추천" 감지! 이동합니다...');
        speak("메뉴 추천 페이지로 이동합니다.", () => {
            window.location.href = 'menu_recommend.html';
        });
    } 
    // "음식점 검색" 키워드 추가
    else if (text.includes("지도") || text.includes("음식점 검색")) {
        console.log('🚀 [App] "지도/음식점 검색" 감지! 이동합니다...');
        speak("지도 페이지로 이동합니다.", () => {
            window.location.href = 'map_main.html';
        });
    } 
    // ▼▼▼▼▼ [수정] "내정보" 관련 else if 블록이 삭제되었습니다. ▼▼▼▼▼
    // else if (text.includes("내정보") || text.includes("내 정보")) {
    //     console.log('🚀 [App] "내정보" 감지! 이동합니다...');
    //     speak("내정보 페이지로 이동합니다.", () => {
    //         window.location.href = 'my_info.html';
    //     });
    // }
    // ▲▲▲▲▲ 여기까지 수정 ▲▲▲▲▲
}

// --- 4. 페이지 로드 시 자동 실행 ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 [Main] 페이지 로드 완료');
    
    // speechDisplay 요소 찾기 삭제됨
    
    // 음성 인식 기능 초기화
    initializeSpeechRecognition();

    if (recognition) {
        // ▼▼▼▼▼ [수정] 환영 멘트에서 "내정보" 부분 삭제 ▼▼▼▼▼
        const welcomeMessage = "메인 페이지입니다. 음성으로 '메뉴 추천' 또는 '음식점 검색'이라고 말씀하시면 해당 페이지로 이동합니다.";
        // ▲▲▲▲▲ 여기까지 수정 ▲▲▲▲▲
        
        // 1. 환영 멘트를 말한다.
        // 2. 말이 끝나면 (콜백함수),
        // 3. 마이크를 켠다 (recognition.start()).
        speak(welcomeMessage, () => {
            try {
                recognition.start();
            } catch(e) {
                console.error('❌ [Speech] 마이크 시작 실패:', e.message);
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