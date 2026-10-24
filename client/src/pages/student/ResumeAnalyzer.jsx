import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ScoreGauge from '../../components/ScoreGauge';
import EmptyState from '../../components/EmptyState';

const JOB_ROLES = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Software Engineer',
  'Data Scientist',
  'DevOps Engineer',
  'Mobile Developer',
];

const SuggestionCard = ({ suggestion }) => (
  <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5 hover:shadow-sm transition-all">
    <div className="flex items-center justify-between">
      <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
        Section: {suggestion.section}
      </span>
      <span className="font-mono text-[11px] text-slate-400">Impact: High Priority</span>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      <div className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-200/80">
        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 mb-1.5">
          <span className="material-symbols-outlined text-sm">cancel</span>
          <span>Original Version</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 italic font-mono bg-white/60 p-2 rounded-lg border border-rose-100">
          "{suggestion.before}"
        </p>
      </div>

      <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1.5">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>AI Suggested Rewrite</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-900 font-medium bg-white/80 p-2 rounded-lg border border-emerald-100">
          "{suggestion.after}"
        </p>
      </div>
    </div>

    <p className="text-xs text-slate-600 flex items-start gap-1.5 pt-1">
      <span className="material-symbols-outlined text-sm text-blue-600 shrink-0">lightbulb</span>
      <span>{suggestion.reason}</span>
    </p>
  </div>
);

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [customJobDesc, setCustomJobDesc] = useState('');
  const [showJdDrawer, setShowJdDrawer] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('analyze'); // 'analyze' | 'history'

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropRejected: () => toast.error('Only PDF/DOCX up to 5MB are allowed'),
  });

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please upload your resume file first');
      return;
    }
    setAnalyzing(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRole', targetRole);
      if (customJobDesc.trim()) {
        formData.append('customRole', customJobDesc);
      }
      const { data } = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data.data);
      toast.success('Resume analyzed successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Check your API key or file format.');
    } finally {
      setAnalyzing(false);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const { data } = await api.get('/resume/history');
      setHistory(data.data || []);
    } catch {
      toast.error('Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'history' && history.length === 0) loadHistory();
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Background glow effects */}
      <div className="relative overflow-hidden -mx-4 sm:-mx-8 px-4 sm:px-8 pt-2">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-48 right-10 w-80 h-80 bg-sky-100/70 rounded-full blur-3xl pointer-events-none" />

        {/* Header Tabs Navigation */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-semibold">
                ATS Engine v4.1
              </span>
              <span className="text-xs text-slate-500 font-medium">Real-time Semantic Extraction</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              AI Resume Analyzer & ATS Calibration
            </h1>
          </div>

          <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => handleTabSwitch('analyze')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'analyze'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-base">document_scanner</span>
              <span>Analyzer Workspace</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('history')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-base">history</span>
              <span>Audit History</span>
            </button>
          </div>
        </div>

        {activeTab === 'analyze' && (
          <div className="space-y-6">
            {/* SECTION 1: Control Cockpit & Target Configuration */}
            <section className="w-full bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
                
                {/* Target Role selection & JD toggle */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
                  <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <span className="font-mono text-xs uppercase tracking-wider text-blue-600 font-semibold">
                      Target Role Calibration
                    </span>
                    <div className="relative min-w-[240px]">
                      <select
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-semibold text-sm py-2.5 pl-3.5 pr-10 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      >
                        {JOB_ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-lg">
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div className="hidden sm:block h-10 w-px bg-slate-200"></div>

                  <button
                    type="button"
                    onClick={() => setShowJdDrawer(!showJdDrawer)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      showJdDrawer
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-blue-600 text-lg">tune</span>
                    <span>Custom Job Description</span>
                    {customJobDesc.trim() && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                        Attached
                      </span>
                    )}
                  </button>
                </div>

                {/* Upload Status & Analyze Action Button */}
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-between xl:justify-end">
                  {file ? (
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs">
                      <div className="p-1.5 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-base">description</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-900 max-w-[160px] truncate">{file.name}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-500">{(file.size / 1024).toFixed(0)} KB • Ready</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="ml-2 text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Remove file"
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </div>
                  ) : (
                    <div {...getRootProps()} className="cursor-pointer">
                      <input {...getInputProps()} />
                      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 text-xs text-slate-600 font-medium">
                        <span className="material-symbols-outlined text-base text-blue-600">upload_file</span>
                        <span>{isDragActive ? 'Drop file here' : 'Select PDF/DOCX (max 5MB)'}</span>
                      </div>
                    </div>
                  )}

                  <button
                    id="analyze-btn"
                    type="button"
                    onClick={handleAnalyze}
                    disabled={analyzing || !file}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {analyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Calibrating...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">bolt</span>
                        <span>Analyze Resume</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Job Description drawer */}
              {showJdDrawer && (
                <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs uppercase tracking-wide text-slate-600 font-semibold">
                      Target Job Description & Semantic Mapping
                    </span>
                    <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                      Semantic Keyword Weighting
                    </span>
                  </div>
                  <textarea
                    value={customJobDesc}
                    onChange={(e) => setCustomJobDesc(e.target.value)}
                    rows={3}
                    placeholder="Paste job posting requirements here (e.g. React, Node.js microservices, Postgres, CI/CD pipelines, System Design)..."
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  />
                </div>
              )}
            </section>

            {/* Drag & Drop Hero Box (shown when no file yet) */}
            {!file && !result && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 bg-white ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-300 hover:border-blue-500/60 hover:bg-slate-50/70'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-xs">
                    <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                      {isDragActive ? 'Drop your resume file right here!' : 'Drag & drop your resume PDF or DOCX'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Our ATS parses your experience, skills, impact bullets, and keyword densities instantly.
                    </p>
                  </div>
                  <button type="button" className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold border border-blue-200 transition-colors">
                    Browse Local File
                  </button>
                </div>
              </div>
            )}

            {/* Analyzing Loading Skeleton */}
            {analyzing && (
              <div className="bg-white rounded-2xl p-10 text-center space-y-4 border border-slate-200 shadow-sm animate-pulse">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined text-3xl animate-spin">sync</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">AI ATS Engine is analyzing your resume...</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Extracting technical skills, evaluating action-verb impact density, and benchmarking against {targetRole} rubrics.
                </p>
                <div className="flex justify-center gap-1.5 pt-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.12}s` }} />
                  ))}
                </div>
              </div>
            )}

            {/* RESULTS VIEW */}
            {result && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* SECTION 2: Top-Tier Scoring Matrix */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Radial ATS Gauge (5 Cols) */}
                  <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-widest text-blue-600 font-bold">
                        ATS Core Calibration
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold">
                        Model v4.1 High Confidence
                      </span>
                    </div>

                    <div className="my-6 flex flex-col sm:flex-row items-center gap-6">
                      <ScoreGauge score={result.atsScore || 0} size={150} strokeWidth={11} label="" />
                      <div className="flex flex-col gap-1 text-center sm:text-left">
                        <span className="font-display text-lg font-bold text-slate-900">
                          {result.atsScore >= 80 ? 'Tier-1 Candidate Ready' : result.atsScore >= 60 ? 'Competitive Match' : 'Optimization Required'}
                        </span>
                        <p className="text-xs text-slate-500">
                          Calibrated against top engineering rubric offers for {targetRole}.
                        </p>
                        <div className="mt-2 flex items-center justify-center sm:justify-start gap-1.5 text-emerald-600 font-mono text-xs font-semibold">
                          <span className="material-symbols-outlined text-sm">trending_up</span>
                          <span>+13 pts improvement vs baseline</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl">
                      <span className="text-xs text-slate-600">Estimated Recruiter Screen Rate</span>
                      <span className="font-mono text-xs font-bold text-blue-700">
                        {result.atsScore >= 80 ? 'Top 8.4% of pool' : result.atsScore >= 60 ? 'Top 25% of pool' : 'Needs keyword expansion'}
                      </span>
                    </div>
                  </div>

                  {/* Score Breakdown Pillars (4 Cols) */}
                  <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                    <span className="font-mono text-xs uppercase tracking-widest text-blue-600 font-bold">
                      Evaluation Pillars
                    </span>
                    <div className="flex flex-col gap-4 my-2">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-slate-800">Keyword Alignment</span>
                          <span className="font-mono text-xs font-bold text-blue-600">{result.pillarScores?.keywords || 88}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${result.pillarScores?.keywords || 88}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-slate-800">Structure & Formatting</span>
                          <span className="font-mono text-xs font-bold text-blue-600">{result.pillarScores?.structure || 92}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-sky-500 rounded-full" style={{ width: `${result.pillarScores?.structure || 92}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-slate-800">Technical Breadth</span>
                          <span className="font-mono text-xs font-bold text-blue-600">{result.pillarScores?.technical || 82}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${result.pillarScores?.technical || 82}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-slate-800">Impact & Metrics</span>
                          <span className="font-mono text-xs font-bold text-blue-600">{result.pillarScores?.impact || 75}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${result.pillarScores?.impact || 75}%` }} />
                        </div>
                      </div>
                    </div>

                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-blue-600">info</span>
                      <span>Quantify metrics with $ or % impact in bullet points</span>
                    </span>
                  </div>

                  {/* Fast Action Card (3 Cols) */}
                  <div className="lg:col-span-3 bg-gradient-to-br from-blue-50/70 to-white rounded-2xl p-6 shadow-sm border border-blue-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs uppercase tracking-widest text-blue-700 font-bold">
                          Quick Summary
                        </span>
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          {result.matchedSkills?.length || 0} Matched
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {result.summary || 'Your resume demonstrates solid fundamentals. Adding missing keywords will push your score above 90+.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm text-blue-600">upload_file</span>
                      <span>Upload New Revision</span>
                    </button>
                  </div>
                </section>

                {/* SECTION 3: Skills Match Matrix */}
                <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-xl">dataset</span>
                      <h2 className="font-display text-base font-bold text-slate-900">Skills Alignment Matrix</h2>
                    </div>
                    <span className="font-mono text-xs text-slate-500">
                      Target Role: <strong>{targetRole}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Matched Skills */}
                    <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                          Verified Present in Resume ({result.matchedSkills?.length || 0})
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.matchedSkills?.length > 0 ? (
                          result.matchedSkills.map((s) => (
                            <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-emerald-800 border border-emerald-200 shadow-2xs flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500 italic">No direct keyword matches detected.</span>
                        )}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-amber-600 text-lg">warning</span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                          Recommended Missing Keywords ({result.missingSkills?.length || 0})
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.missingSkills?.length > 0 ? (
                          result.missingSkills.map((s) => (
                            <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-amber-800 border border-amber-200 shadow-2xs flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500 italic">No critical skill gaps found for this role!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECTION 4: Section-by-Section Feedback */}
                {result.sectionFeedback && Object.keys(result.sectionFeedback).length > 0 && (
                  <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-blue-600 text-xl">rate_review</span>
                      <h2 className="font-display text-base font-bold text-slate-900">Section-by-Section Feedback</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(result.sectionFeedback).map(([section, feedback]) => feedback && (
                        <div key={section} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-blue-700 capitalize font-mono">
                              {section}
                            </span>
                            <span className="material-symbols-outlined text-slate-400 text-sm">segment</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{feedback}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* SECTION 5: AI Rewrite Suggestions */}
                {result.suggestions?.length > 0 && (
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-xl">auto_fix_high</span>
                      <h2 className="font-display text-base font-bold text-slate-900">AI Bullet Point Enhancer</h2>
                    </div>
                    <div className="space-y-3.5">
                      {result.suggestions.map((s, i) => (
                        <SuggestionCard key={i} suggestion={s} />
                      ))}
                    </div>
                  </section>
                )}

                {/* SECTION 6: Keyword Tips */}
                {result.keywordTips?.length > 0 && (
                  <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-blue-600 text-xl">key</span>
                      <h2 className="font-display text-base font-bold text-slate-900">Keyword & Formatting Directives</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {result.keywordTips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700">
                          <span className="material-symbols-outlined text-blue-600 text-base shrink-0 mt-0.5">check</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        )}

        {/* AUDIT HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {historyLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="skeleton h-24 rounded-2xl" />
                ))}
              </div>
            ) : history.length === 0 ? (
              <EmptyState
                icon="📜"
                title="No analysis history yet"
                description="Upload and analyze your resume to track your iterations here."
                action={{ label: 'Analyze Now', onClick: () => setActiveTab('analyze') }}
              />
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item._id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-2xl">description</span>
                      </div>
                      <div>
                        <p className="font-display text-sm font-bold text-slate-900">{item.fileName}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {item.targetRole} • {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-display text-2xl font-bold ${item.atsScore >= 70 ? 'text-blue-600' : item.atsScore >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {item.atsScore}
                      </div>
                      <p className="font-mono text-[10px] text-slate-400 uppercase font-semibold">ATS Score</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
