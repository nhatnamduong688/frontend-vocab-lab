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

// Đường dẫn đến file lưu trữ câu
const DATA_FILE = path.join(__dirname, "data", "sentences.json");

// Đảm bảo thư mục data tồn tại
const ensureDataDirectory = () => {
  const dataDir = path.join(__dirname, "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Đọc dữ liệu từ file
const readSentencesFromFile = () => {
  ensureDataDirectory();
  if (!fs.existsSync(DATA_FILE)) {
    return { sentences: [] };
  }

  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
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
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error saving sentences to file:", error);
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

// Xử lý các route không tìm thấy - Phục vụ React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  ensureDataDirectory();
  console.log(`Data will be stored in: ${DATA_FILE}`);
});
