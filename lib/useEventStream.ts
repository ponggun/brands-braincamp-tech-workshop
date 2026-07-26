"use client";

import { useEffect, useState } from "react";

// เปิดไม่ติดภายในเท่านี้ = ถือว่า SSE ใช้ไม่ได้ (เน็ตมือถือบางเจ้า/proxy บล็อก stream)
const OPEN_TIMEOUT_MS = 8_000;
// error ติดกันเท่านี้ครั้งค่อยยอมถอยไป polling (EventSource reconnect เองอยู่แล้ว)
const MAX_ERRORS = 3;
// ถอยไป polling แล้ว ลองกลับมา SSE ใหม่ทุก 60 วิ
const RETRY_SSE_MS = 60_000;

/**
 * รับสถานะสดผ่าน SSE เป็นหลัก ถ้าใช้ไม่ได้ค่อยถอยไป short polling อัตโนมัติ
 * ส่ง url = null เพื่อยังไม่ต้องเชื่อมต่อ (เช่นรอ sid)
 */
export function useEventStream<T>(
  url: string | null,
  fallbackUrl: string | null = null,
  fallbackMs = 8_000
): { data: T | null; connected: boolean } {
  // เริ่มที่ connected: true เพื่อไม่ให้ป้าย "กำลังเชื่อมต่อใหม่" แวบขึ้นตอนโหลดหน้า
  const [state, setState] = useState<{ data: T | null; connected: boolean }>({
    data: null,
    connected: true,
  });

  useEffect(() => {
    if (!url) return;

    let alive = true;
    let es: EventSource | null = null;
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let openTimer: ReturnType<typeof setTimeout> | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let errors = 0;

    function apply(data: T) {
      if (alive) setState({ data, connected: true });
    }

    function markDown() {
      if (alive) setState((s) => ({ ...s, connected: false }));
    }

    async function pollOnce() {
      if (!fallbackUrl) return;
      try {
        const res = await fetch(fallbackUrl, { cache: "no-store" });
        if (!res.ok) throw new Error("bad status");
        apply((await res.json()) as T);
      } catch {
        markDown();
      }
    }

    function stopPolling() {
      if (pollTimer) clearInterval(pollTimer);
      pollTimer = null;
    }

    function startPolling() {
      if (!fallbackUrl || pollTimer) return;
      pollOnce();
      pollTimer = setInterval(() => {
        // จอน้องดับ/สลับแท็บ = ไม่ต้องยิง
        if (document.visibilityState === "hidden") return;
        pollOnce();
      }, fallbackMs);
      retryTimer = setTimeout(() => {
        stopPolling();
        startSSE();
      }, RETRY_SSE_MS);
    }

    function degrade() {
      if (openTimer) clearTimeout(openTimer);
      openTimer = null;
      if (es) es.close();
      es = null;
      startPolling();
    }

    function startSSE() {
      if (!alive) return;
      if (typeof window === "undefined" || !("EventSource" in window)) {
        startPolling();
        return;
      }
      errors = 0;
      es = new EventSource(url as string);
      openTimer = setTimeout(() => {
        if (alive && es?.readyState !== EventSource.OPEN) degrade();
      }, OPEN_TIMEOUT_MS);
      es.onopen = () => {
        errors = 0;
        if (openTimer) clearTimeout(openTimer);
        openTimer = null;
      };
      es.onmessage = (e) => {
        try {
          apply(JSON.parse(e.data) as T);
        } catch {
          /* ข้อความเพี้ยน — ข้ามไป */
        }
      };
      es.onerror = () => {
        markDown();
        errors += 1;
        if (errors >= MAX_ERRORS) degrade();
      };
    }

    startSSE();

    return () => {
      alive = false;
      if (es) es.close();
      stopPolling();
      if (openTimer) clearTimeout(openTimer);
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [url, fallbackUrl, fallbackMs]);

  return state;
}
