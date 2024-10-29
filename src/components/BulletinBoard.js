import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function BulletinBoard() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // localStorage에서 게시글 데이터 불러오기
    const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    setPosts(savedPosts);
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행

  const handleWriteClick = () => {
    navigate('/write-post');
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">게시판</h1>
        <button 
          onClick={handleWriteClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          글쓰기
        </button>
      </div>

      <div className="border rounded-lg">
        {posts.map((post) => (
          <div 
            key={post.id}
            onClick={() => handlePostClick(post.id)}
            className="p-4 border-b hover:bg-gray-50 cursor-pointer"
          >
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <div className="text-sm text-gray-500">{post.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BulletinBoard; 