// ควิซจับกลุ่มสายเทค — 6 คำถาม แต่ละตัวเลือกให้น้ำหนักกับ 1 กลุ่มหลัก (บางข้อมีกลุ่มรอง)
import { CLUSTERS, CLUSTER_ORDER, type ClusterKey } from "./clusters";

export type QuizOption = {
  id: string;
  label: string;
  emoji: string;
  // น้ำหนักคะแนนที่ให้แต่ละกลุ่ม (หลัก 2, รอง 1)
  weights: Partial<Record<ClusterKey, number>>;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "เวลาว่าง ๆ สิ่งไหนที่ทำแล้วเพลินที่สุด?",
    options: [
      { id: "q1a", emoji: "🔧", label: "ประกอบ/สร้างอะไรสักอย่างให้ใช้งานได้จริง", weights: { build: 2 } },
      { id: "q1b", emoji: "🧩", label: "แกะปริศนา เล่นกับตัวเลขและสถิติ", weights: { data: 2 } },
      { id: "q1c", emoji: "🎨", label: "วาด แต่งรูป หรือจัดของให้สวย", weights: { design: 2 } },
      { id: "q1d", emoji: "💬", label: "ชวนเพื่อนคุย ฟังปัญหา แล้วช่วยหาทางออก", weights: { connect: 2 } },
    ],
  },
  {
    id: "q2",
    prompt: "ถ้าทำโปรเจกต์กลุ่ม คุณมักเป็นคนที่...?",
    options: [
      { id: "q2a", emoji: "⚙️", label: "ลงมือทำชิ้นงานจริงให้เสร็จ", weights: { build: 2 } },
      { id: "q2b", emoji: "📋", label: "วางแผน คุมงานให้เป๊ะ ไม่มีพลาด", weights: { ops: 2, connect: 1 } },
      { id: "q2c", emoji: "🖌️", label: "ออกแบบหน้าตา/สไลด์ให้ดูดี", weights: { design: 2 } },
      { id: "q2d", emoji: "🤝", label: "ประสานงาน คุยกับทุกฝ่ายให้ไปด้วยกัน", weights: { connect: 2 } },
    ],
  },
  {
    id: "q3",
    prompt: "ปัญหาแบบไหนที่คุณอยากลงมือแก้?",
    options: [
      { id: "q3a", emoji: "😵", label: "แอป/เว็บที่ใช้ยาก ทำให้มันใช้ง่ายขึ้น", weights: { design: 2 } },
      { id: "q3b", emoji: "🔁", label: "งานซ้ำ ๆ น่าเบื่อ ทำให้มันอัตโนมัติ", weights: { build: 2, ops: 1 } },
      { id: "q3c", emoji: "📈", label: "อยากรู้ว่าทำไมคนถึงเลือกแบบนั้น จากข้อมูล", weights: { data: 2 } },
      { id: "q3d", emoji: "🛡️", label: "ระบบล่มบ่อย ทำให้มันเสถียรและปลอดภัย", weights: { ops: 2 } },
    ],
  },
  {
    id: "q4",
    prompt: "คำชมแบบไหนที่ฟังแล้วยิ้มไม่หุบ?",
    options: [
      { id: "q4a", emoji: "🚀", label: "“ของที่ทำ ใช้งานได้เจ๋งมาก”", weights: { build: 2 } },
      { id: "q4b", emoji: "🎯", label: "“วิเคราะห์ได้แม่นมาก”", weights: { data: 2 } },
      { id: "q4c", emoji: "✨", label: "“สวยและใช้ง่ายสุด ๆ”", weights: { design: 2 } },
      { id: "q4d", emoji: "🌟", label: "“คุยด้วยแล้วเข้าใจง่าย งานไหลลื่น”", weights: { connect: 2 } },
    ],
  },
  {
    id: "q5",
    prompt: "วิชา/กิจกรรมไหนที่คุณสนุกด้วยที่สุด?",
    options: [
      { id: "q5a", emoji: "🔢", label: "คณิต สถิติ หรือหาแพตเทิร์น", weights: { data: 2 } },
      { id: "q5b", emoji: "🖥️", label: "เขียนโปรแกรม หุ่นยนต์ ต่อวงจร", weights: { build: 2 } },
      { id: "q5c", emoji: "🎭", label: "ศิลปะ ออกแบบ หรือทำสื่อ", weights: { design: 2 } },
      { id: "q5d", emoji: "🌐", label: "ดูแลระบบ เครือข่าย หรือเซิร์ฟเวอร์เกม", weights: { ops: 2 } },
    ],
  },
  {
    id: "q6",
    prompt: "ในทีมในฝัน คุณอยากได้บทบาทไหน?",
    options: [
      { id: "q6a", emoji: "🏗️", label: "คนสร้างฟีเจอร์ใหม่ ๆ ให้ทีม", weights: { build: 2 } },
      { id: "q6b", emoji: "🔍", label: "คนขุดข้อมูลหา insight", weights: { data: 2 } },
      { id: "q6c", emoji: "🕹️", label: "คนดูแลให้ระบบรัน 24 ชม. ไม่ล่ม", weights: { ops: 2 } },
      { id: "q6d", emoji: "🧭", label: "คนเชื่อมทีมกับลูกค้า เข้าใจสิ่งที่ต้องการ", weights: { connect: 2 } },
    ],
  },
];

export type QuizAnswers = Record<string, string>; // questionId -> optionId

export type QuizResult = {
  scores: Record<ClusterKey, number>;
  ranking: ClusterKey[]; // เรียงมาก→น้อย
  top: ClusterKey[]; // 2–3 สายที่ใช่ (สายหลัก + สายรอง)
};

const optionById = (question: QuizQuestion, optionId: string) =>
  question.options.find((o) => o.id === optionId);

export function scoreQuiz(answers: QuizAnswers): QuizResult {
  const scores: Record<ClusterKey, number> = {
    build: 0,
    data: 0,
    design: 0,
    ops: 0,
    connect: 0,
  };

  for (const question of QUIZ_QUESTIONS) {
    const optionId = answers[question.id];
    if (!optionId) continue;
    const option = optionById(question, optionId);
    if (!option) continue;
    for (const key of CLUSTER_ORDER) {
      const w = option.weights[key];
      if (w) scores[key] += w;
    }
  }

  // เรียงลำดับ; ถ้าคะแนนเท่ากันใช้ลำดับกลุ่มคงที่เป็นตัวตัดสิน (deterministic)
  const ranking = [...CLUSTER_ORDER].sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    return CLUSTER_ORDER.indexOf(a) - CLUSTER_ORDER.indexOf(b);
  });

  // สายหลัก = อันดับ 1 เสมอ; สายรอง = อันดับ 2 และเพิ่มอันดับ 3 ถ้าคะแนนใกล้กัน
  const top: ClusterKey[] = [ranking[0], ranking[1]];
  const third = ranking[2];
  if (scores[third] > 0 && scores[ranking[1]] - scores[third] <= 1) {
    top.push(third);
  }

  return { scores, ranking, top };
}

export const QUIZ_LENGTH = QUIZ_QUESTIONS.length;

// ป้ายกำกับสายสำหรับแสดงผล (ใช้ร่วมกับ CLUSTERS)
export { CLUSTERS };
