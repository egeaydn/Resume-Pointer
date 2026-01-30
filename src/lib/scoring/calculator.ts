/**
 * Core scoring calculator
 * Based on RFC-002: Scoring Rubric & Criteria (100-point system)
 */

import { 
  ParsedCV, 
  ScoreResult, 
  CategoryScore, 
  FeedbackItem,
  DetectedSection,
} from './types';
import { 
  SCORING_WEIGHTS, 
  CATEGORY_NAMES,
  REQUIRED_SECTIONS,
  MINIMUM_THRESHOLDS,
  SCORE_RANGES,
} from './constants';
import { 
  detectSections,
  countTechnicalSkills,
  countActionVerbs,
  countBulletPoints,
  countQuantifications,
  hasSectionByName,
  getSectionContent,
  analyzeContactInfo,
  extractYearsOfExperience,
  detectSocialProfiles,
} from '../parsing/patterns';

/**
 * Main scoring function - evaluates a CV and returns comprehensive results
 * Returns RFC-005 compliant format with breakdown structure + legacy fields for backward compatibility
 */
export function calculateScore(cv: ParsedCV): ScoreResult {
  // First, detect all sections in the CV (only if not already provided)
  const sections = cv.sections || detectSections(cv.text || cv.rawText || '');
  const cvWithSections = { ...cv, sections };
  
  // Calculate scores for each category
  const categoryScores: CategoryScore[] = [
    scoreStructure(cvWithSections),
    scoreTechnicalSkills(cvWithSections),
    scoreWorkExperience(cvWithSections),
    scoreEducation(cvWithSections),
    scoreFormatting(cvWithSections),
  ];
  
  // Calculate total score
  const totalScore = categoryScores.reduce((sum, cat) => sum + cat.score, 0);
  
  // Convert to RFC-005 breakdown format
  const breakdown = {
    structure: convertToCategoryResult(categoryScores[0]),
    technicalSkills: convertToCategoryResult(categoryScores[1]),
    workExperience: convertToCategoryResult(categoryScores[2]),
    education: convertToCategoryResult(categoryScores[3]),
    formatting: convertToCategoryResult(categoryScores[4]),
  };
  
  // Generate legacy fields for backward compatibility (tests)
  const overallFeedback = getOverallFeedback(totalScore);
  const suggestions = generateSuggestions(categoryScores, cvWithSections);
  
  return {
    totalScore,
    breakdown,
    metadata: {
      wordCount: cv.wordCount || cv.metadata?.wordCount || 0,
    },
    // Legacy fields for backward compatibility
    maxScore: 100,
    categoryScores,
    overallFeedback,
    suggestions,
    timestamp: Date.now(),
  };
}

/**
 * Convert legacy CategoryScore to RFC-005 CategoryResult format
 */
function convertToCategoryResult(categoryScore: CategoryScore): any {
  return {
    score: categoryScore.score,
    maxScore: categoryScore.maxScore,
    details: categoryScore.feedback.map(item => ({
      category: item.message.split(':')[0] || 'General',
      passed: item.type === 'success',
      message: item.message,
    })),
  };
}

/**
 * Category 1: CV Structure & Sections (15 points)
 */
function scoreStructure(cv: ParsedCV): CategoryScore {
  const feedback: FeedbackItem[] = [];
  let score = 0;
  const maxScore = SCORING_WEIGHTS.structure;
  
  // Check for required sections (3 points each = 12 points total for 4 sections)
  const requiredSectionPoints = 3;
  REQUIRED_SECTIONS.forEach(sectionName => {
    if (hasSectionByName(cv.sections, sectionName)) {
      score += requiredSectionPoints;
      feedback.push({
        type: 'success',
        message: `${capitalize(sectionName)} section found`,
        icon: '✅',
      });
    } else {
      feedback.push({
        type: 'error',
        message: `Missing ${sectionName} section`,
        icon: '❌',
      });
    }
  });
  
  // Bonus: Has professional summary (3 points)
  if (hasSectionByName(cv.sections, 'summary')) {
    score += 3;
    feedback.push({
      type: 'success',
      message: 'Professional summary included',
      icon: '✅',
    });
  } else {
    feedback.push({
      type: 'warning',
      message: 'Consider adding a professional summary',
      icon: '⚠️',
    });
  }
  
  return {
    category: 'structure',
    score: Math.min(score, maxScore),
    maxScore,
    feedback,
  };
}

