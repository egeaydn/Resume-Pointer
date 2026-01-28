# RFC-002: Scoring Rubric & Criteria

**Status**: Draft  
**Author**: Development Team  
**Created**: January 28, 2026  
**Last Updated**: January 28, 2026

## Abstract

This RFC defines the comprehensive scoring rubric for CV evaluation. The system uses a rule-based approach with 5 main categories totaling 100 points, evaluating structure, skills, experience, education, and formatting.

## Motivation

A transparent, quantifiable scoring system is essential for:
1. Providing objective feedback to users
2. Ensuring consistency across all evaluations
3. Making the tool's logic explainable and trustworthy
4. Aligning with industry best practices and ATS criteria

## Scoring Philosophy

### Core Principles

1. **Evidence-Based**: Criteria based on resume best practices and ATS requirements
2. **Weighted by Impact**: More important sections (Experience) receive more points
3. **Transparent**: Every point deduction/award has a clear reason
4. **Actionable**: Each criterion can be improved by the user
5. **Balanced**: Mix of content quality and presentation

### Scoring Range Interpretation

| Score | Grade | Interpretation |
|-------|-------|----------------|
| 0-40  | Poor | Significant improvements needed; missing critical sections |
| 41-60 | Fair | Basic structure present but lacks detail or polish |
| 61-75 | Good | Solid CV with minor improvements possible |
| 76-85 | Very Good | Strong CV, ready for most applications |
| 86-100| Excellent | Outstanding CV following best practices |

## Detailed Scoring Rubric

### Category 1: CV Structure & Sections (15 points)

**Purpose**: Ensure the CV contains essential sections that recruiters expect to find.

#### Sub-Criteria

##### 1.1 Contact Information (3 points)

**Full Points (3)**: 
- ✅ Professional email address found (e.g., firstname.lastname@domain.com)
- ✅ Phone number present in valid format
- ✅ Contact info positioned at top of CV

**Partial Points (1-2)**:
- Email present but no phone, or vice versa
- Contact info present but buried in the document

**Zero Points (0)**:
- ❌ No email address found
- ❌ No phone number found

**Feedback Examples**:
- "❌ Missing phone number - add your contact number for employer reach-out"
- "✅ Complete contact information with professional email"

##### 1.2 Professional Summary/Objective (3 points)

**Full Points (3)**:
- ✅ Summary or objective section identified
- ✅ Located near top of CV (within first 20% of document)
- ✅ Contains 2-4 sentences (approx 50-150 words)

**Partial Points (1-2)**:
- Summary present but very brief (< 30 words) or overly long (> 200 words)

**Zero Points (0)**:
- ❌ No summary or objective section

**Feedback Examples**:
- "❌ Missing professional summary - add 2-3 sentences highlighting your key strengths"
- "✅ Strong professional summary at top of CV"

**Detection Method**: Look for headers like "Summary", "Professional Profile", "Objective", "About", or intro paragraph at top without header.

##### 1.3 Work Experience Section (3 points)

**Full Points (3)**:
- ✅ Clear "Experience" or "Work History" section heading
- ✅ At least one job entry with dates

**Zero Points (0)**:
- ❌ No experience section found

**Feedback Examples**:
- "❌ Work experience section not found - add your employment history"
- "✅ Work experience section clearly labeled"

**Detection Method**: Search for headers containing "Experience", "Employment", "Work History", "Professional History", "Career".

##### 1.4 Education Section (3 points)

**Full Points (3)**:
- ✅ Clear "Education" section heading
- ✅ At least one education entry

**Zero Points (0)**:
- ❌ No education section found

**Feedback Examples**:
- "❌ Education section missing - include your academic credentials"
- "✅ Education section present with credentials"

**Detection Method**: Search for "Education", "Academic Background", "Qualifications".

##### 1.5 Skills Section (3 points)

**Full Points (3)**:
- ✅ Dedicated "Skills" section heading
- ✅ Multiple skills listed (5+ items)

**Partial Points (1-2)**:
- Skills section exists but only 1-4 items listed

