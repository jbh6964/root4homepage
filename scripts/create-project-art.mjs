// Original concept UI artwork. Run from the repository root: node scripts/create-project-art.mjs
// Raster previews are generated separately in a browser so SVG text and embedded photography match.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
const out = "public/projects/";
const esc = (s) =>
  String(s)
    .replaceAll("↗", "›")
    .replaceAll("▶", "▷")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
const text = (x, y, s, size = 22, fill = "#22221f", weight = 400, extra = "") =>
  `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" fill="${fill}" font-weight="${weight}" ${extra}>${esc(s)}</text>`;
const serif = (x, y, s, size, fill = "#292821") =>
  text(
    x,
    y,
    s,
    size,
    fill,
    400,
    'style="font-family:Georgia,serif;letter-spacing:-3px"',
  );
const rect = (x, y, w, h, fill, rx = 0, stroke = "none", sw = 1) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const line = (x1, y1, x2, y2, c = "#ddd", w = 1) =>
  `<path d="M${x1} ${y1}H${x2}" fill="none" stroke="${c}" stroke-width="${w}" ${y1 !== y2 ? `transform="rotate(${(Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI} ${x1} ${y1})"` : ""}/>`;
const circle = (x, y, r, fill, stroke = "none", sw = 1) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const arrow = (x, y, c = "#222", size = 24) =>
  `<g transform="translate(${x} ${y})" fill="none" stroke="${c}" stroke-width="2.5"><path d="M0 ${size} ${size} 0M0 0h${size}v${size}"/></g>`;
const photo = (file, x, y, w, h, position = "xMidYMid") => {
  const p = out + "media/" + file;
  if (!existsSync(p)) throw new Error(`Missing concept photograph: ${p}`);
  return `<image x="${x}" y="${y}" width="${w}" height="${h}" href="data:image/webp;base64,${readFileSync(p).toString("base64")}" preserveAspectRatio="${position} slice"/>`;
};
const pill = (x, y, w, label, bg = "#f0f1eb", fg = "#41483c", size = 16) =>
  rect(x, y, w, 34, bg, 17) + text(x + 15, y + 23, label, size, fg, 500);
// Keep every full board inside the unchanged camera's overscan and pan envelope.
// Raw edge previews remain separate so there is no blank margin at the viewport edges.
const artBackgrounds = {
  connect: "#fffaf4",
  fino: "#4246dc",
  ondo: "#111a1c",
  orbit: "#f3f4f8",
  form: "#eee7da",
  wayve: "#e7ecdc",
};
const save = (id, body, defs = "") => {
  const document = (content) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100" role="img" aria-label="${id} original concept interface"><defs>${defs}</defs>${content}</svg>`;
  if (id === "orbit" || id === "wayve")
    writeFileSync(out + id + "-opening.svg", document(body));
  const scale = ["fino", "form", "wayve"].includes(id) ? 0.78 : 0.82;
  const x = (1600 - 1600 * scale) / 2,
    y = (1100 - 1100 * scale) / 2;
  const framed =
    rect(0, 0, 1600, 1100, artBackgrounds[id]) +
    `<g transform="translate(${x} ${y}) scale(${scale})">${body}</g>`;
  writeFileSync(out + id + ".svg", document(framed));
};

