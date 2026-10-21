import React, {
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { projects } from "./data";
import "./gallery.css";
import "./opening.css";

import FeatureDetail from "./FeatureDetail";
import {
  clamp,
  ease,
  PROJECT_ENTRY,
  PROJECT_SPAN,
  STORY_ENTRY,
  SCROLL_UNIT,
  projectStart as enterAt,
  projectRest as restingAt,
  chapters,
  chapterRest,
  chapterLengths,
  chapterRead,
  inspectAt,
  motionProfiles,
  END,
} from "./motion";

const names = ["about", "lab", "contact"];
const colors = [
  "#e6e4da",
  "#c8d1e7",
  "#18262b",
  "#d8dad4",
  "#d5c7b4",
  "#c7d4be",
];
// Opening art direction only. The existing scroll clock, project order and target remain unchanged.
const composition = [
  { x: 0.285, y: 0.38, w: 0.555, h: 0.49, angle: 0, depth: 0.7, layer: 6 },
  { x: 0.045, y: 0.43, w: 0.205, h: 0.39, angle: -1.8, depth: 1.5, layer: 4 },
  { x: 0.665, y: 0.14, w: 0.29, h: 0.23, angle: 0, depth: 0.9, layer: 3 },
  { x: 0.945, y: 0.44, w: 0.3, h: 0.25, angle: 0, depth: 1.15, layer: 1 },
  { x: 0.87, y: 0.705, w: 0.26, h: 0.3, angle: -2, depth: 0.8, layer: 2 },
  { x: -0.18, y: 0.48, w: 0.215, h: 0.31, angle: 0, depth: 1.6, layer: 0 },
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
    panels = useRef([]);
  const timeline = useRef({
    unit: 1,
    local: 0,
    visual: null,
    clock: 0,
    snap: false,
  });
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [scene, setScene] = useState({
    current: -1,
    section: "work",
    insightStep: 0,
    storyStep: 0,
    detailsVisible: false,
  });
  const { current, section, insightStep, storyStep, detailsVisible } = scene;

  const goTo = (value, smooth = true) => {
    onPointerLeave();
    if (simple) {
      const id = typeof value === "number" ? "work" : value;
      document.getElementById(id)?.scrollIntoView({
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
          : chapterRest(value);
    const top = root.current.getBoundingClientRect().top + scrollY;
    if (!smooth) timeline.current.snap = true;
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
      const raw = clamp(
        -root.current.getBoundingClientRect().top / timeline.current.unit,
        0,
        END,
      );
      const now = performance.now();
      const dt = clamp(now - timeline.current.clock, 8, 40);
      const previous = timeline.current.visual;
      const local =
        previous === null || timeline.current.snap
          ? raw
          : previous + (raw - previous) * (1 - Math.exp(-dt / 115));
      timeline.current.snap = false;
      timeline.current.clock = now;
      timeline.current.visual = Math.abs(raw - local) < 0.0003 ? raw : local;
      timeline.current.local = local;
      const overview = 1 - ease((local - 0.35) / 0.75);
      const storyEnter = ease((local - chapters.about) / STORY_ENTRY);
      let active = local < 0.35 + PROJECT_ENTRY * 0.5 ? -1 : 0;
      for (let i = 1; i < projects.length; i++)
        if (local >= enterAt(i) + PROJECT_ENTRY * 0.5) active = i;
      let activeSection = "work";
      names.forEach((name) => {
        if (local >= chapters[name] + STORY_ENTRY * 0.5) activeSection = name;
      });
      const insight = active >= 0 ? inspectAt(local, active) : 0;
      const nextProject =
        active < projects.length - 1 ? enterAt(active + 1) : chapters.about;
      const outgoing =
        active >= 0 ? ease((local - nextProject) / PROJECT_ENTRY) : 0;
      const detailOpacity =
        active < 0
          ? 0
          : ease((local - enterAt(active) - 0.94) / 0.32) * (1 - outgoing);
      const nextScene = {
        current: active,
        section: activeSection,
        insightStep: Math.min(2, Math.floor(insight * 3)),
        storyStep: Math.min(3, Math.floor(chapterRead(local, "about") * 4)),
        detailsVisible: detailOpacity > 0.68 && activeSection === "work",
      };
      setScene((prev) =>
        Object.keys(nextScene).every((key) => nextScene[key] === prev[key])
          ? prev
          : nextScene,
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
      el.style.setProperty("--detail-opacity", detailOpacity);
      el.style.setProperty("--inspect", insight);
      el.style.setProperty(
        "--scene-progress",
        active < 0 ? 0 : clamp((local - enterAt(active)) / PROJECT_SPAN),
      );
      el.dataset.phase =
        active < 0
          ? "overview"
          : local < enterAt(active) + PROJECT_ENTRY
            ? "enter"
            : insight < 1
              ? "explore"
              : "hold";
      cards.current.forEach((card, i) => {
        const tile = tiles[i];
        const expansion = ease((local - enterAt(i)) / PROJECT_ENTRY);
        const exit =
          i === projects.length - 1
            ? storyEnter
            : ease((local - enterAt(i + 1)) / PROJECT_ENTRY);
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
        card.style.zIndex = expansion > 0 && exit < 1 ? 10 + i : tile.layer;
        const accessible =
          opacity > 0.75 &&
          activeSection === "work" &&
          (active === i || active === -1);
        card.style.pointerEvents = accessible ? "auto" : "none";
        card.inert = !accessible;
        card.setAttribute("aria-hidden", !accessible);
        card.style.setProperty("--opening-width", `${target.w * sx}px`);
        card.style.setProperty("--opening-height", `${target.h * sy}px`);
        card.style.setProperty("--opening-scale-x", 1 / sx);
        card.style.setProperty("--opening-scale-y", 1 / sy);
        card.style.setProperty("--counter-x", Math.max(sx, sy) / sx);
        card.style.setProperty("--counter-y", Math.max(sx, sy) / sy);
        card.style.setProperty("--tilt-x", `${-p.y * 3 * overview}deg`);
        card.style.setProperty("--tilt-y", `${p.x * 4 * overview}deg`);
        const profile = motionProfiles[i % motionProfiles.length];
        const inspection = inspectAt(local, i);
        card.style.setProperty(
          "--image-x",
          `${(inspection - 0.5) * profile.panX * expansion}px`,
        );
        card.style.setProperty(
          "--image-y",
          `${(inspection - 0.5) * profile.panY * expansion}px`,
        );
        card.style.setProperty(
          "--camera-zoom",
          1 + inspection * profile.zoom * expansion,
        );
        card.style.setProperty(
          "--matte",
          (1 - ease(inspection / 0.4)) * expansion,
        );
        card.style.setProperty("--corner-opacity", expansion);
        const caption = captions.current[i];
        caption.style.transform = `translate3d(${tile.x + p.x * 22 * tile.depth * overview}px, ${(i === 2 ? tile.y - 25 : tile.y + tile.h + 16) + p.y * 16 * tile.depth * overview}px, 0)`;
        caption.style.width = `${tile.w}px`;
        caption.style.opacity = overview;
      });
      panels.current.forEach((panel, i) => {
        const start = chapters[names[i]];
        const enter = ease((local - start) / STORY_ENTRY);
        const exit =
          i === 2 ? 0 : ease((local - chapters[names[i + 1]]) / STORY_ENTRY);
        const phase = clamp((local - start) / chapterLengths[names[i]], 0, 1.5);
        panel.style.opacity = enter * (1 - exit);
        panel.style.transform = `translate3d(${exit * -width * 0.035}px, ${(1 - enter) * height * 0.14 - exit * height * 0.1}px, 0)`;
        panel.style.setProperty("--phase", phase);
        panel.style.setProperty("--enter", enter);
        panel.style.setProperty("--exit", exit);
        const elapsed = local - start;
        const read = chapterRead(local, names[i]);
        panel.style.setProperty("--read-progress", read);
        panel.style.setProperty("--copy-enter", ease((elapsed - 0.15) / 0.55));
        panel.style.setProperty(
          "--figure-enter",
          ease((elapsed - 0.55) / 0.65),
        );
        if (i === 1) {
          panel.dataset.note = Math.min(2, Math.floor(read * 3));
          panel.querySelectorAll(".lab-paper").forEach((paper, index) => {
            paper.style.setProperty(
              "--note-open",
              ease((read - index * 0.23) / 0.28),
            );
          });
        }
        if (i === 2) {
          panel.style.setProperty("--line-one", ease((elapsed - 0.1) / 0.5));
          panel.style.setProperty("--line-two", ease((elapsed - 0.5) / 0.55));
          panel.style.setProperty(
            "--message-enter",
            ease((elapsed - 0.9) / 0.5),
          );
          panel.style.setProperty("--cta-enter", ease((elapsed - 1.3) / 0.5));
          panel.dataset.ctaReady = String(ease((elapsed - 1.3) / 0.5) > 0.95);
          panel.style.setProperty("--seal-enter", ease((elapsed - 1) / 0.85));
        }
        const accessible = activeSection === names[i];
        panel.inert = !accessible;
        panel.style.pointerEvents = accessible ? "auto" : "none";
        panel.setAttribute("aria-hidden", !accessible);
      });
      if (
        Math.abs(p.x - p.tx) + Math.abs(p.y - p.ty) > 0.001 ||
        Math.abs(raw - timeline.current.visual) > 0.0003
      )
        schedule();
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
          y: i === 2 ? Math.max(112, height * t.y) : height * t.y,
          w: width * t.w,
          h:
            i === 0
              ? Math.min(height * t.h, height - height * t.y - 126)
              : i === 1 && height < 720
                ? height * 0.36
                : i === 2
                  ? Math.min(
                      height * t.h,
                      height * composition[0].y -
                        Math.max(112, height * t.y) -
                        16,
                    )
                  : height * t.h,
        };
      });
      const h = Math.max(200, Math.min(height - 276, (width * 0.82) / 1.65));
      target = { w: h * 1.65, h, x: (width - h * 1.65) / 2, y: 100 };
      timeline.current.unit = height * SCROLL_UNIT;
      timeline.current.visual = null;
      root.current.style.height = `${height + END * timeline.current.unit}px`;
      cards.current.forEach((card) => {
        card.style.width = `${target.w}px`;
        card.style.height = `${target.h}px`;
      });
      update();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const move = (e) => {
      pointer.current.tx = (e.clientX / width - 0.5) * 2;
      pointer.current.ty = (e.clientY / height - 0.5) * 2;
      const button = e.target.closest?.(".scene-project-button");
      const inspecting = !!button && stage.current.dataset.mode === "project";
      stage.current.dataset.inspecting = String(inspecting);
      if (inspecting) {
        const box = button.getBoundingClientRect();
        const x = `${clamp((e.clientX - box.left) / box.width) * 100}%`;
        const y = `${clamp((e.clientY - box.top) / box.height) * 100}%`;
        button.style.setProperty("--lens-x", x);
        button.style.setProperty("--lens-y", y);
        stage.current.style.setProperty("--focus-x", x);
        stage.current.style.setProperty("--focus-y", y);
      }
      schedule();
    };
    const leave = () => {
      pointer.current.tx = 0;
      pointer.current.ty = 0;
      stage.current.dataset.inspecting = "false";
      schedule();
    };
    const restore = () => {
      timeline.current.snap = true;
      update();
    };
    addEventListener("root4:restore", restore);
    const resize = new ResizeObserver(measure);
    resize.observe(stage.current);
    addEventListener("scroll", schedule, { passive: true });
    stage.current.addEventListener("pointermove", move, { passive: true });
    stage.current.addEventListener("pointerleave", leave);
    const element = stage.current;
    measure();
    const hash = location.hash.slice(1);
    if (names.includes(hash)) goTo(hash, false);
    return () => {
      resize.disconnect();
      removeEventListener("root4:restore", restore);
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
            <p className="eyebrow">Root4 — INDEPENDENT DESIGN STUDIO</p>
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
                      width={p.imageSize?.width || 1600}
                      height={p.imageSize?.height || 1100}
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
              <p className="showcase-intro">
                기획과 디자인을 연결해, 더 나은 디지털 경험을 만듭니다.
              </p>
              <p className="showcase-disclaimer">
                SELECTED WORK 06 <span>구성 예시 · CONCEPT PROJECTS</span>
              </p>
            </div>
            <p>
              기획에서 디자인까지.
              <br />
              서로 다른 관점으로, 하나의 경험을.
            </p>
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
                  data-project={p.id}
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
                        width={p.imageSize?.width || 1600}
                        height={p.imageSize?.height || 1100}
                        loading={i > 1 ? "lazy" : "eager"}
                        fetchPriority={i === 0 ? "high" : "auto"}
                      />
                      {p.opening && (
                        <img
                          className="opening-art"
                          src={`/projects/${p.id}-opening.webp`}
                          alt=""
                          aria-hidden="true"
                          loading="eager"
                          fetchPriority={i === 0 ? "high" : "auto"}
                          width={p.opening.width}
                          height={p.opening.height}
                        />
                      )}
                      <span className="inspection-reticle" aria-hidden="true">
                        <i />
                        <i />
                      </span>
                      {i === 2 && (
                        <>
                          <span
                            className="film-matte matte-top"
                            aria-hidden="true"
                          />
                          <span
                            className="film-matte matte-bottom"
                            aria-hidden="true"
                          />
                        </>
                      )}
                      <span className="scene-card-corner">
                        {p.brand.toUpperCase()}
                        <span>↗</span>
                      </span>
                    </button>
                  </div>
                </article>
                <div
                  className="overview-caption"
                  data-project={p.id}
                  ref={(el) => (captions.current[i] = el)}
                  aria-hidden="true"
                >
                  <span>
                    <b>0{i + 1}</b> <strong>{p.brand}</strong>
                    <small>{p.name}</small>
                    <em>{p.scope}</em>
                  </span>
                  <span>{p.type.split(" · ")[0]}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
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
                <div key={current} className="caption-copy">
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
          {current >= 0 && (
            <FeatureDetail
              key={current}
              project={projects[current]}
              index={current}
              autoStep={insightStep}
              visible={detailsVisible}
            />
          )}
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
                  className={
                    current === i
                      ? "is-current"
                      : current > i
                        ? "is-complete"
                        : ""
                  }
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
              {i === 0
                ? React.cloneElement(child, { scrollStep: storyStep })
                : child}
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
