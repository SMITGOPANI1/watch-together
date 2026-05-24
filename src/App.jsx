import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import { ThemeProvider } from './context/ThemeContext';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import AppRouter from './routes';

function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <AuthProvider>
          <SocketProvider>
            <ToastProvider>
              <Router>
                <AppRouter />
              </Router>
            </ToastProvider>
          </SocketProvider>
        </AuthProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}

export default App;
