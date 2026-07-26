import React, { useEffect, useRef, useState } from 'react';
import { Mic, Video as VideoIcon, Square } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoPreviewProps {
  mode?: 'preview' | 'record' | 'playback';
  isRecording?: boolean;
  timeRemaining?: number;
  videoBlob?: Blob | null;
  autoPlay?: boolean;
  onStop?: () => void;
  onRecordingComplete?: (blob: Blob) => void;
  onStreamReady?: (stream: MediaStream) => void;
  onEnded?: () => void;
}

export function VideoPreview({
  mode = 'preview',
  isRecording = true,
  timeRemaining,
  videoBlob,
  autoPlay = true,
  onStop,
  onRecordingComplete,
  onStreamReady,
  onEnded,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Camera setup — runs once per mode mount ──────────────────────────────
  useEffect(() => {
    if (mode === 'playback') {
      if (videoRef.current && videoBlob) {
        videoRef.current.src = URL.createObjectURL(videoBlob);
      }
      return;
    }

    let cancelled = false;

    async function setup() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: 'user' },
          audio: true,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        onStreamReady?.(stream);

        // In record mode: start MediaRecorder immediately once stream is ready
        if (mode === 'record') {
          startRecording(stream);
        }
      } catch (_err) {
        if (!cancelled) {
          setError(
            'Could not access camera or microphone. Please check your permissions and try again.'
          );
        }
      }
    }

    setup();

    return () => {
      cancelled = true;
      stopMediaRecorder();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // ── Stop recording when isRecording flips to false ───────────────────────
  useEffect(() => {
    if (mode !== 'record') return;
    if (!isRecording) {
      stopMediaRecorder();
    }
  }, [isRecording, mode]);

  function startRecording(stream: MediaStream) {
    chunksRef.current = [];

    const mimeType = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ].find((t) => MediaRecorder.isTypeSupported(t)) ?? '';

    try {
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        onRecordingComplete?.(blob);
        mediaRecorderRef.current = null;
      };

      recorder.start(100); // collect data every 100 ms for a responsive stop
    } catch (err) {
      console.error('MediaRecorder start failed:', err);
    }
  }

  function stopMediaRecorder() {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center text-center p-8 bg-gray-800">
          <p className="text-white text-base leading-relaxed">{error}</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay={autoPlay}
            playsInline
            muted={mode !== 'playback'}
            controls={mode === 'playback'}
            onEnded={onEnded}
            className={`w-full h-full object-cover ${
              mode !== 'playback' ? 'scale-x-[-1]' : ''
            }`}
          />

          {/* Recording overlay */}
          {mode === 'record' && (
            <>
              {/* Red dot + timer */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
                <span className="text-white font-mono text-sm font-semibold tracking-widest">
                  {timeRemaining !== undefined
                    ? formatTime(timeRemaining)
                    : '00:45'}
                </span>
              </div>

              {/* Mic icon bottom-left */}
              <div className="absolute bottom-5 left-5">
                <div className="w-10 h-10 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Mic className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Stop recording button */}
              {onStop && (
                <div className="absolute bottom-5 inset-x-0 flex justify-center">
                  <button
                    onClick={onStop}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 active:scale-95 text-white px-4 py-1.5 rounded-sm font-semibold uppercase tracking-wider text-[10px] transition-all shadow-lg"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    Stop Recording
                  </button>
                </div>
              )}
            </>
          )}

          {/* Preview mode: device labels on hover */}
          {mode === 'preview' && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white/90 text-xs font-medium">
                <VideoIcon className="w-3.5 h-3.5" />
                Camera active
              </div>
              <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white/90 text-xs font-medium">
                <Mic className="w-3.5 h-3.5" />
                Mic active
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
