import React, {
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { projects } from "./data";
import "./gallery.css";

const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const ease = (n) => {
  const p = clamp(n);
  return p * p * (3 - 2 * p);
};
const enterAt = (i) => (i === 0 ? 0.12 : 1.35 + (i - 1) * 1.2);
const restingAt = (i) => enterAt(i) + 0.88;
const projectEnd = restingAt(projects.length - 1) + 0.37;
const chapters = {
  work: 0,
  about: projectEnd,
  lab: projectEnd + 2.5,
  contact: projectEnd + 5,
};
const END = chapters.contact + 2.2;
const names = ["about", "lab", "contact"];
const colors = [
  "#e6e4da",
  "#c8d1e7",
  "#18262b",
  "#d8dad4",
  "#d5c7b4",
  "#c7d4be",
];
// Deliberately composed coordinates, ratios, angles and depths rather than a grid.
const composition = [
  { x: 0.035, y: 0.245, w: 0.305, h: 0.272, angle: -3.5, depth: 0.7 },
  { x: 0.425, y: 0.145, w: 0.155, h: 0.385, angle: 4, depth: 1.5 },
  { x: 0.705, y: 0.147, w: 0.255, h: 0.275, angle: -4, depth: 0.9 },
  { x: 0.085, y: 0.655, w: 0.235, h: 0.205, angle: 2.5, depth: 1.15 },
  { x: 0.405, y: 0.66, w: 0.235, h: 0.215, angle: -2.5, depth: 0.8 },
  { x: 0.765, y: 0.535, w: 0.155, h: 0.315, angle: 4.5, depth: 1.6 },
];
const fragments = [
  {
    project: "connect",
    x: 0.335,
    y: 0.305,
    w: 0.07,
    h: 0.085,
    depth: 1.8,
    angle: 6,
  },
  {
    project: "fino",
    x: 0.605,
    y: 0.25,
    w: 0.07,
    h: 0.165,
    depth: 0.55,
    angle: -7,
  },
  {
    project: "orbit",
    x: 0.625,
    y: 0.49,
    w: 0.105,
    h: 0.13,
    depth: 1.3,
    angle: 5,
  },
  {
    project: "form",
    x: 0.965,
    y: 0.645,
    w: 0.12,
    h: 0.17,
    depth: 0.7,
    angle: -8,
  },
];
function useSimpleView() {
  const [simple, setSimple] = useState(
    () =>
      matchMedia("(max-width: 767px), (prefers-reduced-motion: reduce)")
        .matches,
  );
  useEffect(() => {
    const query = matchMedia(
      "(max-width: 767px), (prefers-reduced-motion: reduce)",
    );
    const update = () => setSimple(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return simple;
}

export default function ScrollGallery({
  onOpen,
  onPointerMove,
  onPointerLeave,
  onSectionChange,
  navigationRef,
  children,
}) {
  const simple = useSimpleView();
  const root = useRef(null),
    stage = useRef(null);
  const cards = useRef([]),
    captions = useRef([]),
    pieces = useRef([]),
    panels = useRef([]);
  const timeline = useRef({ unit: 1, local: 0 });
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [scene, setScene] = useState({ current: -1, section: "work" });
  const { current, section } = scene;

  const goTo = (value, smooth = true) => {
    onPointerLeave();
    if (simple) {
      const id = typeof value === "number" ? "work" : value;
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      return;
    }
    const local =
      typeof value === "number"
        ? value < 0
          ? 0
          : restingAt(value)
        : value === "work"
          ? 0
          : chapters[value] + 0.95;
    const top = root.current.getBoundingClientRect().top + scrollY;
    window.scrollTo({
      top: top + local * timeline.current.unit,
      behavior: smooth ? "smooth" : "instant",
    });
  };
  useImperativeHandle(navigationRef, () => ({ navigate: goTo }), [simple]);
  useEffect(() => {
    if (!simple) {
      onSectionChange(section);
      onPointerLeave();
    }
  }, [section, simple, onSectionChange]);

  useLayoutEffect(() => {
    if (simple) return;
    let frame = 0,
      width = 0,
      height = 0,
      target,
      tiles;
    const update = () => {
      frame = 0;
      if (!target) return;
      const p = pointer.current;
      p.x += (p.tx - p.x) * 0.09;
      p.y += (p.ty - p.y) * 0.09;
      const local = clamp(
        -root.current.getBoundingClientRect().top / timeline.current.unit,
        0,
        END,
      );
      timeline.current.local = local;
      const overview = 1 - ease((local - 0.12) / 0.65);
      const storyEnter = ease((local - chapters.about) / 0.85);
      let active = local < 0.54 ? -1 : 0;
      for (let i = 1; i < projects.length; i++)
        if (local >= enterAt(i) + 0.38) active = i;
      let activeSection = "work";
      names.forEach((name) => {
        if (local >= chapters[name] + 0.32) activeSection = name;
      });
      setScene((prev) =>
        prev.current === active && prev.section === activeSection
          ? prev
          : { current: active, section: activeSection },
      );
      const el = stage.current;
      const world = el.querySelector(".work-world");
      world.inert = activeSection !== "work";
      world.setAttribute("aria-hidden", activeSection !== "work");
      el.style.setProperty("--overview-opacity", overview);
      el.style.setProperty("--overview-y", `${-local * 40}px`);
      el.style.setProperty("--background-x", `${local * -24 + p.x * -17}px`);
      el.style.setProperty("--background-y", `${local * -5 + p.y * -10}px`);
      el.style.setProperty("--work-opacity", 1 - storyEnter);
      el.style.setProperty("--total-progress", local / END);
      el.style.setProperty("--pointer-x", p.x);
      el.style.setProperty("--pointer-y", p.y);
      el.style.setProperty("--floating", overview);
      cards.current.forEach((card, i) => {
        const tile = tiles[i];
        const expansion = ease((local - enterAt(i)) / 0.85);
        const exit =
          i === projects.length - 1
            ? storyEnter
            : ease((local - enterAt(i + 1)) / 0.85);
        let sx =
          (tile.w / target.w + (1 - tile.w / target.w) * expansion) *
          (1 - exit * 0.08);
        let sy =
          (tile.h / target.h + (1 - tile.h / target.h) * expansion) *
          (1 - exit * 0.08);
        const x =
          tile.x +
          (target.x - tile.x) * expansion -
          exit * width * 0.08 +
          p.x * 22 * tile.depth * overview;
        const y =
          tile.y +
          (target.y - tile.y) * expansion +
          exit * 16 +
          p.y * 16 * tile.depth * overview;
        let opacity =
          i === 0
            ? 1 - exit
            : local < enterAt(i)
              ? overview
              : ease((local - enterAt(i)) / 0.36) * (1 - exit);
        opacity *= 1 - storyEnter;
        const angle = tile.angle * (1 - expansion);
        card.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg) scale(${sx}, ${sy})`;
        card.style.opacity = opacity;
        card.style.zIndex = expansion > 0 && exit < 1 ? 10 + i : i;
        const accessible =
          opacity > 0.75 &&
          activeSection === "work" &&
          (active === i || active === -1);
        card.style.pointerEvents = accessible ? "auto" : "none";
        card.inert = !accessible;
        card.setAttribute("aria-hidden", !accessible);
        card.style.setProperty("--counter-x", Math.max(sx, sy) / sx);
        card.style.setProperty("--counter-y", Math.max(sx, sy) / sy);
        card.style.setProperty("--tilt-x", `${-p.y * 3 * overview}deg`);
        card.style.setProperty("--tilt-y", `${p.x * 4 * overview}deg`);
        card.style.setProperty(
          "--image-y",
          `${clamp((local - restingAt(i)) * (i % 2 ? -18 : 22), -24, 24)}px`,
        );
        card.style.setProperty("--corner-opacity", expansion);
        const caption = captions.current[i];
        caption.style.transform = `translate3d(${tile.x + p.x * 22 * tile.depth * overview}px, ${tile.y + tile.h + 16 + p.y * 16 * tile.depth * overview}px, 0)`;
        caption.style.width = `${tile.w}px`;
        caption.style.opacity = overview;
      });
      pieces.current.forEach((piece, i) => {
        const tile = fragments[i];
        piece.style.transform = `translate3d(${width * tile.x + p.x * 28 * tile.depth - local * (i % 2 ? -65 : 50)}px, ${height * tile.y + p.y * 20 * tile.depth - local * 80 * tile.depth}px, 0) rotate(${tile.angle}deg)`;
        piece.style.opacity = overview * 0.85;
      });
      panels.current.forEach((panel, i) => {
        const start = chapters[names[i]];
        const enter = ease((local - start) / 0.85);
        const exit =
          i === 2 ? 0 : ease((local - chapters[names[i + 1]]) / 0.85);
        const phase = clamp((local - start) / 2.5, 0, 1.5);
        panel.style.opacity = enter * (1 - exit);
        panel.style.transform = `translate3d(${exit * -width * 0.035}px, ${(1 - enter) * height * 0.14 - exit * height * 0.1}px, 0)`;
        panel.style.setProperty("--phase", phase);
        panel.style.setProperty("--enter", enter);
        panel.style.setProperty("--exit", exit);
        const accessible = activeSection === names[i];
        panel.inert = !accessible;
        panel.style.pointerEvents = accessible ? "auto" : "none";
        panel.setAttribute("aria-hidden", !accessible);
      });
      if (Math.abs(p.x - p.tx) + Math.abs(p.y - p.ty) > 0.001) schedule();
    };
    const measure = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      width = stage.current.clientWidth;
      height = stage.current.clientHeight;
      tiles = projects.map((_, i) => {
        const t = composition[i] || {
          x: 0.08 + (i % 4) * 0.22,
          y: 0.2 + (Math.floor(i / 4) % 3) * 0.22,
          w: 0.17,
          h: 0.2,
          angle: i % 2 ? 4 : -4,
          depth: 1,
        };
        return {
          ...t,
          x: width * t.x,
          y: height * t.y - (i >= 3 ? Math.max(0, 850 - height) * 0.25 : 0),
          w: width * t.w,
          h: height * t.h,
        };
      });
      const h = Math.max(200, Math.min(height - 276, (width * 0.82) / 1.65));
      target = { w: h * 1.65, h, x: (width - h * 1.65) / 2, y: 100 };
      timeline.current.unit = height * 0.9;
      root.current.style.height = `${height + END * timeline.current.unit}px`;
      cards.current.forEach((card) => {
        card.style.width = `${target.w}px`;
        card.style.height = `${target.h}px`;
      });
      pieces.current.forEach((piece, i) => {
        piece.style.width = `${width * fragments[i].w}px`;
        piece.style.height = `${height * fragments[i].h}px`;
      });
      update();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const move = (e) => {
      pointer.current.tx = (e.clientX / width - 0.5) * 2;
      pointer.current.ty = (e.clientY / height - 0.5) * 2;
      schedule();
    };
    const leave = () => {
      pointer.current.tx = 0;
      pointer.current.ty = 0;
      schedule();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(stage.current);
    addEventListener("scroll", schedule, { passive: true });
    stage.current.addEventListener("pointermove", move, { passive: true });
    stage.current.addEventListener("pointerleave", leave);
    const element = stage.current;
    measure();
    const hash = location.hash.slice(1);
    if (chapters[hash] !== undefined && hash !== "work") goTo(hash, false);
    return () => {
      resize.disconnect();
      removeEventListener("scroll", schedule);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, [simple]);

  const showProject = (p) => {
    onPointerLeave();
    onOpen(p);
  };
  if (simple)
    return (
      <>
        <section
          className="simple-gallery"
          id="work"
          aria-label="프로젝트 갤러리"
        >
          <div className="simple-heading">
            <p className="eyebrow">ROOTFO — INDEPENDENT DESIGN STUDIO</p>
            <h1>
              경험을 설계하고,
              <br />
              디자인으로 완성합니다.
            </h1>
            <p>기획자와 디자이너가 함께 만드는 더 나은 경험.</p>
            <span>구성 예시 · CONCEPT PROJECTS</span>
          </div>
          <div className="simple-grid">
            {projects.map((p, i) => (
              <article key={p.id}>
                <button
                  onClick={() => showProject(p)}
                  aria-label={`${p.brand} — ${p.name} 상세 보기`}
                >
                  <div
                    className="simple-image"
                    style={{ background: colors[i] }}
                  >
                    <img
                      src={`/projects/${p.id}.webp`}
                      alt={`${p.brand} UI 목업`}
                      width="1600"
                      height="1100"
                      loading={i > 1 ? "lazy" : "eager"}
                    />
                    <span>0{i + 1} / 06 ↗</span>
                  </div>
                  <p>{p.type}</p>
                  <h2>{p.name} ↗</h2>
                  <p>{p.scope}</p>
                </button>
              </article>
            ))}
          </div>
        </section>
        <div className="simple-stories">{children}</div>
      </>
    );

  return (
    <section
      className="gallery-scroll"
      id="work"
      ref={root}
      aria-label="프로젝트부터 회사 소개까지 이어지는 스크롤 갤러리"
    >
      <div
        className="gallery-stage"
        ref={stage}
        data-mode={current < 0 ? "overview" : "project"}
        data-section={section}
      >
        <div className="work-world">
          <div className="gallery-background" aria-hidden="true">
            ROOTFO
          </div>
          <div className="gallery-heading">
            <div>
              <p className="eyebrow">
                <span className="status-dot" /> INDEPENDENT DESIGN STUDIO —
                SEOUL
              </p>
              <h1>
                경험을 설계하고,
                <br />
                디자인으로 완성합니다.
              </h1>
            </div>
            <p>
              기획에서 디자인까지.
              <br />
              서로 다른 관점으로, 하나의 경험을.
            </p>
          </div>
          <div className="collage-caption" aria-hidden="true">
            <span>
              Ideas in
              <br />
              <i>motion.</i>
            </span>
            <small>ROOTFO, SEOUL.</small>
          </div>
          <div className="gallery-topline">
            <span>
              SELECTED WORK <b>06</b>
            </span>
            <span>구성 예시 · CONCEPT PROJECTS</span>
          </div>
          <div className="gallery-artworks">
            {projects.map((p, i) => (
              <React.Fragment key={p.id}>
                <article
                  className="scene-card"
                  ref={(el) => (cards.current[i] = el)}
                  style={{
                    background: colors[i],
                    "--float-delay": `${-i * 1.3}s`,
                  }}
                >
                  <div className="scene-surface">
                    <button
                      className="scene-project-button"
                      onClick={() => showProject(p)}
                      aria-label={`${p.brand} — ${p.name} 상세 보기`}
                      onPointerMove={onPointerMove}
                      onPointerLeave={onPointerLeave}
                      onBlur={onPointerLeave}
                    >
                      <img
                        src={`/projects/${p.id}.webp`}
                        alt={`${p.brand} ${p.type} UI 목업`}
                        width="1600"
                        height="1100"
                        loading={i > 1 ? "lazy" : "eager"}
                      />
                      <span className="scene-card-corner">
                        {p.brand.toUpperCase()}
                        <span>↗</span>
                      </span>
                    </button>
                  </div>
                </article>
                <div
                  className="overview-caption"
                  ref={(el) => (captions.current[i] = el)}
                  aria-hidden="true"
                >
                  <span>
                    <b>0{i + 1}</b> {p.brand}
                    <small>{p.name}</small>
                    <em>{p.scope}</em>
                  </span>
                  <span>{p.type.split(" · ")[0]}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          {fragments.map((f, i) => (
            <div
              className={`collage-fragment fragment-${i}`}
              ref={(el) => (pieces.current[i] = el)}
              key={i}
              aria-hidden="true"
            >
              <img src={`/projects/${f.project}.webp`} alt="" />
              <span>
                {
                  [
                    "UX RESEARCH",
                    "DESIGN SYSTEM",
                    "WORK IN PROGRESS",
                    "MATERIAL STUDY",
                  ][i]
                }
              </span>
            </div>
          ))}
          <div
            className="gallery-caption"
            aria-live="polite"
            aria-atomic="true"
          >
            {current >= 0 && (
              <>
                <span className="feature-index">
                  0{current + 1}
                  <small> / 06</small>
                </span>
                <div>
                  <p>{projects[current].type}</p>
                  <h2>{projects[current].name}</h2>
                  <span>{projects[current].scope}</span>
                </div>
                <button
                  className="feature-open"
                  onClick={() => showProject(projects[current])}
                >
                  프로젝트 자세히 보기 <span>↗</span>
                </button>
              </>
            )}
          </div>
          <p className="gallery-overview-note">구성 예시 · CONCEPT PROJECTS</p>
          <div className="gallery-bottom">
            <button
              className="overview-toggle"
              onClick={() => goTo(current < 0 ? 0 : -1)}
            >
              {current < 0 ? "SCROLL TO EXPLORE" : "전체 프로젝트"}
              <span>{current < 0 ? "↓" : "↖"}</span>
            </button>
            <div
              className="gallery-dots"
              role="group"
              aria-label="프로젝트 바로 탐색"
            >
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  className={current === i ? "is-current" : ""}
                  aria-current={current === i ? "step" : undefined}
                  aria-label={`${i + 1}번 ${p.brand} 프로젝트로 이동`}
                  onClick={() => goTo(i)}
                >
                  <span>0{i + 1}</span>
                  <i />
                </button>
              ))}
            </div>
            <button
              className="gallery-next"
              onClick={() =>
                goTo(current < projects.length - 1 ? current + 1 : "about")
              }
            >
              {current === projects.length - 1
                ? "Our approach"
                : "다음 프로젝트"}{" "}
              <span>↓</span>
            </button>
          </div>
        </div>
        <div className="story-world">
          {React.Children.toArray(children).map((child, i) => (
            <div
              className={`story-pane pane-${names[i]}`}
              key={names[i]}
              ref={(el) => (panels.current[i] = el)}
            >
              {child}
            </div>
          ))}
        </div>
        <div className="chapter-label">
          <span>0{names.indexOf(section) + 2} / 04</span>
          <span>
            {section === "about"
              ? "THINK TOGETHER. MAKE BETTER."
              : section === "lab"
                ? "ALWAYS CURIOUS."
                : "LET’S MAKE IT HAPPEN."}
          </span>
          <button
            onClick={() =>
              goTo(
                section === "about"
                  ? "lab"
                  : section === "lab"
                    ? "contact"
                    : "work",
              )
            }
          >
            {section === "contact" ? "처음으로 돌아가기 ↑" : "계속 탐색하기 ↓"}
          </button>
        </div>
        <div className="gallery-progress" aria-hidden="true">
          <i />
        </div>
      </div>
    </section>
  );
}
