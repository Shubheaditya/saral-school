"use client";

import { useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApp } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { useGamification } from "../../contexts/GamificationContext";
import Sparky from "../../components/Sparky";
import ProgressBar from "../../components/ProgressBar";
import { Question, MediaBlock, MarkingScheme, migrateQuestion } from "../../types";
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

// ========== Marks Calculation Engine ==========
function calculateMarks(q: Question, answer: string | number | number[] | Record<string, string> | undefined): number {
  const scheme: MarkingScheme = q.markingScheme || { maxMarks: 1, negativeMarks: 0 };
  const { maxMarks, negativeMarks = 0, multiCorrectMode = "all-or-nothing" } = scheme;

  if (answer === undefined || answer === null) return 0;

  switch (q.type) {
    case "mcq": {
      const correct = answer === q.correctIndex;
      return correct ? maxMarks : -negativeMarks;
    }
    case "multi-correct": {
      const selected = (answer as number[]) || [];
      const expected = q.correctIndices || [];
      if (selected.length === 0) return 0;

      if (multiCorrectMode === "all-or-nothing") {
        const perfect = selected.length === expected.length && selected.sort().every((v, i) => v === expected.slice().sort()[i]);
        return perfect ? maxMarks : (negativeMarks > 0 ? -negativeMarks : 0);
      } else if (multiCorrectMode === "any-wrong-full-negative") {
        const hasAnyWrong = selected.some(s => !expected.includes(s));
        if (hasAnyWrong) return -negativeMarks;
        const perfect = selected.length === expected.length && selected.slice().sort().every((v, i) => v === expected.slice().sort()[i]);
        return perfect ? maxMarks : 0;
      } else {
        const perCorrectOption = expected.length > 0 ? maxMarks / expected.length : 0;
        let marks = 0;
        for (const s of selected) {
          if (expected.includes(s)) marks += perCorrectOption;
          else marks -= negativeMarks;
        }
        return Math.max(marks, -maxMarks);
      }
    }
    case "fill-blank": {
      const userAns = (answer as string || "").trim().toLowerCase();
      const correct = userAns === (q.correctAnswer || "").toLowerCase() ||
        (q.acceptableAnswers || []).some(a => a.toLowerCase() === userAns);
      return correct ? maxMarks : -negativeMarks;
    }
    case "matching":
    case "drag-drop": {
      const pairs = (answer as Record<string, string>) || {};
      const allCorrect = Object.entries(q.correctPairs || {}).every(([k, v]) => pairs[k] === v);
      return allCorrect ? maxMarks : -negativeMarks;
    }
    case "theory":
      return maxMarks;
    default:
      return 0;
  }
}

function isAnswerCorrect(q: Question, answer: string | number | number[] | Record<string, string> | undefined): boolean {
  if (answer === undefined || answer === null) return false;
  switch (q.type) {
    case "mcq": return answer === q.correctIndex;
    case "multi-correct": {
      const selected = (answer as number[]) || [];
      const expected = q.correctIndices || [];
      return selected.length === expected.length && selected.slice().sort().every((v, i) => v === expected.slice().sort()[i]);
    }
    case "fill-blank": {
      const ua = (answer as string || "").trim().toLowerCase();
      return ua === (q.correctAnswer || "").toLowerCase() || (q.acceptableAnswers || []).some(a => a.toLowerCase() === ua);
    }
    case "matching": case "drag-drop": {
      const pairs = (answer as Record<string, string>) || {};
      return Object.entries(q.correctPairs || {}).every(([k, v]) => pairs[k] === v);
    }
    case "theory": return true;
    default: return false;
  }
}

function getCorrectAnswerText(q: Question): string {
  switch (q.type) {
    case "mcq": return q.options?.[q.correctIndex ?? 0]?.text || "N/A";
    case "multi-correct": return (q.correctIndices || []).map(i => q.options?.[i]?.text || "").join(", ");
    case "fill-blank": return q.correctAnswer || "N/A";
    case "matching": case "drag-drop": return Object.entries(q.correctPairs || {}).map(([l, r]) => `${l} → ${r}`).join(", ");
    case "theory": return q.sampleAnswer || "See sample answer";
    default: return "N/A";
  }
}

