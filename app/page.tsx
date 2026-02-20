import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Showcase } from '@/components/landing/Showcase'
import { CTA } from '@/components/landing/CTA'
import { Footer } from '@/components/landing/Footer'
import { CursorGlow } from '@/components/landing/CursorGlow'

export default function LandingPage() {
  return (
    <main className="relative bg-bg overflow-x-hidden">
      <CursorGlow />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Showcase />
      <CTA />
      <Footer />
    </main>
  )
}
