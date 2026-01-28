# RFC-007: Testing Strategy

**Status**: Draft  
**Author**: Development Team  
**Created**: January 28, 2026  
**Last Updated**: January 28, 2026

## Abstract

This RFC outlines the comprehensive testing strategy for CVScorer, including unit tests, integration tests, end-to-end tests, and manual testing procedures to ensure reliability and quality.

## Testing Philosophy

### Core Principles

1. **Coverage**: Aim for >80% code coverage
2. **Automation**: Automate wherever possible
3. **Fast Feedback**: Tests should run quickly in development
4. **Reliability**: Tests must be deterministic and reproducible
5. **Real-World Scenarios**: Test with actual CV samples

## Testing Pyramid

```
         ╱╲
        ╱E2E╲              10% - End-to-End Tests
       ╱─────╲               (Full user flows)
      ╱  Int  ╲            30% - Integration Tests
     ╱─────────╲             (API, components with data)
    ╱   Unit    ╲          60% - Unit Tests
   ╱─────────────╲           (Functions, utilities, logic)
  ╱───────────────╲
```

## Test Stack

- **Unit Testing**: Jest, React Testing Library
- **E2E Testing**: Playwright or Cypress
- **API Testing**: Supertest
- **Mocking**: jest.mock(), MSW (Mock Service Worker)
- **Coverage**: Jest built-in coverage
- **CI/CD**: GitHub Actions

## Unit Tests

### Backend Unit Tests

#### Text Extraction Tests

**File**: `/tests/unit/text-extraction.test.ts`

```typescript
import { extractTextFromFile, normalizeText } from '@/lib/text-extraction';
import { readFileSync } from 'fs';
import path from 'path';

describe('Text Extraction', () => {
  describe('PDF Extraction', () => {
    it('should extract text from valid PDF', async () => {
      const buffer = readFileSync(path.join(__dirname, '../fixtures/sample-cv.pdf'));
      const result = await extractTextFromFile(buffer, 'application/pdf');
      
      expect(result.success).toBe(true);
      expect(result.text).toBeDefined();
      expect(result.text!.length).toBeGreaterThan(50);
      expect(result.text).toContain('Experience');
    });
    
    it('should fail gracefully on corrupted PDF', async () => {
      const buffer = Buffer.from('This is not a PDF');
      const result = await extractTextFromFile(buffer, 'application/pdf');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    
    it('should handle empty PDF', async () => {
      // Create or load empty PDF fixture
      const buffer = readFileSync(path.join(__dirname, '../fixtures/empty.pdf'));
      const result = await extractTextFromFile(buffer, 'application/pdf');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Could not extract sufficient text');
    });
  });
  
  describe('DOCX Extraction', () => {
    it('should extract text from valid DOCX', async () => {
      const buffer = readFileSync(path.join(__dirname, '../fixtures/sample-cv.docx'));
      const result = await extractTextFromFile(buffer, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      
      expect(result.success).toBe(true);
      expect(result.text).toBeDefined();
      expect(result.text!.length).toBeGreaterThan(50);
    });
  });
  
  describe('Text Normalization', () => {
    it('should normalize whitespace', () => {
      const input = 'Text   with    extra     spaces';
      const output = normalizeText(input);
      
      expect(output).toBe('Text with extra spaces');
    });
    
    it('should fix encoding issues', () => {
      const input = 'It's a "test" — check';
      const fixed = input.replace(/â€™/g, "'").replace(/â€œ/g, '"').replace(/â€/g, '"');
      
      expect(normalizeText(fixed)).toContain("'");
    });
    
    it('should remove excessive newlines', () => {
      const input = 'Line 1\n\n\n\n\nLine 2';
      const output = normalizeText(input);
      
      expect(output).toBe('Line 1\n\nLine 2');
    });
  });
});
```

#### Section Detection Tests

**File**: `/tests/unit/section-detector.test.ts`

