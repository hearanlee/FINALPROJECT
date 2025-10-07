import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VoiceGuidePage.css';

const VoiceGuidePage = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);

  const handleVoiceStart = () => {
    setIsListening(!isListening);
    // 음성 인식 로직 구현
    console.log('음성 인식 시작/중지');
  };

  const handleSpeedChange = () => {
    console.log('음성 속도 변경');
  };

  const handleRepeat = () => {
    console.log('반복 재생');
  };

  const handleMismatch = () => {
    console.log('화면과 음성 불일치 신고');
  };

  const handleEnd = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate('/restaurant-detail');
  };

  return (
    <div className="mobile-container">
      <header className="page-header">
        <button onClick={handleBack}>
          <img src="/images/icon-back-arrow.png" alt="뒤로 가기" />
        </button>
        <h1>음성안내</h1>
      </header>

      <main className="content">
        <div className="question-card" style={{marginTop: '20px'}}>
          <p>주문하실 메뉴명을 말하시거나<br />메뉴 둘러보기를 원하시면<br />'메뉴'라고 말해주세요</p>
        </div>

        <div className="voice-icon-container">
          <img 
            src="/images/icon_voice_mic.png" 
            alt="음성 안내 시작" 
            className={`voice-mic-icon ${isListening ? 'listening' : ''}`}
            onClick={handleVoiceStart}
          />
          <div className="volume-controls">
            <span className="volume-btn">+</span>
            <span className="volume-btn">-</span>
          </div>
        </div>

        <p className="instruction-text">
          음성안내를 시작하고 싶으시다면<br />위에 있는 그림을 눌러주세요!
        </p>
      </main>

      <div className="voice-action-buttons">
        <div className="button-row">
          <button onClick={handleSpeedChange} className="btn btn-secondary">
            <img src="/images/icon_slow.png" className="btn-icon" alt="" />
            느린 음성
          </button>
          <button onClick={handleRepeat} className="btn btn-secondary">
            <img src="/images/icon_repeat.png" className="btn-icon" alt="" />
            반복 재생
          </button>
        </div>
        <button onClick={handleMismatch} className="btn btn-secondary full-width">
          ⛔ 화면과 음성이 맞지 않음
        </button>
        <button onClick={handleEnd} className="btn btn-primary full-width">
          음성안내 종료
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
        <button onClick={() => navigate('/my-info')} className="nav-item">
          <img src="/images/icon-user.png" alt="내정보" />
          <span>내정보</span>
        </button>
      </nav>
    </div>
  );
};

export default VoiceGuidePage;


