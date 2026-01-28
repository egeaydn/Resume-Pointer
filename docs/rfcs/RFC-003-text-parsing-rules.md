# RFC-003: Text Parsing & Detection Rules

**Status**: Draft  
**Author**: Development Team  
**Created**: January 28, 2026  
**Last Updated**: January 28, 2026

## Abstract

This RFC defines the technical implementation of text extraction, parsing, and pattern detection for CV analysis. It specifies regex patterns, keyword matching algorithms, and text processing utilities that power the scoring engine.

## Motivation

The scoring system relies on accurate detection of CV elements (sections, keywords, formatting patterns). This RFC ensures:
1. Consistent, reliable pattern matching across diverse CV formats
2. Clear documentation of all detection logic for maintainability
3. Optimized regex for performance
4. Handling of edge cases and format variations

## Architecture Overview

```
┌─────────────────┐
│  PDF/DOCX File  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Text Extraction │ ◄── pdf-parse / mammoth
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Text Normalization │ ◄── Clean whitespace, encoding
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Section Detection │ ◄── Regex for headings
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Content Analysis │ ◄── Keyword matching, pattern counting
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Scoring Engine  │ ◄── Apply rubric rules
└─────────────────┘
```

## Text Extraction

### PDF Extraction

**Library**: `pdf-parse` (v1.1.1+)

**Implementation**:
```javascript
import pdfParse from 'pdf-parse';

async function extractPdfText(fileBuffer) {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    throw new Error('PDF_EXTRACTION_FAILED: ' + error.message);
  }
}
```

**Considerations**:
- Works with text-based PDFs only (not scanned images)
- May struggle with complex multi-column layouts
- Preserves text order but not exact positioning
- Returns plain text with newlines

**Error Handling**:
- Corrupted PDF → return error to user
- Password-protected PDF → return error to user
- Scanned image PDF (no text layer) → return error suggesting text-based export

### DOCX Extraction

**Library**: `mammoth` (v1.6.0+)

**Implementation**:
```javascript
import mammoth from 'mammoth';

async function extractDocxText(fileBuffer) {
  try {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value; // Plain text
  } catch (error) {
    throw new Error('DOCX_EXTRACTION_FAILED: ' + error.message);
  }
}
```

**Considerations**:
- Extracts plain text, preserving paragraph structure
- Handles modern .docx format (Office 2007+)
- Does not extract images or complex formatting
- More reliable than PDF for text extraction

**Error Handling**:
- Invalid DOCX → return error
- Old .doc format → suggest converting to .docx

### Text Normalization

After extraction, normalize text for consistent processing:

```javascript
function normalizeText(rawText) {
  let text = rawText;
  
  // 1. Fix encoding issues (common in PDFs)
  text = text.replace(/â€™/g, "'"); // Fix smart quotes
  text = text.replace(/â€"/g, "—"); // Fix em dash
  
  // 2. Remove excessive whitespace
  text = text.replace(/[ \t]+/g, ' '); // Multiple spaces to single
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n'); // Max 2 consecutive newlines
  
  // 3. Remove form feed characters (page breaks in PDF)
  text = text.replace(/\f/g, '\n\n');
  
  // 4. Trim each line
  text = text.split('\n').map(line => line.trim()).join('\n');
  
  // 5. Remove hyphenation at line breaks
  text = text.replace(/-\n/g, ''); // "exam-\nple" → "example"
  
  return text;
}
```

## Section Detection

### Regex Patterns for Section Headings

All patterns use:
- Case-insensitive matching: `(?i)` or `/.../i`
- Line boundary anchors: `^` and `$` with multiline flag `m`
- Word boundaries: `\b` where appropriate

#### Contact Information Detection

**Strategy**: Look for email and phone patterns (may not have explicit heading)

```javascript
// Email detection
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

// Phone detection (flexible for various formats)
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

function hasContactInfo(text) {
  const hasEmail = EMAIL_REGEX.test(text);
  const hasPhone = PHONE_REGEX.test(text);
  
  return {
    hasEmail,
    hasPhone,
    complete: hasEmail && hasPhone
  };
}
```

**Test Cases**:
- `john.doe@example.com` → match
- `jdoe123@company.co.uk` → match
- `(555) 123-4567` → match
- `555-123-4567` → match
- `+1-555-123-4567` → match