/**
 * Category 2: Technical Skills (20 points)
 */
function scoreTechnicalSkills(cv: ParsedCV): CategoryScore {
  const feedback: FeedbackItem[] = [];
  let score = 0;
  const maxScore = SCORING_WEIGHTS.technicalSkills;
  
  // Get skills section content
  const skillsContent = getSectionContent(cv.sections, 'skills') || cv.normalizedText;
  
  // Count technical skills
  const { count: skillCount, found: skillsFound } = countTechnicalSkills(skillsContent);
  
  // Scoring based on number of technical skills
  if (skillCount >= 15) {
    score = 20; // Excellent
    feedback.push({
      type: 'success',
      message: `Excellent! ${skillCount} technical skills identified`,
      icon: '✅',
    });
  } else if (skillCount >= 10) {
    score = 16; // Good
    feedback.push({
      type: 'success',
      message: `Good! ${skillCount} technical skills found`,
      icon: '✅',
    });
  } else if (skillCount >= 5) {
    score = 12; // Fair
    feedback.push({
      type: 'warning',
      message: `${skillCount} technical skills found - consider adding more`,
      icon: '⚠️',
    });
  } else if (skillCount >= 3) {
    score = 8; // Minimal
    feedback.push({
      type: 'warning',
      message: `Only ${skillCount} technical skills found - add more relevant skills`,
      icon: '⚠️',
    });
  } else {
    score = 0;
    feedback.push({
      type: 'error',
      message: 'Very few technical skills identified',
      icon: '❌',
    });
  }
  
  // Check if skills section exists
  if (!hasSectionByName(cv.sections, 'skills')) {
    feedback.push({
      type: 'warning',
      message: 'No dedicated skills section found',
      icon: '⚠️',
    });
  }
  
  return {
    category: 'technicalSkills',
    score: Math.min(score, maxScore),
    maxScore,
    feedback,
  };
}

/**
 * Category 3: Work Experience Content (30 points)
 */
function scoreWorkExperience(cv: ParsedCV): CategoryScore {
  const feedback: FeedbackItem[] = [];
  let score = 0;
  const maxScore = SCORING_WEIGHTS.workExperience;
  
  // Get experience section content
  const experienceContent = getSectionContent(cv.sections, 'experience');
  
  if (!experienceContent) {
    feedback.push({
      type: 'error',
      message: 'No work experience section found',
      icon: '❌',
    });
    return { category: 'workExperience', score: 0, maxScore, feedback };
  }
  
  // 1. Check for action verbs (10 points)
  const { count: verbCount } = countActionVerbs(experienceContent);
  if (verbCount >= 8) {
    score += 10;
    feedback.push({
      type: 'success',
      message: `Excellent use of action verbs (${verbCount} found)`,
      icon: '✅',
    });
  } else if (verbCount >= 5) {
    score += 7;
    feedback.push({
      type: 'success',
      message: `Good use of action verbs (${verbCount} found)`,
      icon: '✅',
    });
  } else if (verbCount >= 3) {
    score += 4;
    feedback.push({
      type: 'warning',
      message: `Use more action verbs in experience descriptions (${verbCount} found)`,
      icon: '⚠️',
    });
  } else {
    feedback.push({
      type: 'error',
      message: 'Very few action verbs - start bullets with strong action words',
      icon: '❌',
    });
  }
  
  // 2. Check for bullet points (10 points)
  const bulletCount = countBulletPoints(experienceContent);
  if (bulletCount >= 6) {
    score += 10;
    feedback.push({
      type: 'success',
      message: `Well-structured with ${bulletCount} bullet points`,
      icon: '✅',
    });
  } else if (bulletCount >= 3) {
    score += 7;
    feedback.push({
      type: 'success',
      message: `${bulletCount} bullet points found`,
      icon: '✅',
    });
  } else {
    score += 3;
    feedback.push({
      type: 'warning',
      message: 'Add more bullet points to describe achievements',
      icon: '⚠️',
    });
  }
  
  // 3. Check for quantified achievements (10 points)
  const { count: quantCount, examples } = countQuantifications(experienceContent);
  if (quantCount >= 5) {
    score += 10;
    feedback.push({
      type: 'success',
      message: `Excellent! ${quantCount} quantified achievements (e.g., ${examples[0]})`,
      icon: '✅',
    });
  } else if (quantCount >= 3) {
    score += 7;
    feedback.push({
      type: 'success',
      message: `Good! ${quantCount} quantified achievements found`,
      icon: '✅',
    });
  } else if (quantCount >= 1) {
    score += 4;
    feedback.push({
      type: 'warning',
      message: 'Add more metrics and numbers to quantify your impact',
      icon: '⚠️',
    });
  } else {
    feedback.push({
      type: 'error',
      message: 'No quantified achievements - add numbers, percentages, or metrics',
      icon: '❌',
    });
  }
  
  return {
    category: 'workExperience',
    score: Math.min(score, maxScore),
    maxScore,
    feedback,
  };
}

