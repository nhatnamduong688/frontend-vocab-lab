const fs = require("fs");

// Read the JSON file
const vocabulary = JSON.parse(
  fs.readFileSync("topic1-vocabulary.json", "utf8")
);

// Create markdown table header
let markdown = "# JavaScript Technical Vocabulary - Topic 1\n\n";
markdown += "| Term | Type | Category | Difficulty | Description |\n";
markdown += "|------|------|----------|------------|-------------|\n";

// Add each term to the table
vocabulary.vocabulary.forEach((term) => {
  markdown += `| ${term.term} | ${term.type} | ${term.category} | ${term.difficulty} | ${term.description} |\n`;
});

// Add metadata section
markdown += "\n## Metadata\n\n";
markdown += `- Version: ${vocabulary.metadata.version}\n`;
markdown += `- Last Updated: ${vocabulary.metadata.lastUpdated}\n`;
markdown += `- Topic: ${vocabulary.metadata.topic}\n`;
markdown += `- Total Terms: ${vocabulary.metadata.totalTerms}\n`;

// Write to markdown file
fs.writeFileSync("topic1-vocabulary-table.md", markdown, "utf8");

console.log("Created topic1-vocabulary-table.md");
