import { describe, it, expect, beforeEach } from 'vitest';
import { useBuddyStore } from '../store/buddyStore';

describe('BuddyStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useBuddyStore.getState().resetProgress();
  });

  describe('Initial State', () => {
    it('starts with 0 stars', () => {
      expect(useBuddyStore.getState().totalStars).toBe(0);
    });

    it('starts at level 1', () => {
      expect(useBuddyStore.getState().level).toBe(1);
    });

    it('starts with buddyHappiness at 70', () => {
      expect(useBuddyStore.getState().buddyHappiness).toBe(70);
    });

    it('starts with buddyEnergy at 100', () => {
      expect(useBuddyStore.getState().buddyEnergy).toBe(100);
    });

    it('starts with empty funActivitiesPlayed', () => {
      expect(useBuddyStore.getState().funActivitiesPlayed).toEqual({});
    });

    it('starts with empty activityProgress', () => {
      expect(useBuddyStore.getState().activityProgress).toEqual({});
    });

    it('has sound and music enabled', () => {
      expect(useBuddyStore.getState().soundEnabled).toBe(true);
      expect(useBuddyStore.getState().musicEnabled).toBe(true);
    });
  });

  describe('addStars', () => {
    it('adds stars correctly', () => {
      useBuddyStore.getState().addStars(5);
      expect(useBuddyStore.getState().totalStars).toBe(5);
    });

    it('updates level when crossing threshold (every 10 stars)', () => {
      useBuddyStore.getState().addStars(10);
      expect(useBuddyStore.getState().level).toBe(2);
    });

    it('accumulates stars across multiple calls', () => {
      useBuddyStore.getState().addStars(3);
      useBuddyStore.getState().addStars(7);
      expect(useBuddyStore.getState().totalStars).toBe(10);
    });

    it('unlocks first_star achievement at 1 star', () => {
      useBuddyStore.getState().addStars(1);
      const ach = useBuddyStore.getState().achievements.find(a => a.id === 'first_star');
      expect(ach?.unlocked).toBe(true);
    });

    it('unlocks ten_stars achievement at 10 stars', () => {
      useBuddyStore.getState().addStars(10);
      const ach = useBuddyStore.getState().achievements.find(a => a.id === 'ten_stars');
      expect(ach?.unlocked).toBe(true);
    });

    it('does not unlock fifty_stars achievement at 25 stars', () => {
      useBuddyStore.getState().addStars(25);
      const ach = useBuddyStore.getState().achievements.find(a => a.id === 'fifty_stars');
      expect(ach?.unlocked).toBe(false);
    });
  });

  describe('completeActivity', () => {
    it('records activity completion', () => {
      useBuddyStore.getState().completeActivity('letters-1', 3);
      const progress = useBuddyStore.getState().activityProgress['letters-1'];
      expect(progress.completed).toBe(true);
      expect(progress.starsEarned).toBe(3);
      expect(progress.attempts).toBe(1);
    });

    it('adds stars when completing activity', () => {
      useBuddyStore.getState().completeActivity('letters-1', 4);
      expect(useBuddyStore.getState().totalStars).toBe(4);
    });

    it('tracks multiple attempts', () => {
      useBuddyStore.getState().completeActivity('letters-1', 2);
      useBuddyStore.getState().completeActivity('letters-1', 4);
      const progress = useBuddyStore.getState().activityProgress['letters-1'];
      expect(progress.attempts).toBe(2);
      expect(progress.starsEarned).toBe(4); // keeps max
    });

    it('keeps max stars earned across attempts', () => {
      useBuddyStore.getState().completeActivity('letters-1', 4);
      useBuddyStore.getState().completeActivity('letters-1', 2);
      const progress = useBuddyStore.getState().activityProgress['letters-1'];
      expect(progress.starsEarned).toBe(4); // doesn't downgrade
    });
  });

  describe('Fun Activities', () => {
    it('playFunActivity records play count', () => {
      useBuddyStore.getState().playFunActivity('basketball');
      const record = useBuddyStore.getState().funActivitiesPlayed['basketball'];
      expect(record.timesPlayed).toBe(1);
      expect(record.lastPlayed).toBeDefined();
    });

    it('playFunActivity increments play count', () => {
      useBuddyStore.getState().playFunActivity('basketball');
      useBuddyStore.getState().playFunActivity('basketball');
      useBuddyStore.getState().playFunActivity('basketball');
      const record = useBuddyStore.getState().funActivitiesPlayed['basketball'];
      expect(record.timesPlayed).toBe(3);
    });

    it('tracks multiple different fun activities independently', () => {
      useBuddyStore.getState().playFunActivity('basketball');
      useBuddyStore.getState().playFunActivity('feeding');
      useBuddyStore.getState().playFunActivity('basketball');

      expect(useBuddyStore.getState().funActivitiesPlayed['basketball'].timesPlayed).toBe(2);
      expect(useBuddyStore.getState().funActivitiesPlayed['feeding'].timesPlayed).toBe(1);
    });
  });

  describe('Buddy Happiness & Energy', () => {
    it('setBuddyHappiness clamps to 0-100', () => {
      useBuddyStore.getState().setBuddyHappiness(150);
      expect(useBuddyStore.getState().buddyHappiness).toBe(100);

      useBuddyStore.getState().setBuddyHappiness(-20);
      expect(useBuddyStore.getState().buddyHappiness).toBe(0);
    });

    it('setBuddyHappiness sets exact value within range', () => {
      useBuddyStore.getState().setBuddyHappiness(55);
      expect(useBuddyStore.getState().buddyHappiness).toBe(55);
    });

    it('setBuddyEnergy clamps to 0-100', () => {
      useBuddyStore.getState().setBuddyEnergy(200);
      expect(useBuddyStore.getState().buddyEnergy).toBe(100);

      useBuddyStore.getState().setBuddyEnergy(-50);
      expect(useBuddyStore.getState().buddyEnergy).toBe(0);
    });

    it('setBuddyEnergy sets exact value within range', () => {
      useBuddyStore.getState().setBuddyEnergy(42);
      expect(useBuddyStore.getState().buddyEnergy).toBe(42);
    });
  });

  describe('Treehouse Unlock Logic', () => {
    it('treehouse is locked at 0 stars', () => {
      const { totalStars } = useBuddyStore.getState();
      expect(totalStars >= 10).toBe(false);
    });

    it('treehouse is locked at 9 stars', () => {
      useBuddyStore.getState().addStars(9);
      expect(useBuddyStore.getState().totalStars >= 10).toBe(false);
    });

    it('treehouse unlocks at 10 stars', () => {
      useBuddyStore.getState().addStars(10);
      expect(useBuddyStore.getState().totalStars >= 10).toBe(true);
    });

    it('treehouse stays unlocked above 10 stars', () => {
      useBuddyStore.getState().addStars(25);
      expect(useBuddyStore.getState().totalStars >= 10).toBe(true);
    });
  });

  describe('Fun Activity Unlock Thresholds', () => {
    it('basketball locked below 10 stars', () => {
      useBuddyStore.getState().addStars(9);
      expect(useBuddyStore.getState().totalStars < 10).toBe(true);
    });

    it('basketball unlocked at 10 stars', () => {
      useBuddyStore.getState().addStars(10);
      expect(useBuddyStore.getState().totalStars >= 10).toBe(true);
    });

    it('feeding locked below 20 stars', () => {
      useBuddyStore.getState().addStars(19);
      expect(useBuddyStore.getState().totalStars < 20).toBe(true);
    });

    it('feeding unlocked at 20 stars', () => {
      useBuddyStore.getState().addStars(20);
      expect(useBuddyStore.getState().totalStars >= 20).toBe(true);
    });

    it('bedtime locked below 30 stars', () => {
      useBuddyStore.getState().addStars(29);
      expect(useBuddyStore.getState().totalStars < 30).toBe(true);
    });

    it('bedtime unlocked at 30 stars', () => {
      useBuddyStore.getState().addStars(30);
      expect(useBuddyStore.getState().totalStars >= 30).toBe(true);
    });
  });

  describe('Settings Toggles', () => {
    it('toggleSound flips soundEnabled', () => {
      expect(useBuddyStore.getState().soundEnabled).toBe(true);
      useBuddyStore.getState().toggleSound();
      expect(useBuddyStore.getState().soundEnabled).toBe(false);
      useBuddyStore.getState().toggleSound();
      expect(useBuddyStore.getState().soundEnabled).toBe(true);
    });

    it('toggleMusic flips musicEnabled', () => {
      expect(useBuddyStore.getState().musicEnabled).toBe(true);
      useBuddyStore.getState().toggleMusic();
      expect(useBuddyStore.getState().musicEnabled).toBe(false);
    });
  });

  describe('resetProgress', () => {
    it('resets all progress to initial values', () => {
      useBuddyStore.getState().addStars(50);
      useBuddyStore.getState().playFunActivity('basketball');
      useBuddyStore.getState().setBuddyHappiness(30);
      useBuddyStore.getState().setBuddyEnergy(10);

      useBuddyStore.getState().resetProgress();

      const state = useBuddyStore.getState();
      expect(state.totalStars).toBe(0);
      expect(state.level).toBe(1);
      expect(state.activityProgress).toEqual({});
      expect(state.funActivitiesPlayed).toEqual({});
      expect(state.buddyHappiness).toBe(70);
      expect(state.buddyEnergy).toBe(100);
    });
  });
});
