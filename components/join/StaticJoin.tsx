"use client";

import { useState } from "react";
import { ACTIVITIES, isPoll, type Activity } from "@/lib/activities";
import { type QuizResult } from "@/lib/quiz";
import { JoinShell } from "./JoinShell";
import { PollCard } from "./PollCard";
import { Quiz } from "./Quiz";
import { ResultCard } from "./ResultCard";

const MENU: string[] = ["icebreaker", "quickpoll", "cluster-guess", "career-quiz"];

export function StaticJoin() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [pollSelected, setPollSelected] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  function open(id: string) {
    setOpenId(id);
    setPollSelected(null);
    setQuizResult(null);
  }
  function back() {
    setOpenId(null);
    setPollSelected(null);
    setQuizResult(null);
  }

  const activity: Activity | null = openId ? ACTIVITIES[openId] : null;

  if (!activity) {
    return (
      <JoinShell>
        <div className="animate-pop-in">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            โหมดสำรอง
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink">
            เลือกกิจกรรมที่อยากลอง
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            โหมดนี้ทำเองได้เลย เก็บผลเฉพาะในเครื่องนี้ (ไม่ต้องต่อกับพี่)
          </p>

          <div className="mt-6 grid gap-3">
            {MENU.map((id) => {
              const a = ACTIVITIES[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => open(id)}
                  className="tap-target flex items-center gap-3 rounded-2xl border-2 border-black/10 bg-white px-4 py-4 text-left transition hover:border-brand/40 active:scale-[0.99]"
                >
                  <span className="text-2xl">
                    {isPoll(a) ? "📊" : "🎯"}
                  </span>
                  <span className="flex-1 font-medium text-ink">{a.title}</span>
                  <span className="text-ink/40">›</span>
                </button>
              );
            })}
          </div>
        </div>
      </JoinShell>
    );
  }

  return (
    <JoinShell>
      {isPoll(activity) ? (
        <div>
          <PollCard
            activity={activity}
            selected={pollSelected}
            onSelect={setPollSelected}
          />
          <button
            type="button"
            onClick={back}
            className="mt-6 w-full rounded-xl bg-black/[0.04] px-4 py-3 font-medium text-ink/70"
          >
            ← กลับเมนู
          </button>
        </div>
      ) : quizResult ? (
        <ResultCard result={quizResult} onBack={back} />
      ) : (
        <div>
          <Quiz onComplete={({ result }) => setQuizResult(result)} />
          <button
            type="button"
            onClick={back}
            className="mt-6 w-full rounded-xl bg-black/[0.04] px-4 py-3 font-medium text-ink/70"
          >
            ← กลับเมนู
          </button>
        </div>
      )}
    </JoinShell>
  );
}
