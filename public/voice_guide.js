// 1. 필요한 HTML 요소들을 모두 찾습니다.
const speedBtn = document.getElementById('speedBtn');
const repeatBtn = document.getElementById('repeatBtn');
let voiceMicIcon = null; // 나중에 초기화

const speedModal = document.getElementById('speedModal');
const repeatModal = document.getElementById('repeatModal');

const overlay = document.querySelector('.modal-overlay');
const closeButtons = document.querySelectorAll('.close-button');

// 음성 관련 변수들
let isRecording = false;
let recognition = null;
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let repeatCount = 1;
let speechRate = 1.0;

// GitHub API 설정
const GITHUB_API_KEY = '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';
const GITHUB_API_URL = 'https://models.github.ai/inference/v1/chat/completions';

// 2. 팝업을 여는 함수를 만듭니다.
function openModal(modal) {
    if (modal) {
        modal.classList.add('active'); // 팝업창 보이기
        overlay.classList.add('active'); // 뒷배경 보이기
    }
}

// 3. 팝업을 닫는 함수를 만듭니다.
function closeModal() {
    if (speedModal.classList.contains('active')) {
        speedModal.classList.remove('active');
    }
    if (repeatModal.classList.contains('active')) {
        repeatModal.classList.remove('active');
    }
    overlay.classList.remove('active');
}

// 4. 음성 인식 초기화
function initSpeechRecognition() {
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

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'ko-KR';
    
    console.log('음성 인식 설정 완료:', {
        continuous: recognition.continuous,
        interimResults: recognition.interimResults,
        lang: recognition.lang
    });

    recognition.onstart = function() {
        console.log('음성 인식 시작');
        isRecording = true;
        voiceMicIcon.style.animation = 'pulse 1s infinite';
    };

    recognition.onresult = function(event) {
        console.log('음성 인식 결과 이벤트:', event);
        const transcript = event.results[0][0].transcript;
        console.log('인식된 텍스트:', transcript);
        processVoiceInput(transcript);
    };

    recognition.onerror = function(event) {
        console.error('음성 인식 오류:', event.error);
        isRecording = false;
        voiceMicIcon.style.animation = 'none';
    };

    recognition.onend = function() {
        console.log('음성 인식 종료');
        isRecording = false;
        voiceMicIcon.style.animation = 'none';
    };

    console.log('음성 인식 초기화 완료');
    return true;
}

// 5. GitHub API 호출
async function callGPTAPI(userInput) {
    console.log('GitHub API 호출 시작');
    console.log('사용자 입력:', userInput);
    console.log('API URL:', GITHUB_API_URL);
    console.log('API 키:', GITHUB_API_KEY ? '설정됨' : '설정되지 않음');
    
    try {
        const requestBody = {
            model: 'openai/gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: '당신은 음식점 키오스크의 음성 안내 시스템입니다. 사용자의 주문이나 질문에 친절하고 도움이 되는 답변을 해주세요. 메뉴에 대한 질문이면 메뉴를 추천해주고, 주문이면 주문을 도와주세요.'
                },
                {
                    role: 'user',
                    content: userInput
                }
            ],
            max_tokens: 4096,
            temperature: 1,
            top_p: 1
        };
        
        console.log('요청 본문:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(GITHUB_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GITHUB_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        console.log('응답 상태:', response.status);
        console.log('응답 헤더:', response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API 응답 오류:', errorText);
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
        return '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.';
    }
}

// 6. 음성 입력 처리
async function processVoiceInput(transcript) {
    try {
        // GPT API 호출
        const gptResponse = await callGPTAPI(transcript);
        
        // GPT 응답을 음성으로 재생
        speakText(gptResponse);
        
        // 화면에 응답 표시 (선택사항)
        showResponse(transcript, gptResponse);
    } catch (error) {
        console.error('음성 입력 처리 오류:', error);
        speakText('죄송합니다. 처리 중 오류가 발생했습니다.');
    }
}