**Zero Points (0)**:
- ❌ No skills section found

**Feedback Examples**:
- "❌ No skills section - create a dedicated section listing your competencies"
- "✅ Comprehensive skills section with multiple competencies"

**Detection Method**: Search for "Skills", "Technical Skills", "Core Competencies", "Expertise".

---

### Category 2: Technical Skills (20 points)

**Purpose**: Evaluate the breadth and relevance of listed skills, especially hard/technical skills.

#### Sub-Criteria

##### 2.1 Skills Section Present (5 points)

**Full Points (5)**:
- ✅ Dedicated skills section exists
- ✅ Skills formatted as list (bullets, commas, or organized by category)

**Partial Points (2-3)**:
- Skills mentioned but scattered throughout CV
- Skills in paragraph form rather than list

**Zero Points (0)**:
- ❌ No identifiable skills section or mentions

**Feedback Examples**:
- "❌ Skills not organized in dedicated section - create a 'Skills' heading"
- "✅ Well-organized skills section"

##### 2.2 Hard/Technical Skills (10 points)

**Keyword Categories**:
- Programming Languages: Python, Java, C++, JavaScript, TypeScript, Ruby, Go, PHP, Swift, Kotlin
- Web Technologies: HTML, CSS, React, Angular, Vue, Node.js, Express, Django, Flask
- Databases: SQL, MySQL, PostgreSQL, MongoDB, Redis, Oracle
- Cloud/DevOps: AWS, Azure, GCP, Docker, Kubernetes, CI/CD, Jenkins
- Tools: Git, Jira, Figma, Photoshop, AutoCAD, Excel, Tableau
- Methodologies: Agile, Scrum, Kanban, TDD, DevOps

**Full Points (10)**:
- ✅ 10+ technical keywords found
- ✅ Multiple categories represented

**Graduated Scale**:
- 10 points: 10+ keywords
- 8 points: 7-9 keywords
- 6 points: 5-6 keywords
- 4 points: 3-4 keywords
- 2 points: 1-2 keywords
- 0 points: No technical keywords

**Feedback Examples**:
- "❌ Only 2 technical skills listed - expand with relevant tools/technologies"
- "✅ Excellent range of technical skills (12 found)"

##### 2.3 Soft Skills (5 points)

**Keyword List**: Communication, Leadership, Teamwork, Problem-solving, Critical thinking, Time management, Adaptability, Collaboration, Creativity, Attention to detail

**Full Points (5)**:
- ✅ 3+ soft skills mentioned

**Graduated Scale**:
- 5 points: 3+ soft skills
- 3 points: 2 soft skills
- 1 point: 1 soft skill
- 0 points: No soft skills

**Feedback Examples**:
- "✅ Balanced mix of technical and soft skills"
- "Consider adding 1-2 soft skills like 'leadership' or 'communication'"

---

### Category 3: Work Experience Content (30 points)

**Purpose**: Evaluate how effectively the candidate describes their work history and achievements.

#### Sub-Criteria

##### 3.1 Section Exists with Chronology (5 points)

**Full Points (5)**:
- ✅ Experience section present
- ✅ Multiple positions with dates
- ✅ Dates appear in reverse chronological order

**Partial Points (2-3)**:
- Experience section present but only one job
- Dates missing from some entries

**Zero Points (0)**:
- ❌ No experience section

**Detection Method**: Look for year patterns (2019-2023, 2020-Present, etc.) and verify most recent appears first.

##### 3.2 Use of Bullet Points (5 points)

**Full Points (5)**:
- ✅ Each job uses bullet points (•, -, *, 1., 2.)
- ✅ Average of 3-5 bullets per job

**Partial Points (2-3)**:
- Some jobs use bullets, others don't
- Very few bullets (1-2 per job)

**Zero Points (0)**:
- ❌ No bullets; all paragraph text

**Feedback Examples**:
- "❌ Experience written in paragraphs - use bullet points for readability"
- "✅ Excellent use of bullet points to highlight achievements"

