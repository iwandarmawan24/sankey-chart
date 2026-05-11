import '@testing-library/jest-dom';

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(globalThis as unknown as Record<string, unknown>).ResizeObserver = ResizeObserverStub;
