import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { projects } from './data';
import './gallery.css';

const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const ease = n => { const p = clamp(n); return p * p * (3 - 2 * p); };
const enterAt = index => index === 0 ? 0 : 1.25 + (index - 1) * 1.2;
const restingAt = index => index === 0 ? 0.95 : enterAt(index) + 0.85;
const LAST_STOP = restingAt(projects.length - 1) + 0.45;
const colors = ['#dde4dc', '#e5e7f4', '#c8cece', '#e5e1db', '#ded7ca', '#d4e1dc'];

function useSimpleView() {
  const [simple, setSimple] = useState(() => matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)');
    const update = () => setSimple(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return simple;
}

export default function ScrollGallery({ onOpen, onPointerMove, onPointerLeave }) {
  const simple = useSimpleView();
  const root = useRef(null);
  const stage = useRef(null);
  const cards = useRef([]);
  const captions = useRef([]);
  const timeline = useRef({ unit: 1, local: 0 });
  const [current, setCurrent] = useState(-1);

  useLayoutEffect(() => {
    if (simple) { setCurrent(-1); return; }
    let frame = 0;
    let width = 0, height = 0, target, tiles;
    const measure = () => {
      width = stage.current.clientWidth;
      height = stage.current.clientHeight;
      const compact = height < 720;
      const tileGap = width * 0.035;
      const available = Math.min(width * 0.86, 1520);
      const col = (available - tileGap * 2) / 3;
      const boardTop = compact ? 180 : 222;
      const rowGap = compact ? 38 : 48;
      const tileHeight = Math.min((height - boardTop - 130 - rowGap) / 2, col / 1.65);
      const tileWidth = tileHeight * 1.65;
      const startX = (width - (tileWidth * 3 + tileGap * 2)) / 2;
      const factors = [1, 0.9, 0.96, 0.88, 1, 0.92];
      const offsets = [0, 20, -8, 10, -3, 18];
      tiles = projects.map((_, i) => ({
        x: startX + (i % 3) * (tileWidth + tileGap) + (1 - factors[i]) * tileWidth / 2,
        y: boardTop + Math.floor(i / 3) * (tileHeight + rowGap) + offsets[i],
        width: tileWidth * factors[i],
      }));
      const targetHeight = Math.max(200, Math.min(height - 276, width * 0.79 / 1.65));
      target = { width: targetHeight * 1.65, height: targetHeight, x: (width - targetHeight * 1.65) / 2, y: 100 };
      timeline.current.unit = height * 0.95;
      root.current.style.height = `${height + LAST_STOP * timeline.current.unit}px`;
      cards.current.forEach(card => {
        card.style.width = `${target.width}px`;
        card.style.height = `${target.height}px`;
      });
      update();
    };
    const update = () => {
      frame = 0;
      if (!target) return;
      const local = clamp(-root.current.getBoundingClientRect().top / timeline.current.unit, 0, LAST_STOP);
      timeline.current.local = local;
      const overview = 1 - ease(local / 0.55);
      stage.current.style.setProperty('--overview-opacity', overview);
      stage.current.style.setProperty('--overview-y', `${-local * 35}px`);
      stage.current.style.setProperty('--background-x', `${local * -18}px`);
      stage.current.style.setProperty('--total-progress', clamp(local / LAST_STOP));
      let active = local < 0.42 ? -1 : 0;
      for (let i = 1; i < projects.length; i++) {
        if (local >= enterAt(i) + 0.38) active = i;
      }
      setCurrent(prev => prev === active ? prev : active);
      cards.current.forEach((card, i) => {
        const tile = tiles[i];
        const expansion = ease((local - enterAt(i)) / 0.8);
        const exit = i === projects.length - 1 ? 0 : ease((local - enterAt(i + 1)) / 0.8);
        const initialScale = tile.width / target.width;
        const scale = (initialScale + (1 - initialScale) * expansion) * (1 - exit * 0.07);
        const x = tile.x + (target.x - tile.x) * expansion - exit * width * 0.085;
        const y = tile.y + (target.y - tile.y) * expansion + exit * 14;
        let opacity = 1;
        if (i === 0) opacity = 1 - exit;
        else if (local < enterAt(i)) opacity = overview;
        else opacity = ease((local - enterAt(i)) / 0.35) * (1 - exit);
        card.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        card.style.opacity = opacity;
        card.style.zIndex = expansion > 0 && exit < 1 ? 10 + i : i;
        card.style.pointerEvents = opacity > 0.8 && (active === i || active === -1) ? 'auto' : 'none';
        const accessible = opacity > 0.8 && (active === i || active === -1);
        card.inert = !accessible;
        card.setAttribute('aria-hidden', !accessible);
        const image = card.querySelector('img');
        const drift = (local - restingAt(i)) * (i % 2 ? -12 : 16);
        image.style.setProperty('--image-y', `${clamp(drift, -18, 18)}px`);
        const caption = captions.current[i];
        caption.style.transform = `translate3d(${tile.x}px, ${tile.y + tile.width / 1.65 + 10}px, 0)`;
        caption.style.width = `${tile.width}px`;
        caption.style.opacity = overview;
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(measure);
    resize.observe(stage.current);
    addEventListener('scroll', schedule, { passive: true });
    measure();
    return () => { resize.disconnect(); removeEventListener('scroll', schedule); cancelAnimationFrame(frame); };
  }, [simple]);

  const jump = index => {
    if (simple) return;
    const y = index < 0 ? 0 : restingAt(index) * timeline.current.unit;
    const top = root.current.getBoundingClientRect().top + scrollY;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: top + y, behavior: reduced ? 'instant' : 'smooth' });
    onPointerLeave();
  };
  const showProject = p => { onPointerLeave(); onOpen(p); };

  if (simple) return <section className="simple-gallery" id="work" aria-label="프로젝트 갤러리">
    <div className="simple-heading"><p className="eyebrow">ROOTFO — SELECTED WORK / 06</p><h1>경험을 설계하고,<br/>디자인으로 완성합니다.</h1><p>기획자와 디자이너가 함께 만드는 더 나은 경험.</p><span>구성 예시 · CONCEPT PROJECTS</span></div>
    <div className="simple-grid">{projects.map((p, i) => <article key={p.id}>
      <button onClick={() => showProject(p)} aria-label={`${p.brand} — ${p.name} 상세 보기`}>
        <div className="simple-image" style={{ background: colors[i] }}><img src={`/projects/${p.id}.svg`} alt={`${p.brand} UI 목업`} width="1200" height="1000" loading={i > 1 ? 'lazy' : 'eager'}/><span>0{i + 1} / 06 ↗</span></div>
        <p>{p.type}</p><h2>{p.name} ↗</h2><p>{p.scope}</p>
      </button>
    </article>)}</div>
  </section>;

  return <section className="gallery-scroll" id="work" ref={root} aria-label="스크롤로 탐색하는 프로젝트 갤러리">
    <div className="gallery-stage" ref={stage} data-mode={current < 0 ? 'overview' : 'project'}>
      <div className="gallery-background" aria-hidden="true">ROOTFO</div>
      <div className="gallery-heading">
        <div><p className="eyebrow"><span className="status-dot"/> PLANNING & DESIGN STUDIO</p><h1>경험을 설계하고, 디자인으로 완성합니다.</h1></div>
        <p>기획자와 디자이너가 함께,<br/>서비스의 본질부터.</p>
      </div>
      <div className="gallery-topline"><span>SELECTED WORK <b>06</b></span><span>기획에서 디자인까지, 함께 만든 경험</span><span>구성 예시 · CONCEPT PROJECTS</span></div>
      <div className="gallery-artworks">
        {projects.map((p, i) => <React.Fragment key={p.id}>
          <article className="scene-card" ref={el => cards.current[i] = el} style={{ background: colors[i] }}>
            <button className="scene-project-button" onClick={() => showProject(p)} aria-label={`${p.brand} — ${p.name} 상세 보기`} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} onBlur={onPointerLeave}>
              <img src={`/projects/${p.id}.svg`} alt={`${p.brand} ${p.type} UI 목업`} width="1200" height="1000" loading={i > 1 ? 'lazy' : 'eager'}/>
              <span className="scene-card-corner">{p.brand.toUpperCase()}<span>↗</span></span>
            </button>
          </article>
          <div className="overview-caption" ref={el => captions.current[i] = el} aria-hidden="true"><span><b>0{i + 1}</b> {p.brand}</span><span>{p.type.split(' · ')[0]}</span></div>
        </React.Fragment>)}
      </div>
      <div className="gallery-caption" aria-live="polite" aria-atomic="true">
        {current >= 0 && <><span className="feature-index">0{current + 1}<small> / 06</small></span><div><p>{projects[current].type}</p><h2>{projects[current].name}</h2><span>{projects[current].scope}</span></div><button className="feature-open" onClick={() => showProject(projects[current])}>프로젝트 자세히 보기 <span>↗</span></button></>}
      </div>
      <p className="gallery-overview-note">구성 예시 · CONCEPT PROJECTS</p>
      <div className="gallery-bottom">
        <button className="overview-toggle" onClick={() => jump(current < 0 ? 0 : -1)}>{current < 0 ? '스크롤해서 프로젝트 탐색' : '전체 프로젝트'}<span>{current < 0 ? '↓' : '↖'}</span></button>
        <div className="gallery-dots" role="group" aria-label="프로젝트 바로 탐색">{projects.map((p, i) => <button key={p.id} className={current === i ? 'is-current' : ''} aria-current={current === i ? 'step' : undefined} aria-label={`${i + 1}번 ${p.brand} 프로젝트로 이동`} onClick={() => jump(i)}><span>0{i + 1}</span><i/></button>)}</div>
        <button className="gallery-next" onClick={() => current < projects.length - 1 ? jump(current + 1) : document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>{current === projects.length - 1 ? 'Our approach' : '다음 프로젝트'} <span>↓</span></button>
      </div>
      <div className="gallery-progress" aria-hidden="true"><i/></div>
    </div>
  </section>;
}
