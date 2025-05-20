const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "../build")));

// Đường dẫn đến file lưu trữ câu và type
const DATA_DIR = path.join(__dirname, "data");
const SENTENCES_FILE = path.join(DATA_DIR, "sentences.json");
const TYPES_FILE = path.join(DATA_DIR, "vocabulary-types.json");

// Đường dẫn đến các file vocabulary
const VOCABULARY_ALL_FILE = path.join(DATA_DIR, "vocabulary-all.json");
const VOCABULARY_INDEX_FILE = path.join(DATA_DIR, "vocabulary-index.json");
const VOCABULARY_TYPES_DIR = path.join(DATA_DIR, "vocabulary-types");

// Đảm bảo thư mục data tồn tại
const ensureDataDirectory = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// Đảm bảo thư mục vocabulary-types tồn tại
const ensureVocabularyTypesDirectory = () => {
  if (!fs.existsSync(VOCABULARY_TYPES_DIR)) {
    fs.mkdirSync(VOCABULARY_TYPES_DIR, { recursive: true });
  }
};

// Đọc dữ liệu từ file
const readSentencesFromFile = () => {
  ensureDataDirectory();
  if (!fs.existsSync(SENTENCES_FILE)) {
    return { sentences: [] };
  }

  try {
    const data = fs.readFileSync(SENTENCES_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading sentences file:", error);
    return { sentences: [] };
  }
};

// Lưu dữ liệu vào file
const saveSentencesToFile = (data) => {
  ensureDataDirectory();
  try {
    fs.writeFileSync(SENTENCES_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error saving sentences to file:", error);
    return false;
  }
};

// Đọc dữ liệu types từ file
const readTypesFromFile = () => {
  ensureDataDirectory();
  if (!fs.existsSync(TYPES_FILE)) {
    // Tạo file mặc định nếu chưa tồn tại
    const defaultTypes = {
      metadata: {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        types: [
          { name: "noun", count: 0 },
          { name: "verb", count: 0 },
          { name: "adjective", count: 0 },
          { name: "adverb", count: 0 },
          { name: "framework", count: 0 },
          { name: "library", count: 0 },
          { name: "concept", count: 0 },
          { name: "pattern", count: 0 },
          { name: "api", count: 0 },
          { name: "property", count: 0 },
          { name: "method", count: 0 },
          { name: "component", count: 0 },
        ],
      },
      vocabulary: {},
    };
    saveTypesToFile(defaultTypes);
    return defaultTypes;
  }

  try {
    const data = fs.readFileSync(TYPES_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading types file:", error);
    return { metadata: { types: [] }, vocabulary: {} };
  }
};

// Lưu dữ liệu types vào file
const saveTypesToFile = (data) => {
  ensureDataDirectory();
  try {
    fs.writeFileSync(TYPES_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error saving types to file:", error);
    return false;
  }
};

// Endpoint để lấy tất cả câu
app.get("/api/sentences", (req, res) => {
  try {
    const data = readSentencesFromFile();
    res.json(data);
  } catch (error) {
    console.error("Error getting sentences:", error);
    res.status(500).json({ error: "Failed to retrieve sentences" });
  }
});

// Endpoint để lưu một câu mới
app.post("/api/sentences", (req, res) => {
  try {
    const data = readSentencesFromFile();
    const newSentence = req.body;

    // Đảm bảo dữ liệu hợp lệ
    if (!newSentence.id || !newSentence.text || !newSentence.words) {
      return res.status(400).json({ error: "Invalid sentence data" });
    }

    data.sentences.push(newSentence);

    if (saveSentencesToFile(data)) {
      res.status(201).json(newSentence);
    } else {
      res.status(500).json({ error: "Failed to save sentence" });
    }
  } catch (error) {
    console.error("Error saving sentence:", error);
    res.status(500).json({ error: "Failed to save sentence" });
  }
});

// Endpoint để xóa một câu
app.delete("/api/sentences/:id", (req, res) => {
  try {
    const data = readSentencesFromFile();
    const { id } = req.params;

    const initialLength = data.sentences.length;
    data.sentences = data.sentences.filter((sentence) => sentence.id !== id);

    if (data.sentences.length === initialLength) {
      return res.status(404).json({ error: "Sentence not found" });
    }

    if (saveSentencesToFile(data)) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: "Failed to delete sentence" });
    }
  } catch (error) {
    console.error("Error deleting sentence:", error);
    res.status(500).json({ error: "Failed to delete sentence" });
  }
});

// Endpoint để xóa tất cả câu
app.delete("/api/sentences", (req, res) => {
  try {
    const emptyData = { sentences: [] };

    if (saveSentencesToFile(emptyData)) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: "Failed to clear sentences" });
    }
  } catch (error) {
    console.error("Error clearing sentences:", error);
    res.status(500).json({ error: "Failed to clear sentences" });
  }
});

