import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MenuResultPage.css';

const MenuResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 선택된 옵션들 가져오기
  const { category, temperature, spice, type } = location.state || {};

  const handleBack = () => {
    navigate('/menu-step4');
  };

  const handleRestart = () => {
    navigate('/menu');
  };

  const handleSelectRestaurant = () => {
    navigate('/restaurant-list');
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

  // 추천 메뉴 결정 로직
  const getRecommendedMenu = () => {
    if (temperature === 'warm' && type === 'noodle') {
      return {
        name: '쌀국수',
        image: '/images/pho.jpg',
        keywords: '따뜻한, 국물 있는, 안매운 음식',
        price: '만원대'
      };
    }
    // 다른 조합들에 대한 로직 추가 가능
    return {
      name: '추천 메뉴',
      image: '/images/pho.jpg',
      keywords: '맛있는 음식',
      price: '만원대'
    };
  };

  const recommendedMenu = getRecommendedMenu();

  return (
    <div className="mobile-container">
      <header className="page-header">
        <button onClick={handleBack}>
          <img src="/images/icon-back-arrow.png" alt="뒤로 가기" />
        </button>
        <h1>메뉴 추천</h1>
      </header>

      <main className="content">
        <div className="question-card">
          <p>네, {temperature === 'warm' ? '따뜻한' : '시원한'} {type === 'noodle' ? '면요리' : '밥요리'}를 원하시는군요.<br />'{recommendedMenu.name}'는 어떠세요?</p>
        </div>

        <div className="separator">
          <p>︾</p>
        </div>

        <img className="result-image" src={recommendedMenu.image} alt={`${recommendedMenu.name} 사진`} />

        <div className="info-box">
          <p><strong>추천 메뉴:</strong> {recommendedMenu.name}</p>
          <p><strong>키워드:</strong> {recommendedMenu.keywords}</p>
          <p><strong>가격대:</strong> {recommendedMenu.price}</p>
        </div>
      </main>
      
      <div className="action-buttons">
        <button onClick={handleRestart} className="btn btn-secondary">
          메뉴 다시 고르기
        </button>
        <button onClick={handleSelectRestaurant} className="btn btn-primary">
          음식점 선택하기
        </button>
      </div>

      <nav className="bottom-nav">
        <button onClick={handleHomeClick} className="nav-item">
          <img src="/images/icon-home.png" alt="홈" />
          <span>홈</span>
        </button>
        <button onClick={handleMapClick} className="nav-item">
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

export default MenuResultPage;


