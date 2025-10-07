import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MenuStep4Page.css';

const MenuStep4Page = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedType, setSelectedType] = useState(null);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleResult = () => {
    if (selectedType) {
      navigate('/menu-result', { 
        state: { 
          ...location.state,
          type: selectedType 
        } 
      });
    }
  };

  const handleBack = () => {
    navigate('/menu-step3');
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
          <p>국물이 있는 음식을 원하세요,<br />아니면 밥이나 면처럼 든든한 음식을 원하세요?</p>
        </div>

        <div className="separator">
          <p>︾</p>
        </div>

        <button 
          className={`choice-button ${selectedType === 'rice' ? 'selected' : ''}`}
          onClick={() => handleTypeSelect('rice')}
        >
          <img src="/images/icon-rice.png" alt="밥 아이콘" />
          <span>밥</span>
        </button>

        <div className="separator">
          <p>VS</p>
        </div>

        <button 
          className={`choice-button ${selectedType === 'noodle' ? 'selected' : ''}`}
          onClick={() => handleTypeSelect('noodle')}
        >
          <img src="/images/icon-noodle.png" alt="면 아이콘" />
          <span>면</span>
        </button>
      </main>
      
      <div className="action-buttons">
        <button onClick={handleBack} className="btn btn-secondary">
          뒤로 가기
        </button>
        <button 
          onClick={handleResult} 
          className="btn btn-primary"
          disabled={!selectedType}
        >
          결과 보기
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

export default MenuStep4Page;


