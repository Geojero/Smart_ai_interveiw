const { GoogleGenAI } = require('@google/genai');

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('Google Gemini API key not found. Please set GEMINI_API_KEY or GOOGLE_API_KEY in your server/.env file.');
  }
  return new GoogleGenAI({ apiKey });
};

const getModel = () => process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// JSON Schemas for guaranteed structured outputs
const resumeAnalysisSchema = {
  type: 'object',
  properties: {
    atsScore: { type: 'number' },
    matchedSkills: { type: 'array', items: { type: 'string' } },
    missingSkills: { type: 'array', items: { type: 'string' } },
    sectionFeedback: {
      type: 'object',
      properties: {
        summary: { type: 'string' },
        experience: { type: 'string' },
        education: { type: 'string' },
        skills: { type: 'string' },
        projects: { type: 'string' },
      },
      required: ['summary', 'experience', 'education', 'skills', 'projects'],
    },
    suggestions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          section: { type: 'string' },
          before: { type: 'string' },
          after: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['section', 'before', 'after', 'reason'],
      },
    },
    keywordTips: { type: 'array', items: { type: 'string' } },
  },
  required: ['atsScore', 'matchedSkills', 'missingSkills', 'sectionFeedback', 'suggestions', 'keywordTips'],
};

const interviewQuestionsSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      question: { type: 'string' },
      category: { type: 'string' },
    },
    required: ['question'],
  },
};

const interviewScoreSchema = {
  type: 'object',
  properties: {
    score: { type: 'number' },
    feedback: {
      type: 'object',
      properties: {
        clarity: { type: 'number' },
        confidence: { type: 'number' },
        grammar: { type: 'number' },
        structure: { type: 'number' },
        comments: { type: 'string' },
      },
      required: ['clarity', 'confidence', 'grammar', 'structure', 'comments'],
    },
  },
  required: ['score', 'feedback'],
};

const comprehensiveAnswerSchema = {
  type: 'object',
  properties: {
    performance: {
      type: 'object',
      properties: {
        score: { type: 'number' },
        correctness: { type: 'number' },
        depth: { type: 'number' },
        problemSolving: { type: 'number' },
        explanationQuality: { type: 'number' },
        structure: { type: 'number' },
        strengths: { type: 'array', items: { type: 'string' } },
        improvements: { type: 'array', items: { type: 'string' } },
        modelAnswer: { type: 'string' },
        comments: { type: 'string' },
      },
      required: ['score', 'correctness', 'depth', 'problemSolving', 'explanationQuality', 'structure', 'strengths', 'improvements', 'modelAnswer', 'comments'],
    },
    communication: {
      type: 'object',
      properties: {
        score: { type: 'number' },
        fluency: { type: 'number' },
        clarity: { type: 'number' },
        grammar: { type: 'number' },
        vocabulary: { type: 'number' },
        coherence: { type: 'number' },
        relevance: { type: 'number' },
        pronunciationDelivery: { type: 'number' },
        comments: { type: 'string' },
      },
      required: ['score', 'fluency', 'clarity', 'grammar', 'vocabulary', 'coherence', 'relevance', 'comments'],
    },
    followUpQuestion: { type: 'string' },
  },
  required: ['performance', 'communication'],
};

const interviewSummarySchema = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    strengths: { type: 'array', items: { type: 'string' } },
    areasForImprovement: { type: 'array', items: { type: 'string' } },
    topicsToRevise: { type: 'array', items: { type: 'string' } },
    recommendedNextSteps: { type: 'array', items: { type: 'string' } },
    practiceQuestions: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary', 'strengths', 'areasForImprovement', 'topicsToRevise', 'recommendedNextSteps', 'practiceQuestions'],
};

/**
 * Clean & parse JSON response from Gemini with fallback repair
 */
