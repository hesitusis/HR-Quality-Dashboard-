import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Hazard Report Quality Dashboard ITU - SISADMO',
  description: 'Monitoring & Penilaian Kualitas Hazard Report Berbasis AI untuk PT Indotruck Utama & SISADMO.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Hazard Report Quality Dashboard ITU - SISADMO',
    description: 'Monitoring & Penilaian Kualitas Hazard Report Berbasis AI untuk PT Indotruck Utama & SISADMO.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hazard Report Quality Dashboard ITU - SISADMO',
    description: 'Monitoring & Penilaian Kualitas Hazard Report Berbasis AI untuk PT Indotruck Utama & SISADMO.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
