import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageUpload from './components/image';
import Checkout from './components/checkout';

function App() {
  return (
    <Router>
      <div>
        {}
        <Routes>
          <Route path="/" element={<ImageUpload />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
