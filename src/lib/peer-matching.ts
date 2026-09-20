import {
  getEmbedding,
  cosineSimilarity,
  keywordOverlapSimilarity,
} from "./embeddings";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { analyzeLocally } from "./question-context";

// HCP type from our data
export type HCP = {
  id: string;
  name: string;
  specialty: string;
  practiceType: string;
  location: string;
  yearsExperience: number;
  expertise: string[];
  bio: string;
};

// Cached embeddings for HCPs to avoid recomputing on every request
let hcpEmbeddings: Map<string, number[]> | null = null;
let hcps: HCP[] = [];

// Load HCPs from data file
function loadHCPs(): HCP[] {
  if (hcps.length > 0) return hcps;
  try {
    const dataPath = join(process.cwd(), "data", "hcps.json");
    if (existsSync(dataPath)) {
      const data = readFileSync(dataPath, "utf8");
      hcps = JSON.parse(data);
      console.log(`Loaded ${hcps.length} HCPs from ${dataPath}`);
    } else {
      console.warn("HCPs data file not found, using empty array");
      hcps = [];
    }
  } catch (error) {
    console.error("Error loading HCPs:", error);
    hcps = [];
  }
  return hcps;
}

/**
 * Get or compute embeddings for all HCPs.
 * Returns a map of HCP ID to embedding vector.
 */
async function getHcpEmbeddings(): Promise<Map<string, number[]>> {
  if (hcpEmbeddings) return hcpEmbeddings;

  const hcpList = loadHCPs();
  const embeddingsMap = new Map<string, number[]>();

  // In a production app, we would precompute and store embeddings in a database.
  // For this demo, we compute on first request and cache in memory.
  console.log("Computing embeddings for HCPs...");
  for (const hcp of hcpList) {
    // Create a text representation of the HCP for embedding
    const hcpText = `
      ${hcp.specialty}.
      ${hcp.practiceType}.
      Expertise in ${hcp.expertise.join(", ")}.
      ${hcp.bio}
    `.trim();

    const embedding = await getEmbedding(hcpText);
    embeddingsMap.set(hcp.id, embedding);
  }

  hcpEmbeddings = embeddingsMap;
  console.log(`Computed embeddings for ${hcpEmbeddings.size} HCPs`);
  return hcpEmbeddings;
}

/**
 * Find relevant HCPs for a given question.
 * @param question The user's question
 * @param limit Maximum number of results to return (default 10)
 * @returns Array of { hcp: HCP, similarity: number } sorted by similarity descending
 */
export async function findRelevantHCPs(
  question: string,
  limit: number = 10,
  specialty?: string,
): Promise<Array<{ hcp: HCP; similarity: number }>> {
  const requestedSpecialty = specialty || analyzeLocally(question).specialty;
  const allHcps = loadHCPs();
  const specific = requestedSpecialty.toLowerCase() !== "general practice";
  const hcpList = specific
    ? allHcps.filter(
        (hcp) =>
          hcp.specialty.toLowerCase() === requestedSpecialty.toLowerCase(),
      )
    : allHcps;
  if (hcpList.length === 0) {
    return [];
  }

  const openaiAvailable = !!process.env.OPENAI_API_KEY;

  if (openaiAvailable) {
    try {
      // Get embedding for the question
      const questionEmbedding = await getEmbedding(question);
      // Get embeddings for all HCPs
      const hcpEmbeddingsMap = await getHcpEmbeddings();

      // Compute similarity for each HCP
      const similarities: Array<{ hcp: HCP; similarity: number }> = [];
      for (const hcp of hcpList) {
        const hcpEmbedding = hcpEmbeddingsMap.get(hcp.id);
        if (hcpEmbedding) {
          const similarity = cosineSimilarity(questionEmbedding, hcpEmbedding);
          similarities.push({ hcp, similarity });
        }
      }

      // Sort by similarity descending
      similarities.sort((a, b) => b.similarity - a.similarity);
      return similarities.slice(0, limit);
    } catch (error) {
      console.error(
        "Error in embedding-based peer matching, falling back to keyword matching:",
        error,
      );
      // Fall through to keyword matching
    }
  }

  // Fallback: keyword overlap similarity combined with specialty match
  const questionLower = question.toLowerCase();
  const similarities: Array<{ hcp: HCP; similarity: number }> = [];

  for (const hcp of hcpList) {
    // Specialty bonus: if specialty mentioned in question, boost score
    let specialtyBonus = 0;
    if (questionLower.includes(hcp.specialty.toLowerCase())) {
      specialtyBonus = 0.3; // arbitrary boost
    }

    // Expertise overlap
    const expertiseText = hcp.expertise.join(" ");
    const expertiseSimilarity = keywordOverlapSimilarity(
      question,
      expertiseText,
    );

    // Bio similarity
    const bioSimilarity = keywordOverlapSimilarity(question, hcp.bio);

    // Combine: weighted average
    const similarity =
      0.4 * expertiseSimilarity + 0.3 * bioSimilarity + 0.3 * specialtyBonus;
    similarities.push({ hcp, similarity: Math.min(similarity, 1.0) }); // cap at 1
  }

  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities.slice(0, limit);
}

/**
 * Clear the cached embeddings (useful if data changes).
 */
export function clearHcpEmbeddingsCache() {
  hcpEmbeddings = null;
}
