import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-800 text-white py-16 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-2xl font-bold text-indigo-600">
                            S
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight">Saral School</span>
                    </div>
                    <p className="text-slate-400 text-lg max-w-sm mb-6">
                        Building the future of accessible, fun education — one adventure at a time.
                    </p>
                </div>

                <div>
                    <h4 className="text-xl font-bold mb-6">Pages</h4>
                    <ul className="space-y-4 text-slate-400 font-semibold">
                        <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                        <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                        <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xl font-bold mb-6">Connect</h4>
                    <ul className="space-y-4 text-slate-400 font-semibold">
                        <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Email Us</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-slate-700 text-center text-slate-500 font-semibold">
                © {new Date().getFullYear()} Saral School. Built with Love & Curiosity.
            </div>
        </footer>
    );
}
