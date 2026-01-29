/**
 * Unit tests for pattern matching and keyword detection
 */

import {
  countTechnicalSkills,
  countActionVerbs,
  countBulletPoints,
  countQuantifications,
  detectSocialProfiles,
  analyzeContactInfo,
  extractYearsOfExperience,
  detectSections,
} from '@/lib/parsing/patterns';
import { ParsedCV } from '@/lib/scoring/types';

describe('Technical Skills Detection', () => {
  it('should detect programming languages', () => {
    const text = 'I have experience with JavaScript, Python, and TypeScript';
    const result = countTechnicalSkills(text);
    
    expect(result.count).toBeGreaterThanOrEqual(3);
    expect(result.found).toContain('javascript');
    expect(result.found).toContain('python');
    expect(result.found).toContain('typescript');
  });

  it('should detect frameworks and libraries', () => {
    const text = 'Skills: React, Next.js, Express, Django, Flask';
    const result = countTechnicalSkills(text);
    
    expect(result.count).toBeGreaterThanOrEqual(5);
    expect(result.found).toContain('react');
    expect(result.found).toContain('next.js');
  });

  it('should detect cloud and DevOps tools', () => {
    const text = 'Experience with AWS, Docker, Kubernetes, and Jenkins';
    const result = countTechnicalSkills(text);
    
    expect(result.count).toBeGreaterThanOrEqual(4);
    expect(result.found).toContain('aws');
    expect(result.found).toContain('docker');
    expect(result.found).toContain('kubernetes');
  });

  it('should detect databases', () => {
    const text = 'Databases: PostgreSQL, MongoDB, Redis';
    const result = countTechnicalSkills(text);
    
    expect(result.count).toBeGreaterThanOrEqual(3);
    expect(result.found).toContain('postgresql');
    expect(result.found).toContain('mongodb');
  });

  it('should not double-count the same skill', () => {
    const text = 'JavaScript JavaScript JavaScript';
    const result = countTechnicalSkills(text);
    
    expect(result.count).toBe(1);
    expect(result.found).toEqual(['javascript']);
  });

  it('should be case-insensitive', () => {
    const text = 'PYTHON Python python';
    const result = countTechnicalSkills(text);
    
    expect(result.count).toBe(1);
  });
});

describe('Action Verbs Detection', () => {
  it('should detect achievement verbs', () => {
    const text = 'Achieved 50% growth. Accomplished major milestones. Exceeded targets.';
    const result = countActionVerbs(text);
    
    expect(result.count).toBeGreaterThanOrEqual(3);
    expect(result.found).toContain('achieved');
    expect(result.found).toContain('accomplished');
    expect(result.found).toContain('exceeded');
  });

  it('should detect leadership verbs', () => {
    const text = 'Led a team of 5. Managed multiple projects. Directed development efforts.';
    const result = countActionVerbs(text);
    
    expect(result.count).toBeGreaterThanOrEqual(3);
    expect(result.found).toContain('led');
    expect(result.found).toContain('managed');
  });

  it('should detect development verbs', () => {
    const text = 'Developed features. Built applications. Designed architecture.';
    const result = countActionVerbs(text);
    
    expect(result.count).toBeGreaterThanOrEqual(3);
  });

  it('should count multiple occurrences', () => {
    const text = 'Developed API. Managed team. Created documentation.';
    const result = countActionVerbs(text);
    
    expect(result.count).toBe(3);
  });
});

describe('Bullet Points Detection', () => {
  it('should detect various bullet point styles', () => {
    const text = `
      • First bullet
      - Second bullet
      * Third bullet
      → Fourth bullet
    `;
    const count = countBulletPoints(text);
    
    expect(count).toBe(4);
  });

  it('should return 0 for text without bullets', () => {
    const text = 'This is plain text without any bullets.';
    const count = countBulletPoints(text);
    
    expect(count).toBe(0);
  });
});

describe('Quantifications Detection', () => {
  it('should detect percentages', () => {
    const text = 'Improved performance by 50% and increased sales by 25.5%';
    const result = countQuantifications(text);
    
    expect(result.count).toBeGreaterThanOrEqual(2);
    expect(result.examples.some(e => e.includes('50%'))).toBe(true);
  });

  it('should detect currency amounts', () => {
    const text = 'Saved $100,000 and generated $1.5M in revenue';
    const result = countQuantifications(text);
    
    expect(result.count).toBeGreaterThanOrEqual(2);
  });

  it('should detect timeframes', () => {
    const text = 'Reduced deployment time by 2 hours per week';
    const result = countQuantifications(text);
    
    expect(result.count).toBeGreaterThanOrEqual(1);
  });

  it('should limit examples to 10', () => {
    const text = '1% 2% 3% 4% 5% 6% 7% 8% 9% 10% 11% 12%';
    const result = countQuantifications(text);
    
    expect(result.examples.length).toBeLessThanOrEqual(10);
  });
});

