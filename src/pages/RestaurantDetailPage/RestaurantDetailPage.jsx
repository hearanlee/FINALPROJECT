import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RestaurantDetailPage.css';

const RestaurantDetailPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/restaurant-list');
  };

  const handleNavigation = () => {
    navigate('/navigation');
  };

  const handleVoiceGuide = () => {
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

  return (
    <div className="mobile-container">
      <header className="page-header">
        <button onClick={handleBack}>
          <img src="/images/icon-back-arrow.png" alt="뒤로 가기" />
        </button>
        <h1>매장 상세 안내</h1>
      </header>

      <main className="content detail-content">
        <img src="/images/map_image.png" alt="매장 지도" className="map-image" />

        <div className="detail-card">
          <h2>포핸즈</h2>
          <p className="address">서울 동대문구 전농로 222 씨티빌라트 상가 2층 포핸즈</p>
          <div className="rating-line">
            <span className="stars">★★★★☆</span>
            <span className="rating-text">4.5 (128)</span>
          </div>
          <div className="tag">엘리베이터 사용 가능</div>
        </div>

        <div className="gallery">
          <img src="/images/food_photo1.png" alt="음식 사진 1" />
          <img src="/images/food_photo2.png" alt="음식 사진 2" />
          <img src="/images/food_photo3.png" alt="음식 사진 3" />
        </div>

        <div className="detail-action-buttons">
          <button onClick={handleNavigation} className="btn btn-primary full-width">
            길찾기 안내 시작
          </button>
          <button onClick={handleVoiceGuide} className="btn btn-primary full-width">
            키오스크 음성안내
          </button>
          <button onClick={handleBack} className="btn btn-secondary full-width">
            뒤로 가기
          </button>
        </div>
      </main>
      
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

export default RestaurantDetailPage;


