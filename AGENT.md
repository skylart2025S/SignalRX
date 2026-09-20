AGENTS.md

Project: Impiricus Peer

Build a polished hackathon MVP for Impiricus Peer, an AI-powered peer-to-peer engagement platform for healthcare professionals (HCPs).

The core concept:

An HCP asks a practice-related question. AI understands the question, identifies the most relevant verified/synthetic peer HCPs, retrieves their experiences, and synthesizes those responses into a transparent “Network Summary.”

This is not an AI doctor and must not provide patient-specific medical recommendations. The MVP is specifically about sharing and synthesizing peer experiences.

⸻

1. Product Goal

Build a working vertical slice demonstrating:

HCP asks question
       ↓
AI understands question
       ↓
Relevant HCP peers identified
       ↓
Peer responses retrieved
       ↓
AI synthesizes responses
       ↓
HCP sees transparent Network Summary
       ↓
HCP can inspect individual peer responses

The application should feel like a real healthcare product, not a generic AI chatbot.

The primary demo flow should take approximately 60–90 seconds.

⸻

2. Primary User Story

The demo user is an HCP.

They enter:

“How are other cardiologists handling patients who are struggling to get Therapy X covered?”

The application should:

1. Analyze the question.
2. Extract:
    * specialty
    * topic
    * therapy
    * intent
    * relevant keywords
3. Identify relevant HCP peers.
4. Show that peers are being contacted / searched.
5. Retrieve synthetic peer responses.
6. Have the AI synthesize the responses.
7. Display:
    * number of respondents
    * common themes
    * differing approaches
    * notable disagreement
    * individual responses
8. Allow the user to inspect the source responses behind the synthesis.
9. Offer a follow-up action such as:
    * “Ask a follow-up”
    * “Find someone with a similar practice”

⸻

3. Important Product Boundary

The application must not present itself as a clinical decision-making system.

Do NOT generate:

* patient-specific diagnoses
* patient-specific treatment recommendations
* dosage recommendations
* emergency medical advice
* claims that peer experience constitutes medical evidence

The product should instead use language such as:

“What peers reported”

“Common approaches reported by respondents”

“Peer experiences”

“Reported by 4 of 7 respondents”

Every AI-generated synthesis should be traceable back to underlying peer responses.

Include a small disclaimer:

Peer experiences are informational and should not be interpreted as clinical recommendations. Always use professional clinical judgment and applicable evidence/guidelines.

⸻

4. Technology Stack

Use a simple modern stack.

Preferred:

* Next.js
* TypeScript
* React
* Tailwind CSS
* shadcn/ui if useful
* PostgreSQL
* pgvector if available
* OpenAI-compatible LLM API
* OpenAI embeddings or another embedding API

Do NOT overengineer.

Avoid:

* microservices
* Kubernetes
* complex authentication
* complicated infrastructure
* unnecessary queues
* unnecessary external integrations

The goal is a polished hackathon MVP.

⸻

5. Repository Structure

Use a clean structure similar to:

/
├── app/
│   ├── page.tsx
│   ├── api/
│   │   ├── ask/
│   │   │   └── route.ts
│   │   ├── peers/
│   │   │   └── route.ts
│   │   └── synthesize/
│   │       └── route.ts
│   ├── components/
│   │   ├── AskNetwork.tsx
│   │   ├── AgentProgress.tsx
│   │   ├── PeerResults.tsx
│   │   ├── NetworkSummary.tsx
│   │   ├── PeerResponse.tsx
│   │   └── Disclaimer.tsx
│   └── globals.css
│
├── lib/
│   ├── ai.ts
│   ├── embeddings.ts
│   ├── peer-matching.ts
│   ├── synthesis.ts
│   └── safety.ts
│
├── data/
│   ├── hcps.json
│   └── responses.json
│
├── scripts/
│   └── seed.ts
│
├── public/
│
├── .env.example
├── README.md
└── AGENTS.md

Adapt the structure if the existing repository has an established architecture.

