import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Analytics from "@/components/Analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6366f1',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://pikanreview.com'),
  title: {
    default: 'Pikan Review - App Store Review Analytics',
    template: '%s | Pikan Review',
  },
  description: 'Analyze iOS App Store reviews instantly. Get insights on ratings, sentiment, keywords, and regional performance. Compare apps and track review trends.',
  keywords: [
    'app store reviews',
    'ios app analytics',
    'app review analysis',
    'app store ratings',
    'mobile app reviews',
    'app sentiment analysis',
    'app store optimization',
    'ASO tool',
    'review monitoring',
    'app comparison',
    'itunes reviews',
    'apple app store',
  ],
  authors: [{ name: 'Pikan Review' }],
  creator: 'Pikan Review',
  publisher: 'Pikan Review',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pikanreview.com',
    siteName: 'Pikan Review',
    title: 'Pikan Review - App Store Review Analytics',
    description: 'Analyze iOS App Store reviews instantly. Get insights on ratings, sentiment, keywords, and regional performance.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pikan Review - App Store Analytics Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pikan Review - App Store Review Analytics',
    description: 'Analyze iOS App Store reviews instantly. Get insights on ratings, sentiment, and trends.',
    images: ['/og-image.png'],
    creator: '@pikanreview',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://pikanreview.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://umami.farimani.se/script.js" data-website-id="433d7e04-0bb5-4b17-b658-a19d88bb341f"></script>
        <link rel="preconnect" href="https://itunes.apple.com" />
        <link rel="dns-prefetch" href="https://itunes.apple.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
