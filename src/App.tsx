import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { BluePanelLayout } from '@/components/BluePanelLayout';
import { QuestionList } from '@/components/QuestionList';
import { CountdownTimer } from '@/components/CountdownTimer';
import { VideoPreview } from '@/components/VideoPreview';
import { CashShieldLanding } from '@/components/CashShieldLanding';
import {
  ChevronLeft,
  Video,
  CheckCircle2,
  Loader2,
  AlertCircle,
  UploadCloud,
  Check,
  Play,
} from 'lucide-react';

// ─── Fixed questions (always first 3) ───────────────────────────────────────
const FIXED_QUESTIONS = [
  "Open your passport to the page with your photo. Hold the passport in front of your face for 3 seconds, then move the passport next to your face (no more than 20cm away). Read the following words out loud: Hocus-pocus, Jibber-jabber, Babbling. This helps us to confirm your ID.",
  "Please read the following statement out loud:\n\n\"I confirm that I understand the seriousness of this interview process and acknowledge that any instance of cheating, attempted deception, or fraud on my part will result in the withdrawal of my admission offer, reporting to the relevant authorities, and possible loss of my deposit.\"",
  "Have you ever been refused a visa for any country? If yes, please explain the circumstances of the refusal.",
];

// ─── Topic questions pool (pick 7 each time) ───────────────────────────────
const TOPIC_QUESTIONS = [
  "Why do you want to study in the UK specifically?",
  "Why did you choose this particular course?",
  "How does this course relate to your future career goals?",
  "Can you tell me about the modules on this course and why they interest you?",
  "How will you fund your studies and living expenses in the UK?",
  "Where will you be living during your studies and what are your accommodation plans?",
  "Why did you choose this university over others?",
  "Why did you not choose another UK university for this course?",
  "Why did you not study this course in your home country or in another country?",
];

