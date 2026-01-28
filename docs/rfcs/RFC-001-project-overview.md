# RFC-001: Project Overview & Requirements

**Status**: Draft  
**Author**: Development Team  
**Created**: January 28, 2026  
**Last Updated**: January 28, 2026

## Abstract

This RFC defines the overall vision, scope, and requirements for the CVScorer application - a rule-based CV scoring web application that provides instant, actionable feedback to job seekers.

## Motivation

Job seekers often struggle to optimize their CVs for Applicant Tracking Systems (ATS) and recruiter expectations. Many existing tools either:
- Use opaque AI models that don't explain their scoring
- Require payment for detailed feedback
- Store user data raising privacy concerns
- Don't provide actionable improvement suggestions

CVScorer aims to solve these problems with a transparent, privacy-first, rule-based approach.

## Goals

### Primary Goals
1. **Instant Evaluation**: Provide CV scoring within 2-3 seconds of upload
2. **Transparent Scoring**: Use deterministic rules that users can understand
3. **Actionable Feedback**: Give specific, implementable suggestions for improvement
4. **Privacy Protection**: Process files in-memory without storage
5. **Accessibility**: Free tool available to all job seekers

### Secondary Goals
1. Educate users about CV best practices
2. Simulate common ATS screening criteria
3. Create a portfolio-worthy project demonstrating full-stack skills
4. Build a maintainable, extensible codebase for future enhancements

## Non-Goals

1. **No AI/ML Integration**: Deliberately using rule-based approach for transparency
2. **No User Accounts**: No registration, login, or user data persistence
3. **No Job Matching**: Not connecting users to jobs or employers
4. **No Multi-Language Support**: Initially English CVs only
5. **No Resume Builder**: Only evaluation, not creation
6. **No OCR for Scanned PDFs**: Text-based PDFs only

## Target Audience

### Primary Users
- **Job Seekers**: Individuals preparing CVs for job applications
- **Recent Graduates**: Students entering the job market
- **Career Changers**: Professionals updating CVs after long periods

### Secondary Users
- **Career Counselors**: Advisors helping clients improve CVs
- **Recruiters**: (Informational) Understanding what the tool checks

## Success Criteria

### User Experience Metrics
- Upload to results in < 3 seconds for typical CV (2 pages)
- 90%+ of users understand their score breakdown
- Users can identify at least 3 actionable improvements from feedback

### Technical Metrics
- 99% uptime for production deployment
- Support PDF and DOCX formats with 95%+ text extraction success rate
- Handle files up to 5MB without performance degradation

### Business Metrics
- Positive user feedback (if collecting testimonials)
- Showcase project in portfolio with clear documentation
- Potential for future monetization/enhancement

## Constraints

### Technical Constraints
1. **No AI/ML**: Must use regex and keyword matching only
2. **Serverless Deployment**: Must work on Vercel serverless functions
3. **Browser Compatibility**: Support last 2 versions of major browsers
4. **File Size Limit**: Maximum 5MB per upload

### Resource Constraints
1. **Solo Development**: Single developer with limited time
2. **Zero Budget**: Free tools and services only
3. **Timeline**: 8-9 weeks to MVP

### Regulatory Constraints
1. **GDPR Compliance**: No data storage/tracking (inherently compliant)
2. **Accessibility**: WCAG 2.1 AA compliance target

## Scope

### In Scope - MVP (Version 1.0)

#### File Processing
- PDF text extraction (text-based PDFs only)
- DOCX text extraction
- File validation (type, size)
- Error handling for corrupted files

#### Scoring System
- 5 scoring categories (100 points total):
  - CV Structure & Sections (15 pts)
  - Technical Skills (20 pts)
  - Work Experience Content (30 pts)
  - Education (15 pts)
  - Formatting & Readability (20 pts)
- Deterministic rule-based evaluation
- Score breakdown by category

#### User Interface
- Single-page application (SPA)
- File upload (drag-and-drop or click)
- Results display with score visualization
- Feedback with ✅/❌ indicators
- Improvement suggestions
- About page
- FAQ page

