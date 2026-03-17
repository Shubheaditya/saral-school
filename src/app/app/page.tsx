import Link from "next/link";

export default function AppPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-slate-50">
      {/* Hero */}
      <section className="px-6 pt-16 pb-12 text-center">
        <div className="mx-auto mb-6 w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center shadow-lg shadow-indigo-100 animate-float">
          <span className="text-6xl">🦉</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black mb-4 text-slate-900">
          Get Saral School
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-2">
          Start learning right away. Choose how you want to use Saral School.
        </p>
        <p className="text-sm text-emerald-600 font-bold">
          100% Free. No hidden charges.
        </p>
      </section>

      {/* Two Main Options */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Option 1: Use from Web */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-emerald-200 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
              Recommended
            </div>
            <span className="text-5xl mb-5 block">🌐</span>
            <h2 className="text-2xl font-black text-slate-900 mb-3">Use from Web</h2>
            <p className="text-slate-500 mb-6">
              No download needed. Open Saral School directly in your browser and start learning instantly. Works on any device.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <span className="text-emerald-500 font-bold">✓</span> No installation required
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <span className="text-emerald-500 font-bold">✓</span> Works on phone, tablet, and laptop
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <span className="text-emerald-500 font-bold">✓</span> Always up to date
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <span className="text-emerald-500 font-bold">✓</span> Zero storage space needed
              </li>
            </ul>

            <Link
              href="/learn"
              className="block w-full py-4 bg-emerald-600 text-white rounded-2xl text-lg font-bold text-center shadow-lg shadow-emerald-200 bouncy-hover"
            >
              🚀 Open Saral School
            </Link>
            <p className="text-xs text-slate-400 mt-3 text-center">Opens in your browser</p>
          </div>

          {/* Option 2: Download App */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-indigo-200 relative overflow-hidden">
            <span className="text-5xl mb-5 block">📲</span>
            <h2 className="text-2xl font-black text-slate-900 mb-3">Download the App</h2>
            <p className="text-slate-500 mb-6">
              Install Saral School on your device for a faster, app-like experience. Available for all platforms.
            </p>

            <div className="space-y-3 mb-8">
              {/* Android */}
              <button className="flex items-center gap-4 w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 bouncy-hover text-left">
                <span className="text-3xl">🤖</span>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Android</p>
                  <p className="text-xs text-slate-400">Download APK (Coming Soon)</p>
                </div>
                <span className="ml-auto text-indigo-400 text-xl">→</span>
              </button>

              {/* iOS */}
              <button className="flex items-center gap-4 w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 bouncy-hover text-left">
                <span className="text-3xl">🍎</span>
                <div>
                  <p className="font-bold text-slate-900 text-sm">iPhone & iPad</p>
                  <p className="text-xs text-slate-400">Add to Home Screen (Guide below)</p>
                </div>
                <span className="ml-auto text-indigo-400 text-xl">→</span>
              </button>

              {/* Windows / Desktop */}
              <button className="flex items-center gap-4 w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 bouncy-hover text-left">
                <span className="text-3xl">💻</span>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Windows / Mac / Linux</p>
                  <p className="text-xs text-slate-400">Install as Desktop App (Coming Soon)</p>
                </div>
                <span className="ml-auto text-indigo-400 text-xl">→</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 text-center">
              Native app downloads launching soon. Use the web version in the meantime!
            </p>
          </div>
        </div>
      </section>

      {/* How to Install Guide */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-4">How to Install on Your Device</h2>
          <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
            Saral School works as a Progressive Web App (PWA). You can add it to your home screen for an app-like experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Android Guide */}
            <div className="bg-emerald-50 rounded-3xl p-6 border-2 border-emerald-100 bouncy-hover">
              <span className="text-3xl mb-3 block">🤖</span>
              <h3 className="font-bold text-slate-900 mb-3">Android (Chrome)</h3>
              <ol className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="bg-emerald-200 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  Open Saral School in Chrome
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-emerald-200 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  Tap the three-dot menu (⋮)
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-emerald-200 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  Tap &quot;Add to Home Screen&quot;
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-emerald-200 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">4</span>
                  Tap &quot;Add&quot; to confirm
                </li>
              </ol>
            </div>

            {/* iPhone Guide */}
            <div className="bg-indigo-50 rounded-3xl p-6 border-2 border-indigo-100 bouncy-hover">
              <span className="text-3xl mb-3 block">🍎</span>
              <h3 className="font-bold text-slate-900 mb-3">iPhone & iPad (Safari)</h3>
              <ol className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="bg-indigo-200 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  Open Saral School in Safari
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-indigo-200 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  Tap the Share button (⬆)
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-indigo-200 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  Scroll down, tap &quot;Add to Home Screen&quot;
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-indigo-200 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">4</span>
                  Tap &quot;Add&quot; to confirm
                </li>
              </ol>
            </div>

            {/* Desktop Guide */}
            <div className="bg-pink-50 rounded-3xl p-6 border-2 border-pink-100 bouncy-hover">
              <span className="text-3xl mb-3 block">💻</span>
              <h3 className="font-bold text-slate-900 mb-3">Desktop (Chrome/Edge)</h3>
              <ol className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="bg-pink-200 text-pink-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  Open Saral School in Chrome or Edge
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-pink-200 text-pink-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  Click the install icon in the address bar
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-pink-200 text-pink-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  Click &quot;Install&quot; to confirm
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-pink-200 text-pink-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">4</span>
                  Opens as a standalone app window
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-4xl mb-4 block">🌟</span>
          <h2 className="text-3xl font-black text-slate-900 mb-3">Ready to Start Learning?</h2>
          <p className="text-slate-500 mb-8">
            No sign-up required to explore. Create an account when you are ready.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/learn"
              className="px-10 py-5 bg-emerald-600 text-white rounded-3xl text-xl font-bold shadow-xl shadow-emerald-200 bouncy-hover inline-block text-center"
            >
              🚀 Launch Saral School
            </Link>
            <Link
              href="/"
              className="px-10 py-5 bg-white border-2 border-indigo-200 text-slate-700 rounded-3xl text-xl font-bold bouncy-hover inline-block text-center shadow-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
