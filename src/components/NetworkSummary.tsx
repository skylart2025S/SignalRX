import type { NetworkSummary as Summary } from "@/lib/ai";
import Icon from "./Icon";

export default function NetworkSummary({
  summary,
  onSources,
}: {
  summary: Summary;
  onSources: (ids: string[]) => void;
}) {
  const sources = (ids: string[]) =>
    ids?.length > 0 && (
      <button className="source-button" onClick={() => onSources(ids)}>
        <Icon name="book" /> View {ids.length} source
        {ids.length === 1 ? "" : "s"}
        <Icon name="arrow" />
      </button>
    );
  return (
    <section className="summary-card">
      <div className="summary-header">
        <div>
          <span className="eyebrow">
            <Icon name="spark" /> YOUR NETWORK SUMMARY
          </span>
          <h2>A collective perspective.</h2>
        </div>
        <div className="respondent-count">
          <strong>{summary.respondentCount}</strong>
          <span>peer responses</span>
        </div>
      </div>
      {summary.overallSummary && (
        <p className="summary-intro">{summary.overallSummary}</p>
      )}
      {summary.commonThemes.length > 0 && (
        <div className="summary-section">
          <h3>What peers have in common</h3>
          <div className="theme-grid">
            {summary.commonThemes.map((theme, i) => (
              <article className="theme-card" key={i}>
                <div className="theme-top">
                  <span className="theme-number">0{i + 1}</span>
                  <span>
                    <strong>{theme.count}</strong> / {summary.respondentCount}{" "}
                    peers
                  </span>
                </div>
                <h4>{theme.theme}</h4>
                <div className="theme-meter">
                  <span
                    style={{
                      width: `${Math.min(100, (theme.count / Math.max(1, summary.respondentCount)) * 100)}%`,
                    }}
                  />
                </div>
                <p>{theme.description}</p>
                {sources(theme.sourceResponseIds)}
              </article>
            ))}
          </div>
        </div>
      )}
      {summary.differentApproaches.length > 0 && (
        <div className="summary-section">
          <h3>Different experiences, different approaches</h3>
          {summary.differentApproaches.map((approach, i) => (
            <div className="approach" key={i}>
              <p>{approach.description}</p>
              {sources(approach.sourceResponseIds)}
            </div>
          ))}
        </div>
      )}
      {summary.notableDisagreement && (
        <div className="disagreement">
          <span className="eyebrow">ROOM FOR A DIFFERENT PERSPECTIVE</span>
          <h3>Where experiences diverge</h3>
          <p>{summary.notableDisagreement.description}</p>
          {sources(summary.notableDisagreement.sourceResponseIds)}
        </div>
      )}
      <div className="summary-footer">
        <span>
          <Icon name="shield" /> Synthesized from demo peer experiences
        </span>
        <button className="text-button" onClick={() => onSources([])}>
          Explore all responses <Icon name="arrow" />
        </button>
      </div>
    </section>
  );
}
