// 기존 my_info.js 파일 전체를 아래 코드로 교체해주세요.

document.addEventListener('DOMContentLoaded', function() {

    // 1. 필요한 HTML 요소들을 모두 찾습니다.
    const mobileContainer = document.querySelector('.mobile-container'); // 글자 크기 적용 대상
    
    // (A) 글자 크기 관련 요소들
    const fontSizeBtn = document.getElementById('fontSizeBtn');
    const fontSizeModal = document.getElementById('fontSizeModal');
    
    // (B) 음성 속도 관련 요소들
    const speedBtn = document.getElementById('speedBtn');
    const speedModal = document.getElementById('speedModal');
    
    // (C) 공통 모달 제어 요소들
    const overlay = document.querySelector('.modal-overlay');
    const closeButtons = document.querySelectorAll('.close-button');

    // 2. 모달을 여는 공통 함수
    function openModal(modal) {
        if (modal) {
            modal.classList.add('active');
            overlay.classList.add('active');
        }
    }

    // 3. 모달을 닫는 공통 함수
    function closeModal() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        overlay.classList.remove('active');
    }

    // 4. 각 버튼과 요소에 클릭 이벤트를 연결합니다.
    if (fontSizeBtn) {
        fontSizeBtn.addEventListener('click', () => openModal(fontSizeModal));
    }
    if (speedBtn) {
        speedBtn.addEventListener('click', () => openModal(speedModal));
    }

    closeButtons.forEach(button => button.addEventListener('click', closeModal));
    overlay.addEventListener('click', closeModal);

    // 5. 글자 크기 조절 슬라이더 기능 (새로 추가된 핵심 기능)
    const fontPoints = document.querySelectorAll('#fontSizeModal .slider-point');
    fontPoints.forEach((point, index) => {
        point.addEventListener('click', function() {
            // 모든 포인트와 라벨의 'active' 스타일을 먼저 제거
            fontPoints.forEach(p => p.classList.remove('active'));
            document.querySelectorAll('#fontSizeModal .label-item').forEach(l => l.classList.remove('active'));

            // 클릭된 포인트와 라벨에 'active' 스타일 적용
            this.classList.add('active');
            document.querySelectorAll('#fontSizeModal .label-item')[index].classList.add('active');

            // 기존 글자 크기 클래스를 모두 제거
            mobileContainer.classList.remove('font-size-small', 'font-size-normal', 'font-size-large');

            // 선택된 크기에 맞는 새 클래스를 추가
            if (index === 0) { // 작게
                mobileContainer.classList.add('font-size-small');
            } else if (index === 1) { // 보통
                mobileContainer.classList.add('font-size-normal');
            } else { // 크게
                mobileContainer.classList.add('font-size-large');
            }

            // 0.2초 후 모달 닫기
            setTimeout(closeModal, 200);
        });
    });

    // 6. 음성 속도 조절 슬라이더 기능 (기존과 동일)
    const speedPoints = document.querySelectorAll('#speedModal .slider-point');
    speedPoints.forEach((point, index) => {
        point.addEventListener('click', function() {
            speedPoints.forEach(p => p.classList.remove('active'));
            document.querySelectorAll('#speedModal .label-item').forEach(l => l.classList.remove('active'));
            
            this.classList.add('active');
            document.querySelectorAll('#speedModal .label-item')[index].classList.add('active');
            
            setTimeout(closeModal, 200);
        });
    });
});