// 7. 텍스트를 음성으로 변환
function speakText(text) {
    if (currentUtterance) {
        speechSynthesis.cancel();
    }

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'ko-KR';
    currentUtterance.rate = speechRate;
    currentUtterance.pitch = 1;
    currentUtterance.volume = 1;

    // 반복 재생
    let playCount = 0;
    currentUtterance.onend = function() {
        playCount++;
        if (playCount < repeatCount) {
            speechSynthesis.speak(currentUtterance);
        }
    };

    speechSynthesis.speak(currentUtterance);
}

// 8. 응답 화면 표시
function showResponse(userInput, gptResponse) {
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
    
    // 스타일 추가
    responseDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 1000;
        max-width: 80%;
        text-align: center;
    `;

    document.body.appendChild(responseDiv);

    // 3초 후 자동 제거
    setTimeout(() => {
        if (responseDiv.parentNode) {
            responseDiv.remove();
        }
    }, 3000);
}

// 9. 음성 마이크 아이콘 클릭 이벤트 설정
function setupVoiceMicIcon() {
    voiceMicIcon = document.querySelector('.voice-mic-icon');
    console.log('마이크 아이콘 요소 찾기:', voiceMicIcon);
    
    if (!voiceMicIcon) {
        console.error('마이크 아이콘을 찾을 수 없습니다!');
        return;
    }
    
    voiceMicIcon.addEventListener('click', function() {
        console.log('마이크 아이콘 클릭됨 - GPT API 호출 시작');
        
        // 마이크 아이콘 클릭 시 바로 GPT API 호출
        callGPTAPI('안녕하세요, 무엇을 도와드릴까요?').then(response => {
            console.log('GPT API 응답 성공:', response);
            speakText(response);
            showResponse('안녕하세요, 무엇을 도와드릴까요?', response);
        }).catch(error => {
            console.error('GPT API 호출 실패:', error);
            speakText('죄송합니다. 처리 중 오류가 발생했습니다.');
        });
    });
    
    console.log('마이크 아이콘 이벤트 리스너 설정 완료');
}

// 10. 각 버튼에 클릭 이벤트를 연결합니다.
speedBtn.addEventListener('click', () => openModal(speedModal));
repeatBtn.addEventListener('click', () => openModal(repeatModal));

// 모든 닫기 버튼에 클릭 이벤트를 연결합니다.
closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
});

// 뒷배경을 클릭해도 닫히도록 이벤트를 연결합니다.
overlay.addEventListener('click', closeModal);

// 11. 슬라이더 이벤트 처리
document.addEventListener('DOMContentLoaded', function() {
    // 속도 조절 슬라이더
    const speedPoints = document.querySelectorAll('#speedModal .slider-point');
    speedPoints.forEach((point, index) => {
        point.addEventListener('click', function() {
            speedPoints.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            
            const labels = document.querySelectorAll('#speedModal .label-item');
            labels.forEach(l => l.classList.remove('active'));
            labels[index].classList.add('active');
            
            speechRate = index === 0 ? 0.7 : index === 1 ? 1.0 : 1.3;
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
            
            repeatCount = index + 1;
            closeModal();
        });
    });
});

// 12. 페이지 로드 시 음성 인식 초기화
window.addEventListener('load', function() {
    console.log('페이지 로드 완료, 초기화 시작');
    
    // 마이크 아이콘 이벤트 설정
    setupVoiceMicIcon();
    
    // 음성 인식 초기화
    initSpeechRecognition();
    
    // GitHub API 테스트 함수 (개발용)
    window.testGPTAPI = async function() {
        console.log('GitHub API 테스트 시작...');
        try {
            const testResponse = await callGPTAPI('안녕하세요');
            console.log('GitHub API 테스트 성공:', testResponse);
            alert('GitHub API 테스트 성공!\n응답: ' + testResponse);
        } catch (error) {
            console.error('GitHub API 테스트 실패:', error);
            alert('GitHub API 테스트 실패: ' + error.message);
        }
    };
    
    // 테스트 버튼 추가 (개발용)
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
    testButton.onclick = window.testGPTAPI;
    document.body.appendChild(testButton);
    
    console.log('초기화 완료');
});

// 13. CSS 애니메이션 추가
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