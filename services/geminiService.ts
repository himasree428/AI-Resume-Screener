
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeResume = async (jobDescription: string, resumeText: string): Promise<ResumeAnalysis> => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `You are a professional AI Recruitment Specialist and Resume Screener. 
  Your goal is to parse resumes and evaluate them against a specific Job Description (JD).
  
  Be objective and thorough. prioritize skills relevance above all, then experience alignment, education, and projects.
  
  You must return a valid JSON object matching the requested schema.`;

  const prompt = `
  Analyze the following Resume against the Job Description.
  
  ### JOB DESCRIPTION ###
  ${jobDescription}
  
  ### CANDIDATE RESUME ###
  ${resumeText}
  
  Perform a detailed analysis and provide a match score from 0 to 100.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            candidateSummary: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                education: { type: Type.STRING },
                experience: { type: Type.STRING },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["name", "education", "experience", "skills"],
            },
            skillMatchAnalysis: {
              type: Type.OBJECT,
              properties: {
                matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["matchedSkills", "missingSkills"],
            },
            matchScore: { type: Type.NUMBER },
            recommendation: { 
              type: Type.STRING, 
              description: "One of: 'Strong Fit', 'Moderate Fit', 'Weak Fit'" 
            },
            improvementSuggestions: {
              type: Type.OBJECT,
              properties: {
                skillGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                resumeImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["skillGaps", "resumeImprovements"],
            },
            reasoning: { type: Type.STRING },
          },
          required: ["candidateSummary", "skillMatchAnalysis", "matchScore", "recommendation", "improvementSuggestions", "reasoning"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as ResumeAnalysis;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    throw error;
  }
};
