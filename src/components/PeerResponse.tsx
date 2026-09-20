import type { HCP } from "@/lib/peer-matching";
import type { PeerResponse as Response } from "@/lib/synthesis";
import Icon from "./Icon";

export default function PeerResponse({
  response,
  hcp,
  onFollowUp,
}: {
  response: Response;
  hcp: HCP;
  onFollowUp: (question: string) => void;
}) {
  return (
    <article className="peer-card" id={`response-${response.id}`}>
      <div className="peer-heading">
        <span className="avatar">
          {hcp.name
            .replace("Dr. ", "")
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
        <div>
          <h3>{hcp.name}</h3>
          <p>
            {hcp.specialty} · {hcp.practiceType}
          </p>
        </div>
        <span className="subtle-tag">SYNTHETIC PEER</span>
      </div>
      <blockquote>{response.response}</blockquote>
      <div className="tag-list">
        {response.topics.map((topic, i) => (
          <span key={i}>{topic}</span>
        ))}
      </div>
      <div className="peer-footer">
        <span>
          {hcp.location} · {hcp.yearsExperience} years of experience
        </span>
        <button
          className="text-button"
          onClick={() =>
            onFollowUp(
              `What other experiences have ${hcp.specialty.toLowerCase()} peers shared about ${response.topics[0] || "this practice challenge"}?`,
            )
          }
        >
          Ask a follow-up <Icon name="arrow" />
        </button>
      </div>
    </article>
  );
}