#### Professional Summary Detection

```javascript
const SUMMARY_REGEX = /^(Professional\s+)?(Summary|Profile|Objective|About(\s+Me)?)\s*$/im;

function hasSummarySection(text) {
  return SUMMARY_REGEX.test(text);
}

// Additionally, check if summary appears in top 20% of document
function summaryPosition(text) {
  const match = text.match(SUMMARY_REGEX);
  if (!match) return null;
  
  const position = match.index / text.length;
  return position < 0.2 ? 'top' : 'later';
}
```

**Variations Detected**:
- "Summary"
- "Professional Summary"
- "Profile"
- "Professional Profile"
- "Objective"
- "Career Objective"
- "About"
- "About Me"

#### Experience Section Detection

```javascript
const EXPERIENCE_REGEX = /^(Work\s+|Professional\s+|Employment\s+|Career\s+)?(Experience|History)\s*$/im;

function hasExperienceSection(text) {
  return EXPERIENCE_REGEX.test(text);
}

// Extract experience section content
function extractExperienceSection(text) {
  const match = text.match(EXPERIENCE_REGEX);
  if (!match) return null;
  
  const startIndex = match.index;
  
  // Find next section (or end of document)
  const nextSectionMatch = text.slice(startIndex + 20).match(/^(Education|Skills|Projects|Certifications)/im);
  const endIndex = nextSectionMatch 
    ? startIndex + 20 + nextSectionMatch.index 
    : text.length;
  
  return text.slice(startIndex, endIndex);
}
```

**Variations Detected**:
- "Experience"
- "Work Experience"
- "Professional Experience"
- "Employment History"
- "Career History"
- "Work History"

#### Education Section Detection

```javascript
const EDUCATION_REGEX = /^(Academic\s+)?(Education|Qualifications|Academic\s+Background)\s*$/im;

function hasEducationSection(text) {
  return EDUCATION_REGEX.test(text);
}
```

**Variations Detected**:
- "Education"
- "Academic Background"
- "Qualifications"
- "Academic Qualifications"

#### Skills Section Detection

```javascript
const SKILLS_REGEX = /^(Technical\s+|Core\s+|Key\s+)?(Skills|Competencies|Expertise|Proficiencies)\s*$/im;

function hasSkillsSection(text) {
  return SKILLS_REGEX.test(text);
}
```

**Variations Detected**:
- "Skills"
- "Technical Skills"
- "Core Competencies"
- "Key Skills"
- "Expertise"
- "Proficiencies"

#### Additional Sections (for comprehensive analysis)

```javascript
// Projects
const PROJECTS_REGEX = /^(Personal\s+|Side\s+)?Projects\s*$/im;

// Certifications
const CERTIFICATIONS_REGEX = /^(Certifications?|Licenses?|Professional\s+Certifications?)\s*$/im;

// Awards
const AWARDS_REGEX = /^(Awards?|Honors?|Achievements?)\s*$/im;

// Volunteer
const VOLUNTEER_REGEX = /^(Volunteer(\s+Experience)?|Community\s+Service)\s*$/im;
```

## Keyword Detection

### Technical Skills Keywords

**Category-Based Lists**:

