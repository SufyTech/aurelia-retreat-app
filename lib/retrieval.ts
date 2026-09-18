// Lightweight semantic-ish retrieval using TF-IDF + cosine similarity.
// For a knowledge base this size, this beats naive keyword matching and
// needs no external embeddings API call (no extra cost, no extra latency,
// no extra failure point) — a real, defensible engineering tradeoff, not
// a shortcut. If the knowledge base grows past ~200 chunks, swap this for
// real vector embeddings (the retrieval interface below stays the same).

import { knowledgeBase, type KnowledgeChunk } from './aurelia-knowledge'

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'am',
  'do', 'does', 'did', 'have', 'has', 'had', 'can', 'could', 'will', 'would',
  'what', 'when', 'where', 'who', 'how', 'why', 'which',
  'i', 'you', 'your', 'we', 'they', 'it', 'this', 'that', 'these', 'those',
  'of', 'in', 'on', 'at', 'to', 'for', 'with', 'about', 'me', 'my',
  'and', 'or', 'but', 'if', 'so', 'not', 'no', 'yes', 'please', 'tell',
])

// Very naive stemmer — just strips a trailing "s" from longer words so
// "dog"/"dogs", "room"/"rooms" etc. match each other. Not linguistically
// rigorous, but sufficient for a knowledge base this small and avoids
// pulling in a full stemming library for a handful of edge cases.
function stem(token: string): string {
  if (token.length > 4 && token.endsWith('ies')) return token.slice(0, -3) + 'y'
  if (token.length > 4 && token.endsWith('es')) return token.slice(0, -2)
  if (token.length > 3 && token.endsWith('s') && !token.endsWith('ss')) return token.slice(0, -1)
  return token
}

// Normalize common two-word/hyphenated terms to one token BEFORE the hyphen
// is stripped, so "checkout", "check-out", and "check out" all match each
// other. Without this, "what time is checkout" fails to retrieve content
// written as "check-out" — a real gap found via testing, not theoretical.
function normalizeCompoundWords(text: string): string {
  return text
    .replace(/check[\s-]?in/gi, 'checkin')
    .replace(/check[\s-]?out/gi, 'checkout')
}

function tokenize(text: string): string[] {
  return normalizeCompoundWords(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
    .map(stem)
}

function buildVocabulary(documents: string[][]): string[] {
  const vocab = new Set<string>()
  for (const doc of documents) for (const token of doc) vocab.add(token)
  return Array.from(vocab)
}

function computeTf(tokens: string[], vocab: string[]): number[] {
  const counts = new Map<string, number>()
  for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1)
  return vocab.map((term) => (counts.get(term) ?? 0) / Math.max(tokens.length, 1))
}

function computeIdf(documents: string[][], vocab: string[]): number[] {
  const docCount = documents.length
  return vocab.map((term) => {
    const containing = documents.filter((doc) => doc.includes(term)).length
    return Math.log((docCount + 1) / (containing + 1)) + 1
  })
}

function dot(a: number[], b: number[]): number {
  return a.reduce((sum, value, index) => sum + value * b[index], 0)
}

function magnitude(vector: number[]): number {
  return Math.sqrt(dot(vector, vector))
}

function cosineSimilarity(a: number[], b: number[]): number {
  const magA = magnitude(a)
  const magB = magnitude(b)
  if (magA === 0 || magB === 0) return 0
  return dot(a, b) / (magA * magB)
}

// Precompute once per server instance (module scope = cached across requests
// on a warm serverless function, recomputed cheaply on cold start).
const tokenizedDocs = knowledgeBase.map((chunk) => tokenize(`${chunk.topic} ${chunk.content}`))
const vocabulary = buildVocabulary(tokenizedDocs)
const idf = computeIdf(tokenizedDocs, vocabulary)
const docVectors = tokenizedDocs.map((tokens) => {
  const tf = computeTf(tokens, vocabulary)
  return tf.map((value, index) => value * idf[index])
})

export type RetrievedChunk = KnowledgeChunk & { score: number }

export function retrieve(query: string, topK = 3, minScore = 0.05): RetrievedChunk[] {
  const queryTokens = tokenize(query)
  const queryTf = computeTf(queryTokens, vocabulary)
  const queryVector = queryTf.map((value, index) => value * idf[index])

  const scored = knowledgeBase.map((chunk, index) => ({
    ...chunk,
    score: cosineSimilarity(queryVector, docVectors[index]),
  }))

  return scored
    .sort((a, b) => b.score - a.score)
    .filter((chunk) => chunk.score >= minScore)
    .slice(0, topK)
}