Do not unnecessarily rewrite existing infrastructure.

⸻

6. Synthetic HCP Dataset

For the MVP, use synthetic HCP data.

Never imply that fictional HCPs are real people.

Create approximately 50–100 synthetic HCP profiles.

Each profile should contain:

type HCP = {
  id: string;
  name: string;
  specialty: string;
  practiceType: string;
  location: string;
  yearsExperience: number;
  expertise: string[];
  bio: string;
};

Example:

{
  "id": "hcp_001",
  "name": "Dr. Sarah Patel",
  "specialty": "Cardiology",
  "practiceType": "Community Practice",
  "location": "Virginia",
  "yearsExperience": 14,
  "expertise": [
    "heart failure",
    "patient access",
    "prior authorization",
    "Therapy X"
  ],
  "bio": "Cardiologist with experience managing heart failure patients in a community practice."
}

Use clearly fictional names.

Include several specialties:

* Cardiology
* Oncology
* Dermatology
* Endocrinology
* Neurology

Include different practice types:

* Academic
* Community
* Private practice
* Hospital system

⸻

7. Synthetic Peer Responses

Create realistic but clearly synthetic responses.

Each response should contain:

type PeerResponse = {
  id: string;
  questionId: string;
  hcpId: string;
  response: string;
  topics: string[];
};

For the main demo question, create 6–10 responses with:

* overlapping themes
* different approaches
* at least one disagreement
* different practice settings

This is important.

Do NOT make every HCP say the same thing.

The AI should have something meaningful to synthesize.

⸻

8. AI Question Analysis

When the HCP submits a question, send it to the LLM.

Return structured JSON:

type QuestionAnalysis = {
  specialty: string;
  topic: string;
  therapy?: string;
  intent: string;
  keywords: string[];
};

Example:

Input:

“How are other cardiologists handling patients who are struggling to get Therapy X covered?”

Output:

{
  "specialty": "Cardiology",
  "topic": "Patient access",
  "therapy": "Therapy X",
  "intent": "Peer experience",
  "keywords": [
    "coverage",
    "prior authorization",
    "patient access"
  ]
}

Use structured outputs if supported by the model API.

Do not parse fragile free-form prose if structured output is available.

⸻

9. Peer Matching

Build a peer matching system.

The ideal implementation uses embeddings.

Process

1. Create a text representation of each HCP:

Cardiologist.
Community practice.
Expertise in heart failure, Therapy X,
patient access and prior authorization.

2. Generate embeddings.
3. Embed the user’s question.
4. Calculate similarity.
5. Filter by specialty when appropriate.
6. Return the top 5–10 relevant peers.

If vector infrastructure is unavailable, implement a deterministic fallback using:

* specialty match
* keyword overlap
* expertise overlap
* practice type

The application must still work without embeddings.

⸻

10. Agent Architecture

Create a simple agent orchestration layer.

Conceptually:

PeerAgent
│
├── analyzeQuestion()
│
├── findRelevantPeers()
│
├── retrieveResponses()
│
├── analyzeThemes()
│
├── detectDisagreement()
│
├── generateSummary()
│
└── recommendFollowup()

The agent should NOT blindly ask the LLM to perform the entire workflow.

Use deterministic application code for:

* database retrieval
* filtering
* ranking
* counting
* source attribution

Use the LLM for:

* natural-language understanding
* semantic classification
* theme extraction
* synthesis
* concise explanation

⸻

11. AI Synthesis

Given peer responses, generate:

type NetworkSummary = {
  respondentCount: number;
  commonThemes: {
    theme: string;
    count: number;
    description: string;
    sourceResponseIds: string[];
  }[];
  differentApproaches: {
    description: string;
    sourceResponseIds: string[];
  }[];
  notableDisagreement?: {
    description: string;
    sourceResponseIds: string[];
  };
  overallSummary: string;
};

CRITICAL:

The LLM must not invent statistics.

If 4 out of 7 responses mention something, calculate that count in application code whenever possible.

