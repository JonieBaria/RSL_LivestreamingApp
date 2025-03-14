import { useState } from "react";
import "./App.css"; // Import the CSS file

const IPCameraViewer = () => {
  const [ip, setIp] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [hideUI, setHideUI] = useState(false);

  const handleConnect = () => {
    if (ip) {
      setStreamUrl(`http://${ip}:8080/video`);
    }
  };

  return (
    <div className="container">
      {!hideUI && (
        <>
          <h2>IP Webcam Viewer</h2>
          <input
            type="text"
            placeholder="Enter IP (e.g., 192.168.1.100)"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="input-box"
          />
          <button onClick={handleConnect} className="btn">
            Connect
          </button>
          <button onClick={() => setHideUI(true)} className="btn hide-btn">
            Hide UI
          </button>
        </>
      )}
      <div className="video-container">
        {streamUrl ? (
          <img
            src={streamUrl}
            alt="IP Webcam Stream"
            className="webcam-stream"
          />
        ) : (
          !hideUI && <p>Enter the IP address and click Connect.</p>
        )}
      </div>
    </div>
  );
};

export default IPCameraViewer;
