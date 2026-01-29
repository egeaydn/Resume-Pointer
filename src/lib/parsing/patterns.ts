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
    'dart', 'elixir', 'haskell', 'lua', 'objective-c', 'groovy', 'powershell',
    'assembly', 'vb.net', 'fortran', 'cobol', 'clojure', 'f#', 'erlang',
  ],
  
  // Frontend Frameworks & Libraries
  frontend: [
    'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'gatsby', 'remix',
    'ember', 'backbone', 'jquery', 'redux', 'mobx', 'recoil', 'zustand',
    'react native', 'ionic', 'cordova', 'electron', 'flutter', 'xamarin',
    'alpine.js', 'htmx', 'astro', 'solid.js', 'preact', 'lit', 'polymer',
  ],
  
  // Backend Frameworks
  backend: [
    'express', 'fastapi', 'django', 'flask', 'spring', 'spring boot', 'laravel',
    'rails', 'ruby on rails', 'asp.net', 'node.js', 'nest.js', 'fastify', 'koa',
    'gin', 'echo', 'fiber', 'actix', 'rocket', 'phoenix', 'play', 'ktor',
    'strapi', 'adonis', 'sails', 'loopback', 'hapi',
  ],
  
  // Data Science & ML
  datascience: [
    'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'scipy',
    'matplotlib', 'seaborn', 'plotly', 'jupyter', 'anaconda', 'spark', 'pyspark',
    'hadoop', 'tableau', 'power bi', 'r studio', 'stata', 'spss', 'sas',
    'opencv', 'nltk', 'spacy', 'hugging face', 'langchain', 'xgboost', 'lightgbm',
  ],
  
  // Cloud & DevOps Tools
  cloud: [
    'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'vercel', 'netlify', 'digitalocean',
    'docker', 'kubernetes', 'k8s', 'jenkins', 'gitlab', 'github', 'bitbucket',
    'terraform', 'ansible', 'chef', 'puppet', 'vagrant', 'cloudformation',
    'circleci', 'travis ci', 'github actions', 'azure devops', 'bamboo',
    'prometheus', 'grafana', 'datadog', 'new relic', 'splunk', 'elk stack',
  ],
  
  // Build Tools & Bundlers
  buildtools: [
    'webpack', 'vite', 'rollup', 'parcel', 'esbuild', 'turbopack', 'babel',
    'gulp', 'grunt', 'browserify', 'swc', 'rome', 'npm', 'yarn', 'pnpm', 'bun',
  ],
  
  // Testing Tools
  testing: [
    'jest', 'mocha', 'chai', 'jasmine', 'vitest', 'cypress', 'playwright',
    'selenium', 'puppeteer', 'testcafe', 'webdriver', 'karma', 'protractor',
    'pytest', 'unittest', 'junit', 'testng', 'rspec', 'minitest', 'phpunit',
    'enzyme', 'react testing library', 'vue test utils', 'storybook', 'chromatic',
  ],
  
  // Databases
  databases: [
    'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch',
    'cassandra', 'oracle', 'sql server', 'sqlite', 'dynamodb', 'firebase',
    'supabase', 'mariadb', 'couchdb', 'neo4j', 'influxdb', 'timescaledb',
    'cockroachdb', 'planetscale', 'fauna', 'prisma', 'typeorm', 'sequelize',
    'mongoose', 'knex', 'drizzle', 'graphql', 'apollo', 'hasura', 'postgraphile',
  ],
  
  // API & Integration
  api: [
    'rest api', 'graphql', 'grpc', 'soap', 'websocket', 'webhooks',
    'postman', 'insomnia', 'swagger', 'openapi', 'apigateway', 'kong',
    'apollo server', 'apollo client', 'relay', 'urql', 'axios', 'fetch',
  ],
  
  // Design & UI Tools
  design: [
    'figma', 'sketch', 'adobe xd', 'invision', 'zeplin', 'framer', 'principle',
    'photoshop', 'illustrator', 'canva', 'affinity designer', 'blender',
  ],
  
  // Project Management & Collaboration
  projectmgmt: [
    'jira', 'confluence', 'trello', 'asana', 'monday', 'notion', 'clickup',
    'linear', 'shortcut', 'basecamp', 'slack', 'teams', 'discord', 'zoom',
  ],
  
  // CSS Frameworks & Preprocessors
  css: [
    'tailwind', 'tailwind css', 'bootstrap', 'material ui', 'mui', 'chakra ui',
    'sass', 'scss', 'less', 'stylus', 'postcss', 'css modules', 'styled components',
    'emotion', 'bulma', 'foundation', 'semantic ui', 'ant design', 'mantine',
  ],
  
  // Mobile Development
  mobile: [
    'react native', 'flutter', 'swift', 'swiftui', 'kotlin', 'android',
    'ios', 'xcode', 'android studio', 'expo', 'ionic', 'capacitor',
  ],
  
  // Methodologies & Concepts
  concepts: [
    'agile', 'scrum', 'kanban', 'devops', 'ci/cd', 'tdd', 'bdd', 'ddd',
    'microservices', 'monolith', 'serverless', 'jamstack', 'headless cms',
    'cloud computing', 'machine learning', 'deep learning', 'data science',
    'big data', 'blockchain', 'web3', 'cryptocurrency', 'nft', 'defi',
    'cybersecurity', 'penetration testing', 'ethical hacking', 'soc',
    'responsive design', 'accessibility', 'wcag', 'a11y', 'performance optimization',
    'seo', 'ui/ux', 'user experience', 'user interface', 'api design',
    'restful', 'solid principles', 'design patterns', 'clean code', 'refactoring',
    'pair programming', 'code review', 'version control', 'git flow',
  ],
  
  // Soft Skills & Leadership
  softskills: [
    'leadership', 'team lead', 'mentoring', 'coaching', 'communication',
    'collaboration', 'problem solving', 'critical thinking', 'analytical',
    'time management', 'project management', 'stakeholder management',
    'presentation', 'documentation', 'technical writing', 'cross-functional',
  ],
};