// ─── Tricky questions pool (pick 2 each time) ─────────────────────────────
const TRICKY_QUESTIONS = [
  "What would you do if you failed this course?",
  "How do we know you are a genuine student and not using this as a pathway to immigration?",
  "What do you know about the UK graduate employment market in your field?",
  "If your visa application is refused, what will you do?",
  "Can you explain any gaps in your academic or employment history?",
  "What makes you different from other applicants for this course?",
  "How will you manage the cultural differences between your country and the UK?",
  "What are your plans after you complete this course? Will you return to your home country?",
  "If you could choose any university in the world, why did you not choose one in the US, Australia, or Canada?",
  "What will you do if you struggle with the academic demands of this course?",
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateQuestions(): string[] {
  const shuffledTopics = shuffleArray(TOPIC_QUESTIONS).slice(0, 7);
  const shuffledTricky = shuffleArray(TRICKY_QUESTIONS).slice(0, 2);
  return [...FIXED_QUESTIONS, ...shuffledTopics, ...shuffledTricky];
}

const getRecordingTime = (index: number) => index === 0 ? 30 : index >= 10 ? 30 : 45;
const getReadingTime = (index: number) => 15;

type AppState =
  | 'landing'
  | 'dashboard'
  | 'intro'
  | 'setup'
  | 'question-intro'
  | 'reading'
  | 'recording'
  | 'review'
  | 'upload'
  | 'complete';

// ─── SetupScreen: proper component so hooks are legal ───────────────────────

interface SetupScreenProps {
  onComplete: () => void;
}

type PermissionState = 'pending' | 'granted' | 'denied';

function SetupScreen({ onComplete }: SetupScreenProps) {
  const [camStatus, setCamStatus] = useState<PermissionState>('pending');
  const [micStatus, setMicStatus] = useState<PermissionState>('pending');
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    // Guard: mediaDevices may be undefined in sandboxed iframes
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamStatus('denied');
      setMicStatus('denied');
      setPermissionDenied(true);
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((s) => {
        stream = s;
        setCamStatus('granted');
        setMicStatus('granted');
        setTimeout(() => s.getTracks().forEach((t) => t.stop()), 500);
      })
      .catch(() => {
        setCamStatus('denied');
        setMicStatus('denied');
        setPermissionDenied(true);
      });

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const items: { label: string; status: PermissionState }[] = [
    { label: 'Built-in Camera', status: camStatus },
    { label: 'Built-in Microphone', status: micStatus },
    { label: 'Internet Connection', status: 'granted' },
  ];

  const statusText = (s: PermissionState) =>
    s === 'granted' ? 'Looks good!' : s === 'denied' ? 'Permission denied' : 'Waiting for permission...';

  const statusColor = (s: PermissionState) =>
    s === 'granted' ? 'text-emerald-600 font-medium' : s === 'denied' ? 'text-red-500 font-medium' : 'text-gray-500';

  return (
    <BluePanelLayout
      leftContent={
        <div className="flex flex-col justify-center h-full max-w-md mx-auto w-full">
          <h1 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">
            Check your set up
          </h1>

          <div className="space-y-5 mb-6">
            {items.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="shrink-0 pt-0.5">
                  {item.status === 'granted' ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                  ) : item.status === 'denied' ? (
                    <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{item.label}</h3>
                  <p className={`text-xs mt-0.5 ${statusColor(item.status)}`}>
                    {statusText(item.status)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {permissionDenied && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 leading-relaxed">
              Camera or microphone access was denied. Please allow permissions in your browser and refresh, or open the app in a new tab.
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 font-semibold text-primary underline"
              >
                Open in new tab &rarr;
              </a>
            </div>
          )}

          {/* Button is always enabled — don't block the user */}
          <button
            onClick={onComplete}
            className="w-fit px-8 py-3 rounded-sm font-semibold text-sm transition-all bg-primary hover:bg-blue-800 text-white shadow-lg shadow-primary/20 cursor-pointer"
          >
            Let's Start
          </button>
        </div>
      }
      rightContent={
        <div className="w-[60%]">
          <VideoPreview mode="preview" />
        </div>
      }
    />
  );
}

// ─── Main app ─────────────────────────────────────────────────────────────

export default function InterviewFlow() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [questions, setQuestions] = useState<string[]>(() => generateQuestions());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordedAnswers, setRecordedAnswers] = useState<(Blob | null)[]>(
    Array(12).fill(null)
  );
  const [showFullIntro, setShowFullIntro] = useState(false);
  const [readingTime, setReadingTime] = useState(15);
  const [recordingTime, setRecordingTime] = useState(45);
  const [isActivelyRecording, setIsActivelyRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isReviewPlaying, setIsReviewPlaying] = useState(false);

  const nextState = (state: AppState) => {
    window.scrollTo(0, 0);
    setAppState(state);
  };

  const renderQuestionText = (text: string) =>
    text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {i > 0 && <br />}
        {line}
      </React.Fragment>
    ));

  // ── Reading countdown ────────────────────────────────────────────────────
  useEffect(() => {
    if (appState !== 'reading') return;
    if (readingTime <= 0) {
      // Auto-advance to recording
      setRecordingTime(getRecordingTime(currentQuestionIndex));
      setIsActivelyRecording(true);
      nextState('recording');
      return;
    }
    const t = setTimeout(() => setReadingTime((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [appState, readingTime]);

  // ── Recording countdown ──────────────────────────────────────────────────
  useEffect(() => {
    if (appState !== 'recording') return;
    if (recordingTime <= 0) {
      // Time's up — signal VideoPreview to stop
      setIsActivelyRecording(false);
      return;
    }
    if (!isActivelyRecording) return;
    const t = setTimeout(() => setRecordingTime((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [appState, recordingTime, isActivelyRecording]);

  // ── Upload progress ──────────────────────────────────────────────────────
  useEffect(() => {
    if (appState === 'review') setIsReviewPlaying(false);
  }, [appState, currentQuestionIndex]);

  useEffect(() => {
    if (appState !== 'upload') return;
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = Math.min(prev + Math.floor(Math.random() * 15) + 5, 100);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => nextState('complete'), 600);
        }
        return next;
      });
    }, 350);
    return () => clearInterval(interval);
  }, [appState]);

  // ── State transition helpers ─────────────────────────────────────────────
  const handleGetStarted = () => nextState('dashboard');
  const handleStartInterview = () => {
    setQuestions(generateQuestions());
    setRecordedAnswers(Array(12).fill(null));
    setCurrentQuestionIndex(0);
    nextState('intro');
  };
  const handleIntroStart = () => nextState('setup');
  const handleSetupComplete = () => nextState('question-intro');

  const handleStartQuestion = () => {
    setReadingTime(getReadingTime(currentQuestionIndex));
    nextState('reading');
  };

  const handleStartRecordingNow = () => {
    setRecordingTime(getRecordingTime(currentQuestionIndex));
    setIsActivelyRecording(true);
    nextState('recording');
  };

  const handleStopRecording = (blob?: Blob) => {
    setIsActivelyRecording(false);
    if (blob) {
      setRecordedAnswers((prev) => {
        const next = [...prev];
        next[currentQuestionIndex] = blob;
        return next;
      });
    }
    nextState('review');
  };

  const handleUserClickStop = () => {
    // Tell VideoPreview to stop; it will call onRecordingComplete with the blob
    setIsActivelyRecording(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((p) => p + 1);
      nextState('question-intro');
    } else {
      setUploadProgress(0);
      nextState('upload');
    }
  };

  // ── Screen renderers ─────────────────────────────────────────────────────

  const renderDashboard = (isComplete: boolean) => (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      <Sidebar isDone={isComplete} />
      <div className="flex-1 overflow-y-auto p-12 lg:p-16">
        <div className="max-w-3xl">
          <button className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-8 rounded-sm">
            <ChevronLeft className="w-4 h-4" />
            Previous task
          </button>

          <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
            Interviews
          </h1>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            You have been invited to complete the following interviews. Please
            follow the instructions below.
          </p>

          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900 mb-2">
              Complete your recorded Pre-Cas AI Interview
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              You need to complete a short video recording of yourself answering
              some questions. You can do this at a time that is convenient for
              you, but please ensure that you have a good internet connection,
              and a working camera and microphone. Please have your passport
              ready before starting.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400 rounded-l-2xl" />
            <div className="p-5 pl-8">
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Credibility Interview
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                {isComplete
                  ? 'Your recorded Pre-Cas AI Interview is complete.'
                  : 'You have been asked to complete a recorded Pre-Cas AI Interview.'}
              </p>
              {!isComplete && (
                <button
                  onClick={handleStartInterview}
                  className="bg-primary hover:bg-blue-800 text-white px-4 py-2 rounded-sm font-semibold transition-colors text-xs shadow-sm"
                >
                  Start interview
                </button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors bg-white border border-gray-200 px-3 py-1.5 rounded-sm">
              <ChevronLeft className="w-4 h-4" />
              Previous task
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntro = () => (
    <BluePanelLayout
      leftContent={
        <div className="flex flex-col h-full justify-center">
          <h1 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
            Credibility Interview
          </h1>

          <div className="text-sm leading-relaxed text-gray-600 mb-6 space-y-3">
            <p>
              During your interview, you should be in a well lit room on your
              own with no or very limited background noise. If this is not the
              case when the interview starts you will be asked to record it
              again. You are required to be in a location with a good internet
              connection and have your passport ready.
            </p>

            <AnimatePresence>
              {showFullIntro && (
                <motion.div
                  key="extra"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p>
                    Please ensure you are looking directly at the camera
                    throughout the duration of the interview. Not following this
                    rule may raise concerns about the credibility of your
                    interview, which could lead to the interview being failed
                    and your application rejected. The interview should be
                    completed in one continuous attempt. If you exit the
                    interview, your attempt will be logged, and this will impact
                    the decision of your interview.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setShowFullIntro((p) => !p)}
              className="text-primary font-semibold hover:underline text-sm rounded-sm"
            >
              {showFullIntro ? 'Show less' : 'Show more'}
            </button>
          </div>

          <button
            onClick={handleIntroStart}
            className="w-fit px-8 py-3 rounded-sm font-semibold text-sm bg-primary hover:bg-blue-800 text-white transition-colors shadow-lg shadow-primary/20"
          >
            Let's Start
          </button>
        </div>
      }
      rightContent={null}
    />
  );

  const renderQuestionIntro = () => (
    <BluePanelLayout
      leftWidth="36%"
      leftContent={
        <QuestionList
          questions={questions}
          currentIndex={currentQuestionIndex}
          getRecordingTime={getRecordingTime}
        />
      }
      rightContent={
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-10 w-full max-w-2xl shadow-2xl text-center flex flex-col items-center"
        >
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4 bg-gray-50 px-3 py-1.5 rounded-full">
            <Video className="w-3.5 h-3.5" />
            <span>Video Response &bull; {getRecordingTime(currentQuestionIndex)} Seconds &bull; 1 Take</span>
          </div>

          <h2 className="text-base font-bold text-gray-900 mb-2 leading-tight">
            You will have 15 seconds to prepare your answer.
          </h2>
          <p className="text-gray-500 mb-6 text-xs max-w-sm">
            The recording will start automatically after the preparation time,
            or you can skip ahead.
          </p>

          <button
            onClick={handleStartQuestion}
            className="bg-primary hover:bg-blue-800 text-white px-5 py-2 rounded-sm font-semibold text-xs transition-colors shadow-lg shadow-primary/20"
          >
            Start
          </button>
        </motion.div>
      }
    />
  );

  const renderReading = () => (
    <BluePanelLayout
      leftWidth="36%"
      leftContent={
        <div className="flex flex-col items-center justify-center h-full text-center">
          <CountdownTimer
            seconds={readingTime}
            totalSeconds={getReadingTime(currentQuestionIndex)}
          />
          <p className="mt-4 text-gray-400 text-xs max-w-xs">
            Read the question carefully. Recording begins automatically.
          </p>
        </div>
      }
      rightContent={
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 w-full max-w-2xl shadow-2xl"
        >
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4 bg-gray-50 px-3 py-1.5 rounded-full w-fit">
            <Video className="w-3.5 h-3.5" />
            <span>Video Response &bull; {getRecordingTime(currentQuestionIndex)} Seconds &bull; 1 Take</span>
          </div>

          <h2 className="text-base font-bold text-gray-900 mb-6 leading-snug text-center">
            {renderQuestionText(questions[currentQuestionIndex])}
          </h2>

          <div className="border-t border-gray-100 pt-4 flex justify-center">
            <button
              onClick={handleStartRecordingNow}
              className="bg-primary hover:bg-blue-800 text-white px-5 py-2 rounded-sm font-semibold text-xs transition-colors uppercase tracking-wider shadow-lg shadow-primary/20"
            >
              Start Now
            </button>
          </div>
        </motion.div>
      }
    />
  );

  const renderRecording = () => (
    <BluePanelLayout
      leftWidth="36%"
      leftContent={
        <div className="flex flex-col justify-center h-full">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Video Response &bull; {getRecordingTime(currentQuestionIndex)} Seconds &bull; 1 Take
          </p>

          <h2 className="text-base font-bold text-gray-900 mb-5 leading-snug text-center">
            {renderQuestionText(questions[currentQuestionIndex])}
          </h2>

          <div className="mt-auto p-3 bg-blue-50 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900">
              Once you have finished, click Stop Recording to go to the next
              step.
            </p>
          </div>
        </div>
      }
      rightContent={
        <div className="w-[60%]">
          <VideoPreview
            mode="record"
            isRecording={isActivelyRecording}
            timeRemaining={recordingTime}
            onStop={handleUserClickStop}
            onRecordingComplete={handleStopRecording}
          />
        </div>
      }
    />
  );

  const renderReview = () => (
    <BluePanelLayout
      leftWidth="36%"
      leftContent={
        <div className="flex flex-col justify-center h-full">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Video Response &bull; {getRecordingTime(currentQuestionIndex)} Seconds &bull; 1 Take
          </p>
          <h2 className="text-base font-bold text-gray-900 leading-snug text-center">
            {renderQuestionText(questions[currentQuestionIndex])}
          </h2>
        </div>
      }
      rightContent={
        <div className="bg-white rounded-[20px] p-7 w-[560px] shadow-2xl">
          <div className="text-center mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Question {currentQuestionIndex + 1} / {questions.length}
            </p>
            <h3 className="text-sm font-semibold text-gray-900">
              Click Submit to move to the next question
            </h3>
          </div>

          <div className="review-video-wrapper relative w-[280px] h-[157px] mx-auto rounded-[10px] border-2 border-[#2F5BFF] overflow-hidden mb-4">
            <VideoPreview
              mode="playback"
              videoBlob={recordedAnswers[currentQuestionIndex]}
              autoPlay={false}
              onEnded={() => setIsReviewPlaying(false)}
            />
            {!isReviewPlaying && (
              <button
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  const wrapper = e.currentTarget.closest('.review-video-wrapper');
                  const video = wrapper?.querySelector('video');
                  if (video) {
                    video.play();
                    setIsReviewPlaying(true);
                  }
                }}
              >
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 text-gray-800 ml-0.5" fill="currentColor" />
                </div>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-gray-700 stroke-[3]" />
              <span className="text-sm font-medium text-gray-700">
                Take 1 / 1
              </span>
            </div>
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
              Recorded
            </span>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 bg-[#1146D9] hover:bg-[#0E3AB8] text-white px-6 py-2.5 rounded-sm text-sm font-semibold transition-colors"
            >
              <Check className="w-4 h-4" strokeWidth={3} />
              Submit
            </button>
          </div>
        </div>
      }
    />
  );

  const renderUpload = () => (
    <BluePanelLayout
      leftContent={
        <div className="flex flex-col items-center justify-center h-full text-center w-full max-w-md mx-auto">
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-40" />
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center relative z-10">
              <UploadCloud className="w-7 h-7 text-primary" />
            </div>
          </div>

          <h2 className="text-base font-bold text-gray-900 mb-1 tracking-tight">
            Uploading Your Responses
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Don't go yet! Your responses are being uploaded.
          </p>

          <div className="w-full space-y-3">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-gray-500 text-left">
              Less than a minute left
            </p>
          </div>
        </div>
      }
      rightContent={null}
    />
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full min-h-screen">
      {appState === 'landing' && <CashShieldLanding onGetStarted={handleGetStarted} />}
      {appState === 'dashboard' && renderDashboard(false)}
      {appState === 'intro' && renderIntro()}
      {appState === 'setup' && (
        <SetupScreen onComplete={handleSetupComplete} />
      )}
      {appState === 'question-intro' && renderQuestionIntro()}
      {appState === 'reading' && renderReading()}
      {appState === 'recording' && renderRecording()}
      {appState === 'review' && renderReview()}
      {appState === 'upload' && renderUpload()}
      {appState === 'complete' && renderDashboard(true)}
    </div>
  );
}