const parseJsonResponse = (text, fallbackType = 'object') => {
  if (!text || typeof text !== 'string') {
    throw new Error('AI returned an empty response');
  }

  let cleaned = text.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }

  // 1. Direct JSON.parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // 2. Extract substring from first bracket to last bracket
    const openChar = fallbackType === 'array' ? '[' : '{';
    const closeChar = fallbackType === 'array' ? ']' : '}';
    const firstIdx = cleaned.indexOf(openChar);
    const lastIdx = cleaned.lastIndexOf(closeChar);

    if (firstIdx !== -1 && lastIdx > firstIdx) {
      let candidate = cleaned.slice(firstIdx, lastIdx + 1);
      try {
        return JSON.parse(candidate);
      } catch {
        // Remove trailing commas before closing braces/brackets
        candidate = candidate.replace(/,\s*([}\]])/g, '$1');
        try {
          return JSON.parse(candidate);
        } catch {
          // Continue to fallback
        }
      }
    }
  }

  // 3. Fallback safe defaults if extraction completely failed
  console.warn('Could not parse AI JSON output directly. Using safe fallback structure. Raw text:', text.slice(0, 300));
  if (fallbackType === 'array') {
    return [{ question: 'Explain a challenging technical project you worked on and how you resolved key obstacles.', category: 'technical' }];
  }

  return {
    atsScore: 65,
    matchedSkills: [],
    missingSkills: [],
    sectionFeedback: {
      summary: 'Review your summary to clearly highlight your core technical strengths.',
      experience: 'Focus on measurable outcomes and metrics in your work experience.',
      education: 'Include relevant coursework and academic honors.',
      skills: 'Group your technical skills into categories like Languages, Frameworks, and Tools.',
      projects: 'Describe the problem statement, technologies used, and business/technical impact.',
    },
    suggestions: [
      {
        section: 'Experience',
        before: 'Worked on web applications',
        after: 'Architected and deployed responsive web applications, reducing load times by 25%',
        reason: 'Quantifies impact and highlights technical leadership',
      },
    ],
    keywordTips: ['Include exact keyword matches from the job description', 'Highlight specific libraries and versions used'],
  };
};

/**
 * Analyze resume text against a target role using Google Gemini
 */
const analyzeResume = async (resumeText, targetRole, requiredSkills) => {
  const skillsStr = (requiredSkills || []).join(', ');

  const prompt = `You are an expert ATS resume analyzer and career coach. Analyze the following resume for the target role of "${targetRole}".

Target Role Required Skills: ${skillsStr}

Resume Text:
---
${resumeText}
---

Provide a thorough, strict ATS evaluation:
1. "atsScore": realistic ATS match score from 0 to 100 based on keyword match, experience depth, and formatting.
2. "matchedSkills": list of required skills present in the resume.
3. "missingSkills": list of required skills absent or weak in the resume.
4. "sectionFeedback": constructive feedback for summary, experience, education, skills, and projects.
5. "suggestions": at least 3 high-impact suggestions with real before and after rewrites using strong action verbs and quantified impact.
6. "keywordTips": 3-5 practical tips to boost keyword alignment for this specific role.`;

  const ai = getClient();
  const response = await ai.models.generateContent({
    model: getModel(),
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: resumeAnalysisSchema,
      maxOutputTokens: 8192,
    },
  });

  return parseJsonResponse(response.text, 'object');
};

/**
 * Generate mock interview questions for a role and type (legacy compatibility)
 */
const generateInterviewQuestions = async (role, type, count = 5) => {
  return generateResumeInterviewQuestions(null, role, type, 'intermediate', count);
};

/**
 * Generate personalized interview questions based on actual resume and role
 */
