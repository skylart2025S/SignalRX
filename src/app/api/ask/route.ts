import { analyzeQuestion, synthesizeResponses } from "@/lib/ai";
import { findRelevantHCPs } from "@/lib/peer-matching";
import { getPeerResponsesForHCPs } from "@/lib/synthesis";
import { classifySafety, getSafetyMessage } from "@/lib/safety";
import { NextResponse } from "next/server";

export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required and must be a string" },
        { status: 400 },
      );
    }

    // Safety check
    const safetyCategory = classifySafety(question);
    if (safetyCategory !== "peer_experience") {
      return NextResponse.json(
        {
          error: getSafetyMessage(safetyCategory),
          safetyCategory,
        },
        { status: 400 },
      );
    }

    const analysis = await analyzeQuestion(question);
    const relevantHcpMatches = await findRelevantHCPs(
      question,
      10,
      analysis.specialty,
    );
    const peerResponses = await getPeerResponsesForHCPs(
      relevantHcpMatches.map((match) => match.hcp),
      question,
      analysis,
    );
    const summary = await synthesizeResponses(
      question,
      [analysis],
      peerResponses,
    );

    return NextResponse.json({
      analysis,
      relevantHcpMatches,
      peerResponses,
      summary,
    });
  } catch (error) {
    console.error("Error in ask API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