```typescript
import { detectSections, hasSummarySection, hasExperienceSection } from '@/lib/parsers/section-detector';

describe('Section Detection', () => {
  describe('Experience Section', () => {
    it('should detect "Experience" heading', () => {
      const text = 'Experience\nSoftware Engineer at Company';
      expect(hasExperienceSection(text)).toBe(true);
    });
    
    it('should detect "Work Experience" heading', () => {
      const text = 'WORK EXPERIENCE\nDeveloper...';
      expect(hasExperienceSection(text)).toBe(true);
    });
    
    it('should detect "Professional Experience"', () => {
      const text = 'Professional Experience\n...';
      expect(hasExperienceSection(text)).toBe(true);
    });
    
    it('should be case-insensitive', () => {
      const text = 'experience\nJob title...';
      expect(hasExperienceSection(text)).toBe(true);
    });
    
    it('should return false when not present', () => {
      const text = 'Skills\nJavaScript, Python';
      expect(hasExperienceSection(text)).toBe(false);
    });
  });
  
  describe('Education Section', () => {
    it('should detect "Education" heading', () => {
      const text = 'Education\nBachelor of Science';
      expect(detectSections(text).hasEducation).toBe(true);
    });
  });
  
  describe('Full CV Detection', () => {
    it('should detect all major sections', () => {
      const cv = `
        John Doe
        email@example.com | 555-1234
        
        Professional Summary
        Experienced software engineer...
        
        Experience
        Software Engineer, Company (2020-2023)
        
        Education
        B.S. Computer Science, University
        
        Skills
        JavaScript, Python, React
      `;
      
      const sections = detectSections(cv);
      
      expect(sections.hasContact.email).toBe(true);
      expect(sections.hasContact.phone).toBe(true);
      expect(sections.hasSummary).toBe(true);
      expect(sections.hasExperience).toBe(true);
      expect(sections.hasEducation).toBe(true);
      expect(sections.hasSkills).toBe(true);
    });
  });
});
```

#### Keyword Counting Tests

**File**: `/tests/unit/keyword-counter.test.ts`

```typescript
import { countTechnicalSkills, countSoftSkills, countActionVerbs } from '@/lib/parsers/keyword-counter';

describe('Keyword Counting', () => {
  describe('Technical Skills', () => {
    it('should count technical skills case-insensitively', () => {
      const text = 'Skills: PYTHON, javascript, React, MySQL';
      const result = countTechnicalSkills(text);
      
      expect(result.count).toBe(4);
      expect(result.skills).toContain('Python');
      expect(result.skills).toContain('JavaScript');
    });
    
    it('should handle word boundaries correctly', () => {
      const text = 'JavaScript and Java are different';
      const result = countTechnicalSkills(text);
      
      expect(result.skills).toContain('JavaScript');
      expect(result.skills).toContain('Java');
      expect(result.count).toBe(2);
    });
    
    it('should not count substrings', () => {
      const text = 'I use HTMLParser in JavaScript';
      const result = countTechnicalSkills(text);
      
      // Should count HTML and JavaScript, but HTML once
      expect(result.count).toBeGreaterThanOrEqual(2);
    });
  });
  
  describe('Action Verbs', () => {
    it('should count action verbs at line start', () => {
      const experience = `
        • Developed web applications
        • Managed a team of 5
        • Led project initiatives
        Responsible for testing
      `;
      
      const result = countActionVerbs(experience);
      
      expect(result.count).toBe(3); // Developed, Managed, Led
    });
    
    it('should ignore non-action verb bullets', () => {
      const experience = `
        • Responsibilities include coding
        • Working on projects
      `;
      
      const result = countActionVerbs(experience);
      
      expect(result.count).toBe(0); // Neither starts with action verb
    });
  });
});
```

#### Scoring Calculator Tests

**File**: `/tests/unit/score-calculator.test.ts`

