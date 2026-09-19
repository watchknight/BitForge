import React, { useState } from 'react';
import { QuizQuestion } from '../../types/topic';
import { useProgress } from '../../context/ProgressContext';
import { CheckCircle2, XCircle, Award, RotateCcw, ChevronRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizCardProps {
  topicId: string;
  questions: QuizQuestion[];
}

export const QuizCard: React.FC<QuizCardProps> = ({ topicId, questions }) => {
  const { recordQuizScore, getTopicProgress } = useProgress();
  const currentProgress = getTopicProgress(topicId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentIndex === questions.length - 1) {
      setIsFinished(true);
      recordQuizScore(topicId, newScore, questions.length);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="bg-obsidian-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
      {/* Quiz Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-400" />
          <h3 className="text-base font-bold text-white font-sans">
            Concept Mastery Check
          </h3>
        </div>

        {!isFinished && (
          <span className="text-xs font-mono text-slate-400 bg-obsidian-950 px-2.5 py-1 rounded-md border border-slate-800">
            Question {currentIndex + 1} of {questions.length}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            {/* Question title */}
            <p className="text-sm md:text-base font-medium text-slate-100 leading-snug">
              {currentQ.question}
            </p>

            {/* Options list */}
            <div className="space-y-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyle = 'bg-obsidian-950/80 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-800/40';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 font-semibold shadow-sm';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950/50 border-rose-500/60 text-rose-200';
                  } else {
                    btnStyle = 'bg-obsidian-950/40 border-slate-800/60 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all flex items-start justify-between gap-3 ${btnStyle}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full border border-slate-700/80 flex items-center justify-center text-[11px] font-mono shrink-0 text-slate-400 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  selectedOption === currentQ.correctIndex
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                    : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  {selectedOption === currentQ.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Explanation:</span>
                    </>
                  )}
                </div>
                <p className="text-slate-300">{currentQ.explanation}</p>
              </motion.div>
            )}

            {/* Next question button */}
            {isAnswered && currentIndex < questions.length - 1 && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-obsidian-950 text-xs font-bold transition-all shadow-md"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          /* Finished Screen */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center py-6 space-y-4"
          >
            <div className="w-14 h-14 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 flex items-center justify-center shadow-lg">
              <Award className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white font-sans">
                {score >= Math.ceil(questions.length * 0.6)
                  ? 'Great Job! Quiz Passed'
                  : 'Practice Makes Perfect!'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                You scored <span className="text-brand-300 font-bold">{score}</span> out of{' '}
                <span className="text-slate-200 font-bold">{questions.length}</span> (
                {Math.round((score / questions.length) * 100)}%)
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