// FINO: one large, legible mobile banking interface and an editorial data expression.
{
  let s = rect(0, 0, 1600, 1100, "#4246dc");
  s +=
    text(84, 166, "fino.", 128, "#f7f8ff", 700, 'letter-spacing="-9"') +
    text(
      91,
      233,
      "A LITTLE MORE CLARITY.",
      18,
      "#d6d8ff",
      500,
      'letter-spacing="3"',
    ) +
    text(85, 384, "A clearer view", 68, "#f8f8ff", 400, 'letter-spacing="-3"') +
    text(85, 467, "of your money.", 68, "#f8f8ff", 400, 'letter-spacing="-3"');
  s +=
    text(
      91,
      602,
      "YOUR MONEY, IN FOCUS",
      16,
      "#c7caff",
      500,
      'letter-spacing="2"',
    ) +
    text(85, 697, "+12.8", 106, "#d6ff8c", 500, 'letter-spacing="-5"') +
    text(390, 690, "%", 50, "#d6ff8c", 500) +
    text(91, 741, "A little progress. Every month.", 23, "#e2e4ff");
  s +=
    `<path d="M90 970C175 970 170 915 245 930S340 835 405 861S515 760 645 785" fill="none" stroke="#d6ff8c" stroke-width="9" stroke-linecap="round"/>` +
    circle(645, 785, 12, "#d6ff8c") +
    line(90, 993, 680, 993, "#777beb") +
    text(91, 1034, "JAN", 15, "#e2e4ff") +
    text(354, 1034, "MAR", 15, "#e2e4ff") +
    text(628, 1034, "JUN", 15, "#e2e4ff");
  s +=
    rect(864, 54, 580, 1010, "#202137", 63) +
    rect(877, 67, 554, 984, "#fcfcff", 51) +
    rect(1054, 82, 197, 32, "#202137", 16) +
    text(915, 109, "9:41", 16, "#25253d", 600) +
    text(1324, 108, "▰", 20, "#25253d");
  s +=
    text(912, 167, "Good morning, Alex", 19, "#727487") +
    text(910, 209, "Your overview", 34, "#23243b", 600) +
    circle(1370, 177, 24, "#eff0ff") +
    text(1362, 185, "A", 20, "#4246dc", 600);
  s +=
    text(
      913,
      267,
      "TOTAL BALANCE",
      13,
      "#6c6e87",
      600,
      'letter-spacing="1.5"',
    ) +
    text(908, 329, "$24,860.80", 54, "#24243e", 500, 'letter-spacing="-2.5"') +
    pill(913, 349, 211, "↗  $1,482 this month", "#eef8dd", "#385333", 15);
  s +=
    rect(912, 409, 240, 74, "#4246dc", 18) +
    text(949, 454, "↗  Transfer", 23, "#fff", 500) +
    rect(1171, 409, 222, 74, "#eceeff", 18) +
    text(1214, 454, "+  Add money", 21, "#4246dc", 500);
  s +=
    text(912, 539, "Cash flow", 25, "#24243e", 600) +
    text(1305, 539, "June  ˅", 17, "#727487") +
    text(915, 580, "INCOME", 12, "#727487", 600, 'letter-spacing="1"') +
    text(912, 614, "$4,820", 28, "#24243e", 500) +
    text(1166, 580, "SPENDING", 12, "#727487", 600, 'letter-spacing="1"') +
    text(1163, 614, "$2,640", 28, "#24243e", 500);
  [60, 85, 73, 110, 94, 130, 119].forEach((h, i) => {
    s +=
      rect(923 + i * 66, 788 - h, 21, h, "#4246dc", 5) +
      rect(948 + i * 66, 788 - h * 0.62, 16, h * 0.62, "#d7dbfa", 5);
  });
  s +=
    line(912, 789, 1393, 789, "#e1e3f2") +
    text(914, 816, "01 JUN", 12, "#7b7d90") +
    text(1326, 816, "30 JUN", 12, "#7b7d90");
  s +=
    text(912, 863, "Recent activity", 23, "#24243e", 600) +
    text(1342, 862, "All  ↗", 15, "#6c6e87");
  [
    ["N", "North Studio", "Salary · Today", "+$4,820.00", "#e6efd8"],
    ["S", "Sunday market", "Card · Yesterday", "−$42.80", "#fcebdd"],
  ].forEach(([initial, title, sub, value, bg], i) => {
    let y = 888 + i * 66;
    s +=
      rect(912, y, 42, 42, bg, 12) +
      text(925, y + 28, initial, 21, "#4246dc", 600) +
      text(970, y + 17, title, 17, "#24243e", 600) +
      text(970, y + 39, sub, 13, "#7b7d90") +
      text(1267, y + 27, value, 18, "#24243e", 500);
  });
  save("fino", s);
}

