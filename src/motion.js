import { projects } from "./data";

// Native scroll distances, measured in viewport units. Entry is followed by
// a separate reading/inspection interval before the next project can arrive.
export const SCROLL_UNIT = 0.88;
export const PROJECT_ENTRY = 0.9;
export const PROJECT_SPAN = 2.25;
export const INSPECT_START = 1.04;
export const INSPECT_END = 1.96;
export const STORY_ENTRY = 0.95;
export const projectStart = (i) => 0.35 + i * PROJECT_SPAN;
export const projectRest = (i) => projectStart(i) + 1.3;
export const chapterLengths = { about: 4.4, lab: 4.4, contact: 3.3 };
const aboutStart = projectStart(projects.length - 1) + PROJECT_SPAN + 0.25;
export const chapters = {
  work: 0,
  about: aboutStart,
  lab: aboutStart + chapterLengths.about,
  contact: aboutStart + chapterLengths.about + chapterLengths.lab,
};
export const END = chapters.contact + chapterLengths.contact;
export const chapterRest = (name) =>
  chapters[name] + (name === "contact" ? 2.05 : name === "lab" ? 1.65 : 1.35);
export const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
export const ease = (n) => {
  const p = clamp(n);
  return p * p * (3 - 2 * p);
};
export const inspectAt = (local, i) =>
  clamp(
    (local - projectStart(i) - INSPECT_START) / (INSPECT_END - INSPECT_START),
  );
export const chapterRead = (local, name) =>
  clamp(
    (local - chapters[name] - STORY_ENTRY) /
      (chapterLengths[name] - STORY_ENTRY - 0.35),
  );

export const motionProfiles = [
  {
    kind: "connect",
    side: "right",
    title: "쉽게 발견하고, 명확하게 선택하기",
    tag: "DISCOVERY FLOW",
    panX: 28,
    panY: 8,
    zoom: 0.018,
    labels: ["탐색", "비교", "선택"],
    crops: ["18% 30%", "35% 82%", "78% 45%"],
  },
  {
    kind: "fino",
    side: "left",
    title: "중요한 정보부터, 한눈에",
    tag: "FINANCIAL CLARITY",
    panX: -8,
    panY: 22,
    zoom: 0.035,
    labels: ["자산", "목표", "관리"],
    crops: ["58% 30%", "84% 52%", "55% 77%"],
  },
  {
    kind: "ondo",
    side: "right",
    title: "화면 너머로 이어지는 취향",
    tag: "10-FOOT EXPERIENCE",
    panX: 34,
    panY: 0,
    zoom: 0.025,
    labels: ["몰입", "발견", "이동"],
    crops: ["72% 35%", "40% 78%", "20% 50%"],
  },
  {
    kind: "orbit",
    side: "left",
    title: "복잡한 업무를, 선명한 흐름으로",
    tag: "INFORMATION HIERARCHY",
    panX: -24,
    panY: 14,
    zoom: 0.02,
    labels: ["역할", "작업", "상태"],
    crops: ["68% 28%", "68% 58%", "26% 55%"],
  },
  {
    kind: "form",
    side: "right",
    title: "질감과 여백으로 전하는 브랜드",
    tag: "VISUAL LANGUAGE",
    panX: 12,
    panY: -12,
    zoom: 0.045,
    labels: ["인상", "탐색", "구매"],
    crops: ["72% 40%", "55% 68%", "25% 75%"],
  },
  {
    kind: "wayve",
    side: "left",
    title: "목적지보다 먼저, 이동의 맥락",
    tag: "CONNECTED JOURNEY",
    panX: -16,
    panY: 18,
    zoom: 0.025,
    labels: ["출발", "경로", "도착"],
    crops: ["53% 36%", "52% 61%", "21% 48%"],
  },
];
