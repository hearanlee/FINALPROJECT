// 1. 필요한 HTML 요소들을 미리 찾아놓습니다.
const restaurantItems = document.querySelectorAll('.restaurant-item');

// 2. 음식점 목록 각각에 클릭 이벤트를 달아줍니다.
restaurantItems.forEach(function(item) {
    item.addEventListener('click', function() {
        // 일단 모든 목록의 'selected' 스타일을 제거합니다.
        restaurantItems.forEach(i => i.classList.remove('selected'));
        
        // 그리고 방금 클릭한 목록에만 'selected' 스타일을 추가합니다.
        item.classList.add('selected');
    });
});

// '음식점 확인하기' 버튼 기능은 나중에 추가할 수 있습니다.
const confirmButton = document.getElementById('confirmBtn');
if (confirmButton) {
    confirmButton.addEventListener('click', function() {
        // restaurant_detail.html 페이지로 이동합니다.
        window.location.href = 'restaurant_detail.html';
    });
}