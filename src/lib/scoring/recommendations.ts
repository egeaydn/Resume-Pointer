/**
 * Recommendation Generator
 * Generates priority-sorted actionable recommendations based on score breakdown
 */

import { ScoreResult, CategoryScore } from './types';

export interface Recommendation {
  priority: number;
  title: string;
  description: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
}

/**
 * Generates recommendations based on scoring results
 * Returns up to 5 top recommendations sorted by priority
 */
export function generateRecommendations(result: ScoreResult): Recommendation[] {
  const recommendations: Recommendation[] = [];
  let priority = 1;

  // Structure recommendations
  if (result.breakdown.structure.score < result.breakdown.structure.maxScore) {
    const structureIssues = result.breakdown.structure.details.filter(d => !d.passed);
    
    structureIssues.forEach(issue => {
      if (issue.message.toLowerCase().includes('contact')) {
        recommendations.push({
          priority: priority++,
          title: 'Add Complete Contact Information',
          description: 'Include your email, phone number, location, and professional links (LinkedIn, GitHub) at the top of your CV.',
          category: 'structure',
          impact: 'high',
        });
      } else if (issue.message.toLowerCase().includes('summary') || issue.message.toLowerCase().includes('objective')) {
        recommendations.push({
          priority: priority++,
          title: 'Add a Professional Summary',
          description: 'Include 2-3 sentences at the top highlighting your key strengths, experience, and career goals.',
          category: 'structure',
          impact: 'high',
        });
      } else if (issue.message.toLowerCase().includes('experience')) {
        recommendations.push({
          priority: priority++,
          title: 'Add Work Experience Section',
          description: 'Include your professional experience with job titles, companies, dates, and key achievements.',
          category: 'structure',
          impact: 'high',
        });
      } else if (issue.message.toLowerCase().includes('education')) {
        recommendations.push({
          priority: priority++,
          title: 'Add Education Section',
          description: 'Include your degrees, institutions, graduation dates, and relevant coursework or honors.',
          category: 'structure',
          impact: 'high',
        });
      } else if (issue.message.toLowerCase().includes('skills')) {
        recommendations.push({
          priority: priority++,
          title: 'Add Skills Section',
          description: 'Create a dedicated section listing your technical skills, tools, and technologies.',
          category: 'structure',
          impact: 'high',
        });
      }
    });
  }

  // Skills recommendations
  if (result.breakdown.technicalSkills.score < 15) {
    recommendations.push({
      priority: priority++,
      title: 'Add More Technical Skills',
      description: 'List 10+ relevant technical skills, programming languages, frameworks, and tools you are proficient in.',
      category: 'skills',
      impact: 'high',
    });
  }

  // Experience recommendations
  const expDetails = result.breakdown.workExperience.details;
  
  if (expDetails.some(d => d.message.toLowerCase().includes('bullet') && !d.passed)) {
    recommendations.push({
      priority: priority++,
      title: 'Use Bullet Points in Experience',
      description: 'Format all job descriptions as bullet lists (not paragraphs) for better readability and ATS compatibility.',
      category: 'experience',
      impact: 'high',
    });
  }
  
  if (expDetails.some(d => d.message.toLowerCase().includes('action') && !d.passed)) {
    recommendations.push({
      priority: priority++,
      title: 'Start Bullets with Action Verbs',
      description: 'Begin each bullet point with a strong action verb (e.g., "Developed", "Managed", "Implemented") to showcase your contributions.',
      category: 'experience',
      impact: 'high',
    });
  }
  
  if (expDetails.some(d => d.message.toLowerCase().includes('quantif') && !d.passed)) {
    recommendations.push({
      priority: priority++,
      title: 'Quantify Your Achievements',
      description: 'Add numbers, percentages, or metrics to show the impact of your work (e.g., "Increased sales by 25%", "Managed team of 5").',
      category: 'experience',
      impact: 'high',
    });
  }

  // Formatting recommendations
  const formatDetails = result.breakdown.formatting.details;
  
  if (formatDetails.some(d => (d.message.toLowerCase().includes('length') || d.message.toLowerCase().includes('word')) && !d.passed)) {
    const tooLong = result.metadata?.wordCount && result.metadata.wordCount > 800;
    recommendations.push({
      priority: priority++,
      title: tooLong ? 'Reduce CV Length' : 'Expand CV Content',
      description: tooLong 
        ? 'Aim for 1-2 pages (300-800 words). Remove outdated experience or irrelevant details.'
        : 'Add more detail to your experience and skills. Aim for at least 300 words.',
      category: 'formatting',
      impact: 'medium',
    });
  }
  
  if (formatDetails.some(d => d.message.toLowerCase().includes('white') && !d.passed)) {
    recommendations.push({
      priority: priority++,
      title: 'Improve White Space',
      description: 'Add more spacing between sections and use shorter paragraphs to make your CV easier to scan.',
      category: 'formatting',
      impact: 'medium',
    });
  }

  // Contact info recommendations
  if (formatDetails.some(d => d.message.toLowerCase().includes('linkedin') && !d.passed)) {
    recommendations.push({
      priority: priority++,
      title: 'Add LinkedIn Profile',
      description: 'Include your LinkedIn URL in the contact section to make it easy for recruiters to find you.',
      category: 'formatting',
      impact: 'medium',
    });
  }
  
  if (formatDetails.some(d => d.message.toLowerCase().includes('github') && !d.passed)) {
    recommendations.push({
      priority: priority++,
      title: 'Add GitHub Profile',
      description: 'For technical roles, include your GitHub URL to showcase your code and projects.',
      category: 'formatting',
      impact: 'medium',
    });
  }

  // Sort by priority and return top 5
  return recommendations
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5);
}

/**
 * Generates a grade label based on score
 */
export function getGrade(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Satisfactory';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
}

/**
 * Generates a personalized message based on score
 */
export function getMessage(score: number): string {
  if (score >= 90) return 'Outstanding! Your CV is extremely well-crafted and should perform excellently with ATS systems and recruiters.';
  if (score >= 80) return 'Great work! Your CV is strong with minor areas for refinement.';
  if (score >= 70) return 'Good job! Your CV is solid but has room for improvement to stand out more.';
  if (score >= 60) return 'Your CV covers the basics but needs significant improvements to be competitive.';
  if (score >= 50) return 'Your CV requires substantial work in multiple areas. Focus on the recommendations below.';
  return 'Your CV needs major improvements across most categories. Please review all recommendations carefully.';
}
