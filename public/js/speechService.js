// 음성 인식 및 합성 관련 서비스

import { CONFIG, USER_KEYWORDS, WELCOME_WORDS, EXACT_SYSTEM_PHRASES } from './config.js';

// 음성 관련 전역 변수들
let recognition = null;
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let speechRate = CONFIG.DEFAULT_SPEECH_RATE;
let repeatCount = CONFIG.DEFAULT_REPEAT_COUNT;
let playCount = 0;

// 음성 인식 초기화
export function initSpeechRecognition() {
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
    recognition.continuous = CONFIG.RECOGNITION_CONTINUOUS;
    recognition.interimResults = CONFIG.RECOGNITION_INTERIM_RESULTS;
    recognition.lang = CONFIG.RECOGNITION_LANG;
    recognition.maxAlternatives = CONFIG.RECOGNITION_MAX_ALTERNATIVES;
    
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

    return true;
}

// 음성 인식 이벤트 핸들러 설정
export function setupRecognitionHandlers(onResult, onError, onEnd, onStart) {
    if (!recognition) {
        console.error('음성 인식 객체가 초기화되지 않았습니다.');
        return;
    }

    recognition.onstart = function() {
        console.log('🎤 음성 인식 시작');
        if (onStart) onStart();
    };

    recognition.onresult = function(event) {
        console.log('음성 인식 결과 이벤트:', event);
        
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
        
        // 최종 결과가 있을 때만 처리
        if (finalTranscript.trim() && onResult) {
            onResult(finalTranscript);
        }
    };

    recognition.onerror = function(event) {
        console.error('❌ 음성 인식 오류:', event.error);
        if (onError) onError(event);
    };

    recognition.onend = function() {
        console.log('⏹️ 음성 인식 종료');
        if (onEnd) onEnd();
    };
}

// 음성 인식 시작
export function startRecognition() {
    if (!recognition) {
        console.error('음성 인식 객체가 없습니다');
        return false;
    }

    try {
        recognition.start();
        return true;
    } catch (error) {
        console.error('음성 인식 시작 실패:', error);
        return false;
    }
}

// 음성 인식 중지
export function stopRecognition() {
    if (recognition) {
        recognition.stop();
    }
}

// 시스템 음성 필터링 함수 (환영메시지 우선 차단)
export function isSystemVoice(transcript) {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    // 1. 사용자 키워드 최우선 확인 (시스템이 말하는 중이어도 사용자 키워드면 사용자 음성)
    const isMenuKeyword = lowerTranscript.includes('메뉴');
    const isUserFoodKeyword = lowerTranscript.includes('쌀국수') || lowerTranscript.includes('돈까스') || 
                             lowerTranscript.includes('돈카츠') || lowerTranscript.includes('카레') || 
                             lowerTranscript.includes('카츠') || lowerTranscript.includes('먹고') || 
                             lowerTranscript.includes('싶어') || lowerTranscript.includes('싶다');
    
    if (isMenuKeyword || isUserFoodKeyword) {
        console.log('✅ 사용자 키워드 감지 - 사용자 음성으로 판단:', transcript);
        return false; // 사용자 음성으로 처리
    }
    
    // 2. 환영메시지 단어들 차단 (사용자 키워드가 아닌 경우만)
    const hasWelcomeWord = WELCOME_WORDS.some(word => lowerTranscript.includes(word));
    
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
    for (const phrase of EXACT_SYSTEM_PHRASES) {
        if (lowerTranscript === phrase.toLowerCase()) {
            console.log('❌ 시스템 음성 감지됨 (완전한 문장 매칭):', phrase);
            return true;
        }
    }
    
    // 6. 사용자 입력으로 판단 (사용자 입력 최우선 정책)
    console.log('✅ 사용자 음성으로 판단 (사용자 입력 최우선):', transcript);
    return false;
}

// 마크다운 문법 제거 및 숫자 읽기 개선 함수
export function cleanTextForSpeech(text) {
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

// 텍스트를 음성으로 변환
export function speakText(text, callback) {
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
    currentUtterance.lang = CONFIG.SPEECH_LANG;
    currentUtterance.rate = speechRate;
    currentUtterance.pitch = 1;
    currentUtterance.volume = 1;

    // 이벤트 리스너 추가
    currentUtterance.onstart = function() {
        console.log('음성 재생 시작됨');
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

// 음성 재생 중지
export function stopSpeaking() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
}

// 음성 재생 중인지 확인
export function isSpeaking() {
    return speechSynthesis.speaking;
}

// 음성 속도 설정
export function setSpeechRate(rate) {
    speechRate = rate;
}

// 반복 횟수 설정
export function setRepeatCount(count) {
    repeatCount = count;
}

// 음성 테스트 함수 (디버깅용)
export function testVoice() {
    console.log('음성 테스트 시작');
    const testText = "안녕하세요. 음성 테스트입니다.";
    speakText(testText);
}
