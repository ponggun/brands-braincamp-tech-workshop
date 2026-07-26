import { NextRequest } from "next/server";
import { broadcast, subscribe } from "@/lib/hub";
import { touchSession } from "@/lib/store";
import { presenterSnapshot, studentSnapshot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// heartbeat กัน idle timeout ของ tunnel (Cloudflare ตัดที่ ~100 วิ) + ต่ออายุ presence
const HEARTBEAT_MS = 15_000;
// จอ presenter เช็คจำนวนคนออนไลน์ถี่หน่อย (ส่งจริงเฉพาะตอนตัวเลขเปลี่ยน)
const PRESENTER_TICK_MS = 3_000;

// SSE: 1 เครื่อง = 1 connection แทน short poll ทุก 2.5 วิ
// น้อง:    GET /api/events?sid=xxx            → { activeActivity }
// พี่:     GET /api/events?presenter=1&activityId=xxx → { joinCount, activeActivity, results }
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const isPresenter = params.get("presenter") === "1";
  const sid = params.get("sid") ?? "";
  const activityId = params.get("activityId");

  const encoder = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;
      let lastSent = "";

      function write(chunk: string) {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          cleanup();
        }
      }

      // ส่งเฉพาะตอนข้อมูลเปลี่ยนจริง — จอน้องจะเงียบสนิทจนกว่าพี่จะเปิดกิจกรรม
      function send(force = false) {
        const payload = JSON.stringify(
          isPresenter ? presenterSnapshot(activityId) : studentSnapshot()
        );
        if (!force && payload === lastSent) return;
        lastSent = payload;
        write(`data: ${payload}\n\n`);
      }

      const unsubscribe = subscribe({
        sid: isPresenter ? null : sid || null,
        notify: () => send(),
      });

      const heartbeat = setInterval(() => {
        if (sid) touchSession(sid);
        write(": ping\n\n");
      }, HEARTBEAT_MS);

      const presenterTick = isPresenter
        ? setInterval(() => send(), PRESENTER_TICK_MS)
        : null;

      cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(heartbeat);
        if (presenterTick) clearInterval(presenterTick);
        unsubscribe();
        try {
          controller.close();
        } catch {
          /* ปิดไปแล้ว */
        }
        // มีคนออก → จอพี่ควรเห็นจำนวนคนลดทันที
        broadcast();
      };

      req.signal.addEventListener("abort", cleanup);

      if (sid) touchSession(sid);
      send(true);
      // มีคนเข้า → บอกจอพี่
      broadcast();
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-store, no-transform",
      Connection: "keep-alive",
      // กัน proxy บัฟเฟอร์ stream
      "X-Accel-Buffering": "no",
    },
  });
}
