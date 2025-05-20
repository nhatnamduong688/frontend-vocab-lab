import { Vocabulary } from '../types/vocabulary';

interface SavedSentence {
  id: string;
  text: string;
  words: Vocabulary[];
  timestamp: number;
}

interface SavedSentencesData {
  sentences: SavedSentence[];
}

// Tạo ID ngẫu nhiên
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 12);
};

// Lưu câu vào localStorage
export const saveSentence = (words: Vocabulary[]): SavedSentence => {
  const sentence: SavedSentence = {
    id: generateId(),
    text: words.map(word => word.term).join(' '),
    words,
    timestamp: Date.now()
  };

  // Lấy dữ liệu đã lưu
  const savedData = localStorage.getItem('saved_sentences');
  let sentencesData: SavedSentencesData;

  if (savedData) {
    sentencesData = JSON.parse(savedData);
    sentencesData.sentences.push(sentence);
  } else {
    sentencesData = {
      sentences: [sentence]
    };
  }

  // Lưu lại vào localStorage
  localStorage.setItem('saved_sentences', JSON.stringify(sentencesData));

  return sentence;
};

// Lấy tất cả câu đã lưu
export const getSavedSentences = (): SavedSentence[] => {
  const savedData = localStorage.getItem('saved_sentences');
  if (!savedData) {
    return [];
  }

  const sentencesData: SavedSentencesData = JSON.parse(savedData);
  return sentencesData.sentences;
};

// Xóa một câu đã lưu
export const deleteSentence = (id: string): void => {
  const savedData = localStorage.getItem('saved_sentences');
  if (!savedData) {
    return;
  }

  const sentencesData: SavedSentencesData = JSON.parse(savedData);
  sentencesData.sentences = sentencesData.sentences.filter(sentence => sentence.id !== id);
  localStorage.setItem('saved_sentences', JSON.stringify(sentencesData));
};

// Tạo nội dung Markdown cho các câu đã lưu
export const createSentencesMarkdown = (): string => {
  const sentences = getSavedSentences();
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
export const displaySentencesAsMarkdown = (): void => {
  const markdown = createSentencesMarkdown();
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

// Xuất các câu đã lưu ra file
export const exportSentencesToFile = (): void => {
  const sentences = getSavedSentences();
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
  a.download = `saved-sentences-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  // Cleanup
  URL.revokeObjectURL(url);
}; 