**Detection Method**: Scan for bullet characters, numbered lists, or line patterns suggesting lists.

##### 3.3 Action Verbs (5 points)

**Action Verb List**: Achieved, Analyzed, Built, Collaborated, Created, Designed, Developed, Directed, Established, Executed, Generated, Implemented, Improved, Increased, Initiated, Launched, Led, Managed, Optimized, Organized, Performed, Planned, Produced, Reduced, Resolved, Spearheaded, Streamlined, Supervised

**Full Points (5)**:
- ✅ 5+ bullet points start with action verbs
- ✅ Variety of verbs used (not repetitive)

**Graduated Scale**:
- 5 points: 5+ action verbs
- 4 points: 4 action verbs
- 3 points: 3 action verbs
- 2 points: 1-2 action verbs
- 0 points: No action verbs

**Feedback Examples**:
- "❌ Bullets don't start with strong action verbs - begin with words like 'Developed', 'Managed', 'Led'"
- "✅ Strong use of action verbs throughout experience"

**Detection Method**: For each line in experience section, check if first word (after bullet/number) matches verb list.

##### 3.4 Quantified Achievements (5 points)

**Full Points (5)**:
- ✅ 3+ instances of numbers, percentages, or metrics
- ✅ Quantification across multiple jobs

**Graduated Scale**:
- 5 points: 3+ quantified achievements
- 3 points: 2 quantified achievements
- 1 point: 1 quantified achievement
- 0 points: No quantification

**Feedback Examples**:
- "❌ No quantified results - add numbers to show impact (e.g., 'increased sales by 20%')"
- "✅ Great use of metrics to demonstrate impact"

**Detection Method**: Scan experience section for numbers (\d+), percentage signs (%), currency symbols ($, €, £), or words like "million", "thousand".

##### 3.5 Relevance & Detail (10 points)

**Full Points (10)**:
- ✅ Each job has 3+ detailed bullets
- ✅ Bullets describe responsibilities AND achievements (not just job titles)
- ✅ Content is substantial (not generic "Responsible for...")

**Graduated Scale**:
- 10 points: All jobs have 3+ detailed bullets
- 7 points: Most jobs have 2-3 bullets
- 4 points: Jobs have 1-2 bullets or very brief descriptions
- 0 points: Just job titles and dates, no descriptions

**Feedback Examples**:
- "❌ Experience entries lack detail - add 3-5 bullets per job describing what you did"
- "✅ Comprehensive descriptions of responsibilities and achievements"

**Detection Method**: Count bullets/sentences per job entry; flag if < 2 per job on average.

---

### Category 4: Education (15 points)

**Purpose**: Verify educational qualifications are clearly stated.

#### Sub-Criteria

##### 4.1 Section Present (5 points)

**Full Points (5)**:
- ✅ Education section clearly identified

**Zero Points (0)**:
- ❌ No education section

##### 4.2 Degree Details (5 points)

**Degree Keywords**: Bachelor, Master, Associate, Doctorate, Ph.D, B.S., B.A., M.S., M.A., MBA, B.Sc., M.Sc., Diploma, Certification

**Full Points (5)**:
- ✅ At least one degree keyword found
- ✅ Institution name present

**Partial Points (2-3)**:
- Institution name but no degree specified
- Degree without institution

**Zero Points (0)**:
- ❌ No degree information

**Feedback Examples**:
- "❌ Degree type not specified - add your degree (e.g., Bachelor of Science)"
- "✅ Degree and institution clearly stated"

##### 4.3 Dates Present (5 points)

**Full Points (5)**:
- ✅ Graduation year or expected graduation mentioned
- ✅ Or "Present" / "Expected 2024" for ongoing education

**Partial Points (2-3)**:
- Date present for some entries but not all

**Zero Points (0)**:
- ❌ No dates in education section

**Feedback Examples**:
- "Consider adding graduation dates to education entries"
- "✅ Education dates clearly indicated"

---

### Category 5: Formatting & Readability (20 points)

