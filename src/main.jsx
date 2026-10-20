import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/noto-sans-kr/500.css";
import "@fontsource/noto-sans-kr/700.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";
import "./style.css";
import ScrollGallery from "./ScrollGallery";
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
        aria-labelledby="modal-title"
        ref={ref}
      >
        <div className="modal-top">
          <span>ROOTFO / {item.id ? "PROJECT STUDY" : "NOTES"}</span>
          <button onClick={onClose} aria-label="상세 닫기">
            닫기 <span>×</span>
          </button>
        </div>
        <p className="eyebrow">
          {item.id
            ? "구성 예시 · CONCEPT PROJECT"
            : "예시 콘텐츠 · LAB / NOTES"}
        </p>
        <h2 id="modal-title">{item.name || item.title}</h2>
        {item.id ? (
          <>
            <p className="modal-desc">{item.description}</p>
            <img
              className="detail-image"
              src={`/projects/${item.id}.svg`}
              alt={`${item.brand} UI 디자인 목업`}
            />
            <div className="detail-columns">
              <h3>우리가 설계한 범위</h3>
              <div>
                <p>
                  아래는 본 프로토타입에서 제안하는 작업 범위 예시입니다. 실제
                  고객 프로젝트나 수행 실적이 아닙니다.
                </p>
                {item.work.map((w, i) => (
                  <p className="scope-line" key={w}>
                    <span>0{i + 1}</span>
                    {w}
                  </p>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={`note-art ${item.art}`} aria-hidden="true">
              {item.art === "ai" ? (
                <>
                  <span>Human</span>
                  <i>×</i>
                  <span>AI</span>
                </>
              ) : item.art === "motion" ? (
                <>
                  <i />
                  <i />
                  <i />
                </>
              ) : (
                <span>Why?</span>
              )}
            </div>
            <p className="modal-desc">{item.text}</p>
            <p>
              이 글은 루트포의 탐구 방향을 보여주는 예시 콘텐츠입니다. 실험
              결과나 실제 수행 사례로 제시되지 않습니다.
            </p>
            <p>
              질문을 정리하고, 작은 프로토타입을 만들고, 사람의 관점에서 다시
              검토합니다. 도구보다 중요한 것은 경험을 이해하는 일이라고
              생각합니다.
            </p>
          </>
        )}
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
function App() {
  const [selected, setSelected] = useState(null),
    [contact, setContact] = useState(false),
    [active, setActive] = useState("work");
  const cursor = useRef(null);
  const hideCursor = () => cursor.current?.classList.remove("visible");
  const moveCursor = (e) => {
    if (e.pointerType !== "mouse") return;
    cursor.current.style.transform = `translate3d(${e.clientX + 16}px,${e.clientY + 16}px,0)`;
    cursor.current.classList.add("visible");
  };
  const close = React.useCallback(() => {
    if (history.state?.rootfo) history.back();
    else setSelected(null);
  }, []);
  const navigation = useRef(null);
  useEffect(() => {
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
  }, []);
  const navigate = (name) => {
    navigation.current?.navigate(name);
    history.replaceState(
      history.state,
      "",
      name === "work" ? "#work" : `#${name}`,
    );
    hideCursor();
  };
  useEffect(() => {
    const fn = () => setSelected(null);
    addEventListener("popstate", fn);
    return () => removeEventListener("popstate", fn);
  }, []);
  const open = (p) => {
    history.pushState({ rootfo: true }, "");
    hideCursor();
    setSelected(p);
  };
  return (
    <>
      <a href="#work" className="skip">
        프로젝트 바로가기
      </a>
      <header className={`site-header theme-${active}`}>
        <a
          className="logo"
          href="#work"
          onClick={(e) => {
            e.preventDefault();
            navigate("work");
          }}
          aria-label="ROOTFO 홈"
        >
          ROOTFO<span className="logo-mark">✳</span>
        </a>
        <nav aria-label="주 메뉴">
          {["Work", "About", "Lab", "Contact"].map((n) => (
            <a
              key={n}
              href={`#${n.toLowerCase()}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(n.toLowerCase());
              }}
              className={active === n.toLowerCase() ? "active" : ""}
            >
              {n}
            </a>
          ))}
        </nav>
        <span className="header-note">
          Seoul, KR <span className="status-dot" />
        </span>
      </header>
      <main id="top">
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
            contactContent={<Contact close={() => setContact(false)} />}
            onTop={() => navigate("work")}
          />
        </ScrollGallery>
      </main>
      <div className="custom-cursor" ref={cursor} aria-hidden="true">
        View project ↗
      </div>
      {selected && <Modal item={selected} onClose={close} />}
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
