class VoiceChat {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSpeaking = false;
        this.currentUtterance = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadVoices();
        this.setupSpeechRecognition();
    }

    initializeElements() {
        this.micButton = document.getElementById('micButton');
        this.micIcon = this.micButton.querySelector('.mic-icon');
        this.micText = this.micButton.querySelector('.mic-text');
        this.status = document.getElementById('status');
        this.chatMessages = document.getElementById('chatMessages');
        this.voiceSelect = document.getElementById('voiceSelect');
        this.speedRange = document.getElementById('speedRange');
        this.speedValue = document.getElementById('speedValue');
        this.waveform = document.getElementById('waveform');
    }

    setupEventListeners() {
        this.micButton.addEventListener('click', () => this.toggleListening());
        this.speedRange.addEventListener('input', (e) => {
            this.speedValue.textContent = e.target.value;
        });
        
        // 음성 합성 완료 시 이벤트
        this.synthesis.addEventListener('voiceschanged', () => this.loadVoices());
    }

    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            this.recognition = new SpeechRecognition();
        } else {
            this.showError('이 브라우저는 음성 인식을 지원하지 않습니다.');
            return;
        }

        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'ko-KR';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI();
            this.status.textContent = '듣고 있습니다...';
            this.waveform.classList.add('active');
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.handleUserInput(transcript);
        };

        this.recognition.onerror = (event) => {
            console.error('음성 인식 오류:', event.error);
            this.showError('음성 인식을 다시 시도해주세요.');
            this.stopListening();
        };

        this.recognition.onend = () => {
            this.stopListening();
        };
    }

    loadVoices() {
        const voices = this.synthesis.getVoices();
        this.voiceSelect.innerHTML = '<option value="">기본 음성</option>';
        
        voices.forEach((voice, index) => {
            if (voice.lang.startsWith('ko') || voice.lang.startsWith('en')) {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${voice.name} (${voice.lang})`;
                this.voiceSelect.appendChild(option);
            }
        });
    }

    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (this.isSpeaking) {
            this.stopSpeaking();
        }
        
        if (this.recognition) {
            this.recognition.start();
        }
    }

    stopListening() {
        if (this.recognition) {
            this.recognition.stop();
        }
        this.isListening = false;
        this.updateUI();
        this.status.textContent = '대기 중...';
        this.waveform.classList.remove('active');
    }

    async handleUserInput(text) {
        this.addMessage(text, 'user');
        this.status.textContent = 'GPT가 답변을 생성 중...';
        
        try {
            const response = await this.callGPTAPI(text);
            this.addMessage(response, 'bot');
            this.speak(response);
        } catch (error) {
            console.error('GPT API 오류:', error);
            const errorMessage = '죄송합니다. 일시적인 오류가 발생했습니다.';
            this.addMessage(errorMessage, 'bot');
            this.speak(errorMessage);
        }
    }

    async callGPTAPI(message) {
        try {
            // 먼저 FastAPI 백엔드 시도
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.response;
            } else {
                // FastAPI가 실패하면 백업 API 사용
                console.log('FastAPI 백엔드 연결 실패, 백업 API 사용');
                return await this.callBackupAPI(message);
            }
        } catch (error) {
            console.log('FastAPI 백엔드 오류, 백업 API 사용:', error.message);
            return await this.callBackupAPI(message);
        }
    }

    async callBackupAPI(message) {
        const response = await fetch('/api/chat-backup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message
            })
        });

        if (!response.ok) {
            throw new Error('API 호출 실패');
        }

        const data = await response.json();
        return data.response;
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        
        messageDiv.appendChild(contentDiv);
        this.chatMessages.appendChild(messageDiv);
        
        // 스크롤을 맨 아래로
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    speak(text) {
        if (this.isSpeaking) {
            this.stopSpeaking();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        // 음성 설정
        const selectedVoice = this.voiceSelect.value;
        if (selectedVoice) {
            const voices = this.synthesis.getVoices();
            utterance.voice = voices[selectedVoice];
        }
        
        utterance.rate = parseFloat(this.speedRange.value);
        utterance.lang = 'ko-KR';
        utterance.volume = 1;

        utterance.onstart = () => {
            this.isSpeaking = true;
            this.status.textContent = 'GPT가 말하고 있습니다...';
            this.updateUI();
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.status.textContent = '대기 중...';
            this.updateUI();
        };

        utterance.onerror = (event) => {
            console.error('음성 합성 오류:', event.error);
            this.isSpeaking = false;
            this.updateUI();
        };

        this.currentUtterance = utterance;
        this.synthesis.speak(utterance);
    }

    stopSpeaking() {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }
        this.isSpeaking = false;
        this.updateUI();
    }

    updateUI() {
        if (this.isListening) {
            this.micButton.classList.add('listening');
            this.micIcon.textContent = '🔴';
            this.micText.textContent = '음성 인식 중...';
        } else if (this.isSpeaking) {
            this.micButton.classList.remove('listening');
            this.micIcon.textContent = '🔊';
            this.micText.textContent = 'GPT가 말하는 중...';
        } else {
            this.micButton.classList.remove('listening');
            this.micIcon.textContent = '🎤';
            this.micText.textContent = '음성 인식 시작';
        }
    }

    showError(message) {
        this.status.textContent = message;
        setTimeout(() => {
            this.status.textContent = '대기 중...';
        }, 3000);
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new VoiceChat();
});
