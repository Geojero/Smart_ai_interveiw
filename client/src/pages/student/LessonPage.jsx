import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ChatMessage = ({ msg }) => (
  <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
      msg.role === 'user' ? 'bg-brand-600' : 'bg-gradient-to-br from-purple-500 to-brand-600'
    }`}>
      {msg.role === 'user' ? '👤' : '🤖'}
    </div>
    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
      msg.role === 'user'
        ? 'bg-brand-600 text-white rounded-tr-sm'
        : 'bg-white/10 text-gray-200 rounded-tl-sm'
    }`}>
      {msg.role === 'assistant' ? (
        <div className="markdown-content prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{msg.content}</ReactMarkdown>
        </div>
      ) : msg.content}
    </div>
  </div>
);

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [hasQuiz, setHasQuiz] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  // Tutor chat
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const { data } = await api.get(`/learning/lesson/${id}`);
        setLesson(data.data.lesson);
        setCompleted(data.data.completed);
        setHasQuiz(data.data.hasQuiz);
        setQuizId(data.data.quizId);
      } catch {
        toast.error('Failed to load lesson');
        navigate('/student/learning');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await api.post('/learning/complete-lesson', { lessonId: id });
      setCompleted(true);
      toast.success('Lesson marked as complete! 🎉');
    } catch {
      toast.error('Failed to mark complete');
    } finally {
      setCompleting(false);
    }
  };

  const loadQuiz = async () => {
    if (!quizId) return;
    try {
      const { data } = await api.get(`/learning/quiz/${quizId}`);
      setQuiz(data.data);
      setShowQuiz(true);
    } catch {
      toast.error('Failed to load quiz');
    }
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      toast.error('Please answer all questions');
      return;
    }
    setSubmittingQuiz(true);
    try {
      const answersArr = Object.entries(answers).map(([qi, si]) => ({
        questionIndex: parseInt(qi),
        selectedIndex: si,
      }));
      const { data } = await api.post(`/learning/quiz/${quizId}/submit`, { answers: answersArr });
      setQuizResult(data.data);
      toast.success(`Quiz complete! Score: ${data.data.score}%`);
    } catch {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', content: chatInput };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const { data } = await api.post('/learning/tutor-chat', {
        concept: lesson?.topic?.title || 'Programming',
        question: chatInput,
        history,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.data.response }]);
    } catch {
      toast.error('AI tutor unavailable. Check your API key.');
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-64 rounded" />
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 animate-fade-in">
      {/* Main content */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/student/learning')} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all">
            ← Back
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <span>{lesson?.topic?.title}</span>
              <span>›</span>
              <span className={lesson?.topic?.track === 'dsa' ? 'text-brand-400' : 'text-success-400'}>
                {lesson?.topic?.track?.toUpperCase()}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white">{lesson?.title}</h1>
          </div>
          {completed && (
            <span className="badge bg-success-500/20 text-success-400 border border-success-500/30 px-3 py-1">
              ✓ Completed
            </span>
          )}
        </div>

        {/* Content */}
        <div className="glass-card p-8">
          <div className="markdown-content">
            <ReactMarkdown>{lesson?.content || ''}</ReactMarkdown>
          </div>
        </div>

        {/* Examples */}
        {lesson?.examples?.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span>💡</span> Examples
            </h2>
            <div className="space-y-4">
              {lesson.examples.map((ex, i) => (
                <div key={i}>
                  <h3 className="text-sm font-semibold text-brand-400 mb-2">{ex.title}</h3>
                  <pre className="code-block text-xs"><code>{ex.code}</code></pre>
                  <p className="text-sm text-gray-400 mt-2">{ex.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practice Problems */}
        {lesson?.practiceProblems?.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span>🏋️</span> Practice Problems
            </h2>
            <div className="space-y-4">
              {lesson.practiceProblems.map((prob, i) => (
                <details key={i} className="group">
                  <summary className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`badge text-xs font-bold px-2 py-1 ${
                        prob.difficulty === 'easy' ? 'bg-success-500/20 text-success-400' :
                        prob.difficulty === 'medium' ? 'bg-warning-500/20 text-warning-400' :
                        'bg-accent-500/20 text-accent-400'
                      }`}>{prob.difficulty}</span>
                      <span className="font-medium text-white">{prob.title}</span>
                    </div>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-3 px-4 space-y-3">
                    <p className="text-sm text-gray-300">{prob.description}</p>
                    {prob.hint && (
                      <div className="p-3 bg-warning-500/10 rounded-xl border border-warning-500/20">
                        <p className="text-xs text-warning-400 font-semibold mb-1">💡 Hint</p>
                        <p className="text-sm text-gray-300">{prob.hint}</p>
                      </div>
                    )}
                    {prob.solution && (
                      <details>
                        <summary className="text-xs text-brand-400 cursor-pointer hover:text-brand-300">View Solution</summary>
                        <pre className="code-block mt-2 text-xs"><code>{prob.solution}</code></pre>
                      </details>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {hasQuiz && !showQuiz && !quizResult && (
          <div className="glass-card p-6 bg-gradient-to-r from-brand-600/10 to-purple-600/10 border-brand-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📝</span>
                <div>
                  <p className="font-semibold text-white">Take the Quiz</p>
                  <p className="text-sm text-gray-400">Test your understanding of this lesson</p>
                </div>
              </div>
              <button onClick={loadQuiz} className="btn-brand text-sm px-4 py-2">
                Start Quiz →
              </button>
            </div>
          </div>
        )}

        {showQuiz && quiz && !quizResult && (
          <div className="glass-card p-6 space-y-6">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <span>📝</span> Knowledge Check ({quiz.questions.length} questions)
            </h2>
            {quiz.questions.map((q, qi) => (
              <div key={qi} className="space-y-3">
                <p className="font-medium text-white">{qi + 1}. {q.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => setAnswers({ ...answers, [qi]: oi })}
                      className={`p-3 rounded-xl text-sm text-left border transition-all ${
                        answers[qi] === oi
                          ? 'bg-brand-600/30 border-brand-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:border-brand-500/50'
                      }`}
                    >
                      {String.fromCharCode(65 + oi)}. {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={submitQuiz} disabled={submittingQuiz} className="btn-brand">
              {submittingQuiz ? 'Submitting...' : '✅ Submit Quiz'}
            </button>
          </div>
        )}

        {quizResult && (
          <div className={`glass-card p-6 text-center ${quizResult.score >= 60 ? 'border-success-500/40 bg-success-500/5' : 'border-accent-500/40 bg-accent-500/5'}`}>
            <div className="text-5xl mb-3">{quizResult.score >= 60 ? '🎉' : '📚'}</div>
            <p className="text-2xl font-black text-white mb-1">{quizResult.score}%</p>
            <p className="text-gray-400">{quizResult.correct}/{quizResult.total} correct</p>
            <p className={`text-sm font-medium mt-2 ${quizResult.score >= 60 ? 'text-success-400' : 'text-accent-400'}`}>
              {quizResult.score >= 80 ? 'Excellent! 🌟' : quizResult.score >= 60 ? 'Good job! Keep it up' : 'Review the lesson and try again'}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-4 flex-wrap">
          {!completed && (
            <button
              id="mark-complete-btn"
              onClick={handleComplete}
              disabled={completing}
              className="btn-brand flex items-center gap-2"
            >
              {completing ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Marking...</>
              ) : '✅ Mark as Complete'}
            </button>
          )}
          <button onClick={() => setChatOpen(!chatOpen)} className="btn-secondary flex items-center gap-2">
            🤖 {chatOpen ? 'Close' : 'Ask AI Tutor'}
          </button>
        </div>
      </div>

      {/* AI Tutor chat panel */}
      {chatOpen && (
        <div className="w-80 xl:w-96 flex-shrink-0 animate-slide-in-right">
          <div className="glass-card flex flex-col h-[70vh] sticky top-6">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-brand-600 flex items-center justify-center">
                🤖
              </div>
              <div>
                <p className="font-semibold text-white text-sm">AI Tutor</p>
                <p className="text-xs text-gray-400">Ask anything about this lesson</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 text-sm mt-8">
                  <p className="text-2xl mb-2">🎓</p>
                  <p>Ask me anything about {lesson?.title}!</p>
                </div>
              )}
              {messages.map((msg, i) => <ChatMessage key={i} msg={msg} />)}
              {chatLoading && (
                <div className="flex gap-2 items-center text-gray-400 text-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                  Thinking...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendChat()}
                  placeholder="Ask a question..."
                  className="input-field flex-1 text-sm py-2"
                />
                <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} className="btn-brand px-3 py-2 text-sm">
                  ↑
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPage;
