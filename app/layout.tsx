import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Milford AI Exchange',
  description: 'Internal prompt, workflow and team workspace MVP for Milford Asset Management.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
