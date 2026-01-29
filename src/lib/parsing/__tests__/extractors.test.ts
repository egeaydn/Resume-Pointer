/**
 * Tests for text extraction functions
 */

// Mock pdf-parse and mammoth modules to avoid ESM issues
jest.mock('pdf-parse', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('mammoth', () => ({
  extractRawText: jest.fn(),
}));

import { 
  extractFromPDF, 
  extractFromDOCX, 
  normalizeText, 
  extractMetadata,
  validateFile,
  ExtractionError,
} from '../extractors';

describe('Text Extractors', () => {
  describe('normalizeText', () => {
    it('should normalize whitespace', () => {
      const text = 'Hello    world\n\n\n\nHow  are   you?';
      const result = normalizeText(text);
      
      // normalizeText replaces multiple spaces with single space
      expect(result).toContain('Hello world');
      expect(result).toContain('How are you?');
    });

    it('should handle empty text', () => {
      expect(normalizeText('')).toBe('');
    });

    it('should handle text with only whitespace', () => {
      expect(normalizeText('   \n\n\n   ')).toBe('');
    });

    it('should reduce multiple newlines to double newlines', () => {
      const text = 'Paragraph 1\n\n\n\n\nParagraph 2';
      const result = normalizeText(text);
      
      expect(result).not.toContain('\n\n\n');
    });

    it('should handle special characters', () => {
      const text = 'Email: test@example.com\nPhone: (555) 123-4567';
      const result = normalizeText(text);
      
      expect(result).toContain('test@example.com');
      expect(result).toContain('(555) 123-4567');
    });
  });

  describe('extractMetadata', () => {
    it('should extract basic metadata', () => {
      const text = 'This is a sample CV with some content.\n\nIt has multiple lines.';
      const metadata = extractMetadata(text, 'pdf');
      
      expect(metadata.fileType).toBe('pdf');
      expect(metadata.wordCount).toBeGreaterThan(0);
      expect(metadata.lineCount).toBeGreaterThan(0);
      expect(metadata.estimatedPageCount).toBeGreaterThan(0);
    });

    it('should calculate word count correctly', () => {
      const text = 'One two three four five';
      const metadata = extractMetadata(text, 'pdf');
      
      expect(metadata.wordCount).toBe(5);
    });

    it('should estimate page count based on word count', () => {
      // 500 words per page assumption
      const text = new Array(1000).fill('word').join(' ');
      const metadata = extractMetadata(text, 'pdf');
      
      expect(metadata.estimatedPageCount).toBe(2);
    });

    it('should handle DOCX file type', () => {
      const metadata = extractMetadata('Sample text', 'docx');
      
      expect(metadata.fileType).toBe('docx');
    });

    it('should detect contact info presence', () => {
      const textWithEmail = 'Contact me at john@example.com';
      const textWithPhone = 'Call me at (555) 123-4567';
      const textWithoutContact = 'Just some random text';
      
      expect(extractMetadata(textWithEmail, 'pdf').hasContactInfo).toBe(true);
      expect(extractMetadata(textWithPhone, 'pdf').hasContactInfo).toBe(true);
      expect(extractMetadata(textWithoutContact, 'pdf').hasContactInfo).toBe(false);
    });
  });

  describe('validateFile', () => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    it('should accept valid PDF files under size limit', () => {
      const mockFile = {
        name: 'resume.pdf',
        size: 1024 * 1024, // 1MB
        type: 'application/pdf',
      };
      
      const result = validateFile(mockFile, MAX_SIZE, ALLOWED_TYPES);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept valid DOCX files under size limit', () => {
      const mockFile = {
        name: 'resume.docx',
        size: 1024 * 1024, // 1MB
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };
      
      const result = validateFile(mockFile, MAX_SIZE, ALLOWED_TYPES);
      expect(result.valid).toBe(true);
    });

    it('should reject files over size limit', () => {
      const mockFile = {
        name: 'large.pdf',
        size: 6 * 1024 * 1024, // 6MB (over 5MB limit)
        type: 'application/pdf',
      };
      
      const result = validateFile(mockFile, MAX_SIZE, ALLOWED_TYPES);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds');
    });

    it('should reject unsupported file types', () => {
      const mockFile = {
        name: 'resume.txt',
        size: 1024,
        type: 'text/plain',
      };
      
      const result = validateFile(mockFile, MAX_SIZE, ALLOWED_TYPES);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Only PDF and DOCX');
    });

    it('should reject files with no extension', () => {
      const mockFile = {
        name: 'resume',
        size: 1024,
        type: 'application/pdf',
      };
      
      const result = validateFile(mockFile, MAX_SIZE, ALLOWED_TYPES);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('extension');
    });

    it('should handle case-insensitive file extensions', () => {
      const mockFile = {
        name: 'resume.PDF',
        size: 1024,
        type: 'application/pdf',
      };
      
      const result = validateFile(mockFile, MAX_SIZE, ALLOWED_TYPES);
      expect(result.valid).toBe(true);
    });
  });

  describe('ExtractionError', () => {
    it('should create error with message', () => {
      const error = new ExtractionError('Test error message', 'TEST_ERROR');
      
      expect(error.message).toBe('Test error message');
      expect(error.name).toBe('ExtractionError');
      expect(error.code).toBe('TEST_ERROR');
    });

    it('should be instanceof Error', () => {
      const error = new ExtractionError('Test', 'TEST_CODE');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ExtractionError);
    });
  });

  // Note: PDF and DOCX extraction tests would require actual file buffers
  // These are integration tests that would need sample files
  describe('extractFromPDF', () => {
    it('should throw error for invalid PDF buffer', async () => {
      const invalidBuffer = Buffer.from('not a pdf');
      
      await expect(extractFromPDF(invalidBuffer)).rejects.toThrow(ExtractionError);
    });
  });

  describe('extractFromDOCX', () => {
    it('should throw error for invalid DOCX buffer', async () => {
      const invalidBuffer = Buffer.from('not a docx');
      
      await expect(extractFromDOCX(invalidBuffer)).rejects.toThrow(ExtractionError);
    });
  });
});
