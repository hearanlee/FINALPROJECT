const express = require('express');
const cors = require('cors');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// OpenAI 클라이언트 설정
const openai = new OpenAI({
    apiKey: process.env.GITHUB_PAT,
    baseURL: process.env.AZURE_AI_ENDPOINT || "https://models.github.ai/inference",
});

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Favicon handler to avoid 404s when the browser requests /favicon.ico
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'images', 'chef-hat.png'));
});

// 메뉴 데이터를 가져오는 함수
async function getMenuData() {
    try {
        const response = await fetch('http://localhost:8000/api/menus');
        if (!response.ok) {
            console.log('메뉴 API 호출 실패, 기본 메뉴 정보 사용');
            return getDefaultMenuData();
        }
        const data = await response.json();
        console.log('실제 DB에서 메뉴 데이터를 가져왔습니다:', data.menus.length, '개 메뉴');
        return data;
    } catch (error) {
        console.log('메뉴 데이터 가져오기 실패, 기본 메뉴 정보 사용:', error.message);
        return getDefaultMenuData();
    }
}

// 기본 메뉴 데이터 (백엔드가 없을 때 사용) - 실제 DB 데이터와 일치
function getDefaultMenuData() {
    return {
        menus: [
            // 쌀국수 카테고리
            {
                id: 1,
                name: "차돌양지쌀국수",
                category: "쌀국수",
                price: 9900,
                description: "부드러운 차돌박이와 양지가 들어간 쌀국수"
            },
            {
                id: 2,
                name: "한우쌀국수",
                category: "쌀국수", 
                price: 10900,
                description: "한우 사골국물에 담근 쌀국수"
            },
            {
                id: 3,
                name: "모듬 쌀국수",
                category: "쌀국수",
                price: 11900,
                description: "차돌박이, 양지, 한우가 모두 들어간 쌀국수"
            },
            // 돈카츠,카레 카테고리
            {
                id: 4,
                name: "프리미엄 로스카츠(등심)",
                category: "돈카츠,카레",
                price: 11900,
                description: "등심 부위의 프리미엄 돈카츠"
            },
            {
                id: 5,
                name: "프리미엄 히레츠(안심)",
                category: "돈카츠,카레",
                price: 12900,
                description: "안심 부위의 프리미엄 돈카츠"
            },
            {
                id: 6,
                name: "통모짜치즈돈카츠",
                category: "돈카츠,카레",
                price: 12900,
                description: "통모짜치즈가 들어간 돈카츠"
            },
            {
                id: 7,
                name: "시그니처 경양식돈카츠",
                category: "돈카츠,카레",
                price: 11900,
                description: "경양식 스타일의 시그니처 돈카츠"
            },
            {
                id: 8,
                name: "모듬카츠A[등심+안심]",
                category: "돈카츠,카레",
                price: 13900,
                description: "등심과 안심이 함께 들어간 모듬카츠"
            },
            {
                id: 9,
                name: "모듬카츠B[등심+치즈]",
                category: "돈카츠,카레",
                price: 13900,
                description: "등심과 치즈가 함께 들어간 모듬카츠"
            },
            {
                id: 10,
                name: "등심카츠 카레라이스",
                category: "돈카츠,카레",
                price: 10900,
                description: "등심카츠와 카레라이스"
            },
            {
                id: 11,
                name: "안심카츠 카레라이스",
                category: "돈카츠,카레",
                price: 12900,
                description: "안심카츠와 카레라이스"
            },
            {
                id: 12,
                name: "통모짜치즈 카레라이스",
                category: "돈카츠,카레",
                price: 12900,
                description: "통모짜치즈와 카레라이스"
            },
            // 1인정식 카테고리
            {
                id: 13,
                name: "정식A(쌀국수S+경양식)",
                category: "1인정식",
                price: 11900,
                description: "쌀국수와 경양식돈카츠가 함께 나오는 정식"
            },
            {
                id: 14,
                name: "정식B(쌀국수S+등심)",
                category: "1인정식",
                price: 10900,
                description: "쌀국수와 등심카츠가 함께 나오는 정식"
            },
            {
                id: 15,
                name: "정식C(쌀국수S+안심)",
                category: "1인정식",
                price: 12900,
                description: "쌀국수와 안심카츠가 함께 나오는 정식"
            },
            {
                id: 16,
                name: "정식D(쌀국수S+치즈)",
                category: "1인정식",
                price: 12900,
                description: "쌀국수와 치즈카츠가 함께 나오는 정식"
            }
        ]
    };
}

