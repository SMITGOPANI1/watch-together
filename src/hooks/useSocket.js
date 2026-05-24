import { useSocket as useSocketFromContext } from '../context/SocketContext';

/**
 * Custom hook to consume the SocketContext client.
 * Exposes:
 * - socket: Raw socket.io-client instance
 * - connected: Connection status boolean
 * - emit(event, data): Secure emiter helper
 * - on(event, callback): Listener registration helper
 * - off(event, callback): Listener cleanup helper
 */
export const useSocket = () => {
  return useSocketFromContext();
};

export default useSocket;
