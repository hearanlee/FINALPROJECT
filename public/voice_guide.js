// 1. 필요한 HTML 요소들을 모두 찾습니다.
const speedBtn = document.getElementById('speedBtn');
const repeatBtn = document.getElementById('repeatBtn');

const speedModal = document.getElementById('speedModal');
const repeatModal = document.getElementById('repeatModal');

const overlay = document.querySelector('.modal-overlay');
const closeButtons = document.querySelectorAll('.close-button');

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

// 4. 각 버튼에 클릭 이벤트를 연결합니다.
speedBtn.addEventListener('click', () => openModal(speedModal));
repeatBtn.addEventListener('click', () => openModal(repeatModal));

// 모든 닫기 버튼에 클릭 이벤트를 연결합니다.
closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
});

// 뒷배경을 클릭해도 닫히도록 이벤트를 연결합니다.
overlay.addEventListener('click', closeModal);