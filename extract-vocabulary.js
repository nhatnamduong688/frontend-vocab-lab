const fs = require("fs");
const path = require("path");

// Read the markdown file
const markdownContent = fs.readFileSync("interviewcake-js-guide.md", "utf8");

// Function to extract vocabulary from markdown content
function extractVocabulary(content) {
  const vocabulary = {
    metadata: {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      totalTerms: 0,
      categories: [
        "Core Concepts",
        "Modern Features",
        "Design Patterns",
        "Testing",
        "Memory",
        "Async",
        "Security",
        "Development",
        "Performance",
      ],
    },
    vocabulary: [],
  };

  // Split content into topics
  const topics = content.split("## Topic");

  // Process each topic
  topics.forEach((topic, idx) => {
    if (!topic.trim()) return;

    // Fix: Extract topic title (allow leading whitespace, match 'Topic X: ...')
    const titleMatch = topic.match(/\s*\d+:\s*(.*?)\n/);
    if (!titleMatch) {
      console.log(`[DEBUG] Skipping topic index ${idx}: No title match.`);
      return;
    }
    const topicTitle = titleMatch[1].trim();
    console.log(`[DEBUG] Processing topic: ${topicTitle}`);

    // Extract code examples
    const codeBlocks = topic.match(/```javascript\n([\s\S]*?)\n```/g) || [];

    // Extract interview tips
    const interviewTips = topic.match(/Interview Tips[\s\S]*?(?=##|$)/g) || [];

    // Extract key concepts - improved pattern matching
    const concepts = topic.match(/\*\*(.*?)\*\*:?.*?(?=\n\n|\n\*\*|$)/g) || [];

    // Also extract terms from headings
    const headings = topic.match(/### (.*?)\n/g) || [];
    headings.forEach((heading) => {
      const term = heading.replace("### ", "").trim();
      if (term && !concepts.some((c) => c.includes(term))) {
        concepts.push(`**${term}**: ${term}`);
      }
    });

    // Extract terms from lists (lines starting with - or *)
    const listItems = topic.match(/^[-*]\s*(.*?)$/gm) || [];
    listItems.forEach((item) => {
      const term = item.replace(/^[-*]\s*/, "").trim();
      if (term && !concepts.some((c) => c.includes(term))) {
        concepts.push(`**${term}**: ${term}`);
      }
    });

    // Extract terms from code blocks (function names, class names, etc.)
    codeBlocks.forEach((block) => {
      const code = block.replace(/```javascript\n|\n```/g, "");
      const functionMatches = code.match(/function\s+(\w+)/g) || [];
      const classMatches = code.match(/class\s+(\w+)/g) || [];
      const constMatches = code.match(/const\s+(\w+)/g) || [];
      const letMatches = code.match(/let\s+(\w+)/g) || [];
      const varMatches = code.match(/var\s+(\w+)/g) || [];
      const allMatches = [
        ...functionMatches,
        ...classMatches,
        ...constMatches,
        ...letMatches,
        ...varMatches,
      ];
      allMatches.forEach((match) => {
        const term = match.split(/\s+/)[1];
        if (term && !concepts.some((c) => c.includes(term))) {
          concepts.push(`**${term}**: ${term}`);
        }
      });
    });

    concepts.forEach((concept) => {
      const match = concept.match(/\*\*(.*?)\*\*:?.*?(.*)/);
      if (!match) return;

      const term = match[1].trim();
      const description = match[2].trim();

      // Find related code example
      const relatedCode = codeBlocks.find(
        (block) => block.includes(term) || block.includes(term.toLowerCase())
      );

      // Find related interview tips
      const relatedTips = interviewTips.find(
        (tip) => tip.includes(term) || tip.includes(term.toLowerCase())
      );

      // Determine category based on topic
      let category = "Core Concepts";
      if (topicTitle.includes("ES6")) category = "Modern Features";
      if (topicTitle.includes("Design")) category = "Design Patterns";
      if (topicTitle.includes("Testing")) category = "Testing";
      if (topicTitle.includes("Memory")) category = "Memory";
      if (topicTitle.includes("Async")) category = "Async";
      if (topicTitle.includes("Security")) category = "Security";
      if (topicTitle.includes("Development")) category = "Development";
      if (topicTitle.includes("Performance")) category = "Performance";

      // Determine difficulty based on topic number
      const topicNumber = parseInt(topic.match(/^\d+/)?.[0] || "1");
      let difficulty = "Beginner";
      if (topicNumber > 5) difficulty = "Intermediate";
      if (topicNumber > 8) difficulty = "Advanced";

      // Determine type based on term characteristics
      let type = "Subject";
      if (
        term.toLowerCase().includes("function") ||
        term.toLowerCase().includes("method")
      ) {
        type = "Verb Phrase";
      } else if (
        term.toLowerCase().includes("pattern") ||
        term.toLowerCase().includes("system")
      ) {
        type = "Noun Phrase";
      } else if (
        term.toLowerCase().includes("efficient") ||
        term.toLowerCase().includes("secure")
      ) {
        type = "Adjective";
      }

      vocabulary.vocabulary.push({
        term,
        type,
        category,
        difficulty,
        frequency: "High",
        interviewImportance: "Critical",
        description,
        example: description,
        relatedTerms: [],
        codeExample: relatedCode
          ? relatedCode.replace(/```javascript\n|\n```/g, "")
          : "",
        commonQuestions: relatedTips
          ? relatedTips
              .split("\n")
              .filter((line) => line.includes("?"))
              .map((line) => line.replace(/^[*-]\s*/, "").trim())
              .filter(Boolean)
          : [],
      });
    });
  });

  // Update total terms
  vocabulary.metadata.totalTerms = vocabulary.vocabulary.length;

  return vocabulary;
}

// Extract vocabulary and save to JSON
const vocabulary = extractVocabulary(markdownContent);
fs.writeFileSync(
  "vocabulary.json",
  JSON.stringify(vocabulary, null, 2),
  "utf8"
);

console.log(
  `Extracted ${vocabulary.metadata.totalTerms} terms to vocabulary.json`
);
