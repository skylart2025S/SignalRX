export type SafetyCategory =
  | "peer_experience"
  | "general_education"
  | "patient_specific"
  | "emergency"
  | "unsafe";

/**
 * Classify the user's question into a safety category.
 * This is a simple rule-based implementation for the MVP.
 */
export function classifySafety(question: string): SafetyCategory {
  const lower = question.toLowerCase();

  // Emergency keywords
  const emergencyKeywords = [
    "emergency",
    "urgent",
    "immediately",
    "life-threatening",
    "critical",
    "code blue",
    "cardiac arrest",
    "stroke",
    "overdose",
    "suicide",
  ];
  if (emergencyKeywords.some((kw) => lower.includes(kw))) {
    return "emergency";
  }

  // Unsafe keywords (e.g., asking for dosage, specific treatment for a named patient)
  const unsafePatterns = [
    /what dosage/i,
    /how much/i,
    /what strength/i,
    /prescribe/i,
    /recommend/i,
    /should i/i,
    /would you/i,
    /patient named/i,
    /patient.*\b\d{2}\/\d{2}\/\d{4}\b/i, // date-like pattern
    /mr\.|mrs\.|ms\.|dr\./i, // title with name pattern
  ];
  if (unsafePatterns.some((re) => re.test(question))) {
    return "unsafe";
  }

  // Patient-specific indicators: mentioning specific patient details, conditions, or history
  const patientSpecificKeywords = [
    "my patient",
    "the patient",
    "a patient with",
    "patient history",
    "patient presents",
    "patient reports",
    "patient complains",
    "patient has been",
    "patient is taking",
    "patient allergic",
    "patient failed",
    "patient unresponsive",
  ];
  if (patientSpecificKeywords.some((kw) => lower.includes(kw))) {
    return "patient_specific";
  }

  // General education: asking about guidelines, mechanisms, etc.
  const generalEducationKeywords = [
    "guideline",
    "guideline",
    "recommendation",
    "study",
    "research",
    "mechanism",
    "pathophysiology",
    "why does",
    "how does",
    "what is the difference between",
    "compare",
    "versus",
    "vs",
  ];
  if (generalEducationKeywords.some((kw) => lower.includes(kw))) {
    return "general_education";
  }

  // Default to peer experience for other questions
  return "peer_experience";
}

/**
 * Returns a message to display if the question is not appropriate for peer experience sharing.
 */
export function getSafetyMessage(category: SafetyCategory): string {
  switch (category) {
    case "patient_specific":
      return "This question appears to involve a patient-specific clinical decision. SignalRx is designed to share peer experiences, not provide patient-specific medical recommendations. Please consider reformulating your question to ask about general professional experience or peer approaches.";
    case "emergency":
      return "This question appears to be an emergency situation. SignalRx is not designed for emergency medical advice. Please seek immediate assistance through appropriate emergency channels.";
    case "unsafe":
      return "This question requests specific medical advice that may be unsafe to answer without a full patient evaluation. SignalRx is designed for sharing peer experiences, not for providing individualized medical recommendations.";
    case "general_education":
      return "This question seeks general medical education rather than peer experience. While SignalRx focuses on peer-to-peer sharing of practical experience, you may want to consult medical literature or guidelines for educational questions.";
    default:
      return ""; // peer_experience, no message
  }
}
