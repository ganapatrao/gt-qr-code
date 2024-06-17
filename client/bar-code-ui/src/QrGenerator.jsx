import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

import axios from "axios";

const QrGenerator = () => {
  const [sessionId, setSessionId] = useState(null);
  const [counter, setCounter] = useState(0);

  // Fetch session ID from the API
  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/qr"
        );
        setSessionId(response.data.sessionId);
      } catch (error) {
        console.error("Error fetching session ID:", error);
      }
    };

    const intervalId = setInterval(() => {
      if (counter < 3) {
        fetchSessionId();
        setCounter((prevCounter) => prevCounter + 1);
      } else {
        clearInterval(intervalId);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [counter]);

  const handleRetry = () => {
    setCounter(0);
    setSessionId(null);
  };

  return (
    <div>
      <h2>QR Code Generator and Scanner</h2>

      {sessionId ? (
        <>
          <div>
            <h3>Generated QR Code</h3>
            <QRCodeSVG value={sessionId} />
            <p>Session ID: {sessionId}</p>
          </div>
        </>
      ) : counter >= 3 ? (
        <div>
          <button onClick={handleRetry}>Retry</button>
        </div>
      ) : (
        <p>Loading session ID...</p>
      )}
    </div>
  );
};

export default QrGenerator;