// GPT API 엔드포인트 (메인)
app.post('/api/chat', async (req, res) => {
    try {
        const { message, model = 'gpt-3.5-turbo' } = req.body;

        if (!message) {
            return res.status(400).json({ error: '메시지가 필요합니다.' });
        }

        // 토큰 확인
        if (!process.env.GITHUB_PAT || process.env.GITHUB_PAT === 'your_github_pat_here') {
            return res.status(401).json({ 
                error: 'GPT API 토큰이 설정되지 않았습니다.',
                message: 'GITHUB_PAT 환경변수를 .env 파일에 설정해주세요.',
                details: '토큰을 설정하려면 .env 파일에서 GITHUB_PAT=your_actual_token_here로 변경하세요.'
            });
        }

        // 메뉴 데이터 가져오기
        const menuData = await getMenuData();
        
        // 메뉴 정보를 문자열로 변환
        const menuInfo = menuData.menus.map(menu => 
            `- ${menu.name} (${menu.category}): ${menu.price.toLocaleString()}원 - ${menu.description}`
        ).join('\n');

               const systemPrompt = `당신은 음식점의 키오스크 음성 안내 도우미입니다. 고객의 질문에 대해 도움을 드리고, 메뉴를 추천해드립니다.

현재 메뉴 정보:
${menuInfo}

메뉴 카테고리: 쌀국수, 돈카츠/카레, 1인정식

답변 규칙:
1. 메뉴명, 옵션, 주문절차는 위의 메뉴 정보를 바탕으로 정확하게 답변하세요
2. 음성으로 읽을 때는 **볼드 처리된 텍스트**는 읽지 마세요 (예: **차돌양지쌀국수** → 차돌양지쌀국수)
3. 숫자 대신 한글로 말하세요 (1,2,3 → 첫번째, 두번째, 세번째)
4. 가격은 만원 단위로 자연스럽게 말하세요 (9900원 → 구천구백원, 18000원 → 만팔천원, 16000원 → 만육천원, 15000원 → 만오천원)
5. 음성 대화를 위해 간결하고 명확하게 답변하세요
6. 애매한 메뉴명이면 정확한 메뉴명을 요청하세요
7. 특정 메뉴명을 말하면 해당 메뉴의 주문 절차를 step별로 안내하세요`;

        const response = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        const gptResponse = response.choices[0].message.content;
        
        res.json({
            response: gptResponse,
            model: model
        });

    } catch (error) {
        console.error('GPT API 오류:', error);
        
        // 인증 오류 처리
        if (error.status === 401) {
            return res.status(401).json({ 
                error: 'GPT API 토큰이 유효하지 않습니다.',
                message: '토큰이 만료되었거나 잘못된 토큰입니다.',
                details: '새로운 토큰을 발급받아 .env 파일의 GITHUB_PAT을 업데이트해주세요.'
            });
        }
        
        // 기타 오류 처리
        res.status(500).json({ 
            error: 'GPT API 호출 중 오류가 발생했습니다.',
            details: error.message 
        });
    }
});

// 메뉴 카테고리 정보 API
app.get('/api/menu-categories', async (req, res) => {
    try {
        const menuData = await getMenuData();
        
        // 카테고리별로 그룹화
        const categories = {};
        menuData.menus.forEach(menu => {
            if (!categories[menu.category]) {
                categories[menu.category] = {
                    name: menu.category,
                    menus: [],
                    menuCount: 0
                };
            }
            categories[menu.category].menus.push(menu);
            categories[menu.category].menuCount++;
        });
        
        // 각 카테고리의 샘플 메뉴 추출
        const categoryList = Object.values(categories).map(category => ({
            name: category.name,
            menuCount: category.menuCount,
            sampleMenus: category.menus.slice(0, 3).map(menu => menu.name)
        }));
        
        res.json({ categories: categoryList });
    } catch (error) {
        console.error('메뉴 카테고리 API 오류:', error);
        res.status(500).json({ error: '메뉴 카테고리 정보를 가져올 수 없습니다.' });
    }
});