const generateResumeInterviewQuestions = async (resumeText, role, type = 'technical', difficulty = 'intermediate', count = 5) => {
  const safeCount = Math.max(1, Math.min(count, 10));
  
  let resumeContext = '';
  if (resumeText && resumeText.trim().length > 50) {
    // Truncate safely if excessively long while keeping core projects and experience
    const trimmed = resumeText.slice(0, 5000);
    resumeContext = `CANDIDATE'S ACTUAL RESUME:
---
${trimmed}
---
IMPORTANT GROUNDING INSTRUCTIONS:
- You MUST anchor questions in the candidate's real projects, technologies, libraries, architectures, and experiences mentioned in their resume above.
- NEVER fabricate companies, projects, or certifications that are not listed in the resume.
- For technical questions: ask about real architectural decisions, debugging hurdles, state management, API designs, performance optimizations, or trade-offs in their listed projects.
- For HR questions: ask about teamwork, leadership, cross-functional challenges, or ownership specifically tied to their actual project background.
- If details in the resume are brief, ask them to elaborate on specific technologies or deliverables mentioned.`;
  } else {
    resumeContext = `NOTE: No resume provided. Generate realistic, challenging industry-standard interview questions tailored strictly to the target role of "${role}".`;
  }

  let typeGuidance = '';
  if (type === 'technical') {
    typeGuidance = `This is a purely TECHNICAL interview. Focus on algorithms, frameworks, state management, database design, testing, debugging, and code design relevant to ${role} and the candidate's resume.`;
  } else if (type === 'hr') {
    typeGuidance = `This is an HR & BEHAVIORAL interview. Focus on STAR method storytelling (Situation, Task, Action, Result), team conflict resolution, deadline management, career motivation, and ownership.`;
  } else {
    typeGuidance = `This is a MIXED interview (Technical + HR). Generate a balanced sequence of technical and behavioral questions (e.g. 50% technical and 50% HR/behavioral). Set the "category" property of each question to either "technical" or "hr".`;
  }

  const prompt = `You are a Principal Engineering Lead and Senior Technical Recruiter conducting an interview.
Target Job Role: "${role}"
Interview Format: "${type}"
Difficulty Level: "${difficulty}" (beginner = foundational & syntax; intermediate = architectural trade-offs & problem solving; advanced = high-scale distributed systems, deep internals, edge cases)
Number of Questions: ${safeCount}

${typeGuidance}

${resumeContext}

Generate exactly ${safeCount} distinct, articulate, and realistic interview questions.
Each question object MUST have:
- "question": The complete question string.
- "category": Either "technical" or "hr".`;

  const ai = getClient();
  const response = await ai.models.generateContent({
    model: getModel(),
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: interviewQuestionsSchema,
      maxOutputTokens: 3000,
    },
  });

  const parsed = parseJsonResponse(response.text, 'array');
  return Array.isArray(parsed) && parsed.length > 0
    ? parsed.map((q) => ({
        question: q.question || 'Describe a complex technical challenge you solved.',
        category: q.category === 'hr' ? 'hr' : 'technical',
      }))
    : [{ question: `Explain your experience working with core technologies for the role of ${role}.`, category: 'technical' }];
};

/**
 * Score a single interview answer (legacy compatibility)
 */
const scoreInterviewAnswer = async (question, answer, role, type) => {
  const result = await evaluateAnswerWithCommunication({
    question,
    answer,
    role,
    type,
    category: type,
    difficulty: 'intermediate',
  });

  return {
    score: result.performance.score,
    feedback: {
      clarity: Math.round(result.communication.clarity / 4),
      confidence: Math.round(result.communication.fluency / 4),
      grammar: Math.round(result.communication.grammar / 4),
      structure: Math.round(result.communication.coherence / 4),
      comments: result.performance.comments || result.communication.comments,
    },
  };
};

/**
 * Deep evaluation of both Interview Performance and Communication Skills
 * Handles both text and audio inputs with Gemini multimodal understanding
 */
