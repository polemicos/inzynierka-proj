import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cars from './pages/Cars';
import Info from './pages/Info';
import DetectPlate from './pages/DetectPlates';
import './App.css';
const App = () => (
  <Router>
    <div className="App">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detect" element={<DetectPlate />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </div>
      <Footer />
    </div>
  </Router>
);

export default App;
