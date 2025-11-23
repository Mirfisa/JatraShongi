import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Emergency from './pages/Emergency';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
