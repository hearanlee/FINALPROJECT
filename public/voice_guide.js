// 메인 음성 안내 모듈 - 모듈들을 통합하여 사용
import { CONFIG } from './js/config.js';
import { callGPTAPI, testGPTAPI } from './js/apiService.js';
import { 
    initSpeechRecognition, 
    setupRecognitionHandlers, 
    startRecognition, 
    stopRecognition, 
    speakText, 
    stopSpeaking, 
    isSpeaking, 
    setSpeechRate, 
    setRepeatCount, 
    isSystemVoice 
} from './js/speechService.js';
import { 
    startVoiceGuide, 
    stopVoiceGuide, 
    pauseVoiceGuide, 
    resumeVoiceGuide, 
    processVoiceInput, 
    getVoiceGuideState, 
    setVoiceGuideState 
} from './js/voiceGuideService.js';
import { 
    initUI, 
    showResponse, 
    updateMicIconState, 
    setupVoiceMicIcon, 
    setupCenterVoiceBtn, 
    setupModalEvents, 
    setupSliderEvents, 
    addTestButton, 
    addStyles, 
    setupPageEvents, 
    setupExitButton 
} from './js/uiService.js';

// 음성 관련 변수들
let isRecording = false;

// 음성 인식 핸들러들
function onRecognitionStart() {
        console.log('🎤 음성 인식 시작');
        isRecording = true;
    updateMicIconState(true);
}

function onRecognitionResult(transcript) {
    console.log('📝 인식된 텍스트:', transcript);
    
    // 시스템 음성 필터링
    if (isSystemVoice(transcript)) {
        console.log('❌ 시스템 음성으로 판단되어 무시:', transcript);
                return;
            }
            
    // 사용자 키워드 감지
            const userKeywords = ['메뉴', '돈까스', '쌀국수', '주문', '음식', '추천', '도움', '안내', '카레', '카츠', '오늘', '뭐', '어떤', '네', '예', '좋아', '싫어', '맛있', '배고', '먹고', '마시', '드시', '할게', '할래', '싫어', '싫다', '좋다', '좋아', '괜찮', '괜찮아', '괜찮다', '싶어', '싶다', '원해', '원한다', '주문할게', '주문할래', '주문해', '주문해줘', '주문해주세요'];
    const isUserKeyword = userKeywords.some(keyword => transcript.toLowerCase().includes(keyword.toLowerCase()));
            
            // 음성 재생 중이면 즉시 중단하고 처리 (사용자 입력 최우선)
    if (isSpeaking()) {
                if (isUserKeyword) {
            console.log('⏹️ 사용자 키워드 감지 - 음성 재생 즉시 중단:', transcript);
            stopSpeaking();
            console.log('🎯 사용자 키워드 처리 시작:', transcript);
            handleVoiceInput(transcript);
                    return;
                } else {
            console.log('❌ 시스템이 말하는 중 - 사용자 키워드가 아님, 무시:', transcript);
                    return;
                }
            }
            
    console.log('🎯 사용자 음성 처리 시작:', transcript);
    handleVoiceInput(transcript);
        }

function onRecognitionError(event) {
        console.error('❌ 음성 인식 오류:', event.error);
        isRecording = false;
    updateMicIconState(false);
    
    // 음성안내가 활성화되어 있고 사용자 입력을 기다리는 상태라면 재시작
    const state = getVoiceGuideState();
    if (state.isVoiceGuideActive && state.isWaitingForUserInput) {
        console.log('🔄 음성 인식 오류로 인한 재시작 시도');
            setTimeout(() => {
            if (state.isVoiceGuideActive && state.isWaitingForUserInput && !isRecording) {
                    console.log('🔄 음성 인식 재시작');
                if (startRecognition()) {
                        isRecording = true;
                    }
                }
        }, 1000);
        }
}

function onRecognitionEnd() {
        console.log('⏹️ 음성 인식 종료');
        isRecording = false;
    updateMicIconState(false);
    
    // 음성안내가 활성화되어 있고 사용자 입력을 기다리는 상태라면 재시작
    const state = getVoiceGuideState();
    if (state.isVoiceGuideActive && state.isWaitingForUserInput) {
        console.log('🔄 음성 인식 즉시 재시작');
            setTimeout(() => {
            if (state.isVoiceGuideActive && state.isWaitingForUserInput && !isRecording) {
                    console.log('🔄 음성 인식 재시작 실행');
                if (startRecognition()) {
                        isRecording = true;
                }
            }
        }, 500);
    }
}

