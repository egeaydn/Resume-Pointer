# Test Fixtures

This directory contains sample files for testing CVScorer functionality.

## Files

### PDF Samples
- **strong-cv.pdf**: Well-formatted CV with all sections (expected score: 80-90)
  - Has all required sections (contact, summary, experience, education, skills)
  - Uses action verbs and quantification
  - Good formatting with bullet points
  - 2 pages, 700-800 words

- **weak-cv.pdf**: Poorly formatted CV missing sections (expected score: 40-50)
  - Missing summary or skills section
  - Poor formatting
  - Few action verbs
  - Too short or too long

- **medium-cv.pdf**: Average CV with some issues (expected score: 60-70)
  - Has most sections but missing 1-2
  - Some formatting issues
  - Could improve action verbs and quantification

- **empty.pdf**: Empty or nearly empty document
  - Used to test error handling
  - Should fail with "Could not extract sufficient text"

### DOCX Samples
- **sample-cv.docx**: Valid DOCX file for testing DOCX extraction
  - Similar quality to strong-cv.pdf
  - Tests DOCX parsing with mammoth

### Invalid Files
- **invalid.txt**: Plain text file (not PDF/DOCX)
  - Should be rejected with "Invalid file type" error
  - Tests file type validation

- **corrupted.pdf**: Corrupted PDF file
  - Tests error handling for unreadable PDFs
  - Should fail gracefully

## Usage

These fixtures are used in:
- Unit tests (`/tests/unit/`)
- Integration tests (`/tests/integration/`)
- E2E tests (`/tests/e2e/`)

## Creating Your Own Fixtures

To add new test fixtures:

1. Create a real CV in Word/Google Docs
2. Export as PDF or save as DOCX
3. Place in this directory
4. Update this README with description
5. Update tests to use the new fixture

## Notes

- Keep file sizes under 5MB (API limit)
- Use realistic CV content
- Anonymize personal information if using real CVs
- Test both PDF and DOCX formats
