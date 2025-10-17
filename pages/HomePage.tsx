import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MembershipModal from '../components/MembershipModal';

const games = [
  {
    id: 'match3',
    title: '宇宙宝石',
    description: '一款带有宇宙风格的经典三消游戏。对齐宝石，创造恒星爆炸！',
    imageUrl: 'https://picsum.photos/seed/match3/600/400',
    path: '/game/match3',
  },
  {
    id: 'snake',
    title: '赛博贪吃蛇',
    description: '在这个充满霓虹灯的经典游戏中，在数字网格中穿行，消耗数据包，让你的蛇不断成长。',
    imageUrl: 'https://picsum.photos/seed/snake/600/400',
    path: '/game/snake',
  },
];

const GameCard: React.FC<{game: typeof games[0]}> = ({ game }) => {
    return (
        <div className="bg-surface rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 border-2 border-transparent hover:border-secondary hover:shadow-neon">
            <img src={game.imageUrl} alt={game.title} className="w-full h-48 object-cover" />
            <div className="p-6">
                <h3 className="text-2xl font-display text-secondary mb-2">{game.title}</h3>
                <p className="text-text-secondary mb-4">{game.description}</p>
                <Link to={game.path} className="inline-block bg-primary hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 w-full text-center">
                    立即游戏
                </Link>
            </div>
        </div>
    );
}

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-display font-bold text-white mb-4">欢迎来到竞技场</h1>
        <p className="text-lg text-text-secondary">选择你的挑战。只有最强者才能获胜。</p>
      </div>

      {!currentUser?.isMember && (
        <div className="bg-surface p-6 rounded-lg mb-12 text-center shadow-lg border border-primary">
          <h2 className="text-2xl font-bold text-secondary mb-2">解锁你的潜力！</h2>
          <p className="text-text-main mb-4">成为会员，即可无限制地访问我们所有的独家游戏。</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-secondary hover:bg-teal-300 text-background font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-neon"
          >
            立即成为会员！
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {games.map(game => (
            <GameCard key={game.id} game={game} />
        ))}
      </div>
      
      {isModalOpen && <MembershipModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default HomePage;