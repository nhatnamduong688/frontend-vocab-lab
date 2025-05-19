const fs = require("fs");

// Technical terms to keep
const technicalTerms = new Set([
  // Core Concepts
  "JavaScript",
  "Node.js",
  "DOM",
  "Event-driven",
  "Non-blocking I/O",
  "Concurrency",
  "Async/await",
  "Dynamic typing",
  "Prototype-based",
  "Runtime",
  "Microservices",
  "Isomorphic",
  "Garbage collection",

  // Technical Features
  "Event handling",
  "TypeScript",
  "Static type systems",
  "Multi-threaded",
  "Parallel processing",

  // Development Tools
  "npm",
  "React",
  "Lodash",

  // Performance Terms
  "CPU-Intensive",
  "Memory-Critical",
  "Scalable",
  "High-performance",
]);

// Common words to exclude
const stopWords = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "with",
  "by",
  "from",
  "of",
  "as",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "shall",
  "should",
  "can",
  "could",
  "may",
  "might",
  "must",
  "it",
  "its",
  "they",
  "their",
  "them",
  "this",
  "that",
  "these",
  "those",
  "here",
  "there",
  "where",
  "when",
  "why",
  "how",
  "what",
  "which",
  "who",
  "whom",
  "whose",
]);

function extractVocabulary(text) {
  const vocabulary = {
    metadata: {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      topic: "Why JavaScript?",
      totalTerms: 0,
    },
    vocabulary: [],
  };

  // Split text into sentences
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim());

  // Process each sentence
  sentences.forEach((sentence) => {
    // Extract technical terms
    const words = sentence.split(/\s+/);
    words.forEach((word) => {
      // Clean the word
      const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");

      // Skip if it's a stop word or too short
      if (stopWords.has(cleanWord) || cleanWord.length < 3) return;

      // Check if it's a technical term
      if (
        technicalTerms.has(word) ||
        word.match(/^[A-Z][a-z]+/) || // PascalCase
        word.match(/^[a-z]+[A-Z]/)
      ) {
        // camelCase

        // Find the context (the sentence containing the term)
        const context = sentence.trim();

        // Determine type
        let type = "Subject";
        if (word.toLowerCase().includes("ing")) type = "Verb Phrase";
        else if (
          word.toLowerCase().includes("able") ||
          word.toLowerCase().includes("ive")
        )
          type = "Adjective";

        // Add to vocabulary if not already present
        if (!vocabulary.vocabulary.some((v) => v.term === word)) {
          vocabulary.vocabulary.push({
            term: word,
            type: type,
            category: "Core Concepts",
            difficulty: "Beginner",
            description: context,
            example: context,
          });
        }
      }
    });
  });

  // Update total terms
  vocabulary.metadata.totalTerms = vocabulary.vocabulary.length;

  return vocabulary;
}

// Example text from Topic 1
const text = `Topic 1: Why JavaScript?
JavaScript's position as the language of the web makes it unique—it's the only programming language that runs natively in every web browser. Beyond that, Javascript is a flexible language in its own right, capable of more than just web front ends.

Here are JavaScript's biggest strengths:
Asynchronous Powerhouse: JavaScript's event-driven, non-blocking I/O model makes it exceptional at handling concurrency without the complexities of traditional threading. The async/await syntax makes this power accessible and readable.
Universal Runtime: With Node.js, JavaScript runs everywhere—browsers, servers, mobile, IoT devices. Mastering it makes you a versatile programmer in many contexts.
Rich Ecosystem: npm is the world's largest software registry. Whether you need a full framework like React, a utility library like Lodash, or specialized tools for data visualization or server-side rendering, the ecosystem has mature solutions ready to use.
Dynamic and Flexible: JavaScript's dynamic typing and prototype-based object system offer incredible flexibility.
In practice, JavaScript excels at:
Interactive Web Applications: Tight DOM integration and event handling make it perfect for responsive, engaging UIs
Scalable Microservices: Node.js's lightweight nature and non-blocking I/O are ideal for building high-performance microservices.
Isomorphic Applications: Code sharing between front-end and back-end drastically reduces duplication and boosts maintainability
However, you should probably look elsewhere for:
CPU-Intensive Tasks: For heavy number crunching or data processing, compiled languages like C++ or Rust offer superior performance
Static Type Safety: While TypeScript helps, languages like Java or C# provide stronger static type systems out of the box
Memory-Critical Applications: JavaScript's garbage collection and dynamic nature make memory usage less predictable
Multi-threaded Processing: Languages like Go or Java handle true parallel processing more natively`;

// Extract vocabulary and save to JSON
const vocabulary = extractVocabulary(text);
fs.writeFileSync(
  "topic1-vocabulary.json",
  JSON.stringify(vocabulary, null, 2),
  "utf8"
);

console.log(
  `Extracted ${vocabulary.metadata.totalTerms} terms to topic1-vocabulary.json`
);
