import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  Sparkles, 
  Zap, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  Layers,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { topicsData } from '../data/topicsData';
import { useProgress } from '../context/ProgressContext';
import { QuizQuestion } from '../types/topic';
import { soundEngine } from '../services/soundEngine';

interface HubQuestion extends QuizQuestion {
  topicId: string;
  topicTitle: string;
  categoryName: string;
}

type QuizMode = 'blitz' | 'category' | 'exam';

interface QuizHubPageProps {
  onSelectTopic?: (topicId: string) => void;
  onGoToRoadmap?: () => void;
}

export const QuizHubPage: React.FC<QuizHubPageProps> = ({
  onSelectTopic,
  onGoToRoadmap,
}) => {
  const { addXp, recordQuizScore } = useProgress();

  // Mode and setup state
  const [activeMode, setActiveMode] = useState<QuizMode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Sorting Algorithms');
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Active quiz state
  const [currentQuestions, setCurrentQuestions] = useState<HubQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<{
    question: HubQuestion;
    chosenIndex: number;
    isCorrect: boolean;
  }[]>([]);

  // Collect all questions from all topics
  const allQuestions: HubQuestion[] = useMemo(() => {
    const list: HubQuestion[] = [];
    Object.values(topicsData).forEach((topic) => {
      if (topic.quiz && Array.isArray(topic.quiz)) {
        topic.quiz.forEach((q) => {
          list.push({
            ...q,
            topicId: topic.id,
            topicTitle: topic.title,
            categoryName: topic.categoryName,
          });
        });
      }
    });
    return list;
  }, []);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    allQuestions.forEach((q) => set.add(q.categoryName));
    return Array.from(set);
  }, [allQuestions]);

  // Shuffle helper
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Start quiz with selected mode
  const startQuiz = (mode: QuizMode) => {
    setActiveMode(mode);
    let pool = [...allQuestions];

    if (mode === 'category') {
      pool = pool.filter((q) => q.categoryName === selectedCategory);
    }

    const shuffled = shuffleArray(pool);
    let count = 5;
    if (mode === 'category') count = Math.min(10, shuffled.length);
    if (mode === 'exam') count = Math.min(15, shuffled.length);

    setCurrentQuestions(shuffled.slice(0, count));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setQuizStarted(true);
    setQuizCompleted(false);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(optionIndex);

    const question = currentQuestions[currentIndex];
    const isCorrect = optionIndex === question.correctIndex;

    if (isCorrect) {
      soundEngine.playTone(523.25, 'sine', 0.08, 0.07);
      setTimeout(() => soundEngine.playTone(783.99, 'sine', 0.12, 0.08), 80);
    } else {
      soundEngine.playTone(220, 'triangle', 0.12, 0.06);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        question,
        chosenIndex: optionIndex,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < currentQuestions.length - 1) {
      soundEngine.playClickBeep();
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz complete!
      soundEngine.playSuccessChime();
      setQuizCompleted(true);
      const correctCount = userAnswers.filter((a) => a.isCorrect).length;
      // Award XP
      const earnedXp = correctCount * 15 + (correctCount === currentQuestions.length ? 50 : 0);
      addXp(earnedXp);

      // Record scores for respective topics
      userAnswers.forEach((ans) => {
        if (ans.isCorrect) {
          recordQuizScore(ans.question.topicId, 1, 1);
        }
      });
    }
  };


  const resetToModeSelect = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setActiveMode(null);
    setSelectedAnswer(null);
    setCurrentQuestions([]);
    setUserAnswers([]);
  };

  const scoreCount = userAnswers.filter((a) => a.isCorrect).length;
  const scorePercent = currentQuestions.length > 0 ? Math.round((scoreCount / currentQuestions.length) * 100) : 0;
  const activeQuestion = currentQuestions[currentIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-500/30 text-brand-300 text-xs font-mono mb-2">
          <GraduationCap className="w-3.5 h-3.5 text-brand-400" />
          DSA Assessment & Review Center
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Quiz Hub
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-1">
          Challenge your conceptual understanding with {allQuestions.length}+ curated DSA questions from across the entire curriculum.
        </p>
      </div>

      {/* Mode Selection Screen */}
      {!quizStarted && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mode 1: Quick Blitz */}
            <div 
              role="button"
              tabIndex={0}
              data-testid="quiz-blitz-card"
              onClick={() => startQuiz('blitz')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startQuiz('blitz'); }}
              className="bg-obsidian-900 border border-slate-800 hover:border-brand-500/60 rounded-2xl p-6 shadow-xl cursor-pointer group transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors">
                Quick Blitz
              </h3>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                5 fast random questions from anywhere in the syllabus. Ideal for a rapid 3-minute warm-up.
              </p>
              <div className="mt-5 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-3">
                <span>5 Questions</span>
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  Start Blitz <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Mode 2: Category Sprint */}
            <div 
              className="bg-obsidian-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Category Sprint
                </h3>
                <p className="text-xs text-slate-400 mt-2 mb-3">
                  Target a specific topic domain to reinforce recent learning or prepare for an interview topic.
                </p>

                {/* Category selector dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-obsidian-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 mb-2"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => startQuiz('category')}
                className="w-full mt-4 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
              >
                <span>Sprint on {selectedCategory.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
              </button>
            </div>

            {/* Mode 3: Comprehensive Exam */}
            <div 
              role="button"
              tabIndex={0}
              data-testid="quiz-exam-card"
              onClick={() => startQuiz('exam')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startQuiz('exam'); }}
              className="bg-obsidian-900 border border-slate-800 hover:border-purple-500/60 rounded-2xl p-6 shadow-xl cursor-pointer group transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                Comprehensive Exam
              </h3>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                15 rigorous questions testing algorithms, data structure operations, complexities, and edge cases.
              </p>
              <div className="mt-5 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-3">
                <span>15 Questions</span>
                <span className="text-purple-400 font-semibold flex items-center gap-1">
                  Start Exam <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Quick Curriculum Stats */}
          <div className="bg-obsidian-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-wrap items-center justify-around gap-4 text-center">
            <div>
              <div className="text-3xl font-extrabold text-white font-mono">{allQuestions.length}</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">Total Question Bank</div>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden sm:block" />
            <div>
              <div className="text-3xl font-extrabold text-brand-400 font-mono">{categories.length}</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">DSA Categories</div>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden sm:block" />
            <div>
              <div className="text-3xl font-extrabold text-amber-400 font-mono">15 XP</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">Earned Per Correct Answer</div>
            </div>
          </div>
        </div>
      )}

      {/* Active Question Screen */}
      {quizStarted && !quizCompleted && activeQuestion && (
        <div className="bg-obsidian-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 animate-fadeIn">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-obsidian-950 border border-slate-800 text-brand-300 font-bold">
                Question {currentIndex + 1} of {currentQuestions.length}
              </span>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <span className="text-slate-300 hidden sm:inline">{activeQuestion.categoryName}</span>
              <span className="text-slate-500 hidden sm:inline">›</span>
              <span className="text-brand-400 font-medium hidden sm:inline">{activeQuestion.topicTitle}</span>
            </div>

            <button
              onClick={resetToModeSelect}
              className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Quit Quiz
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-brand-400 uppercase tracking-wider">
              From: {activeQuestion.topicTitle}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {activeQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {activeQuestion.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === activeQuestion.correctIndex;
              const hasAnswered = selectedAnswer !== null;

              let btnStyle = 'bg-obsidian-950 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-800/40';

              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/10';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/50 border-rose-500 text-rose-200 shadow-md shadow-rose-500/10';
                } else {
                  btnStyle = 'bg-obsidian-950/60 border-slate-800/60 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  data-testid={`quiz-option-${idx}`}
                  onClick={() => handleAnswerSelect(idx)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                      hasAnswered && isCorrect
                        ? 'bg-emerald-500 text-obsidian-950'
                        : hasAnswered && isSelected
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {letter}
                    </span>
                    <span className="text-sm font-medium">{option}</span>
                  </div>

                  {hasAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner when answered */}
          {selectedAnswer !== null && (
            <div className="p-4 rounded-xl bg-obsidian-950 border border-slate-800 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                {selectedAnswer === activeQuestion.correctIndex ? (
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct Answer! (+15 XP)
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold text-xs flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Incorrect
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeQuestion.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {selectedAnswer !== null && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-bold shadow-lg shadow-brand-500/20 transition-all transform active:scale-95"
              >
                <span>{currentIndex === currentQuestions.length - 1 ? 'View Quiz Results' : 'Next Question'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quiz Completed Screen */}
      {quizCompleted && (
        <div className="bg-obsidian-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-8 animate-fadeIn">
          {/* Score Hero */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-obsidian-950 font-extrabold text-2xl shadow-xl shadow-brand-500/20 mb-2">
              {scorePercent}%
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {scorePercent >= 80 ? 'Mastery Confirmed! 🏆' : scorePercent >= 60 ? 'Solid Fundamentals! 👍' : 'Keep Practicing! 📚'}
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              You answered <span className="text-white font-bold">{scoreCount}</span> out of{' '}
              <span className="text-white font-bold">{currentQuestions.length}</span> questions correctly.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>+{scoreCount * 15} XP added to your BitForge account</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-b border-slate-800/80 py-5">
            <button
              onClick={() => startQuiz(activeMode || 'blitz')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-bold text-sm shadow-md transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Retake This Quiz
            </button>

            <button
              onClick={resetToModeSelect}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all"
            >
              Choose Another Mode
            </button>

            {onGoToRoadmap && (
              <button
                onClick={onGoToRoadmap}
                className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-sm transition-all"
              >
                Back to Roadmap
              </button>
            )}
          </div>

          {/* Question by Question Review */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-400" />
              Question Review
            </h3>

            <div className="space-y-3">
              {userAnswers.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    ans.isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-obsidian-950 text-slate-400 border border-slate-800">
                        Q{idx + 1}
                      </span>
                      <span className="text-xs text-brand-400 font-medium">
                        {ans.question.topicTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono">
                      {ans.isCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1 font-bold">
                          <XCircle className="w-4 h-4" /> Missed
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-100 mb-2">
                    {ans.question.question}
                  </p>

                  <div className="text-xs text-slate-400 space-y-1">
                    <div>
                      <span className="text-slate-500">Your Answer:</span>{' '}
                      <span className={ans.isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                        {ans.question.options[ans.chosenIndex]}
                      </span>
                    </div>
                    {!ans.isCorrect && (
                      <div>
                        <span className="text-slate-500">Correct Answer:</span>{' '}
                        <span className="text-emerald-300 font-medium">
                          {ans.question.options[ans.question.correctIndex]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                    <strong className="text-slate-300">Explanation:</strong> {ans.question.explanation}
                  </div>

                  {onSelectTopic && (
                    <div className="mt-2 text-right">
                      <button
                        onClick={() => onSelectTopic(ans.question.topicId)}
                        className="text-xs text-brand-400 hover:underline inline-flex items-center gap-1"
                      >
                        Learn {ans.question.topicTitle} Simulation
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
