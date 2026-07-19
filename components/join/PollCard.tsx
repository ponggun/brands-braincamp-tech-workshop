"use client";

import type { PollActivity } from "@/lib/activities";

export function PollCard({
  activity,
  selected,
  onSelect,
}: {
  activity: PollActivity;
  selected: string | null;
  onSelect: (optionId: string) => void;
}) {
  return (
    <div className="animate-pop-in">
      <h1 className="font-display text-2xl font-bold text-ink text-balance">
        {activity.title}
      </h1>
      {activity.subtitle && (
        <p className="mt-1 text-ink/60">{activity.subtitle}</p>
      )}

      <div className="mt-6 grid gap-3">
        {activity.options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`tap-target flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left transition active:scale-[0.99] ${
                isSelected
                  ? "border-brand bg-brand-light shadow-md"
                  : "border-black/10 bg-white hover:border-brand/40"
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="flex-1 font-medium text-ink">{opt.label}</span>
              {isSelected && (
                <span className="shrink-0 text-xl text-brand">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <p className="mt-5 rounded-xl bg-brand-light px-4 py-3 text-center text-sm font-medium text-brand-dark">
          ✅ ส่งคำตอบแล้ว! เปลี่ยนใจกดใหม่ได้เลย
        </p>
      )}
    </div>
  );
}
