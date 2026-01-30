import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorMessage from '@/app/components/common/ErrorMessage';

describe('ErrorMessage Component', () => {
  it('renders error message', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('displays error icon', () => {
    render(<ErrorMessage message="Error occurred" />);
    expect(screen.getByText('❌')).toBeInTheDocument();
  });

  it('has alert role for accessibility', () => {
    const { container } = render(<ErrorMessage message="Error" />);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
  });

  describe('Details', () => {
    it('renders details when provided', () => {
      render(<ErrorMessage message="Error" details="Additional information" />);
      expect(screen.getByText('Additional information')).toBeInTheDocument();
    });

    it('does not render details section when not provided', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      expect(container.querySelector('.text-red-700')).not.toBeInTheDocument();
    });
  });

  describe('Suggestions', () => {
    it('renders suggestions list when provided', () => {
      const suggestions = ['Try again later', 'Check your file format', 'Contact support'];
      render(<ErrorMessage message="Error" suggestions={suggestions} />);

      expect(screen.getByText('Suggestions:')).toBeInTheDocument();
      suggestions.forEach((suggestion) => {
        expect(screen.getByText(suggestion)).toBeInTheDocument();
      });
    });

    it('does not render suggestions section when empty array', () => {
      render(<ErrorMessage message="Error" suggestions={[]} />);
      expect(screen.queryByText('Suggestions:')).not.toBeInTheDocument();
    });

    it('does not render suggestions section when not provided', () => {
      render(<ErrorMessage message="Error" />);
      expect(screen.queryByText('Suggestions:')).not.toBeInTheDocument();
    });

    it('renders bullet points for each suggestion', () => {
      const suggestions = ['First tip', 'Second tip'];
      const { container } = render(<ErrorMessage message="Error" suggestions={suggestions} />);

      const listItems = container.querySelectorAll('li');
      expect(listItems).toHaveLength(2);
    });
  });

  describe('Retry Button', () => {
    it('renders retry button when onRetry provided', () => {
      const handleRetry = jest.fn();
      render(<ErrorMessage message="Error" onRetry={handleRetry} />);

      expect(screen.getByText('Try again')).toBeInTheDocument();
    });

    it('does not render retry button when onRetry not provided', () => {
      render(<ErrorMessage message="Error" />);
      expect(screen.queryByText('Try again')).not.toBeInTheDocument();
    });

    it('calls onRetry when button clicked', () => {
      const handleRetry = jest.fn();
      render(<ErrorMessage message="Error" onRetry={handleRetry} />);

      const button = screen.getByText('Try again');
      fireEvent.click(button);

      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it('can be clicked multiple times', () => {
      const handleRetry = jest.fn();
      render(<ErrorMessage message="Error" onRetry={handleRetry} />);

      const button = screen.getByText('Try again');
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleRetry).toHaveBeenCalledTimes(2);
    });
  });

  describe('Complete Example', () => {
    it('renders all elements when all props provided', () => {
      const handleRetry = jest.fn();
      const suggestions = ['Suggestion 1', 'Suggestion 2'];

      render(
        <ErrorMessage
          message="Upload failed"
          details="File could not be processed"
          suggestions={suggestions}
          onRetry={handleRetry}
        />
      );

      expect(screen.getByText('Upload failed')).toBeInTheDocument();
      expect(screen.getByText('File could not be processed')).toBeInTheDocument();
      expect(screen.getByText('Suggestions:')).toBeInTheDocument();
      expect(screen.getByText('Suggestion 1')).toBeInTheDocument();
      expect(screen.getByText('Suggestion 2')).toBeInTheDocument();
      expect(screen.getByText('Try again')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('has red background', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      expect(container.querySelector('.bg-red-50')).toBeInTheDocument();
    });

    it('has red border', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      expect(container.querySelector('.border-red-200')).toBeInTheDocument();
    });

    it('has rounded corners', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      expect(container.querySelector('.rounded-lg')).toBeInTheDocument();
    });
  });
});
