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

// Đảm bảo thư mục data tồn tại
const ensureDataDirectory = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
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
      return res
        .status(404)
        .json({
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
