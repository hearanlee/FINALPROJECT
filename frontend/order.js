// 주문 페이지 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadOrderItems();
});

// 주문 아이템 로드
function loadOrderItems() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderItemsContainer = document.getElementById('orderItems');
    const orderSummary = document.getElementById('orderSummary');
    
    if (orders.length === 0) {
        // 주문이 없는 경우
        orderItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <h3>주문 목록이 비어있습니다</h3>
                <p>메뉴에서 원하는 음식을 선택해주세요</p>
                <button class="btn menu" onclick="goToMenu()">메뉴 보러가기</button>
            </div>
        `;
        orderSummary.style.display = 'none';
    } else {
        // 주문이 있는 경우
        displayOrderItems(orders);
        displayOrderSummary(orders);
        orderSummary.style.display = 'block';
    }
}

// 주문 아이템 표시
function displayOrderItems(orders) {
    const orderItemsContainer = document.getElementById('orderItems');
    
    orderItemsContainer.innerHTML = orders.map(item => {
        const optionsText = item.options && item.options.length > 0 
            ? `<div class="item-options">옵션: ${item.options.map(opt => opt.name).join(', ')}</div>`
            : '';
        
        return `
            <div class="order-item" data-id="${item.id}">
                <div class="item-image">${getItemEmoji(item.name)}</div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    ${optionsText}
                    <div class="item-price">${(item.totalPrice || item.price).toLocaleString()}원</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity(${item.id})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem(${item.id})">삭제</button>
            </div>
        `;
    }).join('');
}

// 주문 요약 표시
function displayOrderSummary(orders) {
    const summaryItems = document.getElementById('summaryItems');
    const totalQuantity = document.getElementById('totalQuantity');
    const totalPrice = document.getElementById('totalPrice');
    
    let totalQty = 0;
    let totalAmount = 0;
    
    summaryItems.innerHTML = orders.map(item => {
        const itemTotal = item.totalPrice || (item.price * item.quantity);
        totalQty += item.quantity;
        totalAmount += itemTotal;
        
        const optionsText = item.options && item.options.length > 0 
            ? `<div class="summary-options">(${item.options.map(opt => opt.name).join(', ')})</div>`
            : '';
        
        return `
            <div class="summary-item">
                <div class="item-summary-info">
                    <span class="item-summary-name">${item.name}</span>
                    ${optionsText}
                </div>
                <span class="item-summary-quantity">x${item.quantity}</span>
                <span class="item-summary-price">${itemTotal.toLocaleString()}원</span>
            </div>
        `;
    }).join('');
    
    totalQuantity.textContent = totalQty;
    totalPrice.textContent = totalAmount.toLocaleString() + '원';
}

// 아이템 이모지 반환
function getItemEmoji(itemName) {
    const emojiMap = {
        '스테이크': '🍖',
        '파스타': '🍝',
        '피자': '🍕',
        '감자튀김': '🍟',
        '시저샐러드': '🥗',
        '콜라': '🥤',
        '아메리카노': '☕',
        '치즈케이크': '🍰',
        '아이스크림': '🍨'
    };
    return emojiMap[itemName] || '🍽️';
}

// 수량 증가
function increaseQuantity(itemId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const item = orders.find(order => order.id === itemId);
    
    if (item) {
        item.quantity += 1;
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrderItems();
    }
}

// 수량 감소
function decreaseQuantity(itemId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const item = orders.find(order => order.id === itemId);
    
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrderItems();
    }
}

// 아이템 삭제
function removeItem(itemId) {
    if (confirm('이 아이템을 주문에서 제거하시겠습니까?')) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const filteredOrders = orders.filter(order => order.id !== itemId);
        localStorage.setItem('orders', JSON.stringify(filteredOrders));
        loadOrderItems();
    }
}

// 주문 초기화
function clearOrder() {
    if (confirm('모든 주문을 초기화하시겠습니까?')) {
        localStorage.removeItem('orders');
        loadOrderItems();
    }
}

// 주문 확인
async function confirmOrder() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    if (orders.length === 0) {
        alert('주문할 아이템이 없습니다.');
        return;
    }
    
    const totalAmount = orders.reduce((sum, item) => sum + (item.totalPrice || (item.price * item.quantity)), 0);
    const totalQuantity = orders.reduce((sum, item) => sum + item.quantity, 0);
    
    const orderDetails = orders.map(item => {
        const itemTotal = item.totalPrice || (item.price * item.quantity);
        const optionsText = item.options && item.options.length > 0 
            ? ` (옵션: ${item.options.map(opt => opt.name).join(', ')})` 
            : '';
        return `${item.name} x${item.quantity}${optionsText} (${itemTotal.toLocaleString()}원)`;
    }).join('\n');
    
    const confirmMessage = `주문을 확인하시겠습니까?\n\n${orderDetails}\n\n총 수량: ${totalQuantity}개\n총 금액: ${totalAmount.toLocaleString()}원`;
    
    if (confirm(confirmMessage)) {
        try {
            // 백엔드로 주문 전송
            const orderData = {
                items: orders.map(item => ({
                    menu_item_id: item.id,
                    quantity: item.quantity,
                    options: item.options || []
                }))
            };
            
            const response = await apiClient.createOrder(orderData);
            
            // 주문 완료 처리
            alert(`주문이 완료되었습니다! 주문번호: ${response.order_number}\n총 금액: ${response.total_amount.toLocaleString()}원\n감사합니다. 🎉`);
            
            // 주문 초기화
            localStorage.removeItem('orders');
            loadOrderItems();
        } catch (error) {
            console.error('주문 생성 실패:', error);
            alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    }
}

// 홈으로 돌아가기
function goBack() {
    window.location.href = 'index.html';
}

// 메뉴 페이지로 이동
function goToMenu() {
    window.location.href = 'menu.html';
}
