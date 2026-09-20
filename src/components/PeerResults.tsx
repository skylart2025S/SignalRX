"use client";
import { useRef, useState } from "react";
import NetworkSummary from "./NetworkSummary";
import PeerResponse from "./PeerResponse";
import Disclaimer from "./Disclaimer";
import Icon from "./Icon";
import type { NetworkSummary as Summary } from "@/lib/ai";
import type { HCP } from "@/lib/peer-matching";
import type { PeerResponse as Response } from "@/lib/synthesis";

export default function PeerResults({
  summary,
  responses,
  hcps,
  onFollowUp,
  question,
}: {
  summary: Summary;
  responses: Response[];
  hcps: HCP[];
  onFollowUp: (question: string) => void;
  question: string;
}) {
  const [sourceIds, setSourceIds] = useState<string[]>([]);
  const responseList = useRef<HTMLDivElement>(null);
  const hcpMap = new Map(hcps.map((hcp) => [hcp.id, hcp]));
  const visible = responses.filter(
    (r) => !sourceIds.length || sourceIds.includes(r.id),
  );
  const showSources = (ids: string[]) => {
    setSourceIds(ids);
    setTimeout(
      () =>
        responseList.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      50,
    );
  };
  if (!responses.length)
    return (
      <section className="empty-state">
        <Icon name="search" />
        <h2>No peer experiences found yet.</h2>
        <p>
          Try a broader practice question or choose one of the suggested
          starting points.
        </p>
        <button className="text-button" onClick={() => onFollowUp(question)}>
          Refine your question <Icon name="arrow" />
        </button>
      </section>
    );
  return (
    <div className="results reveal">
      <div className="question-recap">
        <Icon name="message" />
        <p>{question}</p>
        <span className="complete-badge">
          <Icon name="check" /> Complete
        </span>
      </div>
      <NetworkSummary summary={summary} onSources={showSources} />
      <div className="responses-heading" ref={responseList}>
        <div>
          <span className="eyebrow">THE EXPERIENCES BEHIND THE INSIGHTS</span>
          <h2>
            {sourceIds.length ? "Source responses" : "Meet the perspectives"}{" "}
            <span>{visible.length}</span>
          </h2>
        </div>
        {sourceIds.length > 0 && (
          <button className="text-button" onClick={() => setSourceIds([])}>
            Show all responses <Icon name="close" />
          </button>
        )}
      </div>
      <div className="peer-grid">
        {visible.map((response) => {
          const hcp = hcpMap.get(response.hcpId);
          return (
            hcp && (
              <PeerResponse
                key={response.id}
                response={response}
                hcp={hcp}
                onFollowUp={onFollowUp}
              />
            )
          );
        })}
      </div>
      {visible.length === 0 && (
        <p className="empty-state">
          These sources weren’t included in the returned responses. Choose “Show
          all responses” to explore the available experiences.
        </p>
      )}
      <Disclaimer />
    </div>
  );
}
