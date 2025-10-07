import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();

  const handleMenuClick = () => {
    navigate('/menu');
  };

  const handleMapClick = () => {
    navigate('/map');
  };

  return (
    <div className="mobile-container">
      <header className="status-bar">
        <div className="status-left">☀️ 18°C</div>
        <div className="status-right">⏰ 10:30 AM</div>
      </header>

      <main className="content">
        <div className="welcome-card">
          <p>식사를 쉽게 이용할 수 있도록 도와드릴게요</p>
          <p>어디서 부터 시작할까요 ? ✨</p>
        </div>

        <button onClick={handleMenuClick} className="feature-button">
          <img src="/images/chef-hat.png" alt="메뉴 추천 아이콘" />
          <h2>메뉴 추천</h2>
          <p>메뉴 추천을 받고 싶으시다면<br />위에 있는 그림을 눌러주세요!</p>
        </button>

        <button onClick={handleMapClick} className="feature-button">
          <img src="/images/map-pin.png" alt="음식점 검색 아이콘" />
          <h2>음식점 검색</h2>
          <p>음식점 검색을 하고 싶으시다면<br />위에 있는 그림을 눌러주세요!</p>
        </button>
      </main>
      
      <div className="fab-container">
        <button className="fab">+</button>
        <button className="fab">-</button>
      </div>

      <nav className="bottom-nav">
        <button className="nav-item active">
          <img src="/images/icon-home.png" alt="홈" />
          <span>홈</span>
        </button>
        <button onClick={handleMapClick} className="nav-item">
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

export default MainPage;


