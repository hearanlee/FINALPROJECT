import { GoogleGenAI, Modality } from '@google/genai';

const API_KEY = 'AIzaSyBZ7INgGfYNVrJ54CQdk7veNtHQ9f12xJs'; // 실제 API 키로 교체 필요

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-live-2.5-flash-preview';

const config = { 
  responseModalities: [Modality.TEXT],
  systemInstruction: {
    parts: [{
      text: "너는 '재미나이'라는 이름의 친절한 메뉴 추천 도우미입니다. 항상 짧고 간결하게 대답하며, 두 문장 이상 말하지 않도록 주의하세요. 자연스럽고 친근한 말투를 사용하세요. 대화가 시작되면 먼저 '오늘 어떤 음식이 드시고 싶으신가요? 메뉴를 추천해드릴게요.'라고 친절하게 인사하세요."
    }]
  }
};

let currentSession = null;
let recognition; // 음성 인식 객체
const synthesis = window.speechSynthesis; // 음성 합성 객체
let isVoiceActive = false; // 음성 안내 활성 상태

// [✅ 수정됨 1] AI 응답을 누적할 버퍼 변수 추가
let fullResponseText = ''; 

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

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.pitch = 1;
  utterance.rate = 1.1;
  
  utterance.onstart = () => {
    console.log('💬 [TTS] Gemini 응답 재생 시작:', text);
    if (recognition) {
      try { recognition.stop(); } catch (e) {}
    }
  };
  
  utterance.onend = () => {
    console.log('💬 [TTS] Gemini 응답 재생 완료.');
    if (currentSession && recognition) {
      setTimeout(() => {
        try { recognition.start(); } catch (e) { console.warn('⚠️ [Speech] 음성 인식 재시작 실패:', e.message); }
      }, 300);
    }
  };

  utterance.onerror = (event) => {
    console.error('❌ [TTS] 재생 오류:', event.error);
  };

  synthesis.speak(utterance);
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
          
          setTimeout(() => {
            if (currentSession) {
              try {
                console.log('👋 [Gemini Live] 초기 인사말 요청 전송 시도');
                currentSession.sendClientContent({
                  turns: [],
                  turnComplete: true
                });
              } catch (error) {
                console.error('❌ [Gemini Live] 초기 인사말 전송 실패:', error);
              }
            } else {
              console.warn('⚠️ [Gemini Live] currentSession이 없어 초기 인사말을 보낼 수 없음');
            }
          }, 1500);
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
            
            // 3. 누적된 텍스트가 있을 경우에만 '한번에' 말하기
            if (fullResponseText.trim().length > 0) {
              console.log('💬 [Gemini Live] 최종 응답 재생 시도:', fullResponseText);
              speak(fullResponseText);
            }
            
            // 4. 버퍼 초기화
            fullResponseText = '';
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

      if (isVoiceActive && currentSession) {
        console.log('🛑 [Menu Recommend] 음성 안내 종료');
        isVoiceActive = false;
        
        closeSession();
        
        voiceMicIcon.style.opacity = '1.0';
        return;
      }

      if (!currentSession) {
        console.log('🔄 [Menu Recommend] 새 세션 시작');
        isVoiceActive = true;
        
        await main(); 
        if (!currentSession) {
          console.error('❌ [Menu Recommend] 세션 생성에 실패하여 음성 인식을 시작할 수 없음');
          isVoiceActive = false;
          return;
        }
        
        setTimeout(() => {
          try { 
            recognition.start(); 
          } catch (e) { 
            console.warn('⚠️ [Speech] 음성 인식 시작 실패:', e.message);
          }
        }, 1500);
      } else {
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
    });

    voiceMicIcon.style.cursor = 'pointer';
    voiceMicIcon.style.transition = 'opacity 0.3s, transform 0.3s';
    console.log('✅ [Menu Recommend] 클릭 이벤트 리스너 등록 완료');
  } else {
    console.error('❌ [Menu Recommend] 음성 아이콘 요소를 찾을 수 없음');
  }

  window.addEventListener('beforeunload', () => {
    closeSession();
  });
});