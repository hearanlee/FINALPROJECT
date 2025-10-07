// --- menu.js 파일의 전체 내용 ---

// 1. 필요한 HTML 요소들을 미리 찾아놓습니다.
const choiceButtons = document.querySelectorAll('.choice-button'); // '선택 버튼' 들을 모두 찾습니다.
const nextButton = document.getElementById('nextBtn'); // '다음 단계' 버튼을 찾습니다.

// 2. '선택 버튼' 각각에 클릭 이벤트를 달아줍니다.
choiceButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        // 일단 모든 버튼의 'selected' 스타일을 제거합니다.
        choiceButtons.forEach(b => b.classList.remove('selected'));

        // 그리고 방금 클릭한 이 버튼에만 'selected' 스타일을 추가합니다.
        button.classList.add('selected');
    });
});

// 3. '다음 단계' 버튼의 클릭 기능은 그대로 유지합니다.
nextButton.addEventListener('click', function() {
    // (나중에는 여기에 어떤 버튼을 선택했는지 확인하는 코드를 추가할 수 있습니다.)
    window.location.href = 'menu_step4.html';
});