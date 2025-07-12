import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/providers/ReduxProvider';
import ArrivzNavbar from '@/components/Header';
import ClientOnly from '@/components/ClientOnly';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Arrivz - Find Your Next Opportunity',
  description: 'Connect with professional opportunities, trusted services, and build your network. Join thousands of immigrants advancing their careers.',
  keywords: ['jobs', 'immigration', 'opportunities', 'housing', 'legal services'],
  authors: [{ name: 'Arrivz Team' }],
  creator: 'Arrivz',
  publisher: 'Arrivz Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 text-gray-900 antialiased`}>
        <ReduxProvider>
          <div className="min-h-full flex flex-col">
            <ClientOnly>
              <ArrivzNavbar />
            </ClientOnly>
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-white border-t border-gray-200 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="text-center text-sm text-gray-500">
                  © 2025 Arrivz Inc. Built with ❤️ for the immigrant community.
                </div>
              </div>
            </footer>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}