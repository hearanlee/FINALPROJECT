import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPage.css';

const MenuPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleNext = () => {
    if (selectedCategory) {
      navigate('/menu-step2', { state: { category: selectedCategory } });
    }
  };

  const handleBack = () => {
    navigate('/');
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
          <p>식사를 원하세요,<br />아니면 간식을 원하세요?</p>
        </div>

        <div className="separator">
          <p>︾</p>
        </div>

        <button 
          className={`choice-button ${selectedCategory === 'meal' ? 'selected' : ''}`}
          onClick={() => handleCategorySelect('meal')}
        >
          <img src="/images/icon-meal.png" alt="식사 아이콘" />
          <span>식사</span>
        </button>

        <div className="separator">
          <p>VS</p>
        </div>

        <button 
          className={`choice-button ${selectedCategory === 'snack' ? 'selected' : ''}`}
          onClick={() => handleCategorySelect('snack')}
        >
          <img src="/images/icon-snack.png" alt="간식 아이콘" />
          <span>간식</span>
        </button>
      </main>
      
      <div className="action-buttons">
        <button onClick={handleBack} className="btn btn-secondary">
          뒤로 가기
        </button>
        <button 
          onClick={handleNext} 
          className="btn btn-primary"
          disabled={!selectedCategory}
        >
          다음 단계
        </button>
      </div>

      <nav className="bottom-nav">
        <button onClick={handleBack} className="nav-item">
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

export default MenuPage;


