import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar, SidebarSection } from '@/components/Sidebar';
import { BluePanelLayout } from '@/components/BluePanelLayout';
import { QuestionList } from '@/components/QuestionList';
import { CountdownTimer } from '@/components/CountdownTimer';
import { VideoPreview } from '@/components/VideoPreview';
import { CashShieldLanding } from '@/components/CashShieldLanding';
import {
  ChevronLeft,
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
  "What do you do when you are feeling stressed?",
  "Where do you plan to visit in the UK?",
];

// ─── Full pre-CAS interview question bank (60+ questions) ──────────────────
interface QuestionCategory {
  title: string;
  color: string;
  questions: string[];
}

const ALL_PRECAS_QUESTIONS: QuestionCategory[] = [
  {
    title: 'Why UK & Study Abroad',
    color: 'bg-blue-500',
    questions: [
      "Why do you want to study in the UK specifically?",
      "Why did you choose the UK over the USA, Canada, or Australia?",
      "Why not study in your home country?",
      "Why not study in another country besides the UK?",
      "What advantages does a UK degree have over a degree from your home country?",
      "Why did you not choose a university in Europe or Asia?",
      "How is the UK education system different from your home country?",
      "What do you know about the UK culture and education system?",
    ],
  },
  {
    title: 'University Choice',
    color: 'bg-violet-500',
    questions: [
      "Why did you choose this particular university?",
      "Why not choose another UK university for this course?",
      "What makes this university stand out from others?",
      "How did you research this university?",
      "What do you know about the ranking and reputation of this university?",
      "Did you apply to any other UK universities? Which ones?",
      "Why did you not choose Russell Group universities like Oxford, Cambridge, or LSE?",
    ],
  },
  {
    title: 'Course & Modules',
    color: 'bg-amber-500',
    questions: [
      "Why did you choose this particular course?",
      "Can you tell me about the modules on this course?",
      "Which modules interest you the most and why?",
      "How does this course relate to your previous studies?",
      "How does this course relate to your future career goals?",
      "What will you learn from this course that you cannot learn in your home country?",
      "Can you describe the course structure and assessment methods?",
      "What is the difference between this course and a similar course at another university?",
    ],
  },
  {
    title: 'Future Plans & Career',
    color: 'bg-emerald-500',
    questions: [
      "What are your plans after you complete this course?",
      "Will you return to your home country after your studies?",
      "How will this degree help your career in your home country?",
      "What job role are you targeting after graduation?",
      "What is the graduate employment market like in your field in your home country?",
      "Do you plan to work in the UK after your studies?",
      "What are your long-term career goals?",
      "How does studying in the UK give you a competitive advantage in your career?",
    ],
  },
  {
    title: 'Financial Questions',
    color: 'bg-orange-500',
    questions: [
      "How will you fund your studies in the UK?",
      "Who is sponsoring your education?",
      "What is your sponsor's occupation and annual income?",
      "How will you cover your living expenses in the UK?",
      "Do you have a student loan? From which bank?",
      "Can you show evidence of your financial capability?",
      "How much do you expect your total cost of study and living to be?",
      "What will you do if you face financial difficulties during your studies?",
    ],
  },
  {
    title: 'Accommodation & Living',
    color: 'bg-teal-500',
    questions: [
      "Where will you be living during your studies?",
      "What are your accommodation plans in the UK?",
      "Why did you choose this accommodation?",
      "How much is your rent per month?",
      "Do you know the area where you will be living?",
      "How will you manage your day-to-day expenses in the UK?",
      "Are you planning to share accommodation with anyone?",
    ],
  },
  {
    title: 'Background, Gaps & Work Experience',
    color: 'bg-rose-500',
    questions: [
      "Can you explain any gaps in your academic or employment history?",
      "What have you been doing since your last qualification?",
      "What work experience do you have in your field?",
      "How does your work experience relate to this course?",
      "Why did you leave your previous job?",
      "What is your current occupation?",
      "Can you tell me about your educational background?",
      "Why did you switch from your previous field to this course?",
    ],
  },
  {
    title: 'Cultural & Personal',
    color: 'bg-cyan-500',
    questions: [
      "How will you manage the cultural differences between your country and the UK?",
      "What do you know about life in the UK?",
      "How will you handle being away from your family?",
      "What will you do if you feel homesick?",
      "How will you adjust to the UK weather and lifestyle?",
      "What do you plan to do outside of your studies?",
      "Where do you plan to visit in the UK?",
      "What do you do when you are feeling stressed?",
    ],
  },
  {
    title: 'Tricky & Challenging',
    color: 'bg-red-500',
    questions: [
      "How do we know you are a genuine student and not using this as a pathway to immigration?",
      "If your visa application is refused, what will you do?",
      "What would you do if you failed this course?",
      "What will you do if you struggle with the academic demands?",
      "What makes you different from other applicants?",
      "If you could choose any university in the world, why not the US, Australia, or Canada?",
      "What do you know about the UK graduate employment market in your field?",
      "Why should we give you a place on this course?",
    ],
  },
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
  const [activeSection, setActiveSection] = useState<SidebarSection>('interviews');

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
      <Sidebar isDone={isComplete} activeSection={activeSection} onSectionChange={setActiveSection} questionCategories={ALL_PRECAS_QUESTIONS} />
      <div className="flex-1 overflow-y-auto p-12 lg:p-16">
        {activeSection === 'checklist' && (
          <div className="max-w-3xl">
            <button className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-8 rounded-sm">
              <ChevronLeft className="w-4 h-4" />
              Previous task
            </button>

            <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
              CAS Checklist
            </h1>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Below is your CAS (Confirmation of Acceptance for Studies) checklist. All items must be completed before your interview.
            </p>

            <div className="space-y-3">
              {[
                { label: 'Passport Copy', done: true },
                { label: 'Academic Transcripts', done: true },
                { label: 'English Language Certificate', done: true },
                { label: 'CAS Statement', done: true },
                { label: 'Financial Evidence', done: true },
                { label: 'ATAS Certificate (if applicable)', done: true },
                { label: 'TB Test Certificate (if applicable)', done: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.done ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                    {item.done && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                  <span className={`text-sm font-medium ${item.done ? 'text-gray-700' : 'text-gray-500'}`}>{item.label}</span>
                  {item.done && <span className="ml-auto text-xs font-semibold text-emerald-600 uppercase tracking-wider">Complete</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'documents' && (
          <div className="max-w-3xl">
            <button className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-8 rounded-sm">
              <ChevronLeft className="w-4 h-4" />
              Previous task
            </button>

            <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
              General Documents
            </h1>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Please review the general documents required for your application. All documents have been uploaded and verified.
            </p>

            <div className="space-y-3">
              {[
                { name: 'Passport Bio Page', type: 'PDF', size: '2.4 MB' },
                { name: 'Academic Transcript', type: 'PDF', size: '1.8 MB' },
                { name: 'English Language Certificate (IELTS)', type: 'PDF', size: '890 KB' },
                { name: 'Personal Statement', type: 'PDF', size: '156 KB' },
                { name: 'Reference Letter 1', type: 'PDF', size: '320 KB' },
                { name: 'Reference Letter 2', type: 'PDF', size: '298 KB' },
                { name: 'CV / Resume', type: 'PDF', size: '210 KB' },
              ].map((doc, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{doc.type}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{doc.name}</p>
                    <p className="text-xs text-gray-400">{doc.size}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'interviews' && (
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
        )}

        {activeSection === 'questionbank' && (
          <div className="max-w-4xl">
            <button className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-8 rounded-sm">
              <ChevronLeft className="w-4 h-4" />
              Previous task
            </button>

            <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
              Pre-CAS Question Bank
            </h1>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Complete list of 60+ questions across 9 categories. These questions may appear during your credibility interview.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ALL_PRECAS_QUESTIONS.map((category, catIdx) => (
                <div key={catIdx} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <h3 className="text-sm font-bold text-gray-900 flex-1">
                      {category.title}
                    </h3>
                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {category.questions.length}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    {category.questions.map((q, qIdx) => (
                      <div key={qIdx} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {qIdx + 1}
                        </span>
                        <p className="text-xs text-gray-600 leading-relaxed">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
        <div className="flex items-center justify-center">
          <div className="w-[540px] h-[304px]">
            <VideoPreview
              mode="record"
              isRecording={isActivelyRecording}
              timeRemaining={recordingTime}
              onStop={handleUserClickStop}
              onRecordingComplete={handleStopRecording}
            />
          </div>
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
        <div className="bg-white rounded-[20px] p-5 w-[520px] shadow-2xl">
          <div className="text-center mb-3">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Question {currentQuestionIndex + 1} / {questions.length}
            </p>
            <h3 className="text-xs font-semibold text-gray-900">
              Click Submit to move to the next question
            </h3>
          </div>

          <div className="review-video-wrapper relative w-[320px] h-[180px] mx-auto rounded-[10px] overflow-hidden mb-3">
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
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <Play className="w-4 h-4 text-gray-800 ml-0.5" fill="currentColor" />
                </div>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-white stroke-[3]" />
              </div>
              <span className="text-xs font-medium text-gray-700">
                Take 1 / 1
              </span>
            </div>
            <span className="text-[10px] font-semibold text-green-600 uppercase tracking-wider">
              Recorded
            </span>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleNextQuestion}
              className="bg-[#1146D9] hover:bg-[#0E3AB8] text-white px-6 py-2 rounded-sm text-xs font-semibold transition-colors"
            >
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
