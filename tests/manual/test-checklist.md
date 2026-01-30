# Manual Testing Checklist

This checklist should be completed before each release.

## Pre-Release Testing

### Functional Tests

#### File Upload
- [ ] Upload PDF file successfully
- [ ] Upload DOCX file successfully
- [ ] Reject invalid file types (TXT, JPG, PNG, etc.)
- [ ] Reject files over 5MB
- [ ] Handle corrupted PDF gracefully with error message
- [ ] Handle scanned (image-only) PDF with error message
- [ ] Handle empty PDF with error message
- [ ] Drag and drop file works
- [ ] Click to browse file works

#### Analysis & Results
- [ ] Display loading state during analysis
- [ ] Show correct score (0-100)
- [ ] Display all 5 breakdown categories
- [ ] Show checkmarks (✅) for passed criteria
- [ ] Show crosses (❌) for failed criteria
- [ ] Display recommendations with priorities
- [ ] Show impact badges (high/medium/low) correctly colored
- [ ] Display grade (Excellent/Very Good/Good/etc.)
- [ ] Display personalized message
- [ ] Show processing time in metadata

#### User Actions
- [ ] "Try Another CV" button resets to upload state
- [ ] "Print Results" button works
- [ ] Can upload multiple CVs in sequence
- [ ] Results scroll smoothly
- [ ] Animations work smoothly

#### Navigation
- [ ] Navigation to About page works
- [ ] Navigation to FAQ page works
- [ ] Navigation to Privacy page works
- [ ] Back to Home from other pages works
- [ ] All internal links work
- [ ] External links (GitHub) open in new tab

### UI/UX Tests

#### Responsive Design
- [ ] Layout correct on mobile 320px
- [ ] Layout correct on mobile 375px
- [ ] Layout correct on mobile 425px
- [ ] Layout correct on tablet 768px
- [ ] Layout correct on tablet 1024px
- [ ] Layout correct on desktop 1440px
- [ ] Layout correct on desktop 1920px
- [ ] No horizontal scrolling on any viewport
- [ ] Text is readable at all sizes
- [ ] Buttons are tappable on mobile (44x44px minimum)

#### Interactions
- [ ] Drag and drop file upload works
- [ ] Hover states on upload zone work
- [ ] Button hover states work
- [ ] Link hover states work (underline)
- [ ] Focus states visible on keyboard navigation
- [ ] Loading spinner animates smoothly
- [ ] Results fade in smoothly
- [ ] Score animation counts up correctly
- [ ] Confetti shows for scores 85+

#### Visual Design
- [ ] Colors match design system (red #DC2626)
- [ ] Typography is consistent
- [ ] Spacing is consistent
- [ ] Shadows are appropriate
- [ ] Border radius is consistent
- [ ] Red accent color used properly
- [ ] White backgrounds clean
- [ ] Gray text readable

### Accessibility Tests

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible and clear
- [ ] Enter key activates buttons
- [ ] Space key activates buttons
- [ ] Escape key closes modals (if any)
- [ ] No keyboard traps

#### Screen Reader
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (Mac/iOS)
- [ ] Test with TalkBack (Android)
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Buttons have descriptive text
- [ ] Landmarks used correctly (nav, main, footer)
- [ ] Heading hierarchy correct (h1 → h2 → h3)

#### WCAG 2.1 AA Compliance
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Color contrast ratio ≥ 3:1 for UI elements
- [ ] Text resizable up to 200%
- [ ] No content lost at 200% zoom
- [ ] No information conveyed by color alone
- [ ] No seizure-inducing animations

### Browser Compatibility

#### Desktop Browsers
- [ ] Chrome (latest) on Windows
- [ ] Chrome (latest) on Mac
- [ ] Firefox (latest) on Windows
- [ ] Firefox (latest) on Mac
- [ ] Safari (latest) on Mac
- [ ] Edge (latest) on Windows

#### Mobile Browsers
- [ ] Chrome Mobile on Android 10+
- [ ] Chrome Mobile on Android 13+
- [ ] Samsung Internet on Android
- [ ] Safari on iOS 15+
- [ ] Safari on iOS 17+

### Performance Tests

#### Page Load
- [ ] Initial page load < 2 seconds
- [ ] Time to interactive < 3 seconds
- [ ] First Contentful Paint < 1.5 seconds
- [ ] Largest Contentful Paint < 2.5 seconds

#### API Response
- [ ] API response time < 3 seconds for 2-page CV
- [ ] API response time < 5 seconds for 5-page CV
- [ ] No memory leaks on multiple uploads
- [ ] File upload progress shows correctly

#### Lighthouse Scores
- [ ] Performance > 90
- [ ] Accessibility > 95
- [ ] Best Practices > 90
- [ ] SEO > 90

### Security Tests

#### Input Validation
- [ ] Path traversal attempts blocked (../../etc/passwd)
- [ ] Large files rejected (>5MB)
- [ ] Invalid MIME types rejected
- [ ] Malformed filenames handled
- [ ] XSS attempts in filename sanitized

#### Rate Limiting
- [ ] Rate limit enforced (10 requests per hour)
- [ ] Rate limit message clear
- [ ] Rate limit resets correctly

### Error Handling

#### Network Errors
- [ ] Offline mode shows error message
- [ ] Slow network shows loading state
- [ ] Failed upload shows retry button
- [ ] Network error message is clear

#### Server Errors
- [ ] 500 errors handled gracefully
- [ ] Error messages are user-friendly
- [ ] Technical details hidden from users
- [ ] Errors logged for debugging

### Content Tests

#### About Page
- [ ] "How It Works" section complete
- [ ] "Why Rule-Based" section complete
- [ ] "Privacy First" section complete
- [ ] All content accurate and clear

#### FAQ Page
- [ ] All questions answered
- [ ] Answers are clear and helpful
- [ ] No typos or grammar errors
- [ ] Technical terms explained

#### Privacy Policy
- [ ] Policy complete and accurate
- [ ] Data handling explained
- [ ] User rights explained
- [ ] Contact information provided

### Edge Cases

- [ ] Test with CV containing special characters
- [ ] Test with CV in non-English language
- [ ] Test with very short CV (< 200 words)
- [ ] Test with very long CV (> 2000 words)
- [ ] Test with CV containing only images
- [ ] Test with password-protected PDF
- [ ] Test with corrupted file
- [ ] Test with zero-byte file

## Release Checklist

Before deploying:

- [ ] All functional tests passed
- [ ] All UI/UX tests passed
- [ ] All accessibility tests passed
- [ ] All browser compatibility tests passed
- [ ] Performance benchmarks met
- [ ] Security checks passed
- [ ] Content proofread
- [ ] Unit tests passing (npm test)
- [ ] E2E tests passing (npm run test:e2e)
- [ ] Build succeeds (npm run build)
- [ ] No console errors in production build

## Test Results

**Tester**: ___________________  
**Date**: ___________________  
**Version**: ___________________  
**Environment**: ___________________  

**Overall Status**: ⬜ Pass ⬜ Fail  

**Notes**:
___________________________________________________
___________________________________________________
___________________________________________________
