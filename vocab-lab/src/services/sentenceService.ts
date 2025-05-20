import { Vocabulary } from '../types/vocabulary';

interface SavedSentence {
  id: string;
  text: string;
  words: Vocabulary[];
  timestamp: number;
}

export interface SavedSentencesData {
  sentences: SavedSentence[];
}

// API URL - có thể thay đổi trong file .env
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Khóa lưu trữ trong localStorage (dùng làm cache và fallback)
const STORAGE_KEY = 'saved_sentences';
// Tên file mặc định khi xuất
const DEFAULT_EXPORT_FILENAME = 'vocabulary-sentences';

// Tạo ID ngẫu nhiên
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 12);
};

// Lưu câu vào file thông qua API và localStorage làm backup
export const saveSentence = async (words: Vocabulary[]): Promise<SavedSentence> => {
  const sentence: SavedSentence = {
    id: generateId(),
    text: words.map(word => word.term).join(' '),
    words,
    timestamp: Date.now()
  };

  try {
    // Gửi dữ liệu lên API
    const response = await fetch(`${API_URL}/sentences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sentence),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Nếu API thành công, cũng lưu vào localStorage làm cache
    const savedData = localStorage.getItem(STORAGE_KEY);
    let sentencesData: SavedSentencesData;

    if (savedData) {
      sentencesData = JSON.parse(savedData);
      sentencesData.sentences.push(sentence);
    } else {
      sentencesData = {
        sentences: [sentence]
      };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sentencesData));
    return sentence;
  } catch (error) {
    console.error('Failed to save sentence to API, saving to localStorage only:', error);
    
    // Fallback: lưu vào localStorage nếu API thất bại
    const savedData = localStorage.getItem(STORAGE_KEY);
    let sentencesData: SavedSentencesData;

    if (savedData) {
      sentencesData = JSON.parse(savedData);
      sentencesData.sentences.push(sentence);
    } else {
      sentencesData = {
        sentences: [sentence]
      };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sentencesData));
    return sentence;
  }
};

// Lấy tất cả câu đã lưu từ API, fallback về localStorage nếu API thất bại
export const getSavedSentences = async (): Promise<SavedSentence[]> => {
  try {
    // Lấy dữ liệu từ API
    const response = await fetch(`${API_URL}/sentences`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json() as SavedSentencesData;
    
    // Cập nhật lại localStorage với dữ liệu từ API
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    return data.sentences;
  } catch (error) {
    console.error('Failed to load sentences from API, using localStorage:', error);
    
    // Fallback: sử dụng localStorage nếu API thất bại
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) {
      return [];
    }

    const sentencesData: SavedSentencesData = JSON.parse(savedData);
    return sentencesData.sentences;
  }
};

// Xóa một câu đã lưu qua API, fallback về localStorage nếu API thất bại
export const deleteSentence = async (id: string): Promise<void> => {
  try {
    // Xóa qua API
    const response = await fetch(`${API_URL}/sentences/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Nếu API thành công, cũng xóa khỏi localStorage
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const sentencesData: SavedSentencesData = JSON.parse(savedData);
      sentencesData.sentences = sentencesData.sentences.filter(sentence => sentence.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sentencesData));
    }
  } catch (error) {
    console.error('Failed to delete sentence from API, using localStorage only:', error);
    
    // Fallback: chỉ xóa từ localStorage nếu API thất bại
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) {
      return;
    }

    const sentencesData: SavedSentencesData = JSON.parse(savedData);
    sentencesData.sentences = sentencesData.sentences.filter(sentence => sentence.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sentencesData));
  }
};

// Xóa tất cả câu đã lưu qua API, fallback về localStorage nếu API thất bại
export const clearAllSentences = async (): Promise<void> => {
  try {
    // Xóa qua API
    const response = await fetch(`${API_URL}/sentences`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Nếu API thành công, cũng xóa khỏi localStorage
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear sentences from API, using localStorage only:', error);
    
    // Fallback: chỉ xóa từ localStorage nếu API thất bại
    localStorage.removeItem(STORAGE_KEY);
  }
};

// Tạo nội dung Markdown cho các câu đã lưu
export const createSentencesMarkdown = async (): Promise<string> => {
  const sentences = await getSavedSentences();
  if (sentences.length === 0) {
    return '';
  }

  const today = new Date().toISOString().split('T')[0];
  
  let markdown = `# Saved Sentences (${today})\n\n`;
  markdown += `Total: ${sentences.length} sentences\n\n`;
  
  sentences.forEach((sentence, index) => {
    const date = new Date(sentence.timestamp).toLocaleString();
    markdown += `## Sentence ${index + 1}\n\n`;
    markdown += `**Sentence:** ${sentence.text}\n\n`;
    markdown += `**Created:** ${date}\n\n`;
    
    if (sentence.words.length > 0) {
      markdown += '**Words:**\n\n';
      
      sentence.words.forEach(word => {
        markdown += `- **${word.term}** (${word.type}): ${word.definition}\n`;
      });
      
      markdown += '\n';
    }
    
    markdown += '---\n\n';
  });
  
  return markdown;
};

// Tạo cửa sổ mới và hiển thị markdown
export const displaySentencesAsMarkdown = async (): Promise<void> => {
  const markdown = await createSentencesMarkdown();
  if (!markdown) {
    return;
  }
  
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(`
      <html>
      <head>
        <title>Saved Sentences</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          pre {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            white-space: pre-wrap;
          }
          button {
            padding: 8px 16px;
            background-color: #1976d2;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 20px;
            font-size: 14px;
          }
          button:hover {
            background-color: #1565c0;
          }
        </style>
      </head>
      <body>
        <button id="copyBtn">Copy to Clipboard</button>
        <pre>${markdown}</pre>
        <script>
          document.getElementById('copyBtn').addEventListener('click', function() {
            const pre = document.querySelector('pre');
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(pre);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
            selection.removeAllRanges();
            this.textContent = 'Copied!';
            setTimeout(() => { this.textContent = 'Copy to Clipboard'; }, 2000);
          });
        </script>
      </body>
      </html>
    `);
    newWindow.document.close();
  }
};

// Xuất các câu đã lưu ra file JSON
export const exportSentencesToFile = async (filename = DEFAULT_EXPORT_FILENAME): Promise<void> => {
  const sentences = await getSavedSentences();
  if (sentences.length === 0) {
    return;
  }

  // Định dạng dữ liệu cho file
  const data = {
    exportDate: new Date().toISOString(),
    totalSentences: sentences.length,
    sentences: sentences.map(sentence => ({
      sentence: sentence.text,
      createdAt: new Date(sentence.timestamp).toLocaleString(),
      words: sentence.words.map(word => ({
        term: word.term,
        type: word.type,
        definition: word.definition
      }))
    }))
  };

  // Tạo Blob và tải xuống file
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Tạo link để download
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  // Cleanup
  URL.revokeObjectURL(url);
};

// Xuất các câu đã lưu ra file Markdown
export const exportSentencesToMarkdownFile = async (filename = DEFAULT_EXPORT_FILENAME): Promise<void> => {
  const markdown = await createSentencesMarkdown();
  if (!markdown) {
    return;
  }

  // Tạo Blob và tải xuống file
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  
  // Tạo link để download
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().split('T')[0]}.md`;
  a.click();
  
  // Cleanup
  URL.revokeObjectURL(url);
}; 