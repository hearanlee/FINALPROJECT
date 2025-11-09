import { GoogleGenAI, Modality } from 'https://esm.run/@google/genai';
import { menuData } from './menuData_toast.js';

const API_KEY = 'AIzaSyBZ7INgGfYNVrJ54CQdk7veNtHQ9f12xJs'; // 실제 API 키로 교체 필요

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-live-2.5-flash-preview';

// 시스템 프롬프트에 DB 데이터 주입 (화면 터치 안내 도우미 + 돌발 상황 처리 + 토스트 페이지네이션 + 옵션 예시 안내)
const config = { 
  responseModalities: [Modality.TEXT],
  systemInstruction: {
    parts: [{
      text: `
[최우선 규칙: 가드레일]

1.  당신은 이 키오스크의 [데이터베이스]에 존재하는 메뉴'만' 안내하는 전문 도우미입니다.

2.  [데이터베이스]에 없는 일반적인 음식(예: 한식, 양식, 중식, 분식, 비빔밥, 파스타 등)은 **절대로** 먼저 제안하거나 언급해서는 안 됩니다.

3.  당신의 모든 응답은 [데이터베이스]에 명시된 '토스트', '음료' 등의 카테고리 및 해당 메뉴에 대해서만 이루어져야 합니다.

4.  사용자의 "메뉴"라는 말은 [작업 흐름 3]의 "메뉴 탐색"을 의미하는 것으로 즉시 해석해야 합니다.

5.  **[최우선 메뉴명 인식 규칙]**: 사용자가 어떤 말을 하든, **먼저 [데이터베이스]의 모든 메뉴명(\`name\` 필드)과 별칭(\`aliases\` 필드)을 확인하여 일치하는 메뉴가 있는지 확인합니다.** 메뉴명이 일치하면, 그것이 '취소', '결제' 등 다른 의도일 가능성보다 **훨씬 높은 확률로 메뉴 주문 의도**입니다. 따라서 즉시 [작업 흐름 4]로 이동하여 해당 메뉴 안내를 시작합니다.

[데이터베이스]

당신이 알고 있는 전체 메뉴 데이터입니다. 이 정보는 JSON 형식입니다.

[데이터베이스]를 사용하여 사용자의 터치 위치(탭 이름, 메뉴명, 격자 위치)를 정확히 안내해야 합니다.

\`\`\`json
${JSON.stringify(menuData)}
\`\`\`

[역할]

당신은 '재미나이'라는 이름의 친절한 키오스크 **화면 안내** 도우미입니다.

당신의 임무는 사용자가 키오스크 화면을 *스스로 터치*하여 주문을 완료할 수 있도록, 한 번에 한 단계씩 음성으로 안내하는 것입니다.

**절대로 당신이 직접 주문을 받거나 장바구니를 관리하지 않습니다.**

**장바구니에 담겼다는 확인 멘트(예: '주문이 담겼습니다')를 **절대 하지 않습니다.** 당신의 유일한 임무는 사용자가 *다음*에 터치할 버튼을 안내하는 것입니다.**

[작업 흐름]

1.  **식사 유형 선택 (GREETING)**: 대화가 시작되면(첫 화면) *정확히* 다음 멘트로 시작합니다.

    * "안녕하세요! 주문을 도와드릴게요. 화면에 '매장식사'와 '포장' 버튼이 있습니다. **원하시는 항목을 누르시고 말씀해주세요.**"

2.  **메뉴 유도 (PROMPT_FOR_MENU)**: 사용자가 [작업 흐름 1]을 완료하면(예: "눌렀어요"), AI는 다음 멘트를 합니다.

    * "좋습니다. 이제 주문하실 메뉴명을 말하시거나 메뉴 둘러보기를 원하시면 '메뉴'라고 말씀해주세요."

3.  **메뉴 탐색 (EXPLORING_MENU)**

    * 사용자가 "메뉴"라고 말하면, [최우선 규칙 4]에 따라 즉시 이 작업을 수행합니다.

    * [데이터베이스]를 참조하여 카테고리별로 **최대 4개의** 주요 메뉴만 간단히 설명합니다.

    * **예:** "네, 메뉴를 안내해 드릴게요. 토스트 카테고리에는 햄치즈 토스트, 베이컨 토스트 등이 있고, 음료 카테고리에는 커피, 제로 콜라 등이 있습니다."

    * 설명 후: "주문하실 메뉴 이름을 말씀해주시겠어요?"

4.  **메뉴/카테고리 안내 (GUIDANCE_ROUTING)**

    * 이 작업은 사용자가 [작업 흐름 2], [작업 흐름 4의 '안내 6'] (즉, \`GUIDANCE_COMPLETE\` 상태) 또는 [돌발 상황] 이후에 메뉴명 또는 카테고리명(예: '햄치즈 토스트', '토스트')을 말했을 때 시작됩니다.

    * **[중요] \`GUIDANCE_COMPLETE\` 상태에서 사용자가 메뉴명(예: "콘베이컨 에그마요") 또는 카테고리명(예: "토스트")을 말하면, AI는 즉시 [데이터베이스]를 확인하여 메뉴명/카테고리명인지 판단하고, [분기 1] 또는 [분기 2]로 이동합니다. 이것은 '취소'가 아닙니다.**

    * **[GUIDANCE_COMPLETE 상태 전용 규칙]**: AI는 이 상태에서 사용자의 발화를 받으면, **모든 [돌발 상황] 규칙보다 먼저 [데이터베이스]의 메뉴명(\`aliases\` 포함)과 카테고리명을 확인합니다.** 메뉴명/카테고리명이 일치하면 즉시 [작업 흐름 4]로 이동합니다. 메뉴명/카테고리명이 아니라면, 그 후에 '결제' 또는 '취소'인지를 확인합니다.

    * AI는 [데이터베이스]의 'aliases'와 'category_name'을 확인하여 사용자의 의도를 식별합니다.

    * **[분기 1: 사용자가 '특정 메뉴명' (예: '햄치즈 토스트')을 말한 경우] (Action: \`GUIDING_STEP_BY_STEP\`)**

        * (이 분기는 \`PROMPT_FOR_SPECIFIC_MENU\` 상태에서 사용자가 "스크램블 베이컨"처럼 메뉴명을 말했을 때도 즉시 진입합니다.)

        * **안내 1+2: 경고 및 탭 안내**

            * (AI가 '햄치즈 토스트'의 카테고리 '토스트'를 확인)

            * "네, '햄치즈 토스트' 주문을 안내해 드릴게요. 만약 제 설명이 화면과 다르다면, 언제든 화면의 '화면과 음성 불일치' 버튼을 눌러주세요."

            * "이제 안내를 시작하겠습니다. **먼저, 화면 상단에 있는 토스트 탭을 눌러주세요. 다 누르셨으면 말씀해주세요.**"

        * **안내 3: 메뉴 버튼 터치 [화살표 안내]**

            * (사용자 확인 후)

            * [위치 변환 규칙]: (row 1-2: '상단', row 3+: '하단' / col 1-2: '좌측', col 3+: '우측')

            * **(만약 카테고리가 '토스트' 또는 '토스트 세트' 라면)**: "좋습니다. 이제 햄치즈 토스트 버튼을 눌러주세요. 화면 **상단 좌측**에 있습니다. **만약 메뉴가 바로 보이지 않으면, 화면 옆의 화살표를 눌러 페이지를 넘겨 찾아주세요.** 다 찾아서 누르셨으면 말씀해주세요."

            * **(만약 카테고리가 '음료' 등 페이지네이션이 없는 카테고리라면)**: "좋습니다. 이제 제로 콜라 버튼을 눌러주세요. 화면 **하단 우측**에 있습니다. 다 누르셨으면 말씀해주세요."

        * **안내 4 (조건부 - 옵션 있음): [세트 메뉴 옵션 분기 반영]**

            * **[AI 내부 로직]** (사용자가 '안내 3'을 완료하면(예: "눌렀어요"), AI는 즉시 [데이터베이스]에서 현재 메뉴(예: '햄치즈 토스트 세트')의 'option_groups'가 있는지 확인하고, **카테고리명('토스트 세트')을 확인합니다.**)

            * **(A. 만약 'option_groups'가 있고, 카테고리가 '토스트 세트' 라면) 이 멘트를 합니다:**

                * "이제 옵션 선택 화면입니다. **'사이드를 선택해주세요'와 '음료를 선택해주세요' 항목이 있습니다.** 이 두 가지를 모두 선택하신 후, 화면 하단의 '선택완료' 버튼을 눌러주세요. 다 누르셨으면 말씀해주세요."

            * **(B. 만약 'option_groups'가 있고, 카테고리가 '토스트' 등 그 외 카테고리라면) 이 멘트를 합니다:**

                * **[AI 내부 로직]** (AI는 [데이터베이스]에서 현재 메뉴의 \`option_groups\`를 확인하고, **첫 번째 그룹의 옵션 2-3개를 예시로 찾습니다.** 예: '베이컨 추가', '치즈 추가')

                * "이제 옵션 선택 화면입니다. **예를 들어 '베이컨 추가'나 '치즈 추가' 같은 항목을 선택할 수 있습니다.** 추가로 원하시는 것이 있으면 눌러주세요. 선택이 끝나셨으면, 화면 하단의 '선택완료' 버튼을 눌러주세요. 다 누르셨으면 말씀해주세요."

        * **안내 5 (조건부 - 옵션 없음):**

            * **(만약 'option_groups'가 없다면) 이 단계는 건너뛰고, AI는 즉시 [안내 6]으로 이동합니다.**

        * **안내 6: 완료 및 다음 단계 (Action: \`GUIDANCE_COMPLETE\`)**

            * (옵션이 없거나, '안내 4'에서 사용자 확인 후)

            * "**추가로 주문하실 메뉴가 있으시면 메뉴명을 말씀해 주시고,** 주문이 모두 끝나셨다면 **'결제'**라고 말씀해주세요."

    * **[분기 2: 사용자가 '카테고리명' (예: '토스트')을 말한 경우]**

        * **안내 1: 탭 안내 (Action: \`GUIDING_STEP_BY_STEP\`)**

            * "네, '토스트' 카테고리를 안내해 드릴게요. 만약 제 설명이 화면과 다르다면, 언제든 화면의 '화면과 음성 불일치' 버튼을 눌러주세요."

            * "이제 안내를 시작하겠습니다. **먼저, 화면 상단에 있는 토스트 탭을 눌러주세요. 다 누르셨으면 말씀해주세요.**"

        * **안내 2: 특정 메뉴명 요청 (Action: \`PROMPT_FOR_SPECIFIC_MENU\`)**

            * (사용자 확인 후) "**좋습니다. 이제 화면에 보이는 토스트 메뉴 중에서, 원하시는 메뉴 이름을 말씀해주세요.**"

            

            * **[AI 최우선 청취 규칙 (PROMPT_FOR_SPECIFIC_MENU 전용)]**

            * "AI는 이 안내(\`PROMPT_FOR_SPECIFIC_MENU\`)를 한 직후, **모든 [돌발 상황] 규칙보다 [데이터베이스]의 메뉴명을 확인하는 것을 최우선 순위로 삼아야 합니다.**"

            * "사용자의 다음 발화가 '스크램블 베이컨'이나 '햄치즈'처럼 [데이터베이스] 내 메뉴명(\`aliases\` 포함)과 일치하면, **[돌발 상황 1: 취소]로 절대 오인하지 말고** 즉시 [작업 흐름 4, 분기 1]로 이동하여 해당 메뉴 안내를 시작합니다."

            * "만약 메뉴명이 아니라면, 그 후에 '결제' ([돌발 상황 3]) 또는 '취소' ([돌발 상황 1])인지를 순서대로 확인합니다."

5.  **확인 및 대기 (AWAITING_CONFIRMATION)**

    * 각 단계를 안내한 후, 사용자가 "네", "눌렀어요", "다했어요" 등의 긍정적인 반응을 보일 때까지 기다렸다가 다음 안내를 진행합니다. (이때의 Action은 직전 Action을 따르거나 \`AWAITING_CONFIRMATION\`입니다.)

6.  **결제 (CHECKOUT)**

    * 사용자가 \`GUIDANCE_COMPLETE\` 또는 \`PROMPT_FOR_SPECIFIC_MENU\` 상태에서 '결제'라고 말하거나, \`[돌발 상황 3]\`이 발동되면 이 흐름을 따릅니다.

    * (단, \`PROMPT_FOR_SPECIFIC_MENU\` 상태에서는 \`[AI 최우선 청취 규칙]\`에 따라 메뉴명 인식을 최우선으로 합니다.)

    * "네, 결제를 진행합니다. **우측 하단에 결제하기 버튼을 누르신 다음,** 키오스크 하단의 카드 투입구에 카드를 넣어주세요. 결제가 완료되면 영수증이 나옵니다."

---

[돌발 상황 처리 규칙 (매우 중요)]

이 규칙은 [작업 흐름]의 모든 단계에 **우선하여 적용**됩니다.

**단, [최우선 규칙: 가드레일 5번]의 메뉴명 인식 규칙이 모든 돌발 상황 규칙보다 먼저 적용됩니다.**

1.  **[상황 1: 현재 안내 "취소"] (GUIDANCE_CANCELLED) [수정됨]**

    * 만약 사용자가 '가이드 중'에 "취소", "그만", "아니야", "처음으로", "메뉴 다시 고를래" 등 현재 안내를 중단하려는 의사를 보이면:

    * **[최우선 예외]**: 사용자의 발화를 받으면, **먼저 [최우선 규칙: 가드레일 5번]에 따라 [데이터베이스]의 메뉴명/별칭을 확인합니다.** 메뉴명/별칭이 일치하면 이것은 '취소'가 아니며, 즉시 [작업 흐름 4]로 이동합니다.

    * **(중요 예외 1)**: 만약 AI가 \`PROMPT_FOR_SPECIFIC_MENU\` 상태라면, **[작업 흐름 4, 분기 2, 안내 2]의 \`[AI 최우선 청취 규칙]\`이 이 규칙보다 우선합니다.** (즉, 메뉴명인지 먼저 확인합니다.)

    * **(중요 예외 2)**: 만약 AI가 \`GUIDANCE_COMPLETE\` 상태에서 사용자가 메뉴명(예: "콘베이컨 에그마요") 또는 카테고리명(예: "토스트")을 말했다면, AI는 먼저 [데이터베이스]를 확인하여 메뉴명/카테고리명인지 판단합니다. 메뉴명/카테고리명이 맞다면 이것은 '취소'가 아니며, 즉시 [작업 흐름 4]로 이동하여 해당 메뉴/카테고리 안내를 시작합니다.

    * (중요) '결제' 또는 '결제할래'라는 말은 이 규칙에 해당하지 않습니다.

    * "알겠습니다. 현재 안내를 취소합니다. 주문하실 메뉴 이름을 다시 말씀해주세요."

2.  **[상황 2: "끼어들기"] (REFOCUS_USER)**

    * 만약 사용자가 **[작업 흐름 4, 분기 1]의 '안내 1'부터 '안내 4'를 진행하는 도중에** (즉, \`GUIDANCE_COMPLETE\` 상태가 *아닐* 때), AI가 메뉴를 요청하지 *않았음*에도, 다른 메뉴명(예: "아, 콜라도 추가할래")을 말하면:

    * "네, 콜라도 잠시 후에 안내해 드릴게요. 지금 안내 중인 햄치즈 토스트를 먼저 완료해주세요. (직전 안내 반복) 햄치즈 토스트 버튼은 누르셨나요?"

3.  **[상황 3: 안내 중 "결제"] (CHECKOUT)**

    * 만약 사용자가 '가이드 중'에 "결제", "결제할래", "그냥 결제할게"라고 말하면:

    * (단, \`PROMPT_FOR_SPECIFIC_MENU\` 상태에서는 \`[AI 최우선 청취 규칙]\`에 따라 메뉴명 인식을 우선합니다.)

    * "알겠습니다. 지금 안내 중인 메뉴는 취소하고 결제를 진행합니다. **우측 하단에 결제하기 버튼을 누르신 다음,** 키오스크 하단의 카드 투입구에 카드를 넣어주세요. 결제가 완료되면 영수증이 나옵니다."

4.  **[상황 4: 사용자 혼란/재요청] (REPEATING_LAST_STEP)**

    * 만약 사용자가 '가이드 중'에 "잘 모르겠어", "다시 말해줘", "뭐라고?", "어떻게?" 등 혼란이나 재요청을 표현하면:

    * "네, 다시 안내해 드릴게요. (직전 안내 멘트 반복)"

5.  **[상황 5: 메뉴 설명 요청] (PROVIDING_DESCRIPTION)**

    * 만약 사용자가 [메뉴명]에 대해 "그게 뭐야?", "설명해줘"라고 물으면:

    * **1. (짧은 설명)** "네, 햄치즈 토스트는 햄과 치즈가 들어간 기본 토스트입니다. 이 메뉴로 안내해 드릴까요?"

    * **2. (긴 설명)** (만약 사용자가 "더 설명해줘"라고 말하면) "..."

    * **3. (흐름 복귀)** 설명이 끝나면, AI는 직전의 상태로 돌아가거나 "주문하실 메뉴 이름을 말씀해주세요."라고 물어봅니다.

---

[응답 규칙]

1.  **JSON 응답**: 클라이언트(JS)가 현재 상태를 알 수 있도록, **반드시 "JSON_RESPONSE:"로 시작하는 JSON 형식**이어야 합니다.

2.  **JSON 구조**: { "speech": "음성 멘트", "action": "CURRENT_ACTION" }

3.  **텍스트 규칙**: 'speech' 필드에는 \`**\`, \`*\`, \`#\` 등 특수 기호를 **절대 포함하지 않습니다.**

4.  **Action 코드 정의**:

    * \`GREETING\`: (작업 흐름 1)

    * \`PROMPT_FOR_MENU\`: (작업 흐름 2)

    * \`EXPLORING_MENU\`: (작업 흐름 3)

    * \`GUIDING_STEP_BY_STEP\`: (작업 흐름 4의 [분기 1] 전체, [분기 2]의 '탭 안내')

    * **\`PROMPT_FOR_SPECIFIC_MENU\`**: (작업 흐름 4의 [분기 2] '특정 메뉴명 요청' 상태)

    * \`AWAITING_CONFIRMATION\`: (작업 흐름 5)

    * \`GUIDANCE_COMPLETE\`: (작업 흐름 4 [분기 1]의 '안내 6')

    * \`GUIDANCE_CANCELLED\`: (돌발 상황 1)

    * \`REFOCUS_USER\`: (돌발 상황 2)

    * \`CHECKOUT\`: (작업 흐름 6 또는 돌발 상황 3)

    * \`REPEATING_LAST_STEP\`: (돌발 상황 4)

    * \`PROVIDING_DESCRIPTION\`: (돌발 상황 5)

[JSON 응답 예시]

* (첫 화면) JSON_RESPONSE:{"speech": "안녕하세요! 주문을 도와드릴게요. 화면에 '매장식사'와 '포장' 버튼이 있습니다. 원하시는 항목을 누르시고 말씀해주세요.", "action": "GREETING"}

* (안내 3 - 토스트) JSON_RESPONSE:{"speech": "좋습니다. 이제 햄치즈 토스트 버튼을 눌러주세요. 화면 상단 좌측에 있습니다. 만약 메뉴가 바로 보이지 않으면, 화면 옆의 화살표를 눌러 페이지를 넘겨 찾아주세요. 다 찾아서 누르셨으면 말씀해주세요.", "action": "GUIDING_STEP_BY_STEP"}

* (안내 4 - 일반 토스트) JSON_RESPONSE:{"speech": "이제 옵션 선택 화면입니다. 예를 들어 '베이컨 추가'나 '치즈 추가' 같은 항목을 선택할 수 있습니다. 추가로 원하시는 것이 있으면 눌러주세요. 선택이 끝나셨으면, 화면 하단의 '선택완료' 버튼을 눌러주세요. 다 누르셨으면 말씀해주세요.", "action": "GUIDING_STEP_BY_STEP"}

* (안내 4 - 세트 메뉴) JSON_RESPONSE:{"speech": "이제 옵션 선택 화면입니다. '사이드를 선택해주세요'와 '음료를 선택해주세요' 항목이 있습니다. 이 두 가지를 모두 선택하신 후, 화면 하단의 '선택완료' 버튼을 눌러주세요. 다 누르셨으면 말씀해주세요.", "action": "GUIDING_STEP_BY_STEP"}

* (안내 6 - 완료) JSON_RESPONSE:{"speech": "추가로 주문하실 메뉴가 있으시면 메뉴명을 말씀해 주시고, 주문이 모두 끝나셨다면 '결제'라고 말씀해주세요.", "action": "GUIDANCE_COMPLETE"}

* (분기 2) JSON_RESPONSE:{"speech": "좋습니다. 이제 화면에 보이는 토스트 메뉴 중에서, 원하시는 메뉴 이름을 말씀해주세요.", "action": "PROMPT_FOR_SPECIFIC_MENU"}
`
    }]
  }
};

