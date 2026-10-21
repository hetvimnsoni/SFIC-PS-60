"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, Play, Pause, Square, Loader2, Sparkles, AlertCircle } from "lucide-react";
import type { SupportedLanguage } from "@/lib/types";

interface AudioPlayerProps {
  text: string;
  language: SupportedLanguage;
  voice?: string;
  className?: string;
  buttonLabel?: string;
}

export function AudioPlayer({
  text,
  language,
  voice,
  className = "",
  buttonLabel = "Listen",
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providerUsed, setProviderUsed] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cachedAudioUrlRef = useRef<string | null>(null);
  const lastTextRef = useRef<string>("");

  // Invalidate cache if text changes
  useEffect(() => {
    if (text !== lastTextRef.current) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      cachedAudioUrlRef.current = null;
      setIsPlaying(false);
      lastTextRef.current = text;
    }
  }, [text]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = async () => {
    setError(null);

    // If currently playing, pause
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.pause();
      }
      setIsPlaying(false);
      return;
    }

    // If audio is already loaded and paused, resume playback
    if (audioRef.current && cachedAudioUrlRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        return;
      } catch (e: any) {
        console.warn("Resume failed, refetching audio:", e);
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          language,
          voice,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.audioBase64) {
        const audioSrc = `data:${data.mimeType || "audio/mp3"};base64,${data.audioBase64}`;
        cachedAudioUrlRef.current = audioSrc;
        setProviderUsed(data.provider || "real_tts");

        const audio = new Audio(audioSrc);
        audioRef.current = audio;

        audio.onended = () => {
          setIsPlaying(false);
        };

        audio.onerror = () => {
          setIsPlaying(false);
          fallbackToBrowserSpeech();
        };

        await audio.play();
        setIsPlaying(true);
      } else {
        // Fallback to browser Web Speech API
        fallbackToBrowserSpeech();
      }
    } catch (err: any) {
      console.warn("TTS API unavailable, falling back to browser synthesis:", err);
      fallbackToBrowserSpeech();
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const fallbackToBrowserSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setError("Speech synthesis not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = {
      gu: "gu-IN",
      hi: "hi-IN",
      en: "en-IN",
      mr: "mr-IN",
      ta: "ta-IN",
    };
    utterance.lang = langMap[language] || "en-IN";
    utterance.rate = 0.95;

    // Find native voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onstart = () => {
      setIsPlaying(true);
      setProviderUsed("browser_speech");
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (e) => {
      setIsPlaying(false);
      setError(`Audio synthesis could not play: ${e.error}`);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={handlePlay}
        disabled={isLoading || !text.trim()}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border shadow-sm cursor-pointer ${
          isPlaying
            ? "bg-[#49352F] text-[#FAF6E9] border-[#49352F]"
            : "bg-[#F4F1E1] hover:bg-[#F2CAB3]/50 text-[#49352F] border-[#49352F]/15 active:scale-95"
        }`}
        title={`Listen to message in ${language.toUpperCase()}`}
        aria-label={`${buttonLabel} audio in ${language}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Loading...</span>
          </>
        ) : isPlaying ? (
          <>
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5" />
            <span>{buttonLabel}</span>
          </>
        )}
      </button>

      {isPlaying && (
        <button
          type="button"
          onClick={handleStop}
          className="p-1 rounded-md text-[#49352F] hover:bg-[#49352F]/10 border border-[#49352F]/15 transition-colors cursor-pointer"
          title="Stop playback"
          aria-label="Stop audio"
        >
          <Square className="w-3 h-3 fill-current" />
        </button>
      )}

      {error && (
        <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          {error}
        </span>
      )}
    </div>
  );
}