The AI should summarize the actual retrieved responses.

⸻

12. Source Attribution

Every AI-generated claim should be traceable.

Example:

Common approach

4 of 7 respondents mentioned providing additional clinical documentation.

[View responses]

Clicking “View responses” should reveal the relevant peer responses.

This is a major product feature.

Do not produce a black-box AI answer.

⸻

13. Main UI

The main page should be extremely polished.

Use a professional healthcare SaaS aesthetic.

Avoid:

* excessive gradients
* cartoonish illustrations
* generic AI robot graphics
* giant “AI” text
* excessive animations

Prioritize:

* whitespace
* clear typography
* cards
* subtle borders
* readable data
* professional navigation

Suggested layout:

┌──────────────────────────────────────────────────┐
│ IMPIRICUS PEER                         HCP Portal │
├──────────────────────────────────────────────────┤
│                                                  │
│ Ask the network                                  │
│                                                  │
│ ┌──────────────────────────────────────────────┐ │
│ │ How are other cardiologists handling...    │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│               [ Ask the Network ]                │
│                                                  │
└──────────────────────────────────────────────────┘

⸻

14. Agent Progress UI

After submitting a question, don’t immediately show the answer.

Show the agent working.

Example:

Analyzing your question                     ✓
Finding relevant HCPs                       ✓
6 relevant peers identified                 ✓
Reviewing peer responses                    ✓
Synthesizing network insights               ✓

This makes the agentic nature obvious during the demo.

Use subtle animation.

⸻

15. Network Summary UI

Example:

NETWORK SUMMARY
7 cardiologists responded
──────────────────────────────────────────
COMMON THEMES
4 / 7
Additional documentation
3 / 7
Practice access teams
──────────────────────────────────────────
DIFFERENT EXPERIENCES
Academic practices reported different
experiences from community practices.
──────────────────────────────────────────
NOTABLE DISAGREEMENT
Two respondents reported that additional
documentation did not materially change
their experience.
──────────────────────────────────────────
[ View all responses ]

Make the respondent count prominent.

⸻

16. Peer Response Cards

Each response should show:

Dr. Sarah Patel
Cardiology · Community Practice
"At our practice, we've found..."
Relevant experience:
Patient access · Therapy X
[ Ask a follow-up ]

For the MVP, clearly label synthetic/demo HCPs somewhere appropriate.

⸻

17. “Find Someone Like Me”

Add a button:

Find someone like me

When clicked, identify an HCP whose:

* specialty
* practice type
* expertise
* location

most closely resembles the current user.

Display:

A peer with a similar practice
Dr. Sarah Patel
Cardiology
Community Practice
14 years experience
Relevant expertise:
Heart failure
Patient access
Therapy X
[ Ask a follow-up ]

This demonstrates the long-term network potential.

⸻

18. Safety Layer

Before processing a question, classify whether it is:

type SafetyCategory =
  | "peer_experience"
  | "general_education"
  | "patient_specific"
  | "emergency"
  | "unsafe";

For normal peer-experience questions:

Proceed.

For patient-specific medical recommendations:

Do not generate treatment advice.

Instead display:

This question appears to involve a patient-specific clinical decision. Impiricus Peer is designed to share peer experiences, not provide patient-specific medical recommendations.

Then optionally allow the HCP to reformulate the question around general professional experience.

⸻

19. Demo Question

Seed the application around this question:

“How are other cardiologists handling patients who are struggling to get Therapy X covered?”

Make sure the complete demo works perfectly with this question before adding other questions.

The demo should show:

1. Question
2. AI analysis
3. Peer matching
4. 6–8 synthetic responses
5. AI synthesis
6. Source attribution
7. Follow-up

⸻

20. Secondary Demo Questions

Add 2–3 additional questions to demonstrate that the product isn’t hardcoded.

Examples:

“What approaches are other oncologists using when patients struggle with treatment adherence?”

“How are dermatologists handling access barriers for patients starting Therapy X?”