**Purpose**: Assess the visual presentation and ease of reading.

#### Sub-Criteria

##### 5.1 Length Check (5 points)

**Full Points (5)**:
- ✅ CV is 1-2 pages (approx 300-1000 words)

**Partial Points (2-3)**:
- Slightly over 2 pages (1000-1500 words)
- Very short but complete (200-299 words)

**Zero Points (0)**:
- ❌ Over 3 pages (1500+ words)
- ❌ Extremely short (< 200 words, likely incomplete)

**Feedback Examples**:
- "❌ CV is 4 pages long - condense to 2 pages maximum"
- "✅ Appropriate length (2 pages)"

**Detection Method**: Count words or characters; estimate pages (500 words ≈ 1 page).

##### 5.2 White Space & Clarity (5 points)

**Full Points (5)**:
- ✅ Sections separated by blank lines
- ✅ Not overly dense (line breaks present)

**Partial Points (2-3)**:
- Some sections well-spaced, others dense
- Minimal white space but readable

**Zero Points (0)**:
- ❌ Wall of text with no spacing

**Feedback Examples**:
- "❌ Text appears very dense - add spacing between sections"
- "✅ Good use of white space for readability"

**Detection Method**: Count blank lines; check ratio of blank lines to content lines (should be ~10-20% blank).

##### 5.3 Bullet and List Usage (5 points)

**Full Points (5)**:
- ✅ Bullets used in Skills and/or Experience
- ✅ Consistent bullet style

**Partial Points (2-3)**:
- Bullets used but inconsistent styles
- Only some sections use bullets

**Zero Points (0)**:
- ❌ No bullets anywhere

**Feedback Examples**:
- "❌ No bullet points used - lists should use bullets for scannability"
- "✅ Consistent bullet formatting throughout"

##### 5.4 Consistency & Style (5 points)

**Full Points (5)**:
- ✅ Section headings appear consistent (similar capitalization, formatting)
- ✅ Date formats consistent (all "2020-2023" or all "Jan 2020 - Dec 2023")
- ✅ No obvious typos detected

**Partial Points (2-3)**:
- Minor inconsistencies (mixed date formats)
- One or two typos found

**Zero Points (0)**:
- ❌ Major inconsistencies (random capitalization, multiple styles)
- ❌ Multiple obvious typos

**Feedback Examples**:
- "❌ Inconsistent heading styles - use uniform capitalization"
- "✅ Consistent formatting throughout CV"

**Detection Method**: 
- Check if all section headings are uppercase or title case
- Verify dates follow similar patterns
- Basic spell check against dictionary (optional, may be complex)

---

## Scoring Calculation Algorithm

### Pseudocode

```python
def calculate_cv_score(extracted_text):
    score = {
        'structure': 0,
        'skills': 0,
        'experience': 0,
        'education': 0,
        'formatting': 0
    }
    
    feedback = []
    
    # Category 1: Structure (15 pts)
    if has_contact_info(extracted_text):
        score['structure'] += 3
        feedback.append({'type': 'positive', 'message': '✅ Contact information present'})
    else:
        feedback.append({'type': 'negative', 'message': '❌ Missing contact info'})
    
    if has_summary(extracted_text):
        score['structure'] += 3
        feedback.append({'type': 'positive', 'message': '✅ Professional summary included'})
    else:
        score['structure'] += 0
        feedback.append({'type': 'negative', 'message': '❌ Add a professional summary at top'})
    
    # ... (continue for all criteria)
    
    total_score = sum(score.values())
    
    return {
        'total': total_score,
        'breakdown': score,
        'feedback': feedback,
        'grade': get_grade(total_score)
    }

def get_grade(score):
    if score >= 86: return 'Excellent'
    elif score >= 76: return 'Very Good'
    elif score >= 61: return 'Good'
    elif score >= 41: return 'Fair'
    else: return 'Needs Improvement'
```

### Implementation Notes