// ONDO: a content-first 10-foot UI, full cinematic image and clear remote focus.
{
  let s =
    rect(0, 0, 1600, 1100, "#111a1c") +
    photo("ondo-still.webp", 0, 0, 1600, 870);
  s +=
    rect(0, 0, 1600, 870, "url(#tv-shade)") +
    text(70, 92, "ondo", 46, "#fbf9ef", 500, 'letter-spacing="-2"') +
    text(321, 85, "Discover", 22, "#fff", 600) +
    text(501, 85, "Series", 22, "#a8b3af") +
    text(635, 85, "Films", 22, "#a8b3af") +
    text(758, 85, "My list", 22, "#a8b3af") +
    line(322, 103, 405, 103, "#e9f2d5", 3) +
    text(1337, 86, "Search", 20, "#fff") +
    circle(1490, 77, 23, "#bec8ab") +
    text(1483, 84, "A", 18, "#25312c", 600);
  s +=
    text(
      74,
      228,
      "ONDO ORIGINAL · DRAMA",
      16,
      "#d2dac5",
      600,
      'letter-spacing="3"',
    ) +
    serif(68, 350, "Beyond", 106, "#f8f5e9") +
    serif(68, 458, "the quiet.", 106, "#f8f5e9") +
    text(
      77,
      514,
      "2025     16+     1 SEASON     4K UHD",
      17,
      "#e3e8de",
      500,
      'letter-spacing="1"',
    ) +
    text(77, 567, "A story found beyond the noise.", 22, "#dce2d8") +
    rect(75, 611, 232, 64, "#eef1df", 6) +
    text(108, 651, "▶   Watch now", 22, "#18231e", 600) +
    rect(328, 611, 178, 64, "#142523", 6, "#a0aea1") +
    text(354, 651, "+   My list", 22, "#f2f3e9");
  s +=
    text(77, 793, "Your next discovery", 27, "#fafaf1", 500) +
    text(1422, 790, "01 / 03", 16, "#bbc4b7");
  const y = 826;
  s +=
    rect(73, y - 4, 461, 220, "none", 10, "#eaf1df", 4) +
    photo("ondo-still.webp", 81, y + 4, 445, 204) +
    rect(81, y + 106, 445, 102, "url(#poster-shade)") +
    text(102, y + 174, "BEYOND THE QUIET", 24, "#fff", 500) +
    pill(98, y + 18, 111, "SELECTED", "#edf2df", "#23332b", 12);
  s +=
    rect(558, y, 454, 212, "#3d3c46", 5) +
    `<path d="M558 1000V886h35v-30h47v57h39v-68h51v40h32v-42h69v68h46v-39h44v126Z" fill="#191e2a"/>` +
    circle(932, 876, 27, "#d8bb7e") +
    text(583, 995, "CITY AFTER DARK", 26, "#faf2df", 500) +
    text(
      584,
      1024,
      "THRILLER · 2025",
      12,
      "#e7dfce",
      500,
      'letter-spacing="1.5"',
    );
  s +=
    rect(1042, y, 454, 212, "#b49278", 5) +
    `<path d="M1042 973Q1175 825 1324 953T1496 954V1038H1042Z" fill="#66594a"/><path d="M1042 1017Q1251 893 1496 997V1038H1042Z" fill="#363f38"/>` +
    text(1067, 995, "THE LONG WAY", 26, "#faf2df", 500) +
    text(
      1068,
      1024,
      "ADVENTURE · 2025",
      12,
      "#e7dfce",
      500,
      'letter-spacing="1.5"',
    );
  save(
    "ondo",
    s,
    '<linearGradient id="tv-shade"><stop stop-color="#0e1918" stop-opacity=".9"/><stop offset=".58" stop-color="#0e1918" stop-opacity=".25"/><stop offset="1" stop-color="#0e1918" stop-opacity=".04"/></linearGradient><linearGradient id="poster-shade" x2="0" y2="1"><stop stop-color="#111a1c" stop-opacity="0"/><stop offset="1" stop-color="#111a1c" stop-opacity=".95"/></linearGradient>',
  );
}

