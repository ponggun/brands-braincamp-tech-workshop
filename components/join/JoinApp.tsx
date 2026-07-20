"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSessionId } from "@/lib/session";
import {
  getActivity,
  isPoll,
  isText,
  type PollActivity,
  type TextActivity,
} from "@/lib/activities";
import type { QuizAnswers, QuizResult } from "@/lib/quiz";
import {
  getDone,
  getPollSelection,
  setPollSelection,
  getTextSubmission,
  setTextSubmission,
  markDone,
  getQuizResult,
  setQuizResult,
  getQuizProgress,
  clearQuizProgress,
} from "@/lib/progress";
import { JoinShell } from "./JoinShell";
import { PollCard } from "./PollCard";
import { TextCard } from "./TextCard";
import { Quiz } from "./Quiz";
import { ResultCard } from "./ResultCard";
import { Standby } from "./Standby";

const POLL_MS = 2500;

export function JoinApp() {
  const [sid, setSid] = useState("");
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [reconnecting, setReconnecting] = useState(false);
  const [viewResult, setViewResult] = useState(false);
  const [tick, setTick] = useState(0); // บังคับ re-read localStorage
  const rerender = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    setSid(getSessionId());
  }, []);

  // short-poll สถานะกิจกรรมที่พี่เปิด
  const activeRef = useRef<string | null>(null);
  useEffect(() => {
    if (!sid) return;
    let alive = true;

    async function poll() {
      try {
        const res = await fetch(`/api/live?sid=${encodeURIComponent(sid)}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("bad status");
        const data = (await res.json()) as { activeActivity: string | null };
        if (!alive) return;
        setReconnecting(false);
        if (data.activeActivity !== activeRef.current) {
          activeRef.current = data.activeActivity;
          setActiveActivity(data.activeActivity);
          if (data.activeActivity) setViewResult(false);
        }
      } catch {
        if (alive) setReconnecting(true);
      }
    }

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [sid]);

  const submitPoll = useCallback(
    async (activity: PollActivity, optionId: string) => {
      setPollSelection(activity.id, optionId);
      rerender();
      try {
        await fetch("/api/respond", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sid, activityId: activity.id, optionId }),
        });
      } catch {
        /* เก็บไว้ในเครื่อง ถ้าเน็ตหลุดก็ไม่เป็นไร */
      }
    },
    [sid, rerender]
  );

  const submitText = useCallback(
    async (activity: TextActivity, text: string) => {
      setTextSubmission(activity.id, text);
      rerender();
      try {
        await fetch("/api/respond", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sid, activityId: activity.id, text }),
        });
      } catch {
        /* เก็บไว้ในเครื่อง ถ้าเน็ตหลุดก็ไม่เป็นไร */
      }
    },
    [sid, rerender]
  );

  const completeQuiz = useCallback(
    async ({ result }: { answers: QuizAnswers; result: QuizResult }) => {
      setQuizResult({ answers: {}, result });
      markDone("career-quiz");
      clearQuizProgress();
      rerender();
      try {
        await fetch("/api/respond", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sid,
            activityId: "career-quiz",
            primary: result.top[0],
            top: result.top,
          }),
        });
      } catch {
        /* noop */
      }
    },
    [sid, rerender]
  );

  if (!sid) {
    return (
      <JoinShell>
        <div className="flex min-h-[60vh] items-center justify-center text-ink/40">
          กำลังโหลด…
        </div>
      </JoinShell>
    );
  }

  // อ้างอิงค่าใน localStorage (อ่านสดหลัง mount) — tick บังคับ re-read
  void tick;
  const done = getDone();
  const storedResult = getQuizResult();
  const quizInProgress = !!getQuizProgress() && !done.includes("career-quiz");

  // overlay: ดูผลสายของตัวเองอีกครั้งจากหน้า standby
  if (viewResult && storedResult) {
    return (
      <JoinShell>
        <ResultCard result={storedResult.result} onBack={() => setViewResult(false)} />
      </JoinShell>
    );
  }

  // ถ้าเริ่มทำควิซแล้ว ให้ทำต่อจนจบ แม้พี่จะปิดกิจกรรม (ไม่เตะออกกลางคัน)
  if (quizInProgress) {
    return (
      <JoinShell>
        <Quiz onComplete={completeQuiz} />
      </JoinShell>
    );
  }

  const activity = getActivity(activeActivity);

  let content: React.ReactNode;
  if (!activity) {
    content = (
      <Standby
        primaryKey={storedResult?.result.top[0] ?? null}
        onViewResult={() => setViewResult(true)}
        reconnecting={reconnecting}
      />
    );
  } else if (isPoll(activity)) {
    content = (
      <PollCard
        activity={activity}
        selected={getPollSelection(activity.id)}
        onSelect={(optionId) => submitPoll(activity, optionId)}
      />
    );
  } else if (isText(activity)) {
    content = (
      <TextCard
        activity={activity}
        submitted={getTextSubmission(activity.id)}
        onSubmit={(text) => submitText(activity, text)}
      />
    );
  } else {
    // quiz
    if (done.includes("career-quiz") && storedResult) {
      content = <ResultCard result={storedResult.result} />;
    } else {
      content = <Quiz onComplete={completeQuiz} />;
    }
  }

  return <JoinShell reconnecting={reconnecting}>{content}</JoinShell>;
}
