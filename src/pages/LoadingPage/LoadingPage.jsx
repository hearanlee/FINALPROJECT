import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoadingPage.css';

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 2초 후 메인 페이지로 이동
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="mobile-container">
      <img src="/images/loading-icon.png" alt="앱 로고" className="loading-icon" />
      <p className="loading-text">로딩중...</p>
    </div>
  );
};

export default LoadingPage;


