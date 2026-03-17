import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-16 pb-24 text-center overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
        {/* Floating decorative elements */}
        <div className="absolute top-16 left-[10%] w-16 h-16 bg-amber-200 rounded-2xl rotate-12 opacity-60 animate-float" />
        <div className="absolute top-32 right-[15%] w-12 h-12 bg-pink-200 rounded-full opacity-60 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-[20%] w-10 h-10 bg-emerald-200 rounded-xl opacity-50 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-60 right-[10%] w-14 h-14 bg-indigo-200 rounded-2xl -rotate-12 opacity-50 animate-float" style={{ animationDelay: '3s' }} />

        <div className="z-10 max-w-4xl">
          {/* Sparky the Owl Mascot */}
          <div className="mx-auto mb-8 w-32 h-32 relative">
            <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center shadow-lg shadow-indigo-100 animate-float">
              <span className="text-7xl">🦉</span>
            </div>
            <div className="absolute -top-2 -right-1 text-3xl rotate-12">🎓</div>
          </div>

          <p className="text-indigo-600 font-bold text-lg mb-3 tracking-wide uppercase">Meet Sparky, Your Learning Buddy!</p>

          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-5 py-2 mb-6">
            <span className="text-emerald-600 text-sm font-bold">🌱 Quality education, accessible to all</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-slate-900">
            Learning Made <br />
            <span className="text-indigo-600 bg-indigo-100 px-5 py-1 rounded-3xl inline-block mt-2">Simple &amp; Fun</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            A premium gamified learning platform built specifically for <strong className="text-slate-700">underprivileged students</strong>.
            Designed for kids aged 6-12, priced so every family can afford it, and guided by Sparky the Owl.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/app" className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white rounded-3xl text-xl font-bold shadow-xl shadow-emerald-200 bouncy-hover inline-block text-center">
              ▶ Get the App - Free
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-3xl text-xl font-bold shadow-xl shadow-indigo-200 bouncy-hover inline-block text-center">
              See How It Works
            </Link>
            <Link href="/about" className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-indigo-200 text-slate-700 rounded-3xl text-xl font-bold bouncy-hover inline-block text-center shadow-sm">
              About Our Mission
            </Link>
          </div>
        </div>

        {/* App Preview Cards */}
        <div className="mt-20 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Easy Onboarding */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-50 border-2 border-indigo-100 bouncy-hover">
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-amber-50 to-pink-50 rounded-2xl flex flex-col items-center justify-center mb-4 p-4 gap-2">
              <span className="text-4xl">👋</span>
              <div className="w-full space-y-1.5">
                <div className="bg-white rounded-lg p-1.5 shadow-sm flex items-center gap-2 text-xs">
                  <span>📱</span> <span className="text-slate-500">Phone Verified ✓</span>
                </div>
                <div className="bg-white rounded-lg p-1.5 shadow-sm flex items-center gap-2 text-xs">
                  <span>👤</span> <span className="text-slate-500">Name & Age</span>
                </div>
                <div className="bg-white rounded-lg p-1.5 shadow-sm flex items-center gap-2 text-xs">
                  <span>🎭</span> <span className="text-slate-500">Pick Avatar</span>
                </div>
              </div>
            </div>
            <h3 className="font-bold text-lg text-slate-900">Step-by-Step Onboarding</h3>
            <p className="text-slate-400 text-sm">Simple, guided signup. Parents set up, kids just pick an avatar and start.</p>
          </div>

          {/* Card 2: Adaptive Assessment */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-50 border-2 border-emerald-100 bouncy-hover">
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-emerald-50 to-indigo-50 rounded-2xl flex flex-col items-center justify-center mb-4 p-4">
              <div className="w-full bg-white rounded-xl p-3 shadow-sm mb-2">
                <div className="w-3/4 h-2 bg-indigo-200 rounded-full mb-2"><div className="w-1/2 h-2 bg-indigo-500 rounded-full"></div></div>
                <div className="text-xs text-slate-500 font-semibold">What is 5 + 3?</div>
              </div>
              <div className="flex gap-2 w-full">
                <div className="flex-1 bg-indigo-100 rounded-lg py-1 text-center text-xs font-bold text-indigo-700">6</div>
                <div className="flex-1 bg-emerald-100 rounded-lg py-1 text-center text-xs font-bold text-emerald-700">8 ✓</div>
                <div className="flex-1 bg-indigo-100 rounded-lg py-1 text-center text-xs font-bold text-indigo-700">7</div>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-xs text-emerald-600 font-bold">⬆ Level Up!</span>
              </div>
            </div>
            <h3 className="font-bold text-lg text-slate-900">Adaptive Assessment</h3>
            <p className="text-slate-400 text-sm">Difficulty adjusts in real-time. Gets harder when you&apos;re acing it, easier when you&apos;re stuck.</p>
          </div>

          {/* Card 3: Scholar Dashboard */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-50 border-2 border-pink-100 bouncy-hover">
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-pink-50 to-amber-50 rounded-2xl flex flex-col items-center justify-center mb-4 p-4">
              <div className="text-xs font-bold text-slate-500 mb-2 self-start">📚 Subjects</div>
              <div className="w-full space-y-2">
                <div className="bg-white rounded-lg p-2 shadow-sm flex items-center gap-2">
                  <span className="text-sm">🔢</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-700">Math</div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full"><div className="w-3/4 h-1.5 bg-indigo-500 rounded-full"></div></div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 shadow-sm flex items-center gap-2">
                  <span className="text-sm">🔬</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-700">Science</div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full"><div className="w-1/2 h-1.5 bg-emerald-500 rounded-full"></div></div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 shadow-sm flex items-center gap-2">
                  <span className="text-sm">📖</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-700">English</div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full"><div className="w-2/3 h-1.5 bg-pink-500 rounded-full"></div></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="font-bold text-lg text-slate-900">Personalized Dashboard</h3>
            <p className="text-slate-400 text-sm">Track progress per subject. Resume learning right where you left off.</p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900">What Makes Saral School Special</h2>
            <p className="text-xl text-slate-500">A high-quality platform designed around how kids actually learn best, at a price that makes sense for underprivileged communities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 md:row-span-2 bg-indigo-50 p-8 rounded-3xl shadow-sm border-2 border-indigo-100 bouncy-hover flex flex-col justify-between">
              <div>
                <span className="text-4xl mb-4 block">📋</span>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Adaptive Level Assessment</h3>
                <p className="text-lg text-slate-500">Instead of placing students by age alone, we use a dynamic assessment that adjusts in real-time. Score &gt;80%? Level up. Below 20%? Step back. The result: every child lands at exactly the right starting point.</p>
              </div>
              <div className="mt-6 flex items-center gap-3 flex-wrap">
                <div className="px-3 py-1 bg-indigo-200 rounded-full text-xs font-bold text-indigo-700">🎯 15,000+ Questions</div>
                <div className="px-3 py-1 bg-indigo-200 rounded-full text-xs font-bold text-indigo-700">📊 Real-Time Adapt</div>
                <div className="px-3 py-1 bg-indigo-200 rounded-full text-xs font-bold text-indigo-700">🔄 Retake Anytime</div>
              </div>
            </div>

            <div className="md:col-span-2 bg-pink-50 p-8 rounded-3xl shadow-sm border-2 border-pink-100 bouncy-hover">
              <span className="text-4xl mb-4 block">🦉</span>
              <h3 className="text-2xl font-bold mb-2 text-slate-900">Sparky, Your AI Guide</h3>
              <p className="text-lg text-slate-500">A friendly owl mascot that gives hints, celebrates wins, and encourages kids when they get stuck. Always there, never judging.</p>
            </div>

            <div className="bg-amber-50 p-8 rounded-3xl shadow-sm border-2 border-amber-100 bouncy-hover">
              <span className="text-4xl mb-4 block">👶</span>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Age-Adaptive UI</h3>
              <p className="text-slate-500">Explorers (6-9) get big visuals &amp; guided flow. Scholars (10-12) get dashboards &amp; self-pacing.</p>
            </div>

            <div className="bg-emerald-50 p-8 rounded-3xl shadow-sm border-2 border-emerald-100 bouncy-hover">
              <span className="text-4xl mb-4 block">👨‍👩‍👧</span>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Parent Reports</h3>
              <p className="text-slate-500">Clear visual reports on strengths &amp; weaknesses. Download as PDF or get it emailed automatically.</p>
            </div>

            <div className="md:col-span-2 bg-emerald-50 p-8 rounded-3xl shadow-sm border-2 border-emerald-100 bouncy-hover">
              <span className="text-4xl mb-4 block">🚀</span>
              <h3 className="text-2xl font-bold mb-2 text-slate-900">Frictionless Onboarding</h3>
              <p className="text-lg text-slate-500">Parents register with phone &amp; email, create a profile with name, age &amp; avatar - then hand the device to their child. Multi-child support under one account. Kids just tap their avatar and start learning.</p>
            </div>

            <div className="bg-indigo-50 p-8 rounded-3xl shadow-sm border-2 border-indigo-100 bouncy-hover">
              <span className="text-4xl mb-4 block">🎮</span>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Gamified Learning</h3>
              <p className="text-slate-500">Earn badges, build streaks, and climb leaderboards. Every lesson is a quest.</p>
            </div>

            <div className="bg-pink-50 p-8 rounded-3xl shadow-sm border-2 border-pink-100 bouncy-hover">
              <span className="text-4xl mb-4 block">💾</span>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Auto-Save Progress</h3>
              <p className="text-slate-500">Close the app mid-assessment? No problem. Progress saves after every answer. Resume anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-3xl p-8 shadow-md border-2 border-emerald-100 bouncy-hover">
            <span className="text-4xl mb-4 block">🌍</span>
            <h3 className="text-xl font-bold mb-2 text-slate-900">Built for Underprivileged Students</h3>
            <p className="text-slate-500 text-sm">We design specifically for the students who need it most, bringing world-class interactive education to children in underserved areas.</p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-md border-2 border-amber-100 bouncy-hover">
            <span className="text-4xl mb-4 block">💰</span>
            <h3 className="text-xl font-bold mb-2 text-slate-900">Radically Affordable</h3>
            <p className="text-slate-500 text-sm">Premium learning shouldn&apos;t come with a premium price tag. Saral School is priced at a fraction of typical ed-tech platforms, because access should never be a barrier.</p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-md border-2 border-pink-100 bouncy-hover">
            <span className="text-4xl mb-4 block">📱</span>
            <h3 className="text-xl font-bold mb-2 text-slate-900">Works on Any Device</h3>
            <p className="text-slate-500 text-sm">No expensive tablets required. Saral School runs smoothly on basic smartphones — the device most families already own.</p>
          </div>
        </div>
      </section>

      {/* Download / Get the App Section */}
      <section id="download" className="px-6 py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-5xl mb-4 block">📲</span>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900">Get Saral School</h2>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto">Works everywhere — phones, tablets, laptops. No app store needed. Just open and start learning.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-slate-100 bouncy-hover text-center">
              <span className="text-4xl mb-3 block">🤖</span>
              <h3 className="font-bold text-lg text-slate-900 mb-1">Android</h3>
              <p className="text-slate-400 text-sm">Add to home screen from your browser — works like a native app.</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-slate-100 bouncy-hover text-center">
              <span className="text-4xl mb-3 block">🍎</span>
              <h3 className="font-bold text-lg text-slate-900 mb-1">iPhone & iPad</h3>
              <p className="text-slate-400 text-sm">Tap Share → Add to Home Screen. Full-screen, no ads, no installs.</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-slate-100 bouncy-hover text-center">
              <span className="text-4xl mb-3 block">💻</span>
              <h3 className="font-bold text-lg text-slate-900 mb-1">Laptop & Desktop</h3>
              <p className="text-slate-400 text-sm">Open in any browser — Chrome, Edge, Firefox. Nothing to download.</p>
            </div>
          </div>

          <Link href="/app" className="inline-block px-12 py-5 bg-emerald-600 text-white rounded-3xl text-xl font-bold shadow-xl shadow-emerald-200 bouncy-hover">
            🚀 Launch Saral School — It&apos;s Free
          </Link>
          <p className="text-slate-400 text-sm mt-4">No sign-up required to explore. Create an account when you&apos;re ready.</p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto bg-indigo-600 rounded-[2rem] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
          <span className="text-5xl mb-4 block">🚀</span>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Quality Education for All</h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto">
            Saral School is on a mission to bring joyful, affordable, and high-quality education to underprivileged communities. Join us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/how-it-works" className="px-8 py-4 bg-white text-indigo-600 rounded-2xl text-lg font-bold shadow-lg bouncy-hover">
              How It Works →
            </Link>
            <Link href="/about#donate" className="px-8 py-4 border-2 border-white/30 text-white rounded-2xl text-lg font-bold bouncy-hover">
              Support Us 💖
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
