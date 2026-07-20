"use client";

import { useEffect, useState } from "react";
import { getActivity, isPoll } from "@/lib/activities";
import { CLUSTERS, CLUSTER_ORDER, type ClusterKey } from "@/lib/clusters";
import { avatarFor } from "@/lib/avatar";
import { ResultBar } from "@/components/ui/ResultBar";

const PALETTE = ["#F26A21", "#00A651", "#0EA5E9", "#7C3AED", "#EC4899", "#F59E0B"];

type ResultsResponse = {
  joinCount: number;
  activeActivity: string | null;
  activityId?: string;
  results?:
    | { kind: "poll"; total: number; counts: Record<string, number> }
    | { kind: "quiz"; total: number; primaryCounts: Record<string, number> }
    | { kind: "text"; total: number; entries: string[] };
};

const isCluster = (v: string): v is ClusterKey =>
  (CLUSTER_ORDER as string[]).includes(v);

export function ResultsPanel({ activityId }: { activityId: string }) {
  const [data, setData] = useState<ResultsResponse | null>(null);
  const activity = getActivity(activityId);

  useEffect(() => {
    let alive = true;
    async function poll() {
      try {
        const res = await fetch(
          `/api/results?activityId=${encodeURIComponent(activityId)}`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const json = (await res.json()) as ResultsResponse;
        if (alive) setData(json);
      } catch {
        /* ปล่อยผ่าน */
      }
    }
    poll();
    const id = setInterval(poll, 2500);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [activityId]);

  if (!activity) return null;
  const results = data?.results;
  const total = results?.total ?? 0;

  return (
    <div className="rounded-3xl bg-white/90 p-5 shadow-lg ring-1 ring-black/5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-display text-lg font-bold text-ink">📊 ผลสด</h3>
        <span className="text-sm font-medium text-ink/50">ตอบแล้ว {total} คน</span>
      </div>

      <div className="grid gap-3">
        {isPoll(activity) && results?.kind === "poll"
          ? activity.options.map((opt, i) => (
              <ResultBar
                key={opt.id}
                emoji={opt.emoji}
                label={opt.label}
                count={results.counts[opt.id] ?? 0}
                total={total}
                color={isCluster(opt.id) ? CLUSTERS[opt.id].color : PALETTE[i % PALETTE.length]}
              />
            ))
          : null}

        {activity.kind === "text" && results?.kind === "text"
          ? results.entries.map((text, i) => {
              const av = avatarFor(text);
              return (
                <div
                  key={`${i}-${text}`}
                  className="animate-pop-in flex items-center gap-3 rounded-2xl border-2 border-black/10 bg-white px-3 py-3"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl shadow-md ring-2 ring-white"
                    style={{ background: av.gradient }}
                  >
                    {av.face}
                  </span>
                  <p className="text-ink/80">
                    <span className="mr-1 text-brand">“</span>
                    {text}
                    <span className="ml-1 text-brand">”</span>
                  </p>
                </div>
              );
            })
          : null}

        {activity.kind === "quiz" && results?.kind === "quiz"
          ? CLUSTER_ORDER.map((key) => (
              <ResultBar
                key={key}
                emoji={CLUSTERS[key].emoji}
                label={CLUSTERS[key].name}
                count={results.primaryCounts[key] ?? 0}
                total={total}
                color={CLUSTERS[key].color}
              />
            ))
          : null}
      </div>

      {total === 0 && (
        <p className="mt-2 text-center text-sm text-ink/40">
          รอคำตอบจากน้อง…
        </p>
      )}
    </div>
  );
}
