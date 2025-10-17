// UI 관련 서비스

import { CONFIG } from './config.js';

// UI 요소들
let speedBtn = null;
let repeatBtn = null;
let voiceMicIcon = null;
let speedModal = null;
let repeatModal = null;
let overlay = null;
let closeButtons = null;
let centerVoiceBtn = null;

// UI 초기화
export function initUI() {
    // HTML 요소들을 모두 찾습니다.
    speedBtn = document.getElementById('speedBtn');
    repeatBtn = document.getElementById('repeatBtn');
    voiceMicIcon = document.querySelector('.voice-mic-icon');
    speedModal = document.getElementById('speedModal');
    repeatModal = document.getElementById('repeatModal');
    overlay = document.querySelector('.modal-overlay');
    closeButtons = document.querySelectorAll('.close-button');
    centerVoiceBtn = document.querySelector('.center-voice-btn');
    
    console.log('UI 요소들 초기화 완료');
    console.log('마이크 아이콘:', voiceMicIcon);
    console.log('가운데 버튼:', centerVoiceBtn);
}

// 팝업을 여는 함수
export function openModal(modal) {
    if (modal) {
        modal.classList.add('active'); // 팝업창 보이기
        if (overlay) {
            overlay.classList.add('active'); // 뒷배경 보이기
        }
    }
}

// 팝업을 닫는 함수
export function closeModal() {
    if (speedModal && speedModal.classList.contains('active')) {
        speedModal.classList.remove('active');
    }
    if (repeatModal && repeatModal.classList.contains('active')) {
        repeatModal.classList.remove('active');
    }
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// 응답 화면 표시
export function showResponse(userInput, gptResponse) {
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
        max-width: ${CONFIG.RESPONSE_MAX_WIDTH}px;
        min-width: ${CONFIG.RESPONSE_MIN_WIDTH}px;
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

// 마이크 아이콘 상태 업데이트
export function updateMicIconState(isRecording) {
    if (voiceMicIcon) {
        if (isRecording) {
            voiceMicIcon.style.animation = 'pulse 1s infinite';
            voiceMicIcon.style.backgroundColor = '#ff6b6b';
        } else {
            voiceMicIcon.style.animation = 'none';
            voiceMicIcon.style.backgroundColor = '';
        }
    }
}

// 마이크 아이콘 클릭 이벤트 설정
export function setupVoiceMicIcon(onClick) {
    if (!voiceMicIcon) {
        console.error('마이크 아이콘을 찾을 수 없습니다!');
        return;
    }
    
    voiceMicIcon.addEventListener('click', function() {
        console.log('=== 마이크 아이콘 클릭됨 ===');
        if (onClick) {
            onClick();
        }
    });
    
    console.log('마이크 아이콘 이벤트 리스너 설정 완료');
}

// 가운데 PNG 버튼 클릭 이벤트 설정
export function setupCenterVoiceBtn(onClick) {
    if (!centerVoiceBtn) {
        console.warn('가운데 PNG 버튼을 찾을 수 없습니다.');
        return;
    }
    
    centerVoiceBtn.addEventListener('click', function() {
        console.log('가운데 PNG 버튼 클릭');
        if (onClick) {
            onClick();
        }
    });
}

// 모달 이벤트 설정
export function setupModalEvents() {
    // 각 버튼에 클릭 이벤트를 연결합니다.
    if (speedBtn) {
        speedBtn.addEventListener('click', () => openModal(speedModal));
    }
    if (repeatBtn) {
        repeatBtn.addEventListener('click', () => openModal(repeatModal));
    }

    // 모든 닫기 버튼에 클릭 이벤트를 연결합니다.
    if (closeButtons) {
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModal);
        });
    }

    // 뒷배경을 클릭해도 닫히도록 이벤트를 연결합니다.
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }
}

// 슬라이더 이벤트 설정
export function setupSliderEvents(onSpeedChange, onRepeatChange) {
    // 속도 조절 슬라이더
    const speedPoints = document.querySelectorAll('#speedModal .slider-point');
    speedPoints.forEach((point, index) => {
        point.addEventListener('click', function() {
            speedPoints.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            
            const labels = document.querySelectorAll('#speedModal .label-item');
            labels.forEach(l => l.classList.remove('active'));
            labels[index].classList.add('active');
            
            const speechRate = index === 0 ? 0.7 : index === 1 ? 1.0 : 1.3;
            if (onSpeedChange) {
                onSpeedChange(speechRate);
            }
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
            
            const repeatCount = index + 1;
            if (onRepeatChange) {
                onRepeatChange(repeatCount);
            }
            closeModal();
        });
    });
}

// 테스트 버튼 추가 (개발용)
export function addTestButton(onTestClick) {
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
    testButton.onclick = onTestClick;
    document.body.appendChild(testButton);
}

// CSS 애니메이션 추가
export function addStyles() {
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
}

// 페이지 이벤트 설정
export function setupPageEvents(onBeforeUnload, onVisibilityChange) {
    // 페이지를 벗어날 때 이벤트
    window.addEventListener('beforeunload', function() {
        console.log('페이지를 벗어남 - 음성안내 종료');
        if (onBeforeUnload) {
            onBeforeUnload();
        }
    });

    // 페이지 숨김/표시 이벤트 (탭 전환 등)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('페이지 숨김 - 음성안내 일시 중지');
            if (onVisibilityChange) {
                onVisibilityChange('hidden');
            }
        } else {
            console.log('페이지 표시 - 음성안내 재개');
            if (onVisibilityChange) {
                onVisibilityChange('visible');
            }
        }
    });
}

// 음성안내 종료 버튼 설정
export function setupExitButton() {
    // 돌아갈 페이지 URL 결정
    let returnUrl = 'main.html'; // 기본값 (fallback)
    const referrer = document.referrer; // 사용자가 직전에 머물렀던 페이지의 URL
    
    if (referrer.includes('restaurant_detail.html')) {
        // 만약 직전 페이지 URL에 'restaurant_detail.html'이 포함되어 있다면
        returnUrl = 'restaurant_detail.html';
    } else if (referrer.includes('map_main.html')) {
        // 만약 직전 페이지 URL에 'map_main.html'이 포함되어 있다면
        returnUrl = 'map_main.html';
    }
    console.log('돌아갈 페이지:', returnUrl); // 디버깅용

    // HTML에서 ID로 '음성안내 종료' 버튼을 찾습니다.
    const exitVoiceGuideBtn = document.getElementById('exitVoiceGuideBtn');

    // 버튼에 클릭 이벤트를 추가합니다.
    if (exitVoiceGuideBtn) {
        exitVoiceGuideBtn.addEventListener('click', function() {
            // 1번에서 결정된 URL로 페이지를 이동시킵니다.
            window.location.href = returnUrl;
        });
    }
}

// UI 요소들 getter 함수들
export function getUIElements() {
    return {
        speedBtn,
        repeatBtn,
        voiceMicIcon,
        speedModal,
        repeatModal,
        overlay,
        closeButtons,
        centerVoiceBtn
    };
}