#### Design
- Red and white color theme
- Minimalist, clean design
- Responsive (mobile, tablet, desktop)
- Accessible (keyboard navigation, screen readers)

### Out of Scope - Future Versions

#### Version 1.1 (Potential)
- Multiple language support
- Industry-specific scoring profiles (tech, healthcare, finance)
- Downloadable PDF report of results
- Side-by-side comparison of two CVs

#### Version 2.0 (Potential)
- Optional AI-enhanced feedback
- Grammar and spell checking
- Resume template suggestions
- Job description matching (paste JD, get tailored feedback)

## High-Level Architecture

```
┌─────────────┐
│   Browser   │
│  (React/    │
│   Next.js)  │
└──────┬──────┘
       │ HTTP (File Upload)
       ▼
┌─────────────────────────────┐
│   Next.js API Routes        │
│   (Serverless Functions)    │
├─────────────────────────────┤
│  • /api/score               │
│    - File validation        │
│    - Text extraction        │
│    - Scoring engine         │
│    - Result formatting      │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│   Processing Modules        │
├─────────────────────────────┤
│  • PDF Parser (pdf-parse)   │
│  • DOCX Parser (mammoth)    │
│  • Regex Engine             │
│  • Keyword Matcher          │
│  • Scoring Calculator       │
└─────────────────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: Next.js 14+ (React 18+)
- **Language**: TypeScript
- **Styling**: Tailwind CSS or CSS Modules
- **File Upload**: react-dropzone (optional) or native input

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes
- **PDF Parsing**: pdf-parse
- **DOCX Parsing**: mammoth
- **Text Processing**: Native regex, string manipulation

#### Deployment
- **Hosting**: Vercel
- **CI/CD**: Vercel Git integration
- **Domain**: Custom domain or Vercel subdomain

## Functional Requirements

### FR-1: File Upload
- **FR-1.1**: User can upload PDF or DOCX file via drag-and-drop
- **FR-1.2**: User can upload file via traditional file picker
- **FR-1.3**: System validates file type and size before processing
- **FR-1.4**: System displays clear error messages for invalid files

### FR-2: Text Extraction
- **FR-2.1**: System extracts text from PDF files
- **FR-2.2**: System extracts text from DOCX files
- **FR-2.3**: System handles extraction errors gracefully
- **FR-2.4**: System normalizes extracted text (whitespace, encoding)

### FR-3: CV Analysis
- **FR-3.1**: System detects presence of key CV sections
- **FR-3.2**: System counts and evaluates technical skills
- **FR-3.3**: System analyzes work experience content
- **FR-3.4**: System validates education section
- **FR-3.5**: System evaluates formatting and readability

### FR-4: Scoring
- **FR-4.1**: System calculates score for each category
- **FR-4.2**: System computes total score (0-100)
- **FR-4.3**: System generates feedback messages
- **FR-4.4**: System identifies strengths (✅) and weaknesses (❌)

### FR-5: Results Display
- **FR-5.1**: System displays total score prominently
- **FR-5.2**: System shows score breakdown by category
- **FR-5.3**: System lists all feedback with icons
- **FR-5.4**: System provides actionable improvement suggestions
- **FR-5.5**: User can upload another CV without page reload

### FR-6: Static Pages
- **FR-6.1**: About page explains tool purpose and methodology
- **FR-6.2**: FAQ page answers common questions
- **FR-6.3**: Navigation between pages is seamless

## Non-Functional Requirements

### NFR-1: Performance
- **NFR-1.1**: File processing completes within 3 seconds for 2-page CV
- **NFR-1.2**: Initial page load < 2 seconds
- **NFR-1.3**: API response time < 500ms for text extraction

### NFR-2: Usability
- **NFR-2.1**: No learning curve - intuitive interface
- **NFR-2.2**: Results understandable without technical knowledge
- **NFR-2.3**: Mobile-friendly responsive design

### NFR-3: Reliability
- **NFR-3.1**: 99% successful processing rate for valid files
- **NFR-3.2**: Graceful error handling for all edge cases
- **NFR-3.3**: No data loss during processing

### NFR-4: Security
- **NFR-4.1**: Files processed in-memory only
- **NFR-4.2**: No file persistence on server
- **NFR-4.3**: No sensitive data logging
- **NFR-4.4**: HTTPS only (enforced by Vercel)

### NFR-5: Privacy
- **NFR-5.1**: No user tracking or analytics (or minimal, anonymous)
- **NFR-5.2**: No cookies except essential ones
- **NFR-5.3**: Clear privacy policy stating no data storage

### NFR-6: Accessibility
- **NFR-6.1**: WCAG 2.1 AA compliance
- **NFR-6.2**: Keyboard navigation support
- **NFR-6.3**: Screen reader compatibility
- **NFR-6.4**: Sufficient color contrast (red/white theme)

### NFR-7: Maintainability
- **NFR-7.1**: Code follows consistent style guide
- **NFR-7.2**: Comprehensive documentation (this RFC set)
- **NFR-7.3**: Modular architecture for easy updates
- **NFR-7.4**: Unit test coverage > 80%

## Assumptions

1. Users have modern browsers (Chrome, Firefox, Safari, Edge)
2. Users upload text-based PDFs, not scanned images
3. CVs are primarily in English
4. Users have basic understanding of CV/resume concepts
5. Internet connection is stable during upload/processing
6. File sizes are reasonable (< 5MB)

## Dependencies

### Technical Dependencies
- Node.js ecosystem availability
- Next.js framework stability
- Third-party parsing libraries (pdf-parse, mammoth)
- Vercel platform availability

### External Dependencies
- Users have CVs ready to upload
- Users understand basic CV terminology
- Users act on feedback to improve CVs

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| PDF extraction fails for complex layouts | High | Medium | Provide clear error message; suggest text-based PDF export |
| Users don't understand scoring criteria | Medium | Medium | Detailed FAQ; explanations in About page; clear labels |
| Rule-based approach misses nuances | Medium | High | Acknowledge limitations; position as "first pass" tool |
| Performance issues with large files | Medium | Low | Implement file size limits; optimize parsing |
| Security vulnerability in parsing libs | High | Low | Keep dependencies updated; use well-maintained libraries |
| Users expect AI-level analysis | Low | Medium | Clear messaging that it's rule-based; explain benefits |

## Open Questions

1. Should we include a sample CV download for testing?
2. What analytics (if any) should we collect anonymously?
3. Should we add a rating/feedback mechanism for the tool itself?
4. How to handle multi-column CV layouts that PDF parsers struggle with?
5. Should we support additional formats (e.g., TXT, RTF)?

## Success Metrics & KPIs

### Development Phase
- All RFCs completed and approved
- Test coverage > 80%
- Zero critical bugs in production

### Launch Phase
- Successful deployment to Vercel
- < 1% error rate for valid file uploads
- Positive initial user feedback (from beta testers)

### Post-Launch
- Portfolio piece demonstrates full-stack capabilities
- Code serves as reference for future projects
- Potential for enhancements based on user needs

## References

1. Resume best practices (industry sources)
2. ATS screening criteria
3. Next.js documentation
4. WCAG 2.1 accessibility guidelines

## Appendices

### Appendix A: Glossary

- **ATS**: Applicant Tracking System - software used by employers to screen resumes
- **CV**: Curriculum Vitae - document summarizing qualifications and experience
- **SPA**: Single-Page Application - web app that updates content dynamically
- **MVP**: Minimum Viable Product - version with core features only

### Appendix B: Related Documents

- [RFC-002: Scoring Rubric & Criteria](./RFC-002-scoring-rubric.md)
- [RFC-003: Text Parsing & Detection Rules](./RFC-003-text-parsing-rules.md)
- [RFC-004: UI/UX Design Specification](./RFC-004-ui-ux-design.md)

---

**Approval Status**: ⏳ Pending Review  
**Next Steps**: Review and approve before proceeding to detailed design RFCs
