import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Portify — Portfolio for the Next Generation',
  description:
    'Build a stunning portfolio that actually represents you. Skills, projects, experience — all in one beautiful link.',
  keywords: ['portfolio', 'developer portfolio', 'Gen Z', 'resume', 'showcase'],
  openGraph: {
    title: 'Portify — Portfolio for the Next Generation',
    description: 'Build a stunning portfolio that actually represents you.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="grain-overlay">
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(13, 11, 26, 0.95)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#f8fafc',
              backdropFilter: 'blur(16px)',
            },
          }}
        />
      </body>
    </html>
  )
}
