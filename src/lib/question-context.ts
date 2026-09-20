import type { QuestionAnalysis } from "./ai";

export const asksAboutCosts = (question: string) =>
  /\b(insurance|coverage|covered|costs?|afford\w*|reimbursement|prior authori[sz]ation|financial|billing|copay\w*|claims?|formulary|formularies)\b/i.test(
    question,
  );

export function analyzeLocally(question: string): QuestionAnalysis {
  const specialties: [RegExp, string][] = [
    [/cardiolog|heart failure|hypertension|arrhythmia/i, "Cardiology"],
    [/oncolog|cancer|chemotherapy/i, "Oncology"],
    [/dermatolog|eczema|psoriasis|acne/i, "Dermatology"],
    [/endocrinolog|diabet|thyroid/i, "Endocrinology"],
    [/neurolog|migraine|epilepsy|parkinson/i, "Neurology"],
  ];
  const topics: [RegExp, string][] = [
    [/fatigue/i, "Fatigue and daily functioning"],
    [/eczema|psoriasis|flare/i, "Skin symptoms and flare tracking"],
    [/side effects?|adverse|tolerab/i, "Treatment tolerability"],
    [/adherence|missed doses?|taking medication/i, "Treatment adherence"],
    [/symptom|monitor|tracking/i, "Symptom monitoring"],
    [/follow.up|discharge/i, "Follow-up and continuity of care"],
    [/quality of life|daily activit/i, "Quality of life"],
    [/educat|understand|counsel/i, "Patient education"],
  ];
  const stopWords = new Set([
    "how",
    "what",
    "are",
    "other",
    "the",
    "and",
    "for",
    "with",
    "their",
    "patients",
    "peers",
    "handling",
    "using",
    "about",
    "who",
    "when",
    "does",
  ]);
  const keywords = [
    ...new Set(
      (question.toLowerCase().match(/\b[a-z][a-z-]{2,}\b/g) || []).filter(
        (word) => !stopWords.has(word),
      ),
    ),
  ].slice(0, 14);
  return {
    specialty:
      specialties.find(([pattern]) => pattern.test(question))?.[1] ||
      "General practice",
    topic:
      topics.find(([pattern]) => pattern.test(question))?.[1] ||
      (asksAboutCosts(question)
        ? "Coverage and affordability"
        : "Health and care experiences"),
    therapy: question.match(/\bTherapy\s+[A-Z]\b/)?.[0],
    intent: "Peer experience",
    keywords,
  };
}
