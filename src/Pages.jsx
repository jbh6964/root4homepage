import React, { useState } from "react";
import { projects, notes } from "./data";
import { AboutScene, ContactScene } from "./StoryContent";
import DetailBody from "./DetailBody";
import "./pages.css";

export function resolvePage(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/")
    return {
      kind: "home",
      nav: null,
      title: "Root4 — 경험을 설계하는 디자인 파트너",
    };
  if (path === "/work")
    return { kind: "work", nav: "work", title: "Work — Root4" };
  if (path === "/about")
    return { kind: "about", nav: "about", title: "About — Root4" };
  if (path === "/lab")
    return { kind: "lab", nav: "lab", title: "Lab / Notes — Root4" };
  if (path === "/contact")
    return { kind: "contact", nav: "contact", title: "Contact — Root4" };
  const project = projects.find((p) => path === `/work/${p.id}`);
  if (project)
    return {
      kind: "project",
      nav: "work",
      item: project,
      title: `${project.brand} — Root4`,
    };
  const note = notes.find((n) => path === `/lab/${n.slug}`);
  if (note)
    return {
      kind: "note",
      nav: "lab",
      item: note,
      title: `${note.title.replaceAll("\n", " ")} — Root4`,
    };
  return {
    kind: "not-found",
    nav: null,
    title: "페이지를 찾을 수 없습니다 — Root4",
  };
}

