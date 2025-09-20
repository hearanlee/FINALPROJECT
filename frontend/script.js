class VoiceOrderSystem {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSpeaking = false;
        this.hasUserInteracted = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.initializeSpeechRecognition();
        this.showWelcomeMessage();
    }
    
    initializeElements() {
        this.speakerIcon = document.getElementById('speakerIcon');
        this.statusText = document.getElementById('statusText');
        this.subtitle = document.getElementById('subtitle');
        this.microphone = document.getElementById('microphone');
        this.userInput = document.getElementById('userInput');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.menuBtn = document.getElementById('menuBtn');
        this.orderBtn = document.getElementById('orderBtn');
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => {
            this.hasUserInteracted = true;
            this.speakWelcomeMessage();
        });
        this.stopBtn.addEventListener('click', () => this.stopListening());
        this.menuBtn.addEventListener('click', () => this.goToMenu());
        this.orderBtn.addEventListener('click', () => this.goToOrder());
        this.microphone.addEventListener('click', () => {
            this.hasUserInteracted = true;
            if (this.isListening) {
                this.stopListening();
            } else {
                this.speakWelcomeMessage();
            }
        });
        
        // 페이지 클릭 시 음성 시작
        document.addEventListener('click', () => {
            if (!this.hasUserInteracted) {
                this.hasUserInteracted = true;
                this.speakWelcomeMessage();
            }
        });
        
        // 키보드 입력 시 음성 시작
        document.addEventListener('keydown', () => {
            if (!this.hasUserInteracted) {
                this.hasUserInteracted = true;
                this.speakWelcomeMessage();
            }
        });
    }
    
    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            this.recognition = new SpeechRecognition();
        } else {
            this.statusText.textContent = '음성 인식을 지원하지 않는 브라우저입니다.';
            this.startBtn.disabled = true;
            return;
        }
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'ko-KR';
        
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI();
            this.statusText.textContent = '음성을 듣고 있습니다...';
            // 자막은 그대로 유지하고 스타일만 변경
            this.subtitle.className = 'subtitle listening';
        };
        
        this.recognition.onresult = (event) => {
            const result = event.results[0][0].transcript.trim();
            this.userInput.textContent = `인식된 음성: "${result}"`;
            this.processVoiceCommand(result);
        };
        
        this.recognition.onerror = (event) => {
            console.error('음성 인식 오류:', event.error);
            this.statusText.textContent = '음성 인식 중 오류가 발생했습니다.';
            this.stopListening();
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUI();
            this.subtitle.className = 'subtitle';
        };
    }
    
    showWelcomeMessage() {
        this.statusText.textContent = '페이지를 클릭하거나 마이크를 클릭하여 음성을 시작하세요.';
        this.subtitle.textContent = '';
    }
    
    async speakWelcomeMessage() {
        try {
            // 백엔드에서 음성 안내 텍스트 가져오기
            const response = await apiClient.getVoiceGuideText();
            const welcomeMessage = response.guide_text;
            
            this.speak(welcomeMessage, () => {
                // 음성이 완전히 끝난 후에만 마이크 활성화
                this.statusText.textContent = '음성 인식을 시작하세요.';
                // 자막은 그대로 유지하고 스타일만 변경
                this.subtitle.className = 'subtitle listening';
                // 약간의 지연을 두고 마이크 활성화
                setTimeout(() => {
                    this.startListening();
                }, 500);
            });
        } catch (error) {
            console.error('음성 안내 텍스트 로드 실패:', error);
            // 백엔드 연결 실패 시 기본 메시지 사용
            const fallbackMessage = "안녕하세요. 반갑습니다. 주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주시고, 못 정하셨으면 '메뉴'라고 말해 주세요.";
            this.speak(fallbackMessage, () => {
                this.statusText.textContent = '음성 인식을 시작하세요.';
                this.subtitle.className = 'subtitle listening';
                setTimeout(() => {
                    this.startListening();
                }, 500);
            });
        }
    }
    
    speak(text, callback = null) {
        console.log('speak 함수 호출됨:', text);
        console.log('hasUserInteracted:', this.hasUserInteracted);
        
        if (!this.hasUserInteracted) {
            console.log('사용자 상호작용이 필요합니다.');
            if (callback) callback();
            return;
        }
        
        if (this.isSpeaking) {
            this.synthesis.cancel();
        }
        
        this.isSpeaking = true;
        this.speakerIcon.style.animation = 'pulse 0.5s infinite';
        
        // 자막을 즉시 전체 표시
        this.subtitle.textContent = text;
        this.subtitle.className = 'subtitle speaking';
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        console.log('SpeechSynthesis 지원 여부:', 'speechSynthesis' in window);
        console.log('사용 가능한 음성 목록:', this.synthesis.getVoices().length);
        
        // 한국어 음성 선택 시도
        const voices = this.synthesis.getVoices();
        console.log('전체 음성 목록:', voices.map(v => ({ name: v.name, lang: v.lang })));
        
        const koreanVoice = voices.find(voice => 
            voice.lang.includes('ko') || voice.lang.includes('KR')
        );
        if (koreanVoice) {
            utterance.voice = koreanVoice;
            console.log('한국어 음성 선택됨:', koreanVoice.name);
        } else {
            console.log('한국어 음성을 찾을 수 없음, 기본 음성 사용');
        }
        
        utterance.onstart = () => {
            console.log('음성 재생 시작:', text);
            // 음성 재생 시작과 동시에 자막이 이미 표시되어 있음
        };
        
        utterance.onend = () => {
            console.log('음성 재생 완료');
            this.isSpeaking = false;
            this.speakerIcon.style.animation = 'pulse 2s infinite';
            // 자막은 그대로 유지하고 스타일만 변경
            this.subtitle.className = 'subtitle';
            if (callback) callback();
        };
        
        utterance.onerror = (event) => {
            console.error('음성 합성 오류:', event.error);
            this.isSpeaking = false;
            this.speakerIcon.style.animation = 'pulse 2s infinite';
            this.subtitle.className = 'subtitle';
            if (callback) callback();
        };
        
        console.log('음성 재생 시도 중...');
        this.synthesis.speak(utterance);
        
        // 음성이 재생되지 않는 경우를 위한 폴백
        setTimeout(() => {
            if (this.isSpeaking) {
                console.log('음성 재생이 시작되지 않음, 폴백 실행');
                this.isSpeaking = false;
                this.speakerIcon.style.animation = 'pulse 2s infinite';
                this.subtitle.className = 'subtitle';
                if (callback) callback();
            }
        }, 1000);
    }
    
    startListening() {
        if (!this.recognition) {
            this.statusText.textContent = '음성 인식을 지원하지 않습니다.';
            return;
        }
        
        // 음성 재생 중에는 마이크 활성화하지 않음
        if (this.isSpeaking) {
            console.log('음성 재생 중이므로 마이크 활성화를 지연합니다.');
            setTimeout(() => {
                this.startListening();
            }, 1000);
            return;
        }
        
        try {
            this.recognition.start();
        } catch (error) {
            console.error('음성 인식 시작 오류:', error);
            this.statusText.textContent = '음성 인식을 시작할 수 없습니다.';
        }
    }
    
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }
    
    processVoiceCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        if (lowerCommand.includes('메뉴')) {
            this.speak('메뉴 페이지로 이동합니다.', () => {
                this.goToMenu();
            });
        } else if (lowerCommand.includes('주문')) {
            this.speak('주문 페이지로 이동합니다.', () => {
                this.goToOrder();
            });
        } else {
            this.speak('죄송합니다. "메뉴" 또는 "주문"이라고 말씀해주세요.', () => {
                this.statusText.textContent = '다시 말씀해주세요.';
                // 자막은 그대로 유지하고 스타일만 변경
                this.subtitle.className = 'subtitle';
                // 음성이 완전히 끝난 후 자동으로 다시 음성 인식 시작
                setTimeout(() => {
                    this.subtitle.className = 'subtitle listening';
                    this.startListening();
                }, 2000);
            });
        }
    }
    
    goToMenu() {
        this.statusText.textContent = '메뉴 페이지로 이동 중...';
        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 1000);
    }
    
    goToOrder() {
        this.statusText.textContent = '주문 페이지로 이동 중...';
        setTimeout(() => {
            window.location.href = 'order.html';
        }, 1000);
    }
    
    updateUI() {
        this.startBtn.disabled = this.isListening;
        this.stopBtn.disabled = !this.isListening;
        
        if (this.isListening) {
            this.microphone.classList.add('listening');
        } else {
            this.microphone.classList.remove('listening');
        }
    }
}

// 페이지 로드 시 음성 주문 시스템 초기화
document.addEventListener('DOMContentLoaded', () => {
    new VoiceOrderSystem();
});