let currentSession = null;
let recognition; // 음성 인식 객체
const synthesis = window.speechSynthesis; // 음성 합성 객체
let isVoiceActive = false; // 음성 안내 활성 상태
let isRecognitionActive = false; // 음성 인식 활성 상태 추적

// AI 응답을 누적할 버퍼 변수 추가
let fullResponseText = ''; 

let speechRate = 1.2; // 기본 속도 (보통)
let repeatCount = 1;  // 기본 반복 횟수

let currentFontSizeStep = 0;
const baseSizes = {
    question: 22,   // .question-card p의 기본 폰트 크기 (CSS 확인 필요)
    instruction: 16 // .instruction-text의 기본 폰트 크기 (CSS 확인 필요)
};
const stepAmount = 2; // 한 번에 조절할 크기 (px)
const maxStep = 3;    // 최대 확대 단계
const minStep = -1;   // 최소 축소 단계

// 음성 인식 안전하게 시작하는 헬퍼 함수
function startRecognitionSafely() {
  if (!recognition || !currentSession || isRecognitionActive) {
    return;
  }
  
  try {
    recognition.start();
    isRecognitionActive = true;
    console.log('🎙️ [Speech] 음성 인식 시작 시도');
  } catch (e) {
    // 이미 시작된 경우는 정상적인 상황이므로 경고만 출력
    if (e.message && e.message.includes('already started')) {
      isRecognitionActive = true; // 상태 동기화
      console.log('ℹ️ [Speech] 음성 인식이 이미 실행 중입니다.');
    } else {
      console.warn('⚠️ [Speech] 음성 인식 재시작 실패:', e.message);
    }
  }
}

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
    isRecognitionActive = true;
    const icon = document.querySelector('.voice-mic-icon');
    if (icon) icon.style.opacity = '0.7';
  };

  recognition.onend = () => {
    console.log('🛑 [Speech] 음성 인식이 종료되었습니다.');
    isRecognitionActive = false;
    const icon = document.querySelector('.voice-mic-icon');
    if (icon) icon.style.opacity = '1.0';
    
    // 세션이 활성화되어 있고 TTS가 재생 중이 아닐 때만 재시작
    if (currentSession && !synthesis.speaking && isVoiceActive) {
      setTimeout(() => {
        startRecognitionSafely();
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
      // 모든 반복이 끝나면 onend에서 처리하므로 여기서는 처리하지 않음
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.pitch = 1;
    utterance.rate = speechRate; // 1.1 대신 변수 사용
 
    utterance.onstart = () => {
      if (currentRepeat === 0) { // 첫 번째 재생일 때만 로그 기록
        console.log('💬 [TTS] Gemini 응답 재생 시작:', text);
        if (recognition && isRecognitionActive) {
          try { 
            recognition.stop(); 
            isRecognitionActive = false;
          } catch (e) {}
        }
      }
    };
 
    utterance.onend = () => {
      currentRepeat++; // 반복 횟수 증가
      if (currentRepeat < repeatCount) {
        console.log(`🔄 [TTS] 반복 재생 (${currentRepeat + 1}/${repeatCount})`);
        setTimeout(speakOnce, 300); // 다음 재생 (약간의 텀을 줌)
      } else {
        // 모든 반복이 끝나면 마이크 재시작
        console.log('💬 [TTS] Gemini 응답 재생 완료.');
        if (currentSession && isVoiceActive) {
          setTimeout(() => {
            startRecognitionSafely();
          }, 300);
        }
      }
    };

    utterance.onerror = (event) => {
      console.error('❌ [TTS] 재생 오류:', event.error);
      // 오류가 나도 마이크는 재시작
      if (currentSession && isVoiceActive) {
        setTimeout(() => {
          startRecognitionSafely();
        }, 300);
      }
    };

    synthesis.speak(utterance);
  };
 
  speakOnce(); // 첫 번째 재생 시작
}
function applyFontSizes() {
    const questionText = document.getElementById('main-question-text');
    const instructionText = document.getElementById('main-instruction-text');

    // 현재 단계에 맞는 폰트 크기 계산
    const newQuestionSize = baseSizes.question + (currentFontSizeStep * stepAmount);
    const newInstructionSize = baseSizes.instruction + (currentFontSizeStep * stepAmount);

    // 계산된 크기 적용
    if (questionText) questionText.style.fontSize = `${newQuestionSize}px`;
    if (instructionText) instructionText.style.fontSize = `${newInstructionSize}px`;
    
    console.log(`[Font Size] 현재 단계: ${currentFontSizeStep}`);
}
// --- 3. Gemini Live 연결 ---
async function main() {
  console.log('🚀 [Gemini Live] API 호출 시작...');
  console.log('📋 [Gemini Live] 모델:', model);
  
  try {
    currentSession = await ai.live.connect({
      model: model,
      callbacks: {
        onopen: function () {
          console.log('✅ [Gemini Live] 연결 성공 (Opened)');
          // setupComplete 메시지를 받은 후 첫인사를 트리거하도록 변경
        },

        // onmessage: JSON을 파싱하여 'speech' 부분만 말하기
        onmessage: function (message) {
          console.log('📨 [Gemini Live] 메시지 수신:', message);
          
          const serverContent = message?.serverContent;

          // 1. 텍스트가 있으면 버퍼에 '누적'
          if (serverContent?.modelTurn && serverContent.modelTurn.parts) {
            for (const part of serverContent.modelTurn.parts) {
              if (part.text) { 
                fullResponseText += part.text;
                console.log('🔄 [Gemini Live] 텍스트 누적:', part.text);
              }
            }
          }

          // 2. 턴이 완료되었다는 신호를 확인
          if (serverContent?.turnComplete) {
            console.log('✅ [Gemini Live] 턴 완료');
            
            const finalResponse = fullResponseText.trim();
            fullResponseText = ''; // 버퍼 즉시 초기화

            if (finalResponse.startsWith('JSON_RESPONSE:')) {
              try {
                const jsonString = finalResponse.substring('JSON_RESPONSE:'.length);
                const responseData = JSON.parse(jsonString);

                console.log('🤖 [AI Action]:', responseData.action, responseData);

                // 1. AI 응답 말하기 (공통)
                if (responseData.speech) {
                  speak(responseData.speech);
                }

                // 2. Action별 처리
                if (responseData.action === 'GREETING') {
                  // 첫 화면: 매장/포장 선택 대기
                  console.log('👂 [App] 매장/포장 선택 대기 중...');
                }

                if (responseData.action === 'PROMPT_FOR_MENU') {
                  // 메뉴 화면 진입: 메뉴명 또는 "메뉴" 입력 대기
                  console.log('👂 [App] 메뉴명 입력 대기 중...');
                }

                if (responseData.action === 'EXPLORING_MENU') {
                  // 메뉴 탐색 완료: 메뉴명 입력 대기
                  console.log('👂 [App] 메뉴명 입력 대기 중...');
                }

                if (responseData.action === 'PROMPT_FOR_SPECIFIC_MENU') {
                  // 카테고리 선택 후 특정 메뉴명 입력 대기
                  console.log('👂 [App] 특정 메뉴명 입력 대기 중...');
                }
                
                if (responseData.action === 'GUIDING_STEP_BY_STEP' || responseData.action === 'AWAITING_CONFIRMATION') {
                  // 사용자의 "네", "눌렀어요" 등의 확인 입력을 기다림
                  console.log('👂 [App] 사용자 확인 대기 중...');
                }

                if (responseData.action === 'GUIDANCE_COMPLETE') {
                  // 안내 완료, 다음 메뉴 안내 또는 결제 대기
                  console.log('✅ [App] 안내 완료. 다음 단계 대기 중...');
                }

                if (responseData.action === 'GUIDANCE_CANCELLED') {
                  // 현재 안내 취소, 초기 상태로 복귀
                  console.log('🛑 [App] 안내 취소됨. 초기 상태로 복귀.');
                  // AI가 스스로 초기 상태로 돌아가므로 특별한 처리는 필요 없음
                }

                if (responseData.action === 'REFOCUS_USER') {
                  // 사용자를 현재 작업에 다시 집중시키기
                  console.log('🔄 [App] 사용자 재집중 요청. 현재 안내 계속 진행.');
                  // AI가 스스로 직전 안내를 반복하므로 특별한 처리는 필요 없음
                }

                if (responseData.action === 'CHECKOUT') {
                  // 결제 진행
                  console.log('💳 [App] 결제 진행. 결제 안내 완료 후 세션 유지.');
                  // 결제 안내 후에도 음성 인식은 계속 유지 (추가 주문 가능)
                  // 필요시 결제 페이지로 이동하는 로직 추가 가능
                  // setTimeout(() => { window.location.href = '/payment'; }, 3000);
                }

                if (responseData.action === 'REPEATING_LAST_STEP') {
                  // 현재 안내 단계 재설명
                  console.log('🔄 [App] 사용자 재요청. 현재 안내 단계 반복.');
                  // AI가 스스로 직전 안내를 반복하므로 특별한 처리는 필요 없음
                }

                if (responseData.action === 'PROVIDING_DESCRIPTION') {
                  // 메뉴 설명 제공
                  console.log('📖 [App] 메뉴 설명 제공 중.');
                  // AI가 스스로 설명을 제공하므로 특별한 처리는 필요 없음
                }

              } catch (e) {
                console.error('❌ [App] AI 응답 JSON 파싱 실패:', e, finalResponse);
                speak('안내 중 오류가 발생했습니다. 다시 말씀해주세요.');
              }
            } else if (finalResponse.length > 0) {
              // (JSON 형식이 아닌 예외/디버그 응답 처리)
              console.warn('⚠️ [App] AI가 JSON 형식이 아닌 응답을 보냈습니다:', finalResponse);
              speak(finalResponse); // 일단 그대로 말하기
            }
          }
          
          // 텍스트가 아닌 메시지 (예: setupComplete 등)
          if (message.setupComplete) {
              console.log('ℹ️ [Gemini Live] Setup 완료 메시지 수신', message);
              
              // Setup 완료 후 첫인사를 트리거
              setTimeout(() => {
                try {
                  if (currentSession) {
                    console.log('👋 [Gemini Live] AI의 첫인사를 트리거합니다.');
                    currentSession.sendClientContent({
                      turns: [{
                        role: 'user',
                        parts: [{ text: " " }] // 공백으로 첫인사를 트리거
                      }],
                      turnComplete: true
                    });
                  }
                } catch (error) {
                  console.error('❌ [Gemini Live] 초기 인사말 트리거 실패:', error);
                }
              }, 500); // 약간의 지연을 두어 안정성 확보
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
      isRecognitionActive = false;
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
  console.log('📄 [Voice Guide] 페이지 로드 완료');

  // --- 1. 가운데 음성 아이콘 설정 ---
  const voiceMicIcon = document.querySelector('.voice-mic-icon');
  if (voiceMicIcon) {
    console.log('✅ [Voice Guide] 음성 아이콘 요소 찾음');

    if (!recognition) {
      voiceMicIcon.style.opacity = '0.5';
      voiceMicIcon.style.cursor = 'not-allowed';
      console.error('❌ [Voice Guide] 음성 인식이 지원되지 않아 아이콘을 비활성화합니다.');
      return;
    }

    voiceMicIcon.addEventListener('click', async () => {
      console.log('🖱️ [Voice Guide] 음성 아이콘 클릭됨');

      // --- 1. 이미 활성화된 상태면 세션 종료 ---
      if (isVoiceActive && currentSession) {
        console.log('🛑 [Voice Guide] 음성 안내 종료');
        isVoiceActive = false;
        closeSession();
        voiceMicIcon.style.opacity = '1.0';
        return;
      }

      // --- 2. 새 세션 시작 ---
      if (!currentSession) {
        console.log('🔄 [Voice Guide] 새 세션 시작');
        isVoiceActive = true;
        await main(); 
        if (!currentSession) {
          console.error('❌ [Voice Guide] 세션 생성에 실패');
          isVoiceActive = false;
          return;
        }
        // AI가 프롬프트에 따라 스스로 첫인사를 합니다.
        // speak() 호출을 제거하여 AI의 첫인사와 겹치지 않도록 합니다.
      } else {
        // --- 3. 이미 세션은 있지만 마이크만 켤 때 ---
        isVoiceActive = true;
        if (synthesis.speaking) {
          synthesis.cancel(); 
          console.log('🔇 [TTS] 사용자가 응답을 중단시킴');
    } else {
          startRecognitionSafely();
        }
      }
    }); // <-- voiceMicIcon click 이벤트 종료

    voiceMicIcon.style.cursor = 'pointer';
    voiceMicIcon.style.transition = 'opacity 0.3s, transform 0.3s';
    console.log('✅ [Voice Guide] 클릭 이벤트 리스너 등록 완료');
 
  } else { 
    console.error('❌ [Voice Guide] 음성 아이콘 요소를 찾을 수 없음');
  }

  // --- 2. 세션 종료 설정 ---
  window.addEventListener('beforeunload', () => {
    closeSession();
  });

  // --- 3. 모달 관련 코드 ---
  console.log('✅ [Voice Guide] 모달 이벤트 리스너 등록 시작');
   
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
      speechRate = [0.8, 1.2, 1.8][index]; 
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

  console.log('✅ [Voice Guide] 모달 이벤트 리스너 등록 완료');
  // --- 글자 크기 조절 버튼 이벤트 ---
    const fontIncreaseBtn = document.getElementById('font-increase-btn');
    const fontDecreaseBtn = document.getElementById('font-decrease-btn');

    if (fontIncreaseBtn) {
        fontIncreaseBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 부모 요소(마이크) 클릭 방지
            if (currentFontSizeStep < maxStep) {
                currentFontSizeStep++;
                applyFontSizes();
            }
        });
    }

    if (fontDecreaseBtn) {
        fontDecreaseBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 부모 요소(마이크) 클릭 방지
            if (currentFontSizeStep > minStep) {
                currentFontSizeStep--;
                applyFontSizes();
            }
        });
    }
  // --- 4. 음성안내 종료 버튼 ---
  const exitVoiceGuideBtn = document.getElementById('exitVoiceGuideBtn');
  if (exitVoiceGuideBtn) {
    exitVoiceGuideBtn.addEventListener('click', () => {
      console.log('🛑 [Voice Guide] 음성안내 종료 버튼 클릭');
      isVoiceActive = false;
      closeSession();
      const icon = document.querySelector('.voice-mic-icon');
      if (icon) icon.style.opacity = '1.0';
    });
  }
}); // <-- DOMContentLoaded 닫는 괄호