“What are endocrinologists seeing as the biggest barriers to initiating Therapy X?”

The same pipeline should work.

⸻

21. Do NOT Hardcode the Final Answer

The demo dataset can be seeded.

However, the AI synthesis must actually be generated dynamically from retrieved responses.

Do NOT simply display a prewritten summary after the user clicks the button.

The judge should be able to change the question and see the system respond differently.

⸻

22. Loading and Error States

Implement:

* empty question state
* loading state
* AI failure state
* no relevant peers state
* no responses state

If the LLM API is unavailable, the application should gracefully fall back to deterministic/demo behavior so the presentation cannot completely fail.

⸻

23. Environment Variables

Create .env.example.

Expected values may include:

OPENAI_API_KEY=
DATABASE_URL=

Never commit real API keys.

Never expose API keys to the client.

⸻

24. Privacy

Because this is a healthcare concept:

* Do not use real patient data.
* Do not use real HCP personal data unless explicitly provided/authorized.
* Use synthetic HCPs for the MVP.
* Do not store patient information.
* Do not ask the user to enter PHI.

Add a note in the README:

This prototype uses synthetic HCP and response data and is not intended for production clinical use.

⸻

25. Performance

The primary interaction should feel fast.

Target:

* Question analysis: <3 seconds
* Peer matching: <1 second
* Response retrieval: <1 second
* Synthesis: <5 seconds

Use parallel operations where possible.

For example:

const [analysis, ...] = await Promise.all(...)

Do not unnecessarily call the LLM multiple times when one structured call can accomplish the task.

⸻

26. Hackathon Polish

Prioritize these features in this order:

P0 — MUST HAVE

* polished landing/question UI
* question analysis
* peer matching
* synthetic peer database
* peer responses
* AI synthesis
* source attribution
* loading/agent progress

P1 — SHOULD HAVE

* Find Someone Like Me
* follow-up questions
* multiple specialties
* safety classification
* response filtering

P2 — NICE TO HAVE

* authentication
* notifications
* real-time responses
* analytics dashboard
* HCP reputation
* persistent conversations

Do NOT spend time on P2 until P0 is excellent.

⸻

27. Demo Narrative

The application should support this exact story:

Problem

HCPs frequently encounter real-world practice questions where the most useful insight may come from other HCPs who have faced the same situation.

Solution

Impiricus Peer creates an intelligent HCP-to-HCP knowledge network.

Demo

Dr. Martinez asks:

“How are other cardiologists handling patients who are struggling to get Therapy X covered?”

AI:

Analyzing question ✓
Finding relevant peers ✓
6 peers identified ✓
Analyzing responses ✓

Then:

7 cardiologists responded

The system shows:

* common themes
* different approaches
* disagreement
* source responses

Then:

Find someone with a similar practice

The system identifies a highly relevant peer.

Closing

Impiricus already enables pharma-to-HCP engagement.

Impiricus Peer adds a new dimension:

HCP-to-HCP engagement.

The more verified HCPs participate, the more valuable the network becomes.

⸻

28. Definition of Done

The project is complete when a fresh user can:

1. Open the app.
2. Enter an HCP question.
3. Submit it.
4. Watch the agent analyze the question.
5. See relevant peers identified.
6. See peer responses retrieved.
7. See an AI-generated network summary.
8. Verify claims against individual responses.
9. Find a similar peer.
10. Ask a follow-up question.
11. Complete the entire flow without encountering errors.

The application should be demo-ready before adding additional features.

⸻

29. First Task

Before writing significant code:

1. Inspect the existing repository.
2. Determine the existing framework and architecture.
3. Reuse existing dependencies and components where appropriate.
4. Identify what is already implemented.
5. Create a concise implementation plan.
6. Then implement P0 features end-to-end.

Do not ask for confirmation for routine implementation decisions.

If a reasonable technical choice is ambiguous, choose the simplest option that keeps the MVP maintainable.

The objective is a working, polished hackathon demo, not a production healthcare platform.
