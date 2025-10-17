import React from 'react';
import { useAuth } from '../hooks/useAuth';
import * as db from '../services/db';

interface MembershipModalProps {
  onClose: () => void;
}

const MembershipModal: React.FC<MembershipModalProps> = ({ onClose }) => {
  const { currentUser, refreshUser } = useAuth();

  const handlePayment = () => {
    if (currentUser) {
      db.createPaymentRequest(currentUser.id, currentUser.username, 100);
      alert('付款请求已提交！管理员将很快验证您的付款以激活您的会员资格。');
      refreshUser();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-surface p-8 rounded-2xl shadow-neon-purple max-w-md w-full text-center border-2 border-primary">
        <h2 className="text-3xl font-display text-secondary mb-4">成为会员</h2>
        <p className="text-text-secondary mb-6">扫描下方二维码完成 <span className="font-bold text-white">100</span> 元的付款。付款后，点击下方按钮通知我们的团队。</p>
        
        <div className="bg-white p-4 rounded-lg inline-block mb-6">
          <img src="https://picsum.photos/256/256?grayscale" alt="Payment QR Code" className="w-64 h-64" />
        </div>
        
        <p className="text-sm text-text-secondary mb-6">管理员手动验证付款后，您的会员资格将被激活。</p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handlePayment}
            className="bg-secondary hover:bg-teal-300 text-background font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-neon"
          >
            我已付款
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipModal;