import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MenuStep3Page.css';

const MenuStep3Page = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSpice, setSelectedSpice] = useState(null);

  const handleSpiceSelect = (spice) => {
    setSelectedSpice(spice);
  };

  const handleNext = () => {
    if (selectedSpice) {
      navigate('/menu-step4', { 
        state: { 
          ...location.state,
          spice: selectedSpice 
        } 
      });
    }
  };

  const handleBack = () => {
    navigate('/menu-step2');
  };

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
          <p>매운 음식을 원하세요,<br />아니면 안 매운 음식을 원하세요?</p>
        </div>

        <div className="separator">
          <p>︾</p>
        </div>

        <button 
          className={`choice-button ${selectedSpice === 'spicy' ? 'selected' : ''}`}
          onClick={() => handleSpiceSelect('spicy')}
        >
          <img src="/images/icon-spicy.png" alt="매운 음식 아이콘" />
          <span>매운 음식</span>
        </button>

        <div className="separator">
          <p>VS</p>
        </div>

        <button 
          className={`choice-button ${selectedSpice === 'not-spicy' ? 'selected' : ''}`}
          onClick={() => handleSpiceSelect('not-spicy')}
        >
          <img src="/images/icon-not-spicy.png" alt="안 매운 음식 아이콘" />
          <span>안 매운 음식</span>
        </button>
      </main>
      
      <div className="action-buttons">
        <button onClick={handleBack} className="btn btn-secondary">
          뒤로 가기
        </button>
        <button 
          onClick={handleNext} 
          className="btn btn-primary"
          disabled={!selectedSpice}
        >
          다음 단계
        </button>
      </div>

      <nav className="bottom-nav">
        <button onClick={() => navigate('/')} className="nav-item">
          <img src="/images/icon-home.png" alt="홈" />
          <span>홈</span>
        </button>
        <button onClick={() => navigate('/map')} className="nav-item">
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

export default MenuStep3Page;


