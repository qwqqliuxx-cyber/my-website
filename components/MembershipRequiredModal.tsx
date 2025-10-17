import React from 'react';

interface MembershipRequiredModalProps {
  onClose: () => void;
}

const MembershipRequiredModal: React.FC<MembershipRequiredModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-surface p-8 rounded-2xl shadow-neon-purple max-w-md w-full text-center border-2 border-primary animate-fade-in">
        <h2 className="text-3xl font-display text-secondary mb-4">会员专属游戏</h2>
        <p className="text-text-secondary mb-6">抱歉，此内容仅限会员访问。请先升级您的账户，以解锁所有独家游戏。</p>
        
        <button
            onClick={onClose}
            className="bg-secondary hover:bg-teal-300 text-background font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-neon"
        >
            返回主页
        </button>
      </div>
    </div>
  );
};

export default MembershipRequiredModal;