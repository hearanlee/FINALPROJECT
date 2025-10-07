import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RestaurantListPage.css';

const RestaurantListPage = () => {
  const navigate = useNavigate();

  const restaurants = [
    {
      id: 1,
      name: '포핸즈',
      distance: '345m',
      rating: '★★★★☆ 4.5 (128)',
      address: '서울 동대문구 전농로 222 2층',
      image: '/images/restaurant1.png'
    },
    {
      id: 2,
      name: '타인플레이트',
      distance: '463m',
      rating: '★★★★☆ 4.5 (128)',
      address: '서울 동대문구 이문로 17-26 1층',
      image: '/images/restaurant2.png'
    },
    {
      id: 3,
      name: '반포식스',
      distance: '567m',
      rating: '★★★★☆ 4.5 (128)',
      address: '서울 동대문구 이문로 17-26 1층',
      image: '/images/restaurant3.png'
    }
  ];

  const handleRestaurantSelect = (restaurantId) => {
    navigate('/restaurant-detail', { state: { restaurantId } });
  };

  const handleBack = () => {
    navigate('/menu-result');
  };

  return (
    <div className="mobile-container">
      <header className="page-header">
        <button onClick={handleBack}>
          <img src="/images/icon-back-arrow.png" alt="뒤로 가기" />
        </button>
        <h1>음식점 선택하기</h1>
      </header>

      <main className="content">
        <div className="question-card">
          <p>원하는 음식점을 선택해주세요!</p>
        </div>

        <div className="separator">
          <p>︾</p>
        </div>

        <div className="restaurant-list">
          {restaurants.map((restaurant) => (
            <div 
              key={restaurant.id} 
              className="restaurant-item"
              onClick={() => handleRestaurantSelect(restaurant.id)}
            >
              <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
              <div className="restaurant-info">
                <div className="info-header">
                  <span className="restaurant-name">{restaurant.name}</span>
                  <span className="restaurant-distance">{restaurant.distance}</span>
                </div>
                <p className="restaurant-rating">{restaurant.rating}</p>
                <p className="restaurant-address">{restaurant.address}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RestaurantListPage;