// 전체 메뉴 목록 API
app.get('/api/full-menu', async (req, res) => {
    try {
        const menuData = await getMenuData();
        
        // 카테고리별로 그룹화
        const categories = {};
        menuData.menus.forEach(menu => {
            if (!categories[menu.category]) {
                categories[menu.category] = {
                    name: menu.category,
                    menus: []
                };
            }
            categories[menu.category].menus.push({
                name: menu.name,
                price: menu.price
            });
        });
        
        res.json({ categories: Object.values(categories) });
    } catch (error) {
        console.error('전체 메뉴 API 오류:', error);
        res.status(500).json({ error: '전체 메뉴 정보를 가져올 수 없습니다.' });
    }
});

// 주문 절차 안내 API
app.post('/api/order-guidance', async (req, res) => {
    try {
        const { menuName } = req.body;
        
        if (!menuName) {
            return res.status(400).json({ error: '메뉴명이 필요합니다.' });
        }
        
        const menuData = await getMenuData();
        const menu = menuData.menus.find(m => 
            m.name.includes(menuName) || menuName.includes(m.name)
        );
        
        if (!menu) {
            return res.status(404).json({ 
                error: '해당 메뉴를 찾을 수 없습니다.',
                guidance: '죄송합니다. 해당 메뉴를 찾을 수 없습니다. 정확한 메뉴명을 말씀해주세요.'
            });
        }
        
               let guidance = '';
               
               if (menu.category === '쌀국수') {
                   guidance = `${menu.name}를 주문하시려면 다음과 같이 진행해 주세요. 먼저, 상단 메뉴에서 '쌀국수' 카테고리를 누르시고 ${menu.name}를 선택하세요. 그리고 하단에 + 버튼을 누르셔서 수량을 선택해 주세요. 다했으면 말씀해주세요.`;
               } else if (menu.category === '돈카츠,카레') {
                   guidance = `${menu.name}를 주문하시려면 다음과 같이 진행해 주세요. 먼저, 상단 메뉴에서 '돈카츠 카레' 카테고리를 누르시고 ${menu.name}를 선택하세요. 그리고 하단에 + 버튼을 누르셔서 수량을 선택해 주세요. 추가옵션이 있는 메뉴인 경우 추가옵션을 선택하신 다음 하단에 주문담기를 눌러주세요. 다했으면 말씀해주세요.`;
               } else if (menu.category === '1인정식') {
                   guidance = `${menu.name}를 주문하시려면 다음과 같이 진행해 주세요. 먼저, 상단 메뉴에서 '1인정식' 카테고리를 누르시고 ${menu.name}를 선택하세요. 그리고 하단에 + 버튼을 누르셔서 수량을 선택해 주세요. 다했으면 말씀해주세요.`;
               } else {
                   guidance = `${menu.name} 메뉴의 주문 절차를 안내해드리겠습니다. 먼저 해당 메뉴가 속한 카테고리 탭을 누르시고, 원하는 메뉴를 선택하신 후 주문담기 버튼을 누르시면 됩니다.`;
               }
        
        res.json({ guidance });
    } catch (error) {
        console.error('주문 안내 API 오류:', error);
        res.status(500).json({ error: '주문 안내를 제공할 수 없습니다.' });
    }
});