/**
 * Category 4: Education (15 points)
 */
function scoreEducation(cv: ParsedCV): CategoryScore {
  const feedback: FeedbackItem[] = [];
  let score = 0;
  const maxScore = SCORING_WEIGHTS.education;
  
  // Check if education section exists (10 points)
  if (hasSectionByName(cv.sections, 'education')) {
    score += 10;
    feedback.push({
      type: 'success',
      message: 'Education section found',
      icon: '✅',
    });
    
    const educationContent = getSectionContent(cv.sections, 'education') || '';
    
    // Check for degree keywords (3 points)
    const degreeKeywords = ['bachelor', 'master', 'phd', 'degree', 'diploma', 'certification'];
    const hasDegree = degreeKeywords.some(keyword => 
      educationContent.toLowerCase().includes(keyword)
    );
    
    if (hasDegree) {
      score += 3;
      feedback.push({
        type: 'success',
        message: 'Degree information included',
        icon: '✅',
      });
    } else {
      feedback.push({
        type: 'warning',
        message: 'Include degree or certification details',
        icon: '⚠️',
      });
    }
    
    // Check for graduation year (2 points)
    const yearPattern = /\b(19|20)\d{2}\b/;
    if (yearPattern.test(educationContent)) {
      score += 2;
      feedback.push({
        type: 'success',
        message: 'Graduation dates included',
        icon: '✅',
      });
    } else {
      feedback.push({
        type: 'warning',
        message: 'Add graduation dates',
        icon: '⚠️',
      });
    }
  } else {
    feedback.push({
      type: 'error',
      message: 'Education section missing',
      icon: '❌',
    });
  }
  
  return {
    category: 'education',
    score: Math.min(score, maxScore),
    maxScore,
    feedback,
  };
}

/**
 * Category 5: Formatting & Readability (20 points)
 */
function scoreFormatting(cv: ParsedCV): CategoryScore {
  const feedback: FeedbackItem[] = [];
  let score = 0;
  const maxScore = SCORING_WEIGHTS.formatting;
  
  // 1. Check word count (4 points)
  const { wordCount } = cv.metadata;
  if (wordCount >= 300 && wordCount <= 800) {
    score += 4;
    feedback.push({
      type: 'success',
      message: `Good length: ${wordCount} words`,
      icon: '✅',
    });
  } else if (wordCount >= 200 && wordCount <= 1000) {
    score += 2;
    feedback.push({
      type: 'warning',
      message: `${wordCount} words - aim for 300-800 for optimal length`,
      icon: '⚠️',
    });
  } else if (wordCount < 200) {
    score += 1;
    feedback.push({
      type: 'error',
      message: `Too short (${wordCount} words) - add more detail`,
      icon: '❌',
    });
  } else {
    score += 1;
    feedback.push({
      type: 'warning',
      message: `Long CV (${wordCount} words) - consider condensing`,
      icon: '⚠️',
    });
  }
  
  // 2. Enhanced contact information analysis (8 points)
  const contactAnalysis = analyzeContactInfo(cv.normalizedText);
  
  if (contactAnalysis.hasEmail) {
    score += 2;
    feedback.push({
      type: 'success',
      message: 'Email address found',
      icon: '✅',
    });
  } else {
    feedback.push({
      type: 'error',
      message: 'Add email address',
      icon: '❌',
    });
  }
  
  if (contactAnalysis.hasPhone) {
    score += 1;
    feedback.push({
      type: 'success',
      message: 'Phone number included',
      icon: '✅',
    });
  }
  
  if (contactAnalysis.hasLinkedIn) {
    score += 3;
    feedback.push({
      type: 'success',
      message: 'LinkedIn profile included - excellent for networking!',
      icon: '✅',
    });
  } else {
    feedback.push({
      type: 'warning',
      message: 'Add LinkedIn profile to boost visibility',
      icon: '⚠️',
    });
  }
  
  if (contactAnalysis.hasGitHub) {
    score += 2;
    feedback.push({
      type: 'success',
      message: 'GitHub profile included - great for tech roles!',
      icon: '✅',
    });
  }
  
  // 3. Check page count estimation (4 points)
  const { estimatedPageCount } = cv.metadata;
  if (estimatedPageCount <= 2) {
    score += 4;
    feedback.push({
      type: 'success',
      message: `Concise length (~${estimatedPageCount} page${estimatedPageCount > 1 ? 's' : ''})`,
      icon: '✅',
    });
  } else if (estimatedPageCount === 3) {
    score += 2;
    feedback.push({
      type: 'warning',
      message: `Consider condensing to 2 pages (currently ~${estimatedPageCount} pages)`,
      icon: '⚠️',
    });
  } else {
    score += 1;
    feedback.push({
      type: 'warning',
      message: `Too long (~${estimatedPageCount} pages) - aim for 1-2 pages`,
      icon: '⚠️',
    });
  }
  
  // 4. Check for proper structure (4 points)
  const hasMultipleSections = cv.sections.length >= 3;
  if (hasMultipleSections) {
    score += 4;
    feedback.push({
      type: 'success',
      message: `Well-organized with ${cv.sections.length} distinct sections`,
      icon: '✅',
    });
  } else {
    score += 2;
    feedback.push({
      type: 'warning',
      message: 'Use clear section headings to organize content',
      icon: '⚠️',
    });
  }
  
  return {
    category: 'formatting',
    score: Math.min(score, maxScore),
    maxScore,
    feedback,
  };
}

