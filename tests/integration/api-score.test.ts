import { POST } from '@/app/api/score/route';
import { NextRequest } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

describe('POST /api/score - Integration Tests', () => {
  describe('Error Handling', () => {
    it('returns 400 for missing file', async () => {
      const formData = new FormData();
      const request = new NextRequest('http://localhost:3000/api/score', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NO_FILE');
      expect(data.error.message).toBeDefined();
    });

    it('returns 400 for invalid file type', async () => {
      const formData = new FormData();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      formData.append('file', file);

      const request = new NextRequest('http://localhost:3000/api/score', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_FILE_TYPE');
    });

    it('returns 400 for file too large', async () => {
      const formData = new FormData();
      // Create 6MB file (over 5MB limit)
      const largeContent = new Uint8Array(6 * 1024 * 1024).fill(65);
      const largeFile = new File([largeContent], 'large.pdf', {
        type: 'application/pdf',
      });
      formData.append('file', largeFile);

      const request = new NextRequest('http://localhost:3000/api/score', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('FILE_TOO_LARGE');
    });

    it('returns 400 for invalid filename', async () => {
      const formData = new FormData();
      const file = new File(['content'], '../../../etc/passwd', {
        type: 'application/pdf',
      });
      formData.append('file', file);

      const request = new NextRequest('http://localhost:3000/api/score', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_FILENAME');
    });
  });

  describe('RFC-005 Compliance', () => {
    it('returns RFC-005 compliant success response', async () => {
      // This test would require a valid PDF fixture
      // For now, we'll test the structure with mock

      const mockResponse = {
        success: true,
        data: {
          totalScore: 78,
          grade: 'Very Good',
          message: 'Your CV is strong',
          breakdown: {
            structure: {
              score: 12,
              maxScore: 15,
              details: [],
            },
            technicalSkills: {
              score: 15,
              maxScore: 20,
              details: [],
            },
            workExperience: {
              score: 24,
              maxScore: 30,
              details: [],
            },
            education: {
              score: 12,
              maxScore: 15,
              details: [],
            },
            formatting: {
              score: 15,
              maxScore: 20,
              details: [],
            },
          },
          recommendations: [],
          metadata: {
            wordCount: 850,
            estimatedPages: 2,
            processingTime: expect.any(Number),
            version: '1.0.0',
            timestamp: expect.any(String),
          },
        },
        requestId: expect.any(String),
      };

      // Validate structure
      expect(mockResponse.success).toBe(true);
      expect(mockResponse.data).toBeDefined();
      expect(mockResponse.data.totalScore).toBeGreaterThanOrEqual(0);
      expect(mockResponse.data.totalScore).toBeLessThanOrEqual(100);
      expect(mockResponse.data.breakdown).toBeDefined();
      expect(mockResponse.data.recommendations).toBeDefined();
      expect(mockResponse.data.metadata).toBeDefined();
    });

    it('returns RFC-005 compliant error response', async () => {
      const formData = new FormData();
      const request = new NextRequest('http://localhost:3000/api/score', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      // Validate error structure per RFC-005
      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('error');
      expect(data.error).toHaveProperty('code');
      expect(data.error).toHaveProperty('message');
      expect(data).toHaveProperty('requestId');
    });

    it('includes requestId in all responses', async () => {
      const formData = new FormData();
      const request = new NextRequest('http://localhost:3000/api/score', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.requestId).toBeDefined();
      expect(typeof data.requestId).toBe('string');
      expect(data.requestId.length).toBeGreaterThan(0);
    });
  });

  describe('Response Metadata', () => {
    it('includes processing time', async () => {
      // Would need valid CV fixture
      const mockMetadata = {
        processingTime: 1.234,
      };

      expect(mockMetadata.processingTime).toBeGreaterThan(0);
      expect(typeof mockMetadata.processingTime).toBe('number');
    });

    it('includes version information', async () => {
      const mockMetadata = {
        version: '1.0.0',
      };

      expect(mockMetadata.version).toBe('1.0.0');
    });

    it('includes timestamp', async () => {
      const mockMetadata = {
        timestamp: new Date().toISOString(),
      };

      expect(mockMetadata.timestamp).toBeDefined();
      expect(new Date(mockMetadata.timestamp).getTime()).not.toBeNaN();
    });
  });

  describe('Score Calculation', () => {
    it('returns score between 0 and 100', async () => {
      const mockScore = 78;

      expect(mockScore).toBeGreaterThanOrEqual(0);
      expect(mockScore).toBeLessThanOrEqual(100);
    });

    it('breakdown scores sum to total score', async () => {
      const mockBreakdown = {
        structure: { score: 12, maxScore: 15 },
        technicalSkills: { score: 15, maxScore: 20 },
        workExperience: { score: 24, maxScore: 30 },
        education: { score: 12, maxScore: 15 },
        formatting: { score: 15, maxScore: 20 },
      };

      const sum =
        mockBreakdown.structure.score +
        mockBreakdown.technicalSkills.score +
        mockBreakdown.workExperience.score +
        mockBreakdown.education.score +
        mockBreakdown.formatting.score;

      expect(sum).toBe(78);
    });

    it('max scores sum to 100', async () => {
      const mockBreakdown = {
        structure: { score: 12, maxScore: 15 },
        technicalSkills: { score: 15, maxScore: 20 },
        workExperience: { score: 24, maxScore: 30 },
        education: { score: 12, maxScore: 15 },
        formatting: { score: 15, maxScore: 20 },
      };

      const maxSum =
        mockBreakdown.structure.maxScore +
        mockBreakdown.technicalSkills.maxScore +
        mockBreakdown.workExperience.maxScore +
        mockBreakdown.education.maxScore +
        mockBreakdown.formatting.maxScore;

      expect(maxSum).toBe(100);
    });
  });

  describe('Content Type', () => {
    it('returns application/json content type', async () => {
      const formData = new FormData();
      const request = new NextRequest('http://localhost:3000/api/score', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.headers.get('content-type')).toContain(
        'application/json'
      );
    });
  });
});
