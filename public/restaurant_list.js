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

    // 4. 모달 닫기 이벤트 연결 (X 버튼, 뒷배경)
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    // 매장별 목적지 좌표 설정 함수
    function getDestinationCoordinates(restaurantName) {
        // 반지하돈부리 좌표 (서울 동대문구 망우로18다길 44)
        if (restaurantName.includes('반지하돈부리')) {
            return {
                lat: 37.585331772,
                lng: 127.060852169,
                name: '반지하돈부리'
            };
        }
        // 이삭토스트 서울시립대점 좌표 (서울 동대문구 전농제2동 서울시립대로 160)
        else if (restaurantName.includes('이삭토스트')) {
            return {
                lat: 37.583403112,
                lng: 127.054558179,
                name: '이삭토스트 서울시립대점'
            };
        }
        // 기본값 (반지하돈부리)
        return {
            lat: 37.585331772,
            lng: 127.060852169,
            name: '반지하돈부리'
        };
    }

    // 길찾기 안내 버튼 클릭 이벤트
    const navigationBtn = document.querySelector('.navigation-btn');
    if (navigationBtn) {
        navigationBtn.addEventListener('click', async function() {
            if (!selectedItem) {
                alert('음식점을 먼저 선택해주세요.');
                return;
            }

            // 선택된 매장 정보 가져오기
            const restaurantName = selectedItem.querySelector('.restaurant-name').textContent;
            
            // Tmap API로 검색된 매장인지 확인 (data-lat, data-lng 속성 확인)
            const restaurantLat = selectedItem.getAttribute('data-lat');
            const restaurantLng = selectedItem.getAttribute('data-lng');
            
            let destinationCoords;
            
            if (restaurantLat && restaurantLng) {
                // Tmap API로 검색된 매장인 경우
                destinationCoords = {
                    lat: parseFloat(restaurantLat),
                    lng: parseFloat(restaurantLng),
                    name: restaurantName
                };
            } else {
                // 고정된 매장(반지하돈부리, 이삭토스트)인 경우
                destinationCoords = getDestinationCoordinates(restaurantName);
            }

            // 현재 위치 가져오기
            try {
                await getCurrentLocation();
                
                if (!currentPosition) {
                    alert('현재 위치를 가져올 수 없습니다.');
                    return;
                }

                // navigation.html로 이동하면서 좌표 정보 전달
                const navUrl = `navigation.html?startLat=${currentPosition.lat}&startLng=${currentPosition.lng}&endLat=${destinationCoords.lat}&endLng=${destinationCoords.lng}`;
                window.location.href = navUrl;
                
            } catch (error) {
                console.error('위치 가져오기 실패:', error);
                alert('현재 위치를 가져올 수 없습니다. 위치 권한을 허용해주세요.');
            }
        });
    }

    // 5. "음식점 확인하기" 버튼 클릭 이벤트 (핵심!)
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            // 사용자가 식당을 선택했는지 확인
            if (selectedItem) {
                // 1. 선택된 아이템에서 식당 정보를 추출합니다.
                const name = selectedItem.querySelector('.restaurant-name').textContent;
                const address = selectedItem.querySelector('.restaurant-address').textContent;
                
                // --- 💡 여기가 수정된 부분입니다 ---
                // .restaurant-rating 요소가 있는지 안전하게 확인합니다.
                const ratingElement = selectedItem.querySelector('.restaurant-rating');
                const rating = ratingElement ? ratingElement.textContent : '⭐ 인기 ⭐'; // 없으면 기본값 (HTML의 '인기' 태그 참고)
                
                // 만약 Tmap API에서 평점 정보를 가져온다면, 
                // '평점 정보 없음' 등으로 기본값을 바꿔도 됩니다.
                // --- 💡 수정 끝 ---

                // 2. 모달 내부의 텍스트를 추출한 정보로 변경합니다.
                if (modalStoreName) modalStoreName.textContent = name;
                if (modalStoreAddress) modalStoreAddress.textContent = address;
                
                // 3. 모달의 평점란도 안전하게 업데이트
                if (modalStoreRating) {
                    modalStoreRating.textContent = rating;
                    // 평점 요소가 실제로 존재할 때만 보이게 처리
                    if (ratingElement) {
                        modalStoreRating.style.display = 'block';
                    } else {
                        // '반지하돈부리'처럼 평점 요소가 아예 없으면, 
                        // '⭐ 인기 ⭐' 텍스트가 보이되 CSS의 별점 스타일이 적용되지 않도록 하거나,
                        // 아예 숨길 수 있습니다. 여기서는 우선 보이게 둡니다.
                        // (CSS에서 .restaurant-rating 스타일을 확인해보세요)
                    }
                }

                // 4. 모달을 엽니다. (이제 오류 없이 실행됩니다)
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

    // Tmap API로 키워드 기반 음식점 검색
    async function searchPlacesByKeyword(searchKeyword) {
        try {
            // 현재 위치 가져오기
            await getCurrentLocation();

            if (!currentPosition) {
                console.error('현재 위치를 가져올 수 없습니다.');
                return;
            }

            console.log(`검색 시작 [키워드: ${searchKeyword}]`, currentPosition);

            // Tmap API 호출 - POI 검색
            const searchUrl = 'https://apis.openapi.sk.com/tmap/pois';
            
            // Tmap API는 radius를 km 단위로 사용 (1-10 범위 권장)
            // 직접 쿼리 문자열 구성 (URLSearchParams 사용 시 일부 특수문자 인코딩 문제 가능)
            const queryString = 'version=1' +
                              '&searchKeyword=' + encodeURIComponent(searchKeyword) +
                              '&centerLon=' + currentPosition.lng.toString() +
                              '&centerLat=' + currentPosition.lat.toString() +
                              '&reqCoordType=WGS84GEO' +
                              '&resCoordType=WGS84GEO' +
                              '&radius=3' +  // 3km (서버.js와 map_main.html에서 사용하는 값 참고)
                              '&count=10' +
                              '&sort=distance';

            const fullUrl = searchUrl + '?' + queryString;
            console.log('검색 URL:', fullUrl);

            let response;
            try {
                response = await fetch(fullUrl, {
                    method: 'GET',
                    headers: {
                        'appKey': 'pUIcUWdIGX4FDdOOgd0SO8n46k4ZNmiV6TOOJetL',
                        'Accept': 'application/json'
                    }
                });
            } catch (fetchError) {
                console.error('네트워크 요청 실패:', fetchError);
                throw new Error('네트워크 요청 실패: ' + fetchError.message);
            }

            // 응답 상태 및 헤더 확인
            console.log('응답 상태:', response.status, response.statusText);
            console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));

            // 응답 본문을 텍스트로 먼저 가져와서 확인
            const responseText = await response.text().catch(err => {
                console.error('응답 본문 읽기 실패:', err);
                return '';
            });
            
            console.log('응답 본문 길이:', responseText.length);
            console.log('응답 본문 시작 부분:', responseText.substring(0, 200));
            
            // 응답이 비어있는지 확인
            if (!responseText || responseText.trim().length === 0) {
                console.warn('API 응답이 비어있습니다.');
                // 상태 코드 확인
                if (!response.ok) {
                    console.error(`HTTP 오류: ${response.status} ${response.statusText}`);
                }
                return;
            }

            // 응답 상태가 200이 아니면 에러 처리
            if (!response.ok) {
                console.error(`API 오류 응답: ${response.status} ${response.statusText}`);
                console.error('응답 내용:', responseText);
                // JSON 형식의 에러 응답인지 확인
                if (responseText.trim().startsWith('{')) {
                    try {
                        const errorData = JSON.parse(responseText);
                        console.error('API 에러 상세:', errorData);
                    } catch (e) {
                        // JSON이 아니면 그대로 출력
                    }
                }
                return;
            }

            // JSON 파싱 시도
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON 파싱 실패:', parseError);
                console.error('응답 내용 (전체):', responseText);
                throw new Error('응답 형식이 올바르지 않습니다: ' + parseError.message);
            }
            
            console.log('검색 결과:', data);

            if (data.searchPoiInfo && data.searchPoiInfo.pois && data.searchPoiInfo.pois.poi) {
                let restaurants = data.searchPoiInfo.pois.poi;
                
                // 단일 결과인 경우 배열로 변환
                if (!Array.isArray(restaurants)) {
                    restaurants = [restaurants];
                }

                // 거리 계산 및 정렬
                restaurants = restaurants.map(restaurant => {
                    const lat = parseFloat(restaurant.frontLat || restaurant.noorLat || restaurant.lat);
                    const lon = parseFloat(restaurant.frontLon || restaurant.noorLon || restaurant.lon);
                    
                    const distance = calculateDistance(
                        currentPosition.lat,
                        currentPosition.lng,
                        lat,
                        lon
                    );

                    return {
                        id: restaurant.id || null,
                        name: restaurant.name || '이름 없음',
                        address: restaurant.address || 
                                (restaurant.newAddressList && restaurant.newAddressList.newAddress && restaurant.newAddressList.newAddress[0] && restaurant.newAddressList.newAddress[0].fullAddressRoad) ||
                                [restaurant.upperAddrName, restaurant.middleAddrName, restaurant.roadName].filter(Boolean).join(' ') ||
                                '주소 정보 없음',
                        lat: lat,
                        lng: lon,
                        distance: distance,
                        telNo: restaurant.telNo || ''
                    };
                });

                // 거리순 정렬
                restaurants.sort((a, b) => a.distance - b.distance);

                // 상단 고정 매장명은 결과에서 제외 (중복 방지)
                const featuredEl = document.querySelector('.restaurant-item[data-restaurant] .restaurant-name');
                const featuredName = featuredEl ? featuredEl.textContent.trim() : '';
                if (featuredName) {
                    restaurants = restaurants.filter(r => !r.name.includes(featuredName));
                }

                // 최대 10개까지만 표시
                restaurants = restaurants.slice(0, 10);

                console.log('필터링된 음식점:', restaurants);

                // 결과를 HTML에 추가
                displayRestaurants(restaurants);

            } else {
                console.log('검색 결과가 없습니다.');
                // 응답 구조가 예상과 다른 경우 로깅
                if (data.error) {
                    console.error('API 오류:', data.error);
                } else {
                    console.warn('예상하지 못한 응답 구조:', data);
                }
            }

        } catch (error) {
            console.error('키워드 검색 오류:', error);
            // 에러 메시지에 더 자세한 정보 추가
            if (error.message) {
                console.error('오류 상세:', error.message);
            }
            // 사용자에게는 에러를 조용히 처리 (기존 매장 정보는 표시됨)
        }
    }

    // 도보 소요 시간 계산 (분 단위)
    function calculateWalkingTime(distanceInMeters) {
        // 도보 평균 속도: 4km/h = 약 67m/분 = 1km당 15분
        const walkingSpeedPerMinute = 67; // 미터/분
        const minutes = Math.round(distanceInMeters / walkingSpeedPerMinute);
        return minutes;
    }

    // 검색된 음식점을 HTML에 표시
    function displayRestaurants(restaurants) {
        const container = document.getElementById('tmapRestaurants');
        if (!container) return;

        container.innerHTML = '';

        restaurants.forEach(restaurant => {
            const distanceText = restaurant.distance >= 1000 
                ? (restaurant.distance / 1000).toFixed(1) + 'km'
                : Math.round(restaurant.distance) + 'm';

            const walkingMinutes = calculateWalkingTime(restaurant.distance);
            const walkingTimeText = walkingMinutes >= 60 
                ? `${Math.floor(walkingMinutes / 60)}시간 ${walkingMinutes % 60}분`
                : `${walkingMinutes}분`;

            const restaurantItem = document.createElement('div');
            restaurantItem.className = 'restaurant-item';
            restaurantItem.setAttribute('data-lat', restaurant.lat);
            restaurantItem.setAttribute('data-lng', restaurant.lng);
            restaurantItem.innerHTML = `
                <div class="restaurant-info">
                    <div class="info-header">
                        <span class="restaurant-name">${restaurant.name}</span>
                        <div class="distance-info">
                            <span class="restaurant-distance">${distanceText}</span>
                            <p class="restaurant-walking-time">도보 ${walkingTimeText}</p>
                        </div>
                    </div>
                    <p class="restaurant-address">${restaurant.address}</p>
                </div>
            `;

            container.appendChild(restaurantItem);
        });

        // 새로 추가된 아이템에 클릭 이벤트 연결
        attachClickEventToItems();
    }

    // 페이지 로드 시 검색 실행 - 페이지에서 키워드 가져오기
    const defaultKeyword = '쌀국수';
    const pageKeyword = document.body.getAttribute('data-search-keyword') || defaultKeyword;
    console.log('페이지 검색 키워드:', pageKeyword);
    if (pageKeyword) {
        searchPlacesByKeyword(pageKeyword);
    } else {
        console.warn('검색 키워드가 설정되지 않았습니다.');
    }
});