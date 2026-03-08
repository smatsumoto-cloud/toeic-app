// ===============================
// 型定義
// ===============================

export type WordStatus = "new" | "learning" | "known";

export interface QuizResult {
  id: string;
  date: string; // YYYY-MM-DD
  part: "part5" | "part6" | "part7";
  correct: number;
  total: number;
  timeSeconds: number;
  categoryBreakdown: Record<string, { correct: number; total: number }>;
}

export interface StudyLogEntry {
  wordsStudied: number;
  minutesStudied: number;
  quizzesTaken: number;
}

export interface PlanGoal {
  targetScore: number;
  examDate: string; // YYYY-MM-DD
  dailyMinutes: number;
}

// ===============================
// ストレージキー
// ===============================

const KEYS = {
  QUIZ_RESULTS: "toeic:quizResults",
  WORD_STATUS: "toeic:wordStatus",
  STUDY_LOG: "toeic:studyLog",
  PLAN_GOAL: "toeic:planGoal",
  PART5_SESSION: "toeic:part5Session",
} as const;

function isBrowser() {
  return typeof window !== "undefined";
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// ===============================
// Quiz Results
// ===============================

export function getQuizResults(): QuizResult[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.QUIZ_RESULTS) ?? "[]");
  } catch {
    return [];
  }
}

export function saveQuizResult(result: Omit<QuizResult, "id" | "date">): void {
  if (!isBrowser()) return;
  const results = getQuizResults();
  const newResult: QuizResult = {
    ...result,
    id: `${Date.now()}`,
    date: today(),
  };
  results.unshift(newResult);
  // 最大50件
  localStorage.setItem(KEYS.QUIZ_RESULTS, JSON.stringify(results.slice(0, 50)));

  // 学習ログも更新
  addStudyLog({ quizzesTaken: 1, minutesStudied: Math.ceil(result.timeSeconds / 60) });
}

// ===============================
// Word Status
// ===============================

export function getWordStatuses(): Record<string, WordStatus> {
  if (!isBrowser()) return {};
  try {
    return JSON.parse(localStorage.getItem(KEYS.WORD_STATUS) ?? "{}");
  } catch {
    return {};
  }
}

export function saveWordStatuses(statuses: Record<string, WordStatus>): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.WORD_STATUS, JSON.stringify(statuses));
}

export function updateWordStatus(wordId: string, status: WordStatus): void {
  const statuses = getWordStatuses();
  statuses[wordId] = status;
  saveWordStatuses(statuses);
}

// ===============================
// Study Log
// ===============================

export function getStudyLog(): Record<string, StudyLogEntry> {
  if (!isBrowser()) return {};
  try {
    return JSON.parse(localStorage.getItem(KEYS.STUDY_LOG) ?? "{}");
  } catch {
    return {};
  }
}

export function addStudyLog(delta: Partial<StudyLogEntry>): void {
  if (!isBrowser()) return;
  const log = getStudyLog();
  const key = today();
  const existing = log[key] ?? { wordsStudied: 0, minutesStudied: 0, quizzesTaken: 0 };
  log[key] = {
    wordsStudied: existing.wordsStudied + (delta.wordsStudied ?? 0),
    minutesStudied: existing.minutesStudied + (delta.minutesStudied ?? 0),
    quizzesTaken: existing.quizzesTaken + (delta.quizzesTaken ?? 0),
  };
  localStorage.setItem(KEYS.STUDY_LOG, JSON.stringify(log));
}

// ===============================
// Plan Goal
// ===============================

const DEFAULT_GOAL: PlanGoal = {
  targetScore: 900,
  examDate: "2026-05-25",
  dailyMinutes: 60,
};

export function getPlanGoal(): PlanGoal {
  if (!isBrowser()) return DEFAULT_GOAL;
  try {
    const saved = localStorage.getItem(KEYS.PLAN_GOAL);
    return saved ? { ...DEFAULT_GOAL, ...JSON.parse(saved) } : DEFAULT_GOAL;
  } catch {
    return DEFAULT_GOAL;
  }
}

export function savePlanGoal(goal: PlanGoal): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.PLAN_GOAL, JSON.stringify(goal));
}

// ===============================
// 分析用ユーティリティ
// ===============================

/** 直近N回のPart5平均正答率（0–100）*/
export function getPart5Accuracy(n = 10): number | null {
  const results = getQuizResults().filter((r) => r.part === "part5").slice(0, n);
  if (results.length === 0) return null;
  const avg = results.reduce((sum, r) => sum + r.correct / r.total, 0) / results.length;
  return Math.round(avg * 100);
}

/** カテゴリ別累積正答率 */
export function getCategoryAccuracy(): Record<string, { correct: number; total: number }> {
  const results = getQuizResults().filter((r) => r.part === "part5");
  const acc: Record<string, { correct: number; total: number }> = {};
  for (const r of results) {
    for (const [cat, data] of Object.entries(r.categoryBreakdown)) {
      if (!acc[cat]) acc[cat] = { correct: 0, total: 0 };
      acc[cat].correct += data.correct;
      acc[cat].total += data.total;
    }
  }
  return acc;
}

/** 今週（月〜日）の学習ログ配列（月曜始まり） */
export function getWeeklyLog(): { day: string; minutes: number }[] {
  const log = getStudyLog();
  const days = ["月", "火", "水", "木", "金", "土", "日"];
  const now = new Date();
  const dow = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dow + 6) % 7));

  return days.map((day, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    return { day, minutes: log[key]?.minutesStudied ?? 0 };
  });
}

/** 推定TOEICスコア（リーディング） */
export function estimateScore(): number | null {
  const acc = getPart5Accuracy();
  if (acc === null) return null;
  // Part5正答率 → リーディングスコア概算 (200–495)
  const reading = Math.round(200 + (acc / 100) * 295);
  // リスニングはデフォルト350想定
  return reading + 350;
}

/** すべての学習データを削除 */
export function clearAllData(): void {
  if (!isBrowser()) return;
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}

// ===============================
// Part5 セッション進捗
// ===============================

export interface Part5SessionProgress {
  date: string; // YYYY-MM-DD
  questionIds: number[];
  results: boolean[];
  elapsedSeconds: number;
  phase: "quiz" | "answer" | "summary";
}

export function getPart5Session(): Part5SessionProgress | null {
  if (!isBrowser()) return null;
  try {
    const saved = localStorage.getItem(KEYS.PART5_SESSION);
    if (!saved) return null;
    const session: Part5SessionProgress = JSON.parse(saved);
    if (session.date !== today()) return null; // 別の日のデータは無視
    return session;
  } catch {
    return null;
  }
}

export function savePart5Session(session: Part5SessionProgress): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.PART5_SESSION, JSON.stringify(session));
}

export function clearPart5Session(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(KEYS.PART5_SESSION);
}
