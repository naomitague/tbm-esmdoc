import type { Metadata } from 'next';
import './globals.css';
import { TourProvider } from '@/components/TourProvider';
import { getTourSummaries } from '@/lib/tours';

export const metadata: Metadata = {
  title: 'RHESSys Documentation',
  description: 'Comprehensive documentation for RHESSys environmental model components',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Oranienbaum&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* The tour summaries are read here, once, so both the Navbar menu and
          the tour bar can use them without every page passing them down. */}
      <body className="antialiased bg-stone-50 text-stone-800">
        <TourProvider tours={getTourSummaries()}>{children}</TourProvider>
      </body>
    </html>
  );
}