// ORBIT: role-based work, explicit tasks, deadlines and a working board hierarchy.
{
  let s = rect(0, 0, 1600, 1100, "#f3f4f8") + rect(0, 0, 244, 1100, "#23243a");
  s +=
    circle(46, 67, 15, "none", "#b9b4f8", 7) +
    text(74, 79, "orbit", 34, "#f5f4ff", 600, 'letter-spacing="-1"') +
    text(33, 147, "WORKSPACE", 12, "#9f9eb6", 600, 'letter-spacing="1.4"');
  [
    ["Overview", "01"],
    ["Projects", "06"],
    ["My tasks", "12"],
    ["Team", "08"],
  ].forEach(([label, n], i) => {
    const y = 185 + i * 64;
    s +=
      (i === 1 ? rect(18, y - 32, 209, 50, "#3c3b59", 8) : "") +
      text(36, y, label, 20, "#efedf9", i === 1 ? 600 : 400) +
      text(184, y, n, 14, "#bab7d7");
  });
  s +=
    line(30, 463, 213, 463, "#46445b") +
    text(33, 510, "PINNED PROJECTS", 12, "#9f9eb6", 600, 'letter-spacing="1"') +
    circle(39, 556, 4, "#c8bcff") +
    text(54, 563, "Website renewal", 17, "#fff") +
    circle(39, 605, 4, "#d0ddae") +
    text(54, 612, "Service operations", 17, "#ccc9dc") +
    circle(39, 654, 4, "#e9b59f") +
    text(54, 661, "Design system", 17, "#ccc9dc") +
    rect(26, 971, 191, 96, "#36354e", 10) +
    text(43, 1007, "Root4 concept team", 16, "#f3f1ff", 500) +
    text(43, 1040, "Workspace settings  ↗", 13, "#bab7d7");
  s +=
    rect(245, 0, 1355, 106, "#fff") +
    text(287, 65, "Projects  /  Website renewal", 17, "#6b6b7e") +
    text(1236, 65, "Search workspace", 16, "#848398") +
    circle(1530, 53, 21, "#e3dff7") +
    text(1523, 60, "A", 18, "#68608e", 600);
  s +=
    text(
      289,
      191,
      "Website renewal",
      48,
      "#25263b",
      600,
      'letter-spacing="-2"',
    ) +
    text(
      291,
      235,
      "One shared view. From the first question to the final review.",
      19,
      "#747487",
    ) +
    rect(1355, 155, 190, 54, "#6760a8", 8) +
    text(1380, 190, "+ New task", 20, "#fff", 500);
  s +=
    text(292, 303, "Overview", 18, "#92919d") +
    text(428, 303, "Board", 18, "#524b8c", 600) +
    text(528, 303, "Timeline", 18, "#92919d") +
    text(654, 303, "Files", 18, "#92919d") +
    line(428, 320, 480, 320, "#6760a8", 3) +
    line(290, 329, 1545, 329, "#dbdce5");
  [
    ["12", "IN PROGRESS"],
    ["08", "READY FOR REVIEW"],
    ["24 Jun", "NEXT MILESTONE"],
  ].forEach(([n, l], i) => {
    let x = 291 + i * 331;
    s +=
      text(x, 388, n, 35, "#35354a", 500) +
      text(
        x + (i === 2 ? 155 : 101),
        384,
        l,
        11,
        "#79798a",
        600,
        'letter-spacing=".7"',
      );
  });
  const cols = [
    [
      "To do",
      "03",
      "#e5e5ed",
      [
        [
          "Navigation audit",
          "PLANNING",
          "Map the current service structure.",
          "18 Jun",
          "MJ",
        ],
        [
          "Content inventory",
          "RESEARCH",
          "Review content by user task.",
          "19 Jun",
          "SH",
        ],
        [
          "Accessibility checklist",
          "UX REVIEW",
          "Define keyboard and contrast checks.",
          "20 Jun",
          "SY",
        ],
      ],
    ],
    [
      "In progress",
      "03",
      "#e8e2fa",
      [
        [
          "Service flow definition",
          "UX PLANNING",
          "Connect discovery to conversion.",
          "19 Jun",
          "JH",
        ],
        [
          "Core screen design",
          "UI DESIGN",
          "Create the first complete journey.",
          "21 Jun",
          "SY",
        ],
        [
          "Component library",
          "DESIGN SYSTEM",
          "Align patterns, variants and states.",
          "22 Jun",
          "MJ",
        ],
      ],
    ],
    [
      "In review",
      "02",
      "#dfead7",
      [
        [
          "Information architecture",
          "UX PLANNING",
          "A clearer structure for every task.",
          "17 Jun",
          "SH",
        ],
        [
          "Responsive principles",
          "UI DESIGN",
          "Review desktop and mobile layouts.",
          "18 Jun",
          "JH",
        ],
      ],
    ],
  ];
  cols.forEach(([label, n, color, tasks], i) => {
    let x = 291 + i * 326;
    s +=
      rect(x, 437, 307, 58, color, 8) +
      text(x + 16, 475, label, 22, "#36354a", 600) +
      text(x + 263, 474, n, 15, "#777486");
    tasks.forEach(([title, tag, sub, date, initial], j) => {
      let y = 515 + j * 174;
      s +=
        rect(x, y, 307, 155, "#fff", 9, "#e2e3ec") +
        text(x + 18, y + 30, tag, 10, "#7b729b", 600, 'letter-spacing="1"') +
        text(x + 18, y + 63, title, 18, "#35354a", 600) +
        text(x + 18, y + 93, sub, 12, "#858493") +
        line(x + 18, y + 110, x + 289, y + 110, "#eeeeF3") +
        text(x + 18, y + 136, date, 13, "#777486") +
        circle(x + 270, y + 132, 13, color) +
        text(x + 260, y + 137, initial, 10, "#55516c", 600);
    });
  });
  s +=
    rect(1281, 437, 264, 575, "#ebeaf2", 9) +
    text(1302, 474, "Project pulse", 20, "#444159", 600) +
    text(
      1302,
      520,
      "NEXT CHECKPOINT",
      10,
      "#8c869e",
      600,
      'letter-spacing="1"',
    ) +
    text(1302, 555, "Design review", 23, "#444159", 500) +
    text(1302, 587, "24 Jun  /  14:00", 15, "#777286") +
    line(1302, 614, 1524, 614, "#d6d3e1") +
    text(1302, 653, "Team activity", 19, "#444159", 600);
  [
    ["SY", "Core screens updated", "12 min ago"],
    ["MJ", "6 components added", "48 min ago"],
    ["SH", "Review notes shared", "1 hour ago"],
  ].forEach(([initial, a, time], i) => {
    let y = 683 + i * 94;
    s +=
      circle(1318, y + 14, 16, "#d8d1ed") +
      text(1307, y + 19, initial, 11, "#5c537a", 600) +
      text(1345, y + 12, a, 13, "#565065", 500) +
      text(1345, y + 38, time, 12, "#938ba0");
  });
  save("orbit", s);
}

