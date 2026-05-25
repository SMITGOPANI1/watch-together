import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { SOCKET_EVENTS } from '../constants/socketEvents';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // If there is no authenticated user, disconnect any active socket and clear
    if (!currentUser) {
      if (socketRef.current) {
        console.log('[SOCKET CLIENT]: Disconnecting socket due to user logout');
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Determine target socket host
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    const socketURL = import.meta.env.VITE_SOCKET_URL || apiURL.replace('/api/v1', '') || 'http://localhost:5000';

    console.log(`[SOCKET CLIENT]: Initializing connection to ${socketURL}`);

    // Retrieve active Firebase token or fallback to developer mock token
    let token = localStorage.getItem('watchhive_token');
    if (!token) {
      token = `mock_jwt_${currentUser.uid || currentUser.id || 'guest'}`;
      localStorage.setItem('watchhive_token', token);
    }

    // Initialize socket connection with token authorization handshake
    const socketInstance = io(socketURL, {
      auth: {
        token
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 10000,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    // Bind basic connection lifecycle handlers
    socketInstance.on('connect', () => {
      console.log('[SOCKET CLIENT]: Connected successfully! ID:', socketInstance.id);
      setConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('[SOCKET CLIENT]: Disconnected. Reason:', reason);
      setConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('[SOCKET CLIENT]: Connection failed:', error.message);
      setConnected(false);
    });

    // Cleanup on unmount or user change
    return () => {
      console.log('[SOCKET CLIENT]: Cleaning up socket connection...');
      socketInstance.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
    };
  }, [currentUser]);

  // Expose socket, connection state, and basic helpers
  const value = {
    socket,
    connected,
    emit: (event, data) => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit(event, data);
      } else {
        console.warn(`[SOCKET CLIENT WARNING]: Emitter skipped. Sockets disconnected. Event: "${event}"`);
      }
    },
    on: (event, callback) => {
      if (socketRef.current) {
        socketRef.current.on(event, callback);
      }
    },
    off: (event, callback) => {
      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    }
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
