import {
	Hero,
	LogoCloud,
	Showcase,
	BentoFeatures,
	CodeShowcase,
	HowItWorks,
	Features,
	Testimonials,
	CTA,
} from '@/features/landing'

export default function HomePage() {
	return (
		<main className='min-h-screen'>
			<Hero />
			<LogoCloud />
			<Showcase />
			<BentoFeatures />
			<CodeShowcase />
			<HowItWorks />
			<Features />
			<Testimonials />
			<CTA />
		</main>
	)
}
