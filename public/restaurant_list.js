document.addEventListener('DOMContentLoaded', function() {
    
    // 1. 필요한 HTML 요소들을 모두 찾습니다.
    const confirmBtn = document.querySelector('.confirm-btn');
    const items = document.querySelectorAll('.restaurant-item');
    let selectedItem = null; // 사용자가 선택한 식당을 저장할 변수

    // --- 모달 관련 요소들 ---
    const detailModal = document.getElementById('restaurantDetailModal');
    const overlay = document.querySelector('.modal-overlay');
    
    // 모달을 닫는 모든 종류의 버튼을 찾습니다 (X 버튼, '뒤로 가기' 버튼)
    const closeButtons = document.querySelectorAll('.close-button, .close-modal-btn');

    // --- 모달 내부의 텍스트 요소들 ---
    const modalStoreName = document.getElementById('modalStoreName');
    const modalStoreAddress = document.getElementById('modalStoreAddress');
    const modalStoreRating = document.getElementById('modalStoreRating');

    // 2. 식당 목록 아이템 클릭 이벤트 (선택 효과)
    items.forEach(item => {
        item.addEventListener('click', function() {
            // 다른 아이템에 있던 'selected' 효과를 모두 제거
            items.forEach(i => i.classList.remove('selected'));
            
            // 지금 클릭한 아이템에만 'selected' 효과 추가
            this.classList.add('selected');
            selectedItem = this; // 선택된 아이템을 변수에 저장
        });
    });

    // 3. 모달을 여는/닫는 공통 함수
    function openModal(modal) {
        if (modal) {
            modal.classList.add('active');
            overlay.classList.add('active');
        }
    }

    function closeModal() {
        if (detailModal) {
            detailModal.classList.remove('active');
        }
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    // 4. 모달 닫기 이벤트 연결 (X 버튼, '뒤로 가기' 버튼, 뒷배경)
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    // 5. "음식점 확인하기" 버튼 클릭 이벤트 (핵심!)
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            // 사용자가 식당을 선택했는지 확인
            if (selectedItem) {
                // 1. 선택된 아이템에서 식당 정보를 추출합니다.
                const name = selectedItem.querySelector('.restaurant-name').textContent;
                const address = selectedItem.querySelector('.restaurant-address').textContent;
                const rating = selectedItem.querySelector('.restaurant-rating').textContent;

                // 2. 모달 내부의 텍스트를 추출한 정보로 변경합니다.
                if (modalStoreName) modalStoreName.textContent = name;
                if (modalStoreAddress) modalStoreAddress.textContent = address;
                if (modalStoreRating) modalStoreRating.textContent = rating;

                // 3. 페이지 이동 대신, 모달을 엽니다.
                openModal(detailModal);

            } else {
                // 아무것도 선택하지 않았다면 경고창을 띄웁니다.
                alert('음식점을 먼저 선택해주세요.');
            }
        });
    }
});