describe('Social Profiles Detection', () => {
  it('should detect LinkedIn profiles', () => {
    const text = 'Connect with me on linkedin.com/in/johndoe';
    const result = detectSocialProfiles(text);
    
    expect(result.linkedin).toBe(true);
    expect(result.profiles).toContain('LinkedIn');
  });

  it('should detect GitHub profiles', () => {
    const text = 'Check my projects: github.com/johndoe';
    const result = detectSocialProfiles(text);
    
    expect(result.github).toBe(true);
    expect(result.profiles).toContain('GitHub');
  });

  it('should detect portfolio mentions', () => {
    const text = 'Visit my portfolio at johndoe.com';
    const result = detectSocialProfiles(text);
    
    expect(result.portfolio).toBe(true);
  });

  it('should return empty for no profiles', () => {
    const text = 'Just plain text without any social links';
    const result = detectSocialProfiles(text);
    
    expect(result.linkedin).toBe(false);
    expect(result.github).toBe(false);
    expect(result.profiles.length).toBe(0);
  });
});

describe('Contact Information Analysis', () => {
  it('should detect email', () => {
    const text = 'Contact me at john.doe@example.com';
    const result = analyzeContactInfo(text);
    
    expect(result.hasEmail).toBe(true);
  });

  it('should detect phone numbers', () => {
    const text = 'Phone: (555) 123-4567';
    const result = analyzeContactInfo(text);
    
    expect(result.hasPhone).toBe(true);
  });

  it('should detect LinkedIn', () => {
    const text = 'linkedin.com/in/johndoe';
    const result = analyzeContactInfo(text);
    
    expect(result.hasLinkedIn).toBe(true);
  });

  it('should detect GitHub', () => {
    const text = 'github.com/johndoe';
    const result = analyzeContactInfo(text);
    
    expect(result.hasGitHub).toBe(true);
  });

  it('should calculate completeness', () => {
    const fullContact = 'john@example.com | (555) 123-4567 | linkedin.com/in/john | github.com/john | New York, NY';
    const result = analyzeContactInfo(fullContact);
    
    expect(result.completeness).toBeGreaterThan(80);
  });

  it('should give low completeness for minimal contact info', () => {
    const minimalContact = 'john@example.com';
    const result = analyzeContactInfo(minimalContact);
    
    expect(result.completeness).toBeLessThan(50);
  });
});

describe('Years of Experience Extraction', () => {
  it('should extract years from experience statement', () => {
    const text = 'I have 5 years of experience in software development';
    const result = extractYearsOfExperience(text);
    
    expect(result.totalYears).toBe(5);
  });

  it('should handle "X+ years" format', () => {
    const text = '10+ years of experience';
    const result = extractYearsOfExperience(text);
    
    expect(result.totalYears).toBe(10);
  });

  it('should take maximum when multiple years mentioned', () => {
    const text = '3 years of frontend experience and 5 years of backend experience';
    const result = extractYearsOfExperience(text);
    
    expect(result.totalYears).toBe(5);
  });

  it('should return 0 when no experience mentioned', () => {
    const text = 'Recent graduate looking for opportunities';
    const result = extractYearsOfExperience(text);
    
    expect(result.totalYears).toBe(0);
  });
});

describe('Section Detection', () => {
  it('should detect experience section', () => {
    const cv: ParsedCV = {
      rawText: '',
      normalizedText: `
        Work Experience
        Senior Developer
        Company Inc.
      `,
      sections: [],
      metadata: {
        wordCount: 10,
        lineCount: 5,
        hasContactInfo: false,
        estimatedPageCount: 1,
        fileType: 'pdf',
      },
    };
    
    const sections = detectSections(cv);
    const hasExperience = sections.some(s => s.name === 'experience');
    
    expect(hasExperience).toBe(true);
  });

  it('should detect education section', () => {
    const cv: ParsedCV = {
      rawText: '',
      normalizedText: `
        Education
        Bachelor of Science in Computer Science
        University Name
      `,
      sections: [],
      metadata: {
        wordCount: 10,
        lineCount: 5,
        hasContactInfo: false,
        estimatedPageCount: 1,
        fileType: 'pdf',
      },
    };
    
    const sections = detectSections(cv);
    const hasEducation = sections.some(s => s.name === 'education');
    
    expect(hasEducation).toBe(true);
  });

  it('should detect skills section', () => {
    const cv: ParsedCV = {
      rawText: '',
      normalizedText: `
        Technical Skills
        JavaScript, Python, React
      `,
      sections: [],
      metadata: {
        wordCount: 10,
        lineCount: 5,
        hasContactInfo: false,
        estimatedPageCount: 1,
        fileType: 'pdf',
      },
    };
    
    const sections = detectSections(cv);
    const hasSkills = sections.some(s => s.name === 'skills');
    
    expect(hasSkills).toBe(true);
  });

  it('should detect multiple sections', () => {
    const cv: ParsedCV = {
      rawText: '',
      normalizedText: `
        Professional Summary
        Experienced developer
        
        Work Experience
        Senior Developer
        
        Education
        BS Computer Science
        
        Skills
        JavaScript, Python
      `,
      sections: [],
      metadata: {
        wordCount: 20,
        lineCount: 15,
        hasContactInfo: false,
        estimatedPageCount: 1,
        fileType: 'pdf',
      },
    };
    
    const sections = detectSections(cv);
    
    expect(sections.length).toBeGreaterThanOrEqual(4);
  });
});
