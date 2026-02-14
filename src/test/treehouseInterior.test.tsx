import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TreehouseInterior from '../components/TreehouseInterior';
import { useBuddyStore } from '../store/buddyStore';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => children,
    motion: new Proxy({}, {
      get: (_target, prop) => {
        if (typeof prop === 'string') {
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

describe('TreehouseInterior', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useBuddyStore.getState().resetProgress();
  });

  it('renders Buddy\'s Room title', () => {
    render(<TreehouseInterior onBack={mockOnBack} />);
    expect(screen.getByText("Buddy's Room")).toBeInTheDocument();
  });

  it('shows star count', () => {
    useBuddyStore.getState().addStars(15);
    render(<TreehouseInterior onBack={mockOnBack} />);
    expect(screen.getByText(/15/)).toBeInTheDocument();
  });

  it('back button calls onBack', () => {
    render(<TreehouseInterior onBack={mockOnBack} />);
    fireEvent.click(screen.getByText('←'));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('shows happiness and energy bars', () => {
    render(<TreehouseInterior onBack={mockOnBack} />);
    expect(screen.getByText('Happy')).toBeInTheDocument();
    expect(screen.getByText('Energy')).toBeInTheDocument();
  });

  it('shows Buddy emoji based on state', () => {
    render(<TreehouseInterior onBack={mockOnBack} />);
    // Default state: happiness=70, energy=100 → bear emoji with "Hey there!"
    expect(screen.getByText('Hey there!')).toBeInTheDocument();
  });

  it('shows tired message when energy is low', () => {
    useBuddyStore.getState().setBuddyEnergy(10);
    render(<TreehouseInterior onBack={mockOnBack} />);
    expect(screen.getByText('Buddy is tired...')).toBeInTheDocument();
  });

  it('shows happy message when happiness is high', () => {
    useBuddyStore.getState().setBuddyHappiness(90);
    render(<TreehouseInterior onBack={mockOnBack} />);
    expect(screen.getByText('Buddy is happy!')).toBeInTheDocument();
  });

  it('shows 3 fun activity stations', () => {
    render(<TreehouseInterior onBack={mockOnBack} />);
    expect(screen.getByText('Basketball')).toBeInTheDocument();
    expect(screen.getByText('Feed Buddy')).toBeInTheDocument();
    expect(screen.getByText('Bedtime')).toBeInTheDocument();
  });

  it('locks basketball at less than 10 stars', () => {
    useBuddyStore.getState().addStars(5);
    render(<TreehouseInterior onBack={mockOnBack} />);
    // All activities should show lock indicators when insufficient stars
    const lockIcons = screen.getAllByText('🔒');
    expect(lockIcons.length).toBeGreaterThanOrEqual(3);
  });

  it('unlocks basketball at 10 stars', () => {
    useBuddyStore.getState().addStars(10);
    render(<TreehouseInterior onBack={mockOnBack} />);
    // Basketball should not show lock icon
    // But feeding and bedtime should still be locked
    const lockIcons = screen.getAllByText('🔒');
    expect(lockIcons.length).toBe(2); // only feeding + bedtime locked
  });

  it('unlocks all activities at 30 stars', () => {
    useBuddyStore.getState().addStars(30);
    render(<TreehouseInterior onBack={mockOnBack} />);
    const lockIcons = screen.queryAllByText('🔒');
    expect(lockIcons.length).toBe(0);
  });

  it('clicking unlocked basketball opens the game', () => {
    useBuddyStore.getState().addStars(10);
    render(<TreehouseInterior onBack={mockOnBack} />);

    // Find the Basketball button and click it
    const basketballBtn = screen.getByText('Basketball').closest('button');
    if (basketballBtn) {
      fireEvent.click(basketballBtn);
    }

    // Should now see basketball game content
    expect(screen.getByText('Tap the ball to shoot!')).toBeInTheDocument();
  });

  it('does not open locked activity when clicked', () => {
    useBuddyStore.getState().addStars(10);
    render(<TreehouseInterior onBack={mockOnBack} />);

    // Feed Buddy requires 20 stars, should be locked
    const feedBtn = screen.getByText('Feed Buddy').closest('button');
    if (feedBtn) {
      fireEvent.click(feedBtn);
    }

    // Should still show the room, not the feeding game
    expect(screen.getByText("Buddy's Room")).toBeInTheDocument();
  });
});