```javascript
const TECHNICAL_KEYWORDS = {
  programming: [
    'Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Ruby',
    'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 'Scala', 'R', 'MATLAB',
    'Perl', 'Shell', 'Bash', 'PowerShell'
  ],
  
  webTech: [
    'HTML', 'CSS', 'React', 'Angular', 'Vue', 'Vue.js', 'Svelte',
    'Node.js', 'Express', 'Next.js', 'Nuxt', 'Django', 'Flask',
    'Spring', 'ASP.NET', 'Laravel', 'Rails', 'jQuery', 'Bootstrap',
    'Tailwind', 'Sass', 'LESS', 'Webpack', 'Vite'
  ],
  
  databases: [
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle',
    'SQL Server', 'SQLite', 'MariaDB', 'Cassandra', 'DynamoDB',
    'Firebase', 'Elasticsearch', 'Neo4j'
  ],
  
  cloud: [
    'AWS', 'Azure', 'GCP', 'Google Cloud', 'Heroku', 'DigitalOcean',
    'Vercel', 'Netlify', 'CloudFlare', 'Docker', 'Kubernetes',
    'K8s', 'Terraform', 'Ansible', 'Jenkins', 'CI/CD', 'GitHub Actions',
    'GitLab CI', 'CircleCI'
  ],
  
  tools: [
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence',
    'Slack', 'VS Code', 'IntelliJ', 'Eclipse', 'Postman', 'Figma',
    'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'AutoCAD',
    'SolidWorks', 'Excel', 'Tableau', 'Power BI', 'Looker'
  ],
  
  methodologies: [
    'Agile', 'Scrum', 'Kanban', 'Waterfall', 'DevOps', 'TDD',
    'Test-Driven Development', 'BDD', 'CI/CD', 'Microservices',
    'REST', 'RESTful', 'GraphQL', 'API', 'MVC', 'MVVM'
  ],
  
  domains: [
    'Machine Learning', 'AI', 'Artificial Intelligence', 'Deep Learning',
    'Data Science', 'Data Analysis', 'Big Data', 'NLP', 
    'Natural Language Processing', 'Computer Vision', 'Blockchain',
    'Cybersecurity', 'Networking', 'IoT', 'Mobile Development'
  ]
};

// Flatten all keywords for counting
const ALL_TECH_KEYWORDS = Object.values(TECHNICAL_KEYWORDS).flat();
```

**Detection Function**:

```javascript
function countTechnicalSkills(text) {
  const foundSkills = new Set();
  
  // Case-insensitive search
  const lowerText = text.toLowerCase();
  
  for (const keyword of ALL_TECH_KEYWORDS) {
    const pattern = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i');
    if (pattern.test(text)) {
      foundSkills.add(keyword);
    }
  }
  
  return {
    count: foundSkills.size,
    skills: Array.from(foundSkills),
    byCategory: categorizeFoun Skills(foundSkills)
  };
}

function categorizeFoundSkills(foundSkills) {
  const result = {};
  
  for (const [category, keywords] of Object.entries(TECHNICAL_KEYWORDS)) {
    result[category] = keywords.filter(k => 
      foundSkills.has(k) || Array.from(foundSkills).some(fs => 
        fs.toLowerCase() === k.toLowerCase()
      )
    );
  }
  
  return result;
}
```

### Soft Skills Keywords

```javascript
const SOFT_SKILLS = [
  'Communication', 'Leadership', 'Teamwork', 'Collaboration',
  'Problem Solving', 'Problem-Solving', 'Critical Thinking',
  'Analytical', 'Time Management', 'Organization', 'Adaptability',
  'Flexibility', 'Creativity', 'Attention to Detail', 'Initiative',
  'Interpersonal', 'Presentation', 'Public Speaking', 'Negotiation',
  'Conflict Resolution', 'Emotional Intelligence', 'Mentoring'
];

function countSoftSkills(text) {
  const found = [];
  const lowerText = text.toLowerCase();
  
  for (const skill of SOFT_SKILLS) {
    if (lowerText.includes(skill.toLowerCase())) {
      found.push(skill);
    }
  }
  
  return {
    count: found.length,
    skills: found
  };
}
```

### Action Verbs Detection

```javascript
const ACTION_VERBS = [
  'Achieved', 'Analyzed', 'Assessed', 'Assisted', 'Built', 'Collaborated',
  'Communicated', 'Completed', 'Conducted', 'Coordinated', 'Created',
  'Delivered', 'Demonstrated', 'Designed', 'Developed', 'Directed',
  'Drove', 'Established', 'Evaluated', 'Executed', 'Facilitated',
  'Generated', 'Guided', 'Identified', 'Implemented', 'Improved',
  'Increased', 'Initiated', 'Launched', 'Led', 'Managed', 'Monitored',
  'Negotiated', 'Optimized', 'Organized', 'Oversaw', 'Performed',
  'Planned', 'Produced', 'Programmed', 'Reduced', 'Resolved',
  'Spearheaded', 'Streamlined', 'Supervised', 'Supported', 'Trained'
];

function countActionVerbs(experienceText) {
  const lines = experienceText.split('\n');
  let count = 0;
  const foundVerbs = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and likely headings
    if (!trimmed || trimmed.length < 10) continue;
    
    // Remove bullet points/numbers
    const cleaned = trimmed.replace(/^[•\-\*\d]+\.?\s*/, '');
    
    // Get first word
    const firstWord = cleaned.split(/\s+/)[0];
    
    // Check if it's an action verb (case-insensitive)
    if (ACTION_VERBS.some(verb => verb.toLowerCase() === firstWord.toLowerCase())) {
      count++;
      foundVerbs.push(firstWord);
    }
  }
  
  return {
    count,
    verbs: foundVerbs
  };
}
```

