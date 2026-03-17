import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import { GamificationProvider } from "./contexts/GamificationContext";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        <GamificationProvider>
          <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
            {children}
          </div>
        </GamificationProvider>
      </AppProvider>
    </AuthProvider>
  );
}
