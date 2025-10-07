import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MapPage.css';

const MapPage = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);

  useEffect(() => {
    // 카카오 지도 API가 이미 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      initializeMap();
      return;
    }

    // 카카오 지도 API 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=749bffa5f8917cfcd65aae3b5addccc7`;
    script.async = true;
    
    script.onload = () => {
      // 약간의 지연을 두고 지도 초기화
      setTimeout(() => {
        if (window.kakao && window.kakao.maps) {
          initializeMap();
        } else {
          console.error('카카오 지도 API 로드 실패');
        }
      }, 100);
    };

    script.onerror = () => {
      console.error('카카오 지도 API 스크립트 로드 실패');
    };
    
    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      const existingScript = document.querySelector(`script[src*="dapi.kakao.com"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const initializeMap = () => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('카카오 지도 API가 로드되지 않았습니다.');
      return;
    }

    const mapContainer = mapRef.current;
    if (!mapContainer) {
      console.error('지도 컨테이너를 찾을 수 없습니다.');
      return;
    }

    const mapOption = { 
      center: new window.kakao.maps.LatLng(37.5835897, 127.0565725),
      level: 3
    };

    const map = new window.kakao.maps.Map(mapContainer, mapOption);

    // 마커를 표시할 위치와 title 객체 배열
    const positions = [
      {
        title: '포핸즈', 
        latlng: new window.kakao.maps.LatLng(37.5839449, 127.0535993)
      },
      {
        title: '카페시사', 
        latlng: new window.kakao.maps.LatLng(37.583448, 127.0535993)
      }
    ];

    // 마커 이미지 설정
    const imageSrc = "/images/map-pin.png";
    
    positions.forEach((position) => {
      const imageSize = new window.kakao.maps.Size(30, 40);
      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);
      
      const marker = new window.kakao.maps.Marker({
        map: map,
        position: position.latlng,
        title: position.title,
        image: markerImage
      });
      
      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', function() {
        console.log('마커 클릭됨: ' + this.getTitle());
      });
    });
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const searchText = e.target.value;
      if (searchText.trim() !== '') {
        console.log('검색어: ' + searchText);
      }
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleNavigationClick = () => {
    navigate('/navigation');
  };

  const handleVoiceGuideClick = () => {
    navigate('/voice-guide');
  };

  return (
    <div className="mobile-container">
      <header className="page-header">
        <button onClick={handleBackClick}>
          <img src="/images/icon-back-arrow.png" alt="뒤로 가기" />
        </button>
        <h1>포핸즈 매장 찾기</h1>
      </header>

      <div className="map-container">
        <div ref={mapRef} id="map"></div>

        <div className="search-bar-floating">
          <img src="/images/icon_search.png" alt="검색" className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="매장명 또는 주소 검색" 
            onKeyPress={handleSearch}
          />
        </div>

        <div className="bottom-buttons-floating">
          <div className="button-row">
            <button onClick={handleNavigationClick} className="btn btn-primary">
              길찾기 안내 시작
            </button>
            <button onClick={handleVoiceGuideClick} className="btn btn-primary">
              키오스크 음성안내
            </button>
          </div>
          <button onClick={handleBackClick} className="btn btn-secondary full-width">
            뒤로 가기
          </button>
        </div>
      </div>
      
      <nav className="bottom-nav">
        <button onClick={handleBackClick} className="nav-item">
          <img src="/images/icon-home.png" alt="홈" />
          <span>홈</span>
        </button>
        <button className="nav-item active">
          <img src="/images/icon-map.png" alt="지도" />
          <span>지도</span>
        </button>
        <button className="nav-item">
          <img src="/images/icon-user.png" alt="내정보" />
          <span>내정보</span>
        </button>
      </nav>
    </div>
  );
};

export default MapPage;
