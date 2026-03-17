import { AppProvider } from "../learn/contexts/AppContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50">{children}</div>
    </AppProvider>
  );
}