// ===== VOCABULARY TYPES API ENDPOINTS =====

// Endpoint để lấy tất cả types
app.get("/api/types", (req, res) => {
  try {
    const data = readTypesFromFile();
    res.json(data.metadata.types);
  } catch (error) {
    console.error("Error getting types:", error);
    res.status(500).json({ error: "Failed to retrieve types" });
  }
});

// Endpoint để lấy metadata và tất cả types
app.get("/api/types/metadata", (req, res) => {
  try {
    const data = readTypesFromFile();
    res.json(data.metadata);
  } catch (error) {
    console.error("Error getting types metadata:", error);
    res.status(500).json({ error: "Failed to retrieve types metadata" });
  }
});

// Endpoint để lấy từ vựng theo type
app.get("/api/types/:typeName", (req, res) => {
  try {
    const data = readTypesFromFile();
    const { typeName } = req.params;

    if (!data.vocabulary[typeName]) {
      return res.status(404).json({ error: `Type '${typeName}' not found` });
    }

    res.json({
      type: typeName,
      items: data.vocabulary[typeName],
    });
  } catch (error) {
    console.error("Error getting vocabulary by type:", error);
    res.status(500).json({ error: "Failed to retrieve vocabulary" });
  }
});

// Endpoint để thêm mới hoặc cập nhật một type
app.post("/api/types", (req, res) => {
  try {
    const data = readTypesFromFile();
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Type name is required" });
    }

    // Kiểm tra xem type đã tồn tại chưa
    const existingTypeIndex = data.metadata.types.findIndex(
      (t) => t.name === name
    );

    if (existingTypeIndex >= 0) {
      // Cập nhật type nếu đã tồn tại
      data.metadata.types[existingTypeIndex] = {
        ...data.metadata.types[existingTypeIndex],
        description,
        lastUpdated: new Date().toISOString(),
      };
    } else {
      // Thêm mới nếu chưa tồn tại
      data.metadata.types.push({
        name,
        description,
        count: 0,
        lastUpdated: new Date().toISOString(),
      });

      // Đảm bảo có mảng cho type mới
      if (!data.vocabulary[name]) {
        data.vocabulary[name] = [];
      }
    }

    // Cập nhật metadata
    data.metadata.lastUpdated = new Date().toISOString();

    if (saveTypesToFile(data)) {
      res.status(201).json(data.metadata.types.find((t) => t.name === name));
    } else {
      res.status(500).json({ error: "Failed to save type" });
    }
  } catch (error) {
    console.error("Error saving type:", error);
    res.status(500).json({ error: "Failed to save type" });
  }
});

