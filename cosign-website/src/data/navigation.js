// Navigation configuration
export const NAV_LINKS = [
  { href: '#home', label: 'Home', testId: 'nav-link-home' },
  { href: '#features', label: 'Features', testId: 'nav-link-features' },
  { href: '#pricing', label: 'Pricing', testId: 'nav-link-pricing' },
  { href: '#support', label: 'Support', testId: 'nav-link-support' },
  {
    href: 'https://github.com/apps/cosign-github',
    label: 'View GitHub App',
    testId: 'nav-link-launch',
    isExternal: true,
    isCta: true,
  },
];

export const BRAND = {
  name: 'Innershell • Cosign',
  logoAlt: '',
  logoWidth: 28,
  logoHeight: 28,
};

export const CONTACT_REASONS = [
  { value: 'general', label: 'General question' },
  { value: 'pricing', label: "I'd like pricing details" },
  { value: 'beta', label: "I'd like to request beta access" },
];

export const FOOTER = {
  copyright: '© 2026 Innershell. All rights reserved.',
  githubAppUrl: 'https://github.com/apps/cosign-github',
};