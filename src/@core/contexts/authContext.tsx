'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { JwtPayload } from '@/server/security/jwt';

type AuthContextType = {
  user: JwtPayload | null;
  login: (data: { email: string; password: string; tenantCode: string }) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  getProfile: async () => {}
});

export const AuthProvider = ({ children, initialUser }: { children: ReactNode; initialUser?: JwtPayload | null }) => {
  const [user, setUser] = useState<JwtPayload | null>(initialUser ?? null);
  const router = useRouter();

  const login = async (data: { email: string; password: string; tenantCode: string }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      throw new Error('Invalid credentials');
    }
    const profile = await res.json();
    setUser(profile);
    router.push('/dashboard');
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  const getProfile = async () => {
    const res = await fetch('/api/me');
    if (res.ok) {
      const profile = await res.json();
      setUser(profile);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, getProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
