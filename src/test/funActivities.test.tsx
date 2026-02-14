import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BasketballGame from '../components/funActivities/BasketballGame';
import FeedingGame from '../components/funActivities/FeedingGame';
import BedtimeGame from '../components/funActivities/BedtimeGame';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => children,
    motion: new Proxy({}, {
      get: (_target, prop) => {
        if (typeof prop === 'string') {
          // Return a component that renders the HTML element with all props
          return ({ children, animate, initial, exit, transition, ...rest }: any) => {
            const Tag = prop as any;
            return <Tag {...rest}>{children}</Tag>;
          };
        }
        return undefined;
      },
    }),
  };
});

// Helper: find the most specific element whose textContent matches exactly
function getByTextContent(text: string) {
  return screen.getByText((_content, element) => {
    // Only match leaf-level elements (no children with the same text)
    const hasText = element?.textContent?.includes(text) ?? false;
    const childrenHaveText = Array.from(element?.children ?? []).some(
      (child) => child.textContent?.includes(text)
    );
    return hasText && !childrenHaveText;
  });
}

describe('BasketballGame', () => {
  const mockOnClose = vi.fn();
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the game with initial state', () => {
    render(<BasketballGame onClose={mockOnClose} onComplete={mockOnComplete} />);
    // Score "0 / 0" is split across multiple text nodes, use custom matcher
    expect(getByTextContent('0 / 0')).toBeInTheDocument();
    expect(screen.getByText('Tap the ball to shoot!')).toBeInTheDocument();
  });

  it('back button calls onClose', () => {
    render(<BasketballGame onClose={mockOnClose} onComplete={mockOnComplete} />);
    const backBtn = screen.getByText('←');
    fireEvent.click(backBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shooting increments attempts after animation', () => {
    render(<BasketballGame onClose={mockOnClose} onComplete={mockOnComplete} />);
    const ballButton = screen.getByRole('button', { name: /🏀/i });
    fireEvent.pointerDown(ballButton);

    // After 800ms, attempt is recorded
    act(() => { vi.advanceTimersByTime(800); });

    // Attempts should now be 1
    expect(screen.getByText(/\/ 1/)).toBeInTheDocument();
  });

  it('shows game over after 10 shots', () => {
    render(<BasketballGame onClose={mockOnClose} onComplete={mockOnComplete} />);

    for (let i = 0; i < 10; i++) {
      // Re-query the ball button each iteration since React re-renders
      const ballButton = screen.getByRole('button', { name: /🏀/i });
      fireEvent.pointerDown(ballButton);
      // 800ms for shot to resolve + 1200ms for cooldown = 2000ms total per shot
      act(() => { vi.advanceTimersByTime(2000); });
    }

    expect(screen.getByText('Game Over!')).toBeInTheDocument();
  });

  it('play again resets the game', () => {
    render(<BasketballGame onClose={mockOnClose} onComplete={mockOnComplete} />);

    for (let i = 0; i < 10; i++) {
      const ballButton = screen.getByRole('button', { name: /🏀/i });
      fireEvent.pointerDown(ballButton);
      act(() => { vi.advanceTimersByTime(2000); });
    }

    expect(screen.getByText('Game Over!')).toBeInTheDocument();

    // Click Play Again
    fireEvent.click(screen.getByText('Play Again'));
    expect(getByTextContent('0 / 0')).toBeInTheDocument();
  });

  it('done button calls onComplete and onClose', () => {
    render(<BasketballGame onClose={mockOnClose} onComplete={mockOnComplete} />);

    for (let i = 0; i < 10; i++) {
      const ballButton = screen.getByRole('button', { name: /🏀/i });
      fireEvent.pointerDown(ballButton);
      act(() => { vi.advanceTimersByTime(2000); });
    }

    expect(screen.getByText('Game Over!')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Done'));
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe('FeedingGame', () => {
  const mockOnClose = vi.fn();
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with initial state', () => {
    render(<FeedingGame onClose={mockOnClose} onComplete={mockOnComplete} />);
    expect(screen.getByText('Feed Buddy!')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('Happiness')).toBeInTheDocument();
  });

  it('back button calls onClose', () => {
    render(<FeedingGame onClose={mockOnClose} onComplete={mockOnComplete} />);
    fireEvent.click(screen.getByText('←'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('tapping food triggers eating sequence', () => {
    render(<FeedingGame onClose={mockOnClose} onComplete={mockOnComplete} />);

    const appleButton = screen.getByText('🍎');
    fireEvent.pointerDown(appleButton);

    // After food flies to Buddy (500ms), happiness updates
    act(() => { vi.advanceTimersByTime(500); });

    // Happiness should be 15 now (apple gives 15)
    expect(screen.getByText('15%')).toBeInTheDocument();
  });

  it('shows reaction text when feeding healthy food', () => {
    render(<FeedingGame onClose={mockOnClose} onComplete={mockOnComplete} />);

    fireEvent.pointerDown(screen.getByText('🍎'));
    act(() => { vi.advanceTimersByTime(500); });

    expect(screen.getByText('Yummy and healthy!')).toBeInTheDocument();
  });

  it('shows different reaction for unhealthy food', () => {
    render(<FeedingGame onClose={mockOnClose} onComplete={mockOnComplete} />);

    fireEvent.pointerDown(screen.getByText('🍕'));
    act(() => { vi.advanceTimersByTime(500); });

    expect(screen.getByText('Mmm, so tasty!')).toBeInTheDocument();
  });

  it('completes game after max feedings', () => {
    render(<FeedingGame onClose={mockOnClose} onComplete={mockOnComplete} />);

    // Feed 6 times (maxFeedings)
    for (let i = 0; i < 6; i++) {
      const buttons = screen.getAllByRole('button').filter(b => !b.textContent?.includes('←'));
      const enabledButton = buttons.find(b => !b.hasAttribute('disabled'));
      if (enabledButton) {
        fireEvent.pointerDown(enabledButton);
        act(() => { vi.advanceTimersByTime(500); }); // food reaches
        act(() => { vi.advanceTimersByTime(600); }); // eating done
        act(() => { vi.advanceTimersByTime(800); }); // reaction clears
      }
    }

    expect(screen.getByText('Buddy is full!')).toBeInTheDocument();
  });
});

describe('BedtimeGame', () => {
  const mockOnClose = vi.fn();
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with initial state', () => {
    render(<BedtimeGame onClose={mockOnClose} onComplete={mockOnComplete} />);
    expect(screen.getByText('Bedtime')).toBeInTheDocument();
    expect(screen.getByText('Tap Buddy to walk to bed')).toBeInTheDocument();
  });

  it('back button calls onClose', () => {
    render(<BedtimeGame onClose={mockOnClose} onComplete={mockOnComplete} />);
    fireEvent.click(screen.getByText('←'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('tapping Buddy starts walking step', () => {
    render(<BedtimeGame onClose={mockOnClose} onComplete={mockOnComplete} />);

    const buddyButton = screen.getByText('🐻');
    fireEvent.click(buddyButton);

    expect(screen.getByText('Buddy is walking to bed...')).toBeInTheDocument();
  });

  it('Buddy arrives in bed after walking', () => {
    render(<BedtimeGame onClose={mockOnClose} onComplete={mockOnComplete} />);

    fireEvent.click(screen.getByText('🐻'));

    // Walking takes 1200ms
    act(() => { vi.advanceTimersByTime(1200); });

    expect(screen.getByText('Tap to tuck Buddy in')).toBeInTheDocument();
  });

  it('full bedtime sequence completes', () => {
    render(<BedtimeGame onClose={mockOnClose} onComplete={mockOnComplete} />);

    // Step 1: Tap Buddy to walk
    fireEvent.click(screen.getByText('🐻'));
    act(() => { vi.advanceTimersByTime(1200); }); // walking done

    // Step 2: Tap to tuck in (Buddy is now in bed, still showing bear emoji)
    fireEvent.click(screen.getByText('🐻'));

    expect(screen.getByText('Tap the lamp to turn off lights')).toBeInTheDocument();

    // Step 3: Find the lamp button and click it
    const buttons = screen.getAllByRole('button');
    const lampButton = buttons.find(b =>
      !b.textContent?.includes('←') && !b.textContent?.includes('🐻') && !b.textContent?.includes('😊')
    );
    if (lampButton) {
      fireEvent.click(lampButton);
    }

    // Lights off -> sleeping
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByText('Sweet dreams, Buddy!')).toBeInTheDocument();

    // Completion overlay appears after 2500ms
    act(() => { vi.advanceTimersByTime(2500); });
    expect(screen.getByText('Sweet Dreams!')).toBeInTheDocument();

    // Click Goodnight
    fireEvent.click(screen.getByText('Goodnight!'));
    expect(mockOnComplete).toHaveBeenCalledWith(100);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
