"use client";

import { useEffect, useState } from "react";
import {
  QUIZ_QUESTIONS,
  scoreQuiz,
  type QuizAnswers,
  type QuizResult,
} from "@/lib/quiz";
import { getQuizProgress, setQuizProgress } from "@/lib/progress";

export function Quiz({
  onComplete,
}: {
  onComplete: (payload: { answers: QuizAnswers; result: QuizResult }) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  // กู้ความคืบหน้าเดิม (เผื่อรีเฟรช/พี่ปิดกิจกรรมกลางคัน)
  useEffect(() => {
    const p = getQuizProgress();
    if (p) {
      setAnswers(p.answers);
      setIndex(Math.min(p.index, QUIZ_QUESTIONS.length - 1));
    }
  }, []);

  const total = QUIZ_QUESTIONS.length;
  const question = QUIZ_QUESTIONS[index];
  const current = answers[question.id];

  function choose(optionId: string) {
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);

    const isLast = index === total - 1;
    if (isLast) {
      setQuizProgress({ index, answers: next });
      onComplete({ answers: next, result: scoreQuiz(next) });
    } else {
      const nextIndex = index + 1;
      setQuizProgress({ index: nextIndex, answers: next });
      setIndex(nextIndex);
    }
  }

  return (
    <div className="animate-pop-in">
      {/* progress */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-ink/60">
          <span>ข้อ {index + 1} / {total}</span>
          <span>{Math.round(((index) / total) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full bg-brand transition-all duration-300"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
      </div>

      <h1 className="font-display text-2xl font-bold text-ink text-balance">
        {question.prompt}
      </h1>

      <div className="mt-6 grid gap-3">
        {question.options.map((opt) => {
          const isSelected = current === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => choose(opt.id)}
              className={`tap-target flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left transition active:scale-[0.99] ${
                isSelected
                  ? "border-brand bg-brand-light shadow-md"
                  : "border-black/10 bg-white hover:border-brand/40"
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="flex-1 font-medium text-ink">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {index > 0 && (
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="mt-5 text-sm font-medium text-ink/50 underline underline-offset-4"
        >
          ← ย้อนกลับข้อก่อนหน้า
        </button>
      )}
    </div>
  );
}
