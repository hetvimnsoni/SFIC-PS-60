"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, X, Loader2, AlertCircle, Sparkles, Volume2 } from "lucide-react";
import type { SupportedLanguage } from "@/lib/types";

interface AudioRecorderProps {
  language?: SupportedLanguage;
  onTranscript: (text: string) => void;
  className?: string;
  buttonLabel?: string;
}

export function AudioRecorder({
  language = "en",
  onTranscript,
  className = "",
  buttonLabel = "Voice Input",
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    setError(null);
    setPermissionDenied(false);
    audioChunksRef.current = [];
    setRecordingDuration(0);

    // Try standard MediaRecorder for real audio capture & server API upload
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          // Stop all stream tracks to release microphone
          stream.getTracks().forEach((track) => track.stop());

          if (audioChunksRef.current.length === 0) return;
          const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
          await uploadAndTranscribe(audioBlob);
        };

        mediaRecorder.start();
        setIsRecording(true);

        timerRef.current = setInterval(() => {
          setRecordingDuration((prev) => {
            if (prev >= 120) {
              // Auto-stop at 2 minutes
              stopRecording();
              return prev;
            }
            return prev + 1;
          });
        }, 1000);
        return;
      } catch (err: any) {
        console.warn("MediaRecorder permission or device error:", err);
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setPermissionDenied(true);
          setError("Microphone permission was denied. Please allow microphone access in your browser settings.");
          return;
        }
      }
    }

    // Fallback: Web Speech API (if browser supports and MediaRecorder unavailable)
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        speechRecognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = false;

        const langMap: Record<string, string> = {
          gu: "gu-IN",
          hi: "hi-IN",
          en: "en-IN",
        };
        recognition.lang = langMap[language] || "en-IN";

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0]?.[0]?.transcript;
          if (transcript) {
            onTranscript(transcript);
          }
        };

        recognition.onerror = (e: any) => {
          setError(`Speech recognition notice: ${e.error || "Recognition failed"}`);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        return;
      } catch (e: any) {
        setError(`Speech recognition could not start: ${e.message}`);
      }
    } else {
      setError("Audio recording is not supported in this browser environment. Please type your message.");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }

    setIsRecording(false);
  };

  const cancelRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    audioChunksRef.current = [];
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stream?.getTracks().forEach((t) => t.stop());
      mediaRecorderRef.current = null;
    }

    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.abort();
      speechRecognitionRef.current = null;
    }

    setIsRecording(false);
    setRecordingDuration(0);
  };

  const uploadAndTranscribe = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("language", language);

      const res = await fetch("/api/ai/speech-to-text", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Speech transcription failed.");
      }

      if (data.transcription && data.transcription.trim()) {
        onTranscript(data.transcription.trim());
      } else {
        setError("No clear speech detected in recording. Please try speaking closer to the microphone.");
      }
    } catch (err: any) {
      console.error("Transcription error:", err);
      setError(err.message || "Could not transcribe audio. You can still type your notice manually.");
    } finally {
      setIsProcessing(false);
      setRecordingDuration(0);
    }
  };

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      {!isRecording && !isProcessing && (
        <button
          type="button"
          onClick={startRecording}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F4F1E1] hover:bg-[#F2CAB3]/40 text-[#49352F] border border-[#49352F]/15 transition-all shadow-sm active:scale-95 cursor-pointer"
          title={`Click to record voice in ${language.toUpperCase()}`}
          aria-label={buttonLabel}
        >
          <Mic className="w-3.5 h-3.5 text-[#49352F]" />
          <span>{buttonLabel}</span>
        </button>
      )}

      {isRecording && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-800 border border-red-200 shadow-sm animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <span className="font-mono font-bold text-red-700">{formatDuration(recordingDuration)}</span>
          <span className="text-[11px] text-red-600 font-semibold uppercase tracking-wider">
            Recording ({language})
          </span>

          <button
            type="button"
            onClick={stopRecording}
            className="p-1 rounded hover:bg-red-200 text-red-900 transition-colors ml-1 cursor-pointer"
            title="Stop and transcribe"
            aria-label="Stop recording"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>

          <button
            type="button"
            onClick={cancelRecording}
            className="p-1 rounded hover:bg-red-200 text-red-700 transition-colors cursor-pointer"
            title="Cancel recording"
            aria-label="Cancel recording"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F2CAB3]/30 text-[#49352F] border border-[#49352F]/15 shadow-sm">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#49352F]" />
          <span className="font-semibold">Transcribing speech with AI...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-amber-800 hover:text-amber-950 p-0.5 ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