## Content Pattern Detection

### Bullet Points Detection

```javascript
function detectBullets(text) {
  // Common bullet characters
  const bulletPatterns = [
    /^[•●▪▫■□▸▹►▻◦○◉◎]/,  // Unicode bullets
    /^[-–—]\s/,             // Hyphens/dashes
    /^\*\s/,                // Asterisks
    /^\d+\.\s/,             // Numbered lists
    /^[a-z]\.\s/i,          // Lettered lists
    /^>\s/                  // Angle brackets
  ];
  
  const lines = text.split('\n');
  let bulletCount = 0;
  let totalLines = 0;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length < 5) continue; // Skip very short lines
    
    totalLines++;
    
    if (bulletPatterns.some(pattern => pattern.test(trimmed))) {
      bulletCount++;
    }
  }
  
  return {
    count: bulletCount,
    percentage: totalLines > 0 ? (bulletCount / totalLines) * 100 : 0,
    hasBullets: bulletCount > 0
  };
}
```

### Quantifiable Achievements Detection

```javascript
function detectQuantification(text) {
  const patterns = [
    /\d+%/,                           // Percentages: "20%"
    /\$\d+[,\d]*(\.\d+)?[KkMmBb]?/,  // Currency: "$50K", "$1.5M"
    /\d+[KkMm]/,                      // Abbreviated numbers: "10K", "2M"
    /\d+\+/,                          // "5+ years"
    /\b\d{1,3}(,\d{3})*\b/,          // Large numbers with commas
    /(increased|decreased|improved|reduced|grew|saved|generated)\s+(by\s+)?\d+/i
  ];
  
  let matches = 0;
  const examples = [];
  
  for (const pattern of patterns) {
    const found = text.match(new RegExp(pattern, 'g'));
    if (found) {
      matches += found.length;
      examples.push(...found.slice(0, 3)); // Keep first 3 examples
    }
  }
  
  return {
    count: matches,
    examples: [...new Set(examples)], // Deduplicate
    hasQuantification: matches > 0
  };
}
```

### Date Detection (for chronology)

```javascript
function extractDates(text) {
  const datePatterns = [
    /\b(19|20)\d{2}\b/g,                    // Years: 2019, 2023
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(19|20)\d{2}\b/gi, // "Jan 2020"
    /\b(19|20)\d{2}\s*[-–—]\s*(19|20)\d{2}\b/g,  // "2019 - 2023"
    /\b(19|20)\d{2}\s*[-–—]\s*Present\b/gi   // "2020 - Present"
  ];
  
  const dates = [];
  
  for (const pattern of datePatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      dates.push(match[0]);
    }
  }
  
  return {
    dates,
    count: dates.length,
    hasDates: dates.length > 0
  };
}
```

### Degree Detection

```javascript
const DEGREE_KEYWORDS = [
  'Bachelor', 'B.S.', 'B.A.', 'B.Sc.', 'B.S', 'B.A', 'BS', 'BA',
  'Master', 'M.S.', 'M.A.', 'M.Sc.', 'M.S', 'M.A', 'MS', 'MA', 'MBA',
  'Associate', 'A.S.', 'A.A.', 'AS', 'AA',
  'Doctorate', 'Ph.D.', 'PhD', 'Doctor', 'D.Phil',
  'Diploma', 'Certificate', 'Certification'
];

function detectDegrees(educationText) {
  const found = [];
  
  for (const keyword of DEGREE_KEYWORDS) {
    const pattern = new RegExp(`\\b${keyword}`, 'i');
    if (pattern.test(educationText)) {
      found.push(keyword);
    }
  }
  
  return {
    count: found.length,
    degrees: found,
    hasDegree: found.length > 0
  };
}
```

## Formatting Analysis

### Page Length Estimation

