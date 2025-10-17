import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const INVITATION_CODE = '000001';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (inviteCode !== INVITATION_CODE) {
      setError('无效的邀请码。');
      return;
    }

    if (!username || !password) {
        setError('请输入用户名和密码。');
        return;
    }
    
    const result = await register(username, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-neon-purple border-2 border-primary">
        <h2 className="text-4xl font-display text-center text-secondary mb-8">注册</h2>
        {error && <p className="bg-red-500 text-white p-3 rounded-md mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username"  className="block text-sm font-bold text-text-secondary mb-2">用户名</label>
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
          <div>
            <label htmlFor="inviteCode" className="block text-sm font-bold text-text-secondary mb-2">邀请码</label>
            <input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full bg-background border-2 border-primary focus:border-secondary focus:ring-0 rounded-lg p-3 text-text-main"
              placeholder="例如, 000001"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-secondary hover:bg-teal-300 text-background font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-neon"
          >
            创建账户
          </button>
        </form>
        <p className="text-center mt-6 text-text-secondary">
          已有账户？ <Link to="/login" className="font-bold text-secondary hover:underline">在此登录</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;