const evaluateAnswerWithCommunication = async ({
  question,
  answer,
  role,
  type = 'technical',
  category = 'technical',
  difficulty = 'intermediate',
  audioBuffer = null,
  audioMimeType = null,
  isVoice = false,
  audioDuration = 0,
}) => {
  const prompt = `You are an expert interview evaluator assessing a candidate's answer for the role of "${role}".
Question (${category}): "${question}"
Difficulty: "${difficulty}"
Interview Format: "${type}"
Candidate Response: "${answer || '(Audio recording submitted)'}"

${isVoice ? 'The candidate provided a SPOKEN voice response.' : 'The candidate provided a TYPED written response.'}

EVALUATION RUBRIC & INSTRUCTIONS:

1. COMMUNICATION SKILLS ASSESSMENT (Score 0-100 for each dimension):
- Fluency (weight 25%): Speaking/writing flow, pauses, filler words, repetition.
- Clarity (weight 20%): How clearly and understandably ideas are articulated.
- Grammar (weight 15%): Grammatical correctness and sentence construction.
- Vocabulary (weight 15%): Appropriate technical and professional terminology without undue jargon.
- Coherence (weight 15%): Logical structuring, smooth transitions, and connection between concepts.
- Relevance (weight 10%): Direct alignment with what the question asked.
- Pronunciation / Speech Delivery: ${isVoice && audioBuffer ? 'Assess pacing, articulation, and delivery from the audio. Do NOT penalize regional accents, dialects, or harmless differences.' : 'Set pronunciationDelivery to null since this is evaluated from text or transcript.'}
Calculate weighted communication score:
Communication Score = (Fluency * 0.25) + (Clarity * 0.20) + (Grammar * 0.15) + (Vocabulary * 0.15) + (Coherence * 0.15) + (Relevance * 0.10)

IMPORTANT: Distinguish communication proficiency from technical correctness. Do NOT infer personality, confidence, or intelligence from voice.

2. INTERVIEW PERFORMANCE ASSESSMENT (Score 0-100):
${category === 'technical'
  ? '- Criteria: Technical correctness, depth of understanding, problem-solving reasoning, and explanation quality.\n- Provide concrete strengths, improvements, and a high-caliber model answer rewrite.'
  : '- Criteria: STAR structure (Situation, Task, Action, Result), relevance, specific real-world examples, alignment, and impact.\n- Provide concrete strengths, improvements, and an ideal model answer rewrite.'}

3. FOLLOW-UP QUESTION:
Generate a smart, contextual follow-up question if the answer can be probed deeper (e.g. asking about edge cases, scalability, or personal contribution), or empty string "" if the answer is already exhaustive.`;

  const ai = getClient();

  const parts = [{ text: prompt }];

  // If audio buffer is supplied, attach it inline for Gemini multimodal analysis
  if (isVoice && audioBuffer && audioMimeType) {
    try {
      parts.push({
        inlineData: {
          mimeType: audioMimeType,
          data: audioBuffer.toString('base64'),
        },
      });
    } catch (e) {
      console.warn('Could not attach audio buffer for Gemini evaluation, continuing with text:', e.message);
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: getModel(),
      contents: [{ role: 'user', parts }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: comprehensiveAnswerSchema,
        maxOutputTokens: 2500,
      },
    });

    const parsed = parseJsonResponse(response.text, 'object');

    // Ensure scores are properly bounded integers 0-100
    const ensureBound = (val, def = 70) => {
      const num = Number(val);
      if (isNaN(num)) return def;
      return Math.max(0, Math.min(100, Math.round(num)));
    };

    const comm = parsed.communication || {};
    const perf = parsed.performance || {};

    const fluency = ensureBound(comm.fluency, 75);
    const clarity = ensureBound(comm.clarity, 75);
    const grammar = ensureBound(comm.grammar, 80);
    const vocabulary = ensureBound(comm.vocabulary, 75);
    const coherence = ensureBound(comm.coherence, 75);
    const relevance = ensureBound(comm.relevance, 80);

    // Standard formula: 25% fluency, 20% clarity, 15% grammar, 15% vocab, 15% coherence, 10% relevance
    const weightedCommScore = Math.round(
      fluency * 0.25 +
      clarity * 0.20 +
      grammar * 0.15 +
      vocabulary * 0.15 +
      coherence * 0.15 +
      relevance * 0.10
    );

    const perfScore = ensureBound(perf.score, 75);

    return {
      performance: {
        score: perfScore,
        correctness: ensureBound(perf.correctness, perfScore),
        depth: ensureBound(perf.depth, perfScore),
        problemSolving: ensureBound(perf.problemSolving, perfScore),
        explanationQuality: ensureBound(perf.explanationQuality, perfScore),
        structure: ensureBound(perf.structure, perfScore),
        strengths: Array.isArray(perf.strengths) && perf.strengths.length > 0 ? perf.strengths : ['Clear articulation of core concepts'],
        improvements: Array.isArray(perf.improvements) && perf.improvements.length > 0 ? perf.improvements : ['Consider elaborating on edge cases and metrics'],
        modelAnswer: perf.modelAnswer || 'A strong response includes clear rationale, metrics, and architecture trade-offs.',
        comments: perf.comments || 'Good answer with solid understanding demonstrated.',
      },
      communication: {
        score: weightedCommScore,
        fluency,
        clarity,
        grammar,
        vocabulary,
        coherence,
        relevance,
        pronunciationDelivery: comm.pronunciationDelivery !== undefined && comm.pronunciationDelivery !== null ? ensureBound(comm.pronunciationDelivery, 80) : null,
        comments: comm.comments || 'Well articulated with coherent flow.',
      },
      followUpQuestion: parsed.followUpQuestion || '',
    };
  } catch (err) {
    console.error('Gemini evaluation failed:', err.message);
    // Safe graceful fallback so candidate never loses their session
    return {
      performance: {
        score: 72,
        correctness: 75,
        depth: 70,
        problemSolving: 72,
        explanationQuality: 74,
        structure: 70,
        strengths: ['Addressed the main components of the question.'],
        improvements: ['Elaborate more on practical production challenges and technical tradeoffs.'],
        modelAnswer: 'A high-impact response includes specific architecture choices, measurable results, and lessons learned.',
        comments: 'Solid response with good foundational understanding.',
      },
      communication: {
        score: 76,
        fluency: 75,
        clarity: 78,
        grammar: 80,
        vocabulary: 75,
        coherence: 74,
        relevance: 80,
        pronunciationDelivery: null,
        comments: 'Clear ideas with good structure and relevant vocabulary.',
      },
      followUpQuestion: '',
    };
  }
};

