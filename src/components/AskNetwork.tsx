"use client";

import { useRef, useState } from "react";
import Icon from "./Icon";

export const prompts = [
  {
    specialty: "Cardiology",
    topic: "Tracking heart failure symptoms",
    question:
      "How are cardiologists helping patients track heart failure symptoms between follow-up visits?",
    color: "rose",
  },
  {
    specialty: "Oncology",
    topic: "Understanding cancer-related fatigue",
    question:
      "How are oncologists discussing fatigue and its effect on daily life with patients receiving chemotherapy?",
    color: "purple",
  },
  {
    specialty: "Dermatology",
    topic: "Understanding eczema flare-ups",
    question:
      "How are dermatologists helping patients track eczema flare-ups and understand their skin-care routines?",
    color: "gold",
  },
];

export default function AskNetwork({
  onSubmit,
  busy,
  initialQuestion = "",
}: {
  onSubmit: (question: string) => Promise<void>;
  busy: boolean;
  initialQuestion?: string;
}) {
  const [question, setQuestion] = useState(initialQuestion);
  const input = useRef<HTMLTextAreaElement>(null);
  const submit = () => {
    if (question.trim() && !busy) void onSubmit(question.trim());
  };
  return (
    <div className="composer-section" id="ask">
      <form
        className={`composer ${busy ? "is-busy" : ""}`}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="composer-heading">
          <span className="eyebrow">
            <Icon name="spark" /> A little curiosity. A collective perspective.
          </span>
          <span className="subtle-tag">PEER INTELLIGENCE</span>
        </div>
        <label className="sr-only" htmlFor="question">
          Your question for the network
        </label>
        <textarea
          ref={input}
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={busy}
          maxLength={2000}
          placeholder="What would you like to ask your peers?"
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
        />
        <div className="composer-bottom">
          <span className="privacy-note">
            <Icon name="shield" /> Keep it professional. Leave out patient
            details.
          </span>
          <button
            className="primary-button"
            disabled={busy || !question.trim()}
            type="submit"
          >
            {busy ? "Exploring the network" : "Ask the network"}
            <Icon
              name={busy ? "spark" : "arrow"}
              className={busy ? "spin" : ""}
            />
          </button>
        </div>
      </form>
      <div className="suggestion-heading">
        <span>GOOD QUESTIONS START GREAT CONVERSATIONS</span>
        <span>
          Try a starting point <span aria-hidden="true">↴</span>
        </span>
      </div>
      <div className="suggestion-grid">
        {prompts.map((prompt) => (
          <button
            type="button"
            disabled={busy}
            key={prompt.specialty}
            className="suggestion-card"
            onClick={() => {
              setQuestion(prompt.question);
              input.current?.focus();
            }}
          >
            <span className={`topic-icon ${prompt.color}`}>
              <Icon
                name={
                  prompt.specialty === "Cardiology"
                    ? "heart"
                    : prompt.specialty === "Oncology"
                      ? "spark"
                      : "plus"
                }
              />
            </span>
            <span className="suggestion-copy">
              <small>{prompt.specialty}</small>
              <strong>{prompt.topic}</strong>
            </span>
            <Icon name="chevron" />
          </button>
        ))}
      </div>
    </div>
  );
}
