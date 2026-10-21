import React from "react";

export default function DetailBody({ item, heading = "h2" }) {
  const Heading = heading;
  const ScopeHeading = heading === "h1" ? "h2" : "h3";
  return (
    <>
      <p className="eyebrow">
        {item.id ? "구성 예시 · CONCEPT PROJECT" : "예시 콘텐츠 · LAB / NOTES"}
      </p>
      <Heading id="detail-title">{item.name || item.title}</Heading>
      {item.id ? (
        <>
          <p className="modal-desc">{item.description}</p>
          <img
            className="detail-image"
            src={`/projects/${item.id}.svg`}
            width={item.imageSize?.width || 1600}
            height={item.imageSize?.height || 1100}
            alt={`${item.brand} UI 디자인 목업`}
          />
          <div className="detail-columns">
            <ScopeHeading>우리가 설계한 범위</ScopeHeading>
            <div>
              <p>
                아래는 본 프로토타입에서 제안하는 작업 범위 예시입니다. 실제
                고객 프로젝트나 수행 실적이 아닙니다.
              </p>
              {item.work.map((text, i) => (
                <p className="scope-line" key={text}>
                  <span>0{i + 1}</span>
                  {text}
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
          <p className="article-paragraph">
            이 글은 Root4의 탐구 방향을 보여주는 예시 콘텐츠입니다. 실험 결과나
            실제 수행 사례로 제시되지 않습니다.
          </p>
          <p className="article-paragraph">
            질문을 정리하고, 작은 프로토타입을 만들고, 사람의 관점에서 다시
            검토합니다. 도구보다 중요한 것은 경험을 이해하는 일이라고
            생각합니다.
          </p>
        </>
      )}
    </>
  );
}
