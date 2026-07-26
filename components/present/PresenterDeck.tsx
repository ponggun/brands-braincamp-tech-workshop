"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES, SLIDE_COUNT } from "@/lib/deck";
import { getActivity } from "@/lib/activities";
import { useEventStream } from "@/lib/useEventStream";
import type { PresenterSnapshot } from "@/lib/snapshot";
import { SlideView } from "./SlideView";

const SLIDE_KEY = "bbc_present_slide";
const PKEY_KEY = "bbc_present_key";
const FALLBACK_POLL_MS = 8000;

export function PresenterDeck() {
  const [current, setCurrent] = useState(0);
  const [presenterKey, setPresenterKey] = useState("");

  // โหลดค่าที่จำไว้
  useEffect(() => {
    const s = Number(window.localStorage.getItem(SLIDE_KEY) ?? "0");
    if (!Number.isNaN(s)) setCurrent(Math.min(Math.max(0, s), SLIDE_COUNT - 1));
    setPresenterKey(window.localStorage.getItem(PKEY_KEY) ?? "");
  }, []);

  const go = useCallback((next: number) => {
    setCurrent((c) => {
      const target = Math.min(Math.max(0, next), SLIDE_COUNT - 1);
      window.localStorage.setItem(SLIDE_KEY, String(target));
      return target;
    });
  }, []);

  // สถานะสด (จำนวนคน + กิจกรรมที่เปิดอยู่ + ผลของสไลด์นี้) — push ผ่าน SSE
  const slide = SLIDES[current];
  const currentActivityId = slide.activityId ?? null;
  const q = currentActivityId
    ? `&activityId=${encodeURIComponent(currentActivityId)}`
    : "";
  const { data } = useEventStream<PresenterSnapshot>(
    `/api/events?presenter=1${q}`,
    `/api/results?${q.slice(1)}`,
    FALLBACK_POLL_MS
  );
  const joinCount = data?.joinCount ?? 0;
  const activeActivity = data?.activeActivity ?? null;

  // คีย์บอร์ดเลื่อนสไลด์ (ไม่ทำงานถ้ากำลังพิมพ์ในช่อง input)
  const currentRef = useRef(current);
  currentRef.current = current;
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        go(currentRef.current + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(currentRef.current - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  async function closeActive() {
    try {
      await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity: null, key: presenterKey }),
      });
    } catch {
      /* noop */
    }
    // ไม่ต้อง refetch — server broadcast กลับมาทาง SSE เอง
  }

  const strayActivity =
    activeActivity && activeActivity !== currentActivityId
      ? getActivity(activeActivity)
      : null;

  return (
    <div className="flex h-screen flex-col bg-[#fbfbfd]">
      {/* พื้นที่สไลด์ (ฉายโปรเจกเตอร์) */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto flex min-h-full max-w-6xl items-center px-8 py-10">
          <div className="w-full">
            <SlideView
              slide={slide}
              activeActivity={activeActivity}
              presenterKey={presenterKey}
              live={data}
            />
          </div>
        </div>
      </div>

      {/* แถบควบคุมของ presenter (ล่าง) */}
      <div className="border-t border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-3">
          <button
            type="button"
            onClick={() => go(current - 1)}
            disabled={current === 0}
            className="rounded-xl bg-black/5 px-4 py-2 font-semibold text-ink disabled:opacity-40"
          >
            ← ก่อนหน้า
          </button>
          <button
            type="button"
            onClick={() => go(current + 1)}
            disabled={current === SLIDE_COUNT - 1}
            className="rounded-xl bg-ink px-4 py-2 font-semibold text-white disabled:opacity-40"
          >
            ถัดไป →
          </button>

          <div className="min-w-0">
            <span className="font-display font-bold text-ink">
              {current + 1}/{SLIDE_COUNT}
            </span>
            <span className="ml-2 truncate text-sm text-ink/50">
              {slide.label}
              {slide.timeLabel ? ` · ${slide.timeLabel}` : ""}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="rounded-full bg-brand-light px-3 py-1.5 text-sm font-semibold text-brand-dark">
              👥 {joinCount} คน
            </span>

            {strayActivity && (
              <button
                type="button"
                onClick={closeActive}
                className="rounded-full bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700 ring-1 ring-green-300"
              >
                🟢 ยังเปิด: {strayActivity.id} — กดเพื่อปิด
              </button>
            )}

            {/* type=password เพราะแถบนี้ขึ้นโปรเจกเตอร์/แชร์จอ — ห้ามให้รหัสโผล่ */}
            <input
              type="password"
              autoComplete="off"
              value={presenterKey}
              onChange={(e) => {
                setPresenterKey(e.target.value);
                window.localStorage.setItem(PKEY_KEY, e.target.value);
              }}
              placeholder="รหัส presenter (ถ้ามี)"
              className="w-40 rounded-lg border border-black/10 px-3 py-1.5 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
