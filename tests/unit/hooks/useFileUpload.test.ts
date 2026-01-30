import { renderHook, act, waitFor } from '@testing-library/react';
import { useFileUpload } from '@/hooks/useFileUpload';
import * as apiClient from '@/lib/api-client';
import { createMockCVResult } from '../../helpers/mock-data';

// Mock the API client
jest.mock('@/lib/api-client');

describe('useFileUpload Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with idle state', () => {
    const { result } = renderHook(() => useFileUpload());

    expect(result.current.status.state).toBe('idle');
    expect(result.current.status.file).toBeNull();
    expect(result.current.status.result).toBeNull();
    expect(result.current.status.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  describe('File Validation', () => {
    it('rejects invalid file type', async () => {
      const { result } = renderHook(() => useFileUpload());

      const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });

      await act(async () => {
        await result.current.handleFileSelect(invalidFile);
      });

      expect(result.current.status.state).toBe('error');
      expect(result.current.status.error).toContain('Invalid file type');
      expect(result.current.isError).toBe(true);
    });

    it('rejects file larger than 5MB', async () => {
      const { result } = renderHook(() => useFileUpload());

      // Create a file larger than 5MB
      const largeContent = new Uint8Array(6 * 1024 * 1024);
      const largeFile = new File([largeContent], 'large.pdf', { type: 'application/pdf' });

      await act(async () => {
        await result.current.handleFileSelect(largeFile);
      });

      expect(result.current.status.state).toBe('error');
      expect(result.current.status.error).toContain('exceeds 5MB');
    });

    it('rejects empty file', async () => {
      const { result } = renderHook(() => useFileUpload());

      const emptyFile = new File([], 'empty.pdf', { type: 'application/pdf' });

      await act(async () => {
        await result.current.handleFileSelect(emptyFile);
      });

      expect(result.current.status.state).toBe('error');
      expect(result.current.status.error).toContain('empty');
    });

    it('accepts valid PDF file', async () => {
      const mockResult = createMockCVResult();
      (apiClient.analyzeCV as jest.Mock).mockResolvedValue(mockResult);

      const { result } = renderHook(() => useFileUpload());

      const validFile = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      });

      await act(async () => {
        await result.current.handleFileSelect(validFile);
      });

      await waitFor(() => {
        expect(result.current.status.state).toBe('complete');
      });

      expect(result.current.status.result).toEqual(mockResult);
      expect(result.current.isComplete).toBe(true);
    });

    it('accepts valid DOCX file', async () => {
      const mockResult = createMockCVResult();
      (apiClient.analyzeCV as jest.Mock).mockResolvedValue(mockResult);

      const { result } = renderHook(() => useFileUpload());

      const validFile = new File(['content'], 'test.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      await act(async () => {
        await result.current.handleFileSelect(validFile);
      });

      await waitFor(() => {
        expect(result.current.status.state).toBe('complete');
      });

      expect(result.current.isComplete).toBe(true);
    });
  });

  describe('Upload States', () => {
    it('transitions through upload states correctly', async () => {
      const mockResult = createMockCVResult();
      (apiClient.analyzeCV as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockResult), 100);
          })
      );

      const { result } = renderHook(() => useFileUpload());

      const validFile = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      });

      // Start upload
      act(() => {
        result.current.handleFileSelect(validFile);
      });

      // Should immediately be in uploading state
      expect(result.current.status.state).toBe('uploading');
      expect(result.current.isLoading).toBe(true);

      // Wait for completion
      await waitFor(() => {
        expect(result.current.status.state).toBe('complete');
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isComplete).toBe(true);
    });

    it('handles API errors gracefully', async () => {
      const errorMessage = 'API Error: Failed to process';
      (apiClient.analyzeCV as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      const { result } = renderHook(() => useFileUpload());

      const validFile = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      });

      await act(async () => {
        await result.current.handleFileSelect(validFile);
      });

      await waitFor(() => {
        expect(result.current.status.state).toBe('error');
      });

      expect(result.current.status.error).toBe(errorMessage);
      expect(result.current.isError).toBe(true);
    });
  });

  describe('Reset Functionality', () => {
    it('resets state correctly', async () => {
      const mockResult = createMockCVResult();
      (apiClient.analyzeCV as jest.Mock).mockResolvedValue(mockResult);

      const { result } = renderHook(() => useFileUpload());

      const validFile = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      });

      // Upload file
      await act(async () => {
        await result.current.handleFileSelect(validFile);
      });

      await waitFor(() => {
        expect(result.current.status.state).toBe('complete');
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.status.state).toBe('idle');
      expect(result.current.status.file).toBeNull();
      expect(result.current.status.result).toBeNull();
      expect(result.current.status.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isComplete).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('can upload again after reset', async () => {
      const mockResult = createMockCVResult();
      (apiClient.analyzeCV as jest.Mock).mockResolvedValue(mockResult);

      const { result } = renderHook(() => useFileUpload());

      const validFile = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      });

      // First upload
      await act(async () => {
        await result.current.handleFileSelect(validFile);
      });

      await waitFor(() => {
        expect(result.current.status.state).toBe('complete');
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      // Second upload
      await act(async () => {
        await result.current.handleFileSelect(validFile);
      });

      await waitFor(() => {
        expect(result.current.status.state).toBe('complete');
      });

      expect(result.current.isComplete).toBe(true);
      expect(apiClient.analyzeCV).toHaveBeenCalledTimes(2);
    });
  });

  describe('Computed Booleans', () => {
    it('isLoading is true during upload and analysis', async () => {
      const mockResult = createMockCVResult();
      (apiClient.analyzeCV as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockResult), 100);
          })
      );

      const { result } = renderHook(() => useFileUpload());

      const validFile = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      });

      act(() => {
        result.current.handleFileSelect(validFile);
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('isComplete is true only after successful analysis', async () => {
      const mockResult = createMockCVResult();
      (apiClient.analyzeCV as jest.Mock).mockResolvedValue(mockResult);

      const { result } = renderHook(() => useFileUpload());

      expect(result.current.isComplete).toBe(false);

      const validFile = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      });

      await act(async () => {
        await result.current.handleFileSelect(validFile);
      });

      await waitFor(() => {
        expect(result.current.isComplete).toBe(true);
      });
    });

    it('isError is true after validation or API error', async () => {
      const { result } = renderHook(() => useFileUpload());

      const invalidFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });

      await act(async () => {
        await result.current.handleFileSelect(invalidFile);
      });

      expect(result.current.isError).toBe(true);
    });
  });
});
