import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '@/app/components/common/Button';

describe('Button Component', () => {
  it('renders with children text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  describe('Variants', () => {
    it('renders primary variant with red background', () => {
      const { container } = render(<Button variant="primary">Primary</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-red-600');
    });

    it('renders secondary variant with gray background', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-gray-600');
    });

    it('renders outline variant with border', () => {
      const { container } = render(<Button variant="outline">Outline</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('border-red-600');
    });

    it('defaults to primary variant', () => {
      const { container } = render(<Button>Default</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-red-600');
    });
  });

  describe('Sizes', () => {
    it('renders small size', () => {
      const { container } = render(<Button size="sm">Small</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm');
    });

    it('renders medium size', () => {
      const { container } = render(<Button size="md">Medium</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-base');
    });

    it('renders large size', () => {
      const { container } = render(<Button size="lg">Large</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('px-8', 'py-4', 'text-lg');
    });

    it('defaults to medium size', () => {
      const { container } = render(<Button>Default Size</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('px-6', 'py-3');
    });
  });

  describe('Disabled State', () => {
    it('renders disabled button', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByText('Disabled');
      expect(button).toBeDisabled();
    });

    it('applies disabled styles', () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} disabled>Disabled</Button>);

      const button = screen.getByText('Disabled');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Click Handling', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      const button = screen.getByText('Click Me');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be clicked multiple times', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      const button = screen.getByText('Click Me');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Custom Props', () => {
    it('forwards custom className', () => {
      const { container } = render(<Button className="custom-class">Custom</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('custom-class');
    });

    it('accepts type prop', () => {
      const { container } = render(<Button type="submit">Submit</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('accepts aria-label', () => {
      render(<Button aria-label="Custom Label">Button</Button>);
      const button = screen.getByLabelText('Custom Label');
      expect(button).toBeInTheDocument();
    });
  });
});
