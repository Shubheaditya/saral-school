"use client";

import { useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApp } from "../../contexts/AppContext";
import { useGamification } from "../../contexts/GamificationContext";
import Sparky from "../../components/Sparky";
import ProgressBar from "../../components/ProgressBar";
import { Question, MediaBlock, migrateQuestion } from "../../types";
import { MOCK_QUIZ } from "../../mockData";
import UniversalBackground from "../../components/UniversalBackground";
import { useUniversalTheme } from "../../hooks/useUniversalTheme";

// ========== MediaBlock Renderer ==========
function MediaBlockView({ block, className = "" }: { block: MediaBlock; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {block.text && <p>{block.text}</p>}
      {block.imageUrl && <img src={block.imageUrl} alt="" className="rounded-xl max-h-64 object-contain mx-auto" />}
      {block.audioUrl && <audio controls src={block.audioUrl} className="w-full" />}
      {block.videoUrl && <video controls src={block.videoUrl} className="w-full rounded-xl max-h-64" />}
    </div>
  );
}

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;
  const { getQuizById } = useApp();
  const { addPoints, addGems, completeQuiz, checkAndAwardBadges } = useGamification();
  const { backgroundClass, textClass, isDark } = useUniversalTheme();

  const rawQuiz = getQuizById(quizId) || MOCK_QUIZ;
  // Migrate questions to universal format for backward compat
  const quiz = { ...rawQuiz, questions: rawQuiz.questions.map(q => migrateQuestion(q)) };

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number | number[] | Record<string, string>>>({});
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentPointsEarned, setCurrentPointsEarned] = useState(0);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0); // number of fully correct questions
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);
  const [theoryText, setTheoryText] = useState("");

  const question = quiz.questions[current];
  const totalQ = quiz.questions.length;
  const progress = ((current + (submitted ? 1 : 0)) / totalQ) * 100;

  const checkAnswer = useCallback(() => {
    const answer = answers[current];
    const q = question;
    let correct = false;
    let pointsEarned = 0;
    const maxPoints = q.points || 10;

    switch (q.type) {
      case "mcq":
        correct = answer === q.correctIndex;
        pointsEarned = correct ? maxPoints : 0;
        break;
      case "multi-correct": {
        const selected = (answer as number[]) || [];
        const expected = q.correctIndices || [];
        
        if (q.partialMarking) {
          if (expected.length === 0) {
             correct = selected.length === 0;
             pointsEarned = correct ? maxPoints : 0;
          } else {
             const correctlySelected = selected.filter(idx => expected.includes(idx)).length;
             const incorrectlySelected = selected.filter(idx => !expected.includes(idx)).length;
             
             let p = (correctlySelected / expected.length) * maxPoints;
             const totalWrongOpts = (q.options?.length || 0) - expected.length;
             if (totalWrongOpts > 0 && incorrectlySelected > 0) {
                p -= (incorrectlySelected / totalWrongOpts) * maxPoints;
             }
             pointsEarned = Math.max(0, Math.round(p)); 
             correct = pointsEarned === maxPoints; 
          }
        } else {
          correct = selected.length === expected.length && selected.sort().every((v, i) => v === expected.sort()[i]);
          pointsEarned = correct ? maxPoints : 0;
        }
        break;
      }
      case "fill-blank": {
        const userAnswer = (answer as string || "").trim().toLowerCase();
        correct = userAnswer === (q.correctAnswer || "").toLowerCase() ||
          (q.acceptableAnswers || []).some(a => a.toLowerCase() === userAnswer);
        pointsEarned = correct ? maxPoints : 0;
        break;
      }
      case "matching":
      case "drag-drop": {
        const pairs = (answer as Record<string, string>) || {};
        correct = Object.entries(q.correctPairs || {}).every(([k, v]) => pairs[k] === v);
        pointsEarned = correct ? maxPoints : 0;
        break;
      }
      case "theory":
        correct = true;
        pointsEarned = maxPoints; // award full participation points auto
        break;
    }

    setIsCorrect(correct);
    setCurrentPointsEarned(pointsEarned);
    if (correct) setScore(prev => prev + 1);
    setTotalPointsEarned(prev => prev + pointsEarned);
    setSubmitted(true);
  }, [answers, current, question]);

  const handleNext = () => {
    if (current < totalQ - 1) {
      setCurrent(current + 1);
      setSubmitted(false);
      setShowResult(false);
      setTheoryText("");
    } else {
      const finalScore = score;
      const pointsEarned = totalPointsEarned;
      const gemsEarned = finalScore === totalQ ? 5 : Math.floor(finalScore / 2);
      addPoints(pointsEarned);
      addGems(gemsEarned);
      completeQuiz(quizId);
      checkAndAwardBadges();
      setFinished(true);
    }
  };

  // Finished screen
  if (finished) {
    const totalPossiblePoints = quiz.questions.reduce((sum, q) => sum + (q.points || 10), 0);
    const percentage = Math.round((totalPointsEarned / (totalPossiblePoints || 1)) * 100);
    const pointsEarned = totalPointsEarned;
    const gemsEarned = score === totalQ ? 5 : Math.floor(score / 2);

    return (
      <main className={`min-h-screen ${backgroundClass} ${textClass} relative flex flex-col items-center justify-center px-6 py-12 transition-colors duration-500`}>
        <UniversalBackground />
        <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
          <Sparky
            mood={percentage >= 80 ? "celebrating" : percentage >= 50 ? "happy" : "encouraging"}
            size="xl"
            message={
            percentage >= 80 ? "Amazing work! You're a star!" :
            percentage >= 50 ? "Good job! Keep practicing!" :
            "Don't give up! Try again!"
          }
          className="mb-8"
        />
        <div className={`w-full max-w-md rounded-3xl p-8 shadow-xl border-2 text-center ${isDark ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' : 'bg-white border-indigo-100'}`}>
          <h1 className={`text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Quiz Complete!</h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} mb-6`}>{quiz.title}</p>
          <div className={`${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'} rounded-2xl p-6 mb-6`}>
            <p className={`text-5xl font-black ${isDark ? 'text-indigo-400' : 'text-indigo-600'} mb-1`}>{percentage}%</p>
            <p className={isDark ? 'text-indigo-300' : 'text-slate-500'}>{score} of {totalQ} fully correct</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className={`${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-100'} rounded-xl p-3 border`}>
              <p className={`text-2xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>⭐ +{pointsEarned}</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Points</p>
            </div>
            <div className={`${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'} rounded-xl p-3 border`}>
              <p className={`text-2xl font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>💎 +{gemsEarned}</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Gems</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setCurrent(0); setAnswers({}); setScore(0); setTotalPointsEarned(0); setSubmitted(false); setFinished(false); }}
              className={`flex-1 py-4 rounded-2xl text-lg font-bold bouncy-hover ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >Try Again</button>
            <button onClick={() => router.back()} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-lg font-bold shadow-lg shadow-indigo-600/30 bouncy-hover">Done</button>
          </div>
        </div>
        </div>
      </main>
    );
  }

  // Check if answer is provided (for enabling submit button)
  const hasAnswer = (() => {
    const a = answers[current];
    if (question.type === "theory") return theoryText.trim().length > 0;
    if (question.type === "multi-correct") return Array.isArray(a) && a.length > 0;
    return a !== undefined;
  })();

  return (
    <main className={`min-h-screen ${backgroundClass} ${textClass} relative transition-colors duration-500`}>
      <UniversalBackground />
      <div className="relative z-10 w-full pb-12">
        {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={() => router.back()} className="bg-white rounded-xl px-4 py-2 shadow-sm border border-slate-100 font-bold text-slate-700 bouncy-hover">✕ Exit</button>
        <span className="text-sm font-bold text-slate-500">{current + 1} / {totalQ}</span>
      </div>

      {/* Progress */}
      <div className="px-6 mb-6">
        <ProgressBar value={progress} color="bg-indigo-500" height="h-2" />
      </div>

      {/* Question Card */}
      <div className="px-6 max-w-2xl mx-auto">
        <div className={`${isDark ? 'bg-slate-900/80 backdrop-blur-xl border-white/10 shadow-2xl' : 'bg-white border-indigo-100 shadow-xl'} rounded-3xl p-6 md:p-8 border-2 mb-6`}>
          <p className="text-sm font-bold text-indigo-400 mb-2 uppercase">Question {current + 1}</p>
          {/* Question prompt with rich media */}
          <div className={`text-xl md:text-2xl font-black mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <MediaBlockView block={question.prompt} />
          </div>

          {/* MCQ */}
          {question.type === "mcq" && question.options && (
            <MCQOptions
              options={question.options}
              correctIndex={question.correctIndex}
              selected={answers[current] as number | undefined}
              onSelect={(idx) => setAnswers({ ...answers, [current]: idx })}
              submitted={submitted}
              isDark={isDark}
            />
          )}

          {/* Multi-correct */}
          {question.type === "multi-correct" && question.options && (
            <MultiCorrectOptions
              options={question.options}
              correctIndices={question.correctIndices || []}
              selected={(answers[current] as number[]) || []}
              onToggle={(idx) => {
                const prev = (answers[current] as number[]) || [];
                const next = prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx];
                setAnswers({ ...answers, [current]: next });
              }}
              submitted={submitted}
              isDark={isDark}
            />
          )}

          {/* Fill in the blank */}
          {question.type === "fill-blank" && (
            <FillBlankInput
              correctAnswer={question.correctAnswer || ""}
              value={(answers[current] as string) || ""}
              onChange={(val) => setAnswers({ ...answers, [current]: val })}
              submitted={submitted}
              isCorrect={isCorrect}
              isDark={isDark}
            />
          )}

          {/* Matching */}
          {question.type === "matching" && question.leftItems && question.rightItems && (
            <MatchingPairs
              leftItems={question.leftItems}
              rightItems={question.rightItems}
              correctPairs={question.correctPairs || {}}
              pairs={(answers[current] as Record<string, string>) || {}}
              onChange={(pairs) => setAnswers({ ...answers, [current]: pairs })}
              submitted={submitted}
              isDark={isDark}
            />
          )}

          {/* Drag & Drop */}
          {question.type === "drag-drop" && question.leftItems && question.rightItems && (
            <DragDropSimplified
              items={question.leftItems}
              targets={question.rightItems}
              correctMapping={question.correctPairs || {}}
              mapping={(answers[current] as Record<string, string>) || {}}
              onChange={(mapping) => setAnswers({ ...answers, [current]: mapping })}
              submitted={submitted}
              isDark={isDark}
            />
          )}

          {/* Theory / Long Answer */}
          {question.type === "theory" && (
            <TheoryInput
              value={theoryText}
              onChange={(val) => { setTheoryText(val); setAnswers({ ...answers, [current]: val }); }}
              submitted={submitted}
              sampleAnswer={question.sampleAnswer}
              maxWords={question.maxWords}
              isDark={isDark}
            />
          )}
        </div>

        {/* Mascot Feedback */}
        {submitted && (
          <div className="mb-6">
            <Sparky
              mood={isCorrect ? "celebrating" : "encouraging"}
              size="sm"
              message={
                question.type === "theory"
                  ? "Answer submitted! Review the sample answer below."
                  : isCorrect
                  ? "Excellent! That's correct! 🎉"
                  : `Not quite! ${question.explanation || "Try again next time!"}`
              }
            />
          </div>
        )}

        {/* Action Button */}
        <div className="pb-8">
          {!submitted ? (
            <button
              onClick={checkAnswer}
              disabled={!hasAnswer}
              className={`w-full py-4 rounded-2xl text-lg font-bold shadow-lg bouncy-hover ${
                hasAnswer
                  ? "bg-indigo-600 text-white shadow-indigo-200"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-lg font-bold shadow-lg shadow-emerald-200 bouncy-hover"
            >
              {current < totalQ - 1 ? "Next Question →" : "See Results 🎉"}
            </button>
          )}
        </div>
      </div>
      </div>
    </main>
  );
}

// ====== Sub-components for question types ======

function MCQOptions({ options, correctIndex, selected, onSelect, submitted, isDark }: {
  options: MediaBlock[]; correctIndex?: number; selected?: number; onSelect: (idx: number) => void; submitted: boolean; isDark?: boolean;
}) {
  return (
    <div className="space-y-3">
      {options.map((option, idx) => {
        let style = isDark
          ? "bg-slate-800/50 border-white/10 hover:bg-indigo-500/20 hover:border-indigo-500/50 text-slate-200"
          : "bg-slate-50 border-slate-100 hover:bg-indigo-50 hover:border-indigo-200 text-slate-900";
        if (selected === idx && !submitted) style = isDark ? "bg-indigo-500/30 border-indigo-400 text-indigo-100" : "bg-indigo-100 border-indigo-400 text-indigo-900";
        if (submitted && idx === correctIndex) style = isDark ? "bg-emerald-500/30 border-emerald-400 text-emerald-100" : "bg-emerald-100 border-emerald-400 text-emerald-900";
        if (submitted && selected === idx && idx !== correctIndex) style = isDark ? "bg-red-500/30 border-red-400 text-red-100" : "bg-red-100 border-red-400 text-red-900";

        return (
          <button key={idx} onClick={() => !submitted && onSelect(idx)} className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-medium transition-all ${style} ${!submitted ? "bouncy-hover" : ""}`}>
            <span className={`font-bold mr-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{String.fromCharCode(65 + idx)}.</span>
            <MediaBlockView block={option} className="inline" />
            {submitted && idx === correctIndex && <span className="float-right">✅</span>}
            {submitted && selected === idx && idx !== correctIndex && <span className="float-right">❌</span>}
          </button>
        );
      })}
    </div>
  );
}

function MultiCorrectOptions({ options, correctIndices, selected, onToggle, submitted, isDark }: {
  options: MediaBlock[]; correctIndices: number[]; selected: number[]; onToggle: (idx: number) => void; submitted: boolean; isDark?: boolean;
}) {
  return (
    <div className="space-y-3">
      <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Select all correct answers</p>
      {options.map((option, idx) => {
        const isSelected = selected.includes(idx);
        const isCorrectOption = correctIndices.includes(idx);
        let style = isDark
          ? "bg-slate-800/50 border-white/10 hover:bg-indigo-500/20 text-slate-200"
          : "bg-slate-50 border-slate-100 hover:bg-indigo-50 text-slate-900";
        if (isSelected && !submitted) style = isDark ? "bg-indigo-500/30 border-indigo-400 text-indigo-100" : "bg-indigo-100 border-indigo-400 text-indigo-900";
        if (submitted && isCorrectOption) style = isDark ? "bg-emerald-500/30 border-emerald-400 text-emerald-100" : "bg-emerald-100 border-emerald-400 text-emerald-900";
        if (submitted && isSelected && !isCorrectOption) style = isDark ? "bg-red-500/30 border-red-400 text-red-100" : "bg-red-100 border-red-400 text-red-900";

        return (
          <button key={idx} onClick={() => !submitted && onToggle(idx)} className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-medium transition-all ${style} ${!submitted ? "bouncy-hover" : ""}`}>
            <span className={`font-bold mr-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{isSelected ? "☑" : "☐"}</span>
            <MediaBlockView block={option} className="inline" />
            {submitted && isCorrectOption && <span className="float-right">✅</span>}
            {submitted && isSelected && !isCorrectOption && <span className="float-right">❌</span>}
          </button>
        );
      })}
    </div>
  );
}

function FillBlankInput({ correctAnswer, value, onChange, submitted, isCorrect, isDark }: {
  correctAnswer: string; value: string; onChange: (val: string) => void; submitted: boolean; isCorrect: boolean; isDark?: boolean;
}) {
  return (
    <div>
      <input
        type="text" value={value}
        onChange={(e) => !submitted && onChange(e.target.value)}
        placeholder="Type your answer..."
        className={`w-full px-5 py-4 rounded-2xl border-2 text-lg font-medium focus:outline-none ${
          submitted
            ? isCorrect
              ? isDark ? "border-emerald-500 bg-emerald-900/40 text-emerald-200" : "border-emerald-400 bg-emerald-50 text-emerald-900"
              : isDark ? "border-red-500 bg-red-900/40 text-red-200" : "border-red-400 bg-red-50 text-red-900"
            : isDark ? "border-white/10 bg-slate-800/50 text-white focus:border-indigo-400" : "border-indigo-100 bg-white text-slate-900 focus:border-indigo-400"
        }`}
        readOnly={submitted}
      />
      {submitted && !isCorrect && (
        <p className={`mt-2 text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Correct answer: {correctAnswer}</p>
      )}
    </div>
  );
}

function MatchingPairs({ leftItems, rightItems, correctPairs, pairs, onChange, submitted, isDark }: {
  leftItems: MediaBlock[]; rightItems: MediaBlock[]; correctPairs: Record<string, string>; pairs: Record<string, string>; onChange: (pairs: Record<string, string>) => void; submitted: boolean; isDark?: boolean;
}) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const leftTexts = leftItems.map(item => item.text || "");
  const rightTexts = rightItems.map(item => item.text || "");

  const handleLeftClick = (item: string) => { if (!submitted) setSelectedLeft(item); };
  const handleRightClick = (item: string) => {
    if (submitted || !selectedLeft) return;
    onChange({ ...pairs, [selectedLeft]: item });
    setSelectedLeft(null);
  };

  return (
    <div>
      <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tap a left item, then tap its match on the right</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {leftTexts.map((item) => {
            const isPaired = !!pairs[item];
            const isSelected = selectedLeft === item;
            let style = isDark ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300" : "bg-indigo-50 border-indigo-200 text-indigo-900";
            if (isSelected) style = isDark ? "bg-indigo-500/40 border-indigo-400 text-white scale-105" : "bg-indigo-200 border-indigo-400 text-indigo-900 scale-105";
            if (isPaired && !submitted) style = isDark ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200" : "bg-emerald-50 border-emerald-200 text-emerald-900";
            if (submitted && pairs[item] === correctPairs[item]) style = isDark ? "bg-emerald-500/40 border-emerald-400 text-emerald-100" : "bg-emerald-100 border-emerald-400 text-emerald-900";
            if (submitted && pairs[item] && pairs[item] !== correctPairs[item]) style = isDark ? "bg-red-500/40 border-red-400 text-red-100" : "bg-red-100 border-red-400 text-red-900";
            return (
              <button key={item} onClick={() => handleLeftClick(item)} className={`w-full px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${style}`}>
                {item} {isPaired && !submitted && "→ " + pairs[item]}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {rightTexts.map((item) => {
            const isUsed = Object.values(pairs).includes(item);
            return (
              <button key={item} onClick={() => handleRightClick(item)} className={`w-full px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                isUsed && !submitted
                  ? isDark ? "bg-slate-800/50 border-slate-700 text-slate-500 opacity-50" : "bg-slate-100 border-slate-200 text-slate-500 opacity-50"
                  : selectedLeft
                  ? isDark ? "bg-amber-500/20 border-amber-500/40 text-amber-200 bouncy-hover" : "bg-amber-50 border-amber-200 text-amber-900 bouncy-hover"
                  : isDark ? "bg-slate-800/50 border-white/10 text-slate-300 hover:bg-slate-700" : "bg-slate-50 border-slate-100 text-slate-700"
              }`} disabled={isUsed && !submitted}>
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DragDropSimplified({ items, targets, correctMapping, mapping, onChange, submitted, isDark }: {
  items: MediaBlock[]; targets: MediaBlock[]; correctMapping: Record<string, string>; mapping: Record<string, string>; onChange: (m: Record<string, string>) => void; submitted: boolean; isDark?: boolean;
}) {
  const itemTexts = items.map(i => i.text || "");
  const targetTexts = targets.map(t => t.text || "");

  return (
    <div>
      <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Select the correct target for each item</p>
      <div className="space-y-3">
        {itemTexts.map((item) => (
          <div key={item} className="flex items-center gap-3">
            <span className={`border-2 rounded-xl px-4 py-2 font-bold text-sm min-w-[100px] ${isDark ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-900'}`}>{item}</span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>→</span>
            <select
              value={mapping[item] || ""}
              onChange={(e) => !submitted && onChange({ ...mapping, [item]: e.target.value })}
              className={`flex-1 px-3 py-2 rounded-xl border-2 font-medium text-sm outline-none ${
                submitted && mapping[item] === correctMapping[item]
                  ? isDark ? "border-emerald-500 bg-emerald-900/40 text-emerald-200" : "border-emerald-400 bg-emerald-50 text-emerald-900"
                  : submitted && mapping[item]
                  ? isDark ? "border-red-500 bg-red-900/40 text-red-200" : "border-red-400 bg-red-50 text-red-900"
                  : isDark ? "border-white/10 bg-slate-800/50 text-white focus:border-indigo-400" : "border-slate-200 bg-white text-slate-900 focus:border-indigo-400"
              }`}
              disabled={submitted}
            >
              <option value="">Select...</option>
              {targetTexts.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function TheoryInput({ value, onChange, submitted, sampleAnswer, maxWords, isDark }: {
  value: string; onChange: (val: string) => void; submitted: boolean; sampleAnswer?: string; maxWords?: number; isDark?: boolean;
}) {
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => !submitted && onChange(e.target.value)}
        placeholder="Write your answer here..."
        className={`w-full px-5 py-4 rounded-2xl border-2 text-base font-medium focus:outline-none h-40 resize-y ${
          submitted
            ? isDark ? "border-indigo-500 bg-indigo-900/20 text-indigo-200" : "border-indigo-400 bg-indigo-50 text-indigo-900"
            : isDark ? "border-white/10 bg-slate-800/50 text-white focus:border-indigo-400" : "border-indigo-100 bg-white text-slate-900 focus:border-indigo-400"
        }`}
        readOnly={submitted}
      />
      <div className="flex justify-between mt-2">
        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{wordCount} words</span>
        {maxWords && <span className={`text-xs ${wordCount > maxWords ? 'text-red-500 font-bold' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>Max: {maxWords}</span>}
      </div>
      {submitted && sampleAnswer && (
        <div className={`mt-4 p-4 rounded-2xl border-2 ${isDark ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
          <p className={`text-sm font-bold mb-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>📖 Sample Answer:</p>
          <p className={`text-sm ${isDark ? 'text-emerald-200' : 'text-emerald-800'}`}>{sampleAnswer}</p>
        </div>
      )}
    </div>
  );
}
