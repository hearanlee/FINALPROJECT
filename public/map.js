// --- map.js 파일의 전체 내용 ---

// 카카오 지도 라이브러리가 완전히 로드된 후에, 안의 함수를 실행시켜줍니다.
function loadMap() {
    // 1. 지도를 담을 영역의 DOM 레퍼런스를 가져옵니다.
    const mapContainer = document.getElementById('map'); 

    // '포핸즈'의 실제 위도와 경도입니다.
    const restaurantLat = 37.5843; // 위도
    const restaurantLng = 127.0543; // 경도

    // 2. 지도를 생성할 때 필요한 기본 옵션을 설정합니다.
    const mapOption = { 
        center: new kakao.maps.LatLng(restaurantLat, restaurantLng), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

    // 3. 지도를 생성합니다.
    const map = new kakao.maps.Map(mapContainer, mapOption);

    // 4. 지도에 표시할 마커를 생성합니다.
    const marker = new kakao.maps.Marker({
        //마커가 표시 될 지도
        map: map,
        //마커가 표시 될 위치
        position: new kakao.maps.LatLng(restaurantLat, restaurantLng) 
    });
}