/**
 * Generate overall feedback based on total score
 */
function getOverallFeedback(totalScore: number): string {
  for (const range of Object.values(SCORE_RANGES)) {
    if (totalScore >= range.min && totalScore <= range.max) {
      switch (range.label) {
        case 'Excellent':
          return 'Excellent CV! Your resume is well-structured with strong content. Minor tweaks could make it even better.';
        case 'Good':
          return 'Good CV! You have a solid foundation. Address the suggestions below to reach an excellent score.';
        case 'Fair':
          return 'Fair CV with room for improvement. Focus on the areas highlighted below to strengthen your resume.';
        case 'Needs Improvement':
          return 'Your CV needs significant improvements. Pay close attention to the feedback and implement the suggestions.';
        case 'Poor':
          return 'Your CV requires major revisions. Review each category carefully and restructure your content.';
      }
    }
  }
  return 'Your CV has been evaluated.';
}

/**
 * Generate actionable suggestions based on scoring results
 */
function generateSuggestions(categories: CategoryScore[], cv: ParsedCV): string[] {
  const suggestions: string[] = [];
  
  // Analyze each category and provide targeted suggestions
  categories.forEach(category => {
    const percentage = (category.score / category.maxScore) * 100;
    
    if (percentage < 60) {
      // Category needs significant improvement
      switch (category.category) {
        case 'structure':
          suggestions.push('Add all required sections: Contact, Experience, Education, and Skills');
          suggestions.push('Include a professional summary at the top of your CV');
          break;
        case 'technicalSkills':
          suggestions.push('List more relevant technical skills (programming languages, frameworks, tools)');
          suggestions.push('Create a dedicated "Technical Skills" or "Skills" section');
          break;
        case 'workExperience':
          suggestions.push('Start each bullet point with a strong action verb');
          suggestions.push('Add specific numbers, percentages, or metrics to quantify your achievements');
          suggestions.push('Use bullet points to list your accomplishments (aim for 3-5 per role)');
          break;
        case 'education':
          suggestions.push('Add a clear Education section with degree, institution, and graduation year');
          break;
        case 'formatting':
          suggestions.push('Ensure your CV is 1-2 pages long (currently too short/long)');
          suggestions.push('Include contact information (email and phone number)');
          suggestions.push('Use clear section headings to organize your content');
          break;
      }
    }
  });
  
  // Add general suggestions
  if (suggestions.length === 0) {
    suggestions.push('Your CV is strong! Consider tailoring it to specific job descriptions');
    suggestions.push('Keep your CV updated as you gain new skills and experiences');
  } else if (suggestions.length > 5) {
    // Prioritize top 5 suggestions
    return suggestions.slice(0, 5);
  }
  
  return suggestions;
}

/**
 * Utility: Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
