import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Sync / verify token with backend on mount
  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data) {
            const user = {
              ...res.data,
              role: res.data.role === 'instructor' ? 'teacher' : res.data.role,
            };
            setCurrentUser(user);
            localStorage.setItem('user', JSON.stringify(user));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err?.message);
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setCurrentUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  /**
   * Log in using email and password via backend API
   */
  const loginWithCredentials = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: rawUser } = res.data;

    const user = {
      ...rawUser,
      role: rawUser.role === 'instructor' ? 'teacher' : rawUser.role,
    };

    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(user));

    setToken(receivedToken);
    setCurrentUser(user);

    return user;
  };

  /**
   * Register a new user via backend API
   */
  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token: receivedToken, user: rawUser } = res.data;

    const user = {
      ...rawUser,
      role: rawUser.role === 'instructor' ? 'teacher' : rawUser.role,
    };

    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(user));

    setToken(receivedToken);
    setCurrentUser(user);

    return user;
  };

  /**
   * Direct login / demo login handler (supports both object and role string)
   */
  const login = (userDataOrRole) => {
    let user;

    if (typeof userDataOrRole === 'string') {
      const roleStr = userDataOrRole.toLowerCase();
      if (roleStr === 'teacher' || roleStr === 'instructor') {
        user = {
          id: 2,
          name: 'Prof. Rajiv Mehta',
          email: 'r.mehta@university.edu',
          role: 'teacher',
          dbRole: 'instructor',
          department: 'Computer Science',
        };
      } else if (roleStr === 'admin') {
        user = {
          id: 1,
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          dbRole: 'admin',
          department: 'Computer Science',
        };
      } else {
        user = {
          id: 5,
          name: 'Aanya Sharma',
          email: 'aanya.sharma@university.edu',
          role: 'student',
          dbRole: 'student',
          studentId: 'CS2023001',
          batch: 'CS-2023-A',
          department: 'Computer Science',
        };
      }
    } else if (userDataOrRole && typeof userDataOrRole === 'object') {
      user = {
        ...userDataOrRole,
        role: userDataOrRole.role === 'instructor' ? 'teacher' : userDataOrRole.role,
      };
    } else {
      user = null;
    }

    if (user) {
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return user;
  };

  /**
   * Logout user and clear tokens
   */
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    currentUser,
    token,
    loading,
    isAuthenticated: !!currentUser,
    login,
    loginWithCredentials,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};