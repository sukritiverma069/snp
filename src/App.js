import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import UserInfo from './pages/UserInfo';
import Dashboard from './pages/Dashboard';
import InactivityDialog from './components/InactivityDialog';
import { ProtectedRoute } from './routes';
import { useAuth } from './stores';
import useInactivityHook from './hooks/useInactivityHook';

function App() {
  const { isAuthenticated } = useAuth();

  const {
    showDialog,
    timeLeft,
    extendSession,
    forceLogout
  } = useInactivityHook(20 * 60 * 1000);

  const handleExtendSession = () => {
    extendSession();
  };

  return (
    <Router>
      <div className="App">
        <InactivityDialog
          isVisible={showDialog}
          timeLeft={timeLeft}
          onExtendSession={handleExtendSession}
          onLogout={forceLogout}
        />

        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserInfo />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
            }
          />

          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
