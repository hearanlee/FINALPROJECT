import { GoogleGenAI, Modality } from 'https://esm.run/@google/genai';

const API_KEY = 'AIzaSyBZ7INgGfYNVrJ54CQdk7veNtHQ9f12xJs'; // 실제 API 키로 교체 필요

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-live-2.5-flash-preview';

// 1. 메뉴 리스트를 여기에 정의합니다.
const menuList = "덮밥, 카레, 토스트";

const config = { 
  responseModalities: [Modality.TEXT],
  systemInstruction: {
    parts: [{
      // 2. 여기에 사용자님이 원하시는 프롬프트를 모두 넣습니다.
      text: `
[역할]
너는 '재미나이'라는 이름의 친절한 메뉴 추천 도우미입니다.
당신은 '${menuList}' 3가지 메뉴 중에서만 추천할 수 있습니다.

[작업]
1. 사용자의 요청을 듣고, 반드시 '${menuList}' 3가지 메뉴 중에서만 1개를 골라 추천해야 합니다.
2. 절대로 이 목록에 없는 다른 메뉴를 지어내거나 언급해서는 안 됩니다.
3. 사용자가 "아무거나" 또는 "추천해줘"라고 말해도 3가지 메뉴 중에서 하나를 골라 추천해야 합니다.

[응답 규칙]
1. 친절하고 자연스러운 말투를 사용하세요.
2. 반드시 3문장 이내로 간결하게 대답하세요.
3. 한국어로 대답하세요.

[2단계 확인 규칙 (매우 중요)]
1. 만약 사용자가 당신의 메뉴 추천(예: '카레')에 대해 "좋아", "응", "그걸로 할게" 등 **긍정적인 반응**을 보이면,
2. 페이지를 넘기기 전에 반드시 1번 더 확인해야 합니다.
3. 예를 들어 "카레(으)로 메뉴 추천해드릴까요?" 또는 "좋아요! 카레(으)로 찾아볼까요?"라고 딱 한 문장으로 재확인 질문을 하세요.
4. 이 재확인 질문에는 '덮밥', '카레', '토스트'라는 단어가 포함되어야 합니다.


[페이지 이동 규칙]
1. 사용자가 이 **'재확인 질문'에 대해서도 "응", "그래", "좋아" 등 긍정적인 대답**을 하면,
2. 다른 말은 절대 하지 말고, "PAGE_NAVIGATE:메뉴이름" 형식의 특수 코드만 응답하세요.
3. [예시 1]
   AI: (추천) "카레는 어떠세요?"
   사용자: "좋아."
   AI: (재확인) "카레로 메뉴 추천해드릴까요?"
   사용자: "응."
   AI: (응답) "PAGE_NAVIGATE:카레"
4. [예시 2]
   사용자: "덮밥 추천해줘."
   AI: "덮밥은 어떠세요?"
   사용자: "응."
   AI: (재확인) "덮밥으로 찾아볼까요?"
   사용자: "그래."
   AI: (응답) "PAGE_NAVIGATE:덮밥"
`
    }]
  }
};

let currentSession = null;
let recognition; // 음성 인식 객체
const synthesis = window.speechSynthesis; // 음성 합성 객체
let isVoiceActive = false; // 음성 안내 활성 상태


// [✅ 수정됨 1] AI 응답을 누적할 버퍼 변수 추가
let fullResponseText = ''; 

let speechRate = 1.1; // 기본 속도 (보통)
let repeatCount = 1;  // 기본 반복 횟수

let currentFontSizeStep = 0;
const baseSizes = {
    card: 18,       // .question-card p (기본 18px로 가정)
    instruction: 16 // .instruction-text (CSS에서 16px)
};
const stepAmount = 2; // 한 번에 2px씩 조절
const maxStep = 2;    // 최대 2단계 (총 +4px)
const minStep = -1;   // 최소 -1단계 (총 -2px)

