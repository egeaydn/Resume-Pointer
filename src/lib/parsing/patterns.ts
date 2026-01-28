/**
 * Keyword lists and regex patterns for CV analysis
 * Based on RFC-003: Text Parsing & Detection Rules
 */

import { DetectedSection, ParsedCV } from '../scoring/types';

// ============================================================================
// TECHNICAL SKILLS KEYWORDS
// ============================================================================

export const TECHNICAL_SKILLS = {
  // Programming Languages
  languages: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
    'php', 'swift', 'kotlin', 'scala', 'perl', 'r', 'matlab', 'sql', 'bash', 'shell',
  ],
  
  // Frameworks & Libraries
  frameworks: [
    'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'express', 'fastapi',
    'django', 'flask', 'spring', 'laravel', 'rails', 'asp.net', 'node.js', 'nest.js',
    'jquery', 'redux', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas',
  ],
  
  // Tools & Platforms
  tools: [
    'git', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github', 'bitbucket',
    'aws', 'azure', 'gcp', 'heroku', 'vercel', 'netlify', 'terraform', 'ansible',
    'webpack', 'vite', 'babel', 'eslint', 'prettier', 'jest', 'mocha', 'cypress',
    'selenium', 'postman', 'swagger', 'figma', 'sketch', 'jira', 'confluence',
  ],
  
  // Databases
  databases: [
    'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra',
    'oracle', 'sql server', 'sqlite', 'dynamodb', 'firebase', 'supabase',
  ],
  
  // Methodologies & Concepts
  concepts: [
    'agile', 'scrum', 'devops', 'ci/cd', 'tdd', 'bdd', 'rest api', 'graphql',
    'microservices', 'cloud computing', 'machine learning', 'deep learning',
    'data science', 'big data', 'blockchain', 'cybersecurity', 'responsive design',
    'accessibility', 'performance optimization', 'seo', 'ui/ux', 'api design',
  ],
};

// Flatten all technical skills into single array
export const ALL_TECHNICAL_SKILLS = [
  ...TECHNICAL_SKILLS.languages,
  ...TECHNICAL_SKILLS.frameworks,
  ...TECHNICAL_SKILLS.tools,
  ...TECHNICAL_SKILLS.databases,
  ...TECHNICAL_SKILLS.concepts,
];

// ============================================================================
// ACTION VERBS (for experience bullet points)
// ============================================================================

export const ACTION_VERBS = [
  'achieved', 'improved', 'developed', 'implemented', 'designed', 'built', 'created',
  'led', 'managed', 'coordinated', 'organized', 'executed', 'delivered', 'launched',
  'optimized', 'enhanced', 'increased', 'decreased', 'reduced', 'streamlined',
  'automated', 'integrated', 'migrated', 'deployed', 'maintained', 'collaborated',
  'architected', 'engineered', 'debugged', 'refactored', 'established', 'pioneered',
  'spearheaded', 'initiated', 'accelerated', 'transformed', 'resolved', 'analyzed',
  'evaluated', 'researched', 'documented', 'trained', 'mentored', 'presented',
];

// ============================================================================
// SECTION DETECTION PATTERNS
// ============================================================================

export const SECTION_PATTERNS = {
  contact: /^(contact|personal\s+information|get\s+in\s+touch)/im,
  
  summary: /^(professional\s+summary|summary|profile|about\s+me|objective|career\s+objective)/im,
  
  experience: /^(work\s+experience|professional\s+experience|experience|employment\s+history|career\s+history)/im,
  
  education: /^(education|academic\s+background|qualifications)/im,
  
  skills: /^(skills|technical\s+skills|core\s+competencies|expertise|technologies)/im,
  
  projects: /^(projects|personal\s+projects|portfolio|key\s+projects)/im,
  
  certifications: /^(certifications|certificates|licenses|credentials)/im,
  
  awards: /^(awards|honors|achievements|recognition)/im,
  
  languages: /^(languages|language\s+skills)/im,
  
  volunteer: /^(volunteer|volunteering|community\s+service)/im,
  
  publications: /^(publications|papers|articles|research)/im,
};

// ============================================================================
// CONTENT DETECTION PATTERNS
// ============================================================================

