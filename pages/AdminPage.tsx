import React, { useState, useEffect, useCallback } from 'react';
import type { User, PaymentRequest } from '../types';
import * as db from '../services/db';

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [view, setView] = useState<'users' | 'payments'>('users');

  const fetchData = useCallback(() => {
    // Omitting password from display
    const allUsers = db.getUsers().map(({ password, ...user }) => user);
    setUsers(allUsers);
    setPayments(db.getPaymentRequests());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprovePayment = (paymentId: number) => {
    const success = db.verifyPaymentRequest(paymentId);
    if (success) {
      alert('付款已验证，会员资格已激活！');
      fetchData(); // Refresh data
    } else {
      alert('验证付款时出错。');
    }
  };

  return (
    <div className="bg-surface p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl font-display text-secondary mb-6">管理员后台</h1>
      <div className="flex space-x-4 mb-6 border-b-2 border-primary pb-2">
        <button 
          onClick={() => setView('users')}
          className={`py-2 px-4 font-bold rounded-t-lg ${view === 'users' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-background'}`}
        >
          注册用户 ({users.length})
        </button>
        <button 
          onClick={() => setView('payments')}
          className={`py-2 px-4 font-bold rounded-t-lg ${view === 'payments' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-background'}`}
        >
          会员付款 ({payments.filter(p => p.status === 'pending').length} 待处理)
        </button>
      </div>

      {view === 'users' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">用户管理</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-background rounded-md">
              <thead className="border-b border-primary">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">用户名</th>
                  <th className="p-4">会员状态</th>
                  <th className="p-4">管理员状态</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-gray-700">
                    <td className="p-4">{user.id}</td>
                    <td className="p-4 font-semibold">{user.username}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${user.isMember ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                        {user.isMember ? '已激活' : '未激活'}
                      </span>
                    </td>
                    <td className="p-4">{user.isAdmin ? '是' : '否'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'payments' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">付款验证</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-background rounded-md">
              <thead className="border-b border-primary">
                <tr>
                  <th className="p-4">付款ID</th>
                  <th className="p-4">用户名</th>
                  <th className="p-4">金额</th>
                  <th className="p-4">日期</th>
                  <th className="p-4">状态</th>
                  <th className="p-4">操作</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id} className="border-b border-gray-700">
                    <td className="p-4">{payment.id}</td>
                    <td className="p-4 font-semibold">{payment.username}</td>
                    <td className="p-4">{payment.amount}</td>
                    <td className="p-4">{new Date(payment.date).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${payment.status === 'verified' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                        {payment.status === 'verified' ? '已验证' : '待验证'}
                      </span>
                    </td>
                    <td className="p-4">
                      {payment.status === 'pending' && (
                        <button
                          onClick={() => handleApprovePayment(payment.id)}
                          className="bg-secondary hover:bg-teal-300 text-background font-bold py-1 px-3 rounded"
                        >
                          验证
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;