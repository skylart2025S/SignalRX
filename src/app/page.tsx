"use client";

import { useRef, useState } from "react";
import AskNetwork from "@/components/AskNetwork";
import AgentProgress from "@/components/AgentProgress";
import PeerResults from "@/components/PeerResults";
import Icon from "@/components/Icon";
import type { NetworkSummary, QuestionAnalysis } from "@/lib/ai";
import type { HCP } from "@/lib/peer-matching";
import type { PeerResponse } from "@/lib/synthesis";
import profiles from "../../data/hcps.json";

type Result = {
  summary: NetworkSummary;
  analysis: QuestionAnalysis;
  peerResponses: PeerResponse[];
  relevantHcpMatches: { hcp: HCP; similarity: number }[];
};
const specialties = [...new Set(profiles.map((p) => p.specialty))];

function NetworkVisual() {
  return (
    <div className="network-visual" aria-hidden="true">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="orbit orbit-three" />
      <svg className="network-lines" viewBox="0 0 460 330">
        <path d="M230 165 120 75M230 165 350 90M230 165 365 245M230 165 100 235M230 165 230 35M230 165 220 300" />
      </svg>
      <div className="network-core">
        <Icon name="network" />
      </div>
      <span className="network-node node-one">AM</span>
      <span className="network-node node-two">JL</span>
      <span className="network-node node-three">SK</span>
      <span className="network-node node-four">RD</span>
      <span className="network-dot dot-one" />
      <span className="network-dot dot-two" />
      <div className="floating-label">
        <span className="status-dot" /> Individual experience.
        <br />
        <strong>Collective understanding.</strong>
      </div>
      <span className="visual-caption">A NEW DIMENSION OF PEER CONNECTION</span>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<"ask" | "network" | "about">("ask");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const [draft, setDraft] = useState({ question: "", key: 0 });
  const [filter, setFilter] = useState("All specialties");
  const resultsRef = useRef<HTMLDivElement>(null);
  const handleSubmit = async (question: string) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setSubmittedQuestion(question);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
        signal: AbortSignal.timeout(120000),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || "We couldn’t reach the network. Please try again.",
        );
      setResult(data);
      setTimeout(
        () =>
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        100,
      );
    } catch (err) {
      setError(
        err instanceof Error && err.name === "TimeoutError"
          ? "The network is taking longer than expected. Please try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  const followUp = (question: string) => {
    setView("ask");
    setDraft((previous) => ({ question, key: previous.key + 1 }));
    setTimeout(() => {
      document.getElementById("question")?.focus();
      document
        .getElementById("ask")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="sidebar">
        <button
          onClick={() => setView("ask")}
          className="brand"
          aria-label="SignalRx home"
        >
          <span className="brand-symbol">
            <Icon name="network" />
          </span>
          <span className="brand-wordmark">
            Signal<span className="brand-rx">Rx</span>
            <span className="brand-period">.</span>
          </span>
        </button>
        <div className="workspace-label">THE HCP WORKSPACE</div>
        <nav aria-label="Main navigation">
          {(
            [
              { id: "ask", label: "Ask the network", icon: "spark" },
              { id: "network", label: "Explore peers", icon: "network" },
              { id: "about", label: "How it works", icon: "book" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              className={`nav-item ${view === item.id ? "active" : ""}`}
              aria-current={view === item.id ? "page" : undefined}
              onClick={() => setView(item.id)}
            >
              <Icon name={item.icon} />
              {item.label}
              {view === item.id && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="mini-spark">
              <Icon name="spark" />
            </span>
            <h3>Better, together.</h3>
            <p>
              Different experiences.
              <br />
              Shared understanding.
              <br />A stronger network.
            </p>
            <button onClick={() => setView("about")}>
              Meet the idea <Icon name="arrow" />
            </button>
          </div>
          <div className="profile">
            <span className="avatar">DM</span>
            <div>
              <strong>Dr. Martinez</strong>
              <small>Demo workspace</small>
            </div>
            <span className="profile-dot" />
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <Icon name="chevron" />
            <strong>
              {view === "ask"
                ? "Ask the network"
                : view === "network"
                  ? "Explore peers"
                  : "How it works"}
            </strong>
          </div>
          <span className="demo-badge">
            <span />
            Synthetic data demo
          </span>
        </header>
        <main id="main" className="main-content">
          {view === "ask" ? (
            <>
              <section className="hero reveal">
                <div className="hero-copy">
                  <span className="eyebrow">
                    <span className="tiny-line" /> POWERED BY SHARED EXPERIENCE
                  </span>
                  <h1>
                    Big questions.
                    <br />
                    <span>Brighter perspectives.</span>
                  </h1>
                  <p>
                    The experience you’re looking for is out there.
                    <br className="desktop-break" /> Tap into your peers’
                    perspectives, and see the bigger picture.
                  </p>
                  <div className="hero-proof">
                    <div className="avatar-stack">
                      <span>AM</span>
                      <span>JL</span>
                      <span>SK</span>
                      <span>RD</span>
                    </div>
                    <span>
                      Many perspectives. <strong>One connected network.</strong>
                      <small>
                        Explore with synthetic healthcare professionals
                      </small>
                    </span>
                  </div>
                </div>
                <NetworkVisual />
              </section>
              <AskNetwork
                key={draft.key}
                initialQuestion={draft.question}
                onSubmit={handleSubmit}
                busy={busy}
              />
              {busy && <AgentProgress />}
              {error && (
                <div className="error-panel reveal" role="alert">
                  <Icon name="message" />
                  <div>
                    <strong>Let’s give that another look.</strong>
                    <p>{error}</p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => void handleSubmit(submittedQuestion)}
                  >
                    Try again <Icon name="arrow" />
                  </button>
                </div>
              )}
              <div ref={resultsRef} className="results-anchor">
                {result && (
                  <PeerResults
                    summary={result.summary}
                    responses={result.peerResponses}
                    hcps={result.relevantHcpMatches.map((m) => m.hcp)}
                    onFollowUp={followUp}
                    question={submittedQuestion}
                  />
                )}
              </div>
              {!result && !busy && (
                <section className="bottom-overview">
                  <div className="network-stats">
                    <div className="section-heading">
                      <span className="eyebrow">A NETWORK OF PERSPECTIVES</span>
                      <Icon name="network" />
                    </div>
                    <div className="stats-row">
                      <div>
                        <strong>{profiles.length}</strong>
                        <small>Synthetic peer profiles</small>
                      </div>
                      <div>
                        <strong>{specialties.length}</strong>
                        <small>Medical specialties</small>
                      </div>
                      <div>
                        <strong>
                          {new Set(profiles.map((p) => p.practiceType)).size}
                        </strong>
                        <small>Practice settings</small>
                      </div>
                    </div>
                    <div className="stats-footer">
                      <span className="status-dot" /> Built for shared
                      experience, grounded in peer perspectives.
                    </div>
                  </div>
                  <button className="how-card" onClick={() => setView("about")}>
                    <span className="how-icon">
                      <Icon name="book" />
                    </span>
                    <span className="eyebrow">
                      FROM QUESTION TO PERSPECTIVE
                    </span>
                    <h3>
                      Human experience.
                      <br />
                      Intelligently connected.
                    </h3>
                    <p>
                      See how your question becomes a clear,
                      <br />
                      traceable network summary.
                    </p>
                    <span className="text-button">
                      Discover how it works <Icon name="arrow" />
                    </span>
                  </button>
                </section>
              )}
            </>
          ) : view === "network" ? (
            <section className="directory reveal">
              <span className="eyebrow">
                DIFFERENT EXPERIENCES. SHARED CURIOSITY.
              </span>
              <h1>
                Meet the network<span>.</span>
              </h1>
              <p>
                Explore {profiles.length} synthetic healthcare professionals
                across {specialties.length} specialties. All profiles are
                fictional and for demonstration.
              </p>
              <label className="filter-label">
                Explore a specialty{" "}
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option>All specialties</option>
                  {specialties.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <div className="directory-grid">
                {profiles
                  .filter(
                    (p) =>
                      filter === "All specialties" || p.specialty === filter,
                  )
                  .map((p) => (
                    <article className="directory-card" key={p.id}>
                      <span className="avatar">
                        {p.name
                          .replace("Dr. ", "")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <span className="subtle-tag">DEMO PEER</span>
                      <h3>{p.name}</h3>
                      <strong>{p.specialty}</strong>
                      <p>
                        {p.practiceType} · {p.location}
                      </p>
                      <small>{p.yearsExperience} years of experience</small>
                      <div className="tag-list">
                        {p.expertise.slice(0, 3).map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                      <button
                        className="text-button"
                        onClick={() =>
                          followUp(
                            `What are peers in ${p.specialty.toLowerCase()} reporting about ${p.expertise[0]}?`,
                          )
                        }
                      >
                        Ask about this experience <Icon name="arrow" />
                      </button>
                    </article>
                  ))}
              </div>
            </section>
          ) : (
            <section className="about-view reveal">
              <span className="eyebrow">
                THE POWER OF A CONNECTED PERSPECTIVE
              </span>
              <h1>
                Expertise is individual.
                <br />
                <span>Insight is collective.</span>
              </h1>
              <p>
                Bring a professional question. Discover how others approach it.
                Understand the experiences behind every insight.
              </p>
              <div className="how-steps">
                {[
                  {
                    n: "01",
                    icon: "message",
                    title: "Start with your question",
                    text: "Ask about symptoms, treatment experiences, or a care challenge you want to understand. Leave out patient details.",
                  },
                  {
                    n: "02",
                    icon: "network",
                    title: "Find relevant perspectives",
                    text: "Your question helps identify relevant peer profiles and retrieve experiences from the synthetic demo network.",
                  },
                  {
                    n: "03",
                    icon: "spark",
                    title: "See the bigger picture",
                    text: "Explore common themes, different approaches, and disagreements. Open the source responses to see the full context.",
                  },
                ].map((s) => (
                  <article key={s.n}>
                    <span className="step-number">{s.n}</span>
                    <Icon name={s.icon as "message" | "network" | "spark"} />
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </article>
                ))}
              </div>
              <button className="primary-button" onClick={() => setView("ask")}>
                Bring your first question <Icon name="arrow" />
              </button>
              <div className="about-note">
                <Icon name="shield" />
                <p>
                  This prototype uses synthetic profiles and responses. Peer
                  experiences are informational and do not constitute clinical
                  recommendations. Always use professional clinical judgment and
                  applicable evidence and guidelines.
                </p>
              </div>
            </section>
          )}
          <footer className="footer">
            <span>© {new Date().getFullYear()} SignalRx</span>
            <span>
              <Icon name="shield" /> Peer experiences. Not clinical
              recommendations.
            </span>
            <span>Thoughtfully connected.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
