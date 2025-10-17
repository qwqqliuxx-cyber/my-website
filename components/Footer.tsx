import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface mt-auto py-4">
      <div className="container mx-auto px-4 text-center text-text-secondary">
        <p>&copy; {new Date().getFullYear()} Gemini 游戏世界. 版权所有.</p>
        <p className="text-sm mt-1">由 React, Tailwind CSS, 和 Gemini 驱动</p>
      </div>
    </footer>
  );
};

export default Footer;