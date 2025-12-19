
import React, { useState } from 'react';
import { analyzeResume } from './services/geminiService';
import { AnalysisState, ResumeAnalysis } from './types';
import CircularScore from './components/CircularScore';
import MatchBadge from './components/MatchBadge';

const App: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null,
  });

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      setState(prev => ({ ...prev, error: 'Please provide both a Job Description and a Resume.' }));
      return;
    }

    setState({ isLoading: true, result: null, error: null });

    try {
      const result = await analyzeResume(jobDescription, resumeText);
      setState({ isLoading: false, result, error: null });
    } catch (err: any) {
      setState({ 
        isLoading: false, 
        result: null, 
        error: err.message || 'An unexpected error occurred. Please try again.' 
      });
    }
  };

  const handleReset = () => {
    setState({ isLoading: false, result: null, error: null });
    setResumeText('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">HireSync <span className="text-indigo-600">AI</span></h1>
          </div>
          <div className="text-sm font-medium text-slate-500">
            Intelligent Hiring Assistant
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Section */}
          <div className={`lg:col-span-5 space-y-6 ${state.result ? 'hidden lg:block' : ''}`}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Description</label>
                <textarea
                  className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-sm"
                  placeholder="Paste the target Job Description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Candidate Resume</label>
                <textarea
                  className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-sm"
                  placeholder="Paste the candidate's Resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>

              {state.error && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-sm flex items-start space-x-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{state.error}</span>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={state.isLoading}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 ${
                  state.isLoading 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                }`}
              >
                {state.isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing Alignment...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Screen Resume</span>
                  </>
                )}
              </button>
            </div>

            {/* Simple Tips */}
            {!state.result && (
              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <h3 className="font-bold text-indigo-900 mb-2 flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.464 15.05a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM19.142 15.657l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 01-1.414 1.414z" />
                  </svg>
                  <span>Quick Start Guide</span>
                </h3>
                <ul className="text-sm text-indigo-800/80 space-y-2">
                  <li>• Paste the Job Description in the top box.</li>
                  <li>• Paste the raw text of the Candidate's Resume below.</li>
                  <li>• Click "Screen Resume" to generate match scores and insights.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className={`lg:col-span-7 space-y-6 ${!state.result ? 'flex flex-col items-center justify-center py-20 opacity-40' : ''}`}>
            {state.result ? (
              <>
                {/* Score Summary Card */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                    <div className="flex items-center space-x-6">
                      <CircularScore score={state.result.matchScore} size={110} />
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">{state.result.candidateSummary.name || 'Candidate'}</h2>
                        <div className="flex items-center space-x-3 mt-2">
                          <MatchBadge type={state.result.recommendation} />
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={handleReset}
                      className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                    >
                      New Analysis
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Summary Info */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Education</h4>
                        <p className="text-sm font-medium text-slate-700">{state.result.candidateSummary.education}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Experience</h4>
                        <p className="text-sm font-medium text-slate-700 leading-relaxed">{state.result.candidateSummary.experience}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Technical Skills</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {state.result.candidateSummary.skills.map((skill, i) => (
                            <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Skill Match Analysis */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Matched Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {state.result.skillMatchAnalysis.matchedSkills.length > 0 ? (
                            state.result.skillMatchAnalysis.matchedSkills.map((skill, i) => (
                              <span key={i} className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs italic text-slate-400">None identified</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Missing Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {state.result.skillMatchAnalysis.missingSkills.length > 0 ? (
                            state.result.skillMatchAnalysis.missingSkills.map((skill, i) => (
                              <span key={i} className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded text-xs font-medium">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs italic text-slate-400">Perfect skill match!</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reasoning & Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Why this score?
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      "{state.result.reasoning}"
                    </p>
                  </div>

                  <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg shadow-indigo-100 text-white">
                    <h3 className="text-sm font-bold mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Actionable Improvements
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-1">Resume Optimization</p>
                        <ul className="text-sm space-y-1 opacity-90">
                          {state.result.improvementSuggestions.resumeImprovements.map((imp, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2 opacity-50">•</span>
                              <span>{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-1">Learning Path</p>
                        <ul className="text-sm space-y-1 opacity-90">
                          {state.result.improvementSuggestions.skillGaps.map((gap, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2 opacity-50">•</span>
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center max-w-sm">
                <div className="bg-slate-100 p-8 rounded-full mb-6">
                  <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-400 mb-2">Ready for Analysis</h2>
                <p className="text-slate-400 text-sm">Fill in the Job Description and Resume to generate a professional candidate screening report.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} HireSync AI - Intelligent Talent Solutions. Powered by Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