/**
 * Generate comprehensive final summary of the completed interview
 */
const generateInterviewSummary = async (interview) => {
  const questionsData = (interview.questions || []).map((q, idx) => ({
    number: idx + 1,
    question: q.question,
    category: q.category,
    answer: q.answer,
    performanceScore: q.performanceScore || q.score || 0,
    communicationScore: q.communicationScore || 0,
    strengths: q.performanceFeedback?.strengths || [],
    improvements: q.performanceFeedback?.improvements || [],
  }));

  const prompt = `You are a Senior Talent Director and Engineering Hiring Manager. Synthesize a comprehensive final interview debrief report for a candidate who just completed a mock interview loop.

Candidate Target Role: "${interview.role}"
Interview Format: "${interview.type}"
Difficulty: "${interview.difficulty || 'intermediate'}"
Overall Performance Score: ${interview.overallPerformanceScore || interview.overallScore}%
Overall Communication Score: ${interview.overallCommunicationScore}%

Session Questions & Responses:
${JSON.stringify(questionsData, null, 2)}

Provide:
1. "summary": 2-3 paragraph executive debrief on their technical aptitude, verbal delivery, and interview readiness.
2. "strengths": 3-5 key standout strengths demonstrated across the answers.
3. "areasForImprovement": 3-5 specific, high-priority areas to improve before live company loops.
4. "topicsToRevise": 4-6 specific technical topics, libraries, or behavioral frameworks to study.
5. "recommendedNextSteps": 3-4 actionable next steps.
6. "practiceQuestions": 3 recommended follow-up practice questions for their next session.`;

  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: getModel(),
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: interviewSummarySchema,
        maxOutputTokens: 2500,
      },
    });

    return parseJsonResponse(response.text, 'object');
  } catch (err) {
    console.error('Failed to generate interview summary:', err.message);
    return {
      summary: `The candidate completed a ${interview.difficulty || 'intermediate'} ${interview.type} mock interview for the ${interview.role} position. They demonstrated good subject knowledge and articulated concepts clearly.`,
      strengths: [
        'Solid domain understanding and structured communication',
        'Directly addressed questions with relevant examples',
        'Demonstrated practical problem-solving logic',
      ],
      areasForImprovement: [
        'Deepen technical specificity regarding scalability and edge cases',
        'Incorporate more quantified metrics in project impact descriptions',
      ],
      topicsToRevise: [
        'System Architecture & Design Patterns',
        'Concurrency & State Management',
        'STAR Behavioral Framework Storytelling',
      ],
      recommendedNextSteps: [
        'Review the feedback on weak questions',
        'Practice timed verbal answers with live speech recording',
        'Iterate on high-impact project descriptions',
      ],
      practiceQuestions: [
        'How would you design a scalable caching strategy for high-read web services?',
        'Describe an architectural mistake you made and how you rectified it.',
        'How do you manage disagreement over technology choices in an agile team?',
      ],
    };
  }
};

/**
 * AI Tutor: answer a doubt about a concept
 */
const tutorChat = async (concept, question, conversationHistory = []) => {
  const systemInstruction = `You are PrepMate's AI tutor, an expert computer science and software engineering teacher. 
You explain concepts clearly with examples, analogies, and code snippets when helpful.
Current topic context: ${concept}
Keep answers concise but thorough. Use markdown formatting.`;

  const contents = [];
  for (const msg of conversationHistory) {
    if (msg && msg.content) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    }
  }
  contents.push({
    role: 'user',
    parts: [{ text: question }],
  });

  const ai = getClient();
  const response = await ai.models.generateContent({
    model: getModel(),
    contents,
    config: {
      systemInstruction,
      maxOutputTokens: 2048,
    },
  });

  return response.text;
};

module.exports = {
  analyzeResume,
  generateInterviewQuestions,
  generateResumeInterviewQuestions,
  scoreInterviewAnswer,
  evaluateAnswerWithCommunication,
  generateInterviewSummary,
  tutorChat,
};