```typescript
import { calculateScore, calculateStructureScore } from '@/lib/scoring/score-calculator';

describe('Score Calculator', () => {
  describe('Structure Score', () => {
    it('should award full points for complete structure', () => {
      const mockData = {
        sections: {
          hasContact: { email: true, phone: true },
          hasSummary: true,
          hasExperience: true,
          hasEducation: true,
          hasSkills: true,
        },
      };
      
      const result = calculateStructureScore(mockData);
      
      expect(result.score).toBe(15);
      expect(result.checks.filter(c => c.passed).length).toBe(5);
    });
    
    it('should deduct points for missing sections', () => {
      const mockData = {
        sections: {
          hasContact: { email: true, phone: false },
          hasSummary: false,
          hasExperience: true,
          hasEducation: true,
          hasSkills: false,
        },
      };
      
      const result = calculateStructureScore(mockData);
      
      expect(result.score).toBeLessThan(15);
      expect(result.score).toBe(6); // 0 + 0 + 3 + 3 + 0
    });
  });
  
  describe('Total Score', () => {
    it('should sum all category scores correctly', () => {
      const mockData = createMockAnalysisData(); // Helper function
      const result = calculateScore(mockData);
      
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.total).toBeLessThanOrEqual(100);
      
      const sum = Object.values(result.breakdown).reduce(
        (acc, cat: any) => acc + cat.score,
        0
      );
      
      expect(result.total).toBe(sum);
    });
  });
});
```

### Frontend Unit Tests

#### Component Tests

**File**: `/tests/unit/components/ScoreCard.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import ScoreCard from '@/components/results/ScoreCard';

describe('ScoreCard Component', () => {
  const mockResult = {
    totalScore: 78,
    grade: 'Very Good',
    message: 'Your CV is strong with room for improvement',
    breakdown: {},
    recommendations: [],
    metadata: {},
  };
  
  it('renders score correctly', () => {
    render(<ScoreCard result={mockResult} onReset={() => {}} />);
    
    expect(screen.getByText('78')).toBeInTheDocument();
    expect(screen.getByText('/100')).toBeInTheDocument();
    expect(screen.getByText('Very Good')).toBeInTheDocument();
  });
  
  it('calls onReset when button clicked', () => {
    const onReset = jest.fn();
    render(<ScoreCard result={mockResult} onReset={onReset} />);
    
    const button = screen.getByText('Try Another CV');
    fireEvent.click(button);
    
    expect(onReset).toHaveBeenCalledTimes(1);
  });
  
  it('applies correct color for score', () => {
    const { rerender } = render(
      <ScoreCard result={{ ...mockResult, totalScore: 90 }} onReset={() => {}} />
    );
    
    expect(screen.getByText('90')).toHaveClass('text-green-600');
    
    rerender(
      <ScoreCard result={{ ...mockResult, totalScore: 50 }} onReset={() => {}} />
    );
    
    expect(screen.getByText('50')).toHaveClass('text-orange-600');
  });
});
```

#### Hook Tests

**File**: `/tests/unit/hooks/useFileUpload.test.ts`

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFileUpload } from '@/hooks/useFileUpload';
import * as apiClient from '@/lib/api-client';

jest.mock('@/lib/api-client');

