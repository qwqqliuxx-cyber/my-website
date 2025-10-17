import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-surface shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-display font-bold text-secondary tracking-widest uppercase">
          Gemini 游戏
        </Link>
        <nav className="flex items-center space-x-6">
          {currentUser ? (
            <>
              {currentUser.isAdmin && (
                <Link to="/admin" className="text-text-secondary hover:text-secondary transition-colors duration-300">
                  管理面板
                </Link>
              )}
              <div className="flex items-center space-x-4">
                <span className="text-text-main">欢迎, <span className="font-bold text-secondary">{currentUser.username}</span></span>
                 <span className={`px-3 py-1 text-xs font-bold rounded-full ${currentUser.isMember ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                    {currentUser.isMember ? '会员' : '普通用户'}
                  </span>
                <button
                  onClick={handleLogout}
                  className="bg-primary hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-neon-purple"
                >
                  退出登录
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="bg-primary hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">
              登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;