// Flatten all technical skills into single array
export const ALL_TECHNICAL_SKILLS = [
  ...TECHNICAL_SKILLS.languages,
  ...TECHNICAL_SKILLS.frontend,
  ...TECHNICAL_SKILLS.backend,
  ...TECHNICAL_SKILLS.datascience,
  ...TECHNICAL_SKILLS.cloud,
  ...TECHNICAL_SKILLS.buildtools,
  ...TECHNICAL_SKILLS.testing,
  ...TECHNICAL_SKILLS.databases,
  ...TECHNICAL_SKILLS.api,
  ...TECHNICAL_SKILLS.design,
  ...TECHNICAL_SKILLS.projectmgmt,
  ...TECHNICAL_SKILLS.css,
  ...TECHNICAL_SKILLS.mobile,
  ...TECHNICAL_SKILLS.concepts,
  ...TECHNICAL_SKILLS.softskills,
];

// ============================================================================
// ACTION VERBS (for experience bullet points)
// ============================================================================

export const ACTION_VERBS = [
  // Achievement & Impact
  'achieved', 'accomplished', 'attained', 'surpassed', 'exceeded', 'delivered',
  'earned', 'won', 'secured', 'obtained', 'gained',
  
  // Leadership & Management
  'led', 'managed', 'directed', 'supervised', 'coordinated', 'orchestrated',
  'oversaw', 'governed', 'administered', 'headed', 'chaired', 'presided',
  
  // Creation & Development
  'developed', 'created', 'built', 'designed', 'engineered', 'architected',
  'constructed', 'established', 'founded', 'formulated', 'generated', 'produced',
  'crafted', 'authored', 'composed', 'invented', 'pioneered',
  
  // Implementation & Execution
  'implemented', 'executed', 'deployed', 'launched', 'delivered', 'released',
  'rolled out', 'initiated', 'introduced', 'installed', 'integrated',
  
  // Improvement & Optimization
  'improved', 'enhanced', 'optimized', 'streamlined', 'upgraded', 'modernized',
  'refined', 'strengthened', 'boosted', 'accelerated', 'maximized',
  'revitalized', 'transformed', 'revolutionized', 'overhauled',
  
  // Growth & Expansion
  'increased', 'expanded', 'grew', 'scaled', 'amplified', 'multiplied',
  'broadened', 'extended', 'widened', 'elevated',
  
  // Reduction & Efficiency
  'reduced', 'decreased', 'minimized', 'eliminated', 'cut', 'slashed',
  'trimmed', 'lowered', 'diminished', 'compressed',
  
  // Analysis & Research
  'analyzed', 'evaluated', 'assessed', 'examined', 'investigated', 'researched',
  'studied', 'reviewed', 'audited', 'diagnosed', 'measured', 'quantified',
  'surveyed', 'tested', 'validated', 'verified',
  
  // Collaboration & Communication
  'collaborated', 'partnered', 'cooperated', 'liaised', 'coordinated',
  'communicated', 'presented', 'reported', 'briefed', 'consulted',
  'advised', 'counseled', 'negotiated', 'mediated', 'facilitated',
  
  // Training & Development
  'trained', 'mentored', 'coached', 'educated', 'taught', 'instructed',
  'guided', 'developed', 'cultivated', 'nurtured', 'onboarded',
  
  // Organization & Planning
  'organized', 'planned', 'scheduled', 'prioritized', 'allocated',
  'arranged', 'structured', 'systematized', 'standardized',
  
  // Problem Solving
  'resolved', 'solved', 'fixed', 'debugged', 'troubleshot', 'addressed',
  'rectified', 'remedied', 'corrected', 'repaired',
  
  // Automation & Innovation
  'automated', 'innovated', 'pioneered', 'spearheaded', 'championed',
  'drove', 'propelled', 'catalyzed',
  
  // Migration & Modernization
  'migrated', 'converted', 'transitioned', 'upgraded', 'refactored',
  'redesigned', 'reengineered', 'rebuilt',
  
  // Maintenance & Support
  'maintained', 'supported', 'administered', 'monitored', 'operated',
  'managed', 'serviced', 'updated',
  
  // Documentation & Recording
  'documented', 'recorded', 'cataloged', 'compiled', 'drafted', 'wrote',
  'published', 'standardized',
];

