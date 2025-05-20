const fs = require("fs");
const path = require("path");

// Đường dẫn tới các file
const ALL_VOCAB_PATH = path.resolve(
  __dirname,
  "../../public/vocabulary/all.json"
);
const TYPES_DIR = path.resolve(__dirname, "../../public/vocabulary/types");
const INDEX_PATH = path.resolve(TYPES_DIR, "index.json");

// Đảm bảo thư mục types tồn tại
if (!fs.existsSync(TYPES_DIR)) {
  fs.mkdirSync(TYPES_DIR, { recursive: true });
}

// Đọc file all.json
const allVocabData = JSON.parse(fs.readFileSync(ALL_VOCAB_PATH, "utf8"));

// Nhóm từ vựng theo loại
const groupedByType = {};
const allVocab = allVocabData.vocabulary || [];

allVocab.forEach((term) => {
  const type = term.type || "unknown";
  if (!groupedByType[type]) {
    groupedByType[type] = [];
  }
  groupedByType[type].push(term);
});

// Danh sách các loại từ
const types = Object.keys(groupedByType);

// Tạo và lưu file cho từng loại
types.forEach((type) => {
  const termsOfType = groupedByType[type];
  const typeData = {
    metadata: {
      ...allVocabData.metadata,
      totalTerms: termsOfType.length,
      type,
    },
    vocabulary: termsOfType,
  };

  const typeFilePath = path.resolve(TYPES_DIR, `${type}.json`);
  fs.writeFileSync(typeFilePath, JSON.stringify(typeData, null, 2), "utf8");
  console.log(`Created/updated ${type}.json with ${termsOfType.length} terms`);
});

// Tạo file index.json chứa thông tin tổng quan
const indexData = {
  metadata: {
    ...allVocabData.metadata,
    types: types.map((type) => ({
      name: type,
      count: groupedByType[type].length,
    })),
  },
};

fs.writeFileSync(INDEX_PATH, JSON.stringify(indexData, null, 2), "utf8");
console.log(
  `Created/updated index.json with metadata for ${types.length} types`
);

console.log("Vocabulary categorization complete!");