function PageFooter() {
  return (
    <footer className="page-footer">
      <a className="logo" href="/">
        Root4<span className="logo-mark">✳</span>
      </a>
      <span>기획과 디자인으로, 더 나은 경험을.</span>
      <span>© {new Date().getFullYear()} Root4</span>
      <a href="/contact">프로젝트 이야기하기 ↗</a>
    </footer>
  );
}
function PageIntro({ number, label, title, text }) {
  return (
    <div className="page-intro">
      <p className="eyebrow">
        <span className="status-dot" />
        {number} / {label}
      </p>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}
function WorkPage() {
  const initial = new URLSearchParams(location.search).get("type");
  const [filter, setFilter] = useState(
    ["web", "app", "tv"].includes(initial) ? initial : "all",
  );
  const choose = (value) => {
    setFilter(value);
    history.replaceState(
      history.state,
      "",
      value === "all" ? "/work" : `/work?type=${value}`,
    );
  };
  const visible = projects.filter(
    (p) => filter === "all" || p.category === filter,
  );
  return (
    <>
      <div className="route-work">
        <PageIntro
          number="01"
          label="SELECTED WORK"
          title={
            <>
              서로 다른 문제,
              <br />
              사람을 향하는 경험.
            </>
          }
          text="기획과 디자인을 연결해 서비스에 필요한 답을 만듭니다."
        />
        <div className="work-filter">
          <div role="group" aria-label="프로젝트 분야 필터">
            {[
              ["all", "All"],
              ["web", "Web"],
              ["app", "Mobile"],
              ["tv", "TV"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={filter === value ? "is-selected" : ""}
                aria-pressed={filter === value}
                onClick={() => choose(value)}
              >
                {label}
                <span>
                  {value === "all"
                    ? projects.length
                    : projects.filter((p) => p.category === value).length}
                </span>
              </button>
            ))}
          </div>
          <span>구성 예시 · 실제 고객 수행 실적이 아닙니다.</span>
        </div>
        <p className="sr-only" role="status">
          {visible.length}개 프로젝트
        </p>
        <div className="work-page-grid">
          {visible.map((p) => (
            <article key={p.id}>
              <a className="work-case-link" href={`/work/${p.id}`}>
                <div className="work-case-image">
                  <img
                    src={`/projects/${p.id}.webp`}
                    alt={`${p.brand} UI 목업`}
                    width="2400"
                    height={
                      p.imageSize
                        ? Math.round(
                            (2400 * p.imageSize.height) / p.imageSize.width,
                          )
                        : 1650
                    }
                    loading="lazy"
                  />
                  <span>VIEW PROJECT ↗</span>
                </div>
                <div className="work-case-meta">
                  <p>
                    {p.type}
                    <span>{p.year}</span>
                  </p>
                  <h2>
                    {p.name}
                    <span>↗</span>
                  </h2>
                  <p>{p.scope}</p>
                </div>
              </a>
            </article>
          ))}
        </div>
        <div className="page-cta">
          <span>다음 프로젝트의 시작은, 좋은 대화에서.</span>
          <a href="/contact">함께 시작하기 ↗</a>
        </div>
      </div>
      <PageFooter />
    </>
  );
}
function AboutPage() {
  return (
    <>
      <h1 className="sr-only">About Root4 — 함께 설계하는 경험</h1>
      <div className="simple-stories route-about">
        <AboutScene />
      </div>
      <section
        className="capability-section"
        aria-labelledby="capability-title"
      >
        <div>
          <p className="eyebrow">WHAT WE DO</p>
          <h2 id="capability-title">
            문제를 이해하는 일부터,
            <br />
            화면을 완성하는 일까지.
          </h2>
          <p>
            웹·모바일 앱·TV 앱. 서로 다른 환경에서도
            <br />
            서비스의 목적과 사용자의 맥락을 함께 봅니다.
          </p>
        </div>
        <div className="capability-list">
          {[
            [
              "01",
              "Planning",
              "서비스의 구조를 설계합니다.",
              "사용자 시나리오 · 정보 구조 · 기능 정의 · 화면 기획",
            ],
            [
              "02",
              "UX / UI Design",
              "이해하기 쉽고, 사용하기 좋은 화면.",
              "UX 흐름 · UI 디자인 · 인터랙션 · 반응형 설계",
            ],
            [
              "03",
              "Design System",
              "하나의 경험이 일관되게 이어지도록.",
              "컴포넌트 · 스타일 가이드 · 상태 정의 · 디자인 검토",
            ],
          ].map(([num, en, title, scope]) => (
            <article key={en}>
              <span>{num}</span>
              <div>
                <h3>{en}</h3>
                <h4>{title}</h4>
                <p>{scope}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="page-cta about-page-cta">
        <span>우리가 만드는 경험을 살펴보세요.</span>
        <a href="/work">프로젝트 둘러보기 ↗</a>
      </div>
      <PageFooter />
    </>
  );
}
function LabPage() {
  return (
    <>
      <div className="route-lab">
        <PageIntro
          number="03"
          label="LAB / NOTES"
          title={
            <>
              익숙한 방식에 질문하고,
              <br />
              다음의 경험을 탐구합니다.
            </>
          }
          text="AI 활용 과정, 작은 실험, 기획과 디자인의 관점. 모두 고객 프로젝트와 구분되는 예시 콘텐츠입니다."
        />
        <div className="notes-page-list">
          {notes.map((note, i) => (
            <article key={note.slug}>
              <a href={`/lab/${note.slug}`}>
                <div
                  className={`lab-cover lab-cover-${note.art}`}
                  aria-hidden="true"
                >
                  {i === 0 ? (
                    <>
                      <span>Human</span>
                      <i>↔</i>
                      <strong>AI</strong>
                    </>
                  ) : i === 1 ? (
                    <>
                      <i />
                      <i />
                      <i />
                    </>
                  ) : (
                    <span>What if?</span>
                  )}
                  <b>0{i + 1}</b>
                </div>
                <div className="note-page-copy">
                  <p>
                    {note.tag} <span>예시 콘텐츠</span>
                  </p>
                  <h2>{note.title}</h2>
                  <p>{note.text}</p>
                  <span>노트 읽기 ↗</span>
                </div>
              </a>
            </article>
          ))}
        </div>
        <div className="page-cta">
          <span>도구를 넘어, 사람의 경험을 생각합니다.</span>
          <a href="/about">Root4의 작업 방식 ↗</a>
        </div>
      </div>
      <PageFooter />
    </>
  );
}
function ContactPage({ contact, onContact, contactContent }) {
  return (
    <>
      <h1 className="sr-only">Contact Root4 — 프로젝트 문의</h1>
      <div className="simple-stories route-contact">
        <ContactScene
          contact={contact}
          onContact={onContact}
          contactContent={contactContent}
        />
      </div>
    </>
  );
}
function ArticlePage({ item }) {
  const isProject = !!item.id;
  const next = isProject
    ? projects[(projects.indexOf(item) + 1) % projects.length]
    : notes[(notes.indexOf(item) + 1) % notes.length];
  const list = isProject ? "/work" : "/lab";
  return (
    <>
      <article
        className={`article-page ${isProject ? "case-page" : "note-detail-page"}`}
      >
        <a className="article-back" href={list}>
          ↖ {isProject ? "전체 프로젝트" : "Lab / Notes"}
        </a>
        <DetailBody item={item} heading="h1" />
        <div className="article-next">
          <span>다음 {isProject ? "프로젝트" : "노트"} · 구성 예시</span>
          <a href={`${list}/${isProject ? next.id : next.slug}`}>
            {next.name || next.title.replaceAll("\n", " ")} <span>↗</span>
          </a>
        </div>
      </article>
      <PageFooter />
    </>
  );
}
export default function Pages({ page, contact, onContact, contactContent }) {
  if (page.kind === "work") return <WorkPage />;
  if (page.kind === "about") return <AboutPage />;
  if (page.kind === "lab") return <LabPage />;
  if (page.kind === "contact")
    return (
      <ContactPage
        contact={contact}
        onContact={onContact}
        contactContent={contactContent}
      />
    );
  if (page.item) return <ArticlePage item={page.item} />;
  return (
    <>
      <section className="not-found-page">
        <p className="eyebrow">Root4 / 404</p>
        <h1>찾으시는 페이지가 없습니다.</h1>
        <p>주소를 확인하거나 홈에서 다시 살펴보세요.</p>
        <a className="text-link" href="/">
          홈으로 돌아가기 ↗
        </a>
      </section>
      <PageFooter />
    </>
  );
}
