"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { AVATARS } from "../types";
import TopProfileBar from "../components/TopProfileBar";
import Sparky from "../components/Sparky";
import UniversalBackground from "../components/UniversalBackground";
import { useUniversalTheme } from "../hooks/useUniversalTheme";
import { useApp } from "../contexts/AppContext";

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, users, switchUser, logout, updateUser } = useAuth();
  const { currentStreak, longestStreak, badges, completedQuizzes, completedVideos } = useGamification();
  const { backgroundClass, textClass } = useUniversalTheme();

  const getComponentTheme = () => {
    if (!currentUser) return { card: "bg-white", border: "border-slate-200", button: "bg-slate-200 text-slate-800", icon: "text-slate-400" };
    switch (currentUser.ageGroup) {
      case "kids":
         return { card: "bg-white rounded-3xl shadow-[0_8px_0_#f3e8ee]", border: "border-rose-300 border-4", button: "bg-gradient-to-r from-rose-400 to-purple-500 text-white shadow-lg", icon: "text-amber-400" };
      case "scholar":
      default:
         return { 
           card: "bg-white shadow-sm border border-slate-200", 
           border: "border-slate-200",
           button: "bg-gradient-to-r from-rose-500 to-purple-500 text-white hover:shadow-lg",
           icon: "text-rose-600"
         };
    }
  };

  const theme = getComponentTheme();

  const [tab, setTab] = useState<"profile" | "parent">("profile");
  const [pinInput, setPinInput] = useState("");
  const [pinVerified, setPinVerified] = useState(false);
  const [showPinError, setShowPinError] = useState(false);

  if (!currentUser) {
    router.replace("/learn/login");
    return null;
  }

  const handlePinSubmit = () => {
    if (pinInput === currentUser.parentPin) {
      setPinVerified(true);
      setShowPinError(false);
    } else {
      setShowPinError(true);
    }
  };

  const earnedBadges = badges.filter(b => b.earned);
  const unearnedBadges = badges.filter(b => !b.earned);

  return (
    <main className={`min-h-screen ${backgroundClass} ${textClass} relative pb-24 transition-colors duration-200 overflow-x-hidden`}>
      <UniversalBackground />

      <div className="relative z-10 w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-8 max-w-4xl mx-auto">
        <button onClick={() => router.back()} className={`px-4 py-2 rounded-xl font-bold transition-all ${currentUser.ageGroup === 'kids' ? 'bg-white shadow-[0_4px_0_#f3e8ee] text-slate-700 active:translate-y-1 active:shadow-none' : theme.button + ' rounded-xl'}`}>
          ← Back
        </button>
        <button onClick={() => { logout(); router.push("/learn/login"); }} className="px-4 py-2 rounded-xl border text-sm font-bold transition-all bg-red-50 border-red-200 text-red-600 hover:bg-red-100">
          Logout
        </button>
      </div>

      {/* Avatar & Name */}
      <div className="text-center px-6 pb-6">
        <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-5xl sm:text-7xl mx-auto mb-4 ${currentUser.ageGroup === 'kids' ? 'bg-white shadow-[0_8px_0_#f3e8ee] border-4 border-rose-400' : 'bg-gradient-to-br from-rose-50 to-purple-50 border-2 border-rose-200 shadow-sm'}`}>
          {AVATARS[currentUser.avatarIndex]}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{currentUser.name}</h1>
        <p className={`text-sm tracking-widest uppercase font-bold mt-1 ${currentUser.ageGroup === 'kids' ? 'text-rose-500' : 'text-slate-500'}`}>
           {currentUser.ageGroup === 'kids' ? 'Star Learner' : 'Scholar Profile'}
        </p>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-8 max-w-2xl mx-auto">
        <div className={`flex rounded-2xl p-1.5 ${currentUser.ageGroup === 'kids' ? 'bg-white shadow-[0_4px_0_#f3e8ee] border-2 border-rose-100' : 'bg-slate-100 border border-slate-200'}`}>
          <button
            onClick={() => setTab("profile")}
            className={`flex-1 py-3 sm:py-4 rounded-xl font-bold text-sm transition-all ${
              tab === "profile" 
                 ? (currentUser.ageGroup === 'kids' ? "bg-gradient-to-r from-rose-400 to-purple-400 text-white shadow-lg" : "bg-white text-slate-900 shadow-sm")
                 : "text-slate-400 hover:text-slate-700"
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setTab("parent")}
            className={`flex-1 py-3 sm:py-4 rounded-xl font-bold text-sm transition-all ${
              tab === "parent" 
                 ? (currentUser.ageGroup === 'kids' ? "bg-gradient-to-r from-purple-400 to-rose-500 text-white shadow-lg" : "bg-white text-slate-900 shadow-sm")
                 : "text-slate-400 hover:text-slate-700"
            }`}
          >
            {currentUser.ageGroup === "scholar" ? "Learning Dashboard" : "Parent Dashboard"}
          </button>
        </div>
      </div>

      {tab === "profile" ? (
        <div className="px-6 max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <div className={`p-4 sm:p-6 text-center ${theme.card} ${currentUser.ageGroup === 'kids' ? '' : 'rounded-2xl'}`}>
              <p className="text-3xl sm:text-4xl font-black text-orange-500">🔥 {currentStreak}</p>
              <p className="text-xs sm:text-sm font-bold mt-2 text-slate-500">Day Streak</p>
            </div>
            <div className={`p-4 sm:p-6 text-center ${theme.card} ${currentUser.ageGroup === 'kids' ? '' : 'rounded-2xl'}`}>
              <p className="text-3xl sm:text-4xl font-black text-emerald-500">✅ {completedQuizzes.length}</p>
              <p className="text-xs sm:text-sm font-bold mt-2 text-slate-500">Quizzes Done</p>
            </div>
            <div className={`p-4 sm:p-6 text-center ${theme.card} ${currentUser.ageGroup === 'kids' ? '' : 'rounded-2xl'}`}>
              <p className="text-3xl sm:text-4xl font-black text-rose-500">🎬 {completedVideos.length}</p>
              <p className="text-xs sm:text-sm font-bold mt-2 text-slate-500">Videos Watched</p>
            </div>
          </div>

          {/* Earned Badges */}
          <div>
            <h2 className="text-lg font-black text-slate-900 mb-3">Badges Earned ({earnedBadges.length})</h2>
            {earnedBadges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {earnedBadges.map(badge => (
                  <div key={badge.id} className="bg-emerald-50 rounded-2xl p-4 text-center border-2 border-emerald-200">
                    <span className="text-3xl block mb-1">{badge.icon}</span>
                    <p className="text-sm font-bold text-slate-900">{badge.name}</p>
                    <p className="text-xs text-slate-500">{badge.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
                <Sparky mood="encouraging" size="sm" message="Complete quizzes and lessons to earn badges!" />
              </div>
            )}
          </div>

          {/* Locked Badges */}
          {unearnedBadges.length > 0 && (
            <div>
              <h2 className="text-lg font-black text-slate-900 mb-3">Badges to Unlock</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {unearnedBadges.map(badge => (
                  <div key={badge.id} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100 opacity-60">
                    <span className="text-3xl block mb-1 grayscale">🔒</span>
                    <p className="text-sm font-bold text-slate-500">{badge.name}</p>
                    <p className="text-xs text-slate-400">{badge.requirement}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multi-child switch */}
          {users.length > 1 && (
            <div className="pt-6 border-t border-slate-200">
              <h2 className="text-lg sm:text-xl font-black mb-4">Switch Profile</h2>
              <div className="space-y-3">
                {users.filter(u => u.id !== currentUser.id).map(user => (
                  <button
                    key={user.id}
                    onClick={() => { switchUser(user.id); router.push("/learn"); }}
                    className={`w-full flex items-center gap-4 p-4 transition-all text-left ${theme.card} ${currentUser.ageGroup === 'kids' ? 'active:translate-y-1 active:shadow-none' : 'hover:-translate-y-1 rounded-2xl'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${currentUser.ageGroup === 'kids' ? 'bg-rose-100' : 'bg-slate-100'}`}>
                       {AVATARS[user.avatarIndex]}
                    </div>
                    <div>
                       <span className="font-bold block text-lg">{user.name}</span>
                       <span className="text-xs uppercase tracking-wider font-bold text-slate-500">{user.ageGroup}</span>
                    </div>
                    <span className={`ml-auto text-xl ${theme.icon}`}>→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="px-6 max-w-3xl mx-auto">
          {!pinVerified && currentUser.ageGroup !== "scholar" ? (
            <div className={`p-8 text-center ${theme.card} ${currentUser.ageGroup === 'kids' ? '' : 'rounded-3xl'}`}>
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-6 ${currentUser.ageGroup === 'kids' ? 'bg-rose-100 shadow-[0_4px_0_#fecdd3]' : 'bg-rose-50'}`}>
                 🔐
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-2">Parent Access</h2>
              <p className="mb-8 text-slate-500">Enter your 4-digit PIN to view the dashboard</p>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, "")); setShowPinError(false); }}
                placeholder="Enter PIN"
                className="w-full max-w-xs mx-auto block px-4 py-4 sm:py-5 border-2 focus:outline-none text-2xl sm:text-3xl font-black text-center tracking-[0.5em] transition-colors bg-slate-50 border-rose-200 rounded-2xl focus:border-rose-400 text-slate-900"
              />
              {showPinError && <p className="text-red-500 text-sm font-bold mt-3 animate-bounce">Incorrect PIN</p>}
              <button
                onClick={handlePinSubmit}
                className={`mt-6 w-full max-w-xs py-4 sm:py-5 font-black text-lg transition-all ${theme.button} rounded-2xl hover:-translate-y-1`}
              >
                Unlock Dashboard
              </button>
              <p className="text-xs font-mono mt-6 text-slate-400">Default PIN: 1234</p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              <PerformanceAnalytics userId={currentUser.id} theme={theme} ageGroup={currentUser.ageGroup} completedQuizzes={completedQuizzes} completedVideos={completedVideos} longestStreak={longestStreak} />

              {/* Learning Settings */}
              <div className={`p-6 sm:p-8 ${theme.card} ${currentUser.ageGroup === 'kids' ? '' : 'rounded-3xl'}`}>
                <h3 className="text-xl font-black mb-6">User Placement</h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t border-slate-100">
                  <div>
                    <p className="font-bold">Assigned Grade Level</p>
                    <p className="text-xs mt-1 text-slate-500">Overrides automatic age-based UI and dashboard placement.</p>
                  </div>
                  <select
                    value={currentUser?.assignedSemester || ""}
                    onChange={(e) => {
                      const val = e.target.value ? parseInt(e.target.value) : undefined;
                      if (currentUser) {
                        updateUser(currentUser.id, { assignedSemester: val });
                        setTimeout(() => { window.location.href = "/learn"; }, 300);
                      }
                    }}
                    className="w-full sm:w-auto p-3 border-2 rounded-xl font-bold text-sm focus:outline-none transition-colors bg-slate-50 border-rose-200 focus:border-rose-400 text-slate-900"
                  >
                    <option value="">Auto (Age-based)</option>
                    {Array.from({ length: 18 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Semester {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Manage Profiles */}
              <div className={`p-6 sm:p-8 ${theme.card} ${currentUser.ageGroup === 'kids' ? '' : 'rounded-3xl'}`}>
                <h3 className="text-xl font-black mb-6">Manage Accounts</h3>
                <div className="space-y-4">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center gap-4 py-3 border-b border-dashed last:border-0 border-slate-200">
                      <span className="w-12 h-12 flex items-center justify-center rounded-full text-2xl bg-slate-100">{AVATARS[user.avatarIndex]}</span>
                      <div>
                        <p className="font-bold text-lg">{user.name}</p>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{user.ageGroup}</p>
                      </div>
                      {user.id === currentUser.id && (
                         <span className="ml-auto px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">Active</span>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => router.push("/learn/onboarding?phone=" + currentUser.phone)}
                  className="mt-6 w-full py-4 border-2 border-dashed rounded-xl font-bold transition-colors border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50"
                >
                  + Register New Child
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </main>
  );
}

// ========== PERFORMANCE ANALYTICS COMPONENT ==========
interface AnalyticsData {
  totalAttempts: number;
  avgPercentage: number;
  totalScore: number;
  totalMaxMarks: number;
  bySubject: Record<string, { attempts: number; avgPercentage: number; totalScore: number; totalMarks: number }>;
}

function PerformanceAnalytics({ userId, theme, ageGroup, completedQuizzes, completedVideos, longestStreak }: {
  userId: string; theme: any; ageGroup: string; completedQuizzes: string[]; completedVideos: string[]; longestStreak: number;
}) {
  const { subjects } = useApp();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [semesterFilter, setSemesterFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/user/quiz-attempts?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data.analytics);
        }
      } catch (e) {
        console.error("Failed to fetch analytics", e);
      }
      setLoading(false);
    }
    fetchAnalytics();
  }, [userId]);

  const subjectMap: Record<string, string> = {};
  subjects.forEach(s => { subjectMap[s.id] = s.name; });
  const subjectIcons: Record<string, string> = {};
  subjects.forEach(s => { subjectIcons[s.id] = s.icon; });

  return (
    <>
      {/* Overview Stats */}
      <div className={`p-6 sm:p-8 ${theme.card} ${ageGroup === 'kids' ? '' : 'rounded-3xl'}`}>
        <h2 className="text-xl sm:text-2xl font-black mb-6">📊 Performance Analytics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="rounded-2xl p-4 text-center bg-emerald-50 border border-emerald-100">
            <p className="text-2xl font-black text-emerald-600">{completedQuizzes.length}</p>
            <p className="text-xs font-bold mt-1 text-slate-500">Quizzes Done</p>
          </div>
          <div className="rounded-2xl p-4 text-center bg-rose-50 border border-rose-100">
            <p className="text-2xl font-black text-rose-600">{completedVideos.length}</p>
            <p className="text-xs font-bold mt-1 text-slate-500">Videos Watched</p>
          </div>
          <div className="rounded-2xl p-4 text-center bg-amber-50 border border-amber-100">
            <p className="text-2xl font-black text-amber-600">{longestStreak}</p>
            <p className="text-xs font-bold mt-1 text-slate-500">Best Streak</p>
          </div>
          <div className="rounded-2xl p-4 text-center bg-purple-50 border border-purple-100">
            <p className="text-2xl font-black text-purple-600">{analytics?.avgPercentage ?? 0}%</p>
            <p className="text-xs font-bold mt-1 text-slate-500">Avg Score</p>
          </div>
        </div>

        {/* Semester Filter */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm font-bold text-slate-700 shrink-0">Filter:</span>
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            <button
              onClick={() => setSemesterFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${semesterFilter === "all" ? "bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
            >All Semesters</button>
            {Array.from({ length: 18 }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setSemesterFilter(String(i + 1))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${semesterFilter === String(i + 1) ? "bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
              >Sem {i + 1}</button>
            ))}
          </div>
        </div>

        {/* Subject-wise Performance */}
        <h3 className="font-bold text-slate-900 mb-3">Subject Performance</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-400">Loading analytics...</p>
          </div>
        ) : analytics && Object.keys(analytics.bySubject).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(analytics.bySubject).map(([subId, data]) => (
              <div key={subId} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{subjectIcons[subId] || '📚'}</span>
                    <span className="font-bold text-sm text-slate-800">{subjectMap[subId] || subId}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400">{data.attempts} attempt{data.attempts !== 1 ? 's' : ''}</span>
                    <span className={`text-sm font-black ${data.avgPercentage >= 70 ? 'text-emerald-600' : data.avgPercentage >= 40 ? 'text-amber-600' : 'text-red-500'}`}>{data.avgPercentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-700 ${data.avgPercentage >= 70 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : data.avgPercentage >= 40 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-red-400 to-red-500'}`}
                    style={{ width: `${Math.max(data.avgPercentage, 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100">
            <span className="text-4xl block mb-2">📝</span>
            <p className="text-slate-500 font-medium">No quiz attempts yet. Take a quiz to see your performance!</p>
          </div>
        )}
      </div>
    </>
  );
}
