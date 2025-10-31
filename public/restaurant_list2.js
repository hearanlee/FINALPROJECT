document.addEventListener('DOMContentLoaded', function() {
    
    // 1. 필요한 HTML 요소들을 모두 찾습니다.
    const confirmBtn = document.querySelector('.confirm-btn');
    let items = document.querySelectorAll('.restaurant-item');
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

    // --- Tmap API 관련 변수 ---
    let currentPosition = null; // 현재 위치 저장

    // 식당 목록 아이템 클릭 이벤트 함수 (재사용 가능하도록)
    function attachClickEventToItems() {
        items = document.querySelectorAll('.restaurant-item');
        items.forEach(item => {
            // 기존 이벤트 제거 후 새로 연결 (중복 방지)
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
        });
        
        // 다시 선택해서 이벤트 연결
        items = document.querySelectorAll('.restaurant-item');
        items.forEach(item => {
            item.addEventListener('click', function() {
                // 다른 아이템에 있던 'selected' 효과를 모두 제거
                items.forEach(i => i.classList.remove('selected'));
                
                // 지금 클릭한 아이템에만 'selected' 효과 추가
                this.classList.add('selected');
                selectedItem = this; // 선택된 아이템을 변수에 저장
            });
        });
    }

    // 초기 이벤트 연결
    attachClickEventToItems();

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
                
                // 평점이 없을 수 있으므로 체크
                const ratingElement = selectedItem.querySelector('.restaurant-rating');
                const rating = ratingElement ? ratingElement.textContent : '★★★★☆ 4.5 (128)';

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

    // 현재 위치 가져오기
    function getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    currentPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    console.log('현재 위치:', currentPosition);
                    resolve(currentPosition);
                },
                (error) => {
                    console.error('위치 가져오기 실패:', error);
                    // 기본 위치 (서울 시청)
                    currentPosition = {
                        lat: 37.5665,
                        lng: 126.9780
                    };
                    console.log('기본 위치 사용:', currentPosition);
                    resolve(currentPosition);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }

    // 두 지점 간 거리 계산 (미터)
    function calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371e3; // 지구 반지름 (미터)
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lng2 - lng1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    // Tmap API로 카페 검색
    async function searchCafes() {
        try {
            // 현재 위치 가져오기
            await getCurrentLocation();

            if (!currentPosition) {
                console.error('현재 위치를 가져올 수 없습니다.');
                return;
            }

            console.log('카페 검색 시작...', currentPosition);

            // Tmap API 호출
            const searchUrl = 'https://apis.openapi.sk.com/tmap/pois';
            const queryString = 'version=1&searchKeyword=' + encodeURIComponent('카페') +
                              '&centerLon=' + currentPosition.lng.toString() +
                              '&centerLat=' + currentPosition.lat.toString() +
                              '&reqCoordType=WGS84GEO&resCoordType=WGS84GEO' +
                              '&radius=5&count=10&sort=distance';

            const fullUrl = searchUrl + '?' + queryString;
            console.log('검색 URL:', fullUrl);

            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'appKey': 'pUIcUWdIGX4FDdOOgd0SO8n46k4ZNmiV6TOOJetL'
                }
            });

            if (!response.ok) {
                throw new Error('검색 요청 실패: ' + response.status);
            }

            const data = await response.json();
            console.log('검색 결과:', data);

            if (data.searchPoiInfo && data.searchPoiInfo.pois && data.searchPoiInfo.pois.poi) {
                let cafes = data.searchPoiInfo.pois.poi;
                
                // 단일 결과인 경우 배열로 변환
                if (!Array.isArray(cafes)) {
                    cafes = [cafes];
                }

                // 거리 계산 및 정렬
                cafes = cafes.map(cafe => {
                    const lat = parseFloat(cafe.frontLat || cafe.noorLat || cafe.lat);
                    const lon = parseFloat(cafe.frontLon || cafe.noorLon || cafe.lon);
                    
                    const distance = calculateDistance(
                        currentPosition.lat,
                        currentPosition.lng,
                        lat,
                        lon
                    );

                    return {
                        id: cafe.id || null,
                        name: cafe.name || '이름 없음',
                        address: cafe.address || 
                                (cafe.newAddressList && cafe.newAddressList.newAddress && cafe.newAddressList.newAddress[0] && cafe.newAddressList.newAddress[0].fullAddressRoad) ||
                                [cafe.upperAddrName, cafe.middleAddrName, cafe.roadName].filter(Boolean).join(' ') ||
                                '주소 정보 없음',
                        lat: lat,
                        lng: lon,
                        distance: distance,
                        telNo: cafe.telNo || ''
                    };
                });

                // 거리순 정렬
                cafes.sort((a, b) => a.distance - b.distance);

                // 카페시사 제외 (이미 리스트에 있음)
                cafes = cafes.filter(c => !c.name.includes('카페시사'));

                // 최대 10개까지만 표시
                cafes = cafes.slice(0, 10);

                console.log('필터링된 카페:', cafes);

                // 결과를 HTML에 추가
                displayCafes(cafes);

            } else {
                console.log('검색 결과가 없습니다.');
            }

        } catch (error) {
            console.error('카페 검색 오류:', error);
        }
    }

    // 도보 소요 시간 계산 (분 단위)
    function calculateWalkingTime(distanceInMeters) {
        // 도보 평균 속도: 4km/h = 약 67m/분 = 1km당 15분
        const walkingSpeedPerMinute = 67; // 미터/분
        const minutes = Math.round(distanceInMeters / walkingSpeedPerMinute);
        return minutes;
    }

    // 검색된 카페를 HTML에 표시
    function displayCafes(cafes) {
        const container = document.getElementById('tmapRestaurants');
        if (!container) return;

        container.innerHTML = '';

        cafes.forEach(cafe => {
            const distanceText = cafe.distance >= 1000 
                ? (cafe.distance / 1000).toFixed(1) + 'km'
                : Math.round(cafe.distance) + 'm';

            const walkingMinutes = calculateWalkingTime(cafe.distance);
            const walkingTimeText = walkingMinutes >= 60 
                ? `${Math.floor(walkingMinutes / 60)}시간 ${walkingMinutes % 60}분`
                : `${walkingMinutes}분`;

            const cafeItem = document.createElement('div');
            cafeItem.className = 'restaurant-item';
            cafeItem.setAttribute('data-lat', cafe.lat);
            cafeItem.setAttribute('data-lng', cafe.lng);
            cafeItem.innerHTML = `
                <div class="restaurant-info">
                    <div class="info-header">
                        <span class="restaurant-name">${cafe.name}</span>
                        <div class="distance-info">
                            <span class="restaurant-distance">${distanceText}</span>
                            <p class="restaurant-walking-time">도보 ${walkingTimeText}</p>
                        </div>
                    </div>
                    <p class="restaurant-address">${cafe.address}</p>
                </div>
            `;

            container.appendChild(cafeItem);
        });

        // 새로 추가된 아이템에 클릭 이벤트 연결
        attachClickEventToItems();
    }

    // 페이지 로드 시 카페 검색 실행
    searchCafes();
});

