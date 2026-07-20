// เก็บความคืบหน้าฝั่ง client (localStorage) — ไม่มี PII
"use client";

import type { QuizAnswers, QuizResult } from "./quiz";

const DONE = "bbc_done";
const QUIZ_RESULT = "bbc_quiz_result";
const QUIZ_PROGRESS = "bbc_quiz_progress";
const POLL = (id: string) => `bbc_poll_${id}`;
const TEXT = (id: string) => `bbc_text_${id}`;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, val: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* เต็ม/ปิด storage ก็ข้ามไป */
  }
}

function remove(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* noop */
  }
}

export function getDone(): string[] {
  return read<string[]>(DONE, []);
}
export function markDone(id: string) {
  const set = new Set(getDone());
  set.add(id);
  write(DONE, [...set]);
}
export function isDone(id: string) {
  return getDone().includes(id);
}

export function getPollSelection(id: string): string | null {
  return read<string | null>(POLL(id), null);
}
export function setPollSelection(id: string, optionId: string) {
  write(POLL(id), optionId);
}

export function getTextSubmission(id: string): string | null {
  return read<string | null>(TEXT(id), null);
}
export function setTextSubmission(id: string, text: string) {
  write(TEXT(id), text);
}

export type StoredQuizResult = { answers: QuizAnswers; result: QuizResult };
export function getQuizResult(): StoredQuizResult | null {
  return read<StoredQuizResult | null>(QUIZ_RESULT, null);
}
export function setQuizResult(r: StoredQuizResult) {
  write(QUIZ_RESULT, r);
}

export type QuizProgress = { index: number; answers: QuizAnswers };
export function getQuizProgress(): QuizProgress | null {
  return read<QuizProgress | null>(QUIZ_PROGRESS, null);
}
export function setQuizProgress(p: QuizProgress) {
  write(QUIZ_PROGRESS, p);
}
export function clearQuizProgress() {
  remove(QUIZ_PROGRESS);
}
