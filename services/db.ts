
import type { User, PaymentRequest } from '../types';

const USERS_KEY = 'gemini_game_users';
const PAYMENTS_KEY = 'gemini_game_payments';

const initializeDatabase = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const adminUser: User = {
      id: 1,
      username: 'admin',
      password: 'adminpassword',
      isMember: true,
      isAdmin: true,
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([adminUser]));
  }
  if (!localStorage.getItem(PAYMENTS_KEY)) {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify([]));
  }
};

initializeDatabase();

// --- User Management ---

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUserByUsername = (username: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.username === username);
};

export const addUser = (user: Omit<User, 'id' | 'isMember' | 'isAdmin'>): User => {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    isMember: false,
    isAdmin: false,
  };
  saveUsers([...users, newUser]);
  return newUser;
};

export const updateUserMembership = (userId: number, isMember: boolean): User | undefined => {
  let users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].isMember = isMember;
    saveUsers(users);
    return users[userIndex];
  }
  return undefined;
};


// --- Payment Management ---

export const getPaymentRequests = (): PaymentRequest[] => {
  const payments = localStorage.getItem(PAYMENTS_KEY);
  return payments ? JSON.parse(payments) : [];
};

export const savePaymentRequests = (payments: PaymentRequest[]) => {
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
};

export const createPaymentRequest = (userId: number, username: string, amount: number): PaymentRequest => {
  const payments = getPaymentRequests();
  const existingPending = payments.find(p => p.userId === userId && p.status === 'pending');
  if (existingPending) {
    return existingPending;
  }
  const newPayment: PaymentRequest = {
    id: payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1,
    userId,
    username,
    amount,
    status: 'pending',
    date: new Date().toISOString(),
  };
  savePaymentRequests([...payments, newPayment]);
  return newPayment;
};

export const verifyPaymentRequest = (paymentId: number): boolean => {
  const payments = getPaymentRequests();
  const paymentIndex = payments.findIndex(p => p.id === paymentId);
  if (paymentIndex !== -1) {
    payments[paymentIndex].status = 'verified';
    savePaymentRequests(payments);
    // Grant membership
    updateUserMembership(payments[paymentIndex].userId, true);
    return true;
  }
  return false;
};
   