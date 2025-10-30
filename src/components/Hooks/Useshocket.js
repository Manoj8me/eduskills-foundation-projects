import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = new WebSocket(
        "wss://erpapi.eduskillsfoundation.org/ws/1"
      );

      socketRef.current.onopen = () => {
        console.log("✅ WebSocket connected");
      };

      socketRef.current.onmessage = (event) => {
        console.log("📩 Message received in Provider:", event.data);
        setLastMessage(event.data); // store latest message
      };

      socketRef.current.onclose = () => {
        console.log("❌ WebSocket disconnected");
      };

      socketRef.current.onerror = (error) => {
        console.error("⚠️ WebSocket error:", error);
      };
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [socketRef]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, lastMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
