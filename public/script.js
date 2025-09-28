class VoiceChat {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.hasWelcomed = false;
        this.orderStep = 0; // 주문 단계 추적 (0: 초기, 1: 메뉴선택완료, 2: 결제안내)
        this.currentMenu = null; // 현재 주문 중인 메뉴
        
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
        
        // 첫 번째 음성 인식 시작 시 환영 메시지 재생
        if (!this.hasWelcomed) {
            this.hasWelcomed = true;
            this.playWelcomeMessage();
            return;
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
        this.status.textContent = '처리 중...';
        
        // 특정 키워드 처리
        const lowerText = text.toLowerCase().trim();
        
        // "다했어" 또는 "다했습니다" 키워드 처리
        if (lowerText.includes('다했어') || lowerText.includes('다했습니다') || lowerText.includes('완료')) {
            if (this.orderStep === 1 && this.currentMenu) {
                this.status.textContent = '결제 안내 중...';
                this.playPaymentGuidance();
                return;
            } else if (this.orderStep === 0) {
                this.addMessage('주문하고 싶은 메뉴명을 말씀해주세요.', 'bot');
                this.speak('주문하고 싶은 메뉴명을 말씀해주세요.');
                return;
            }
        }
        
        if (lowerText.includes('메뉴둘러보기') || lowerText.includes('메뉴 둘러보기')) {
            this.status.textContent = '메뉴 둘러보기 안내 중...';
            this.orderStep = 0; // 주문 단계 초기화
            this.currentMenu = null;
            await this.playMenuBrowseGuide();
            return;
        }
        
        if (lowerText === '메뉴' || lowerText.includes('전체 메뉴')) {
            this.status.textContent = '전체 메뉴 안내 중...';
            this.orderStep = 0; // 주문 단계 초기화
            this.currentMenu = null;
            await this.playFullMenuList();
            return;
        }
        
        if (lowerText.includes('주문') && !lowerText.includes('절차')) {
            this.status.textContent = '주문 안내 중...';
            this.orderStep = 0; // 주문 단계 초기화
            this.currentMenu = null;
            this.addMessage('주문하고 싶은 메뉴명을 말씀해주세요.', 'bot');
            this.speak('주문하고 싶은 메뉴명을 말씀해주세요.');
            return;
        }
        
        // 특정 메뉴명이 포함된 경우 주문 절차 안내
        if (this.isMenuName(text)) {
            this.status.textContent = '주문 절차 안내 중...';
            this.orderStep = 1; // 메뉴 선택 단계
            this.currentMenu = text;
            await this.playOrderGuidance(text);
            return;
        }
        
        // 일반적인 질문은 GPT API 호출
        this.status.textContent = 'GPT가 답변을 생성 중...';
        
        try {
            const response = await this.callGPTAPI(text);
            this.addMessage(response, 'bot');
            this.speak(response);
        } catch (error) {
            console.error('GPT API 오류:', error);
            
            let errorMessage = '죄송합니다. 일시적인 오류가 발생했습니다.';
            
            // 토큰 관련 에러인 경우 더 자세한 메시지 표시
            if (error.message.includes('토큰 오류')) {
                errorMessage = `🔑 ${error.message}\n\n토큰을 설정하려면:\n1. .env 파일을 열어주세요\n2. GITHUB_PAT=your_actual_token_here로 변경하세요\n3. 서버를 다시 시작하세요`;
            } else if (error.message.includes('API 호출 실패')) {
                errorMessage = `❌ ${error.message}`;
            }
            
            this.addMessage(errorMessage, 'bot');
            this.speak('죄송합니다. 설정을 확인해주세요.');
        }
    }

    async callGPTAPI(message) {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            
            // 토큰 관련 에러 처리
            if (response.status === 401) {
                throw new Error(`토큰 오류: ${errorData.message || errorData.error}`);
            }
            
            throw new Error(`API 호출 실패: ${errorData.message || errorData.error}`);
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

    // 환영 메시지 재생
    playWelcomeMessage() {
        const welcomeText = "안녕하세요. 반갑습니다. 주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주시고, 전체 메뉴를 보고 싶으시면 '메뉴'라고 말해 주세요.";
        this.addMessage(welcomeText, 'bot');
        this.speak(welcomeText);
    }

    // 메뉴 둘러보기 안내
    async playMenuBrowseGuide() {
        try {
            const response = await fetch('/api/menu-categories');
            const data = await response.json();
            
            let guideText = `메뉴 카테고리는 다음과 같습니다. `;
            
            data.categories.forEach((category, index) => {
                const categoryName = category.name;
                const menuCount = category.menuCount;
                const sampleMenus = category.sampleMenus.slice(0, 2).join(', ');
                
                if (index === data.categories.length - 1) {
                    guideText += `${categoryName} 탭을 누르시면 ${menuCount}개의 메뉴가 있고, ${sampleMenus} 등이 있습니다.`;
                } else {
                    guideText += `${categoryName} 탭을 누르시면 ${menuCount}개의 메뉴가 있고, ${sampleMenus} 등이 있고, `;
                }
            });
            
            guideText += " 주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주세요.";
            
            this.addMessage(guideText, 'bot');
            this.speak(guideText);
        } catch (error) {
            console.error('메뉴 카테고리 가져오기 실패:', error);
            this.playDefaultMenuGuide();
        }
    }

    // 기본 메뉴 안내 (API 실패 시)
    playDefaultMenuGuide() {
        const guideText = "메뉴 카테고리는 다음과 같습니다. 쌀국수 탭을 누르시면 3개의 메뉴가 있고, 차돌양지쌀국수, 한우쌀국수 등이 있고, 돈카츠 카레 탭을 누르시면 9개의 메뉴가 있고, 프리미엄 로스카츠, 통모짜치즈돈카츠 등이 있고, 1인정식 탭을 누르시면 4개의 메뉴가 있고, 정식A, 정식B 등이 있습니다. 주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주세요.";
        this.addMessage(guideText, 'bot');
        this.speak(guideText);
    }

    // 전체 메뉴 목록 안내
    async playFullMenuList() {
        try {
            const response = await fetch('/api/full-menu');
            const data = await response.json();
            
            let menuText = "전체 메뉴를 카테고리별로 안내해드리겠습니다. ";
            
            data.categories.forEach(category => {
                menuText += `${category.name} 카테고리에는 `;
                category.menus.forEach((menu, index) => {
                    if (index === category.menus.length - 1) {
                        menuText += `${menu.name}이 있습니다. `;
                    } else {
                        menuText += `${menu.name}, `;
                    }
                });
            });
            
            this.addMessage(menuText, 'bot');
            this.speak(menuText);
        } catch (error) {
            console.error('전체 메뉴 가져오기 실패:', error);
            this.playDefaultFullMenu();
        }
    }

    // 기본 전체 메뉴 안내 (API 실패 시)
    playDefaultFullMenu() {
        const menuText = "전체 메뉴를 카테고리별로 안내해드리겠습니다. 쌀국수 카테고리에는 차돌양지쌀국수, 한우쌀국수, 모듬 쌀국수가 있습니다. 돈카츠 카레 카테고리에는 프리미엄 로스카츠, 프리미엄 히레츠, 통모짜치즈돈카츠, 시그니처 경양식돈카츠, 모듬카츠A, 모듬카츠B, 등심카츠 카레라이스, 안심카츠 카레라이스, 통모짜치즈 카레라이스가 있습니다. 1인정식 카테고리에는 정식A, 정식B, 정식C, 정식D가 있습니다.";
        this.addMessage(menuText, 'bot');
        this.speak(menuText);
    }

    // 메뉴명인지 확인 (더 정확한 매칭)
    isMenuName(text) {
        const menuNames = [
            '차돌양지쌀국수', '한우쌀국수', '모듬 쌀국수',
            '프리미엄 로스카츠', '프리미엄 히레츠', '통모짜치즈돈카츠', 
            '시그니처 경양식돈카츠', '모듬카츠A', '모듬카츠B',
            '등심카츠 카레라이스', '안심카츠 카레라이스', '통모짜치즈 카레라이스',
            '정식A', '정식B', '정식C', '정식D',
            // 부분 매칭을 위한 키워드
            '차돌양지', '한우', '모듬쌀국수', '모듬 쌀국수',
            '로스카츠', '히레츠', '치즈돈카츠', '경양식',
            '모듬카츠', '등심카츠', '안심카츠', '치즈카츠',
            '정식'
        ];
        
        return menuNames.some(menuName => 
            text.includes(menuName) || menuName.includes(text)
        );
    }

    // 주문 절차 안내
    async playOrderGuidance(menuName) {
        try {
            const response = await fetch('/api/order-guidance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    menuName: menuName
                })
            });

            if (!response.ok) {
                throw new Error('주문 안내 API 호출 실패');
            }

            const data = await response.json();
            this.addMessage(data.guidance, 'bot');
            this.speak(data.guidance);
        } catch (error) {
            console.error('주문 안내 오류:', error);
            this.playDefaultOrderGuidance(menuName);
        }
    }

    // 기본 주문 절차 안내 (API 실패 시)
    playDefaultOrderGuidance(menuName) {
        let guidance = '';
        
        // 정확한 메뉴명 매칭
        if (menuName.includes('차돌양지쌀국수') || menuName.includes('차돌양지')) {
            guidance = `차돌양지쌀국수를 주문하시려면 다음과 같이 진행해 주세요. 먼저, 상단 메뉴에서 '쌀국수' 카테고리를 누르시고 차돌양지쌀국수를 선택하세요. 그리고 하단에 + 버튼을 누르셔서 수량을 선택해 주세요. 다했으면 말씀해주세요.`;
        } else if (menuName.includes('한우쌀국수') || menuName.includes('한우')) {
            guidance = `한우쌀국수를 주문하시려면 다음과 같이 진행해 주세요. 먼저, 상단 메뉴에서 '쌀국수' 카테고리를 누르시고 한우쌀국수를 선택하세요. 그리고 하단에 + 버튼을 누르셔서 수량을 선택해 주세요. 다했으면 말씀해주세요.`;
        } else if (menuName.includes('모듬 쌀국수') || menuName.includes('모듬쌀국수')) {
            guidance = `모듬 쌀국수를 주문하시려면 다음과 같이 진행해 주세요. 먼저, 상단 메뉴에서 '쌀국수' 카테고리를 누르시고 모듬 쌀국수를 선택하세요. 그리고 하단에 + 버튼을 누르셔서 수량을 선택해 주세요. 다했으면 말씀해주세요.`;
        } else if (menuName.includes('프리미엄 로스카츠') || menuName.includes('로스카츠')) {
            guidance = `프리미엄 로스카츠를 주문하시려면 다음과 같이 진행해 주세요. 먼저, 상단 메뉴에서 '돈카츠 카레' 카테고리를 누르시고 프리미엄 로스카츠를 선택하세요. 그리고 하단에 + 버튼을 누르셔서 수량을 선택해 주세요. 추가옵션이 있는 메뉴인 경우 추가옵션을 선택하신 다음 하단에 주문담기를 눌러주세요. 다했으면 말씀해주세요.`;
        } else if (menuName.includes('프리미엄 히레츠') || menuName.includes('히레츠')) {
            guidance = `프리미엄 히레츠를 주문하시려면 다음과 같이 진행해 주세요. 먼저, 상단 메뉴에서 '돈카츠 카레' 카테고리를 누르시고 프리미엄 히레츠를 선택하세요. 그리고 하단에 + 버튼을 누르셔서 수량을 선택해 주세요. 추가옵션이 있는 메뉴인 경우 추가옵션을 선택하신 다음 하단에 주문담기를 눌러주세요. 다했으면 말씀해주세요.`;
        } else if (menuName.includes('통모짜치즈돈카츠') || menuName.includes('치즈돈카츠')) {
            guidance = `통모짜치즈돈카츠를 주문하시려면 다음과 같이 진행해 주세요. 먼저, 상단 메뉴에서 '돈카츠 카레' 카테고리를 누르시고 통모짜치즈돈카츠를 선택하세요. 그리고 하단에 + 버튼을 누르셔서 수량을 선택해 주세요. 추가옵션이 있는 메뉴인 경우 추가옵션을 선택하신 다음 하단에 주문담기를 눌러주세요. 다했으면 말씀해주세요.`;
        } else if (menuName.includes('시그니처 경양식돈카츠') || menuName.includes('경양식')) {
            guidance = `시그니처 경양식돈카츠를 주문하시려면 다음과 같이 진행해 주세요. 먼저, 상단 메뉴에서 '돈카츠 카레' 카테고리를 누르시고 시그니처 경양식돈카츠를 선택하세요. 그리고 하단에 + 버튼을 누르셔서 수량을 선택해 주세요. 추가옵션이 있는 메뉴인 경우 추가옵션을 선택하신 다음 하단에 주문담기를 눌러주세요. 다했으면 말씀해주세요.`;
        } else if (menuName.includes('모듬카츠')) {
            guidance = `모듬카츠를 주문하시려면 다음과 같이 진행해 주세요. 먼저, 상단 메뉴에서 '돈카츠 카레' 카테고리를 누르시고 모듬카츠를 선택하세요. 그리고 하단에 + 버튼을 누르셔서 수량을 선택해 주세요. 추가옵션이 있는 메뉴인 경우 추가옵션을 선택하신 다음 하단에 주문담기를 눌러주세요. 다했으면 말씀해주세요.`;
        } else if (menuName.includes('카레라이스') || menuName.includes('등심카츠') || menuName.includes('안심카츠') || menuName.includes('치즈카츠')) {
            guidance = `${menuName}를 주문하시려면 다음과 같이 진행해 주세요. 먼저, 상단 메뉴에서 '돈카츠 카레' 카테고리를 누르시고 ${menuName}를 선택하세요. 그리고 하단에 + 버튼을 누르셔서 수량을 선택해 주세요. 추가옵션이 있는 메뉴인 경우 추가옵션을 선택하신 다음 하단에 주문담기를 눌러주세요. 다했으면 말씀해주세요.`;
        } else if (menuName.includes('정식')) {
            guidance = `${menuName}를 주문하시려면 다음과 같이 진행해 주세요. 먼저, 상단 메뉴에서 '1인정식' 카테고리를 누르시고 ${menuName}를 선택하세요. 그리고 하단에 + 버튼을 누르셔서 수량을 선택해 주세요. 다했으면 말씀해주세요.`;
        } else {
            guidance = `${menuName} 메뉴의 주문 절차를 안내해드리겠습니다. 먼저 해당 메뉴가 속한 카테고리 탭을 누르시고, 원하는 메뉴를 선택하신 후 주문담기 버튼을 누르시면 됩니다.`;
        }
        
        this.addMessage(guidance, 'bot');
        this.speak(guidance);
    }

    // 결제 안내
    playPaymentGuidance() {
        const paymentText = `다음으로 우측 하단에 결제하기 버튼을 눌러주세요. 그리고 키오스크에 카드를 넣어주세요.`;
        this.addMessage(paymentText, 'bot');
        this.speak(paymentText);
        this.orderStep = 2; // 결제 단계로 변경
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    const voiceChat = new VoiceChat();
    
    // 환영 메시지를 텍스트로만 표시 (음성 재생은 사용자 상호작용 후)
    voiceChat.addMessage("안녕하세요. 반갑습니다. 주문하고 싶은 메뉴가 있으시면 메뉴명을 말씀해주시고, 전체 메뉴를 보고 싶으시면 '메뉴'라고 말해 주세요.", 'bot');
});
