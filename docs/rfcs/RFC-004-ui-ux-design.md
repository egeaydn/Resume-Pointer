# RFC-004: UI/UX Design Specification

**Status**: Draft  
**Author**: Development Team  
**Created**: January 28, 2026  
**Last Updated**: January 28, 2026

## Abstract

This RFC defines the complete user interface and user experience design for the CVScorer application, including wireframes, component structure, design system, user flows, and accessibility requirements.

## Design Philosophy

### Core Principles

1. **Simplicity**: Single-page workflow with minimal friction
2. **Clarity**: Visual hierarchy that guides user attention
3. **Transparency**: Make scoring logic visible and understandable
4. **Feedback-Oriented**: Emphasize actionable improvements over criticism
5. **Professional**: Clean, trustworthy aesthetic suitable for job-seekers

### Design System Overview

- **Primary Color**: Red (#DC2626 or custom brand red)
- **Secondary Color**: White (#FFFFFF)
- **Accent**: Dark Gray (#1F2937) for text
- **Neutral**: Light Gray (#F3F4F6) for backgrounds
- **Success**: Green (#10B981) for checkmarks
- **Error**: Darker Red (#B91C1C) for issues

## Site Structure

```
┌─────────────────────────────────────┐
│           Navigation Bar            │ (Header)
│  [Logo] CVScorer    About | FAQ    │
├─────────────────────────────────────┤
│                                     │
│        Main Content Area            │
│                                     │
│  - Home (Upload & Results)          │
│  - About Page                       │
│  - FAQ Page                         │
│                                     │
├─────────────────────────────────────┤
│             Footer                  │
│  © 2026 | Privacy | GitHub         │
└─────────────────────────────────────┘
```

## Page Designs

### Home Page (Main Interface)

#### Initial State (Pre-Upload)

```
╔═══════════════════════════════════════════════════╗
║  [Logo] CVScorer         About | FAQ             ║ (Red bar)
╠═══════════════════════════════════════════════════╣
║                                                   ║
║              Get Your CV Score                    ║ (Large heading)
║       Upload your resume for instant feedback     ║ (Subheading)
║                                                   ║
║   ┌─────────────────────────────────────────┐   ║
║   │        📄                               │   ║
║   │   Drop your CV here                     │   ║ (Dashed border)
║   │   or click to upload                    │   ║
║   │                                         │   ║
║   │   Supports: PDF, DOCX (Max 5MB)        │   ║
║   └─────────────────────────────────────────┘   ║
║                                                   ║
║   ✓ Instant analysis   ✓ Privacy-first           ║
║   ✓ No sign-up needed  ✓ 100% free              ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

**Component Breakdown**:

1. **Hero Section**
   - H1: "Get Your CV Score"
   - Subtitle: "Upload your resume for instant feedback"
   - Centered layout, generous padding

2. **Upload Zone**
   - Drag-and-drop area (400px × 250px)
   - File input (hidden, triggered by click)
   - Icon: Document icon (📄 or custom SVG)
   - Instructions: "Drop your CV here or click to upload"
   - Format info: "Supports: PDF, DOCX (Max 5MB)"
   - Styling: Dashed border, light gray background, hover effect

3. **Feature Highlights** (below upload)
   - 4 key benefits in a row:
     - ✓ Instant analysis
     - ✓ Privacy-first
     - ✓ No sign-up needed
     - ✓ 100% free
   - Small checkmark icons, light text

#### Loading State

```
╔═══════════════════════════════════════════════════╗
║  [Logo] CVScorer         About | FAQ             ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║   ┌─────────────────────────────────────────┐   ║
║   │        ⏳                               │   ║
║   │   Analyzing your CV...                  │   ║
║   │   [████████████░░░░░░░░░] 75%          │   ║ (Progress bar)
║   └─────────────────────────────────────────┘   ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

**Loading Component**:
- Spinner or progress bar
- Message: "Analyzing your CV..."
- Estimated time: "This usually takes 2-3 seconds"
- Optional: Fun facts about CVs while loading

#### Results State

```
╔═══════════════════════════════════════════════════╗
║  [Logo] CVScorer         About | FAQ             ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║              Your CV Score                        ║
║                                                   ║
║              🏆  78/100                           ║ (Large, red)
║            Very Good                              ║
║    Your CV is strong with room for improvement    ║
║                                                   ║
║   [Try Another CV]                               ║ (Button)
║                                                   ║
║ ┌─────────────────────────────────────────────┐ ║
║ │  Score Breakdown                            │ ║
║ ├─────────────────────────────────────────────┤ ║
║ │  CV Structure & Sections        12/15      │ ║
║ │  ✅ Contact, Experience, Education, Skills  │ ║
║ │  ❌ Missing: Professional Summary           │ ║
║ ├─────────────────────────────────────────────┤ ║
║ │  Technical Skills               15/20      │ ║
║ │  ✅ Good variety (8 skills found)           │ ║
║ │  ❌ Add more domain-specific keywords       │ ║
║ ├─────────────────────────────────────────────┤ ║
║ │  Work Experience Content        22/30      │ ║
║ │  ✅ Action verbs used                       │ ║
║ │  ✅ Quantified achievements present         │ ║
║ │  ❌ Missing: Bullet points                  │ ║
║ ├─────────────────────────────────────────────┤ ║
║ │  Education                      15/15      │ ║
║ │  ✅ Complete education section              │ ║
║ ├─────────────────────────────────────────────┤ ║
║ │  Formatting & Readability       14/20      │ ║
║ │  ✅ Appropriate length (2 pages)            │ ║
║ │  ❌ Dense text; needs more white space      │ ║
║ └─────────────────────────────────────────────┘ ║
║                                                   ║
║ ┌─────────────────────────────────────────────┐ ║
║ │  💡 Top Recommendations                     │ ║
║ ├─────────────────────────────────────────────┤ ║
║ │  1. Add a Professional Summary              │ ║
║ │     Include 2-3 sentences at the top        │ ║
║ │     highlighting your key strengths.        │ ║
║ │                                             │ ║
║ │  2. Use Bullet Points in Experience         │ ║
║ │     Format job descriptions as bullet       │ ║
║ │     lists for better readability.           │ ║
║ │                                             │ ║
║ │  3. Add More Technical Keywords             │ ║
║ │     Include specific tools and technologies │ ║
║ │     relevant to your field.                 │ ║
║ └─────────────────────────────────────────────┘ ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

**Results Components**:

1. **Score Card** (Top)
   - Trophy icon 🏆
   - Large score display: "78/100" (in red, 48px font)
   - Grade: "Very Good" (text based on score range)
   - One-line summary: "Your CV is strong with room for improvement"
   - "Try Another CV" button (red background, white text)

2. **Score Breakdown Card**
   - Title: "Score Breakdown"
   - 5 sections, each with:
     - Category name and score (e.g., "CV Structure & Sections 12/15")
     - Visual progress bar (optional)
     - List of checks (✅) and crosses (❌) with brief labels
   - Styling: White card with light border, sections separated by dividers

3. **Recommendations Card**
   - Title: "💡 Top Recommendations"
   - Numbered list of 3-5 actionable suggestions
   - Each suggestion has:
     - Bold title (what to do)
     - Description (why/how)
   - Styling: Similar card style, light yellow/cream background for emphasis

### About Page

```
╔═══════════════════════════════════════════════════╗
║  [Logo] CVScorer         About | FAQ             ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║              About CVScorer                       ║
║                                                   ║
║   CVScorer is a free, rule-based resume          ║
║   analysis tool that helps job seekers improve   ║
║   their CVs before applying.                     ║
║                                                   ║
║   How It Works                                   ║
║   • Upload your CV (PDF or DOCX)                 ║
║   • Instant analysis using proven criteria       ║
║   • Get a 0-100 score with detailed feedback     ║
║   • Make improvements and re-test                ║
║                                                   ║
║   Why Rule-Based?                                ║
║   We use transparent, deterministic rules        ║
║   instead of AI to ensure consistency and        ║
║   explainability. You'll always understand       ║
║   exactly why you got your score.                ║
║                                                   ║
║   Privacy                                        ║
║   Your CV is processed in-memory and never       ║
║   stored. We don't track or save any of your     ║
║   personal information.                          ║
║                                                   ║
║   Built as a portfolio project to demonstrate    ║
║   full-stack development skills.                 ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

**Content Structure**:
- H1: "About CVScorer"
- 4-5 sections with H2 subheadings
- Body text: 16px, readable line-height (1.6-1.8)
- Max width: 700px (centered)
- Generous padding between sections

### FAQ Page

```
╔═══════════════════════════════════════════════════╗
║  [Logo] CVScorer         About | FAQ             ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║         Frequently Asked Questions                ║
║                                                   ║
║   ▼ How does the scoring work?                   ║
║     CVs are scored across 5 categories:          ║
║     Structure, Skills, Experience, Education,    ║
║     and Formatting. Each has specific criteria.  ║
║                                                   ║
║   ▼ Is my data saved?                            ║
║     No. Your CV is processed in-memory and       ║
║     immediately discarded after analysis.        ║
║                                                   ║
║   ▼ Why no AI?                                   ║
║     Rule-based scoring is transparent and        ║
║     consistent. You can trust the results.       ║
║                                                   ║
║   ▼ What file formats are supported?             ║
║     PDF (text-based) and DOCX files up to 5MB.   ║
║                                                   ║
║   ▼ Can I score multiple CVs?                    ║
║     Yes! Upload as many as you like. No limits.  ║
║                                                   ║
║   ▼ Who is this tool for?                        ║
║     Job seekers, students, career changers—      ║
║     anyone preparing a CV for applications.      ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

**FAQ Component**:
- Accordion or expandable sections (optional)
- Or simple list with visible Q&A
- Each Q in bold, A in regular text
- Icon: ▼ or ► for expand/collapse (if accordion)

## Component Specifications

### Header / Navigation

```jsx
<header className="bg-red-600 text-white shadow-md">
  <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold">CVScorer</span>
    </div>
    <div className="flex gap-6">
      <Link href="/" className="hover:underline">Home</Link>
      <Link href="/about" className="hover:underline">About</Link>
      <Link href="/faq" className="hover:underline">FAQ</Link>
    </div>
  </nav>
</header>
```

**Specifications**:
- Height: 60-70px
- Background: Red (#DC2626)
- Text: White
- Logo: Left-aligned, 24px font
- Links: Right-aligned, 16px, hover underline
- Sticky: Consider sticky positioning for scroll

### Upload Component

```jsx
<div className="upload-zone">
  <input 
    type="file" 
    accept=".pdf,.docx"
    onChange={handleFileChange}
    ref={fileInputRef}
    hidden
  />
  <div 
    className="drop-area"
    onClick={() => fileInputRef.current?.click()}
    onDragOver={handleDragOver}
    onDrop={handleDrop}
  >
    <Icon name="document" size={48} className="text-gray-400" />
    <p className="text-lg font-medium">Drop your CV here</p>
    <p className="text-sm text-gray-500">or click to upload</p>
    <p className="text-xs text-gray-400 mt-4">
      Supports: PDF, DOCX (Max 5MB)
    </p>
  </div>
</div>
```

**Specifications**:
- Width: 500px (max)
- Height: 250px
- Border: 2px dashed #D1D5DB
- Background: #F9FAFB
- Hover: Border color → #DC2626, Background → #FEF2F2
- Cursor: pointer
- States:
  - Default: As above
  - Hover: Red tint
  - Drag over: More prominent red border
  - Selected: Show file name, replace with "Analyzing..."

### Score Card Component

```jsx
<div className="score-card bg-white rounded-lg shadow-lg p-8 text-center">
  <h2 className="text-2xl font-semibold mb-4">Your CV Score</h2>
  
  <div className="flex items-center justify-center gap-4 mb-4">
    <span className="text-6xl">🏆</span>
    <span className="text-7xl font-bold text-red-600">
      {score}<span className="text-4xl text-gray-500">/100</span>
    </span>
  </div>
  
  <div className="text-xl font-medium text-gray-700 mb-2">
    {grade} {/* "Excellent", "Very Good", etc. */}
  </div>
  
  <p className="text-gray-600 mb-6">
    {message} {/* Custom message based on score */}
  </p>
  
  <button 
    onClick={handleReset}
    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
  >
    Try Another CV
  </button>
</div>
```

**Specifications**:
- Score number: 72px font, red color
- Grade: 20px font, bold
- Message: 16px, gray
- Button: 16px, red background, hover darken
- Shadow: medium (shadow-lg in Tailwind)
- Rounded: 8-12px border radius

### Breakdown Item Component

```jsx
<div className="breakdown-item border-b border-gray-200 py-4">
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold text-lg">{category}</h3>
    <span className="text-xl font-bold text-red-600">
      {score}/{maxScore}
    </span>
  </div>
  
  {/* Optional: Progress Bar */}
  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
    <div 
      className="bg-red-600 h-2 rounded-full"
      style={{width: `${(score/maxScore) * 100}%`}}
    />
  </div>
  
  <ul className="space-y-1">
    {checks.map((check, idx) => (
      <li key={idx} className="text-sm flex items-start gap-2">
        <span className={check.passed ? "text-green-600" : "text-red-600"}>
          {check.passed ? "✅" : "❌"}
        </span>
        <span className="text-gray-700">{check.message}</span>
      </li>
    ))}
  </ul>
</div>
```

**Specifications**:
- Category title: 18px, bold
- Score: 20px, bold, red
- Progress bar: Height 8px, rounded
- Checkmarks: 14px (or emoji)
- Message: 14px, gray-700
- Spacing: 4px between items

### Recommendations Component

```jsx
<div className="recommendations bg-yellow-50 rounded-lg p-6 border border-yellow-200">
  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
    <span>💡</span>
    Top Recommendations
  </h3>
  
  <ol className="space-y-4">
    {recommendations.map((rec, idx) => (
      <li key={idx} className="flex gap-3">
        <span className="font-bold text-red-600 text-lg">{idx + 1}.</span>
        <div>
          <p className="font-semibold text-gray-900">{rec.title}</p>
          <p className="text-sm text-gray-700">{rec.description}</p>
        </div>
      </li>
    ))}
  </ol>
</div>
```

**Specifications**:
- Background: Light yellow (#FFFBEB)
- Border: Yellow (#FDE68A)
- Icon: Lightbulb emoji (💡)
- Title: 20px, bold
- Recommendation title: 16px, bold
- Description: 14px, regular
- Spacing: 16px between recommendations

### Footer

```jsx
<footer className="bg-gray-100 border-t border-gray-300 py-6 mt-12">
  <div className="container mx-auto px-6 text-center text-sm text-gray-600">
    <p>© 2026 CVScorer. Built with Next.js.</p>
    <div className="flex justify-center gap-4 mt-2">
      <a href="/privacy" className="hover:text-red-600">Privacy Policy</a>
      <a href="https://github.com/yourusername/cvscorer" 
         className="hover:text-red-600" 
         target="_blank">
        GitHub
      </a>
    </div>
  </div>
</footer>
```

**Specifications**:
- Background: Light gray (#F3F4F6)
- Text: Gray-600
- Links: Hover → Red
- Padding: 24px vertical
- Border: Top border only

## Responsive Design

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Adjustments

1. **Header**:
   - Stack logo and nav vertically (or hamburger menu)
   - Font size reduce to 20px

2. **Upload Zone**:
   - Width: 100% (with padding)
   - Height: 200px

3. **Score Card**:
   - Score font: 48px (down from 72px)
   - Padding reduce to 16px

4. **Breakdown**:
   - Stack score and category name vertically if needed
   - Reduce font sizes by 2-4px

5. **Recommendations**:
   - Number and text stack vertically on very small screens

### Tablet Adjustments

- Generally same as desktop, but with:
  - Slightly tighter padding
  - Max width constraints to prevent stretching

## User Flows

### Primary Flow: Upload and Review

```
1. User lands on home page
   ↓
2. User sees upload zone and instructions
   ↓
3. User drags file or clicks to select
   ↓
4. File uploads, loading state shows
   ↓
5. Results appear (scroll to results or replace upload area)
   ↓
6. User reviews score and feedback
   ↓
7. User clicks "Try Another CV" (optional)
   ↓
8. Returns to step 1 (or closes page)
```

### Secondary Flow: Learning

```
1. User lands on home page
   ↓
2. User clicks "About" or "FAQ" in nav
   ↓
3. User reads informational content
   ↓
4. User navigates back to "Home" to upload
```

## Accessibility (WCAG 2.1 AA)

### Color Contrast

- **Text on White**: Must be at least 4.5:1
  - Body text: #1F2937 (dark gray) ✓
  - Red links on white: Ensure red is dark enough (#DC2626 passes)
  
- **White Text on Red**: Check header text contrast
  - White (#FFFFFF) on #DC2626: ~4.5:1 ✓

### Keyboard Navigation

- All interactive elements (buttons, links, file input) must be focusable
- Visible focus indicator (outline or ring)
- Logical tab order

### Screen Readers

- Semantic HTML: Use `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`
- Alt text for icons (or aria-label)
- Labels for form inputs (file upload has label)
- Announce dynamic content changes (when results load)

**Implementation**:
```jsx
<button 
  aria-label="Upload CV file"
  onClick={handleUpload}
>
  Upload
</button>

<div role="status" aria-live="polite">
  {loading && "Analyzing your CV, please wait..."}
</div>

<span role="img" aria-label="checkmark">✅</span>
```

### Focus Management

- When results appear, optionally move focus to results heading
- Trap focus in modals (if any)

### Motion & Animation

- Respect `prefers-reduced-motion` for users sensitive to animation
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Micro-Interactions

### Hover States

- **Upload Zone**: Border color changes to red, subtle background tint
- **Buttons**: Background darkens slightly (hover:bg-red-700)
- **Links**: Underline or color change

### Transitions

- Upload zone: `transition: all 0.3s ease`
- Button: `transition: background-color 0.2s ease`
- Results appearance: Fade in over 0.4s

### Loading Animation

- Spinner: Rotating icon or CSS animation
- Progress bar: Smooth fill animation
- Text: Optional typing effect for "Analyzing..."

## Design Tokens / Variables

```css
:root {
  /* Colors */
  --color-primary: #DC2626;
  --color-primary-dark: #B91C1C;
  --color-secondary: #FFFFFF;
  --color-text: #1F2937;
  --color-text-light: #6B7280;
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-bg: #FFFFFF;
  --color-bg-light: #F9FAFB;
  --color-border: #D1D5DB;
  
  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  
  /* Spacing */
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */
  --spacing-2xl: 3rem;    /* 48px */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Border Radius */
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
}
```

## Wireframe Mockups (ASCII)

### Mobile View (320px - 640px)

```
┌──────────────┐
│ CVScorer  ☰ │ (Header with hamburger)
├──────────────┤
│              │
│ Get Your CV  │
│    Score     │
│              │
│ ┌──────────┐ │
│ │   📄     │ │
│ │  Drop    │ │
│ │   your   │ │
│ │    CV    │ │
│ └──────────┘ │
│              │
│ ✓ Instant    │
│ ✓ Private    │
│ ✓ Free       │
│              │
└──────────────┘
```

### Desktop View (1024px+)

```
┌─────────────────────────────────────────────────┐
│  CVScorer              Home | About | FAQ       │
├─────────────────────────────────────────────────┤
│                                                 │
│            Get Your CV Score                    │
│       Upload for instant feedback               │
│                                                 │
│       ┌─────────────────────────┐              │
│       │        📄               │              │
│       │   Drop your CV here     │              │
│       │   or click to upload    │              │
│       │                         │              │
│       │  Supports: PDF, DOCX    │              │
│       └─────────────────────────┘              │
│                                                 │
│  ✓ Instant  ✓ Private  ✓ No signup  ✓ Free    │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Performance Considerations

### Image Optimization

- Use SVG for icons where possible (scalable, small file size)
- Optimize any raster images with WebP format
- Lazy load images below the fold

### Font Loading

- Use system fonts or preload custom fonts
- Font display: swap (to avoid FOIT - Flash of Invisible Text)

### Code Splitting

- Split About and FAQ pages as separate bundles
- Load heavy libraries (pdf-parse) only when needed (on upload)

### Animation Performance

- Use CSS transforms and opacity (GPU-accelerated)
- Avoid animating layout properties (width, height, margin)

## Testing Checklist

### Visual Testing

- [ ] All colors match design tokens
- [ ] Typography is consistent
- [ ] Spacing follows grid system
- [ ] Icons are aligned properly
- [ ] Shadows render correctly

### Functional Testing

- [ ] File upload works (drag and drop)
- [ ] File upload works (click to select)
- [ ] Loading state appears
- [ ] Results display correctly
- [ ] "Try Another CV" resets state
- [ ] Navigation links work
- [ ] All links have hover states

### Responsive Testing

- [ ] Mobile view (320px, 375px, 425px)
- [ ] Tablet view (768px, 1024px)
- [ ] Desktop view (1440px, 1920px)
- [ ] No horizontal scroll on any viewport
- [ ] Text is readable at all sizes

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader announces content correctly
- [ ] Color contrast passes WCAG AA
- [ ] Form inputs have labels
- [ ] Semantic HTML used

### Browser Testing

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Future Enhancements

### V1.1 UI Features

- Dark mode toggle
- Downloadable PDF report of results
- Share results (anonymized link)
- Comparison view (two CVs side-by-side)

### V2.0 UI Features

- Interactive tutorial/onboarding
- Customizable scoring weights (user preference)
- Detailed tooltips explaining each criterion
- Progress tracking (if user accounts added)

---

**Approval Status**: ⏳ Pending Review  
**Dependencies**: RFC-001 (Project Overview), RFC-002 (Scoring Rubric)  
**Next Steps**: Implement components in RFC-006
