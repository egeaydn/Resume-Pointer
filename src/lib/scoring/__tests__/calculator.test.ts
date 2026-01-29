/**
 * Unit tests for scoring calculator
 */

import { calculateScore } from '@/lib/scoring/calculator';
import { ParsedCV, DetectedSection } from '@/lib/scoring/types';

describe('Scoring Calculator', () => {
  const createMockCV = (overrides?: Partial<ParsedCV>): ParsedCV => ({
    rawText: 'Sample CV text',
    normalizedText: 'Sample CV text',
    sections: [],
    metadata: {
      wordCount: 500,
      lineCount: 50,
      hasContactInfo: true,
      estimatedPageCount: 1,
      fileType: 'pdf',
    },
    ...overrides,
  });

  describe('Total Score Calculation', () => {
    it('should return a score between 0 and 100', () => {
      const cv = createMockCV();
      const result = calculateScore(cv);
      
      expect(result.totalScore).toBeGreaterThanOrEqual(0);
      expect(result.totalScore).toBeLessThanOrEqual(100);
    });

    it('should return maxScore of 100', () => {
      const cv = createMockCV();
      const result = calculateScore(cv);
      
      expect(result.maxScore).toBe(100);
    });

    it('should include timestamp', () => {
      const cv = createMockCV();
      const result = calculateScore(cv);
      
      expect(result.timestamp).toBeGreaterThan(0);
    });
  });

  describe('Category Scores', () => {
    it('should include all 5 categories', () => {
      const cv = createMockCV();
      const result = calculateScore(cv);
      
      expect(result.categoryScores).toHaveLength(5);
      
      const categories = result.categoryScores.map(c => c.category);
      expect(categories).toContain('structure');
      expect(categories).toContain('technicalSkills');
      expect(categories).toContain('workExperience');
      expect(categories).toContain('education');
      expect(categories).toContain('formatting');
    });

    it('should have correct max scores per category', () => {
      const cv = createMockCV();
      const result = calculateScore(cv);
      
      const scoreMap = new Map(result.categoryScores.map(c => [c.category, c.maxScore]));
      
      expect(scoreMap.get('structure')).toBe(15);
      expect(scoreMap.get('technicalSkills')).toBe(20);
      expect(scoreMap.get('workExperience')).toBe(30);
      expect(scoreMap.get('education')).toBe(15);
      expect(scoreMap.get('formatting')).toBe(20);
    });

    it('should not exceed max score per category', () => {
      const cv = createMockCV();
      const result = calculateScore(cv);
      
      result.categoryScores.forEach(category => {
        expect(category.score).toBeLessThanOrEqual(category.maxScore);
      });
    });
  });

  describe('Structure Scoring', () => {
    it('should give points for required sections', () => {
      const sections: DetectedSection[] = [
        { name: 'contact', content: 'John Doe', startIndex: 0, endIndex: 1, confidence: 1 },
        { name: 'experience', content: 'Work history', startIndex: 2, endIndex: 3, confidence: 1 },
        { name: 'education', content: 'BS Degree', startIndex: 4, endIndex: 5, confidence: 1 },
        { name: 'skills', content: 'JavaScript', startIndex: 6, endIndex: 7, confidence: 1 },
      ];
      
      const cv = createMockCV({ sections });
      const result = calculateScore(cv);
      
      const structureScore = result.categoryScores.find(c => c.category === 'structure');
      expect(structureScore?.score).toBeGreaterThan(0);
    });

    it('should give bonus for professional summary', () => {
      const withoutSummary = createMockCV({
        sections: [
          { name: 'experience', content: '', startIndex: 0, endIndex: 1, confidence: 1 },
        ],
      });
      
      const withSummary = createMockCV({
        sections: [
          { name: 'experience', content: '', startIndex: 0, endIndex: 1, confidence: 1 },
          { name: 'summary', content: '', startIndex: 2, endIndex: 3, confidence: 1 },
        ],
      });
      
      const resultWithout = calculateScore(withoutSummary);
      const resultWith = calculateScore(withSummary);
      
      const scoreWithout = resultWithout.categoryScores.find(c => c.category === 'structure')?.score || 0;
      const scoreWith = resultWith.categoryScores.find(c => c.category === 'structure')?.score || 0;
      
      expect(scoreWith).toBeGreaterThan(scoreWithout);
    });
  });

  describe('Technical Skills Scoring', () => {
    it('should give higher scores for more skills', () => {
      const fewSkills = createMockCV({
        normalizedText: 'Skills: JavaScript, Python',
      });
      
      const manySkills = createMockCV({
        normalizedText: 'Skills: JavaScript, TypeScript, Python, React, Node.js, Express, PostgreSQL, Docker, AWS, Git, Jest, MongoDB, Redis, Next.js, Tailwind CSS',
      });
      
      const resultFew = calculateScore(fewSkills);
      const resultMany = calculateScore(manySkills);
      
      const scoreFew = resultFew.categoryScores.find(c => c.category === 'technicalSkills')?.score || 0;
      const scoreMany = resultMany.categoryScores.find(c => c.category === 'technicalSkills')?.score || 0;
      
      expect(scoreMany).toBeGreaterThan(scoreFew);
    });

    it('should penalize CVs with very few skills', () => {
      const cv = createMockCV({
        normalizedText: 'Skills: HTML',
      });
      
      const result = calculateScore(cv);
      const skillsScore = result.categoryScores.find(c => c.category === 'technicalSkills');
      
      expect(skillsScore?.score).toBeLessThan(10);
    });
  });

  describe('Work Experience Scoring', () => {
    it('should reward action verbs', () => {
      const withoutVerbs = createMockCV({
        sections: [
          { name: 'experience', content: 'Was responsible for tasks', startIndex: 0, endIndex: 1, confidence: 1 },
        ],
      });
      
      const withVerbs = createMockCV({
        sections: [
          { name: 'experience', content: 'Developed features. Led team. Implemented solutions. Optimized performance. Achieved goals.', startIndex: 0, endIndex: 1, confidence: 1 },
        ],
      });
      
      const resultWithout = calculateScore(withoutVerbs);
      const resultWith = calculateScore(withVerbs);
      
      const scoreWithout = resultWithout.categoryScores.find(c => c.category === 'workExperience')?.score || 0;
      const scoreWith = resultWith.categoryScores.find(c => c.category === 'workExperience')?.score || 0;
      
      expect(scoreWith).toBeGreaterThan(scoreWithout);
    });

    it('should reward quantified achievements', () => {
      const withoutNumbers = createMockCV({
        sections: [
          { name: 'experience', content: '• Improved performance\n• Led team\n• Developed features', startIndex: 0, endIndex: 1, confidence: 1 },
        ],
      });
      
      const withNumbers = createMockCV({
        sections: [
          { name: 'experience', content: '• Improved performance by 50%\n• Led team of 10 developers\n• Reduced costs by $100,000', startIndex: 0, endIndex: 1, confidence: 1 },
        ],
      });
      
      const resultWithout = calculateScore(withoutNumbers);
      const resultWith = calculateScore(withNumbers);
      
      const scoreWithout = resultWithout.categoryScores.find(c => c.category === 'workExperience')?.score || 0;
      const scoreWith = resultWith.categoryScores.find(c => c.category === 'workExperience')?.score || 0;
      
      expect(scoreWith).toBeGreaterThan(scoreWithout);
    });

    it('should give 0 if no experience section', () => {
      const cv = createMockCV({
        sections: [],
      });
      
      const result = calculateScore(cv);
      const experienceScore = result.categoryScores.find(c => c.category === 'workExperience');
      
      expect(experienceScore?.score).toBe(0);
    });
  });

  describe('Education Scoring', () => {
    it('should reward education section presence', () => {
      const withEducation = createMockCV({
        sections: [
          { name: 'education', content: 'Bachelor of Science', startIndex: 0, endIndex: 1, confidence: 1 },
        ],
      });
      
      const withoutEducation = createMockCV({
        sections: [],
      });
      
      const resultWith = calculateScore(withEducation);
      const resultWithout = calculateScore(withoutEducation);
      
      const scoreWith = resultWith.categoryScores.find(c => c.category === 'education')?.score || 0;
      const scoreWithout = resultWithout.categoryScores.find(c => c.category === 'education')?.score || 0;
      
      expect(scoreWith).toBeGreaterThan(scoreWithout);
    });

    it('should reward degree information', () => {
      const basic = createMockCV({
        sections: [
          { name: 'education', content: 'University Name', startIndex: 0, endIndex: 1, confidence: 1 },
        ],
      });
      
      const detailed = createMockCV({
        sections: [
          { name: 'education', content: 'Bachelor of Science in Computer Science', startIndex: 0, endIndex: 1, confidence: 1 },
        ],
      });
      
      const resultBasic = calculateScore(basic);
      const resultDetailed = calculateScore(detailed);
      
      const scoreBasic = resultBasic.categoryScores.find(c => c.category === 'education')?.score || 0;
      const scoreDetailed = resultDetailed.categoryScores.find(c => c.category === 'education')?.score || 0;
      
      expect(scoreDetailed).toBeGreaterThanOrEqual(scoreBasic);
    });
  });

  describe('Formatting Scoring', () => {
    it('should reward optimal word count', () => {
      const tooShort = createMockCV({ metadata: { wordCount: 100, lineCount: 10, hasContactInfo: false, estimatedPageCount: 1, fileType: 'pdf' } });
      const optimal = createMockCV({ metadata: { wordCount: 500, lineCount: 50, hasContactInfo: false, estimatedPageCount: 1, fileType: 'pdf' } });
      const tooLong = createMockCV({ metadata: { wordCount: 1500, lineCount: 150, hasContactInfo: false, estimatedPageCount: 3, fileType: 'pdf' } });
      
      const resultShort = calculateScore(tooShort);
      const resultOptimal = calculateScore(optimal);
      const resultLong = calculateScore(tooLong);
      
      const scoreShort = resultShort.categoryScores.find(c => c.category === 'formatting')?.score || 0;
      const scoreOptimal = resultOptimal.categoryScores.find(c => c.category === 'formatting')?.score || 0;
      const scoreLong = resultLong.categoryScores.find(c => c.category === 'formatting')?.score || 0;
      
      expect(scoreOptimal).toBeGreaterThan(scoreShort);
      expect(scoreOptimal).toBeGreaterThan(scoreLong);
    });

    it('should reward contact information', () => {
      const cv = createMockCV({
        normalizedText: 'john.doe@example.com | (555) 123-4567 | linkedin.com/in/johndoe',
      });
      
      const result = calculateScore(cv);
      const formattingScore = result.categoryScores.find(c => c.category === 'formatting');
      
      expect(formattingScore?.score).toBeGreaterThan(5);
    });

    it('should penalize very long CVs', () => {
      const cv = createMockCV({
        metadata: {
          wordCount: 2000,
          lineCount: 200,
          hasContactInfo: true,
          estimatedPageCount: 5,
          fileType: 'pdf',
        },
      });
      
      const result = calculateScore(cv);
      const formattingScore = result.categoryScores.find(c => c.category === 'formatting');
      
      const pageCountFeedback = formattingScore?.feedback.find(f => 
        f.message.toLowerCase().includes('page')
      );
      
      expect(pageCountFeedback?.type).not.toBe('success');
    });
  });

  describe('Overall Feedback', () => {
    it('should provide feedback string', () => {
      const cv = createMockCV();
      const result = calculateScore(cv);
      
      expect(result.overallFeedback).toBeTruthy();
      expect(typeof result.overallFeedback).toBe('string');
    });

    it('should provide suggestions array', () => {
      const cv = createMockCV();
      const result = calculateScore(cv);
      
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    it('should provide more suggestions for lower scores', () => {
      const poorCV = createMockCV({
        normalizedText: 'Basic CV with minimal content',
        sections: [],
        metadata: {
          wordCount: 50,
          lineCount: 5,
          hasContactInfo: false,
          estimatedPageCount: 1,
          fileType: 'pdf',
        },
      });
      
      const result = calculateScore(poorCV);
      
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });
});