// FORM & FIELD: a photographed product campaign, typography and purchasable detail.
{
  let s =
    rect(0, 0, 1600, 1100, "#eee7da") +
    photo("form-product.webp", 0, 0, 1600, 1100);
  s +=
    rect(0, 0, 1600, 115, "#f7f3e9") +
    text(68, 75, "FORM & FIELD", 32, "#302c27", 500, 'letter-spacing="2"') +
    text(652, 71, "Objects", 19, "#504b42") +
    text(790, 71, "Lighting", 19, "#504b42") +
    text(928, 71, "Our perspective", 19, "#504b42") +
    text(1301, 71, "Search", 17, "#504b42") +
    text(1439, 71, "Bag (0)", 17, "#504b42");
  s +=
    text(
      76,
      216,
      "A CONSIDERED COLLECTION.",
      15,
      "#5d5346",
      500,
      'letter-spacing="2"',
    ) +
    serif(66, 364, "Objects for", 112) +
    serif(66, 487, "the everyday.", 112) +
    text(77, 566, "Thoughtful forms. Honest materials.", 24, "#5e5548") +
    text(77, 603, "Things that make a room feel like yours.", 24, "#5e5548") +
    line(77, 691, 367, 691, "#77634f") +
    text(77, 674, "Explore the collection", 22, "#352c23") +
    arrow(342, 649, "#352c23", 24);
  s +=
    text(76, 963, "MADE TO STAY.", 15, "#5e5548", 500, 'letter-spacing="2"') +
    text(76, 1011, "Less, but with more meaning.", 23, "#352c23");
  s +=
    rect(1030, 824, 510, 224, "#fbf8ef", 4) +
    text(
      1058,
      864,
      "01 / PORTABLE LIGHTING",
      12,
      "#8a7a67",
      500,
      'letter-spacing="1.6"',
    ) +
    text(1058, 908, "The Arc lamp", 34, "#342e27", 500, 'letter-spacing="-1"') +
    text(1405, 908, "$148", 25, "#342e27") +
    circle(1071, 945, 10, "#bd3926") +
    circle(1107, 945, 10, "#e3d8c4") +
    circle(1143, 945, 10, "#46423d") +
    circle(1071, 945, 16, "none", "#8a7a67") +
    text(1180, 950, "Tomato red", 15, "#7c6f5d") +
    line(1058, 978, 1511, 978, "#dcd4c5") +
    text(1058, 1019, "View object", 20, "#342e27", 500) +
    arrow(1478, 997, "#342e27", 22);
  save("form", s);
}

