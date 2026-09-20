import {
  analyzeQuestion,
  generatePeerExperiences,
  synthesizeResponses,
  type QuestionAnalysis,
  type NetworkSummary,
} from "./ai";
import { findRelevantHCPs, type HCP } from "./peer-matching";
import { asksAboutCosts } from "./question-context";

export type PeerResponse = {
  id: string;
  questionId: string;
  hcpId: string;
  response: string;
  topics: string[];
};

/** Topic-specific demo examples used when model generation is unavailable. */
export function generateSyntheticResponses(
  hcps: HCP[],
  question: string,
  analysis: QuestionAnalysis,
): PeerResponse[] {
  const context = `For the question “${question}”`;
  const focus = analysis.topic.toLowerCase();
  const examples: { text: string; topics: string[] }[] = asksAboutCosts(
    question,
  )
    ? [
        {
          text: "Our team records the specific coverage barrier and coordinates documentation with the access staff. We keep this administrative work separate from clinical decisions.",
          topics: ["Coverage documentation"],
        },
        {
          text: "We discuss affordability concerns during follow-up and connect people with available support resources. Eligibility and local resources vary.",
          topics: ["Affordability support"],
        },
        {
          text: "We track unresolved coverage questions so patients know which team member to contact. Documentation alone does not resolve every barrier.",
          topics: ["Coverage documentation"],
        },
      ]
    : /adherence|missed doses/i.test(question)
      ? [
          {
            text: "We ask patients to describe their medication routine and where it becomes difficult, rather than assuming that missed doses reflect unwillingness. Those conversations are documented for follow-up.",
            topics: ["Understanding daily routines"],
          },
          {
            text: "Our education sessions use teach-back to understand which parts of the existing care plan are unclear. The discussion stays focused on the concerns patients raise.",
            topics: ["Patient education"],
          },
          {
            text: "We revisit day-to-day routines at follow-up. Some people describe reminders as useful, while others describe concerns that a reminder cannot address.",
            topics: ["Understanding daily routines"],
          },
          {
            text: "Our team invites patients to bring questions about tolerability to their treating clinician. We do not treat missed doses as a reason for automatic treatment changes.",
            topics: ["Treatment concerns"],
          },
        ]
      : /fatigue/i.test(question)
        ? [
            {
              text: "We invite patients to describe how fatigue affects ordinary activities and record that perspective alongside the visit discussion. It gives our team a consistent topic to revisit.",
              topics: ["Fatigue and daily functioning"],
            },
            {
              text: "We use a brief symptom diary to capture when fatigue is most disruptive and what patients want to discuss at follow-up. The diary is a conversation aid, not a diagnosis.",
              topics: ["Symptom tracking"],
            },
            {
              text: "Our follow-up conversations start with changes in daily functioning. A simple severity score does not always capture the experience patients describe.",
              topics: ["Fatigue and daily functioning"],
            },
            {
              text: "Some patients in this example prefer a conversation to a written symptom diary. We record their own words and leave assessment and treatment decisions to the treating team.",
              topics: ["Symptom tracking"],
            },
          ]
        : /eczema|psoriasis|flare/i.test(question)
          ? [
              {
                text: "We invite patients to describe the timing of flares and how skin symptoms affect sleep and daily activities. We document what they report without assuming a particular trigger.",
                topics: ["Flare patterns"],
              },
              {
                text: "We use follow-up conversations to check understanding of the existing skin-care plan and invite questions about symptoms. Teach-back helps identify which instructions need clarification.",
                topics: ["Patient education"],
              },
              {
                text: "We revisit patients’ descriptions of flare patterns over time. A symptom diary can organize the conversation, but an apparent pattern is not proof of a cause.",
                topics: ["Flare patterns"],
              },
              {
                text: "Our team discusses which parts of the existing care plan are hard to fit into daily life. We document questions for the treating clinician rather than proposing automatic changes.",
                topics: ["Patient education"],
              },
            ]
          : [
              {
                text: `We ask patients to describe changes related to ${focus} in their own words and record how daily activities are affected. We revisit those observations at follow-up.`,
                topics: [analysis.topic, "Patient-reported experiences"],
              },
              {
                text: `Our team uses a short check-in focused on ${focus} to collect questions for the treating clinician. We clarify which member of the care team will follow up.`,
                topics: [analysis.topic, "Care coordination"],
              },
              {
                text: `We discuss what patients understand about their existing care plan in relation to ${focus}. Teach-back gives them space to explain uncertainties without adding new treatment instructions.`,
                topics: [analysis.topic, "Patient education"],
              },
              {
                text: `For ${focus}, some people prefer describing their experience in conversation instead of completing a symptom log. We preserve their own priorities in the follow-up notes.`,
                topics: [analysis.topic, "Patient-reported experiences"],
              },
            ];
  const stamp = Date.now();
  return hcps.map((hcp, index) => {
    const example = examples[index % examples.length];
    return {
      id: `resp_${stamp}_${index}`,
      questionId: `question_${stamp}`,
      hcpId: hcp.id,
      response: `${context}, this synthetic ${hcp.specialty.toLowerCase()} peer in a ${hcp.practiceType.toLowerCase()} setting describes the following: ${example.text}`,
      topics: example.topics,
    };
  });
}

export async function getPeerResponsesForHCPs(
  hcps: HCP[],
  question: string,
  analysis: QuestionAnalysis,
): Promise<PeerResponse[]> {
  return (
    (await generatePeerExperiences(question, analysis, hcps)) ??
    generateSyntheticResponses(hcps, question, analysis)
  );
}

export async function synthesizeNetwork(
  question: string,
): Promise<{ analysis: QuestionAnalysis; summary: NetworkSummary }> {
  const analysis = await analyzeQuestion(question);
  const matches = await findRelevantHCPs(question, 10, analysis.specialty);
  const responses = await getPeerResponsesForHCPs(
    matches.map((match) => match.hcp),
    question,
    analysis,
  );
  return {
    analysis,
    summary: await synthesizeResponses(question, [analysis], responses),
  };
}
