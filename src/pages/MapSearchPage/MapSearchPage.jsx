import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MapSearchPage.css';

const MapSearchPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/navigation');
  };

  const handleVoiceGuideClick = () => {
    navigate('/voice-guide');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleMapClick = () => {
    navigate('/map');
  };

  const handleMyInfoClick = () => {
    navigate('/my-info');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const searchText = e.target.value;
      if (searchText.trim() !== '') {
        console.log('검색어: ' + searchText);
      }
    }
  };

  return (
    <div className="mobile-container">
      <header className="page-header">
        <button onClick={handleBackClick}>
          <img src="/images/icon-back-arrow.png" alt="뒤로 가기" />
        </button>
        <h1>키오스크 사용 매장 찾기</h1>
      </header>

      <div className="map-container">
        <img src="/images/map_background.png" alt="배경 지도" className="map-background-image" />

        <div className="search-bar-floating">
          <img src="/images/icon_search.png" alt="검색" className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="메뉴 또는 키오스크 사용 가맹점 검색"
            onKeyPress={handleSearch}
          />
        </div>

        <div className="map-pins">
          <img src="/images/icon_mappin.png" alt="핀" className="map-pin" style={{top: '20%', left: '45%'}} />
          <img src="/images/icon_mappin.png" alt="핀" className="map-pin" style={{top: '35%', left: '30%'}} />
          <img src="/images/icon_mappin.png" alt="핀" className="map-pin" style={{top: '40%', left: '50%'}} />
          <img src="/images/icon_mappin.png" alt="핀" className="map-pin" style={{top: '55%', left: '35%'}} />
          <img src="/images/icon_mappin.png" alt="핀" className="map-pin" style={{top: '60%', left: '60%'}} />
          <img src="/images/icon_mappin.png" alt="핀" className="map-pin" style={{top: '70%', left: '48%'}} />
        </div>

        <div className="action-buttons bottom-buttons-floating">
          <button onClick={handleBackClick} className="btn btn-secondary">
            뒤로 가기
          </button>
          <button onClick={handleVoiceGuideClick} className="btn btn-primary">
            키오스크 음성안내
          </button>
        </div>
      </div>
      
      <nav className="bottom-nav">
        <button onClick={handleHomeClick} className="nav-item">
          <img src="/images/icon-home.png" alt="홈" />
          <span>홈</span>
        </button>
        <button onClick={handleMapClick} className="nav-item active">
          <img src="/images/icon-map.png" alt="지도" />
          <span>지도</span>
        </button>
        <button onClick={handleMyInfoClick} className="nav-item">
          <img src="/images/icon-user.png" alt="내정보" />
          <span>내정보</span>
        </button>
      </nav>
    </div>
  );
};

export default MapSearchPage;


