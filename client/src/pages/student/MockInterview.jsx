import { useState, useEffect, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ScoreGauge from '../../components/ScoreGauge';
import EmptyState from '../../components/EmptyState';

const JOB_ROLES = [
  'Full Stack Developer',
  'React Developer',
  'Software Engineer',
  'Java Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Analyst',
  'DevOps Engineer',
];

const COMMUNICATION_METRICS = [
  { key: 'fluency', label: 'Fluency', weight: 25, desc: 'Speaking flow, natural pacing, absence of filler words' },
  { key: 'clarity', label: 'Clarity', weight: 20, desc: 'Understandability, precision, articulate ideas' },
  { key: 'grammar', label: 'Grammar', weight: 15, desc: 'Sentence structure and grammatical accuracy' },
  { key: 'vocabulary', label: 'Vocabulary', weight: 15, desc: 'Technical terminology, variety, domain command' },
  { key: 'coherence', label: 'Coherence', weight: 15, desc: 'Logical flow, transitions, structured points' },
  { key: 'relevance', label: 'Relevance', weight: 10, desc: 'Direct alignment and responsiveness to prompt' },
];

const MockInterview = () => {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState('interview'); // 'interview' | 'history'
  const [step, setStep] = useState('setup'); // 'setup' | 'interview' | 'complete'

  // Setup Form State
  const [role, setRole] = useState('Full Stack Developer');
  const [customRole, setCustomRole] = useState('');
  const [type, setType] = useState('mixed'); // 'technical' | 'hr' | 'mixed'
  const [difficulty, setDifficulty] = useState('intermediate'); // 'beginner' | 'intermediate' | 'advanced'
  const [duration, setDuration] = useState(5); // 3 | 5 | 8 questions

  // Resume State
  const [resumeStatusLoading, setResumeStatusLoading] = useState(true);
  const [existingResume, setExistingResume] = useState(null);
  const [useCustomUpload, setUseCustomUpload] = useState(false);
  const [uploadedResumeFile, setUploadedResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Active Interview State
  const [interview, setInterview] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [endingEarly, setEndingEarly] = useState(false);

  // Voice & Audio Recording State
  const [inputMode, setInputMode] = useState('voice'); // 'voice' | 'text'
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBase64, setAudioBase64] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  // History State
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistoricalInterview, setSelectedHistoricalInterview] = useState(null);

  // Audio recording refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  // Check resume status on initial load
  useEffect(() => {
    const fetchResumeStatus = async () => {
      setResumeStatusLoading(true);
      try {
        const { data } = await api.get('/interview/resume-status');
        if (data.hasResume && data.resume) {
          setExistingResume(data.resume);
          if (data.resume.targetRole) {
            setRole(data.resume.targetRole);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch resume status:', err.message);
      } finally {
        setResumeStatusLoading(false);
      }
    };
    fetchResumeStatus();

    // Check SpeechRecognition support
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setSpeechSupported(false);
    }
  }, []);

  // Dropzone for optional new resume upload
  const onDrop = useCallback((accepted) => {
    if (accepted[0]) {
      setUploadedResumeFile(accepted[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropRejected: () => toast.error('Only PDF or DOCX up to 5MB are supported'),
  });

  // Handle uploading new resume inside setup
  const handleUploadResumeFile = async () => {
    if (!uploadedResumeFile) return;
    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append('resume', uploadedResumeFile);
      formData.append('targetRole', role);

      const { data } = await api.post('/interview/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setExistingResume(data.data);
      setUseCustomUpload(false);
      setUploadedResumeFile(null);
      toast.success('Resume uploaded and attached to interview profile! 📄');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload resume file');
    } finally {
      setUploadingResume(false);
    }
  };

  // Start Voice Recording
  const startRecording = async () => {
    try {
      // Clear previous audio
      setAudioUrl(null);
      setAudioBase64(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Convert Blob to base64 for Gemini multimodal evaluation
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioBase64(reader.result);
        };
        reader.readAsDataURL(audioBlob);

        // Stop media tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingTime(0);

      // Timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Start Web Speech API Recognition for real-time transcription
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRec) {
        const recognition = new SpeechRec();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setAnswer(currentTranscript.trim());
        };

        recognition.onerror = (e) => {
          console.warn('Speech recognition warning:', e.error);
        };

        speechRecognitionRef.current = recognition;
        try {
          recognition.start();
        } catch (e) {
          console.warn('Could not start recognition:', e);
        }
      }

      toast.success('Microphone recording active! Speak clearly 🎙️');
    } catch (err) {
      toast.error('Microphone permission required for voice answers.');
      console.error(err);
    }
  };

  // Stop Voice Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {
        console.warn('Recognition stop error:', e);
      }
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRecording(false);
    toast.success('Recording captured. You can review or edit transcript before submitting.');
  };

  // Retry Voice Recording
  const retryRecording = () => {
    if (isRecording) {
      stopRecording();
    }
    setAudioUrl(null);
    setAudioBase64(null);
    setAnswer('');
    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Launch Interview Session
  const startInterview = async () => {
    const finalRole = customRole.trim() || role;
    if (!finalRole) {
      toast.error('Please specify a target job role');
      return;
    }

    setStarting(true);
    try {
      const { data } = await api.post('/interview/start', {
        role: finalRole,
        type,
        difficulty,
        duration,
        resumeId: existingResume?._id || null,
      });

      setInterview(data.data);
      setCurrentQ(0);
      setFeedbacks([]);
      setAnswer('');
      setAudioUrl(null);
      setAudioBase64(null);
      setStep('interview');
      toast.success(`Mock loop calibrated for ${finalRole}! 🚀`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview. Check Gemini API key.');
    } finally {
      setStarting(false);
    }
  };

  // Submit Answer
  const submitAnswer = async () => {
    if (isRecording) {
      stopRecording();
    }

    const trimmedAnswer = answer.trim();
    if (!trimmedAnswer && !audioBase64) {
      toast.error('Please provide an answer via voice or text');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        interviewId: interview._id,
        questionIndex: currentQ,
        answer: trimmedAnswer,
        isVoice: inputMode === 'voice' || Boolean(audioBase64),
        transcript: trimmedAnswer,
        audioDuration: recordingTime,
        audioBase64: audioBase64 || null,
        audioMimeType: 'audio/webm',
      };

      const { data } = await api.post('/interview/submit-answer', payload);

      const newFeedback = {
        questionIndex: currentQ,
        question: interview.questions[currentQ]?.question,
        category: interview.questions[currentQ]?.category || 'technical',
        userAnswer: trimmedAnswer,
        isVoice: inputMode === 'voice',
        audioDuration: recordingTime,
        ...data.data,
      };

      setFeedbacks((prev) => [...prev, newFeedback]);

      // Reset recording and answer box for next question
      setAnswer('');
      setAudioUrl(null);
      setAudioBase64(null);
      setRecordingTime(0);

      if (data.data.interviewComplete) {
        // Fetch full interview with final summary
        const fullRes = await api.get(`/interview/${interview._id}`);
        setInterview(fullRes.data.data);
        setStep('complete');
        toast.success(`Interview complete! Performance: ${data.data.overallPerformanceScore}% • Communication: ${data.data.overallCommunicationScore}% 🎉`);
      } else {
        setCurrentQ((prev) => prev + 1);
        toast.success(`Question evaluated! Performance: ${data.data.performanceScore}% ✅`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to score answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // End interview early
  const handleEndEarly = async () => {
    if (!interview) return;
    setEndingEarly(true);
    try {
      const { data } = await api.post('/interview/end', { interviewId: interview._id });
      setInterview(data.data);
      setShowExitModal(false);
      setStep('complete');
      toast.success('Interview concluded and evaluated. Generating summary report.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to end interview.');
    } finally {
      setEndingEarly(false);
    }
  };

  // Load Interview History
  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const { data } = await api.get('/interview/history');
      setHistory(data.data || []);
    } catch {
      toast.error('Failed to load interview history');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Load a historical interview debrief
  const viewHistoricalDetail = async (id) => {
    try {
      const { data } = await api.get(`/interview/${id}`);
      setSelectedHistoricalInterview(data.data);
    } catch {
      toast.error('Failed to load interview details');
    }
  };

  const reset = () => {
    setStep('setup');
    setInterview(null);
    setCurrentQ(0);
    setAnswer('');
    setFeedbacks([]);
    setAudioUrl(null);
    setAudioBase64(null);
    setRecordingTime(0);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans max-w-5xl mx-auto">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-semibold">
              Voice & Verbal Assessment Engine
            </span>
            <span className="text-xs text-slate-500 font-medium">Gemini Grounded Calibration</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            AI Resume-Based Mock Interview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personalized technical and behavioral loops powered by your resume and live speech communication analytics.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('interview');
              setSelectedHistoricalInterview(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'interview' && !selectedHistoricalInterview
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-base">mic</span>
            <span>Simulator</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('history');
              loadHistory();
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history' || selectedHistoricalInterview
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-base">history</span>
            <span>History & Debriefs</span>
          </button>
        </div>
      </div>

      {/* VIEW: SIMULATOR SETUP */}
      {activeTab === 'interview' && step === 'setup' && (
        <div className="space-y-6">
          {/* SECTION 1: Resume Detection & Binding */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-xl">description</span>
                <h2 className="font-display text-base font-bold text-slate-900">1. Resume Calibration Source</h2>
              </div>
              {existingResume && !useCustomUpload && (
                <span className="font-mono text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active Resume Linked
                </span>
              )}
            </div>

            {resumeStatusLoading ? (
              <div className="skeleton h-20 rounded-xl" />
            ) : existingResume && !useCustomUpload ? (
              <div className="p-4 sm:p-5 rounded-xl bg-blue-50/50 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-2xl">verified_user</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display text-sm font-bold text-slate-900">{existingResume.fileName}</p>
                      {existingResume.atsScore ? (
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                          ATS {existingResume.atsScore}%
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Targeted for <strong className="text-slate-800">{existingResume.targetRole || role}</strong> • Grounding questions in verified projects & tools.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setUseCustomUpload(true)}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-sm">upload_file</span>
                  <span>Upload different resume</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-500/60 bg-slate-50/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-blue-600">cloud_upload</span>
                    <p className="font-display text-sm font-bold text-slate-900">
                      {uploadedResumeFile ? uploadedResumeFile.name : 'Upload your resume (PDF or DOCX, max 5MB)'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Questions will be dynamically tailored to your projects, tech stack, and real experience.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  {uploadedResumeFile && (
                    <button
                      type="button"
                      onClick={handleUploadResumeFile}
                      disabled={uploadingResume}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      {uploadingResume ? 'Processing Resume...' : 'Attach & Parse Resume'}
                    </button>
                  )}
                  {existingResume && (
                    <button
                      type="button"
                      onClick={() => setUseCustomUpload(false)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer ml-auto"
                    >
                      Cancel & use active resume ({existingResume.fileName})
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Target Role */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
            <div className="flex items-center gap-2 mb-3.5">
              <span className="material-symbols-outlined text-blue-600 text-xl">work</span>
              <h2 className="font-display text-base font-bold text-slate-900">2. Target Job Role</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5">
              {JOB_ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setCustomRole('');
                  }}
                  className={`py-3 px-3.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer text-left ${
                    role === r && !customRole
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-semibold text-slate-500 shrink-0">Or Custom Role:</span>
              <input
                type="text"
                value={customRole}
                onChange={(e) => {
                  setCustomRole(e.target.value);
                  if (e.target.value) setRole(e.target.value);
                }}
                placeholder="e.g. Mobile iOS Engineer, Cloud Platform Architect..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* SECTION 3: Format, Difficulty & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Round Format */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-xl">tune</span>
                <h2 className="font-display text-base font-bold text-slate-900">3. Interview Format</h2>
              </div>
              <div className="space-y-2">
                {[
                  {
                    key: 'mixed',
                    label: 'Mixed Loop (Technical + HR)',
                    desc: 'Balanced realistic loop alternating between technical depth and behavioral STAR responses.',
                    icon: 'psychology',
                  },
                  {
                    key: 'technical',
                    label: 'Technical Assessment',
                    desc: 'System architecture, API design, debugging hurdles, state management, and code decisions.',
                    icon: 'terminal',
                  },
                  {
                    key: 'hr',
                    label: 'Behavioral & Leadership (HR)',
                    desc: 'STAR storytelling, team conflict resolution, deadline ownership, and career milestones.',
                    icon: 'groups',
                  },
                ].map(({ key, label, desc, icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setType(key)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      type === key
                        ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-lg">{icon}</span>
                      </div>
                      <div>
                        <p className="font-display text-xs sm:text-sm font-bold text-slate-900">{label}</p>
                        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty & Length */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-blue-600 text-xl">speed</span>
                  <h2 className="font-display text-base font-bold text-slate-900">4. Difficulty Level</h2>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'beginner', label: 'Beginner', desc: 'Core fundamentals' },
                    { key: 'intermediate', label: 'Intermediate', desc: 'Architecture & trade-offs' },
                    { key: 'advanced', label: 'Advanced', desc: 'Scale & deep internals' },
                  ].map(({ key, label, desc }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDifficulty(key)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        difficulty === key
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <p className="text-xs font-bold">{label}</p>
                      <p className={`text-[10px] mt-0.5 ${difficulty === key ? 'text-blue-100' : 'text-slate-400'}`}>
                        {desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-blue-600 text-xl">hourglass_top</span>
                  <h2 className="font-display text-base font-bold text-slate-900">5. Question Count & Duration</h2>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { count: 3, label: '3 Questions', time: '~10 Mins' },
                    { count: 5, label: '5 Questions', time: '~20 Mins' },
                    { count: 8, label: '8 Questions', time: '~35 Mins' },
                  ].map(({ count, label, time }) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setDuration(count)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        duration === count
                          ? 'bg-blue-50 text-blue-700 border-blue-400 ring-2 ring-blue-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-xs font-bold">{label}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{time}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <div className="flex justify-end">
            <button
              id="start-interview-btn"
              type="button"
              onClick={startInterview}
              disabled={starting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
            >
              {starting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Grounded Questions via Gemini...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">play_arrow</span>
                  <span>Launch AI Mock Interview Session</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* VIEW: ACTIVE INTERVIEW */}
      {activeTab === 'interview' && step === 'interview' && interview && (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-700">
                  Question {currentQ + 1} of {interview.questions.length}
                </span>
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  {interview.questions[currentQ]?.category === 'hr' ? 'HR Behavioral' : 'Technical Architecture'}
                </span>
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                  {interview.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  {interview.role}
                </span>
                <button
                  type="button"
                  onClick={() => setShowExitModal(true)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">exit_to_app</span>
                  <span>Conclude Early</span>
                </button>
              </div>
            </div>

            {/* Stepper Bar */}
            <div className="flex gap-1.5">
              {interview.questions.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    i < currentQ ? 'bg-emerald-500' : i === currentQ ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Current Question Box */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-display font-bold text-base shrink-0 shadow-xs">
                Q{currentQ + 1}
              </div>
              <div className="flex-1">
                <p className="font-display text-slate-900 font-bold text-base sm:text-lg leading-relaxed">
                  {interview.questions[currentQ]?.question}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {interview.questions[currentQ]?.category === 'hr'
                    ? 'Tip: Use STAR framework (Situation, Task, Action, Result). Highlight individual ownership.'
                    : 'Tip: Outline implementation choices, system bottlenecks, and technical trade-offs.'}
                </p>
              </div>
            </div>

            {/* Response Mode Selector (Voice vs Text) */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setInputMode('voice')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    inputMode === 'voice'
                      ? 'bg-white text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">mic</span>
                  <span>Voice Response (Speech Evaluated)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('text')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    inputMode === 'text'
                      ? 'bg-white text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">edit_note</span>
                  <span>Typed Response</span>
                </button>
              </div>

              {inputMode === 'voice' && (
                <div className="flex items-center gap-2">
                  {isRecording && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 animate-pulse font-mono text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                      <span>Recording: {formatTime(recordingTime)}</span>
                    </div>
                  )}
                  {audioUrl && !isRecording && (
                    <span className="font-mono text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">graphic_eq</span>
                      <span>Audio Captured ({formatTime(recordingTime)})</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Voice Recording Controls */}
            {inputMode === 'voice' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">mic</span>
                        <span>{audioUrl ? 'Record Again' : 'Start Voice Recording'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-all animate-pulse cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">stop_circle</span>
                        <span>Stop Recording</span>
                      </button>
                    )}

                    {audioUrl && (
                      <button
                        type="button"
                        onClick={retryRecording}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Discard & Reset
                      </button>
                    )}
                  </div>

                  {audioUrl && (
                    <audio controls src={audioUrl} className="h-8 max-w-[240px]" />
                  )}
                </div>

                {!speechSupported && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    Live speech transcription works best in Chrome/Edge. Your recorded audio will still be sent directly to Gemini for multimodal speech analysis!
                  </p>
                )}
              </div>
            )}

            {/* Answer / Transcript Editor Box */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-blue-600">rate_review</span>
                  <span>{inputMode === 'voice' ? 'Transcribed Spoken Response (Editable before submission)' : 'Your Response'}</span>
                </label>
                <span className="font-mono text-[11px] text-slate-400">{answer.length} characters</span>
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={
                  inputMode === 'voice'
                    ? 'Start speaking, and your live speech transcript will appear here in real-time. You can refine or edit the text freely before submitting.'
                    : 'Type your structured response here. Focus on metrics, architectural decisions, and trade-offs.'
                }
                rows={6}
                className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-3.5 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-mono">
                Evaluated on 6 Communication Dimensions & Technical Depth
              </span>

              <button
                id="submit-answer-btn"
                type="button"
                onClick={submitAnswer}
                disabled={submitting || (!answer.trim() && !audioBase64)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Verbal Delivery & Depth...</span>
                  </>
                ) : currentQ === interview.questions.length - 1 ? (
                  <>
                    <span>Submit & View Comprehensive Debrief</span>
                    <span className="material-symbols-outlined text-base">check_circle</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Next Question</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Feedback from previous answers in this session */}
          {feedbacks.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-900">
                  Instant Feedback from Answered Questions
                </h3>
                <span className="font-mono text-xs text-slate-500 font-semibold">
                  {feedbacks.length} evaluated
                </span>
              </div>

              <div className="space-y-4">
                {feedbacks.map((fb, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-mono text-[10px] uppercase font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                          Q{fb.questionIndex + 1} • {fb.category}
                        </span>
                        <p className="text-xs font-bold text-slate-900 mt-1">{fb.question}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="font-display text-sm font-bold text-blue-700">
                            {fb.performanceScore}%
                          </span>
                          <p className="font-mono text-[9px] uppercase text-slate-400 font-semibold">Performance</p>
                        </div>
                        <div className="text-right">
                          <span className="font-display text-sm font-bold text-emerald-700">
                            {fb.communicationScore}%
                          </span>
                          <p className="font-mono text-[9px] uppercase text-slate-400 font-semibold">Communication</p>
                        </div>
                      </div>
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {fb.performanceFeedback?.strengths?.length > 0 && (
                        <div className="p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-200/60 text-emerald-900">
                          <p className="font-bold flex items-center gap-1 mb-1">
                            <span className="material-symbols-outlined text-sm">thumb_up</span>
                            <span>Key Strengths</span>
                          </p>
                          <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                            {fb.performanceFeedback.strengths.slice(0, 2).map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {fb.performanceFeedback?.improvements?.length > 0 && (
                        <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200/60 text-amber-900">
                          <p className="font-bold flex items-center gap-1 mb-1">
                            <span className="material-symbols-outlined text-sm">lightbulb</span>
                            <span>Improvement Area</span>
                          </p>
                          <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                            {fb.performanceFeedback.improvements.slice(0, 2).map((imp, i) => (
                              <li key={i}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {fb.followUpQuestion && (
                      <div className="p-2.5 bg-blue-50/70 rounded-lg border border-blue-200/60 text-blue-900 text-xs">
                        <span className="font-bold flex items-center gap-1 mb-0.5">
                          <span className="material-symbols-outlined text-sm">psychology_alt</span>
                          <span>Follow-up question for reflection:</span>
                        </span>
                        <p className="italic text-[11px]">{fb.followUpQuestion}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONFIRM EXIT MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">Conclude Interview Loop Early?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your answered responses so far will be preserved, graded, and compiled into a comprehensive debrief report.
              </p>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Continue Interview
              </button>
              <button
                type="button"
                onClick={handleEndEarly}
                disabled={endingEarly}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {endingEarly ? 'Finalizing...' : 'Conclude & Score Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: COMPREHENSIVE RESULTS DASHBOARD */}
      {((activeTab === 'interview' && step === 'complete') || selectedHistoricalInterview) && (
        (() => {
          const report = selectedHistoricalInterview || interview;
          const perfScore = report?.overallPerformanceScore || report?.overallScore || 0;
          const commScore = report?.overallCommunicationScore || 0;
          const compositeScore = report?.overallScore || Math.round(perfScore * 0.7 + commScore * 0.3);

          return (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Back to history button if viewing historical detail */}
              {selectedHistoricalInterview && (
                <button
                  type="button"
                  onClick={() => setSelectedHistoricalInterview(null)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>Back to Interview History</span>
                </button>
              )}

              {/* SECTION 1: Dual Radial Scores Hero */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <div>
                    <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      Debrief Report Calibrated
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      {report?.role} • {report?.type?.toUpperCase()} Assessment
                    </h2>
                    <p className="text-xs text-slate-500 font-mono">
                      Level: {report?.difficulty} • Questions Evaluated: {report?.questions?.length || 0}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs text-slate-400">Composite Readiness</span>
                    <p className={`font-display text-2xl font-bold ${compositeScore >= 75 ? 'text-blue-600' : 'text-amber-600'}`}>
                      {compositeScore}%
                    </p>
                  </div>
                </div>

                {/* Score Gauges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-y border-slate-100">
                  <div className="flex flex-col items-center p-4 bg-slate-50/70 rounded-2xl border border-slate-200/60">
                    <ScoreGauge score={perfScore} size={150} label="" />
                    <h3 className="font-display text-sm font-bold text-slate-900 mt-2">
                      Interview Performance Score
                    </h3>
                    <p className="text-xs text-slate-500 text-center max-w-xs mt-0.5">
                      Technical correctness, algorithmic logic, system trade-offs, and STAR structure.
                    </p>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-blue-50/40 rounded-2xl border border-blue-200/60">
                    <ScoreGauge score={commScore} size={150} label="" />
                    <h3 className="font-display text-sm font-bold text-blue-950 mt-2">
                      Communication Skills Score
                    </h3>
                    <p className="text-xs text-slate-500 text-center max-w-xs mt-0.5">
                      Fluency (25%), Clarity (20%), Grammar (15%), Vocabulary (15%), Coherence (15%), Relevance (10%).
                    </p>
                  </div>
                </div>

                {/* AI Executive Summary Narrative */}
                {report?.finalSummary?.summary && (
                  <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <p className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-blue-600">psychology</span>
                      <span>Executive Hiring Evaluation</span>
                    </p>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {report.finalSummary.summary}
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION 2: Communication Dimensions Breakdown */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 text-xl">insights</span>
                    <h3 className="font-display text-base font-bold text-slate-900">Communication Dimensions Breakdown</h3>
                  </div>
                  <span className="font-mono text-xs text-slate-500">Weighted Rubric</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {COMMUNICATION_METRICS.map(({ key, label, weight, desc }) => {
                    // Average metric score across answered questions
                    const answered = (report?.questions || []).filter((q) => q.communicationFeedback && q.communicationFeedback[key] !== undefined);
                    const avg = answered.length > 0
                      ? Math.round(answered.reduce((sum, q) => sum + (q.communicationFeedback[key] || 0), 0) / answered.length)
                      : commScore;

                    return (
                      <div key={key} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{label}</span>
                          <span className="font-mono text-xs font-bold text-blue-700">{avg}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${avg}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Weight: <strong className="text-slate-700">{weight}%</strong> • {desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: Strengths, Improvements & Revision Plan */}
              {report?.finalSummary && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <span className="material-symbols-outlined text-xl text-emerald-600">thumb_up</span>
                      <h3 className="font-display text-sm font-bold">Demonstrated Strengths</h3>
                    </div>
                    <ul className="space-y-2">
                      {(report.finalSummary.strengths || ['Clear architectural vocabulary', 'Good structure on problem solving']).map((s, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                          <span className="material-symbols-outlined text-sm text-emerald-600 shrink-0 mt-0.5">check_circle</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                    <div className="flex items-center gap-2 text-amber-800">
                      <span className="material-symbols-outlined text-xl text-amber-600">warning</span>
                      <h3 className="font-display text-sm font-bold">Priority Areas for Improvement</h3>
                    </div>
                    <ul className="space-y-2">
                      {(report.finalSummary.areasForImprovement || ['Deepen technical detail around edge cases', 'Quantify business impact']).map((imp, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                          <span className="material-symbols-outlined text-sm text-amber-600 shrink-0 mt-0.5">arrow_upward</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* SECTION 4: Topics to Revise & Actionable Next Steps */}
              {report?.finalSummary && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 text-xl">menu_book</span>
                    <h3 className="font-display text-base font-bold text-slate-900">Recommended Topics to Revise</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(report.finalSummary.topicsToRevise || ['State Management Internals', 'Distributed Caching', 'STAR Methodology']).map((topic, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        {topic}
                      </span>
                    ))}
                  </div>

                  {report.finalSummary.practiceQuestions?.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <p className="font-display text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Practice Questions for Next Round:
                      </p>
                      <div className="space-y-1.5">
                        {report.finalSummary.practiceQuestions.map((pq, i) => (
                          <p key={i} className="text-xs text-slate-600 flex items-start gap-2">
                            <span className="material-symbols-outlined text-sm text-blue-600 shrink-0 mt-0.5">help_outline</span>
                            <span>{pq}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 5: Question-by-Question Deep Review */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 text-xl">fact_check</span>
                    <h3 className="font-display text-base font-bold text-slate-900">Question-by-Question Evaluation</h3>
                  </div>
                  <span className="font-mono text-xs text-slate-400">Detailed Feedback & Model Answers</span>
                </div>

                <div className="space-y-5">
                  {(report?.questions || []).map((q, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-display text-sm font-bold text-slate-900">{q.question}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono text-[10px] uppercase font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                                {q.category || 'technical'}
                              </span>
                              {q.isVoice && (
                                <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs">mic</span>
                                  <span>Voice Answer</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="font-display text-sm font-bold text-blue-700">
                              {q.performanceScore || q.score || 0}%
                            </span>
                            <p className="font-mono text-[9px] uppercase text-slate-400 font-semibold">Performance</p>
                          </div>
                          <div className="text-right">
                            <span className="font-display text-sm font-bold text-emerald-700">
                              {q.communicationScore || 0}%
                            </span>
                            <p className="font-mono text-[9px] uppercase text-slate-400 font-semibold">Communication</p>
                          </div>
                        </div>
                      </div>

                      {/* Candidate's submitted answer */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200/70 text-xs text-slate-700 space-y-1">
                        <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">Candidate Response:</span>
                        <p className="italic leading-relaxed">{q.answer || '(No response recorded)'}</p>
                      </div>

                      {/* AI Model Answer Rewrite */}
                      {q.performanceFeedback?.modelAnswer && (
                        <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/70 text-xs text-slate-800 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
                            <span>Model Answer Benchmark Rewrite:</span>
                          </div>
                          <p className="leading-relaxed">{q.performanceFeedback.modelAnswer}</p>
                        </div>
                      )}

                      {/* Reviewer comments */}
                      {q.performanceFeedback?.comments && (
                        <p className="text-xs text-slate-600 bg-slate-100/70 p-3 rounded-lg border border-slate-200/60 leading-relaxed">
                          <strong>Evaluator Feedback:</strong> {q.performanceFeedback.comments}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={reset}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                >
                  🔄 Practice Another Loop
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('history');
                    loadHistory();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  📜 View All Past Loops
                </button>
              </div>
            </div>
          );
        })()
      )}

      {/* VIEW: INTERVIEW HISTORY */}
      {activeTab === 'history' && !selectedHistoricalInterview && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-slate-900">Your Mock Interview History</h2>
              <p className="text-xs text-slate-500">Track communication fluency and technical performance progression over time.</p>
            </div>
            <button
              type="button"
              onClick={loadHistory}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              <span>Refresh</span>
            </button>
          </div>

          {historyLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-24 rounded-2xl" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <EmptyState
              icon="🎤"
              title="No interview sessions recorded yet"
              description="Complete a mock interview loop to build your verbal communication history."
              action={{
                label: 'Launch First Session',
                onClick: () => {
                  setActiveTab('interview');
                  reset();
                },
              }}
            />
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item._id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">mic</span>
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold text-slate-900">{item.role}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="font-mono text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {item.type}
                        </span>
                        <span className="font-mono text-[10px] uppercase font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {item.difficulty}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(item.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="font-display text-lg font-bold text-blue-700">
                        {item.overallPerformanceScore || item.overallScore || 0}%
                      </span>
                      <p className="font-mono text-[9px] uppercase text-slate-400 font-semibold">Performance</p>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-lg font-bold text-emerald-700">
                        {item.overallCommunicationScore || 0}%
                      </span>
                      <p className="font-mono text-[9px] uppercase text-slate-400 font-semibold">Communication</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => viewHistoricalDetail(item._id)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      View Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MockInterview;
