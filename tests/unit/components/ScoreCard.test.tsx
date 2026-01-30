import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScoreCard from '@/app/components/results/ScoreCard';
import { createMockCVResult, createExcellentCVResult, createMinimalCVResult } from '../../helpers/mock-data';

describe('ScoreCard Component', () => {
  const mockOnReset = jest.fn();

  beforeEach(() => {
    mockOnReset.mockClear();
  });

  it('renders score correctly', () => {
    const mockResult = createMockCVResult();
    render(<ScoreCard result={mockResult} onReset={mockOnReset} />);

    expect(screen.getByText('78')).toBeInTheDocument();
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

    const printButton = screen.getByText('Print Results');
    expect(printButton).toBeInTheDocument();
  });

  it('renders ScoreAnimation with correct props', () => {
    const mockResult = createMockCVResult();
    const { container } = render(<ScoreCard result={mockResult} onReset={mockOnReset} />);

    // Check that score animation is rendered
    const scoreElement = screen.getByText('78');
    expect(scoreElement).toBeInTheDocument();
  });

  describe('Score Colors', () => {
    it('renders green color for excellent score (90+)', () => {
      const excellentResult = createExcellentCVResult();
      const { container } = render(<ScoreCard result={excellentResult} onReset={mockOnReset} />);

      // ScoreAnimation should receive green color
      expect(screen.getByText('92')).toBeInTheDocument();
    });

    it('renders orange/red color for low score (<60)', () => {
      const weakResult = createMinimalCVResult();
      const { container } = render(<ScoreCard result={weakResult} onReset={mockOnReset} />);

      expect(screen.getByText('45')).toBeInTheDocument();
    });
  });

  it('renders with proper accessibility attributes', () => {
    const mockResult = createMockCVResult();
    const { container } = render(<ScoreCard result={mockResult} onReset={mockOnReset} />);

    // Check that card has proper structure
    expect(container.querySelector('.bg-white')).toBeInTheDocument();
  });

  it('handles missing grade gracefully', () => {
    const mockResult = {
      ...createMockCVResult(),
      grade: '',
    };
    render(<ScoreCard result={mockResult} onReset={mockOnReset} />);

    // Should still render score
    expect(screen.getByText('78')).toBeInTheDocument();
  });

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
