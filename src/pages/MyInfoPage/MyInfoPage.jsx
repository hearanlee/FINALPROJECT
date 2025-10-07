import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MyInfoPage.css';

const MyInfoPage = () => {
  const navigate = useNavigate();

  const handleFontSize = () => {
    console.log('글자 크기 조절');
  };

  const handleVoiceSpeed = () => {
    console.log('음성 속도 조절');
  };

  const handleFAQ = () => {
    console.log('자주 묻는 질문');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleMapClick = () => {
    navigate('/map');
  };

  return (
    <div className="mobile-container">
      <header className="page-header">
        <button onClick={() => navigate('/')}>
          <img src="/images/icon-back-arrow.png" alt="뒤로 가기" />
        </button>
        <h1>내 정보</h1>
      </header>

      <main className="content">
        <div className="settings-list">
          <button className="settings-button" onClick={handleFontSize}>
            <img src="/images/icon_font_size.png" alt="" />
            <span>글자 크기 조절</span>
          </button>
          <button className="settings-button" onClick={handleVoiceSpeed}>
            <img src="/images/icon_voice_speed.png" alt="" />
            <span>음성 속도 조절</span>
          </button>
          <button className="settings-button" onClick={handleFAQ}>
            <img src="/images/icon_faq.png" alt="" />
            <span>자주 묻는 질문</span>
          </button>
        </div>
      </main>
      
      <nav className="bottom-nav">
        <button onClick={handleHomeClick} className="nav-item">
          <img src="/images/icon-home.png" alt="홈" />
          <span>홈</span>
        </button>
        <button onClick={handleMapClick} className="nav-item">
          <img src="/images/icon-map.png" alt="지도" />
          <span>지도</span>
        </button>
        <button className="nav-item active">
          <img src="/images/icon-user.png" alt="내정보" />
          <span>내정보</span>
        </button>
      </nav>
    </div>
  );
};

export default MyInfoPage;