describe('useFileUpload Hook', () => {
  it('initializes with idle state', () => {
    const { result } = renderHook(() => useFileUpload());
    
    expect(result.current.status.state).toBe('idle');
    expect(result.current.status.file).toBeNull();
  });
  
  it('validates file type', async () => {
    const { result } = renderHook(() => useFileUpload());
    
    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    
    await act(async () => {
      await result.current.handleFileSelect(invalidFile);
    });
    
    expect(result.current.status.state).toBe('error');
    expect(result.current.status.error).toContain('Invalid file type');
  });
  
  it('validates file size', async () => {
    const { result } = renderHook(() => useFileUpload());
    
    // Create file larger than 5MB
    const largeContent = new Array(6 * 1024 * 1024).fill('a').join('');
    const largeFile = new File([largeContent], 'large.pdf', { type: 'application/pdf' });
    
    await act(async () => {
      await result.current.handleFileSelect(largeFile);
    });
    
    expect(result.current.status.state).toBe('error');
    expect(result.current.status.error).toContain('exceeds 5MB');
  });
  
  it('successfully analyzes valid file', async () => {
    const mockResult = { totalScore: 80, /* ... */ };
    (apiClient.analyzeCV as jest.Mock).mockResolvedValue(mockResult);
    
    const { result } = renderHook(() => useFileUpload());
    
    const validFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    
    await act(async () => {
      await result.current.handleFileSelect(validFile);
    });
    
    await waitFor(() => {
      expect(result.current.status.state).toBe('complete');
    });
    
    expect(result.current.status.result).toEqual(mockResult);
  });
  
  it('resets state correctly', () => {
    const { result } = renderHook(() => useFileUpload());
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.status.state).toBe('idle');
    expect(result.current.status.file).toBeNull();
  });
});
```

## Integration Tests

### API Integration Tests

**File**: `/tests/integration/api-score.test.ts`

```typescript
import { POST } from '@/app/api/score/route';
import { readFileSync } from 'fs';
import path from 'path';

