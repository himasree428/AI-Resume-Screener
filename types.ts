
export interface ResumeAnalysis {
  candidateSummary: {
    name: string;
    education: string;
    experience: string;
    skills: string[];
  };
  skillMatchAnalysis: {
    matchedSkills: string[];
    missingSkills: string[];
  };
  matchScore: number;
  recommendation: 'Strong Fit' | 'Moderate Fit' | 'Weak Fit';
  improvementSuggestions: {
    skillGaps: string[];
    resumeImprovements: string[];
  };
  reasoning: string;
}

export interface AnalysisState {
  isLoading: boolean;
  result: ResumeAnalysis | null;
  error: string | null;
}
