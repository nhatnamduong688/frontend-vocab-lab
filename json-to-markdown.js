const fs = require("fs");

// Read the JSON file
const vocabulary = JSON.parse(fs.readFileSync("vocabulary.json", "utf8"));

// Create markdown table header
let markdown = "# JavaScript Technical Vocabulary\n\n";
markdown += "| Term | Type | Category | Difficulty | Description | Example |\n";
markdown += "|------|------|----------|------------|-------------|--------|\n";

// Add each term to the table
vocabulary.vocabulary.forEach((term) => {
  markdown += `| ${term.term} | ${term.type} | ${term.category} | ${term.difficulty} | ${term.description} | ${term.example} |\n`;
});

// Add metadata section
markdown += "\n## Metadata\n\n";
markdown += `- Version: ${vocabulary.metadata.version}\n`;
markdown += `- Last Updated: ${vocabulary.metadata.lastUpdated}\n`;
markdown += `- Total Terms: ${vocabulary.metadata.totalTerms}\n`;
markdown += `- Categories: ${vocabulary.metadata.categories.join(", ")}\n`;

// Write to markdown file
fs.writeFileSync("vocabulary-table.md", markdown, "utf8");

console.log("Created vocabulary-table.md");
