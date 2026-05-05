import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const useSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const s = io(url || '/'); // Relative to current host
    socketRef.current = s;
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [url]);

  return socket;
};

export default useSocket;
