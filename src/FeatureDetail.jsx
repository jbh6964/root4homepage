import React, { useState } from "react";
import { motionProfiles } from "./motion";

export default function FeatureDetail({ project, index, autoStep, visible }) {
  const profile = motionProfiles[index % motionProfiles.length];
  const [manual, setManual] = useState(null);
  const [hover, setHover] = useState(null);
  const step = hover ?? manual ?? autoStep;
  return (
    <div className="feature-details" inert={!visible} aria-hidden={!visible}>
      <aside
        className={`feature-insight insight-${profile.kind} insight-${profile.side}`}
        aria-label={`${project.brand} 설계 포인트`}
      >
        <div className="insight-top">
          <span>{profile.tag}</span>
          <span>0{step + 1} / 03</span>
        </div>
        <div className="insight-viewport">
          <img
            key={step}
            src={`/projects/${project.id}.webp`}
            alt=""
            style={{ objectPosition: profile.crops[step] }}
          />
          {profile.kind === "wayve" && (
            <svg
              className="insight-route"
              viewBox="0 0 200 100"
              aria-hidden="true"
            >
              <path
                className="route-base"
                d="M25 80L65 65 95 70 125 35 175 20"
              />
              <path
                className="route-line"
                pathLength="1"
                d="M25 80L65 65 95 70 125 35 175 20"
              />
              <circle cx="25" cy="80" r="4" />
              <circle className="route-destination" cx="175" cy="20" r="4" />
            </svg>
          )}
          {profile.kind === "ondo" && (
            <span className="insight-play" aria-hidden="true">
              ▷
            </span>
          )}
          {profile.kind === "fino" && (
            <span className="insight-finance-label" aria-hidden="true">
              A CLEARER VIEW.
            </span>
          )}
        </div>
        <div key={step} className="insight-copy">
          <p>{profile.title}</p>
          <h3>{project.work[step]}</h3>
        </div>
        <div
          className={`insight-detail-mark mark-${profile.kind}`}
          aria-hidden="true"
        >
          {profile.kind === "form" ? (
            <>
              <i />
              <i />
              <i />
              <span>COLOR / FORM / TEXTURE</span>
            </>
          ) : (
            profile.labels.map((label, i) => (
              <span className={i <= step ? "is-past" : ""} key={label}>
                {label}
                <i />
              </span>
            ))
          )}
        </div>
      </aside>
      <div
        className="project-beats"
        role="group"
        aria-label={`${project.brand} 설계 포인트 선택`}
        onPointerLeave={() => setHover(null)}
      >
        {profile.labels.map((label, i) => (
          <button
            key={label}
            className={step === i ? "is-selected" : ""}
            aria-pressed={step === i}
            aria-label={`${label}: ${project.work[i]}`}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setHover(i);
            }}
            onFocus={(e) => {
              setHover(i);
              e.currentTarget
                .closest(".gallery-stage")
                ?.setAttribute("data-inspecting", "false");
            }}
            onBlur={() => setHover(null)}
            onClick={() => setManual(i)}
          >
            <span>0{i + 1}</span>
            {label}
            <i />
          </button>
        ))}
      </div>
    </div>
  );
}
