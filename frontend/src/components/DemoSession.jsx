import { useEffect, useRef, useState } from "react";

// Backend URL kept for future use (not used in demo)
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const DemoSession = ({ onExit }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [active, setActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState("default");

  // =============================
  // START CAMERA
  // =============================
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        setActive(true);
      } catch {
        setError("Camera or microphone permission denied");
      }
    }

    startCamera();
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
  };

  // =============================
  // BUTTON ACTIONS (REAL BACKEND)
  // =============================
  const handleAnalyzeScene = async () => {
    if (!videoRef.current) return;
    setNote("Analyzing scene...");
    setSelectedModel("default");

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("image", blob, "capture.jpg");

      try {
        const res = await fetch(`${API_BASE}/api/infer`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Vision API failed");
        const data = await res.json();
        // Display result in note to keep UI consistent
        setNote(`Analysis: ${data.label || JSON.stringify(data)}`);
      } catch (err) {
        console.error(err);
        setNote("Vision analysis failed");
      }
    }, "image/jpeg");
  };

  const handleStartListening = () => {
    if (!streamRef.current) return;
    
    if (!window.MediaRecorder) {
      setError("MediaRecorder not supported in this browser");
      return;
    }

    setNote("Listening...");
    setIsRecording(true);
    audioChunksRef.current = [];

    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      setNote("Processing audio...");
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      try {
        const res = await fetch(`${API_BASE}/api/audio/process`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Audio API failed");
        const data = await res.json();
        
        // Format result for the existing UI note
        const text = `Transcript: ${data.transcript} | Translation: ${data.translation}`;
        setNote(text);
      } catch (err) {
        console.error(err);
        setNote("Audio processing failed");
      }
    };

    mediaRecorder.start();
  };

  const handleStopListening = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleCustomModel = () => {
    setSelectedModel("custom");
    setNote(
      "Custom model works best in real-world surroundings with proper lighting"
    );
  };

  const handleExit = () => {
    stopCamera();
    onExit();
  };

  // =============================
  // UI
  // =============================
  return (
    <div className="flex flex-col items-center gap-5 mt-6 w-full">
      {/* Camera */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-[460px] rounded-lg border border-white/20"
      />

      {active && (
        <p className="text-xs text-green-400">Camera & microphone active</p>
      )}

      {/* Buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={handleAnalyzeScene}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
        >
          Analyze Scene
        </button>

        <button
          onClick={isRecording ? handleStopListening : handleStartListening}
          className={`px-4 py-2 text-white rounded-md ${
            isRecording
              ? "bg-red-500 hover:bg-red-400"
              : "bg-purple-600 hover:bg-purple-500"
          }`}
        >
          {isRecording ? "Stop Listening" : "Start Listening"}
        </button>

        <button
          onClick={handleCustomModel}
          className={`px-4 py-2 text-white rounded-md ${
            selectedModel === "custom"
              ? "bg-green-600 hover:bg-green-500"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          Custom Model
        </button>
      </div>

      {/* SUBTLE NOTE (NO BOX) */}
      {note && (
        <p className="text-xs text-gray-400 text-center max-w-md">
          {note}
        </p>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        onClick={handleExit}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md"
      >
        Stop Demo
      </button>
    </div>
  );
};

export default DemoSession;
