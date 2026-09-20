import Icon from "./Icon";
export default function AgentProgress() {
  return (
    <section className="progress-panel reveal" role="status" aria-live="polite">
      <div className="progress-orb">
        <Icon name="network" />
      </div>
      <div>
        <span className="eyebrow">CONNECTING THE DOTS</span>
        <h3>Your question is in good company.</h3>
        <p>Matching relevant experiences and preparing your network summary.</p>
        <div className="progress-track">
          <span />
        </div>
        <span className="progress-caption">
          Question analysis · Peer matching · Response synthesis
        </span>
      </div>
    </section>
  );
}