// WAYVE: no repeated handset. A route-planning workspace with a detailed geographic map.
{
  let s = rect(0, 0, 1600, 1100, "#e7ecdc");
  s += `<path d="M770 95Q970 330 830 510T1010 810T1170 1100" fill="none" stroke="#b5d4d5" stroke-width="115"/><path d="M593 95 715 328 586 512 790 660 628 894 710 1100H405V95Z" fill="#d8e3c4"/><path d="M1002 132 1500 112 1494 294 1087 363Z" fill="#c5d6b0"/><path d="M1067 746 1572 793 1541 1050 1163 1009Z" fill="#c5d6b0"/>`;
  const roads = [
    "M508 160 1558 427",
    "M525 368 1585 642",
    "M540 604 1599 864",
    "M533 891 1391 1100",
    "M683 110 412 1065",
    "M984 107 711 1100",
    "M1259 108 992 1100",
    "M1548 110 1289 1100",
  ];
  roads.forEach(
    (d) =>
      (s += `<path d="${d}" fill="none" stroke="#d3d8c9" stroke-width="25"/><path d="${d}" fill="none" stroke="#fffdf5" stroke-width="18"/>`),
  );
  for (let i = 0; i < 7; i++) {
    let x = 652 + i * 140;
    s += `<path d="M${x} 130l-220 912" fill="none" stroke="#f5f6eb" stroke-width="6"/>`;
  }
  s +=
    rect(0, 0, 1600, 108, "#1f3430") +
    text(57, 75, "wayve", 47, "#f2f5dc", 600, 'letter-spacing="-2"') +
    text(648, 65, "Plan a trip", 19, "#eff4da", 600) +
    text(810, 65, "Live departures", 19, "#a7b9ab") +
    text(1017, 65, "Saved places", 19, "#a7b9ab") +
    text(1408, 65, "My trips  ↗", 18, "#eff4da");
  s +=
    rect(38, 141, 490, 908, "#fbfcf5", 18) +
    text(
      69,
      199,
      "A better way there.",
      31,
      "#243d31",
      600,
      'letter-spacing="-1"',
    ) +
    text(70, 235, "Your city. A little closer.", 18, "#78816d");
  s +=
    rect(68, 268, 430, 75, "#f0f3e6", 10) +
    circle(94, 305, 7, "none", "#608258", 3) +
    text(117, 297, "FROM", 10, "#8a957d", 600, 'letter-spacing="1"') +
    text(117, 324, "Seoul Forest", 21, "#273d30", 500) +
    rect(68, 355, 430, 75, "#f0f3e6", 10) +
    rect(87, 385, 13, 13, "#456d44", 3) +
    text(117, 384, "TO", 10, "#8a957d", 600, 'letter-spacing="1"') +
    text(117, 411, "Seongsu Station", 21, "#273d30", 500);
  s +=
    text(70, 474, "Leave now  ˅", 16, "#6e7d62") +
    text(357, 474, "Options  ☰", 16, "#6e7d62") +
    line(68, 502, 498, 502, "#e0e6d7");
  s +=
    rect(68, 526, 430, 218, "#e8f0d7", 11, "#64834b", 2) +
    pill(89, 547, 174, "RECOMMENDED", "#2f4e37", "#f3f9e3", 11) +
    text(89, 631, "18 min", 49, "#283f2c", 500, 'letter-spacing="-2"') +
    text(355, 627, "$1.20", 24, "#3f5a3b", 500) +
    text(91, 674, "Walk  →  Bus 2014  →  Walk", 19, "#52694a", 500) +
    text(91, 716, "Departs in 3 min · Arrive 14:42", 15, "#708263");
  s +=
    rect(68, 765, 430, 132, "#fff", 11, "#e1e6d8") +
    text(89, 807, "Walk the scenic way", 19, "#3c5136", 500) +
    text(89, 856, "26 min", 32, "#3c5136", 500) +
    text(332, 851, "1.8 km · Free", 16, "#7d8a71") +
    rect(68, 922, 430, 88, "#223d30", 10) +
    text(102, 976, "Start your trip", 23, "#f4f8df", 500) +
    arrow(448, 952, "#f4f8df", 22);
  s +=
    text(653, 333, "SEOUL FOREST", 25, "#74845c", 600, 'letter-spacing="1.5"') +
    text(1185, 259, "SEONGSU", 31, "#7a865f", 500, 'letter-spacing="3"') +
    text(1111, 987, "HAN RIVER", 22, "#71979a", 500, 'letter-spacing="4"') +
    text(1359, 716, "Ttukseom", 19, "#8b9579");
  s +=
    `<path d="M705 785 770 650 976 702 1084 397 1287 448" fill="none" stroke="#f6ffe5" stroke-width="24" stroke-linejoin="round"/><path d="M705 785 770 650 976 702 1084 397 1287 448" fill="none" stroke="#365c40" stroke-width="13" stroke-linejoin="round"/><path d="M705 785 661 853" stroke="#446442" stroke-width="6" stroke-dasharray="4 8"/>` +
    circle(705, 785, 16, "#f5ffe4", "#365c40", 6) +
    circle(1287, 448, 17, "#365c40", "#fffde9", 6);
  s +=
    rect(770, 542, 202, 67, "#fbfcf5", 12) +
    text(792, 582, "2014  ·  On time", 17, "#39563b", 600) +
    rect(1187, 333, 313, 68, "#203a2e", 12) +
    text(1209, 375, "Seongsu Station  ↗", 21, "#f4f8dd", 500) +
    circle(1488, 187, 34, "#fbfcf5") +
    text(1478, 197, "N", 25, "#39563b", 500) +
    rect(1470, 867, 60, 120, "#fbfcf5", 13) +
    text(1488, 909, "+", 29, "#39563b") +
    line(1483, 927, 1517, 927, "#dfe6d6") +
    text(1488, 966, "−", 29, "#39563b") +
    line(1308, 1039, 1446, 1039, "#738366", 3) +
    text(1344, 1024, "150 m", 14, "#738366");
  save("wayve", s);
}
console.log(
  "Created six original, independently art-directed UI concept images.",
);

