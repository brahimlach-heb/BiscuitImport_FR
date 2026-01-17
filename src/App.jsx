import React, { useState } from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div style={{
      display: isLoggedIn ? 'block' : 'flex',
      justifyContent: isLoggedIn ? 'unset' : 'center',
      alignItems: isLoggedIn ? 'unset' : 'center',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {!isLoggedIn && <AnimatedBackground />}

      {isLoggedIn ? (
        <HomePage onLogout={handleLogout} />
      ) : (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
