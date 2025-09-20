// 메뉴 페이지 JavaScript
let categories = [];
let menuItems = {};

document.addEventListener('DOMContentLoaded', async function() {
    await loadCategories();
    await loadMenuItems();
    setupEventListeners();
});

async function loadCategories() {
    try {
        categories = await apiClient.getCategories();
        console.log('카테고리 로드 완료:', categories);
    } catch (error) {
        console.error('카테고리 로드 실패:', error);
        // 기본 카테고리 사용
        categories = [
            { id: 1, name: '쌀국수', display_name: '쌀국수' },
            { id: 2, name: '돈카츠,카레', display_name: '돈카츠,카레' },
            { id: 3, name: '1인정식', display_name: '1인정식' },
            { id: 4, name: '사이드&추가메뉴', display_name: '사이드&추가메뉴' }
        ];
    }
}

async function loadMenuItems() {
    try {
        for (const category of categories) {
            const items = await apiClient.getMenuByCategory(category.id);
            menuItems[category.id] = items;
        }
        console.log('메뉴 아이템 로드 완료:', menuItems);
        renderMenuItems();
    } catch (error) {
        console.error('메뉴 아이템 로드 실패:', error);
    }
}

function renderMenuItems() {
    const menuContainer = document.getElementById('menuItems');
    if (!menuContainer) return;

    // 기존 메뉴 섹션 제거
    menuContainer.innerHTML = '';

    categories.forEach(category => {
        const section = document.createElement('div');
        section.className = 'menu-section';
        section.id = category.name;
        section.style.display = 'none';

        const items = menuItems[category.id] || [];
        section.innerHTML = items.map(item => `
            <div class="menu-item">
                <div class="item-image">${getItemEmoji(item.name)}</div>
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>${item.description || ''}</p>
                    <span class="price">${item.price.toLocaleString()}원</span>
                </div>
                <button class="order-btn" onclick="addToOrder(${item.id}, '${item.name}', ${item.price})">주문</button>
            </div>
        `).join('');

        menuContainer.appendChild(section);
    });

    // 첫 번째 카테고리 활성화
    if (categories.length > 0) {
        const firstCategory = document.querySelector(`[data-category="${categories[0].name}"]`);
        if (firstCategory) {
            firstCategory.click();
        }
    }
}

function setupEventListeners() {
    const categoryElements = document.querySelectorAll('.category');
    const menuSections = document.querySelectorAll('.menu-section');
    
    // 카테고리 클릭 이벤트
    categoryElements.forEach(category => {
        category.addEventListener('click', function() {
            const categoryType = this.getAttribute('data-category');
            
            // 모든 카테고리에서 active 클래스 제거
            categoryElements.forEach(cat => cat.classList.remove('active'));
            // 클릭된 카테고리에 active 클래스 추가
            this.classList.add('active');
            
            // 모든 메뉴 섹션 숨기기
            menuSections.forEach(section => {
                section.style.display = 'none';
            });
            
            // 선택된 카테고리의 메뉴 섹션 보이기
            const targetSection = document.getElementById(categoryType);
            if (targetSection) {
                targetSection.style.display = 'grid';
            }
        });
    });
}

function getItemEmoji(itemName) {
    const emojiMap = {
        '쌀국수': '🍜',
        '돈카츠': '🍖',
        '카레': '🍛',
        '정식': '🍱',
        '사이드': '🥗'
    };
    
    for (const [key, emoji] of Object.entries(emojiMap)) {
        if (itemName.includes(key)) {
            return emoji;
        }
    }
    return '🍽️';
}

// 주문에 추가하는 함수
async function addToOrder(itemId, itemName, price) {
    try {
        // 메뉴 상세 정보 조회 (옵션 포함)
        const menuDetail = await apiClient.getMenuDetail(itemId);
        
        if (menuDetail.available_options && menuDetail.available_options.length > 0) {
            // 옵션이 있는 경우 옵션 선택 모달 표시
            showOptionModal(menuDetail);
        } else {
            // 옵션이 없는 경우 바로 주문에 추가
            addItemToOrder(itemId, itemName, price, []);
        }
    } catch (error) {
        console.error('메뉴 상세 정보 조회 실패:', error);
        // 오류 시 기본 방식으로 주문에 추가
        addItemToOrder(itemId, itemName, price, []);
    }
}

function addItemToOrder(itemId, itemName, price, selectedOptions) {
    // 로컬 스토리지에서 기존 주문 목록 가져오기
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // 새 아이템 추가
    const newItem = {
        id: itemId,
        name: itemName,
        price: price,
        quantity: 1,
        options: selectedOptions,
        totalPrice: price + selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
    };
    
    // 같은 아이템이 이미 있는지 확인 (옵션까지 고려)
    const existingItem = orders.find(item => 
        item.id === itemId && 
        JSON.stringify(item.options) === JSON.stringify(selectedOptions)
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice = existingItem.price * existingItem.quantity + 
            existingItem.options.reduce((sum, opt) => sum + opt.price * opt.quantity, 0);
    } else {
        orders.push(newItem);
    }
    
    // 로컬 스토리지에 저장
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // 사용자에게 피드백 제공
    showOrderFeedback(itemName);
}

function showOptionModal(menuDetail) {
    // 옵션 선택 모달 생성
    const modal = document.createElement('div');
    modal.className = 'option-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${menuDetail.name}</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <p>가격: ${menuDetail.price.toLocaleString()}원</p>
                <div class="options">
                    <h4>옵션 선택</h4>
                    ${menuDetail.available_options.map(option => `
                        <label class="option-item">
                            <input type="checkbox" value="${option.id}" data-price="${option.price}">
                            <span>${option.name} (+${option.price.toLocaleString()}원)</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn secondary" onclick="closeOptionModal()">취소</button>
                <button class="btn primary" onclick="confirmOptionSelection(${menuDetail.id}, '${menuDetail.name}', ${menuDetail.price})">주문담기</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 닫기 버튼 이벤트
    modal.querySelector('.close').onclick = closeOptionModal;
    modal.onclick = function(e) {
        if (e.target === modal) closeOptionModal();
    };
}

function closeOptionModal() {
    const modal = document.querySelector('.option-modal');
    if (modal) {
        modal.remove();
    }
}

function confirmOptionSelection(itemId, itemName, basePrice) {
    const checkboxes = document.querySelectorAll('.option-modal input[type="checkbox"]:checked');
    const selectedOptions = Array.from(checkboxes).map(cb => ({
        option_id: parseInt(cb.value),
        quantity: 1,
        price: parseInt(cb.dataset.price)
    }));
    
    addItemToOrder(itemId, itemName, basePrice, selectedOptions);
    closeOptionModal();
}

// 주문 피드백 표시
function showOrderFeedback(itemName) {
    // 기존 피드백 제거
    const existingFeedback = document.querySelector('.order-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // 새 피드백 생성
    const feedback = document.createElement('div');
    feedback.className = 'order-feedback';
    feedback.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #28a745;
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            font-size: 1.2em;
            font-weight: bold;
        ">
            ${itemName}이(가) 주문에 추가되었습니다! 🎉
        </div>
    `;
    
    document.body.appendChild(feedback);
    
    // 2초 후 피드백 제거
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

// 홈으로 돌아가기
function goBack() {
    window.location.href = 'index.html';
}

// 주문 페이지로 이동
function goToOrder() {
    window.location.href = 'order.html';
}