function getUserAnswerText(q: Question, answer: any): string {
  if (answer === undefined || answer === null) return "Not answered";
  switch (q.type) {
    case "mcq": return q.options?.[answer as number]?.text || "N/A";
    case "multi-correct": return (answer as number[]).map(i => q.options?.[i]?.text || "").join(", ") || "None selected";
    case "fill-blank": return (answer as string) || "Blank";
    case "matching": case "drag-drop": return Object.entries(answer as Record<string, string>).map(([l, r]) => `${l} → ${r}`).join(", ");
    case "theory": return (answer as string) || "Blank";
    default: return "N/A";
  }
}

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;
  const { getQuizById } = useApp();
  const { currentUser } = useAuth();
  const { addPoints, addGems, completeQuiz, checkAndAwardBadges } = useGamification();
  const { backgroundClass, textClass } = useUniversalTheme();

  const rawQuiz = getQuizById(quizId);
  
  // Quiz not found — show error
  if (!rawQuiz) {
    return (
      <main className={`min-h-screen ${backgroundClass} ${textClass} relative flex flex-col items-center justify-center px-6 py-12`}>
        <UniversalBackground />
        <div className="relative z-10 text-center">
          <span className="text-6xl block mb-4">🔍</span>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Quiz Not Found</h1>
          <p className="text-slate-500 mb-6">This quiz may have been deleted or doesn&apos;t exist.</p>
          <button onClick={() => router.back()} className="px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-500 text-white rounded-2xl font-bold shadow-lg">← Go Back</button>
        </div>
      </main>
    );
  }

  const quiz = { ...rawQuiz, questions: rawQuiz.questions.map(q => migrateQuestion(q)) };
  const totalMarks = quiz.questions.reduce((sum, q) => sum + (q.markingScheme?.maxMarks || 1), 0);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number | number[] | Record<string, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isCorrectState, setIsCorrectState] = useState(false);
  const [lastMarks, setLastMarks] = useState(0);
  const [finished, setFinished] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [theoryText, setTheoryText] = useState("");
  const [showSolutions, setShowSolutions] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [questionMarks, setQuestionMarks] = useState<number[]>([]);

  const question = quiz.questions[current];
  const totalQ = quiz.questions.length;
  const progress = ((current + (submitted ? 1 : 0)) / totalQ) * 100;

  const checkAnswer = useCallback(() => {
    const answer = answers[current];
    const marks = calculateMarks(question, answer);
    const correct = isAnswerCorrect(question, answer);
    setIsCorrectState(correct);
    setLastMarks(marks);
    setTotalScore(prev => prev + marks);
    setQuestionMarks(prev => [...prev, marks]);
    setSubmitted(true);
  }, [answers, current, question]);

  const handleNext = () => {
    if (current < totalQ - 1) {
      setCurrent(current + 1);
      setSubmitted(false);
      setIsCorrectState(false);
      setLastMarks(0);
      setTheoryText("");
    } else {
      // Quiz complete — award points
      const finalScore = totalScore;
      const percentage = Math.round((Math.max(finalScore, 0) / totalMarks) * 100);
      let pts = 10;
      if (percentage >= 80) pts = 50;
      else if (percentage >= 50) pts = 25;
      
      setPointsAwarded(pts);
      addPoints(pts);
      if (percentage >= 80) addGems(5);
      else if (percentage >= 50) addGems(2);
      else addGems(1);

      completeQuiz(quizId);
      checkAndAwardBadges();

      // Save attempt to DB
      if (currentUser?.id) {
        fetch("/api/user/quiz-attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            quizId: quiz.id,
            subjectId: quiz.subjectId,
            score: Math.max(finalScore, 0),
            totalMarks,
            percentage,
            answers,
          }),
        }).catch(console.error);
      }

      setFinished(true);
    }
  };

  // ========== FINISHED — TEST REPORT ==========
  if (finished) {
    const percentage = Math.round((Math.max(totalScore, 0) / totalMarks) * 100);
    const clampedScore = Math.max(totalScore, 0);
    const correctCount = quiz.questions.filter((q, i) => isAnswerCorrect(q, answers[i])).length;
    const wrongCount = totalQ - correctCount;

    return (
      <main className={`min-h-screen ${backgroundClass} ${textClass} relative transition-colors duration-500`}>
        <UniversalBackground />
        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-black text-slate-900">Test Report</h1>
            <button onClick={() => router.back()} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm">Done ✓</button>
          </div>

          {/* Score Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <Sparky
                mood={percentage >= 80 ? "celebrating" : percentage >= 50 ? "happy" : "encouraging"}
                size="sm"
                message={percentage >= 80 ? "Outstanding!" : percentage >= 50 ? "Good effort!" : "Keep practicing!"}
              />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">{quiz.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-rose-50 rounded-xl p-4 text-center border border-rose-100">
                <p className="text-2xl font-black text-rose-600">{clampedScore}/{totalMarks}</p>
                <p className="text-xs font-bold text-slate-500 mt-1">Score</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                <p className="text-2xl font-black text-purple-600">{percentage}%</p>
                <p className="text-xs font-bold text-slate-500 mt-1">Percentage</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                <p className="text-2xl font-black text-emerald-600">{correctCount}/{totalQ}</p>
                <p className="text-xs font-bold text-slate-500 mt-1">Correct</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
                <p className="text-2xl font-black text-amber-600">+{pointsAwarded}</p>
                <p className="text-xs font-bold text-slate-500 mt-1">Points Earned</p>
              </div>
            </div>
            {totalScore < 0 && (
              <div className="bg-red-50 rounded-xl p-3 border border-red-100 mt-4">
                <p className="text-sm font-bold text-red-600">Negative marks applied: {totalScore} total (clamped to 0)</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button 
              onClick={() => { setCurrent(0); setAnswers({}); setTotalScore(0); setSubmitted(false); setFinished(false); setQuestionMarks([]); setPointsAwarded(0); setShowSolutions(false); }}
              className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
            >🔄 Try Again</button>
            <button
              onClick={() => setShowSolutions(!showSolutions)}
              className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl"
            >{showSolutions ? "Hide Solutions" : "📖 View Solutions"}</button>
          </div>

          {/* Question-by-Question Review */}
          {showSolutions && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900">Question Review</h3>
              {quiz.questions.map((q, idx) => {
                const userAnswer = answers[idx];
                const correct = isAnswerCorrect(q, userAnswer);
                const marks = questionMarks[idx] ?? 0;

                return (
                  <div key={q.id} className={`bg-white rounded-2xl border-2 p-5 ${correct ? 'border-emerald-200' : 'border-red-200'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white ${correct ? 'bg-emerald-500' : 'bg-red-500'}`}>{idx + 1}</span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 uppercase">{q.type}</span>
                      </div>
                      <span className={`text-sm font-bold ${marks > 0 ? 'text-emerald-600' : marks < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                        {marks > 0 ? `+${marks}` : marks} / {q.markingScheme?.maxMarks || 1}
                      </span>
                    </div>

                    {/* Question */}
                    <div className="text-sm font-medium text-slate-900 mb-3">
                      <MediaBlockView block={q.prompt} />
                    </div>

                    {/* Your Answer vs Correct */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div className={`rounded-xl p-3 text-sm ${correct ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
                        <p className={`text-[10px] font-bold uppercase mb-1 ${correct ? 'text-emerald-600' : 'text-red-600'}`}>Your Answer {correct ? '✅' : '❌'}</p>
                        <p className="text-slate-700 font-medium">{getUserAnswerText(q, userAnswer)}</p>
                      </div>
                      {!correct && (
                        <div className="bg-emerald-50 rounded-xl p-3 text-sm border border-emerald-100">
                          <p className="text-[10px] font-bold uppercase mb-1 text-emerald-600">Correct Answer ✅</p>
                          <p className="text-slate-700 font-medium">{getCorrectAnswerText(q)}</p>
                        </div>
                      )}
                    </div>

                    {/* Solution/Explanation */}
                    {q.explanation && (
                      <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                        <p className="text-[10px] font-bold uppercase mb-1 text-purple-600">💡 Solution</p>
                        <p className="text-sm text-slate-700">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    );
  }

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
          <div className="text-center">
            <span className="text-sm font-bold text-slate-500">{current + 1} / {totalQ}</span>
            {submitted && <p className={`text-xs font-bold mt-0.5 ${lastMarks > 0 ? 'text-emerald-600' : lastMarks < 0 ? 'text-red-500' : 'text-slate-400'}`}>{lastMarks > 0 ? `+${lastMarks}` : lastMarks === 0 ? '0' : lastMarks} marks</p>}
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 mb-6">
          <ProgressBar value={progress} color="bg-rose-500" height="h-2" />
        </div>

        {/* Question Card */}
        <div className="px-6 max-w-2xl mx-auto">
          <div className="bg-white border-2 border-rose-100 shadow-xl rounded-3xl p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-rose-400 uppercase">Question {current + 1}</p>
              <span className="text-xs font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                {question.markingScheme?.maxMarks || 1} mark{(question.markingScheme?.maxMarks || 1) !== 1 ? "s" : ""}
                {(question.markingScheme?.negativeMarks || 0) > 0 ? ` | -${question.markingScheme?.negativeMarks} negative` : ""}
              </span>
            </div>
            <div className="text-xl md:text-2xl font-black mb-6 text-slate-900">
              <MediaBlockView block={question.prompt} />
            </div>

            {question.type === "mcq" && question.options && (
              <MCQOptions options={question.options} correctIndex={question.correctIndex} selected={answers[current] as number | undefined}
                onSelect={(idx) => setAnswers({ ...answers, [current]: idx })} submitted={submitted} />
            )}
            {question.type === "multi-correct" && question.options && (
              <MultiCorrectOptions options={question.options} correctIndices={question.correctIndices || []} selected={(answers[current] as number[]) || []}
                onToggle={(idx) => { const prev = (answers[current] as number[]) || []; setAnswers({ ...answers, [current]: prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx] }); }}
                submitted={submitted} />
            )}
            {question.type === "fill-blank" && (
              <FillBlankInput correctAnswer={question.correctAnswer || ""} value={(answers[current] as string) || ""}
                onChange={(val) => setAnswers({ ...answers, [current]: val })} submitted={submitted} isCorrect={isCorrectState} />
            )}
            {question.type === "matching" && question.leftItems && question.rightItems && (
              <MatchingPairs leftItems={question.leftItems} rightItems={question.rightItems} correctPairs={question.correctPairs || {}}
                pairs={(answers[current] as Record<string, string>) || {}} onChange={(pairs) => setAnswers({ ...answers, [current]: pairs })} submitted={submitted} />
            )}
            {question.type === "drag-drop" && question.leftItems && question.rightItems && (
              <DragDropSimplified items={question.leftItems} targets={question.rightItems} correctMapping={question.correctPairs || {}}
                mapping={(answers[current] as Record<string, string>) || {}} onChange={(mapping) => setAnswers({ ...answers, [current]: mapping })} submitted={submitted} />
            )}
            {question.type === "theory" && (
              <TheoryInput value={theoryText} onChange={(val) => { setTheoryText(val); setAnswers({ ...answers, [current]: val }); }}
                submitted={submitted} sampleAnswer={question.sampleAnswer} maxWords={question.maxWords} />
            )}
          </div>

          {/* Mascot Feedback */}
          {submitted && (
            <div className="mb-6">
              <Sparky mood={isCorrectState ? "celebrating" : "encouraging"} size="sm"
                message={question.type === "theory" ? "Answer submitted! Review the sample answer below." :
                  lastMarks > 0 ? `Excellent! +${lastMarks} marks!` :
                  lastMarks < 0 ? `Wrong — ${lastMarks} marks. ${question.explanation || "Try again next time!"}` :
                  `Not quite! ${question.explanation || "Try again next time!"}`} />
            </div>
          )}

          {/* Action Button */}
          <div className="pb-8">
            {!submitted ? (
              <button onClick={checkAnswer} disabled={!hasAnswer}
                className={`w-full py-4 rounded-2xl text-lg font-bold shadow-lg bouncy-hover ${hasAnswer ? "bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-rose-200" : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"}`}>
                Submit Answer
              </button>
            ) : (
              <button onClick={handleNext} className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-lg font-bold shadow-lg shadow-emerald-200 bouncy-hover">
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

function MCQOptions({ options, correctIndex, selected, onSelect, submitted }: {
  options: MediaBlock[]; correctIndex?: number; selected?: number; onSelect: (idx: number) => void; submitted: boolean;
}) {
  return (
    <div className="space-y-3">
      {options.map((option, idx) => {
        let style = "bg-slate-50 border-slate-100 hover:bg-rose-50 hover:border-rose-200 text-slate-900";
        if (selected === idx && !submitted) style = "bg-rose-100 border-rose-400 text-rose-900";
        if (submitted && idx === correctIndex) style = "bg-emerald-100 border-emerald-400 text-emerald-900";
        if (submitted && selected === idx && idx !== correctIndex) style = "bg-red-100 border-red-400 text-red-900";
        return (
          <button key={idx} onClick={() => !submitted && onSelect(idx)} className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-medium transition-all ${style} ${!submitted ? "bouncy-hover" : ""}`}>
            <span className="font-bold mr-2 text-slate-500">{String.fromCharCode(65 + idx)}.</span>
            <MediaBlockView block={option} className="inline" />
            {submitted && idx === correctIndex && <span className="float-right">✅</span>}
            {submitted && selected === idx && idx !== correctIndex && <span className="float-right">❌</span>}
          </button>
        );
      })}
    </div>
  );
}

function MultiCorrectOptions({ options, correctIndices, selected, onToggle, submitted }: {
  options: MediaBlock[]; correctIndices: number[]; selected: number[]; onToggle: (idx: number) => void; submitted: boolean;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm mb-1 text-slate-500">Select all correct answers</p>
      {options.map((option, idx) => {
        const isSelected = selected.includes(idx);
        const isCorrectOption = correctIndices.includes(idx);
        let style = "bg-slate-50 border-slate-100 hover:bg-rose-50 text-slate-900";
        if (isSelected && !submitted) style = "bg-rose-100 border-rose-400 text-rose-900";
        if (submitted && isCorrectOption) style = "bg-emerald-100 border-emerald-400 text-emerald-900";
        if (submitted && isSelected && !isCorrectOption) style = "bg-red-100 border-red-400 text-red-900";
        return (
          <button key={idx} onClick={() => !submitted && onToggle(idx)} className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-medium transition-all ${style} ${!submitted ? "bouncy-hover" : ""}`}>
            <span className="font-bold mr-2 text-slate-500">{isSelected ? "☑" : "☐"}</span>
            <MediaBlockView block={option} className="inline" />
            {submitted && isCorrectOption && <span className="float-right">✅</span>}
            {submitted && isSelected && !isCorrectOption && <span className="float-right">❌</span>}
          </button>
        );
      })}
    </div>
  );
}

function FillBlankInput({ correctAnswer, value, onChange, submitted, isCorrect }: {
  correctAnswer: string; value: string; onChange: (val: string) => void; submitted: boolean; isCorrect: boolean;
}) {
  return (
    <div>
      <input type="text" value={value} onChange={(e) => !submitted && onChange(e.target.value)} placeholder="Type your answer..."
        className={`w-full px-5 py-4 rounded-2xl border-2 text-lg font-medium focus:outline-none ${submitted ? (isCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-900" : "border-red-400 bg-red-50 text-red-900") : "border-rose-100 bg-white text-slate-900 focus:border-rose-400"}`}
        readOnly={submitted} />
      {submitted && !isCorrect && <p className="mt-2 text-sm font-bold text-emerald-600">Correct answer: {correctAnswer}</p>}
    </div>
  );
}

function MatchingPairs({ leftItems, rightItems, correctPairs, pairs, onChange, submitted }: {
  leftItems: MediaBlock[]; rightItems: MediaBlock[]; correctPairs: Record<string, string>; pairs: Record<string, string>; onChange: (pairs: Record<string, string>) => void; submitted: boolean;
}) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const leftTexts = leftItems.map(item => item.text || "");
  const rightTexts = rightItems.map(item => item.text || "");
  const handleLeftClick = (item: string) => { if (!submitted) setSelectedLeft(item); };
  const handleRightClick = (item: string) => { if (submitted || !selectedLeft) return; onChange({ ...pairs, [selectedLeft]: item }); setSelectedLeft(null); };
  return (
    <div>
      <p className="text-sm mb-3 text-slate-500">Tap a left item, then tap its match on the right</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {leftTexts.map((item) => {
            const isPaired = !!pairs[item]; const isSelected = selectedLeft === item;
            let style = "bg-rose-50 border-rose-200 text-rose-900";
            if (isSelected) style = "bg-rose-200 border-rose-400 text-rose-900 scale-105";
            if (isPaired && !submitted) style = "bg-emerald-50 border-emerald-200 text-emerald-900";
            if (submitted && pairs[item] === correctPairs[item]) style = "bg-emerald-100 border-emerald-400 text-emerald-900";
            if (submitted && pairs[item] && pairs[item] !== correctPairs[item]) style = "bg-red-100 border-red-400 text-red-900";
            return (<button key={item} onClick={() => handleLeftClick(item)} className={`w-full px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${style}`}>{item} {isPaired && !submitted && "→ " + pairs[item]}</button>);
          })}
        </div>
        <div className="space-y-2">
          {rightTexts.map((item) => {
            const isUsed = Object.values(pairs).includes(item);
            return (<button key={item} onClick={() => handleRightClick(item)} className={`w-full px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${isUsed && !submitted ? "bg-slate-100 border-slate-200 text-slate-500 opacity-50" : selectedLeft ? "bg-amber-50 border-amber-200 text-amber-900 bouncy-hover" : "bg-slate-50 border-slate-100 text-slate-700"}`} disabled={isUsed && !submitted}>{item}</button>);
          })}
        </div>
      </div>
    </div>
  );
}

function DragDropSimplified({ items, targets, correctMapping, mapping, onChange, submitted }: {
  items: MediaBlock[]; targets: MediaBlock[]; correctMapping: Record<string, string>; mapping: Record<string, string>; onChange: (m: Record<string, string>) => void; submitted: boolean;
}) {
  const itemTexts = items.map(i => i.text || "");
  const targetTexts = targets.map(t => t.text || "");
  return (
    <div>
      <p className="text-sm mb-3 text-slate-500">Select the correct target for each item</p>
      <div className="space-y-3">
        {itemTexts.map((item) => (
          <div key={item} className="flex items-center gap-3">
            <span className="border-2 rounded-xl px-4 py-2 font-bold text-sm min-w-[100px] bg-rose-50 border-rose-200 text-rose-900">{item}</span>
            <span className="text-slate-400">→</span>
            <select value={mapping[item] || ""} onChange={(e) => !submitted && onChange({ ...mapping, [item]: e.target.value })}
              className={`flex-1 px-3 py-2 rounded-xl border-2 font-medium text-sm outline-none ${submitted && mapping[item] === correctMapping[item] ? "border-emerald-400 bg-emerald-50 text-emerald-900" : submitted && mapping[item] ? "border-red-400 bg-red-50 text-red-900" : "border-slate-200 bg-white text-slate-900 focus:border-rose-400"}`}
              disabled={submitted}>
              <option value="">Select...</option>
              {targetTexts.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function TheoryInput({ value, onChange, submitted, sampleAnswer, maxWords }: {
  value: string; onChange: (val: string) => void; submitted: boolean; sampleAnswer?: string; maxWords?: number;
}) {
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
  return (
    <div>
      <textarea value={value} onChange={(e) => !submitted && onChange(e.target.value)} placeholder="Write your answer here..."
        className={`w-full px-5 py-4 rounded-2xl border-2 text-base font-medium focus:outline-none h-40 resize-y ${submitted ? "border-rose-400 bg-rose-50 text-rose-900" : "border-rose-100 bg-white text-slate-900 focus:border-rose-400"}`}
        readOnly={submitted} />
      <div className="flex justify-between mt-2">
        <span className="text-xs text-slate-400">{wordCount} words</span>
        {maxWords && <span className={`text-xs ${wordCount > maxWords ? 'text-red-500 font-bold' : 'text-slate-400'}`}>Max: {maxWords}</span>}
      </div>
      {submitted && sampleAnswer && (
        <div className="mt-4 p-4 rounded-2xl border-2 bg-emerald-50 border-emerald-200">
          <p className="text-sm font-bold mb-1 text-emerald-700">📖 Sample Answer:</p>
          <p className="text-sm text-emerald-800">{sampleAnswer}</p>
        </div>
      )}
    </div>
  );
}
