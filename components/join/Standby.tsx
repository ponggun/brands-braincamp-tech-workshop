"use client";

import { CLUSTERS } from "@/lib/clusters";
import type { ClusterKey } from "@/lib/clusters";

export function Standby({
  primaryKey,
  onViewResult,
  reconnecting,
}: {
  primaryKey?: ClusterKey | null;
  onViewResult?: () => void;
  reconnecting?: boolean;
}) {
  const cluster = primaryKey ? CLUSTERS[primaryKey] : null;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-pop-in">
      <div className="animate-float text-6xl">👀</div>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">
        มองจอใหญ่ไว้นะ
      </h1>
      <p className="mt-1 text-ink/60">เดี๋ยวพี่เปิดกิจกรรมให้ทำต่อ 🙌</p>

      {cluster && (
        <button
          type="button"
          onClick={onViewResult}
          className="mt-6 flex items-center gap-3 rounded-2xl border-2 border-black/10 bg-white px-5 py-3 text-left shadow-sm transition hover:border-brand/40"
        >
          <span className="text-2xl">{cluster.emoji}</span>
          <span>
            <span className="block text-xs text-ink/50">สายของคุณ</span>
            <span className="font-display font-bold text-ink">{cluster.name}</span>
          </span>
          <span className="ml-1 text-ink/40">›</span>
        </button>
      )}

      {reconnecting && (
        <p className="mt-6 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
          กำลังเชื่อมต่อใหม่…
        </p>
      )}
    </div>
  );
}
