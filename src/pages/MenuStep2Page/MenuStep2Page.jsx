import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MenuStep2Page.css';

const MenuStep2Page = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTemperature, setSelectedTemperature] = useState(null);

  const handleTemperatureSelect = (temperature) => {
    setSelectedTemperature(temperature);
  };

  const handleNext = () => {
    if (selectedTemperature) {
      navigate('/menu-step3', { 
        state: { 
          category: location.state?.category,
          temperature: selectedTemperature 
        } 
      });
    }
  };

  const handleBack = () => {
    navigate('/menu');
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
          <p>따뜻한 음식을 원하세요,<br />아니면 시원한 음식을 원하세요?</p>
        </div>

        <div className="separator">
          <p>︾</p>
        </div>

        <button 
          className={`choice-button ${selectedTemperature === 'warm' ? 'selected' : ''}`}
          onClick={() => handleTemperatureSelect('warm')}
        >
          <img src="/images/icon-warm.png" alt="따뜻한 음식 아이콘" />
          <span>따뜻한 음식</span>
        </button>

        <div className="separator">
          <p>VS</p>
        </div>

        <button 
          className={`choice-button ${selectedTemperature === 'cold' ? 'selected' : ''}`}
          onClick={() => handleTemperatureSelect('cold')}
        >
          <img src="/images/icon-cold.png" alt="시원한 음식 아이콘" />
          <span>시원한 음식</span>
        </button>
      </main>
      
      <div className="action-buttons">
        <button onClick={handleBack} className="btn btn-secondary">
          뒤로 가기
        </button>
        <button 
          onClick={handleNext} 
          className="btn btn-primary"
          disabled={!selectedTemperature}
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

export default MenuStep2Page;


