"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { AVATARS } from "../types";
import TopProfileBar from "../components/TopProfileBar";
import Sparky from "../components/Sparky";
import UniversalBackground from "../components/UniversalBackground";
import { useUniversalTheme } from "../hooks/useUniversalTheme";

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, users, switchUser, logout, updateUser } = useAuth();
  const { currentStreak, longestStreak, badges, completedQuizzes, completedVideos } = useGamification();
  const { backgroundClass, textClass, isDark } = useUniversalTheme();

  // Keep internal component styling (cards, borders) separate from the universal background 
  const getComponentTheme = () => {
    if (!currentUser) return { card: "bg-white", border: "border-slate-200", button: "bg-slate-200 text-slate-800", icon: "text-slate-400" };
    switch (currentUser.ageGroup) {
      case "kids":
         return { card: "bg-white rounded-3xl shadow-[0_8px_0_#bae6fd]", border: "border-cyan-300 border-4", button: "bg-pink-400 text-white shadow-[0_4px_0_#be185d]", icon: "text-amber-400" };
      case "explorer":
         return { 
           card: isDark ? "bg-slate-800/80 backdrop-blur border border-white/10 shadow-2xl" : "bg-white/90 backdrop-blur border border-white/40 shadow-xl", 
           border: "border-cyan-500", 
           button: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg", 
           icon: "text-fuchsia-400" 
         };
      case "scholar":
      default:
         return { 
           card: isDark ? "bg-slate-900/50 backdrop-blur-xl border border-white/10" : "bg-white shadow-sm border border-slate-200", 
           border: isDark ? "border-slate-700" : "border-slate-200",
           button: isDark ? "bg-white/10 text-white hover:bg-white/20" : "bg-slate-900 text-white hover:bg-slate-800",
           icon: isDark ? "text-indigo-400" : "text-indigo-600"
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
    <main className={`min-h-screen ${backgroundClass} ${textClass} relative pb-24 transition-colors duration-500 overflow-x-hidden`}>
      <UniversalBackground />

      <div className="relative z-10 w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-8 max-w-4xl mx-auto">
        <button onClick={() => router.back()} className={`px-4 py-2 rounded-xl font-bold transition-all ${currentUser.ageGroup === 'kids' ? 'bg-white shadow-[0_4px_0_#cbd5e1] text-slate-700 active:translate-y-1 active:shadow-none' : theme.button}`}>
          ← Back
        </button>
        <button onClick={() => { logout(); router.push("/learn/login"); }} className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${currentUser.ageGroup === 'kids' ? 'bg-red-100 border-red-300 text-red-600 shadow-[0_4px_0_#fca5a5] active:translate-y-1 active:shadow-none' : (isDark && currentUser.ageGroup === 'scholar' || currentUser.ageGroup === 'explorer' ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100')}`}>
          Logout
        </button>
      </div>

      {/* Avatar & Name */}
      <div className="text-center px-6 pb-6">
        <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-5xl sm:text-7xl mx-auto mb-4 ${currentUser.ageGroup === 'kids' ? 'bg-white shadow-[0_8px_0_#bae6fd] border-4 border-indigo-400' : currentUser.ageGroup === 'explorer' ? (isDark ? 'bg-slate-800 shadow-[0_0_30px_rgba(34,211,238,0.3)] border-4 border-cyan-400' : 'bg-white shadow-[0_0_30px_rgba(34,211,238,0.3)] border-4 border-cyan-400') : (isDark ? 'bg-slate-900 border border-slate-700 shadow-xl' : 'bg-slate-50 border border-slate-200 shadow-sm')}`}>
          {AVATARS[currentUser.avatarIndex]}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{currentUser.name}</h1>
        <p className={`text-sm tracking-widest uppercase font-bold mt-1 ${currentUser.ageGroup === 'kids' ? 'text-indigo-500' : (isDark || currentUser.ageGroup === 'explorer' && isDark ? 'text-slate-400' : 'text-slate-500')}`}>
           {currentUser.ageGroup === 'kids' ? 'Star Learner' : currentUser.ageGroup === 'explorer' ? 'Explorer' : 'Scholar Profile'}
        </p>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-8 max-w-2xl mx-auto">
        <div className={`flex rounded-2xl p-1.5 ${currentUser.ageGroup === 'kids' ? 'bg-white shadow-[0_4px_0_#bae6fd] border-2 border-slate-100' : currentUser.ageGroup === 'explorer' ? (isDark ? 'bg-slate-900/50 backdrop-blur border border-white/10' : 'bg-slate-200/50 backdrop-blur border border-white/50') : (isDark ? 'bg-slate-900/80 border border-white/5' : 'bg-slate-100 border border-slate-200')}`}>
          <button
            onClick={() => setTab("profile")}
            className={`flex-1 py-3 sm:py-4 rounded-xl font-bold text-sm transition-all ${
              tab === "profile" 
                 ? (currentUser.ageGroup === 'kids' ? "bg-amber-400 text-white shadow-[0_4px_0_#d97706]" : currentUser.ageGroup === 'explorer' ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg" : (isDark ? "bg-slate-800 text-white shadow-sm" : "bg-white text-slate-900 shadow-sm"))
                 : (currentUser.ageGroup === 'kids' ? "text-slate-400" : currentUser.ageGroup === 'explorer' ? (isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800") : "text-slate-500 hover:text-slate-700")
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setTab("parent")}
            className={`flex-1 py-3 sm:py-4 rounded-xl font-bold text-sm transition-all ${
              tab === "parent" 
                 ? (currentUser.ageGroup === 'kids' ? "bg-indigo-500 text-white shadow-[0_4px_0_#4338ca]" : currentUser.ageGroup === 'explorer' ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg" : (isDark ? "bg-slate-800 text-white shadow-sm" : "bg-white text-slate-900 shadow-sm"))
                 : (currentUser.ageGroup === 'kids' ? "text-slate-400" : currentUser.ageGroup === 'explorer' ? (isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800") : "text-slate-500 hover:text-slate-700")
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
              <p className={`text-3xl sm:text-4xl font-black ${currentUser.ageGroup === 'explorer' ? 'text-rose-500' : 'text-orange-500'}`}>🔥 {currentStreak}</p>
              <p className={`text-xs sm:text-sm font-bold mt-2 ${currentUser.ageGroup === 'kids' ? 'text-slate-500' : (isDark || currentUser.ageGroup === 'explorer' && isDark ? 'text-slate-400' : 'text-slate-600')}`}>Day Streak</p>
            </div>
            <div className={`p-4 sm:p-6 text-center ${theme.card} ${currentUser.ageGroup === 'kids' ? '' : 'rounded-2xl'}`}>
              <p className={`text-3xl sm:text-4xl font-black ${currentUser.ageGroup === 'explorer' ? 'text-emerald-500' : 'text-emerald-500'}`}>✅ {completedQuizzes.length}</p>
              <p className={`text-xs sm:text-sm font-bold mt-2 ${currentUser.ageGroup === 'kids' ? 'text-slate-500' : (isDark || currentUser.ageGroup === 'explorer' && isDark ? 'text-slate-400' : 'text-slate-600')}`}>Quizzes Done</p>
            </div>
            <div className={`p-4 sm:p-6 text-center ${theme.card} ${currentUser.ageGroup === 'kids' ? '' : 'rounded-2xl'}`}>
              <p className={`text-3xl sm:text-4xl font-black ${currentUser.ageGroup === 'explorer' ? 'text-indigo-500' : 'text-indigo-500'}`}>🎬 {completedVideos.length}</p>
              <p className={`text-xs sm:text-sm font-bold mt-2 ${currentUser.ageGroup === 'kids' ? 'text-slate-500' : (isDark || currentUser.ageGroup === 'explorer' && isDark ? 'text-slate-400' : 'text-slate-600')}`}>Videos Watched</p>
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
            <div className="pt-6 border-t border-white/10">
              <h2 className="text-lg sm:text-xl font-black mb-4">Switch Profile</h2>
              <div className="space-y-3">
                {users.filter(u => u.id !== currentUser.id).map(user => (
                  <button
                    key={user.id}
                    onClick={() => { switchUser(user.id); router.push("/learn"); }}
                    className={`w-full flex items-center gap-4 p-4 transition-all text-left ${theme.card} ${currentUser.ageGroup === 'kids' ? 'active:translate-y-1 active:shadow-none' : 'hover:-translate-y-1'} ${currentUser.ageGroup !== 'kids' ? 'rounded-2xl' : ''}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${currentUser.ageGroup === 'kids' ? 'bg-indigo-100' : currentUser.ageGroup === 'explorer' ? (isDark ? 'bg-slate-700' : 'bg-slate-200') : (isDark ? 'bg-slate-800' : 'bg-slate-100')}`}>
                       {AVATARS[user.avatarIndex]}
                    </div>
                    <div>
                       <span className="font-bold block text-lg">{user.name}</span>
                       <span className={`text-xs uppercase tracking-wider font-bold ${currentUser.ageGroup === 'kids' ? 'text-indigo-500' : (isDark || currentUser.ageGroup === 'explorer' && isDark ? 'text-slate-400' : 'text-slate-500')}`}>{user.ageGroup}</span>
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
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-6 ${currentUser.ageGroup === 'kids' ? 'bg-rose-100 shadow-[0_4px_0_#fecdd3]' : currentUser.ageGroup === 'explorer' ? 'bg-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : (isDark ? 'bg-rose-900/30' : 'bg-rose-50')}`}>
                 🔐
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-2">Parent Access</h2>
              <p className={`mb-8 ${currentUser.ageGroup === 'kids' ? 'text-slate-500' : (isDark || currentUser.ageGroup === 'explorer' && isDark ? 'text-slate-400' : 'text-slate-600')}`}>Enter your 4-digit PIN to view the dashboard</p>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, "")); setShowPinError(false); }}
                placeholder="Enter PIN"
                className={`w-full max-w-xs mx-auto block px-4 py-4 sm:py-5 border-2 focus:outline-none text-2xl sm:text-3xl font-black text-center tracking-[0.5em] transition-colors ${currentUser.ageGroup === 'kids' ? 'bg-slate-50 border-slate-200 rounded-3xl focus:border-indigo-400 text-slate-900 shadow-inner' : currentUser.ageGroup === 'explorer' ? (isDark ? 'bg-slate-900/50 border-white/10 rounded-2xl focus:border-cyan-400 text-white' : 'bg-slate-100 border-slate-200 rounded-2xl focus:border-cyan-500 text-slate-900') : (isDark ? 'bg-slate-800 border-slate-700 rounded-2xl focus:border-indigo-500 text-white' : 'bg-slate-50 border-slate-200 rounded-2xl focus:border-indigo-500 text-slate-900')}`}
              />
              {showPinError && <p className="text-red-500 text-sm font-bold mt-3 animate-bounce">Incorrect PIN</p>}
              <button
                onClick={handlePinSubmit}
                className={`mt-6 w-full max-w-xs py-4 sm:py-5 font-black text-lg transition-all ${theme.button} ${currentUser.ageGroup === 'kids' ? 'rounded-3xl active:translate-y-1 active:shadow-none' : 'rounded-2xl hover:-translate-y-1'}`}
              >
                Unlock Dashboard
              </button>
              <p className={`text-xs font-mono mt-6 ${currentUser.ageGroup === 'kids' ? 'text-slate-400' : 'text-slate-500'}`}>Default PIN: 1234</p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              <div className={`p-6 sm:p-8 ${theme.card} ${currentUser.ageGroup === 'kids' ? '' : 'rounded-3xl'}`}>
                <h2 className="text-xl sm:text-2xl font-black mb-6">Overview & Reports</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className={`rounded-2xl p-4 text-center ${isDark ? 'bg-emerald-900/20 border border-emerald-500/10' : 'bg-emerald-50 border border-emerald-100'}`}>
                    <p className={`text-3xl font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{completedQuizzes.length}</p>
                    <p className={`text-xs font-bold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Quizzes Done</p>
                  </div>
                  <div className={`rounded-2xl p-4 text-center ${isDark ? 'bg-indigo-900/20 border border-indigo-500/10' : 'bg-indigo-50 border border-indigo-100'}`}>
                    <p className={`text-3xl font-black ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{completedVideos.length}</p>
                    <p className={`text-xs font-bold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Videos Watched</p>
                  </div>
                  <div className={`rounded-2xl p-4 text-center ${isDark ? 'bg-amber-900/20 border border-amber-500/10' : 'bg-amber-50 border border-amber-100'}`}>
                    <p className={`text-3xl font-black ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{longestStreak}</p>
                    <p className={`text-xs font-bold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Best Streak</p>
                  </div>
                </div>

                {/* Simple Progress Visualization */}
                <h3 className="font-bold text-slate-900 mb-3">Subject Progress</h3>
                <div className="space-y-3">
                  {["Mathematics", "Science", "English", "Social Science", "Logical Reasoning", "Technology"].map((name, i) => (
                    <div key={name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">{name}</span>
                        <span className="text-slate-400">{Math.round(15 + i * 8)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-2 bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${15 + i * 8}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-3">Insights</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <p className="text-sm font-bold text-emerald-700 mb-1">💪 Strengths</p>
                    <p className="text-xs text-slate-600">Numbers, Patterns, Animals</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-sm font-bold text-amber-700 mb-1">📖 Needs Practice</p>
                    <p className="text-xs text-slate-600">Phonics, Geography</p>
                  </div>
                </div>
              </div>

              {/* Report Actions */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold bouncy-hover text-sm">
                  📥 Download Report
                </button>
                <button className="flex-1 py-3 bg-white border-2 border-indigo-200 text-indigo-600 rounded-2xl font-bold bouncy-hover text-sm">
                  📧 Email Report
                </button>
              </div>

              {/* Learning Settings */}
              <div className={`p-6 sm:p-8 ${theme.card} ${currentUser.ageGroup === 'kids' ? '' : 'rounded-3xl'}`}>
                <h3 className="text-xl font-black mb-6">User Placement</h3>
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                  <div>
                    <p className="font-bold">Assigned Grade Level</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Overrides automatic age-based UI and dashboard placement.</p>
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
                    className={`w-full sm:w-auto p-3 border-2 rounded-xl font-bold text-sm focus:outline-none transition-colors ${isDark ? 'bg-slate-800 border-slate-700 focus:border-indigo-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-indigo-400 text-slate-900'}`}
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
                    <div key={user.id} className={`flex items-center gap-4 py-3 border-b border-dashed last:border-0 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                      <span className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>{AVATARS[user.avatarIndex]}</span>
                      <div>
                        <p className="font-bold text-lg">{user.name}</p>
                        <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{user.ageGroup}</p>
                      </div>
                      {user.id === currentUser.id && (
                         <span className={`ml-auto px-3 py-1 rounded-full text-[10px] font-black uppercase ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>Active</span>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => router.push("/learn/onboarding?phone=" + currentUser.phone)}
                  className={`mt-6 w-full py-4 border-2 border-dashed rounded-xl font-bold transition-colors ${isDark ? 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
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
