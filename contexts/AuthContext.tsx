import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User } from '../types';
import * as db from '../services/db';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUserId = sessionStorage.getItem('gemini_game_userid');
      if (storedUserId) {
        const users = db.getUsers();
        const user = users.find(u => u.id === parseInt(storedUserId, 10));
        if (user) {
          const { password, ...userWithoutPassword } = user;
          setCurrentUser(userWithoutPassword);
        }
      }
    } catch (error) {
      console.error("Failed to load user from session storage", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const refreshUser = useCallback(() => {
     if (currentUser) {
        const users = db.getUsers();
        const updatedUser = users.find(u => u.id === currentUser.id);
        if (updatedUser) {
             const { password, ...userWithoutPassword } = updatedUser;
             setCurrentUser(userWithoutPassword);
        }
     }
  }, [currentUser]);

  const login = async (username: string, passwordAttempt: string): Promise<boolean> => {
    const user = db.getUserByUsername(username);
    if (user && user.password === passwordAttempt) {
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      sessionStorage.setItem('gemini_game_userid', user.id.toString());
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('gemini_game_userid');
  };

  const register = async (username: string, passwordAttempt: string): Promise<{ success: boolean; message: string }> => {
    if (db.getUserByUsername(username)) {
      return { success: false, message: '用户名已存在。' };
    }
    const newUser = db.addUser({ username, password: passwordAttempt });
    const { password, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    sessionStorage.setItem('gemini_game_userid', newUser.id.toString());
    return { success: true, message: '注册成功！' };
  };

  const value = { currentUser, loading, login, logout, register, refreshUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};