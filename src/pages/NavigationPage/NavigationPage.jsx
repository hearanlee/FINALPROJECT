import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavigationPage.css';

const NavigationPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/restaurant-detail');
  };

  const handleEndNavigation = () => {
    navigate('/');
  };

  const handleSelectRestaurant = () => {
    navigate('/map-search');
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

  return (
    <div className="mobile-container">
      <div className="navigation-container">
        <img src="/images/route_map.png" alt="경로 지도" className="route-map-image" />

        <header className="page-header nav-header">
          <button onClick={handleBack}>
            <img src="/images/icon-back-arrow.png" alt="뒤로 가기" />
          </button>
          <h1>길찾기 안내</h1>
        </header>

        <button onClick={handleBack} className="btn back-button-floating btn-floating-style">
          뒤로 가기
        </button>
        
        <div className="action-buttons bottom-buttons-floating">
          <button onClick={handleEndNavigation} className="btn btn-secondary">
            안내 종료
          </button>
          <button onClick={handleSelectRestaurant} className="btn btn-primary">
            음식점 선택하기
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

export default NavigationPage;


