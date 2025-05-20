const fs = require("fs");
const path = require("path");

// Paths
const SOURCE_FILE = path.join(__dirname, "../public/vocabulary.json");
const TARGET_DIR = path.join(__dirname, "../public/vocabulary");
const TYPES_DIR = path.join(TARGET_DIR, "types");

// Ensure directories exist
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}
if (!fs.existsSync(TYPES_DIR)) {
  fs.mkdirSync(TYPES_DIR, { recursive: true });
}

// Read source file
console.log("Reading vocabulary data...");
const rawData = fs.readFileSync(SOURCE_FILE, "utf8");
const vocabularyData = JSON.parse(rawData);

// Extract metadata and vocabulary
const { metadata, vocabulary } = vocabularyData;

// Create a map to store words by type
const wordsByType = {};

// Group words by type
console.log("Grouping words by type...");
vocabulary.forEach((word) => {
  const type = word.type || "other";

  if (!wordsByType[type]) {
    wordsByType[type] = [];
  }

  wordsByType[type].push(word);
});

// Write each type to its own file
console.log("Writing type-specific files...");
Object.entries(wordsByType).forEach(([type, words]) => {
  const typeData = {
    metadata: {
      ...metadata,
      totalTerms: words.length,
      type,
    },
    vocabulary: words,
  };

  const filePath = path.join(TYPES_DIR, `${type}.json`);
  fs.writeFileSync(filePath, JSON.stringify(typeData, null, 2), "utf8");
  console.log(`Created ${type}.json with ${words.length} words`);
});

// Copy the original file to the vocabulary directory as well
fs.copyFileSync(SOURCE_FILE, path.join(TARGET_DIR, "all.json"));
console.log("Copied full vocabulary to all.json");

// Create an index file with vocabulary metadata and available types
const indexData = {
  metadata,
  availableTypes: Object.keys(wordsByType).map((type) => ({
    type,
    count: wordsByType[type].length,
    file: `types/${type}.json`,
  })),
  allWordsFile: "all.json",
};

fs.writeFileSync(
  path.join(TARGET_DIR, "index.json"),
  JSON.stringify(indexData, null, 2),
  "utf8"
);
console.log("Created index.json with metadata and available types");

console.log("Done!");