// ============================================================================
// SECTION DETECTION PATTERNS
// ============================================================================

export const SECTION_PATTERNS = {
  contact: /^(contact|personal\s+information|personal\s+details|get\s+in\s+touch|contact\s+info|contact\s+details)/im,
  
  summary: /^(professional\s+summary|summary|profile|about\s+me|objective|career\s+objective|career\s+summary|executive\s+summary|personal\s+statement|professional\s+profile)/im,
  
  experience: /^(work\s+experience|professional\s+experience|experience|employment\s+history|career\s+history|work\s+history|relevant\s+experience|professional\s+background)/im,
  
  education: /^(education|academic\s+background|qualifications|academic\s+qualifications|educational\s+background)/im,
  
  skills: /^(skills|technical\s+skills|core\s+competencies|expertise|technologies|technical\s+expertise|key\s+skills|professional\s+skills|core\s+skills|competencies)/im,
  
  projects: /^(projects|personal\s+projects|portfolio|key\s+projects|notable\s+projects|side\s+projects|open\s+source|contributions)/im,
  
  certifications: /^(certifications|certificates|licenses|credentials|professional\s+certifications|professional\s+licenses)/im,
  
  awards: /^(awards|honors|achievements|recognition|accomplishments|honors\s+and\s+awards)/im,
  
  languages: /^(languages|language\s+skills|language\s+proficiency|spoken\s+languages)/im,
  
  volunteer: /^(volunteer|volunteering|community\s+service|volunteer\s+work|volunteer\s+experience)/im,
  
  publications: /^(publications|papers|articles|research|research\s+publications|published\s+work)/im,
  
  interests: /^(interests|hobbies|personal\s+interests|hobbies\s+and\s+interests)/im,
  
  references: /^(references|professional\s+references|references\s+available)/im,
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

// Social media patterns
export const SOCIAL_PATTERNS = {
  linkedin: /linkedin\.com\/in\/[a-zA-Z0-9-]+/gi,
  github: /github\.com\/[a-zA-Z0-9-]+/gi,
  gitlab: /gitlab\.com\/[a-zA-Z0-9-]+/gi,
  portfolio: /(portfolio|website|personal\s+site)/gi,
  twitter: /(twitter\.com|x\.com)\/[a-zA-Z0-9_]+/gi,
  medium: /medium\.com\/@?[a-zA-Z0-9-]+/gi,
  stackoverflow: /stackoverflow\.com\/users\/\d+/gi,
};

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
  const foundSet = new Set<string>();
  
  ACTION_VERBS.forEach(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(lowerText)) {
      foundSet.add(verb);
    }
  });
  
  const found = Array.from(foundSet);
  
  return {
    count: found.length,
    found,
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

/**
 * Detect social media profiles in text
 */
export function detectSocialProfiles(text: string): {
  linkedin: boolean;
  github: boolean;
  portfolio: boolean;
  profiles: string[];
} {
  const profiles: string[] = [];
  
  const linkedinMatch = text.match(SOCIAL_PATTERNS.linkedin);
  const githubMatch = text.match(SOCIAL_PATTERNS.github);
  const portfolioMatch = text.match(SOCIAL_PATTERNS.portfolio);
  
  if (linkedinMatch) profiles.push('LinkedIn');
  if (githubMatch) profiles.push('GitHub');
  if (portfolioMatch) profiles.push('Portfolio');
  
  return {
    linkedin: !!linkedinMatch,
    github: !!githubMatch,
    portfolio: !!portfolioMatch,
    profiles,
  };
}

/**
 * Analyze contact information completeness
 */
export function analyzeContactInfo(text: string): {
  hasEmail: boolean;
  hasPhone: boolean;
  hasLinkedIn: boolean;
  hasGitHub: boolean;
  hasLocation: boolean;
  completeness: number; // 0-100
} {
  const hasEmail = EMAIL_PATTERN.test(text);
  const hasPhone = PHONE_PATTERN.test(text);
  const socialProfiles = detectSocialProfiles(text);
  const hasLinkedIn = socialProfiles.linkedin;
  const hasGitHub = socialProfiles.github;
  
  // Check for location keywords
  const locationKeywords = ['location', 'address', 'city', 'state', 'country', 'remote'];
  const hasLocation = locationKeywords.some(keyword => 
    new RegExp(`\\b${keyword}\\b`, 'i').test(text)
  );
  
  // Calculate completeness (each field worth 20%)
  let completeness = 0;
  if (hasEmail) completeness += 25;
  if (hasPhone) completeness += 20;
  if (hasLinkedIn) completeness += 25;
  if (hasGitHub) completeness += 15;
  if (hasLocation) completeness += 15;
  
  return {
    hasEmail,
    hasPhone,
    hasLinkedIn,
    hasGitHub,
    hasLocation,
    completeness,
  };
}

/**
 * Extract years of experience from text
 */
export function extractYearsOfExperience(text: string): {
  totalYears: number;
  experienceStatements: string[];
} {
  const experienceStatements: string[] = [];
  let totalYears = 0;
  
  // Pattern: "X years of experience" or "X+ years" or "X years" (more flexible)
  const yearPattern = /(\d+)\+?\s*(?:years?|yrs?)(?:\s+of\s+(?:experience|exp(?:erience)?))?\b/gi;
  const matches = text.matchAll(yearPattern);
  
  for (const match of matches) {
    const years = parseInt(match[1]);
    totalYears = Math.max(totalYears, years);
    experienceStatements.push(match[0]);
  }
  
  return {
    totalYears,
    experienceStatements,
  };
}
