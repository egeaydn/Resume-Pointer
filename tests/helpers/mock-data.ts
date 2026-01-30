import { ScoreResult, ScoreBreakdown, CategoryResult } from '@/lib/scoring/types';

/**
 * Creates mock analysis data for testing
 */
export function createMockAnalysisData() {
  return {
    sections: {
      hasContact: { email: true, phone: true, linkedin: false, github: false },
      hasSummary: true,
      hasExperience: true,
      hasEducation: true,
      hasSkills: true,
    },
    keywords: {
      technical: {
        count: 8,
        skills: ['Python', 'JavaScript', 'React', 'SQL', 'Git', 'Docker', 'AWS', 'Node.js'],
      },
      soft: {
        count: 2,
        skills: ['Leadership', 'Communication'],
      },
      actionVerbs: {
        count: 5,
        verbs: ['Developed', 'Managed', 'Led', 'Implemented', 'Optimized'],
      },
      degrees: {
        count: 1,
        degrees: ['Bachelor'],
      },
    },
    formatting: {
      bullets: { count: 15, hasBullets: true },
      quantification: { count: 3, hasQuantification: true },
      dates: { count: 5, hasDates: true },
      pageInfo: { finalEstimate: 2 },
      whitespace: { ratio: 0.15, isBalanced: true },
      consistency: { isConsistent: true, issues: [] },
    },
  };
}

/**
 * Creates a mock CV analysis result for testing
 */
export function createMockCVResult(): ScoreResult {
  return {
    totalScore: 78,
    grade: 'Very Good',
    message: 'Your CV is strong with room for improvement',
    breakdown: {
      structure: {
        score: 12,
        maxScore: 15,
        details: [
          { category: 'Contact Info', passed: true, message: 'Has email and phone number' },
          { category: 'Summary', passed: false, message: 'Missing professional summary' },
          { category: 'Experience', passed: true, message: 'Has work experience section' },
          { category: 'Education', passed: true, message: 'Has education section' },
          { category: 'Skills', passed: true, message: 'Has skills section' },
        ],
      },
      technicalSkills: {
        score: 15,
        maxScore: 20,
        details: [
          { category: 'Technical Keywords', passed: true, message: 'Found 8 technical skills' },
        ],
      },
      workExperience: {
        score: 24,
        maxScore: 30,
        details: [
          { category: 'Action Verbs', passed: true, message: 'Used 5 action verbs' },
          { category: 'Quantification', passed: true, message: 'Included 3 quantified achievements' },
        ],
      },
      education: {
        score: 12,
        maxScore: 15,
        details: [
          { category: 'Degree', passed: true, message: 'Has Bachelor degree' },
        ],
      },
      formatting: {
        score: 15,
        maxScore: 20,
        details: [
          { category: 'Bullets', passed: true, message: 'Uses bullet points effectively' },
          { category: 'Page Length', passed: true, message: '2 pages - ideal length' },
        ],
      },
    },
    recommendations: [
      {
        priority: 1,
        title: 'Add Professional Summary',
        description: 'Include 2-3 sentences highlighting your key achievements and career goals.',
        category: 'structure',
        impact: 'high',
      },
      {
        priority: 2,
        title: 'Add More Technical Skills',
        description: 'Include additional relevant technical skills to reach 10+ keywords.',
        category: 'technicalSkills',
        impact: 'medium',
      },
    ],
    metadata: {
      wordCount: 850,
      estimatedPages: 2,
      processingTime: 1.2,
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    },
    // Legacy fields for backward compatibility
    maxScore: 100,
    categoryScores: {
      structure: { score: 12, maxScore: 15, details: [] },
      technicalSkills: { score: 15, maxScore: 20, details: [] },
      workExperience: { score: 24, maxScore: 30, details: [] },
      education: { score: 12, maxScore: 15, details: [] },
      formatting: { score: 15, maxScore: 20, details: [] },
    },
    overallFeedback: 'Your CV is strong with room for improvement',
    suggestions: ['Add Professional Summary', 'Add More Technical Skills'],
    timestamp: new Date().toISOString(),
  };
}

/**
 * Creates a mock breakdown for testing
 */
export function createMockBreakdown(): ScoreBreakdown {
  return {
    structure: {
      score: 12,
      maxScore: 15,
      details: [
        { category: 'Contact Info', passed: true, message: 'Complete' },
        { category: 'Summary', passed: false, message: 'Missing' },
      ],
    },
    technicalSkills: {
      score: 15,
      maxScore: 20,
      details: [
        { category: 'Technical Keywords', passed: true, message: 'Found 8 skills' },
      ],
    },
    workExperience: {
      score: 24,
      maxScore: 30,
      details: [
        { category: 'Action Verbs', passed: true, message: 'Used 5 verbs' },
      ],
    },
    education: {
      score: 12,
      maxScore: 15,
      details: [
        { category: 'Degree', passed: true, message: 'Has Bachelor' },
      ],
    },
    formatting: {
      score: 15,
      maxScore: 20,
      details: [
        { category: 'Bullets', passed: true, message: 'Uses bullets' },
      ],
    },
  };
}

/**
 * Creates a minimal valid CV result for testing
 */
export function createMinimalCVResult(): ScoreResult {
  return {
    totalScore: 45,
    grade: 'Needs Improvement',
    message: 'Your CV needs significant improvements',
    breakdown: createMockBreakdown(),
    recommendations: [],
    metadata: {
      wordCount: 300,
      estimatedPages: 1,
      processingTime: 0.8,
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    },
    maxScore: 100,
    categoryScores: {},
    overallFeedback: '',
    suggestions: [],
    timestamp: new Date().toISOString(),
  };
}

/**
 * Creates an excellent CV result for testing
 */
export function createExcellentCVResult(): ScoreResult {
  return {
    totalScore: 92,
    grade: 'Excellent',
    message: 'Your CV is excellent! Just minor tweaks needed.',
    breakdown: {
      structure: { score: 15, maxScore: 15, details: [] },
      technicalSkills: { score: 18, maxScore: 20, details: [] },
      workExperience: { score: 28, maxScore: 30, details: [] },
      education: { score: 15, maxScore: 15, details: [] },
      formatting: { score: 16, maxScore: 20, details: [] },
    },
    recommendations: [],
    metadata: {
      wordCount: 750,
      estimatedPages: 2,
      processingTime: 1.5,
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    },
    maxScore: 100,
    categoryScores: {},
    overallFeedback: '',
    suggestions: [],
    timestamp: new Date().toISOString(),
  };
}