// 음성 입력 처리
async function handleVoiceInput(transcript) {
    try {
        const result = await processVoiceInput(transcript);
        if (result) {
            showResponse(result.userInput, result.response);
        }
    } catch (error) {
        console.error('음성 입력 처리 오류:', error);
        const errorMessage = '죄송합니다. 처리 중 오류가 발생했습니다.';
        speakText(errorMessage);
        showResponse(transcript, errorMessage);
    }
}

// 음성안내 시작/중지 토글
function toggleVoiceGuide() {
    const state = getVoiceGuideState();
    
    if (state.isVoiceGuideActive) {
    console.log('음성안내 중지');
        stopVoiceGuide();
        stopRecognition();
        isRecording = false;
        updateMicIconState(false);
            } else {
        console.log('음성안내 시작');
        startVoiceGuide().then(() => {
            // 환영메시지 재생 완료 후 음성 인식 시작
            if (startRecognition()) {
            isRecording = true;
                updateMicIconState(true);
            }
        });
    }
}

// 가운데 버튼 클릭 처리
function handleCenterButtonClick() {
    if (isSpeaking()) {
        // 음성이 재생 중이면 중지
        console.log('음성 재생 중지');
        stopSpeaking();
        stopRecognition();
        isRecording = false;
        updateMicIconState(false);
            stopVoiceGuide();
        } else {
        // 음성이 재생 중이 아니면 음성안내 시작
        toggleVoiceGuide();
    }
}

// 속도 변경 처리
function handleSpeedChange(rate) {
    console.log('음성 속도 변경:', rate);
    setSpeechRate(rate);
}

// 반복 횟수 변경 처리
function handleRepeatChange(count) {
    console.log('반복 횟수 변경:', count);
    setRepeatCount(count);
}

// 페이지 이벤트 처리
function handleBeforeUnload() {
    console.log('페이지를 벗어남 - 음성안내 종료');
    stopVoiceGuide();
    stopRecognition();
}

function handleVisibilityChange(state) {
    if (state === 'hidden') {
        console.log('페이지 숨김 - 음성안내 일시 중지');
        pauseVoiceGuide();
        stopRecognition();
        isRecording = false;
        updateMicIconState(false);
    } else {
        console.log('페이지 표시 - 음성안내 재개');
        const voiceState = getVoiceGuideState();
        if (voiceState.isVoiceGuideActive) {
        resumeVoiceGuide();
            if (startRecognition()) {
                isRecording = true;
                updateMicIconState(true);
            }
        }
    }
}

// GitHub API 테스트
async function handleTestAPI() {
    console.log('GitHub API 테스트 시작...');
    try {
        const result = await testGPTAPI();
        if (result.success) {
            console.log('GitHub API 테스트 성공:', result.response);
            alert('GitHub API 테스트 성공!\n응답: ' + result.response);
        } else {
            console.error('GitHub API 테스트 실패:', result.error);
            alert('GitHub API 테스트 실패: ' + result.error);
        }
    } catch (error) {
        console.error('GitHub API 테스트 오류:', error);
        alert('GitHub API 테스트 오류: ' + error.message);
    }
}

// 초기화 함수
function initialize() {
    console.log('페이지 로드 완료, 초기화 시작');
    
    // UI 초기화
    initUI();
    
    // 음성 인식 초기화
    if (initSpeechRecognition()) {
        setupRecognitionHandlers(
            onRecognitionResult,
            onRecognitionError,
            onRecognitionEnd,
            onRecognitionStart
        );
    }
    
    // UI 이벤트 설정
    setupVoiceMicIcon(toggleVoiceGuide);
    setupCenterVoiceBtn(handleCenterButtonClick);
    setupModalEvents();
    setupSliderEvents(handleSpeedChange, handleRepeatChange);
    setupPageEvents(handleBeforeUnload, handleVisibilityChange);
    setupExitButton();
    
    // 개발용 테스트 버튼 추가
    addTestButton(handleTestAPI);
    
    // CSS 스타일 추가
    addStyles();
    
    console.log('초기화 완료');
}

// 페이지 로드 시 초기화
window.addEventListener('load', initialize);

// 전역 함수로 노출 (필요한 경우)
window.toggleVoiceGuide = toggleVoiceGuide;
window.testGPTAPI = handleTestAPI;