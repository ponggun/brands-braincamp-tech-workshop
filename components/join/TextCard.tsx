"use client";

import { useState } from "react";
import type { TextActivity } from "@/lib/activities";

const MAX = 280;

export function TextCard({
  activity,
  submitted,
  onSubmit,
}: {
  activity: TextActivity;
  submitted: string | null;
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState(submitted ?? "");
  const trimmed = text.trim();
  // ส่งได้เสมอถ้ามีข้อความ — เผลอกดซ้ำ/แก้แล้วส่งใหม่ หรือส่งอีกครั้งเมื่อจอรีเซ็ตได้
  const canSend = trimmed.length > 0;
  const hasEdit = trimmed !== (submitted ?? "");

  let buttonLabel: string;
  if (!submitted) {
    buttonLabel = "ส่งคำตอบ 🚀";
  } else if (hasEdit) {
    buttonLabel = "ส่งการแก้ไข ✍️";
  } else {
    buttonLabel = "ส่งอีกครั้ง 🔄";
  }

  return (
    <div className="animate-pop-in">
      <h1 className="font-display text-2xl font-bold text-ink text-balance">
        {activity.title}
      </h1>
      {activity.subtitle && (
        <p className="mt-1 text-ink/60">{activity.subtitle}</p>
      )}

      <div className="mt-4 flex items-start gap-3 rounded-2xl border-2 border-accent/40 bg-accent/10 px-4 py-3">
        <span className="text-2xl leading-none">📺</span>
        <p className="text-sm font-medium text-ink/80">
          <span className="font-bold text-accent-dark">ข้อความจะขึ้นโชว์บนจอใหญ่หน้าห้อง</span>{" "}
          ให้ทุกคนเห็นแบบสด ๆ นะ — พิมพ์แบบสุภาพ ไม่ต้องใส่ชื่อจริงหรือข้อมูลส่วนตัวก็ได้ 😊
        </p>
      </div>

      <div className="mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX))}
          placeholder={activity.placeholder ?? "พิมพ์คำตอบตรงนี้…"}
          rows={4}
          className="w-full resize-none rounded-2xl border-2 border-black/10 bg-white px-4 py-3 text-ink outline-none transition focus:border-brand"
        />
        <div className="mt-1 text-right text-xs text-ink/40">
          {trimmed.length}/{MAX}
        </div>
      </div>

      <button
        type="button"
        disabled={!canSend}
        onClick={() => onSubmit(trimmed)}
        className="tap-target mt-3 w-full rounded-2xl bg-brand px-4 py-4 text-center font-display text-lg font-bold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-ink/20"
      >
        {buttonLabel}
      </button>

      {submitted && !hasEdit && (
        <p className="mt-5 rounded-xl bg-brand-light px-4 py-3 text-center text-sm font-medium text-brand-dark">
          ✅ ส่งแล้ว! อยากแก้ก็พิมพ์เพิ่มแล้วกดส่งได้เลย
        </p>
      )}

      {submitted && hasEdit && (
        <p className="mt-5 rounded-xl bg-accent/10 px-4 py-3 text-center text-sm font-medium text-accent-dark">
          ✏️ มีการแก้ไขที่ยังไม่ได้ส่ง — กด “ส่งการแก้ไข” เพื่ออัปเดต
        </p>
      )}
    </div>
  );
}