// Endpoint để thêm từ vựng vào một type
app.post("/api/types/:typeName/vocabulary", (req, res) => {
  try {
    const data = readTypesFromFile();
    const { typeName } = req.params;
    const newItem = req.body;

    // Kiểm tra xem type có tồn tại không
    const typeExists = data.metadata.types.some((t) => t.name === typeName);
    if (!typeExists) {
      return res.status(404).json({ error: `Type '${typeName}' not found` });
    }

    // Đảm bảo mảng tồn tại
    if (!data.vocabulary[typeName]) {
      data.vocabulary[typeName] = [];
    }

    // Thêm ID nếu chưa có
    if (!newItem.id) {
      newItem.id = `${typeName}_${Date.now()}`;
    }

    // Thêm từ vựng mới
    data.vocabulary[typeName].push(newItem);

    // Cập nhật số lượng
    const typeIndex = data.metadata.types.findIndex((t) => t.name === typeName);
    data.metadata.types[typeIndex].count = data.vocabulary[typeName].length;
    data.metadata.lastUpdated = new Date().toISOString();

    if (saveTypesToFile(data)) {
      res.status(201).json(newItem);
    } else {
      res.status(500).json({ error: "Failed to save vocabulary item" });
    }
  } catch (error) {
    console.error("Error saving vocabulary item:", error);
    res.status(500).json({ error: "Failed to save vocabulary item" });
  }
});

// Endpoint để xóa một từ vựng khỏi type
app.delete("/api/types/:typeName/vocabulary/:itemId", (req, res) => {
  try {
    const data = readTypesFromFile();
    const { typeName, itemId } = req.params;

    // Kiểm tra xem type có tồn tại không
    if (!data.vocabulary[typeName]) {
      return res.status(404).json({ error: `Type '${typeName}' not found` });
    }

    const initialLength = data.vocabulary[typeName].length;
    data.vocabulary[typeName] = data.vocabulary[typeName].filter(
      (item) => item.id !== itemId
    );

    if (data.vocabulary[typeName].length === initialLength) {
      return res.status(404).json({
        error: `Item with ID '${itemId}' not found in type '${typeName}'`,
      });
    }

    // Cập nhật metadata
    const typeIndex = data.metadata.types.findIndex((t) => t.name === typeName);
    data.metadata.types[typeIndex].count = data.vocabulary[typeName].length;
    data.metadata.lastUpdated = new Date().toISOString();

    if (saveTypesToFile(data)) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: "Failed to delete vocabulary item" });
    }
  } catch (error) {
    console.error("Error deleting vocabulary item:", error);
    res.status(500).json({ error: "Failed to delete vocabulary item" });
  }
});

// ===== VOCABULARY API ENDPOINTS =====