// --- 1. Web Speech API (STT) 설정 ---
try {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'ko-KR';
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    console.log('🎙️ [Speech] 음성 인식이 시작되었습니다. 말씀하세요...');
    const icon = document.querySelector('.voice-mic-icon');
    if (icon) icon.style.opacity = '0.7';
  };

  recognition.onend = () => {
    console.log('🛑 [Speech] 음성 인식이 종료되었습니다.');
    const icon = document.querySelector('.voice-mic-icon');
    if (icon) icon.style.opacity = '1.0';
    
    if (currentSession && !synthesis.speaking) {
      setTimeout(() => {
        try { recognition.start(); } catch (e) { console.warn('⚠️ [Speech] 음성 인식 재시작 실패:', e.message); }
      }, 500);
    }
  };

  recognition.onresult = (event) => {
    const resultIndex = event.results.length - 1;
    const currentResult = event.results[resultIndex];
    
    if (!currentResult || !currentResult.isFinal) return;
    
    const transcript = currentResult[0].transcript.trim();
    console.log('🗣️ [User] 인식된 텍스트:', transcript);

    if (transcript && currentSession) {
      console.log('➡️ [Gemini Live] Gemini에 텍스트 전송:', transcript);
      
      try {
        currentSession.sendClientContent({
          turns: [{
            role: 'user',
            parts: [{ text: transcript }]
          }],
          turnComplete: true
        });
          } catch (error) {
        console.error('❌ [Gemini Live] 텍스트 전송 오류:', error);
      }
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

// --- 2. TTS (Text-to-Speech) 함수 ---
function speak(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0 || !synthesis) {
    console.warn('⚠️ [Speech] TTS 텍스트가 없거나, synthesis가 지원되지 않습니다.');
    return;
  }

  if (synthesis.speaking) {
    synthesis.cancel();
  }

  let currentRepeat = 0;

  const speakOnce = () => {
    if (currentRepeat >= repeatCount) {
      // 1. 모든 반복이 끝나면 마이크 재시작
      console.log('💬 [TTS] Gemini 응답 재생 완료.');
      if (currentSession && recognition) {
        setTimeout(() => {
          try { recognition.start(); } catch (e) { console.warn('⚠️ [Speech] 음성 인식 재시작 실패:', e.message); }
        }, 300);
      }
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.pitch = 1;
    utterance.rate = speechRate; // 1.1 대신 변수 사용
  
    utterance.onstart = () => {
      if (currentRepeat === 0) { // 첫 번째 재생일 때만 로그 기록
        console.log('💬 [TTS] Gemini 응답 재생 시작:', text);
        if (recognition) {
          try { recognition.stop(); } catch (e) {}
        }
      }
    };
  
    utterance.onend = () => {
      currentRepeat++; // 반복 횟수 증가
      if (currentRepeat < repeatCount) {
        console.log(`🔄 [TTS] 반복 재생 (${currentRepeat + 1}/${repeatCount})`);
        setTimeout(speakOnce, 300); // 다음 재생 (약간의 텀을 줌)
      } else {
        // 2. 모든 반복이 끝나면 마이크 재시작 (onend에서)
        console.log('💬 [TTS] Gemini 응답 재생 완료.');
        if (currentSession && recognition) {
          setTimeout(() => {
            try { recognition.start(); } catch (e) { console.warn('⚠️ [Speech] 음성 인식 재시작 실패:', e.message); }
          }, 300);
        }
      }
    };

    utterance.onerror = (event) => {
      console.error('❌ [TTS] 재생 오류:', event.error);
      // 3. 오류가 나도 마이크는 재시작
      if (currentSession && recognition) {
        setTimeout(() => {
          try { recognition.start(); } catch (e) { console.warn('⚠️ [Speech] 음성 인식 재시작 실패:', e.message); }
        }, 300);
      }
    };

    synthesis.speak(utterance);
  };
  
  speakOnce(); // 첫 번째 재생 시작
}

function applyFontSizes() {
    // 1. 대상 요소들 선택 (ID로 정확하게 찾기)
    const cardText = document.getElementById('main-question-text');
    const instructionText = document.getElementById('main-instruction-text');

    // 2. 새 폰트 크기 계산
    const newCardSize = (baseSizes.card || 18) + (currentFontSizeStep * stepAmount); 
    const newInstructionSize = (baseSizes.instruction || 16) + (currentFontSizeStep * stepAmount);

    // 3. 폰트 크기 적용 (querySelectorAll -> getElementById로 변경되어 로직 수정)
    if (cardText) {
        cardText.style.fontSize = `${newCardSize}px`;
    } else {
        // ID를 못 찾으면 콘솔에 경고
        console.warn('❌ [Font Size] ID가 "main-question-text"인 요소를 찾을 수 없습니다.');
    }
    
    if (instructionText) {
        instructionText.style.fontSize = `${newInstructionSize}px`;
    } else {
        // ID를 못 찾으면 콘솔에 경고
        console.warn('❌ [Font Size] ID가 "main-instruction-text"인 요소를 찾을 수 없습니다.');
    }

    console.log(`[Font Size] 현재 단계: ${currentFontSizeStep}, (Card: ${newCardSize}px)`);
}

// --- 3. Gemini Live 연결 (수정됨) ---
async function main() {
  console.log('🚀 [Gemini Live] API 호출 시작...');
  console.log('📋 [Gemini Live] 모델:', model);
  
  try {
    currentSession = await ai.live.connect({
      model: model,
      callbacks: {
        onopen: function () {
          console.log('✅ [Gemini Live] 연결 성공 (Opened)');
          console.log('👋 [Gemini Live] AI의 첫인사를 트리거합니다.');
  
          // AI의 첫 턴(인사)을 강제로 트리거하기 위해
          // " " (공백)을 사용자의 첫 마디로 전송합니다.
          try {
            if (currentSession) {
              currentSession.sendClientContent({
                turns: [{
                  role: 'user',
                  parts: [{ text: " " }] // 빈 턴 대신 공백 한 칸을 보냅니다.
                }],
                turnComplete: true
              });
            }
          } catch (error) {
            console.error('❌ [Gemini Live] 초기 인사말 트리거 실패:', error);
          }
        },

        // [✅ 수정됨 2] onmessage: 텍스트를 누적했다가 'turnComplete'일 때 한 번에 말하기
        onmessage: function (message) {
          console.log('📨 [Gemini Live] 메시지 수신:', message);
          
          const serverContent = message?.serverContent;

          // 1. 텍스트가 있으면 버퍼에 '누적'
          if (serverContent?.modelTurn && serverContent.modelTurn.parts) {
            for (const part of serverContent.modelTurn.parts) {
              if (part.text) { 
                fullResponseText += part.text; // 버퍼에 추가
                console.log('🔄 [Gemini Live] 텍스트 누적:', part.text);
              }
            }
          }

          // 2. 턴이 완료되었다는 신호를 확인
          if (serverContent?.turnComplete) {
            console.log('✅ [Gemini Live] 턴 완료');
            
            // ▼▼▼▼▼ 여기가 수정되었습니다 (startsWith, split, if/else if) ▼▼▼▼▼
            const finalResponse = fullResponseText.trim();

            // 3. 페이지 이동 특수 코드 "PAGE_NAVIGATE:" 감지
            if (finalResponse.startsWith('PAGE_NAVIGATE:')) { 
              
              // "PAGE_NAVIGATE:덮밥" -> "덮밥" 추출
              const menuToNavigate = finalResponse.split(':')[1].trim(); 
              
              let targetUrl = ''; // 이동할 URL

              if (menuToNavigate === '카레') {
                targetUrl = 'restaurant_list_c.html';
              } else if (menuToNavigate === '덮밥') {
                targetUrl = 'restaurant_list_b.html';
              } else if (menuToNavigate === '토스트') {
                targetUrl = 'restaurant_list_t.html';
              } else {
                // 혹시 모를 예외 처리
                console.error('❌ [App] 알 수 없는 메뉴 이름 수신:', menuToNavigate);
                speak("앗, 죄송합니다. 이동할 페이지를 찾지 못했어요.");
                fullResponseText = '';
                return; // 함수 종료
              }
              
              console.log(`🚀 [App] ${menuToNavigate} 페이지 이동 명령 감지! ${targetUrl}로 이동합니다.`);
              // 안내멘트도 동적으로 수정
              speak(`알겠습니다. ${menuToNavigate} 추천 음식점으로 이동합니다.`); 
              
              setTimeout(() => {
                window.location.href = targetUrl; // ★★★ 동적 URL로 이동
              }, 1500); 

            } else if (finalResponse.length > 0) {
              // 4. (페이지 이동이 아닐 경우) 누적된 텍스트가 있을 때만 말하기
              console.log('💬 [Gemini Live] 최종 응답 재생 시도:', finalResponse);
              speak(finalResponse);
            }
            
            // 5. 버퍼 초기화 (if/else 상관없이 항상 실행)
            fullResponseText = '';
            // ▲▲▲▲▲ 여기까지 수정되었습니다 ▲▲▲▲▲
          }
          
          // 텍스트가 아닌 메시지 (예: setupComplete 등)
          if (message.setupComplete) {
              console.log('ℹ️ [Gemini Live] Setup 완료 메시지 수신', message);
          }
        },
        onerror: function (e) {
          console.error('❌ [Gemini Live] 에러 발생:', e.message || e);
          speak('재미나이 연결에 오류가 발생했습니다.');
        },
        onclose: function (e) {
          console.log('🔌 [Gemini Live] 연결 종료:', e.reason || 'No reason');
          currentSession = null;
          fullResponseText = ''; // 세션 종료 시 버퍼 초기화
        },
      },
      config: config,
    });

    console.log('✅ [Gemini Live] 세션 생성 완료');
  } catch (error) {
    console.error('❌ [Gemini Live] 연결 실패:', error);
    speak('재미나이 연결에 실패했습니다.');
    currentSession = null;
  }
}

// --- 4. 세션 종료 함수 ---
function closeSession() {
  isVoiceActive = false;
  fullResponseText = ''; // 세션 종료 시 버퍼 초기화
  
  if (currentSession) {
    console.log('🔌 [Gemini Live] 세션 종료 중...');
    currentSession.close();
    currentSession = null;
    console.log('✅ [Gemini Live] 세션 종료 완료');
  }
  
  if (recognition) {
    try { 
      recognition.stop(); 
  } catch (e) {
      console.warn('⚠️ [Speech] 음성 인식 중지 실패:', e.message);
    }
  }
  
  if (synthesis.speaking) {
    synthesis.cancel();
  }
}

// --- 5. DOM 이벤트 리스너 ---
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 [Menu Recommend] 페이지 로드 완료');

  // --- 1. 음성 아이콘 설정 (기존 코드) ---
  const voiceMicIcon = document.querySelector('.voice-mic-icon');
  if (voiceMicIcon) {
    console.log('✅ [Menu Recommend] 음성 아이콘 요소 찾음');

    if (!recognition) {
      voiceMicIcon.style.opacity = '0.5';
      voiceMicIcon.style.cursor = 'not-allowed';
      console.error('❌ [Menu Recommend] 음성 인식이 지원되지 않아 아이콘을 비활성화합니다.');
      return;
    }

    voiceMicIcon.addEventListener('click', async () => {
      console.log('🖱️ [Menu Recommend] 음성 아이콘 클릭됨');

      // --- 1. 이미 활성화된 상태면 세션 종료 ---
      if (isVoiceActive && currentSession) {
        console.log('🛑 [Menu Recommend] 음성 안내 종료');
        isVoiceActive = false;
        closeSession();
        voiceMicIcon.style.opacity = '1.0';
        return;
      }

      // --- 2. 새 세션 시작 ---
      if (!currentSession) {
        console.log('🔄 [Menu Recommend] 새 세션 시작');
        isVoiceActive = true;
        await main(); 
        if (!currentSession) {
          console.error('❌ [Menu Recommend] 세션 생성에 실패');
          isVoiceActive = false;
          return;
        }
        console.log('👋 [App] 앱이 직접 첫인사를 재생합니다.');
        speak('오늘 어떤 음식이 드시고 싶으신가요? 메뉴를 추천해드릴게요.');
      } else {
        // --- 3. 이미 세션은 있지만 마이크만 켤 때 ---
        isVoiceActive = true;
        if (synthesis.speaking) {
          synthesis.cancel(); 
          console.log('🔇 [TTS] 사용자가 응답을 중단시킴');
        } else {
          try { 
            recognition.start(); 
          } catch (e) { 
            console.warn('⚠️ [Speech] 음성 인식이 이미 시작되었거나 다른 문제 발생:', e.message);
          }
        }
      }
    }); // <-- voiceMicIcon click 이벤트 종료

    voiceMicIcon.style.cursor = 'pointer';
    voiceMicIcon.style.transition = 'opacity 0.3s, transform 0.3s';
    console.log('✅ [Menu Recommend] 클릭 이벤트 리스너 등록 완료');
  
  } else { 
    console.error('❌ [Menu Recommend] 음성 아이콘 요소를 찾을 수 없음');
  }

  // --- 2. 세션 종료 설정 (기존 코드) ---
  window.addEventListener('beforeunload', () => {
    closeSession();
  });

  // --- 3. 모달 관련 코드 (여기부터 추가됨) ---
  console.log('✅ [Menu Recommend] 모달 이벤트 리스너 등록 시작');
   
  const speedBtn = document.getElementById('speedBtn');
  const speedModal = document.getElementById('speedModal');
  const repeatBtn = document.getElementById('repeatBtn');
  const repeatModal = document.getElementById('repeatModal');
  const closeButtons = document.querySelectorAll('.close-button');
  const overlay = document.querySelector('.modal-overlay');

  if (speedBtn && speedModal && overlay) {
    speedBtn.addEventListener('click', () => {
      console.log('🖱️ [Modal] 속도 조절 버튼 클릭');
      speedModal.classList.add('active');
      overlay.classList.add('active');
    });
  }

  if (repeatBtn && repeatModal && overlay) {
    repeatBtn.addEventListener('click', () => {
      console.log('🖱️ [Modal] 반복 재생 버튼 클릭');
      repeatModal.classList.add('active');
      overlay.classList.add('active');
    });
  }

  const closeModal = () => {
    if (speedModal) speedModal.classList.remove('active');
    if (repeatModal) repeatModal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  };

  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  if (overlay) {
    overlay.addEventListener('click', closeModal);
  }

  // 속도 조절 슬라이더
  const speedPoints = document.querySelectorAll('#speedModal .slider-point');
  const speedLabels = document.querySelectorAll('#speedModal .label-item');
  
  speedPoints.forEach((point, index) => {
    point.addEventListener('click', () => {
      speedPoints.forEach(p => p.classList.remove('active'));
      speedLabels.forEach(item => item.classList.remove('active'));
      
      point.classList.add('active');
      speedLabels[index].classList.add('active');
      
      // HTML 순서 (느림, 보통, 빠름)에 맞춰 속도 설정
      speechRate = [1.0, 1.1, 1.5][index]; 
      console.log('⚙️ [Modal] 음성 속도 설정:', speechRate);
    });
  });
  
  // 반복 횟수 슬라이더
  const repeatPoints = document.querySelectorAll('#repeatModal .slider-point');
  const repeatLabels = document.querySelectorAll('#repeatModal .label-item');
  
  repeatPoints.forEach((point, index) => {
    point.addEventListener('click', () => {
      repeatPoints.forEach(p => p.classList.remove('active'));
      repeatLabels.forEach(item => item.classList.remove('active'));
      
      point.classList.add('active');
      repeatLabels[index].classList.add('active');
      
      repeatCount = index + 1; // 1, 2, 3
      console.log('⚙️ [Modal] 반복 횟수 설정:', repeatCount);
    });
  });

  console.log('✅ [Menu Recommend] 모달 이벤트 리스너 등록 완료');
   // --- 4. 폰트 크기 조절 버튼 ---
  // (마이크, 모달과 동일한 레벨에서 페이지 로드 시 1회만 등록)
  console.log('✅ [Menu Recommend] 폰트 크기 조절 이벤트 리스너 등록 시작');
    
  // (참고) HTML에서 버튼 ID를 'font-plus-btn' 와 'font-minus-btn'로 가정합니다.
  const fontPlusBtn = document.getElementById('font-increase-btn'); 
  const fontMinusBtn = document.getElementById('font-decrease-btn');

  if (fontPlusBtn) {
      fontPlusBtn.addEventListener('click', () => {
          if (currentFontSizeStep < maxStep) {
              currentFontSizeStep++; // 1. 현재 단계를 올리고
              applyFontSizes();      // 2. 폰트 크기 적용 함수 실행
              console.log('🖱️ [Font Size] 글자 크기 + (단계: ' + currentFontSizeStep + ')');
          } else {
              console.log('⚠️ [Font Size] 최대 크기 도달');
          }
      });
  } else {
      console.error('❌ [Menu Recommend] 폰트 + 버튼(#font-increase-btn)을 찾을 수 없음');
  }

  if (fontMinusBtn) {
      fontMinusBtn.addEventListener('click', () => {
          if (currentFontSizeStep > minStep) {
              currentFontSizeStep--; // 1. 현재 단계를 내리고
              applyFontSizes();      // 2. 폰트 크기 적용 함수 실행
              console.log('🖱️ [Font Size] 글자 크기 - (단계: ' + currentFontSizeStep + ')');
          } else {
               console.log('⚠️ [Font Size] 최소 크기 도달');
          }
      });
  } else {
      console.error('❌ [Menu Recommend] 폰트 - 버튼(#font-minus-btn)을 찾을 수 없음');
  }
}); // <-- DOMContentLoaded 닫는 괄호