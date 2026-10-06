import { createContext, useContext, useState } from 'react';
import { users } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (role) => {
    const user = role === 'teacher'
      ? users.find(u => u.role === 'teacher')
      : users.find(u => u.role === 'student');
    setCurrentUser(user);
    return user;
  };

  const loginWithCredentials = (email, _password) => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false };
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, loginWithCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
