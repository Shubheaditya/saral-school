import Link from "next/link";

export default function About() {
    return (
        <main>
            {/* Page Header */}
            <section className="px-6 py-20 bg-gradient-to-b from-pink-50 to-white text-center">
                <div className="mx-auto mb-6 w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center shadow-md animate-float">
                    <span className="text-4xl">🏫</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4">About Saral School</h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    We&apos;re a team of educators, designers, and developers building a learning platform
                    that makes quality education accessible and genuinely fun.
                </p>
            </section>

            {/* Our Mission */}
            <section className="px-6 py-20 bg-white">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-100 rounded-3xl -z-10 animate-float" />
                            {/* Visual card instead of broken image */}
                            <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-indigo-100 bouncy-hover overflow-hidden">
                                <div className="aspect-square bg-gradient-to-br from-amber-50 to-pink-50 flex flex-col items-center justify-center rounded-2xl p-8 gap-4">
                                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span className="text-5xl">🦉</span>
                                    </div>
                                    <div className="text-2xl">🎓</div>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 bg-indigo-200 rounded-lg flex items-center justify-center text-sm">📖</div>
                                        <div className="w-8 h-8 bg-emerald-200 rounded-lg flex items-center justify-center text-sm">🔬</div>
                                        <div className="w-8 h-8 bg-pink-200 rounded-lg flex items-center justify-center text-sm">🎨</div>
                                        <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center text-sm">🔢</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-900">Our Mission</h2>
                        <p className="text-lg text-slate-500 mb-6 leading-relaxed">
                            At Saral School, we believe that every child is a natural explorer.
                            Our team of educators and creators are working together to build a learning
                            platform that feels like home — warm, safe, and exciting.
                        </p>
                        <p className="text-lg text-slate-500 mb-6 leading-relaxed">
                            &quot;Saral&quot; means &quot;Simple&quot; in Hindi. Our goal is to break down complex topics
                            into bite-sized adventures that build confidence, curiosity, and a lifelong love for learning.
                        </p>
                        <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-200">
                            <p className="text-amber-800 font-semibold">
                                🚧 We&apos;re currently in the <strong>prototype development phase</strong> — building, testing, and refining the platform before our beta launch.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We're Solving */}
            <section className="px-6 py-20 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-center mb-4 text-slate-900">The Problem We&apos;re Solving</h2>
                    <p className="text-lg text-slate-500 text-center mb-14 max-w-3xl mx-auto">
                        Traditional learning tools are often boring, one-size-fits-all, and fail to keep kids engaged.
                        Parents lack visibility into how their children actually learn.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 bouncy-hover text-center">
                            <span className="text-4xl mb-4 block">😴</span>
                            <h3 className="text-xl font-bold mb-2 text-slate-900">Boring Content</h3>
                            <p className="text-slate-500">Textbook-style apps lose kids&apos; attention within minutes. We use gamification, stories, and a lovable mascot to keep them engaged.</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 bouncy-hover text-center">
                            <span className="text-4xl mb-4 block">🎯</span>
                            <h3 className="text-xl font-bold mb-2 text-slate-900">One-Size Doesn&apos;t Fit All</h3>
                            <p className="text-slate-500">A 4-year-old and a 12-year-old need completely different interfaces. Our age-adaptive UI solves this.</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 bouncy-hover text-center">
                            <span className="text-4xl mb-4 block">📊</span>
                            <h3 className="text-xl font-bold mb-2 text-slate-900">Parents Left in the Dark</h3>
                            <p className="text-slate-500">Our parent dashboard provides real, actionable insights — strengths, weaknesses, progress over time, and downloadable reports.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Development Roadmap */}
            <section className="px-6 py-20 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-center mb-4 text-slate-900">Development Roadmap</h2>
                    <p className="text-lg text-slate-500 text-center mb-16">Where we are and where we&apos;re headed.</p>

                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-2 bg-indigo-100 rounded-full hidden md:block" />

                        {[
                            { title: "Research & Design", desc: "Completed initial research with educators and child psychologists. Core curriculum framework designed for both age groups.", status: "✅ Completed", color: "bg-emerald-50 border-emerald-200", icon: "📋" },
                            { title: "Prototype Development", desc: "Building the first interactive prototypes — UI for Explorers and Scholars, Sparky animations, quiz engine, video player, and gamification system.", status: "🔨 In Progress", color: "bg-indigo-50 border-indigo-200", icon: "⚡" },
                            { title: "Beta Testing", desc: "Invite a small group of students and parents to test the platform. Measure engagement rates, task completion, and session duration.", status: "📅 Upcoming", color: "bg-amber-50 border-amber-200", icon: "🧪" },
                            { title: "Public Launch", desc: "After incorporating feedback and polishing performance (under 2s load times), open Saral School to everyone — completely free.", status: "🎯 Goal", color: "bg-pink-50 border-pink-200", icon: "🚀" },
                        ].map((item, index) => (
                            <div key={index} className={`flex flex-col md:flex-row items-center mb-12 last:mb-0 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="md:w-1/2 flex justify-center md:px-8">
                                    <div className={`${item.color} p-8 rounded-3xl border-2 shadow-sm bouncy-hover w-full`}>
                                        <span className="text-3xl mb-2 block">{item.icon}</span>
                                        <h3 className="text-xl font-extrabold mb-1 text-slate-900">{item.title}</h3>
                                        <span className="text-sm font-bold text-indigo-600 mb-2 block">{item.status}</span>
                                        <p className="text-slate-500">{item.desc}</p>
                                    </div>
                                </div>

                                <div className="z-10 w-12 h-12 bg-white border-8 border-indigo-200 rounded-full flex items-center justify-center text-sm font-bold shadow-lg my-4 md:my-0 text-slate-900">
                                    {index + 1}
                                </div>

                                <div className="md:w-1/2" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Metrics */}
            <section className="px-6 py-20 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-center mb-4 text-slate-900">How We&apos;ll Measure Success</h2>
                    <p className="text-lg text-slate-500 text-center mb-12 max-w-3xl mx-auto">
                        We&apos;re not just building features — we&apos;re tracking real engagement and learning outcomes.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { metric: "Engagement Rate", desc: "Time on Learn & Practice screens", icon: "⏱️" },
                            { metric: "Feature Adoption", desc: "% using Scoreboard, Notes, etc.", icon: "📈" },
                            { metric: "Task Completion", desc: "% completing videos & quizzes", icon: "✅" },
                            { metric: "Retention", desc: "Daily & weekly returning users", icon: "🔄" },
                        ].map((m) => (
                            <div key={m.metric} className="bg-white p-6 rounded-2xl border-2 border-slate-100 text-center bouncy-hover">
                                <span className="text-3xl block mb-3">{m.icon}</span>
                                <h4 className="font-bold text-slate-900 text-lg">{m.metric}</h4>
                                <p className="text-sm text-slate-400 mt-1">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Support */}
            <section className="px-6 py-20 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-center mb-12 text-slate-900">Why We Need Your Support</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-indigo-50 p-8 rounded-3xl border-2 border-indigo-100 bouncy-hover text-center">
                            <span className="text-4xl mb-4 block">💻</span>
                            <h3 className="text-xl font-bold mb-2 text-slate-900">Development</h3>
                            <p className="text-slate-500">Building an AI-powered, animated, adaptive platform requires a skilled team of developers, designers, and content creators.</p>
                        </div>

                        <div className="bg-emerald-50 p-8 rounded-3xl border-2 border-emerald-100 bouncy-hover text-center">
                            <span className="text-4xl mb-4 block">📚</span>
                            <h3 className="text-xl font-bold mb-2 text-slate-900">Content Assembly Line</h3>
                            <p className="text-slate-500">We run a Human-Led AI content pipeline: trained interns draft NCERT-aligned lessons using standardized prompts, then subject experts verify every piece. <Link href="/how-it-works#content-strategy" className="text-indigo-600 font-semibold hover:underline">Learn more →</Link></p>
                        </div>

                        <div className="bg-pink-50 p-8 rounded-3xl border-2 border-pink-100 bouncy-hover text-center">
                            <span className="text-4xl mb-4 block">🌍</span>
                            <h3 className="text-xl font-bold mb-2 text-slate-900">Keep It Free</h3>
                            <p className="text-slate-500">Our goal is to keep Saral School free for all children everywhere. Your donations directly fund that mission.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Donation CTA */}
            <section id="donate" className="px-6 py-20 bg-slate-50">
                <div className="max-w-4xl mx-auto bg-indigo-600 rounded-[2rem] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
                    <span className="text-5xl mb-4 block">💖</span>
                    <h2 className="text-3xl md:text-4xl font-black mb-4">Support the Future of Learning</h2>
                    <p className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto">
                        Saral School is a non-profit initiative. Every contribution helps us build accessible education for kids who need it most.
                    </p>
                    <button className="px-12 py-5 bg-white text-indigo-600 rounded-3xl text-xl font-black shadow-xl bouncy-hover">
                        Make a Donation
                    </button>
                </div>
            </section>
        </main>
    );
}
