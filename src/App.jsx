import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import MapPage from './pages/MapPage/MapPage';
import MenuPage from './pages/MenuPage/MenuPage';
import OrderPage from './pages/OrderPage/OrderPage';
import LoadingPage from './pages/LoadingPage/LoadingPage';
import MapSearchPage from './pages/MapSearchPage/MapSearchPage';
import MenuStep2Page from './pages/MenuStep2Page/MenuStep2Page';
import MenuStep3Page from './pages/MenuStep3Page/MenuStep3Page';
import MenuStep4Page from './pages/MenuStep4Page/MenuStep4Page';
import MenuResultPage from './pages/MenuResultPage/MenuResultPage';
import VoiceGuidePage from './pages/VoiceGuidePage/VoiceGuidePage';
import MyInfoPage from './pages/MyInfoPage/MyInfoPage';
import NavigationPage from './pages/NavigationPage/NavigationPage';
import RestaurantListPage from './pages/RestaurantListPage/RestaurantListPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage/RestaurantDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/map-search" element={<MapSearchPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu-step2" element={<MenuStep2Page />} />
          <Route path="/menu-step3" element={<MenuStep3Page />} />
          <Route path="/menu-step4" element={<MenuStep4Page />} />
          <Route path="/menu-result" element={<MenuResultPage />} />
          <Route path="/voice-guide" element={<VoiceGuidePage />} />
          <Route path="/my-info" element={<MyInfoPage />} />
          <Route path="/navigation" element={<NavigationPage />} />
          <Route path="/restaurant-list" element={<RestaurantListPage />} />
          <Route path="/restaurant-detail" element={<RestaurantDetailPage />} />
          <Route path="/order" element={<OrderPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