// Khởi tạo từ public folder nếu chưa có dữ liệu
const initializeVocabularyFromPublic = () => {
  ensureDataDirectory();
  ensureVocabularyTypesDirectory();

  const publicVocabDir = path.join(__dirname, "../public/vocabulary");
  const publicAllFile = path.join(publicVocabDir, "all.json");
  const publicIndexFile = path.join(publicVocabDir, "index.json");
  const publicTypesDir = path.join(publicVocabDir, "types");

  // Kiểm tra xem đã có file vocabulary-all.json trong data chưa
  if (!fs.existsSync(VOCABULARY_ALL_FILE) && fs.existsSync(publicAllFile)) {
    // Copy all.json từ public vào data
    fs.copyFileSync(publicAllFile, VOCABULARY_ALL_FILE);
    console.log("Copied vocabulary-all.json from public folder");
  }

  // Kiểm tra xem đã có file vocabulary-index.json trong data chưa
  if (!fs.existsSync(VOCABULARY_INDEX_FILE) && fs.existsSync(publicIndexFile)) {
    // Copy index.json từ public vào data
    fs.copyFileSync(publicIndexFile, VOCABULARY_INDEX_FILE);
    console.log("Copied vocabulary-index.json from public folder");
  }

  // Copy các file types
  if (fs.existsSync(publicTypesDir)) {
    const typeFiles = fs.readdirSync(publicTypesDir);
    typeFiles.forEach((file) => {
      const srcPath = path.join(publicTypesDir, file);
      const destPath = path.join(VOCABULARY_TYPES_DIR, file);

      if (!fs.existsSync(destPath) && fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file} from public types folder`);
      }
    });
  }
};

// Đọc dữ liệu vocabulary từ file all.json
const readAllVocabularyFromFile = () => {
  ensureDataDirectory();

  if (!fs.existsSync(VOCABULARY_ALL_FILE)) {
    initializeVocabularyFromPublic();

    if (!fs.existsSync(VOCABULARY_ALL_FILE)) {
      return {
        metadata: { version: "1.0.0", lastUpdated: new Date().toISOString() },
        vocabulary: [],
      };
    }
  }

  try {
    const data = fs.readFileSync(VOCABULARY_ALL_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading vocabulary file:", error);
    return {
      metadata: { version: "1.0.0", lastUpdated: new Date().toISOString() },
      vocabulary: [],
    };
  }
};

// Lưu dữ liệu vocabulary vào file all.json
const saveAllVocabularyToFile = (data) => {
  ensureDataDirectory();
  try {
    fs.writeFileSync(
      VOCABULARY_ALL_FILE,
      JSON.stringify(data, null, 2),
      "utf8"
    );
    return true;
  } catch (error) {
    console.error("Error saving vocabulary to file:", error);
    return false;
  }
};

// Đọc dữ liệu vocabulary index
const readVocabularyIndexFromFile = () => {
  ensureDataDirectory();

  if (!fs.existsSync(VOCABULARY_INDEX_FILE)) {
    initializeVocabularyFromPublic();

    if (!fs.existsSync(VOCABULARY_INDEX_FILE)) {
      return {
        metadata: {
          version: "1.0.0",
          lastUpdated: new Date().toISOString(),
          totalTerms: 0,
          categories: [],
        },
        availableTypes: [],
      };
    }
  }

  try {
    const data = fs.readFileSync(VOCABULARY_INDEX_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading vocabulary index file:", error);
    return {
      metadata: {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        totalTerms: 0,
        categories: [],
      },
      availableTypes: [],
    };
  }
};

// Lưu dữ liệu vocabulary index
const saveVocabularyIndexToFile = (data) => {
  ensureDataDirectory();
  try {
    fs.writeFileSync(
      VOCABULARY_INDEX_FILE,
      JSON.stringify(data, null, 2),
      "utf8"
    );
    return true;
  } catch (error) {
    console.error("Error saving vocabulary index to file:", error);
    return false;
  }
};

// Đọc dữ liệu từ file type riêng biệt
const readVocabularyTypeFromFile = (typeName) => {
  ensureVocabularyTypesDirectory();
  const typeFile = path.join(VOCABULARY_TYPES_DIR, `${typeName}.json`);

  if (!fs.existsSync(typeFile)) {
    initializeVocabularyFromPublic();

    if (!fs.existsSync(typeFile)) {
      return {
        type: typeName,
        terms: [],
      };
    }
  }

  try {
    const data = fs.readFileSync(typeFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading vocabulary type file ${typeName}:`, error);
    return {
      type: typeName,
      terms: [],
    };
  }
};

// Lưu dữ liệu cho một loại từ vựng
const saveVocabularyTypeToFile = (typeName, data) => {
  ensureVocabularyTypesDirectory();
  const typeFile = path.join(VOCABULARY_TYPES_DIR, `${typeName}.json`);

  try {
    fs.writeFileSync(typeFile, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error(`Error saving vocabulary type ${typeName} to file:`, error);
    return false;
  }
};

// Endpoint để lấy tất cả từ vựng
app.get("/api/vocabulary", (req, res) => {
  try {
    const data = readAllVocabularyFromFile();
    res.json(data);
  } catch (error) {
    console.error("Error getting vocabulary:", error);
    res.status(500).json({ error: "Failed to retrieve vocabulary" });
  }
});

// Endpoint để lấy thông tin index (metadata và available types)
app.get("/api/vocabulary/index", (req, res) => {
  try {
    const data = readVocabularyIndexFromFile();
    res.json(data);
  } catch (error) {
    console.error("Error getting vocabulary index:", error);
    res.status(500).json({ error: "Failed to retrieve vocabulary index" });
  }
});

// Endpoint để lấy từ vựng theo loại
app.get("/api/vocabulary/types/:typeName", (req, res) => {
  try {
    const { typeName } = req.params;
    const data = readVocabularyTypeFromFile(typeName);
    res.json(data);
  } catch (error) {
    console.error(
      `Error getting vocabulary for type ${req.params.typeName}:`,
      error
    );
    res.status(500).json({
      error: `Failed to retrieve vocabulary for type ${req.params.typeName}`,
    });
  }
});

// Endpoint để thêm từ vựng mới
app.post("/api/vocabulary", (req, res) => {
  try {
    const data = readAllVocabularyFromFile();
    const newTerm = req.body;

    // Đảm bảo dữ liệu hợp lệ
    if (!newTerm.id || !newTerm.term || !newTerm.definition || !newTerm.type) {
      return res.status(400).json({ error: "Invalid vocabulary data" });
    }

    // Kiểm tra xem ID đã tồn tại chưa
    const existingIndex = data.vocabulary.findIndex(
      (item) => item.id === newTerm.id
    );
    if (existingIndex >= 0) {
      data.vocabulary[existingIndex] = newTerm;
    } else {
      data.vocabulary.push(newTerm);
    }

    // Cập nhật metadata
    data.metadata.lastUpdated = new Date().toISOString();

    if (saveAllVocabularyToFile(data)) {
      // Cập nhật file type tương ứng
      const typeData = readVocabularyTypeFromFile(newTerm.type);

      const existingTypeIndex = typeData.terms.findIndex(
        (item) => item.id === newTerm.id
      );
      if (existingTypeIndex >= 0) {
        typeData.terms[existingTypeIndex] = newTerm;
      } else {
        typeData.terms.push(newTerm);
      }

      saveVocabularyTypeToFile(newTerm.type, typeData);

      // Cập nhật index file
      const indexData = readVocabularyIndexFromFile();
      const typeIndex = indexData.availableTypes.findIndex(
        (type) => type.type === newTerm.type
      );

      if (typeIndex >= 0) {
        indexData.availableTypes[typeIndex].count = typeData.terms.length;
      } else {
        indexData.availableTypes.push({
          type: newTerm.type,
          count: 1,
          file: `types/${newTerm.type}.json`,
        });
      }

      indexData.metadata.totalTerms = data.vocabulary.length;
      indexData.metadata.lastUpdated = new Date().toISOString();

      // Đảm bảo categories có chứa tất cả các category hiện có
      if (
        newTerm.category &&
        !indexData.metadata.categories.includes(newTerm.category)
      ) {
        indexData.metadata.categories.push(newTerm.category);
      }

      saveVocabularyIndexToFile(indexData);

      res.status(201).json(newTerm);
    } else {
      res.status(500).json({ error: "Failed to save vocabulary term" });
    }
  } catch (error) {
    console.error("Error saving vocabulary term:", error);
    res.status(500).json({ error: "Failed to save vocabulary term" });
  }
});

// Endpoint để cập nhật từ vựng
app.put("/api/vocabulary/:id", (req, res) => {
  try {
    const { id } = req.params;
    const data = readAllVocabularyFromFile();
    const updatedTerm = req.body;

    // Đảm bảo dữ liệu hợp lệ
    if (!updatedTerm.term || !updatedTerm.definition || !updatedTerm.type) {
      return res.status(400).json({ error: "Invalid vocabulary data" });
    }

    // Tìm từ vựng cần cập nhật
    const index = data.vocabulary.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Vocabulary term not found" });
    }

    const oldType = data.vocabulary[index].type;
    const newType = updatedTerm.type;

    // Cập nhật từ trong all.json
    updatedTerm.id = id; // Đảm bảo ID không bị thay đổi
    data.vocabulary[index] = updatedTerm;
    data.metadata.lastUpdated = new Date().toISOString();

    if (saveAllVocabularyToFile(data)) {
      // Nếu type thay đổi, cập nhật cả hai file type
      if (oldType !== newType) {
        // Xóa từ file type cũ
        const oldTypeData = readVocabularyTypeFromFile(oldType);
        oldTypeData.terms = oldTypeData.terms.filter((item) => item.id !== id);
        saveVocabularyTypeToFile(oldType, oldTypeData);

        // Thêm vào file type mới
        const newTypeData = readVocabularyTypeFromFile(newType);
        newTypeData.terms.push(updatedTerm);
        saveVocabularyTypeToFile(newType, newTypeData);
      } else {
        // Cập nhật file type hiện tại
        const typeData = readVocabularyTypeFromFile(newType);
        const typeIndex = typeData.terms.findIndex((item) => item.id === id);

        if (typeIndex >= 0) {
          typeData.terms[typeIndex] = updatedTerm;
        } else {
          typeData.terms.push(updatedTerm);
        }

        saveVocabularyTypeToFile(newType, typeData);
      }

      // Cập nhật index file
      const indexData = readVocabularyIndexFromFile();

      // Cập nhật count cho các type
      if (oldType !== newType) {
        const oldTypeIndex = indexData.availableTypes.findIndex(
          (type) => type.type === oldType
        );
        const newTypeIndex = indexData.availableTypes.findIndex(
          (type) => type.type === newType
        );

        if (oldTypeIndex >= 0) {
          const oldTypeData = readVocabularyTypeFromFile(oldType);
          indexData.availableTypes[oldTypeIndex].count =
            oldTypeData.terms.length;
        }

        if (newTypeIndex >= 0) {
          const newTypeData = readVocabularyTypeFromFile(newType);
          indexData.availableTypes[newTypeIndex].count =
            newTypeData.terms.length;
        } else {
          indexData.availableTypes.push({
            type: newType,
            count: 1,
            file: `types/${newType}.json`,
          });
        }
      }

      // Đảm bảo categories có chứa tất cả các category hiện có
      if (
        updatedTerm.category &&
        !indexData.metadata.categories.includes(updatedTerm.category)
      ) {
        indexData.metadata.categories.push(updatedTerm.category);
      }

      indexData.metadata.lastUpdated = new Date().toISOString();
      saveVocabularyIndexToFile(indexData);

      res.json(updatedTerm);
    } else {
      res.status(500).json({ error: "Failed to update vocabulary term" });
    }
  } catch (error) {
    console.error("Error updating vocabulary term:", error);
    res.status(500).json({ error: "Failed to update vocabulary term" });
  }
});

// Endpoint để xóa từ vựng
app.delete("/api/vocabulary/:id", (req, res) => {
  try {
    const { id } = req.params;
    const data = readAllVocabularyFromFile();

    // Tìm từ vựng cần xóa
    const index = data.vocabulary.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Vocabulary term not found" });
    }

    const termType = data.vocabulary[index].type;

    // Xóa từ all.json
    data.vocabulary.splice(index, 1);
    data.metadata.lastUpdated = new Date().toISOString();

    if (saveAllVocabularyToFile(data)) {
      // Xóa từ file type tương ứng
      const typeData = readVocabularyTypeFromFile(termType);
      typeData.terms = typeData.terms.filter((item) => item.id !== id);
      saveVocabularyTypeToFile(termType, typeData);

      // Cập nhật index file
      const indexData = readVocabularyIndexFromFile();
      const typeIndex = indexData.availableTypes.findIndex(
        (type) => type.type === termType
      );

      if (typeIndex >= 0) {
        indexData.availableTypes[typeIndex].count = typeData.terms.length;
      }

      indexData.metadata.totalTerms = data.vocabulary.length;
      indexData.metadata.lastUpdated = new Date().toISOString();
      saveVocabularyIndexToFile(indexData);

      res.json({ success: true });
    } else {
      res.status(500).json({ error: "Failed to delete vocabulary term" });
    }
  } catch (error) {
    console.error("Error deleting vocabulary term:", error);
    res.status(500).json({ error: "Failed to delete vocabulary term" });
  }
});

// Xử lý các route không tìm thấy - Phục vụ React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  ensureDataDirectory();
  console.log(`Sentences will be stored in: ${SENTENCES_FILE}`);
  console.log(`Vocabulary types will be stored in: ${TYPES_FILE}`);
});
