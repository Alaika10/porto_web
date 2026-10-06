import { vi } from 'vitest';

// Mock next/font/google — these constructors are Next.js server-only and
// cannot run in the jsdom environment.
vi.mock('next/font/google', () => ({
  Plus_Jakarta_Sans: () => ({ variable: '--font-jakarta', className: 'font-jakarta' }),
  Dancing_Script: () => ({ variable: '--font-dancing', className: 'font-dancing' }),
}));

// Mock next/navigation if needed by any component tests
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));
