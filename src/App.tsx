import { useEffect, useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { authService } from './services/authService';
import type { User } from './types/auth';

export default function App() {
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authService.isAuthenticated());

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return <DashboardPage user={user} onLogout={handleLogout} />;
}