// Tmap API 프록시 엔드포인트 - 주변 카테고리 검색
app.get('/api/tmap/pois/search/around', async (req, res) => {
    try {
        const { version, categories, centerLon, centerLat, reqCoordType, resCoordType, count, radius } = req.query;
        
        // 필수 파라미터 확인
        if (!version || !centerLon || !centerLat) {
            return res.status(400).json({ error: '필수 파라미터가 누락되었습니다.' });
        }
        
        // Tmap API URL 구성
        const tmapUrl = 'https://apis.openapi.sk.com/tmap/pois/search/around';
        const queryParams = new URLSearchParams({
            version: version || '1',
            categories: categories || '음식점',
            centerLon: centerLon,
            centerLat: centerLat,
            reqCoordType: reqCoordType || 'WGS84GEO',
            resCoordType: resCoordType || 'WGS84GEO',
            count: count || '5',
            radius: radius || '1'
        });
        
        const fullUrl = `${tmapUrl}?${queryParams.toString()}`;
        console.log('Tmap API 요청 URL:', fullUrl);
        
        // Tmap API 호출
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'appKey': 'pUIcUWdIGX4FDdOOgd0SO8n46k4ZNmiV6TOOJetL',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Tmap API 오류: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Tmap API 응답 성공:', data.searchPoiInfo?.totalCount || 0, '개 결과');
        
        res.json(data);
        
    } catch (error) {
        console.error('Tmap API 프록시 오류:', error);
        res.status(500).json({ 
            error: 'Tmap API 호출 중 오류가 발생했습니다.',
            details: error.message 
        });
    }
});

// Tmap API 프록시 엔드포인트 - 역지오코딩 (좌표 -> 주소 변환)
app.get('/api/tmap/geo/reversegeocoding', async (req, res) => {
    try {
        const { version, lat, lon, coordType, addressType } = req.query;
        
        // 필수 파라미터 확인
        if (!lat || !lon) {
            return res.status(400).json({ error: '위도(lat)와 경도(lon)가 필요합니다.' });
        }
        
        // Tmap API URL 구성
        const tmapUrl = 'https://apis.openapi.sk.com/tmap/geo/reversegeocoding';
        const queryParams = new URLSearchParams({
            version: version || '1',
            lat: lat,
            lon: lon,
            coordType: coordType || 'WGS84GEO',
            addressType: addressType || 'A02'
        });
        
        const fullUrl = `${tmapUrl}?${queryParams.toString()}`;
        console.log('Tmap 역지오코딩 API 요청 URL:', fullUrl);
        
        // Tmap API 호출
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'appKey': 'pUIcUWdIGX4FDdOOgd0SO8n46k4ZNmiV6TOOJetL',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Tmap API 오류: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Tmap 역지오코딩 API 응답 성공');
        
        res.json(data);
        
    } catch (error) {
        console.error('Tmap 역지오코딩 API 프록시 오류:', error);
        res.status(500).json({ 
            error: 'Tmap 역지오코딩 API 호출 중 오류가 발생했습니다.',
            details: error.message 
        });
    }
});

// Tmap API 프록시 엔드포인트 - 장소 상세 정보 검색
app.get('/api/tmap/pois/:poiId', async (req, res) => {
    try {
        const { poiId } = req.params;
        const { version, findOption, resCoordType } = req.query;
        
        // 필수 파라미터 확인
        if (!poiId) {
            return res.status(400).json({ error: 'POI ID가 필요합니다.' });
        }
        
        // Tmap API URL 구성
        const tmapUrl = `https://apis.openapi.sk.com/tmap/pois/${poiId}`;
        const queryParams = new URLSearchParams({
            version: version || '1',
            findOption: findOption || 'id',
            resCoordType: resCoordType || 'WGS84GEO'
        });
        
        const fullUrl = `${tmapUrl}?${queryParams.toString()}`;
        console.log('Tmap API 장소 상세 정보 요청 URL:', fullUrl);
        
        // Tmap API 호출
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'appKey': 'pUIcUWdIGX4FDdOOgd0SO8n46k4ZNmiV6TOOJetL',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Tmap API 오류: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Tmap API 장소 상세 정보 응답 성공:', data.poiDetailInfo?.name || '알 수 없음');
        
        res.json(data);
        
    } catch (error) {
        console.error('Tmap API 장소 상세 정보 프록시 오류:', error);
        res.status(500).json({ 
            error: 'Tmap API 장소 상세 정보 호출 중 오류가 발생했습니다.',
            details: error.message 
        });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
    console.log(`🎤 음성 대화를 시작하려면 브라우저에서 접속하세요!`);
    console.log(`🗺️ Tmap API 프록시가 활성화되었습니다.`);
});
