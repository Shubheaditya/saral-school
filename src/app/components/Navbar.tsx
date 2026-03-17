import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/80 border-b border-indigo-100">
            <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-2xl font-bold text-indigo-600 shadow-sm bouncy-hover cursor-pointer">
                    S
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">Saral School</span>
            </Link>
            <div className="hidden md:flex items-center gap-8 font-semibold text-slate-700">
                <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                <Link href="/how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</Link>
                <Link href="/about" className="hover:text-indigo-600 transition-colors">About</Link>
                <Link href="/app" className="bg-emerald-600 text-white px-6 py-2 rounded-2xl font-bold shadow-sm bouncy-hover">
                    Get the App
                </Link>
                <Link href="/about#donate" className="bg-indigo-600 text-white px-6 py-2 rounded-2xl font-bold shadow-sm bouncy-hover">
                    Support Us
                </Link>
            </div>
        </nav>
    );
}
