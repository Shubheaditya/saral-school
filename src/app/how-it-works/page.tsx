import Link from "next/link";

export default function HowItWorks() {
    return (
        <main>
            {/* Page Header */}
            <section className="px-6 py-20 bg-gradient-to-b from-indigo-50 to-white text-center">
                <div className="mx-auto mb-6 w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center shadow-md animate-float">
                    <span className="text-4xl">🦉</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4">How Saral School Works</h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    From onboarding to adaptive assessment to daily learning — here&apos;s how we build an education platform kids actually enjoy.
                </p>
            </section>

            {/* Onboarding Flow */}
            <section id="onboarding" className="px-6 py-20 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm mb-4">STEP 1</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Getting Started — Onboarding</h2>
                        <p className="text-lg text-slate-500 max-w-3xl mx-auto">
                            A simple, step-by-step process designed so parents can set things up and then hand the device to their child — no further interference needed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {/* New User Flow */}
                        <div className="bg-indigo-50 p-8 rounded-3xl border-2 border-indigo-200 bouncy-hover">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-14 h-14 bg-indigo-200 rounded-2xl flex items-center justify-center text-3xl">👋</div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">New User</h3>
                                    <span className="text-indigo-600 font-bold">First time setup</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { step: "1", label: "Phone number + OTP verification" },
                                    { step: "2", label: "Email (optional — skip button with report reminder)" },
                                    { step: "3", label: "Enter name & select birthdate" },
                                    { step: "4", label: "Pick a fun avatar" },
                                    { step: "5", label: "Take the adaptive assessment" },
                                    { step: "6", label: "Land on Home Screen — tap avatar to start!" },
                                ].map((s) => (
                                    <div key={s.step} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                                        <div className="w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center text-sm font-black shrink-0">{s.step}</div>
                                        <p className="text-sm text-slate-600 font-medium">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Returning User + Multi-child */}
                        <div className="space-y-8">
                            <div className="bg-emerald-50 p-8 rounded-3xl border-2 border-emerald-200 bouncy-hover">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-14 h-14 bg-emerald-200 rounded-2xl flex items-center justify-center text-3xl">🔄</div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">Returning User</h3>
                                        <span className="text-emerald-600 font-bold">Quick login</span>
                                    </div>
                                </div>
                                <p className="text-slate-500">Enter phone/email → OTP verification → choose to retake assessment or continue learning from where you left off.</p>
                            </div>

                            <div className="bg-amber-50 p-8 rounded-3xl border-2 border-amber-200 bouncy-hover">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-14 h-14 bg-amber-200 rounded-2xl flex items-center justify-center text-3xl">👨‍👩‍👧‍👦</div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">Multi-Child Support</h3>
                                        <span className="text-amber-600 font-bold">One account, multiple kids</span>
                                    </div>
                                </div>
                                <p className="text-slate-500">A small icon on the home screen lets parents add another child profile — name, age, avatar, and their own assessment. Different avatars prevent mis-clicks.</p>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-2">🔒 Safety Features</h4>
                                <ul className="text-sm text-slate-500 space-y-1">
                                    <li>• Progress bar on top shows registration progress</li>
                                    <li>• Back button to change previously filled details</li>
                                    <li>• Inline validation for invalid email/phone</li>
                                    <li>• Network error handling with data recovery</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Adaptive Assessment */}
            <section id="assessment" className="px-6 py-20 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full font-bold text-sm mb-4">STEP 2</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Adaptive Level Assessment</h2>
                        <p className="text-lg text-slate-500 max-w-3xl mx-auto">
                            India has students of all backgrounds — placing them in a level just by age would be wrong. Our assessment dynamically adjusts difficulty to find each child&apos;s true starting point.
                        </p>
                    </div>

                    {/* How it works flow */}
                    <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm mb-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">How the Assessment Works</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { icon: "📚", title: "Pick Subject", desc: "Start with any subject — Math, Science, English" },
                                { icon: "📝", title: "5 Questions", desc: "Answer 5 questions at your initial level" },
                                { icon: "⚡", title: "Auto-Adjust", desc: ">80% correct → Level Up\n<20% correct → Level Down\n20-80% → Stay Here" },
                                { icon: "🎯", title: "Level Assigned", desc: "Repeat per subject, then average Top 25%ile for final level" },
                            ].map((s) => (
                                <div key={s.title} className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <span className="text-3xl block mb-2">{s.icon}</span>
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">{s.title}</h4>
                                    <p className="text-xs text-slate-500 whitespace-pre-line">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Assessment features grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-3xl border-2 border-indigo-100 bouncy-hover">
                            <span className="text-3xl mb-3 block">🎮</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Engaging Experience</h3>
                            <ul className="text-slate-500 space-y-2 text-sm">
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> One question at a time — no overwhelm</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Visual progress bar showing completion</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Pictures, graphs &amp; diagrams in questions</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Sparky celebrates correct answers</li>
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border-2 border-emerald-100 bouncy-hover">
                            <span className="text-3xl mb-3 block">🧩</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Question Types</h3>
                            <ul className="text-slate-500 space-y-2 text-sm">
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> MCQs with text and/or images</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Fill-in-the-blank</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Drag-and-drop matching</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> 15,000+ question bank across all levels</li>
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border-2 border-pink-100 bouncy-hover">
                            <span className="text-3xl mb-3 block">💾</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Never Lose Progress</h3>
                            <ul className="text-slate-500 space-y-2 text-sm">
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Auto-saves after every answer</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Resume on app crash or accidental close</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Offline state saved on network loss</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Prompt to resume on reconnection</li>
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border-2 border-amber-100 bouncy-hover">
                            <span className="text-3xl mb-3 block">📊</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Level Assignment</h3>
                            <ul className="text-slate-500 space-y-2 text-sm">
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Per-subject level determination</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Final level = average of top 25%ile subjects</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Handles mixed ability (strong in math, weak in english)</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Retake to update level anytime</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Two Age Groups */}
            <section className="px-6 py-20 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 bg-pink-100 text-pink-700 rounded-full font-bold text-sm mb-4">STEP 3</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Your Personalized Learning Path</h2>
                        <p className="text-lg text-slate-500 text-center max-w-3xl mx-auto">
                            After the assessment, kids enter their personalized learning journey. The UI adapts to their age group.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Explorers */}
                        <div className="bg-amber-50 p-8 rounded-3xl border-2 border-amber-200 bouncy-hover">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-14 h-14 bg-amber-200 rounded-2xl flex items-center justify-center text-3xl">🌟</div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">Explorers</h3>
                                    <span className="text-amber-600 font-bold">Ages 6–9</span>
                                </div>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 font-bold text-xl mt-0.5">✓</span>
                                    <p className="text-slate-600"><strong className="text-slate-900">Big visuals, minimal text</strong> — colorful illustrations and voice-overs</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 font-bold text-xl mt-0.5">✓</span>
                                    <p className="text-slate-600"><strong className="text-slate-900">Linear guided flow</strong> — Sparky drives the &quot;next&quot; button, no complex menus</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 font-bold text-xl mt-0.5">✓</span>
                                    <p className="text-slate-600"><strong className="text-slate-900">Full-screen landscape</strong> — immersive scenes (forest, space) as homepage</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 font-bold text-xl mt-0.5">✓</span>
                                    <p className="text-slate-600"><strong className="text-slate-900">One big start button</strong> — no decisions needed, just tap and go</p>
                                </li>
                            </ul>
                        </div>

                        {/* Scholars */}
                        <div className="bg-indigo-50 p-8 rounded-3xl border-2 border-indigo-200 bouncy-hover">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-14 h-14 bg-indigo-200 rounded-2xl flex items-center justify-center text-3xl">📚</div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">Scholars</h3>
                                    <span className="text-indigo-600 font-bold">Ages 10–12</span>
                                </div>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 font-bold text-xl mt-0.5">✓</span>
                                    <p className="text-slate-600"><strong className="text-slate-900">Dashboard homepage</strong> — &quot;Welcome back!&quot; with resume-learning card</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 font-bold text-xl mt-0.5">✓</span>
                                    <p className="text-slate-600"><strong className="text-slate-900">Learn &amp; Practice tabs</strong> — bottom nav for self-directed learning</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 font-bold text-xl mt-0.5">✓</span>
                                    <p className="text-slate-600"><strong className="text-slate-900">Subject progress tracking</strong> — completion bars for all subjects</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 font-bold text-xl mt-0.5">✓</span>
                                    <p className="text-slate-600"><strong className="text-slate-900">Notes feature</strong> — timestamped notes during video lectures</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features */}
            <section className="px-6 py-20 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 text-center">Core Learning Features</h2>
                    <p className="text-lg text-slate-500 text-center max-w-3xl mx-auto mb-14">
                        Everything we&apos;re building to keep children engaged and help parents stay informed.
                    </p>

                    <div className="space-y-6">
                        {[
                            {
                                icon: "🦉",
                                title: "Sparky the Owl Mascot",
                                desc: "A friendly, animated owl that guides kids through lessons. Sparky provides instructions, offers hints, celebrates achievements, and gives gentle encouragement. Appears on homepage, quizzes, and loading screens with smooth animations.",
                                color: "bg-indigo-50 border-indigo-100",
                            },
                            {
                                icon: "📹",
                                title: "Video Lectures",
                                desc: "Full-width video player with standard controls. Scholar-mode users can take timestamped notes. A \"Next Lesson\" button keeps the momentum going.",
                                color: "bg-emerald-50 border-emerald-100",
                            },
                            {
                                icon: "🏆",
                                title: "Scoreboard & Gamification",
                                desc: "Ranked leaderboard with \"Friends\" and \"Global\" views. Each entry shows rank, avatar, name, and points. Badges, streaks, and gems provide constant positive reinforcement.",
                                color: "bg-amber-50 border-amber-100",
                            },
                            {
                                icon: "👨‍👩‍👧",
                                title: "Parent Dashboard & Reports",
                                desc: "PIN-protected dashboard with multi-child support. Shows performance by subject, strengths/weaknesses breakdown, progress-over-time graph. Download or email PDF reports — parents can see exactly where their child excels and where they need help.",
                                color: "bg-pink-50 border-pink-100",
                            },
                            {
                                icon: "🧠",
                                title: "Brain Games",
                                desc: "Fun mini-games tied to each subject, available in the Practice section. A different kind of practice that doesn't feel like studying.",
                                color: "bg-indigo-50 border-indigo-100",
                            },
                        ].map((item) => (
                            <div key={item.title} className={`flex flex-col md:flex-row items-start gap-6 ${item.color} p-8 rounded-3xl border-2 shadow-sm bouncy-hover`}>
                                <div className="text-4xl shrink-0">{item.icon}</div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Strategy */}
            <section id="content-strategy" className="px-6 py-20 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full font-bold text-sm mb-4">OUR SECRET SAUCE</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">How We Create Content</h2>
                        <p className="text-lg text-slate-500 max-w-3xl mx-auto">
                            We&apos;re building a curriculum-aligned content library for Indian K-10 students using a
                            unique &quot;Human-Led AI&quot; model — combining human expertise with AI tooling for quality at scale.
                        </p>
                    </div>

                    {/* Old vs New */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-red-50 p-8 rounded-3xl border-2 border-red-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <span className="text-2xl">❌</span> The Old Way
                            </h3>
                            <p className="text-slate-500 leading-relaxed">
                                Randomly asking AI for topics leads to chaos and inconsistency.
                                If one person prompts AI differently than another, the content feels disjointed.
                            </p>
                        </div>
                        <div className="bg-emerald-50 p-8 rounded-3xl border-2 border-emerald-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <span className="text-2xl">✅</span> Our Way: The Master SOP
                            </h3>
                            <p className="text-slate-500 leading-relaxed">
                                Like a McDonald&apos;s kitchen — every topic is made exactly the same way.
                                Standardized AI prompt templates ensure consistency across all content.
                            </p>
                        </div>
                    </div>

                    {/* Assembly Line */}
                    <h3 className="text-2xl font-black text-slate-900 mb-8 text-center">The Content Assembly Line</h3>
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row items-start gap-6 bg-indigo-50 p-8 rounded-3xl border-2 border-indigo-100 bouncy-hover">
                            <div className="bg-indigo-600 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0">
                                <span className="text-xs font-bold opacity-70">STAGE</span>
                                <span className="text-xl font-black leading-none">1</span>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900 mb-1">Drafting — &quot;The Maker&quot;</h4>
                                <p className="text-sm font-semibold text-indigo-600 mb-2">Role: Prompt Operator (College Intern)</p>
                                <p className="text-slate-500 leading-relaxed">
                                    Pick a topic from the master sheet, copy the standardized Master Prompt into ChatGPT/Claude,
                                    review the output, and save it. Output: ~10–15 topics per hour.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start gap-6 bg-emerald-50 p-8 rounded-3xl border-2 border-emerald-100 bouncy-hover">
                            <div className="bg-emerald-600 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0">
                                <span className="text-xs font-bold opacity-70">STAGE</span>
                                <span className="text-xl font-black leading-none">2</span>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900 mb-1">Quality Check — &quot;The Editor&quot;</h4>
                                <p className="text-sm font-semibold text-emerald-600 mb-2">Role: Syllabus Verifier (B.Ed Student / Subject Expert)</p>
                                <p className="text-slate-500 leading-relaxed">
                                    Is the Hinglish natural? Are examples relatable to Indian students?
                                    Is the definition NCERT-aligned? Only verified content gets &quot;APPROVED.&quot;
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start gap-6 bg-pink-50 p-8 rounded-3xl border-2 border-pink-100 bouncy-hover">
                            <div className="bg-pink-600 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0">
                                <span className="text-xs font-bold opacity-70">STAGE</span>
                                <span className="text-xl font-black leading-none">3</span>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900 mb-1">Integration — &quot;The Builder&quot;</h4>
                                <p className="text-sm font-semibold text-pink-600 mb-2">Approved content goes into the app</p>
                                <p className="text-slate-500 leading-relaxed">
                                    Content is transformed into interactive lessons and quizzes, tagged by class,
                                    chapter, and difficulty level before being deployed.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quality Guarantees */}
                    <div className="mt-12 bg-slate-50 p-8 rounded-3xl border-2 border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">Quality Guarantees</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <span className="text-3xl block mb-2">📋</span>
                                <h4 className="font-bold text-slate-900">NCERT-Aligned</h4>
                                <p className="text-sm text-slate-500">All content verified against official NCERT textbooks</p>
                            </div>
                            <div className="text-center">
                                <span className="text-3xl block mb-2">🇮🇳</span>
                                <h4 className="font-bold text-slate-900">Indian Context</h4>
                                <p className="text-sm text-slate-500">Examples and references that Indian students relate to</p>
                            </div>
                            <div className="text-center">
                                <span className="text-3xl block mb-2">🔒</span>
                                <h4 className="font-bold text-slate-900">Zero Drift</h4>
                                <p className="text-sm text-slate-500">Standardized prompts eliminate inconsistency</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Design Principles */}
            <section className="px-6 py-20 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 text-center">Design Principles</h2>
                    <p className="text-lg text-slate-500 text-center max-w-3xl mx-auto mb-12">
                        Non-negotiable standards that guide every decision.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: "⚡", title: "Under 2s Load Time", desc: "All screens, questions, and animations load in under 2 seconds." },
                            { icon: "♿", title: "Accessible", desc: "Large buttons, simple words, high-contrast colours, clear progress indicators." },
                            { icon: "🎨", title: "Consistent Design", desc: "Same colour palette, rounded corners, and sans-serif fonts everywhere." },
                            { icon: "🎭", title: "Smooth Animations", desc: "Soft fades, press-down effects, smooth progress bar fills." },
                            { icon: "🔒", title: "Child-Safe", desc: "PIN-protected parent dashboard. No ads, no external links." },
                            { icon: "📱", title: "Mobile-First", desc: "Designed for tablets and phones — how most kids access content." },
                        ].map((p) => (
                            <div key={p.title} className="bg-white p-6 rounded-2xl border-2 border-slate-100 bouncy-hover text-center">
                                <span className="text-3xl block mb-3">{p.icon}</span>
                                <h4 className="font-bold text-slate-900 mb-1">{p.title}</h4>
                                <p className="text-sm text-slate-500">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 py-16 bg-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Want to Support This Vision?</h2>
                    <p className="text-lg text-slate-500 mb-8">
                        Learn about our mission and how you can help bring Saral School to life.
                    </p>
                    <Link href="/about" className="px-10 py-5 bg-indigo-600 text-white rounded-3xl text-xl font-bold shadow-xl shadow-indigo-200 bouncy-hover inline-block">
                        About Us →
                    </Link>
                </div>
            </section>
        </main>
    );
}
