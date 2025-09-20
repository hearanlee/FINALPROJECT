// API 통신을 위한 유틸리티 클래스
class APIClient {
    constructor(baseURL = 'http://localhost:8000') {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API 요청 실패:', error);
            throw error;
        }
    }

    // 카테고리 조회
    async getCategories() {
        return this.request('/categories');
    }

    // 특정 카테고리의 메뉴 조회
    async getMenuByCategory(categoryId) {
        return this.request(`/categories/${categoryId}/menu`);
    }

    // 메뉴 상세 정보 조회 (옵션 포함)
    async getMenuDetail(itemId) {
        return this.request(`/menu/${itemId}`);
    }

    // 옵션 타입별 옵션 조회
    async getOptionsByType(optionType) {
        return this.request(`/options/${optionType}`);
    }

    // 주문 생성
    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    // 음성 안내 텍스트 조회
    async getVoiceGuideText() {
        return this.request('/voice-guide/text');
    }

    // 음성 안내 데이터 조회
    async getVoiceGuide() {
        return this.request('/voice-guide');
    }
}

// 전역 API 클라이언트 인스턴스
const apiClient = new APIClient();
