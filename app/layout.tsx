import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Census of India 2027 | भारत की जनगणना',
  description: 'Official Digital Self-Enumeration Portal — Phase 1: Houselisting & Housing. Ministry of Home Affairs, Government of India.',
  keywords: 'Census India 2027, जनगणना 2027, digital census, self-enumeration, houselisting',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
