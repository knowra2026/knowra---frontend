import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
			<header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold shadow">
						K
					</div>
					<div className="text-lg font-semibold">Knowra</div>
				</div>

				<nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
					<a href="#features" className="hover:text-slate-900">Features</a>
					<a href="#pricing" className="hover:text-slate-900">Pricing</a>
					<a href="#about" className="hover:text-slate-900">About</a>
					<Link to="/login" className="px-3 py-1 border border-transparent hover:border-slate-200 rounded-md">Log in</Link>
					<Link to="/signup" className="px-4 py-2 ml-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">Get started</Link>
				</nav>

				<div className="md:hidden">
					{/* Mobile: simple menu button (non-functional placeholder) */}
					<button aria-label="open menu" className="p-2 rounded-md border border-transparent hover:bg-slate-200">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
							<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
				</div>
			</header>

			<main className="max-w-6xl mx-auto px-6 py-12">
				<section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
					<div>
						<h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">Organize your learning, faster.</h1>
						<p className="mt-4 text-lg text-slate-700 max-w-xl">Knowra helps you capture what matters, summarize key ideas, and keep everything searchable — so you learn more with less friction.</p>

						<div className="mt-6 flex flex-wrap gap-3">
							<Link to="/signup" className="inline-flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg shadow">Get started — free</Link>
							<a href="#features" className="inline-flex items-center gap-2 px-4 py-3 border border-slate-200 bg-white rounded-lg text-slate-700 hover:bg-slate-50">See features</a>
						</div>

						<div className="mt-8 flex items-center gap-6 text-sm text-slate-600">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">⭐</div>
								<div>
									<div className="font-semibold">4.9</div>
									<div className="text-xs">Average rating</div>
								</div>
							</div>

							<div className="border-l border-slate-200 h-6" />

							<div className="text-sm">Trusted by solo learners and small teams — 10,000+ signups</div>
						</div>
					</div>

					<div className="bg-gradient-to-tr from-white to-slate-50 rounded-3xl p-6 border border-slate-100 shadow-xl">
						<div className="rounded-xl bg-gradient-to-b from-indigo-50 to-white border border-slate-100 p-4">
							<div className="p-4 rounded-md bg-white border border-slate-100">
								<div className="flex items-start justify-between gap-4">
									<div>
										<div className="text-sm text-slate-400">Your latest notes</div>
										<h3 className="font-semibold mt-2 text-slate-900">How to get more from study sessions</h3>
										<p className="mt-2 text-sm text-slate-600">Quick summary — focusing on active recall, spaced repetition, and deliberate practice.</p>
									</div>

									<div className="text-xs text-slate-400">2 hours ago</div>
								</div>
							</div>

							<div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
								<div className="p-3 bg-white border border-slate-100 rounded-md">Summarize</div>
								<div className="p-3 bg-white border border-slate-100 rounded-md">Highlight</div>
								<div className="p-3 bg-white border border-slate-100 rounded-md">Tags</div>
								<div className="p-3 bg-white border border-slate-100 rounded-md">Share</div>
							</div>
						</div>
					</div>
				</section>

				<section id="features" className="mt-16">
					<div className="max-w-3xl text-center mx-auto">
						<h2 className="text-2xl font-bold">Powerful building blocks for learning</h2>
						<p className="mt-3 text-slate-600">Everything you need to collect, summarize and reuse knowledge. Simple, fast, and private by default.</p>
					</div>

					<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						<div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
							<div className="text-2xl font-semibold">AI Summaries</div>
							<p className="mt-3 text-sm text-slate-600">Generate short, accurate summaries of notes, articles, or lectures in one click.</p>
						</div>

						<div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
							<div className="text-2xl font-semibold">Organize with tags</div>
							<p className="mt-3 text-sm text-slate-600">Flexible tagging and collections to keep related ideas together and easy to find.</p>
						</div>

						<div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
							<div className="text-2xl font-semibold">Secure & Private</div>
							<p className="mt-3 text-sm text-slate-600">Authentication, export, and secure storage so your learning remains yours.</p>
						</div>

						<div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
							<div className="text-2xl font-semibold">Searchable Knowledge</div>
							<p className="mt-3 text-sm text-slate-600">Full-text search across notes and summaries so you can quickly rediscover ideas.</p>
						</div>

						<div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
							<div className="text-2xl font-semibold">Collaboration</div>
							<p className="mt-3 text-sm text-slate-600">Share workspaces, comment, and co-edit for group learning and small teams.</p>
						</div>

						<div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
							<div className="text-2xl font-semibold">Export & Backup</div>
							<p className="mt-3 text-sm text-slate-600">Export your work to standard formats and keep a local backup anytime.</p>
						</div>
					</div>
				</section>

				<section id="cta" className="mt-16 bg-indigo-600 text-white rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
					<div>
						<h3 className="text-xl font-bold">Ready to level up your learning?</h3>
						<p className="mt-2 text-sm text-indigo-100 max-w-md">Sign up for a free account and start collecting and summarizing notes with built-in AI tools.</p>
					</div>

					<div className="flex gap-3 items-center">
						<Link to="/signup" className="px-5 py-3 bg-white text-indigo-700 rounded-lg font-semibold hover:opacity-95">Create account</Link>
						<a href="#features" className="px-4 py-3 border border-white/20 rounded-lg text-white/90 hover:bg-white/5">Learn more</a>
					</div>
				</section>

				<footer className="mt-14 border-t border-slate-200 pt-8 text-sm text-slate-600 flex flex-col md:flex-row items-center justify-between gap-4">
					<div>© {new Date().getFullYear()} Knowra — Built with 💙</div>

					<div className="flex items-center gap-4">
						<a href="#" className="hover:text-slate-900">Privacy</a>
						<a href="#" className="hover:text-slate-900">Terms</a>
						<a href="#" className="hover:text-slate-900">Contact</a>
					</div>
				</footer>
			</main>
		</div>
	)
}