```javascript
function estimatePageCount(text) {
  const wordCount = text.split(/\s+/).length;
  
  // Estimate: ~500 words per page (with formatting)
  const estimatedPages = wordCount / 500;
  
  // Alternative: Check for form feed characters (PDF page breaks)
  const formFeeds = (text.match(/\f/g) || []).length;
  
  return {
    wordCount,
    estimatedPages: Math.ceil(estimatedPages),
    formFeeds,
    finalEstimate: formFeeds > 0 ? formFeeds + 1 : Math.ceil(estimatedPages)
  };
}
```

### White Space Analysis

```javascript
function analyzeWhitespace(text) {
  const lines = text.split('\n');
  const blankLines = lines.filter(line => line.trim() === '').length;
  const totalLines = lines.length;
  
  const ratio = blankLines / totalLines;
  
  return {
    totalLines,
    blankLines,
    ratio,
    isDense: ratio < 0.10,  // Less than 10% blank lines
    isBalanced: ratio >= 0.10 && ratio <= 0.25,
    isSparse: ratio > 0.25
  };
}
```

### Consistency Checks

```javascript
function checkConsistency(text) {
  const issues = [];
  
  // 1. Check heading consistency
  const headings = text.match(/^.{1,50}$/gm) || [];
  const allUpperHeadings = headings.filter(h => h === h.toUpperCase()).length;
  const titleCaseHeadings = headings.filter(h => /^[A-Z]/.test(h)).length;
  
  if (allUpperHeadings > 0 && titleCaseHeadings > 0) {
    issues.push('Mixed heading styles (uppercase and title case)');
  }
  
  // 2. Check date format consistency
  const monthYearDates = (text.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b/gi) || []).length;
  const numericDates = (text.match(/\b\d{4}\b/g) || []).length;
  
  if (monthYearDates > 0 && numericDates > monthYearDates * 2) {
    issues.push('Inconsistent date formats');
  }
  
  // 3. Check bullet consistency
  const bulletTypes = {
    unicode: (text.match(/^[•●▪]/gm) || []).length,
    dash: (text.match(/^[-–—]\s/gm) || []).length,
    asterisk: (text.match(/^\*\s/gm) || []).length,
    numbered: (text.match(/^\d+\.\s/gm) || []).length
  };
  
  const bulletTypesUsed = Object.values(bulletTypes).filter(count => count > 0).length;
  if (bulletTypesUsed > 2) {
    issues.push('Multiple bullet styles used (consider standardizing)');
  }
  
  return {
    issues,
    isConsistent: issues.length === 0
  };
}
```

## Performance Optimization

### Compiled Regex Patterns

Pre-compile frequently used patterns for performance:

```javascript
class CVParser {
  constructor() {
    // Pre-compile all regex patterns
    this.patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
      phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
      summary: /^(Professional\s+)?(Summary|Profile|Objective|About(\s+Me)?)\s*$/im,
      experience: /^(Work\s+|Professional\s+|Employment\s+|Career\s+)?(Experience|History)\s*$/im,
      education: /^(Academic\s+)?(Education|Qualifications|Academic\s+Background)\s*$/im,
      skills: /^(Technical\s+|Core\s+|Key\s+)?(Skills|Competencies|Expertise|Proficiencies)\s*$/im,
      // ... etc
    };
    
    // Pre-process keyword lists
    this.keywords = {
      technical: ALL_TECH_KEYWORDS.map(k => k.toLowerCase()),
      soft: SOFT_SKILLS.map(s => s.toLowerCase()),
      actionVerbs: ACTION_VERBS.map(v => v.toLowerCase())
    };
  }
  
  parse(text) {
    // Use pre-compiled patterns
    // ...
  }
}
```

### Caching Strategy

For repeated operations on same text:

```javascript
class CVAnalyzer {
  constructor(text) {
    this.text = text;
    this.cache = {};
  }
  
  getSections() {
    if (this.cache.sections) return this.cache.sections;
    
    this.cache.sections = {
      hasContact: hasContactInfo(this.text),
      hasSummary: hasSummarySection(this.text),
      hasExperience: hasExperienceSection(this.text),
      // ...
    };
    
    return this.cache.sections;
  }
  
  getKeywords() {
    if (this.cache.keywords) return this.cache.keywords;
    
    this.cache.keywords = {
      technical: countTechnicalSkills(this.text),
      soft: countSoftSkills(this.text)
    };
    
    return this.cache.keywords;
  }
}
```

