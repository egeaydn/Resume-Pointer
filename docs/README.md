# CVScorer Project Documentation

## Overview

CVScorer is a rule-based CV (resume) scoring web application that provides instant feedback to job seekers. Users upload their CV in PDF or DOCX format and receive a comprehensive evaluation with a 0-100 score, highlighting strengths (✅) and weaknesses (❌) with actionable improvement suggestions.

## Key Features

- **Rule-Based Scoring**: No AI/ML - transparent, deterministic evaluation
- **Comprehensive Analysis**: 5 scoring categories totaling 100 points
- **Instant Feedback**: Real-time processing with detailed suggestions
- **Modern UI**: Next.js SPA with clean red and white theme
- **Privacy-First**: No data storage, all processing in-memory

## Project Goals

1. Help job seekers improve their CVs before submitting applications
2. Simulate ATS (Applicant Tracking System) screening criteria
3. Provide constructive, actionable feedback
4. Maintain transparency in scoring methodology
5. Ensure user privacy and data security

## Technology Stack

- **Frontend**: Next.js (React), TypeScript
- **Backend**: Next.js API Routes (Node.js)
- **Libraries**: pdf-parse (PDF extraction), mammoth (DOCX parsing)
- **Deployment**: Vercel (serverless)
- **Styling**: CSS Modules / Tailwind CSS (red & white theme)

## Documentation Structure

This documentation follows the RFC (Request for Comments) format to ensure thorough planning and clear communication of design decisions.

### RFCs (Request for Comments)

- [RFC-001: Project Overview & Requirements](./rfcs/RFC-001-project-overview.md)
- [RFC-002: Scoring Rubric & Criteria](./rfcs/RFC-002-scoring-rubric.md)
- [RFC-003: Text Parsing & Detection Rules](./rfcs/RFC-003-text-parsing-rules.md)
- [RFC-004: UI/UX Design Specification](./rfcs/RFC-004-ui-ux-design.md)
- [RFC-005: Backend Architecture](./rfcs/RFC-005-backend-architecture.md)
- [RFC-006: Frontend Implementation](./rfcs/RFC-006-frontend-implementation.md)
- [RFC-007: Testing Strategy](./rfcs/RFC-007-testing-strategy.md)
- [RFC-008: Deployment & Operations](./rfcs/RFC-008-deployment-operations.md)

## Development Phases

### Phase 1: Foundation (Week 1-2)
- ✅ Project setup and configuration
- ✅ Documentation structure
- 🔲 Core scoring rubric implementation
- 🔲 Basic file upload and parsing

### Phase 2: Core Features (Week 3-4)
- 🔲 Regex and keyword detection rules
- 🔲 Scoring engine implementation
- 🔲 API endpoints for file processing
- 🔲 Results calculation logic

### Phase 3: UI Development (Week 5-6)
- 🔲 Upload interface
- 🔲 Results display components
- 🔲 Score breakdown visualization
- 🔲 Suggestion system

### Phase 4: Polish & Testing (Week 7-8)
- 🔲 Comprehensive testing with sample CVs
- 🔲 UI/UX refinements
- 🔲 Performance optimization
- 🔲 Security hardening

### Phase 5: Deployment (Week 9)
- 🔲 Production deployment
- 🔲 Monitoring setup
- 🔲 Documentation finalization
- 🔲 User feedback collection

## Quick Start Guide

### Prerequisites
- Node.js 18+ and npm
- Git

### Local Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd resume-pointer

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm test -- scoring
```

## Project Principles

1. **Transparency**: All scoring rules are documented and deterministic
2. **User Privacy**: No data storage, no tracking, no analytics
3. **Accessibility**: WCAG 2.1 AA compliance
4. **Performance**: Results within 2-3 seconds
5. **Maintainability**: Clean code, comprehensive tests, clear documentation

## Contributing

For contribution guidelines, see each RFC document's "Open Questions" and "Future Considerations" sections.

## Contact & Support

For questions or issues, please refer to the FAQ page in the application or open an issue in the repository.

---

**Last Updated**: January 28, 2026
**Version**: 1.0.0
**Status**: In Development
