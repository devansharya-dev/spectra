import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const DemoSession = ({ onExit, mode }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [active, setActive] = useState(false);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  
  // Tips State
  const [showVisionTip, setShowVisionTip] = useState(false);
  const [showAudioTip, setShowAudioTip] = useState(false);

  // Unified State
  const [activeResult, setActiveResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setActive(true);
      } catch {
        setError("Camera or microphone permission denied");
      }
    };

    startDevices();
    return () => stopDevices();
  }, []);

  // =============================
  // PROACTIVE AUTO-RUN
  // =============================
  useEffect(() => {
    if (!active || !mode) return;

    const timer = setTimeout(() => {
      if (mode === "AI Insights") {
        handleAnalyzeScene();
      } else if (mode === "Live Demo") {
        if (!isRecording) startRecording();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [active, mode]); // eslint-disable-line react-hooks/exhaustive-deps

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
  // HANDLERS
  // =============================
  
  const handleAnalyzeScene = async () => {
    if (!videoRef.current) return;
    setLoading(true);
    setActiveResult(null);
    setShowVisionTip(true); // Restore Tip
    setShowAudioTip(false);

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) { setLoading(false); return; }
      const formData = new FormData();
      formData.append("image", blob);

      try {
        const res = await fetch(`${API_BASE}/api/infer`, { method: "POST", body: formData });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        const text = data?.label?.trim() || data?.result?.trim() || data?.message?.trim();
        if (text) setActiveResult({ type: 'vision', data: { text } });
      } catch {
        setError("Vision analysis failed");
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  const startRecording = () => {
    if (!streamRef.current || !window.MediaRecorder) return;
    setActiveResult(null);
    setShowAudioTip(true); // Restore Tip
    setShowVisionTip(false);
    
    const recorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      setLoading(true);
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", audioBlob);

      try {
        const res = await fetch(`${API_BASE}/api/audio/process`, { method: "POST", body: formData });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (data?.transcript?.trim()) setActiveResult({ type: 'audio', data });
      } catch {
        setError("Audio processing failed");
      } finally {
        setLoading(false);
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

  const handleCustomModel = async () => {
    if (!videoRef.current) return;
    setLoading(true);
    setActiveResult(null);
    setShowVisionTip(true); // Re-use vision tip for custom model
    setShowAudioTip(false);

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) { setLoading(false); return; }
      const formData = new FormData();
      formData.append("image", blob);

      try {
        const res = await fetch(`${API_BASE}/api/custom/infer`, { method: "POST", body: formData });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        const text = data?.result?.trim() || data?.label?.trim() || data?.message?.trim();
        if (text) setActiveResult({ type: 'custom', data: { text } });
      } catch {
        setError("Custom model failed");
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  // =============================
  // UI
  // =============================
  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-[#080808] overflow-hidden font-sans">
      
      {/* LEFT: Video Feed (Takes remaining space) */}
      <div className="relative w-full md:flex-1 bg-black overflow-hidden order-1">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover opacity-100"
        />
        
        {/* Active Indicator Overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
           <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></div>
           <span className="text-[9px] uppercase tracking-widest text-white font-bold">
             {active ? (mode ? `Live Feed • ${mode}` : 'Live Feed') : 'Offline'}
           </span>
        </div>
      </div>

      {/* RIGHT: Control Panel (Fixed width on Desktop, Flowing on Mobile) */}
      <div className="w-full md:w-[340px] lg:w-[400px] bg-[#0c0c0c] border-t md:border-t-0 md:border-l border-white/10 flex flex-col p-6 order-2 shrink-0 overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xl md:text-2xl font-['BebasNeue'] tracking-widest text-white uppercase italic flex items-center gap-2">
             Command Center
             {mode && <span className="text-[9px] not-italic font-bold text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded bg-cyan-900/10 tracking-widest">AUTO</span>}
           </h3>
           {loading && (
             <span className="text-[9px] uppercase tracking-widest text-cyan-400 animate-pulse">Processing...</span>
           )}
        </div>

        {/* Output Display Area */}
        <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-4 md:p-5 mb-6 min-h-[160px]">
          {!activeResult && !loading ? (
             <div className="h-full flex flex-col items-center justify-center text-zinc-600 min-h-[100px]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-center">System Idle</p>
             </div>
          ) : (
             <div className="animate-in fade-in zoom-in-95 duration-300">
               {activeResult?.type === 'vision' && (
                 <>
                   <span className="text-[9px] uppercase tracking-[0.2em] text-cyan-500 mb-2 block">Detected Object</span>
                   <h2 className="text-2xl md:text-3xl text-white font-light leading-none">{activeResult.data.text}</h2>
                 </>
               )}
               {activeResult?.type === 'audio' && (
                 <>
                   <span className="text-[9px] uppercase tracking-[0.2em] text-purple-500 mb-2 block">Transcription</span>
                   <p className="text-zinc-300 italic mb-4 text-sm md:text-base">"{activeResult.data.transcript}"</p>
                   {activeResult.data.translation && (
                     <div className="border-t border-white/10 pt-3">
                       <span className="text-[9px] uppercase tracking-[0.2em] text-yellow-500 mb-1 block">Spanish</span>
                       <p className="text-base md:text-lg text-white font-medium">{activeResult.data.translation}</p>
                     </div>
                   )}
                 </>
               )}
               {activeResult?.type === 'custom' && (
                 <>
                   <span className="text-[9px] uppercase tracking-[0.2em] text-green-500 mb-2 block">Custom Model</span>
                   <h2 className="text-xl md:text-2xl text-white font-mono">{activeResult.data.text}</h2>
                 </>
               )}
             </div>
          )}
        </div>

        {/* Restored Tips & Notices */}
        <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
           <div className="p-2 md:p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
             <p className="text-[9px] md:text-[10px] text-zinc-500 leading-relaxed text-center">
               Note: For simplicity and demo purpose, the model working of all 3 features are limited.
             </p>
           </div>
           
           <AnimatePresence>
             {showVisionTip && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                 <div className="p-2 md:p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                   <p className="text-[9px] md:text-[10px] text-blue-200/80 text-center">
                     Tip: The environment should be well lit and camera well positioned.
                   </p>
                 </div>
               </motion.div>
             )}
             
             {showAudioTip && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                 <div className="p-2 md:p-3 bg-purple-900/10 border border-purple-500/20 rounded-lg">
                   <p className="text-[9px] md:text-[10px] text-purple-200/80 text-center">
                     Speak in English; the STT and translation will happen automatically into Spanish.
                   </p>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Buttons - Strictly Premium Style */}
        <div className="flex flex-col gap-2 md:gap-3 mt-auto">
           <button 
             onClick={handleAnalyzeScene}
             disabled={loading}
             className="group relative w-full py-3 md:py-4 bg-zinc-900 border border-zinc-700 rounded-full overflow-hidden transition-all duration-300 hover:border-white hover:bg-white"
           >
             <span className="relative z-10 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-white group-hover:text-black transition-colors">Analyze Scene</span>
           </button>
           
           <button 
             onClick={isRecording ? stopRecording : startRecording}
             disabled={loading && !isRecording}
             className={`group relative w-full py-3 md:py-4 border rounded-full overflow-hidden transition-all duration-300 ${isRecording ? 'bg-red-900/20 border-red-500' : 'bg-zinc-900 border-zinc-700 hover:border-white hover:bg-white'}`}
           >
             <span className={`relative z-10 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold transition-colors ${isRecording ? 'text-red-400' : 'text-white group-hover:text-black'}`}>
               {isRecording ? 'Stop Listening' : 'Start Listening'}
             </span>
           </button>

           <button 
             onClick={handleCustomModel}
             disabled={loading}
             className="group relative w-full py-3 md:py-4 bg-zinc-900 border border-zinc-700 rounded-full overflow-hidden transition-all duration-300 hover:border-white hover:bg-white"
           >
             <span className="relative z-10 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-white group-hover:text-black transition-colors">Custom Model</span>
           </button>
        </div>
        
        {/* Error Toast */}
        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex justify-between items-center">
             <span className="text-[10px] text-red-300">{error}</span>
             <button onClick={() => setError(null)} className="text-red-300 hover:text-white">✕</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DemoSession;