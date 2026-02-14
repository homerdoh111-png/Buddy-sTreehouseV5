import '@testing-library/jest-dom';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

// Mock AudioContext
class MockAudioContext {
  createGain() { return { connect: () => {}, gain: { value: 1 } }; }
  createBufferSource() { return { connect: () => {}, start: () => {}, buffer: null }; }
  decodeAudioData() { return Promise.resolve({}); }
  createConvolver() { return { connect: () => {}, buffer: null }; }
}
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  configurable: true,
  value: MockAudioContext,
});
Object.defineProperty(window, 'webkitAudioContext', {
  writable: true,
  configurable: true,
  value: MockAudioContext,
});
