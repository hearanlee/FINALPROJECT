import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderPage.css';

const OrderPage = () => {
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    loadOrderItems();
  }, []);

  const loadOrderItems = () => {
    const savedOrder = localStorage.getItem('orderItems');
    if (savedOrder) {
      const items = JSON.parse(savedOrder);
      setOrderItems(items);
      calculateTotals(items);
    }
  };

  const calculateTotals = (items) => {
    const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const price = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalQuantity(quantity);
    setTotalPrice(price);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    const updatedItems = orderItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setOrderItems(updatedItems);
    calculateTotals(updatedItems);
    localStorage.setItem('orderItems', JSON.stringify(updatedItems));
  };

  const removeItem = (id) => {
    const updatedItems = orderItems.filter(item => item.id !== id);
    setOrderItems(updatedItems);
    calculateTotals(updatedItems);
    localStorage.setItem('orderItems', JSON.stringify(updatedItems));
  };

  const clearOrder = () => {
    setOrderItems([]);
    setTotalQuantity(0);
    setTotalPrice(0);
    localStorage.removeItem('orderItems');
  };

  const confirmOrder = () => {
    if (orderItems.length === 0) {
      alert('주문할 항목이 없습니다.');
      return;
    }
    
    alert(`주문이 완료되었습니다!\n총 ${totalQuantity}개, ${totalPrice.toLocaleString()}원`);
    clearOrder();
  };

  const goToMenu = () => {
    navigate('/menu');
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🛒 주문하기</h1>
        <button className="back-btn" onClick={goBack}>← 홈으로</button>
      </div>
      
      <div className="order-content">
        <div className="order-items">
          {orderItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🛒</div>
              <h3>주문 목록이 비어있습니다</h3>
              <p>메뉴에서 원하는 음식을 선택해주세요</p>
              <button className="btn menu" onClick={goToMenu}>메뉴 보러가기</button>
            </div>
          ) : (
            <div className="order-summary">
              <h3>주문 요약</h3>
              <div className="summary-items">
                {orderItems.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p className="item-price">{item.price.toLocaleString()}원</p>
                    </div>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="total-section">
                <div className="total-line">
                  <span>총 수량:</span>
                  <span>{totalQuantity}</span>
                </div>
                <div className="total-line">
                  <span>총 금액:</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
              </div>
              <div className="order-actions">
                <button className="btn secondary" onClick={clearOrder}>
                  주문 초기화
                </button>
                <button className="btn primary" onClick={confirmOrder}>
                  주문 확인
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="footer">
        <button className="btn menu" onClick={goToMenu}>메뉴 더 보기</button>
      </div>
    </div>
  );
};

export default OrderPage;


