import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import { GamificationProvider } from "./contexts/GamificationContext";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        <GamificationProvider>
          <div className="min-h-screen bg-gradient-to-b from-rose-50/30 to-white">
            {children}
          </div>
        </GamificationProvider>
      </AppProvider>
    </AuthProvider>
  );
}
