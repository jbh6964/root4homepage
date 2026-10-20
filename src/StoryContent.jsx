import React, { useState } from "react";
import { notes } from "./data";

const process = [
  {
    en: "Understand",
    ko: "문제 이해",
    text: "누구를 위한 서비스인지, 무엇이 달라져야 하는지. 좋은 질문으로 출발합니다.",
    word: "WHY",
    label: "맥락을 읽는 기획",
  },
  {
    en: "Structure",
    ko: "구조 설계",
    text: "흩어진 요구와 복잡한 정보를 정리해, 사용자가 자연스럽게 움직이는 흐름을 만듭니다.",
    word: "FLOW",
    label: "명확한 구조와 흐름",
  },
  {
    en: "Design",
    ko: "디자인",
    text: "기능의 이유를 담은 화면. 구조와 감각이 균형을 이루는 경험으로 구체화합니다.",
    word: "FORM",
    label: "의미를 담은 디자인",
  },
  {
    en: "Refine",
    ko: "검토",
    text: "직접 사용하고, 함께 질문하고, 다시 다듬습니다. 작은 차이가 좋은 경험을 만듭니다.",
    word: "MORE",
    label: "사용하며 더 나은 답으로",
  },
];

export function AboutScene() {
  const [step, setStep] = useState(0);
  return (
    <section
      id="about"
      className="story-section approach-scene"
      aria-labelledby="approach-title"
    >
      <div className="story-kicker">
        <span>02 / OUR APPROACH</span>
        <span>기획과 디자인 사이, 경계를 넘어</span>
      </div>
      <div className="approach-watermark" aria-hidden="true">
        BETTER
        <br />
        <i>TOGETHER.</i>
      </div>
      <div className="approach-copy">
        <p className="eyebrow">
          <span className="status-dot" /> TWO PERSPECTIVES. ONE EXPERIENCE.
        </p>
        <h2 id="approach-title">
          <span>좋은 질문을 나누고,</span>
          <br />
          <span>
            하나의 경험을 만듭니다<i>.</i>
          </span>
        </h2>
        <p>
          기획은 방향을 찾고, 디자인은 가능성을 구체화합니다.
          <br />
          루트포는 처음부터 끝까지 함께 고민하며
          <br />
          서비스에 꼭 필요한 답을 찾아갑니다.
        </p>
      </div>
      <div className="approach-visual" aria-hidden="true">
        <div className="strategy-paper">
          <div className="paper-top">
            <span>ROOTFO / WORKING DOCUMENT</span>
            <span>↗</span>
          </div>
          <small>FROM THE RIGHT QUESTION</small>
          <strong>
            {process[step].word}
            <span>?</span>
          </strong>
          <div className="paper-flow">
            <span className={step === 0 ? "selected" : ""}>문제</span>
            <i />
            <span className={step === 1 ? "selected" : ""}>구조</span>
            <i />
            <span className={step === 2 ? "selected" : ""}>경험</span>
          </div>
          <p>{process[step].label}</p>
          <div className="paper-foot">
            <span>THINK → MAKE → REFINE</span>
            <span>0{step + 1}</span>
          </div>
        </div>
        <div className="wire-paper">
          <div className="wire-nav">
            <b>rootfo.</b>
            <span>— —</span>
          </div>
          <div className="wire-title" />
          <div className="wire-title short" />
          <div className="wire-image">
            <span>
              DESIGN
              <br />
              WITH PURPOSE.
            </span>
            <i>↗</i>
          </div>
          <div className="wire-columns">
            <i />
            <i />
            <i />
          </div>
          <span className="wire-annotation">
            맥락에서 시작해, 경험으로 연결.
          </span>
        </div>
        <span className="connecting-mark">✳︎</span>
      </div>
      <div className="approach-process" aria-label="루트포의 작업 과정">
        {process.map((item, i) => (
          <button
            key={item.en}
            className={step === i ? "is-selected" : ""}
            onPointerEnter={() => setStep(i)}
            onFocus={() => setStep(i)}
            onClick={() => setStep(i)}
            aria-pressed={step === i}
          >
            <span className="process-index">
              0{i + 1}
              <span>↗</span>
            </span>
            <h3>{item.en}</h3>
            <span className="process-ko">{item.ko}</span>
            <p>
              {step === i
                ? item.text
                : [
                    "사용자와 비즈니스의 맥락을 읽습니다.",
                    "복잡함을 정리하고 흐름을 만듭니다.",
                    "명확한 구조를 감각적인 경험으로.",
                    "직접 사용하고, 더 나은 답을 찾습니다.",
                  ][i]}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
export function LabScene({ onOpen }) {
  return (
    <section
      id="lab"
      className="story-section lab-scene"
      aria-labelledby="lab-title"
    >
      <div className="story-kicker">
        <span>03 / LAB & NOTES</span>
        <span>예시 콘텐츠 · EXPLORATIONS</span>
      </div>
      <div className="lab-heading">
        <p className="eyebrow">A LITTLE EXPERIMENT. A NEW PERSPECTIVE.</p>
        <h2 id="lab-title">
          다음의 경험을 위한
          <br />
          <i>작은 탐구.</i>
        </h2>
        <p>
          새로운 도구를 이해하고, 익숙한 방식에 질문합니다.
          <br />
          고객 프로젝트와 구분되는 루트포의 실험 노트입니다.
        </p>
      </div>
      <div className="lab-watermark" aria-hidden="true">
        Curiosity
        <br />
        in progress.
      </div>
      <div className="lab-papers">
        {notes.map((note, i) => (
          <button
            key={note.tag}
            className={`lab-paper lab-paper-${i}`}
            onClick={() => onOpen(note)}
          >
            <div className="lab-paper-top">
              <span>ROOTFO NOTES / 0{i + 1}</span>
              <span>↗</span>
            </div>
            <div className={`lab-visual lab-visual-${i}`} aria-hidden="true">
              {i === 0 ? (
                <>
                  <span>Human</span>
                  <i>↔</i>
                  <b>AI</b>
                  <small>
                    TOOLS CHANGE.
                    <br />
                    JUDGEMENT MATTERS.
                  </small>
                </>
              ) : i === 1 ? (
                <>
                  <i />
                  <i />
                  <i />
                  <span>
                    Motion
                    <br />
                    makes meaning.
                  </span>
                </>
              ) : (
                <>
                  <span>
                    What
                    <br />
                    if<span>?</span>
                  </span>
                  <small>ASK BETTER QUESTIONS.</small>
                </>
              )}
            </div>
            <div className="lab-paper-copy">
              <span>{note.tag} · 예시 콘텐츠</span>
              <h3>{note.title}</h3>
              <p>{note.text}</p>
            </div>
            <div className="lab-paper-bottom">
              <span>READ NOTE</span>
              <span>↗</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
export function ContactScene({ onContact, contact, contactContent, onTop }) {
  return (
    <section
      id="contact"
      className="story-section contact-scene"
      aria-labelledby="contact-title"
    >
      <div className="story-kicker">
        <span>04 / START A CONVERSATION</span>
        <span>기획 · UX · UI · DIGITAL EXPERIENCE</span>
      </div>
      <div className="contact-watermark" aria-hidden="true">
        HELLO.
      </div>
      <div className="contact-orbit" aria-hidden="true">
        <div />
        <span>R</span>
        <i>↗</i>
      </div>
      <div className="contact-copy">
        <p className="eyebrow">
          EVERY GOOD PROJECT STARTS WITH A CONVERSATION.
        </p>
        <h2 id="contact-title">
          다음의 경험,
          <br />
          함께 만들까요<span>?</span>
        </h2>
        <p>
          만들고 싶은 서비스나 현재 고민을 알려주세요.
          <br />
          막연한 아이디어도, 구체적인 과제도 좋습니다.
        </p>
        <button className="inquiry-button" onClick={onContact}>
          프로젝트 이야기하기 <span>↗</span>
        </button>
        <small>현재는 문의 전송 기능이 없는 프로토타입입니다.</small>
      </div>
      {contact && (
        <div className="contact-content-popover">{contactContent}</div>
      )}
      <div className="contact-signature">
        <a
          href="#work"
          onClick={(e) => {
            e.preventDefault();
            onTop();
          }}
          className="logo"
        >
          ROOTFO<span className="logo-mark">✳</span>
        </a>
        <span>기획과 디자인으로, 더 나은 경험을.</span>
        <span>© {new Date().getFullYear()} ROOTFO</span>
      </div>
    </section>
  );
}