// Email pattern
export const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Phone number pattern (various formats)
export const PHONE_PATTERN = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

// URL pattern
export const URL_PATTERN = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.(com|org|net|io|dev|co)[^\s]*)/gi;

// Date patterns (for experience/education dates)
export const DATE_PATTERNS = {
  monthYear: /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,.-]*\d{4}\b/gi,
  yearOnly: /\b(19|20)\d{2}\b/g,
  present: /\b(present|current|now)\b/gi,
};

// Bullet point pattern
export const BULLET_PATTERN = /^[\s]*[•▪▸→\-\*]\s+/gm;

// Quantification patterns (numbers, percentages, metrics)
export const QUANTIFICATION_PATTERNS = {
  percentage: /\d+(\.\d+)?%/g,
  number: /\b\d{1,3}(,\d{3})*(\.\d+)?\b/g,
  currency: /\$\d{1,3}(,\d{3})*(\.\d+)?[KMB]?/gi,
  timeframe: /\d+\s+(year|month|week|day|hour)s?/gi,
};

// ============================================================================
// SECTION DETECTION FUNCTION
// ============================================================================

/**
 * Detect and extract sections from CV text
 */
export function detectSections(cv: ParsedCV): DetectedSection[] {
  const sections: DetectedSection[] = [];
  const lines = cv.normalizedText.split('\n');
  
  let currentSection: DetectedSection | null = null;
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Check if line matches any section header
    for (const [sectionName, pattern] of Object.entries(SECTION_PATTERNS)) {
      if (pattern.test(trimmedLine)) {
        // Save previous section if exists
        if (currentSection) {
          sections.push(currentSection);
        }
        
        // Start new section
        currentSection = {
          name: sectionName,
          content: '',
          startIndex: index,
          endIndex: index,
          confidence: 0.9,
        };
        break;
      }
    }
    
    // Add content to current section
    if (currentSection) {
      currentSection.content += line + '\n';
      currentSection.endIndex = index;
    }
  });
  
  // Add last section
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Count technical skills in text
 */
export function countTechnicalSkills(text: string): {
  count: number;
  found: string[];
} {
  const lowerText = text.toLowerCase();
  const found: string[] = [];
  
  ALL_TECHNICAL_SKILLS.forEach(skill => {
    // Use word boundary for exact matching
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowerText)) {
      found.push(skill);
    }
  });
  
  return {
    count: found.length,
    found: [...new Set(found)], // Remove duplicates
  };
}

/**
 * Count action verbs in text
 */
export function countActionVerbs(text: string): {
  count: number;
  found: string[];
} {
  const lowerText = text.toLowerCase();
  const found: string[] = [];
  
  ACTION_VERBS.forEach(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      found.push(...matches.map(m => m.toLowerCase()));
    }
  });
  
  return {
    count: found.length,
    found: [...new Set(found)], // Remove duplicates
  };
}

/**
 * Count bullet points in text
 */
export function countBulletPoints(text: string): number {
  const matches = text.match(BULLET_PATTERN);
  return matches ? matches.length : 0;
}

/**
 * Count quantified achievements (numbers, percentages, etc.)
 */
export function countQuantifications(text: string): {
  count: number;
  examples: string[];
} {
  const examples: string[] = [];
  
  // Check for percentages
  const percentages = text.match(QUANTIFICATION_PATTERNS.percentage) || [];
  examples.push(...percentages);
  
  // Check for currency
  const currency = text.match(QUANTIFICATION_PATTERNS.currency) || [];
  examples.push(...currency);
  
  // Check for timeframes
  const timeframes = text.match(QUANTIFICATION_PATTERNS.timeframe) || [];
  examples.push(...timeframes);
  
  return {
    count: examples.length,
    examples: examples.slice(0, 10), // Return first 10 examples
  };
}

/**
 * Check if section exists
 */
export function hasSectionByName(sections: DetectedSection[], name: string): boolean {
  return sections.some(section => section.name === name);
}

/**
 * Get section content by name
 */
export function getSectionContent(sections: DetectedSection[], name: string): string | null {
  const section = sections.find(s => s.name === name);
  return section ? section.content : null;
}
