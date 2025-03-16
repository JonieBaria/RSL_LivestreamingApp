import { useState, useEffect, useRef } from "react";
import "./App.css";

const IPCameraViewer = () => {
  const [ip, setIp] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [hideUI, setHideUI] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const correctPassword = "1234";

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    startCamera(); // Start camera in fullscreen
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    stopCamera(); // Stop camera when exiting fullscreen
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Failed to access the camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      let tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const handleConnect = () => {
    if (ip) {
      setStreamUrl(`https://${ip}:8080/video`);
    }
  };

  const handleHideUI = () => {
    setHideUI(true);
    setShowPasswordInput(true);
  };

  const handleShowUI = () => {
    if (password === correctPassword) {
      setHideUI(false);
      setShowPasswordInput(false);
      setPassword("");
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <div className={`app ${isFullscreen ? "fullscreen" : ""}`}>
      {/* Fullscreen Controls */}
      {!isFullscreen && (
        <>
          <button onClick={enterFullscreen} className="fullscreen-btn">
            Go Fullscreen
          </button>
          <button onClick={exitFullscreen} className="exit-fullscreen-btn">
            Exit Fullscreen
          </button>
        </>
      )}

      {!hideUI && !isFullscreen && (
        <div className="controls">
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
          <button onClick={handleHideUI} className="btn hide-btn">
            Hide UI
          </button>
        </div>
      )}

      {hideUI && showPasswordInput && !isFullscreen && (
        <div className="password-container">
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
          />
          <button onClick={handleShowUI} className="btn show-ui-btn">
            Show UI
          </button>
        </div>
      )}

      {/* Camera Stream */}
      {isFullscreen && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="video-background"
        ></video>
      )}

      {/* IP Camera Stream */}
      <div className="container">
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
    </div>
  );
};

export default IPCameraViewer;
