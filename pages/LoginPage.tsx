import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('请输入用户名和密码。');
      return;
    }
    const success = await login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('用户名或密码无效。');
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-neon-purple border-2 border-primary">
        <h2 className="text-4xl font-display text-center text-secondary mb-8">登录</h2>
        {error && <p className="bg-red-500 text-white p-3 rounded-md mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-text-secondary mb-2">用户名</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-background border-2 border-primary focus:border-secondary focus:ring-0 rounded-lg p-3 text-text-main"
              required
            />
          </div>
          <div>
            <label htmlFor="password"  className="block text-sm font-bold text-text-secondary mb-2">密码</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border-2 border-primary focus:border-secondary focus:ring-0 rounded-lg p-3 text-text-main"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-secondary hover:bg-teal-300 text-background font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-neon"
          >
            登录
          </button>
        </form>
        <p className="text-center mt-6 text-text-secondary">
          还没有账户？ <Link to="/register" className="font-bold text-secondary hover:underline">在此注册</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;