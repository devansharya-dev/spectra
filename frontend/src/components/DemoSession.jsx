import { useEffect, useRef, useState } from "react";

const DemoSession = ({ onExit }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    async function startDevices() {
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

    startDevices();

    return () => stopDevices();
  }, []);

  const stopDevices = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setActive(false);
  };

  const handleExit = () => {
    stopDevices();
    onExit(); // go back to feature cards
  };

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioResult, setAudioResult] = useState(null);
  const [visionResult, setVisionResult] = useState(null);

  const startRecording = () => {
    if (!streamRef.current) return;
    
    // Check if browser supports MediaRecorder
    if (!window.MediaRecorder) {
      setError("MediaRecorder not supported in this browser.");
      return;
    }

    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      try {
        const res = await fetch("http://localhost:5000/api/audio/process", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setAudioResult(data);
      } catch (err) {
        console.error(err);
        setError("Audio processing failed");
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted // Mute video feedback to avoid echo
        className="w-[480px] rounded-lg border border-white/20"
      />

      {active && (
        <p className="text-green-400 text-sm">
          Camera & Mic active
        </p>
      )}

      <div className="flex gap-4">
        <button
          onClick={async () => {
            if (!videoRef.current) return;
            
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
                const res = await fetch("http://localhost:5000/api/infer", {
                  method: "POST",
                  body: formData,
                });
                const data = await res.json();
                setVisionResult(data);
              } catch (err) {
                console.error(err);
                setError("Vision analysis failed");
              }
            }, "image/jpeg");
          }}
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
        >
          Analyze Scene
        </button>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-5 py-2 text-white rounded-md ${
            isRecording ? "bg-red-500 hover:bg-red-400" : "bg-purple-600 hover:bg-purple-500"
          }`}
        >
          {isRecording ? "Stop Listening" : "Start Listening"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {visionResult && (
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Vision Analysis</h3>
            <div className="mb-2">
              <span className="text-gray-400 text-sm">Scene Description:</span>
              <p className="text-white">{visionResult.label}</p>
            </div>
            {visionResult.message && visionResult.message !== "Scene analyzed" && (
              <div>
                <span className="text-gray-400 text-sm">Details:</span>
                <p className="text-green-300">{visionResult.message}</p>
              </div>
            )}
          </div>
        )}

        {audioResult && (
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Audio Analysis</h3>
            <div className="mb-2">
              <span className="text-gray-400 text-sm">Transcript:</span>
              <p className="text-white">{audioResult.transcript}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Translation (ES):</span>
              <p className="text-yellow-300">{audioResult.translation}</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500">{error}</p>
      )}

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