1. **Order of Evaluation**: Process categories sequentially to avoid dependencies
2. **Early Exit**: Don't stop scoring even if one category is zero (to provide complete feedback)
3. **Feedback Generation**: Create feedback messages as criteria are evaluated
4. **Threshold Flexibility**: Allow thresholds to be configured (e.g., technical skills keyword count)

## Example Scoring Scenarios

### Scenario A: Strong Technical CV

**Input**: Software engineer CV with:
- Complete contact info
- Professional summary
- 3 jobs with bullet points
- 15 technical skills
- Bachelor's degree
- 2 pages, well-formatted

**Expected Score**: 85-90/100

**Breakdown**:
- Structure: 15/15 (all sections present)
- Skills: 20/20 (excellent technical skills)
- Experience: 25/30 (good bullets but few quantified achievements)
- Education: 15/15 (degree present)
- Formatting: 18/20 (slightly over 2 pages)

### Scenario B: Entry-Level CV with Gaps

**Input**: Recent graduate CV with:
- Contact info present
- No summary
- 1 internship with paragraphs (no bullets)
- 5 technical skills
- Bachelor's degree with GPA
- 1 page

**Expected Score**: 55-65/100

**Breakdown**:
- Structure: 12/15 (missing summary)
- Skills: 12/20 (limited skills)
- Experience: 12/30 (minimal experience, no bullets/action verbs)
- Education: 15/15 (complete)
- Formatting: 12/20 (no bullets, but good length)

### Scenario C: Poor Formatting

**Input**: CV with:
- No clear sections
- Skills scattered throughout
- Dense paragraph text
- 4 pages
- Inconsistent formatting

**Expected Score**: 30-40/100

**Breakdown**:
- Structure: 5/15 (sections hard to identify)
- Skills: 5/20 (skills present but not organized)
- Experience: 10/30 (content exists but poor presentation)
- Education: 8/15 (education mentioned but unclear)
- Formatting: 5/20 (too long, dense, inconsistent)

## Edge Cases & Special Handling

### Edge Case 1: Creative/Design CVs
- **Challenge**: May not follow traditional structure
- **Handling**: May score lower on structure; note in feedback that non-traditional formats might not scan well in ATS

### Edge Case 2: Academic CVs
- **Challenge**: Often 3+ pages with publications
- **Handling**: Could adjust length criteria for academic roles in future; for MVP, flag length but acknowledge context in feedback

### Edge Case 3: Career Changers
- **Challenge**: May lack direct technical skills
- **Handling**: Score what's present; suggest adding transferable skills

### Edge Case 4: Multi-Column Layouts
- **Challenge**: Text extraction may jumble sections
- **Handling**: Detection may fail; suggest simpler layout in feedback

### Edge Case 5: International CVs
- **Challenge**: Different conventions (photo, personal info)
- **Handling**: Don't penalize extra info; focus on presence of key sections

## Validation & Calibration

### Pre-Launch Testing

1. **Sample Set**: Test with 20-30 diverse CVs
2. **Score Distribution**: Ensure scores span 40-95 range (not all clustered)
3. **Expert Review**: Have career counselor review scoring for 5 sample CVs
4. **User Testing**: Show feedback to 3-5 users; verify comprehensibility

### Post-Launch Iteration

1. Collect feedback on whether scores feel fair
2. Adjust thresholds if too lenient or strict
3. Expand keyword lists based on common skills missed
4. Refine regex patterns if sections frequently undetected

## Future Enhancements

### V1.1 Possibilities
- Industry-specific rubrics (tech vs finance vs healthcare)
- Adjustable weights (user can prioritize certain categories)
- Downloadable score report PDF

### V2.0 Possibilities
- AI-assisted content analysis for deeper insights
- Grammar and spell checking
- Comparison against job description

## References

1. Resume best practices from career sites
2. ATS keyword optimization guides
3. LinkedIn resume tips
4. Recruiter feedback studies

---

**Approval Status**: ⏳ Pending Review  
**Dependencies**: RFC-001 (Project Overview)  
**Next Steps**: Implement detection logic in RFC-003
