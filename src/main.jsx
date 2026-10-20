import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/noto-sans-kr/500.css";
import "@fontsource/noto-sans-kr/700.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";
import "./style.css";
import ScrollGallery from "./ScrollGallery";
import Pages, { resolvePage } from "./Pages";
import DetailBody from "./DetailBody";
import { projects, notes } from "./data";
import { AboutScene, LabScene, ContactScene } from "./StoryContent";

function Modal({ item, onClose }) {
  const ref = useRef();
  useEffect(() => {
    const previous = document.activeElement;
    const y = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.width = "100%";
    ref.current.querySelector("button").focus();
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const nodes = ref.current.querySelectorAll("button,a,input,textarea");
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo({ top: y, behavior: "instant" });
      previous?.focus({ preventScroll: true });
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        ref={ref}
      >
        <div className="modal-top">
          <span>Root4 / {item.id ? "PROJECT STUDY" : "NOTES"}</span>
          <button onClick={onClose} aria-label="상세 닫기">
            닫기 <span>×</span>
          </button>
        </div>
        <DetailBody item={item} />
        <button className="text-link" onClick={onClose}>
          목록으로 돌아가기 ↗
        </button>
      </section>
    </div>
  );
}
function Contact({ close }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="contact-demo">
      <p>프로토타입 안내</p>
      <h3>
        좋은 대화의 시작을
        <br />
        준비하고 있습니다.
      </h3>
      <p>
        현재는 문의 전송 기능이 연결되지 않은 데모입니다.
        <br />
        문의 채널과 실제 연락처는 오픈 시 등록됩니다.
      </p>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(
              "프로젝트 분야:\n현재 고민:\n필요한 작업 범위:\n희망 일정:\n연락처:",
            );
            setCopied(true);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? "문의 양식을 복사했습니다 ✓" : "문의 양식 복사 ↗"}
      </button>
      <button onClick={close}>닫기 ×</button>
      <span role="status">
        {copied ? "복사한 양식에 프로젝트 내용을 정리해 보세요." : ""}
      </span>
    </div>
  );
}
function historyItem(state) {
  const modal = state?.root4Modal;
  return modal?.kind === "project"
    ? (projects.find((p) => p.id === modal.id) ?? null)
    : modal?.kind === "note"
      ? (notes.find((n) => n.slug === modal.id) ?? null)
      : null;
}

function App() {
  const page = resolvePage(location.pathname);
  const home = page.kind === "home";
  const [selected, setSelected] = useState(() => historyItem(history.state));
  const [contact, setContact] = useState(false);
  const [active, setActive] = useState("work");
  const cursor = useRef(null);
  const navigation = useRef(null);
  const hideCursor = () => cursor.current?.classList.remove("visible");
  const moveCursor = (e) => {
    if (e.pointerType !== "mouse") return;
    cursor.current.style.transform = `translate3d(${e.clientX + 16}px,${e.clientY + 16}px,0)`;
    cursor.current.classList.add("visible");
  };
  const close = React.useCallback(() => {
    if (history.state?.root4Modal) history.back();
    else setSelected(null);
  }, []);

  useLayoutEffect(() => {
    document.title = page.title;
    // Document navigation keeps browser link behavior and restores the gallery on Back.
    const key = () => `root4:scroll:${location.pathname}${location.search}`;
    const save = () => {
      const y =
        document.body.style.position === "fixed"
          ? -(parseFloat(document.body.style.top) || 0)
          : window.scrollY;
      try {
        sessionStorage.setItem(key(), String(y));
      } catch {
        /* Storage may be disabled. */
      }
    };
    if (
      performance.getEntriesByType("navigation")[0]?.type === "back_forward"
    ) {
      let saved;
      try {
        saved = sessionStorage.getItem(key());
      } catch {
        /* Use native restoration. */
      }
      if (
        saved !== null &&
        saved !== undefined &&
        Number.isFinite(Number(saved))
      ) {
        window.scrollTo({ top: Number(saved), behavior: "instant" });
        window.dispatchEvent(new Event("root4:restore"));
      }
    }
    addEventListener("pagehide", save);
    return () => removeEventListener("pagehide", save);
  }, []);

  useEffect(() => {
    if (!home) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (
            e.isIntersecting &&
            matchMedia("(max-width: 767px), (prefers-reduced-motion: reduce)")
              .matches
          )
            setActive(e.target.id);
        }),
      { rootMargin: "-15% 0px -50% 0px" },
    );
    const observe = () => {
      observer.disconnect();
      document
        .querySelectorAll("#work,#about,#lab,#contact")
        .forEach((e) => observer.observe(e));
    };
    observe();
    const resize = new ResizeObserver(observe);
    resize.observe(document.body);
    return () => {
      observer.disconnect();
      resize.disconnect();
    };
  }, [home]);
  useEffect(() => {
    const pop = (e) => setSelected(historyItem(e.state));
    addEventListener("popstate", pop);
    return () => removeEventListener("popstate", pop);
  }, []);
  const open = (item) => {
    history.pushState(
      {
        ...history.state,
        root4Modal: {
          kind: item.id ? "project" : "note",
          id: item.id || item.slug,
        },
      },
      "",
    );
    hideCursor();
    setSelected(item);
  };
  const activeNav = home ? active : page.nav;
  const contactContent = <Contact close={() => setContact(false)} />;
  return (
    <>
      <a href="#main-content" className="skip">
        본문 바로가기
      </a>
      <header className={`site-header theme-${activeNav || "work"}`}>
        <a className="logo" href="/" aria-label="Root4 홈">
          Root4<span className="logo-mark">✳</span>
        </a>
        <nav aria-label="주 메뉴">
          {["Work", "About", "Lab", "Contact"].map((name) => {
            const current = activeNav === name.toLowerCase();
            return (
              <a
                key={name}
                href={`/${name.toLowerCase()}`}
                className={current ? "active" : ""}
                aria-current={
                  current ? (home ? "location" : "page") : undefined
                }
              >
                {name}
              </a>
            );
          })}
        </nav>
        <span className="header-note">
          Seoul, KR <span className="status-dot" />
        </span>
      </header>
      <main id="main-content" tabIndex={-1}>
        {home ? (
          <ScrollGallery
            navigationRef={navigation}
            onSectionChange={setActive}
            onOpen={open}
            onPointerMove={moveCursor}
            onPointerLeave={hideCursor}
          >
            <AboutScene />
            <LabScene onOpen={open} />
            <ContactScene
              onContact={() => setContact(!contact)}
              contact={contact}
              contactContent={contactContent}
              onTop={() => {
                navigation.current?.navigate("work");
                hideCursor();
              }}
            />
          </ScrollGallery>
        ) : (
          <Pages
            page={page}
            contact={contact}
            onContact={() => setContact(!contact)}
            contactContent={contactContent}
          />
        )}
      </main>
      <div className="custom-cursor" ref={cursor} aria-hidden="true">
        View project ↗
      </div>
      {selected && <Modal item={selected} onClose={close} />}
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
