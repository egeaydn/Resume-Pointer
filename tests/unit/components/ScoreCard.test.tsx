import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScoreCard from '@/app/components/results/ScoreCard';
import { createMockCVResult, createExcellentCVResult, createMinimalCVResult } from '../../helpers/mock-data';

describe('ScoreCard Component', () => {
  const mockOnReset = jest.fn();

  beforeEach(() => {
    mockOnReset.mockClear();
    // Mock timers for animation
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders score correctly', async () => {
    const mockResult = createMockCVResult();
    render(<ScoreCard result={mockResult} onReset={mockOnReset} />);

    // Score animates, so initially shows 0
    expect(screen.getByText('0')).toBeInTheDocument();

    // Fast-forward animation
    jest.advanceTimersByTime(1500);

    // Now should show actual score
    await waitFor(() => {
      expect(screen.getByText('78')).toBeInTheDocument();
    });

    expect(screen.getByText('/100')).toBeInTheDocument();
    expect(screen.getByText('Very Good')).toBeInTheDocument();
  });

  it('renders grade and message', () => {
    const mockResult = createMockCVResult();
    render(<ScoreCard result={mockResult} onReset={mockOnReset} />);

    expect(screen.getByText('Very Good')).toBeInTheDocument();
    expect(screen.getByText('Your CV is strong with room for improvement')).toBeInTheDocument();
  });

  it('calls onReset when "Try Another CV" button clicked', () => {
    const mockResult = createMockCVResult();
    render(<ScoreCard result={mockResult} onReset={mockOnReset} />);

    const button = screen.getByText('Try Another CV');
    fireEvent.click(button);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('displays print button', () => {
    const mockResult = createMockCVResult();
    render(<ScoreCard result={mockResult} onReset={mockOnReset} />);

    const printButton = screen.getByText(/Print Results/i);
    expect(printButton).toBeInTheDocument();
  });

  it('renders ScoreAnimation with correct props', async () => {
    const mockResult = createMockCVResult();
    const { container } = render(<ScoreCard result={mockResult} onReset={mockOnReset} />);

    // Initially shows 0 (animation starts)
    expect(screen.getByText('0')).toBeInTheDocument();

    // Fast-forward animation
    jest.advanceTimersByTime(1500);

    // Check that score animation completedasync () => {
      const excellentResult = createExcellentCVResult();
      const { container } = render(<ScoreCard result={excellentResult} onReset={mockOnReset} />);

      // Fast-forward animation
      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(screen.getByText('92')).toBeInTheDocument();
      });
    });

    it('renders orange/red color for low score (<60)', async () => {
      const weakResult = createMinimalCVResult();
      const { container } = render(<ScoreCard result={weakResult} onReset={mockOnReset} />);

      // Fast-forward animation
      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(screen.getByText('45')).toBeInTheDocument();
      });
    });

    it('renders orange/red color for low score (<60)', () => {
      const weakResult = createMinimalCVResult();
      const { container } = render(<ScoreCard result={weakResult} onReset={mockOnReset} />);

      expect(screen.getByText('45')).toBeInTheDocument();
    });
  });
async () => {
    const mockResult = {
      ...createMockCVResult(),
      grade: '',
    };
    render(<ScoreCard result={mockResult} onReset={mockOnReset} />);

    // Fast-forward animation
    jest.advanceTimersByTime(1500);

    // Should still render score
    await waitFor(() => {
      expect(screen.getByText('78')).toBeInTheDocument();
    });
  });

  it('handles missing message gracefully', async () => {
    const mockResult = {
      ...createMockCVResult(),
      message: '',
    };
    render(<ScoreCard result={mockResult} onReset={mockOnReset} />);

    // Fast-forward animation
    jest.advanceTimersByTime(1500);

    // Should still render score and grade
    await waitFor(() => {
      expect(screen.getByText('78')).toBeInTheDocument();
    }
  it('handles missing message gracefully', () => {
    const mockResult = {
      ...createMockCVResult(),
      message: '',
    };
    render(<ScoreCard result={mockResult} onReset={mockOnReset} />);

    // Should still render score and grade
    expect(screen.getByText('78')).toBeInTheDocument();
    expect(screen.getByText('Very Good')).toBeInTheDocument();
  });
});