// Opening-only crops are deliberately designed at their display ratio. They dissolve into
// the complete project boards using the existing overview progress, not a second timeline.
const opening = (name, body, w, h, defs = "") =>
  writeFileSync(
    out + name + "-opening.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`,
  );
{
  let s =
    rect(0, 0, 1600, 900, "#fffaf4") +
    text(65, 87, "connect.", 43, "#252723", 700) +
    text(670, 79, "Mobile", 20) +
    text(796, 79, "Internet", 20) +
    text(926, 79, "Benefits", 20) +
    text(1064, 79, "Support", 20) +
    pill(1325, 51, 205, "My connection  ↗", "#252723", "#fffaf4", 18) +
    line(65, 115, 1535, 115, "#e3dfd3");
  s +=
    text(
      70,
      180,
      "GOOD CONNECTIONS. GREAT POSSIBILITIES.",
      14,
      "#786855",
      600,
      'letter-spacing="1.7"',
    ) +
    text(65, 277, "Made for", 90, "#282a25", 500, 'letter-spacing="-4"') +
    text(65, 372, "your everyday.", 90, "#282a25", 500, 'letter-spacing="-4"') +
    text(
      70,
      428,
      "More of what you love. A plan that feels like you.",
      21,
      "#686b60",
    ) +
    rect(68, 465, 267, 58, "#282a25", 29) +
    text(94, 503, "Find your connection", 20, "#fffaf4") +
    arrow(299, 483, "#fffaf4", 17);
  s +=
    rect(965, 150, 570, 373, "#f45f3e", 16) +
    text(
      1000,
      195,
      "ONE PLAN. EVERY POSSIBILITY.",
      14,
      "#492a23",
      600,
      'letter-spacing="1.4"',
    ) +
    text(998, 293, "100", 105, "#252621", 500, 'letter-spacing="-5"') +
    text(1220, 292, "GB", 48, "#252621", 500) +
    text(1004, 333, "Fast 5G. Room for everything.", 21, "#492a23") +
    line(1002, 367, 1498, 367, "#ce5135") +
    text(1003, 424, "$29", 44, "#252621", 500) +
    text(1100, 422, "/ month", 20, "#492a23") +
    text(1005, 472, "No contracts. No surprises.", 18, "#492a23") +
    arrow(1449, 434, "#252621", 29);
  s +=
    text(
      68,
      587,
      "Find a little more.",
      30,
      "#282a25",
      500,
      'letter-spacing="-1"',
    ) +
    text(1029, 584, "Mobile plans", 19, "#282a25", 600) +
    text(1217, 584, "Home internet", 19, "#838579") +
    text(1421, 584, "Family", 19, "#838579") +
    line(1029, 601, 1149, 601, "#f45f3e", 3);
  [
    ["EVERYDAY 20", "20 GB", "$19", "#fffaf4", "#282a25"],
    ["UNLIMITED 5G", "Unlimited", "$39", "#282a25", "#fffaf4"],
    ["TOGETHER HOME", "500 Mbps", "$29", "#efeade", "#282a25"],
  ].forEach(([name, data, price, bg, fg], i) => {
    let x = 68 + i * 494;
    s +=
      rect(x, 631, 473, 220, bg, 10, bg === "#fffaf4" ? "#d8d6cb" : bg) +
      text(x + 26, 670, name, 14, fg, 600, 'letter-spacing="1.3"') +
      text(x + 24, 729, data, 45, fg, 500, 'letter-spacing="-1.5"') +
      text(
        x + 26,
        752,
        [
          "Calls and texts included",
          "Roaming in 50 destinations",
          "Wi-Fi router included",
        ][i],
        14,
        fg,
      ) +
      line(x + 25, 771, x + 448, 771, i === 1 ? "#51534a" : "#d7d4c6") +
      text(x + 25, 812, price, 36, fg, 500) +
      text(x + 101, 810, "/ month", 17, fg) +
      arrow(x + 420, 786, fg, 22);
  });
  // One wide board serves the opening and expanded lead: no duplicate text during entry.
  writeFileSync(
    out + "connect.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="970" viewBox="0 0 1600 970" role="img" aria-label="Connect concept telecom interface">${rect(0, 0, 1600, 970, "#fffaf4")}<g transform="translate(48 55) scale(.94)">${s}</g></svg>`,
  );
}
{
  let s =
    rect(0, 0, 800, 1000, "#4246dc") +
    text(45, 81, "fino.", 55, "#fff", 700, 'letter-spacing="-3"') +
    text(466, 74, "YOUR OVERVIEW", 14, "#d7dbff", 600, 'letter-spacing="1.4"') +
    rect(24, 127, 752, 850, "#fcfcff", 27) +
    text(66, 183, "TOTAL BALANCE", 16, "#71748b", 600, 'letter-spacing="1.8"') +
    text(59, 273, "$24,860.80", 83, "#24243e", 500, 'letter-spacing="-4"') +
    pill(64, 305, 295, "↗  $1,482 this month", "#edf7dd", "#385333", 21) +
    rect(64, 382, 315, 74, "#4246dc", 18) +
    text(117, 431, "↗  Transfer", 29, "#fff", 500) +
    rect(399, 382, 335, 74, "#eceeff", 18) +
    text(447, 431, "+  Add money", 28, "#4246dc", 500) +
    text(65, 524, "Cash flow", 31, "#24243e", 600) +
    text(622, 522, "June  ˅", 21, "#727487") +
    text(65, 569, "Income  $4,820", 22, "#4246dc", 500) +
    text(429, 569, "Spending  $2,640", 22, "#767c9a", 500);
  [100, 143, 123, 185, 159, 213, 195].forEach((h, i) => {
    s +=
      rect(77 + i * 93, 817 - h, 32, h, "#4246dc", 6) +
      rect(114 + i * 93, 817 - h * 0.62, 24, h * 0.62, "#d7dbfa", 6);
  });
  s +=
    line(65, 819, 735, 819, "#e3e5f1") +
    text(67, 851, "01 JUN", 15, "#7b7d90") +
    text(665, 851, "30 JUN", 15, "#7b7d90") +
    text(65, 908, "Recent activity", 25, "#24243e", 600) +
    text(594, 908, "View all  ↗", 18, "#777d96") +
    circle(85, 946, 18, "#e6efd8") +
    text(78, 954, "N", 19, "#4246dc", 600) +
    text(121, 951, "North Studio", 21, "#30314a", 600) +
    text(578, 951, "+$4,820.00", 21, "#30314a", 500);
  opening("fino", s, 800, 1000);
}
{
  let s =
    rect(0, 0, 1600, 900, "#111a1c") +
    photo("ondo-still.webp", 0, 0, 1600, 900) +
    rect(0, 0, 1600, 900, "url(#shade)") +
    text(62, 88, "ondo", 44, "#fbf9ef", 500, 'letter-spacing="-2"') +
    text(308, 82, "Discover", 20, "#fff", 600) +
    text(486, 82, "Series", 20, "#c0cbc2") +
    text(612, 82, "Films", 20, "#c0cbc2") +
    text(731, 82, "My list", 20, "#c0cbc2") +
    line(309, 99, 388, 99, "#e9f2d5", 3) +
    text(1373, 82, "Search", 19, "#fff") +
    circle(1511, 74, 21, "#bec8ab");
  s +=
    text(
      68,
      220,
      "ONDO ORIGINAL · DRAMA",
      15,
      "#d2dac5",
      600,
      'letter-spacing="2"',
    ) +
    serif(61, 322, "Beyond the quiet.", 95, "#f8f5e9") +
    text(
      69,
      372,
      "2025     16+     1 SEASON     4K UHD",
      16,
      "#e3e8de",
      500,
      'letter-spacing="1"',
    ) +
    text(69, 422, "A story found beyond the noise.", 22, "#dce2d8") +
    rect(67, 460, 232, 60, "#eef1df", 5) +
    text(98, 499, "▶   Watch now", 21, "#18231e", 600) +
    rect(321, 460, 171, 60, "#142523", 5, "#a0aea1") +
    text(346, 499, "+   My list", 21, "#f2f3e9") +
    text(69, 635, "Your next discovery", 25, "#fafaf1", 500);
  s +=
    rect(66, 666, 465, 171, "none", 6, "#eaf1df", 4) +
    photo("ondo-still.webp", 73, 673, 451, 157) +
    rect(73, 755, 451, 75, "#132221cc") +
    text(91, 805, "BEYOND THE QUIET", 23, "#fff", 500) +
    rect(560, 667, 457, 170, "#30303b", 5) +
    circle(932, 716, 23, "#d8bb7e") +
    `<path d="M560 814V736h39v-29h48v62h43v-35h36v-39h54v74h43v-40h49v42h64v-31h81v74Z" fill="#151e2a"/>` +
    text(585, 806, "CITY AFTER DARK", 23, "#faf2df", 500) +
    rect(1048, 667, 457, 170, "#b49278", 5) +
    `<path d="M1048 780Q1184 640 1340 768T1505 780V837H1048Z" fill="#66594a"/>` +
    text(1075, 806, "THE LONG WAY", 23, "#faf2df", 500);
  opening(
    "ondo",
    s,
    1600,
    900,
    '<linearGradient id="shade"><stop stop-color="#0e1918" stop-opacity=".88"/><stop offset=".65" stop-color="#0e1918" stop-opacity=".12"/><stop offset="1" stop-color="#0e1918" stop-opacity=".03"/></linearGradient>',
  );
}

// Product-led edge preview: the cropped campaign is distinct from another UI screen.
{
  const body =
    photo("form-product.webp", 0, 0, 1536, 1024) +
    text(740, 141, "FORM & FIELD", 32, "#352c23", 500, 'letter-spacing="2"');
  writeFileSync(
    out + "form-opening.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="700 80 836 627">${body}</svg>`,
  );
}