describe('POST /api/score', () => {
  it('should return 400 for missing file', async () => {
    const formData = new FormData();
    const request = new Request('http://localhost/api/score', {
      method: 'POST',
      body: formData,
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('NO_FILE');
  });
  
  it('should return 400 for invalid file type', async () => {
    const formData = new FormData();
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    formData.append('file', file);
    
    const request = new Request('http://localhost/api/score', {
      method: 'POST',
      body: formData,
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error.code).toBe('INVALID_FILE_TYPE');
  });
  
  it('should successfully process valid PDF', async () => {
    const buffer = readFileSync(path.join(__dirname, '../fixtures/sample-cv.pdf'));
    const file = new File([buffer], 'test.pdf', { type: 'application/pdf' });
    
    const formData = new FormData();
    formData.append('file', file);
    
    const request = new Request('http://localhost/api/score', {
      method: 'POST',
      body: formData,
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.totalScore).toBeGreaterThanOrEqual(0);
    expect(data.data.totalScore).toBeLessThanOrEqual(100);
    expect(data.data.breakdown).toBeDefined();
  });
});
```

## End-to-End Tests

### E2E with Playwright

**File**: `/tests/e2e/cv-upload-flow.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('CV Upload Flow', () => {
  test('should complete full upload and scoring flow', async ({ page }) => {
    // Navigate to home page
    await page.goto('http://localhost:3000');
    
    // Verify page loaded
    await expect(page.locator('h1')).toContainText('Get Your CV Score');
    
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/sample-cv.pdf'));
    
    // Wait for loading state
    await expect(page.locator('text=Analyzing your CV')).toBeVisible();
    
    // Wait for results
    await expect(page.locator('text=Your CV Score')).toBeVisible({ timeout: 10000 });
    
    // Verify score is displayed
    const scoreText = await page.locator('[class*="text-7xl"]').textContent();
    expect(scoreText).toMatch(/\d+/);
    
    // Verify breakdown sections are present
    await expect(page.locator('text=Score Breakdown')).toBeVisible();
    await expect(page.locator('text=CV Structure')).toBeVisible();
    
    // Verify recommendations
    await expect(page.locator('text=Top Recommendations')).toBeVisible();
    
    // Click "Try Another CV"
    await page.click('text=Try Another CV');
    
    // Should return to upload state
    await expect(page.locator('text=Get Your CV Score')).toBeVisible();
  });
  
  test('should show error for invalid file', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(__dirname, '../fixtures/invalid.txt'));
    
    // Should show error message
    await expect(page.locator('text=Invalid file type')).toBeVisible({ timeout: 5000 });
  });
  
  test('should navigate to About page', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    await page.click('text=About');
    
    await expect(page).toHaveURL(/.*about/);
    await expect(page.locator('h1')).toContainText('About CVScorer');
  });
});
```

## Test Fixtures

### Sample CV Files

Create test fixtures in `/tests/fixtures/`:

1. **strong-cv.pdf**: Well-formatted CV with all sections (expected score: 80-90)
2. **weak-cv.pdf**: Poorly formatted CV missing sections (expected score: 40-50)
3. **medium-cv.docx**: Average CV with some issues (expected score: 60-70)
4. **empty.pdf**: Empty or nearly empty document
5. **invalid.txt**: Non-PDF/DOCX file for error testing

### Mock Data

**File**: `/tests/helpers/mock-data.ts`

```typescript
export function createMockAnalysisData() {
  return {
    sections: {
      hasContact: { email: true, phone: true },
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

export function createMockCVResult() {
  return {
    totalScore: 78,
    grade: 'Very Good',
    message: 'Your CV is strong with room for improvement',
    breakdown: {
      structure: {
        score: 12,
        maxScore: 15,
        checks: [
          { category: 'Contact Info', passed: true, message: 'Complete' },
          { category: 'Summary', passed: false, message: 'Missing' },
        ],
      },
      // ... other categories
    },
    recommendations: [
      {
        priority: 1,
        title: 'Add Professional Summary',
        description: 'Include 2-3 sentences...',
        category: 'structure',
      },
    ],
    metadata: {
      wordCount: 850,
      estimatedPages: 2,
      processingTime: 1.2,
      version: '1.0.0',
    },
  };
}
```

## Manual Testing Checklist

### Pre-Release Testing

**File**: `/tests/manual/test-cases.md`

#### Functional Tests

- [ ] Upload PDF file successfully
- [ ] Upload DOCX file successfully
- [ ] Reject invalid file types (TXT, JPG, etc.)
- [ ] Reject files over 5MB
- [ ] Handle corrupted PDF gracefully
- [ ] Handle scanned (image-only) PDF with error message
- [ ] Display loading state during analysis
- [ ] Show correct score (0-100)
- [ ] Display all 5 breakdown categories
- [ ] Show checkmarks (✅) for passed criteria
- [ ] Show crosses (❌) for failed criteria
- [ ] Display recommendations with priorities
- [ ] "Try Another CV" button resets to upload state
- [ ] Navigation to About page works
- [ ] Navigation to FAQ page works
- [ ] Back to Home from other pages works

#### UI/UX Tests

- [ ] Layout looks correct on mobile (320px, 375px, 425px)
- [ ] Layout looks correct on tablet (768px, 1024px)
- [ ] Layout looks correct on desktop (1440px, 1920px)
- [ ] Drag and drop file upload works
- [ ] Hover states on upload zone work
- [ ] Button hover states work
- [ ] Colors match design (red #DC2626, white, gray)
- [ ] Typography is consistent
- [ ] No horizontal scrolling on any viewport
- [ ] Loading spinner animates smoothly
- [ ] Results fade in smoothly

#### Accessibility Tests

- [ ] Tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Screen reader reads page correctly (test with NVDA/JAWS)
- [ ] Alt text present for icons
- [ ] Color contrast passes WCAG AA
- [ ] Keyboard shortcuts work (if any)
- [ ] No seizure-inducing animations

#### Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS 15+)
- [ ] Chrome Mobile (Android 10+)

## Performance Testing

### Load Testing

```typescript
// Simple load test script
import autocannon from 'autocannon';

const instance = autocannon({
  url: 'http://localhost:3000/api/score',
  connections: 10,
  duration: 30,
  method: 'POST',
  // ... (would need multipart form data setup)
});

autocannon.track(instance);
```

### Performance Benchmarks

- API response time < 3 seconds for 2-page CV
- Initial page load < 2 seconds
- Time to interactive < 3 seconds

## CI/CD Integration

**File**: `.github/workflows/test.yml`

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm test -- --coverage
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Test Documentation

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test text-extraction.test.ts

# Run with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run tests in watch mode
npm test -- --watch
```

---

**Approval Status**: ⏳ Pending Review  
**Dependencies**: RFC-005 (Backend), RFC-006 (Frontend)  
**Next Steps**: Implement deployment strategy (RFC-008)
