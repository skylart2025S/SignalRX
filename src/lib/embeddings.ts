import OpenAI from 'openai';

let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('OPENAI_API_KEY is not set. Embedding functions will use mock/vectorless similarity.');
      return null;
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

/**
 * Generate an embedding for the given text using OpenAI's embedding model.
 * Falls back to a simple TF-IDF-like vector if OpenAI is not available.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const openai = getOpenAI();
  if (!openai) {
    return mockEmbedding(text);
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding with OpenAI:', error);
    return mockEmbedding(text);
  }
}

/**
 * Compute cosine similarity between two vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must be of the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Mock embedding function that returns a fixed-length vector based on character codes.
 * This is just for demonstration and not suitable for production.
 */
function mockEmbedding(text: string): number[] {
  // Generate a deterministic seed from the text
  let seed = 0;
  for (let i = 0; i < text.length; i++) {
    seed = (seed << 5) - seed + text.charCodeAt(i);
    seed = seed & seed; // Convert to 32-bit integer
  }
  const absSeed = Math.abs(seed);

  // Generate a deterministic pseudo-random vector of length 1536 (same as text-embedding-3-small)
  const vector = new Array(1536);
  let currentSeed = absSeed;
  for (let i = 0; i < 1536; i++) {
    // Simple linear congruential generator
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    vector[i] = currentSeed / 233280;
  }
  return vector;
}

/**
 * Compute a simple similarity score based on keyword overlap (for fallback matching).
 * Returns a score between 0 and 1.
 */
export function keywordOverlapSimilarity(textA: string, textB: string): number {
  const wordsA = new Set(textA.toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
  const wordsB = new Set(textB.toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  const intersection = [...wordsA].filter(w => wordsB.has(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size;
  return intersection / union;
}
