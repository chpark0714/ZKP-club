import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import BulletinBoard from './components/BulletinBoard';
import WritePost from './components/WritePost';
import PostDetail from './components/PostDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/bulletin-board" element={<BulletinBoard />} />
        <Route path="/write-post" element={<WritePost />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </Router>
  );
}

export default App;