## Testing Strategy

### Unit Tests for Each Pattern

```javascript
describe('Section Detection', () => {
  describe('Experience Section', () => {
    it('detects "Experience"', () => {
      const text = 'Experience\nSoftware Engineer...';
      expect(hasExperienceSection(text)).toBe(true);
    });
    
    it('detects "Work Experience"', () => {
      const text = 'WORK EXPERIENCE\nJohn Doe...';
      expect(hasExperienceSection(text)).toBe(true);
    });
    
    it('detects "Professional Experience"', () => {
      const text = 'Professional Experience\n...';
      expect(hasExperienceSection(text)).toBe(true);
    });
    
    it('returns false when not present', () => {
      const text = 'Skills\nJavaScript, Python';
      expect(hasExperienceSection(text)).toBe(false);
    });
  });
});

describe('Keyword Counting', () => {
  it('counts technical skills case-insensitively', () => {
    const text = 'Skills: PYTHON, javascript, React, mysql';
    const result = countTechnicalSkills(text);
    expect(result.count).toBe(4);
  });
  
  it('handles word boundaries correctly', () => {
    const text = 'Expertise in JavaScript and Java';
    const result = countTechnicalSkills(text);
    expect(result.skills).toContain('JavaScript');
    expect(result.skills).toContain('Java');
  });
});
```

### Integration Tests

Test with real CV samples:

```javascript
describe('Full CV Analysis', () => {
  it('correctly analyzes a strong technical CV', () => {
    const sampleCV = readFileSync('./test/samples/strong-tech-cv.txt', 'utf-8');
    const analyzer = new CVAnalyzer(sampleCV);
    
    const sections = analyzer.getSections();
    expect(sections.hasExperience).toBe(true);
    expect(sections.hasEducation).toBe(true);
    
    const keywords = analyzer.getKeywords();
    expect(keywords.technical.count).toBeGreaterThan(5);
  });
});
```

## Edge Cases & Limitations

### Known Limitations

1. **Multi-Column Layouts**: PDF extraction may read columns out of order
   - **Mitigation**: Suggest single-column format in feedback

2. **Creative Formats**: Non-traditional designs may not be detected
   - **Mitigation**: Note in FAQ that traditional formats work best

3. **Scanned PDFs**: OCR not supported
   - **Mitigation**: Clear error message suggesting text-based export

4. **Non-English CVs**: Keywords are English-only
   - **Mitigation**: Document as limitation; potential V2 feature

5. **Abbreviations**: May miss uncommon abbreviations
   - **Mitigation**: Expand keyword list over time based on feedback

### Fallback Strategies

```javascript
function robustSectionDetection(text) {
  // Primary: Strict regex
  if (EXPERIENCE_REGEX.test(text)) return true;
  
  // Fallback: Fuzzy matching
  if (/experience|employment/i.test(text.slice(0, text.length / 2))) {
    // Check if it's likely a heading (short line, followed by content)
    // Implement heuristic here
    return true;
  }
  
  return false;
}
```

## Configuration & Extensibility

### Config File Structure

```javascript
// config/parsing-rules.js
export const PARSING_CONFIG = {
  sections: {
    experience: {
      patterns: [/^Experience$/i, /^Work History$/i],
      aliases: ['Work Experience', 'Professional Experience']
    },
    // ...
  },
  
  keywords: {
    technical: {
      programming: ['Python', 'Java', /*...*/],
      // ...
    }
  },
  
  thresholds: {
    minTechnicalSkills: 5,
    maxPageLength: 2,
    minBulletPercentage: 20
  }
};
```

### Runtime Customization

Allow adjusting rules without code changes:

```javascript
function analyzeCV(text, customConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...customConfig };
  
  // Use config.thresholds instead of hardcoded values
  const score = calculateScore(text, config);
  
  return score;
}
```

## Future Enhancements

### V1.1
- Add more technical keywords from emerging technologies
- Industry-specific keyword sets (tech, healthcare, finance)
- Improved multi-column detection heuristics

### V2.0
- Machine learning for better section detection
- NLP for content quality assessment
- Support for additional languages

---

**Approval Status**: ⏳ Pending Review  
**Dependencies**: RFC-002 (Scoring Rubric)  
**Next Steps**: Implement in backend (RFC-005)
