"use client";

import { useState } from "react";
import { CLUSTERS } from "@/lib/clusters";
import type { QuizResult } from "@/lib/quiz";

export function ResultCard({
  result,
  onBack,
}: {
  result: QuizResult;
  onBack?: () => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const primaryKey = result.top[0];
  const secondaryKeys = result.top.slice(1);
  const primary = CLUSTERS[primaryKey];

  return (
    <div className="animate-pop-in pb-10">
      <p className="text-center text-sm font-semibold uppercase tracking-widest text-accent">
        สายที่ใช่ของคุณ 🎉
      </p>

      {/* สายหลัก */}
      <div
        className="mt-3 overflow-hidden rounded-3xl border-2 text-white shadow-lg"
        style={{ backgroundColor: primary.color, borderColor: primary.color }}
      >
        <div className="px-5 pb-5 pt-6">
          <div className="text-5xl">{primary.emoji}</div>
          <h1 className="mt-2 font-display text-3xl font-bold">{primary.name}</h1>
          <p className="mt-1 text-white/90">{primary.tagline}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {primary.careers.map((c) => (
              <span
                key={c}
                className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-t-3xl bg-white px-5 py-5 text-ink">
          <h2 className="font-display text-lg font-bold">🧭 เริ่มยังไงดี</h2>
          <ol className="mt-2 grid gap-2">
            {primary.roadmap.map((step, i) => (
              <li key={i} className="flex gap-2.5">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: primary.color }}
                >
                  {i + 1}
                </span>
                <span className="text-ink/80">{step}</span>
              </li>
            ))}
          </ol>

          <h2 className="mt-5 font-display text-lg font-bold">🔗 ลิงก์ฟรีเริ่มเลย</h2>
          <div className="mt-2 grid gap-2">
            {primary.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 font-medium text-ink transition hover:border-brand/50 hover:bg-brand-light/40"
              >
                <span>{l.label}</span>
                <span className="text-ink/40">↗</span>
              </a>
            ))}
          </div>

          {/* Advanced 🔥 */}
          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            className="mt-5 w-full rounded-xl border-2 border-dashed border-accent/50 px-4 py-3 text-center font-semibold text-accent transition hover:bg-accent-light"
          >
            {showAdvanced ? "ซ่อนโจทย์ Advanced" : "🔥 พร้อมไปต่อ? เปิดโจทย์ Advanced"}
          </button>
          {showAdvanced && (
            <div className="mt-3 grid gap-2 rounded-2xl bg-accent-light p-3">
              <p className="text-sm font-medium text-accent-dark">
                สำหรับคนที่อยากลงลึกกว่านี้ 💪
              </p>
              {primary.advanced.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-white px-4 py-3 font-medium text-ink"
                >
                  <span>{l.label}</span>
                  <span className="text-ink/40">↗</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* สายรอง */}
      {secondaryKeys.length > 0 && (
        <div className="mt-5">
          <h2 className="font-display text-lg font-bold text-ink">
            ✨ สายรองที่น่าลอง
          </h2>
          <div className="mt-2 grid gap-2">
            {secondaryKeys.map((key) => {
              const c = CLUSTERS[key];
              return (
                <div
                  key={key}
                  className="flex items-center gap-3 rounded-2xl border-2 border-black/10 bg-white px-4 py-3"
                >
                  <span className="text-2xl">{c.emoji}</span>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-ink">{c.name}</p>
                    <p className="truncate text-sm text-ink/60">{c.tagline}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-ink/50 text-balance">
        นี่เป็นแค่จุดเริ่มต้นนะ — ลองได้หลายสาย ไม่ต้องรีบเลือกก็ได้ 💡
      </p>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mt-5 w-full rounded-xl bg-black/[0.04] px-4 py-3 font-medium text-ink/70"
        >
          ← กลับหน้ารอกิจกรรม
        </button>
      )}
    </div>
  );
}
