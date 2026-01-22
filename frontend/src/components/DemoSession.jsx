import { useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const DemoSession = ({ onExit }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [active, setActive] = useState(false);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showVisionTip, setShowVisionTip] = useState(false);
  const [showAudioTip, setShowAudioTip] = useState(false);

  // 🔹 Independent results (backend-only)
  const [visionResult, setVisionResult] = useState(null);
  const [audioResult, setAudioResult] = useState(null);
  const [customResult, setCustomResult] = useState(null);

  // =============================
  // START CAMERA + MIC
  // =============================
  useEffect(() => {
    const startDevices = async () => {
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
    };

    startDevices();
    return () => stopDevices();
  }, []);

  const stopDevices = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setActive(false);
  };

  const handleExit = () => {
    stopDevices();
    onExit();
  };

  // =============================
  // VISION → BACKEND
  // =============================
  const handleAnalyzeScene = async () => {
    if (!videoRef.current) return;
    setShowVisionTip(true);

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("image", blob);

      try {
        const res = await fetch(`${API_BASE}/api/infer`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) return;

        const data = await res.json();

        const text =
          data?.label?.trim() ||
          data?.result?.trim() ||
          data?.message?.trim();

        setVisionResult(text ? { text } : null);
      } catch {
        setError("Vision analysis failed");
      }
    }, "image/jpeg");
  };

  // =============================
  // AUDIO → BACKEND
  // =============================
  const startRecording = () => {
    if (!streamRef.current || !window.MediaRecorder) return;
    setShowAudioTip(true);

    const recorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", audioBlob);

      try {
        const res = await fetch(`${API_BASE}/api/audio/process`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) return;

        const data = await res.json();
        setAudioResult(data?.transcript?.trim() ? data : null);
      } catch {
        setError("Audio processing failed");
      }
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // =============================
  // CUSTOM MODEL → BACKEND
  // =============================
  const handleCustomModel = async () => {
    if (!videoRef.current) return;
    setShowVisionTip(true);

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("image", blob);

      try {
        const res = await fetch(`${API_BASE}/api/custom/infer`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) return;

        const data = await res.json();

        const text =
          data?.result?.trim() ||
          data?.label?.trim() ||
          data?.message?.trim();

        setCustomResult(text ? { text } : null);
      } catch {
        setError("Custom model failed");
      }
    }, "image/jpeg");
  };

  // =============================
  // UI
  // =============================
  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-[480px] rounded-lg border border-white/20"
      />

      {active && <p className="text-green-400 text-sm">Camera & Mic active</p>}

      {/* TIP BOXES */}
      <div className="flex flex-col gap-2 w-[480px]">
        {showVisionTip && (
          <div className="p-3 bg-blue-900/40 border border-blue-500/50 rounded text-xs text-blue-200">
            Tip: The environment should be well lit and camera well positioned.
          </div>
        )}
        {showAudioTip && (
          <div className="p-3 bg-purple-900/40 border border-purple-500/50 rounded text-xs text-purple-200">
            Speak in English; the STT and translation will happen automatically into Spanish. 
            <br />
            <span className="opacity-70 italic text-[10px]">Note: For simplicity and demo purpose, the model working of all 3 features are limited.</span>
          </div>
        )}
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4">
        <button
          onClick={handleAnalyzeScene}
          className="px-5 py-2 bg-blue-600 text-white rounded-md"
        >
          Analyze Scene
        </button>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-5 py-2 text-white rounded-md ${
            isRecording ? "bg-red-500" : "bg-purple-600"
          }`}
        >
          {isRecording ? "Stop Listening" : "Start Listening"}
        </button>

        <button
          onClick={handleCustomModel}
          className="px-5 py-2 bg-green-600 text-white rounded-md"
        >
          Custom Model
        </button>
      </div>

      {/* ANALYSIS BOXES (BACKEND ONLY) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl mt-4">
        {visionResult?.text && (
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-blue-300 font-semibold mb-2">
              Vision Analysis
            </h3>
            <p className="text-white">{visionResult.text}</p>
          </div>
        )}

        {audioResult?.transcript?.trim() && (
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-purple-300 font-semibold mb-2">
              Audio Analysis
            </h3>
            <p className="text-white">{audioResult.transcript}</p>
            {audioResult.translation?.trim() && (
              <p className="text-yellow-300">
                {audioResult.translation}
              </p>
            )}
          </div>
        )}

        {customResult?.text && (
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-green-300 font-semibold mb-2">
              Custom Model Analysis
            </h3>
            <p className="text-white">{customResult.text}</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleExit}
        className="mt-4 px-5 py-2 bg-red-600 text-white rounded-md"
      >
        Stop Demo
      </button>
    </div>
  );
};

export default DemoSession;