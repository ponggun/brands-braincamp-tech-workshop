"use client";

import { useState } from "react";
import { getActivity } from "@/lib/activities";

async function postJSON(url: string, body: unknown): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function ActivityControl({
  activityId,
  activeActivity,
  presenterKey,
  onChanged,
}: {
  activityId: string;
  activeActivity: string | null;
  presenterKey: string;
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const activity = getActivity(activityId);
  if (!activity) return null;

  const isOpen = activeActivity === activityId;

  async function act(body: unknown) {
    setBusy(true);
    setError(false);
    const ok = await postJSON("/api/activity", body);
    setBusy(false);
    if (!ok) setError(true);
    else onChanged();
  }

  async function reset() {
    if (!window.confirm("ล้างผลของกิจกรรมนี้?")) return;
    setBusy(true);
    await postJSON("/api/reset", { activityId, key: presenterKey });
    setBusy(false);
    onChanged();
  }

  return (
    <div className="rounded-3xl bg-ink p-5 text-white shadow-lg">
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`h-3 w-3 rounded-full ${isOpen ? "animate-pulse bg-green-400" : "bg-white/30"}`}
        />
        <span className="text-sm font-medium text-white/70">
          {isOpen ? "กำลังเปิดให้น้องทำ" : "ยังไม่เปิด"}
        </span>
      </div>

      {isOpen ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => act({ activity: null, key: presenterKey })}
          className="tap-target w-full rounded-2xl bg-white px-5 py-4 font-display text-xl font-bold text-ink transition hover:bg-white/90 disabled:opacity-50"
        >
          ⏸ ปิด · ดูผล
        </button>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => act({ activity: activityId, key: presenterKey })}
          className="tap-target w-full rounded-2xl bg-brand px-5 py-4 font-display text-xl font-bold text-white transition hover:bg-brand-dark disabled:opacity-50"
        >
          ▶ เปิดให้น้องทำ
        </button>
      )}

      <button
        type="button"
        onClick={reset}
        disabled={busy}
        className="mt-3 w-full rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 disabled:opacity-50"
      >
        ล้างผลกิจกรรมนี้
      </button>

      {error && (
        <p className="mt-3 rounded-lg bg-red-500/20 px-3 py-2 text-center text-sm text-red-100">
          สั่งงานไม่สำเร็จ — เช็กรหัส presenter หรือการเชื่อมต่อ
        </p>
      )}
    </div>
  );
}
