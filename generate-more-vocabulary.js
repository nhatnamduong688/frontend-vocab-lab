const fs = require("fs");
const path = require("path");

// Đường dẫn đến file all.json
const ALL_VOCAB_PATH = path.resolve(
  __dirname,
  "./vocab-lab/public/vocabulary/all.json"
);

// Đọc file all.json hiện tại
console.log("Đọc file từ vựng hiện tại...");
let allVocabData;
try {
  allVocabData = JSON.parse(fs.readFileSync(ALL_VOCAB_PATH, "utf8"));
} catch (error) {
  console.error("Lỗi khi đọc file từ vựng:", error);
  // Tạo cấu trúc mới nếu file không tồn tại
  allVocabData = {
    metadata: {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      totalTerms: 0,
      categories: [
        "Programming Concepts",
        "Data Structures",
        "Development Process",
        "Web Development",
        "Software Architecture",
        "Frontend Frameworks",
        "CSS Concepts",
        "Browser APIs",
        "TypeScript",
        "Performance",
      ],
    },
    vocabulary: [],
  };
}

// Tạo ID ngẫu nhiên
function generateId() {
  return Math.random().toString(36).substring(2, 12);
}

// Các loại từ vựng mới
const additionalTypes = [
  "framework",
  "pattern",
  "concept",
  "technique",
  "library",
  "best practice",
  "tool",
  "API",
  "protocol",
  "technology",
];

// Từ vựng mới cần thêm vào
const newVocabulary = [
  {
    term: "React",
    definition:
      "A JavaScript library for building user interfaces, particularly single-page applications.",
    type: "framework",
    difficulty: "medium",
    category: "Frontend Frameworks",
    example:
      "React components are reusable pieces of code that return React elements describing what should appear on the screen.",
    interviewImportance: "high",
  },
  {
    term: "Vue",
    definition:
      "A progressive JavaScript framework for building user interfaces with a focus on declarative rendering and component composition.",
    type: "framework",
    difficulty: "medium",
    category: "Frontend Frameworks",
    example:
      "Vue combines the best aspects of Angular and React while being more lightweight and flexible.",
    interviewImportance: "medium",
  },
  {
    term: "Angular",
    definition:
      "A platform and framework for building single-page client applications using HTML and TypeScript.",
    type: "framework",
    difficulty: "hard",
    category: "Frontend Frameworks",
    example:
      "Angular provides built-in features like routing, form validation, and HTTP client.",
    interviewImportance: "medium",
  },
  {
    term: "CSS Grid",
    definition:
      "A two-dimensional grid-based layout system designed for organizing content on web pages.",
    type: "technique",
    difficulty: "medium",
    category: "CSS Concepts",
    example:
      "CSS Grid allows developers to create complex layouts with rows and columns simultaneously.",
    interviewImportance: "medium",
  },
  {
    term: "Flexbox",
    definition:
      "A one-dimensional layout method for arranging items in rows or columns, with flexible container dimensions.",
    type: "technique",
    difficulty: "medium",
    category: "CSS Concepts",
    example:
      "Flexbox makes it simple to align items and distribute space within a container.",
    interviewImportance: "high",
  },
  {
    term: "Redux",
    definition:
      "A predictable state container for JavaScript apps, often used with React for managing application state.",
    type: "library",
    difficulty: "hard",
    category: "Frontend Frameworks",
    example:
      "Redux maintains the state of an entire application in a single immutable state tree.",
    interviewImportance: "high",
  },
  {
    term: "TypeScript",
    definition:
      "A strongly typed programming language that builds on JavaScript, adding static type definitions.",
    type: "technology",
    difficulty: "medium",
    category: "TypeScript",
    example:
      "TypeScript helps catch errors during development through type checking and code completion.",
    interviewImportance: "high",
  },
  {
    term: "Webpack",
    definition:
      "A static module bundler for modern JavaScript applications that processes applications with a dependency graph.",
    type: "tool",
    difficulty: "hard",
    category: "Development Process",
    example:
      "Webpack can handle not only JavaScript but also assets like HTML, CSS, and images with appropriate loaders.",
    interviewImportance: "medium",
  },
  {
    term: "REST API",
    definition:
      "An architectural style for designing networked applications using HTTP requests to access and manipulate data.",
    type: "API",
    difficulty: "medium",
    category: "Web Development",
    example:
      "RESTful APIs use HTTP methods like GET, POST, PUT, and DELETE to perform CRUD operations.",
    interviewImportance: "high",
  },
  {
    term: "GraphQL",
    definition:
      "A query language for APIs and a runtime for executing those queries with existing data.",
    type: "API",
    difficulty: "hard",
    category: "Web Development",
    example:
      "GraphQL allows clients to request exactly what they need, making API responses more efficient.",
    interviewImportance: "medium",
  },
  {
    term: "Progressive Web App",
    definition:
      "Web applications that use modern web capabilities to deliver app-like experiences to users.",
    type: "concept",
    difficulty: "medium",
    category: "Web Development",
    example:
      "PWAs can work offline, send push notifications, and can be installed on home screens.",
    interviewImportance: "medium",
  },
  {
    term: "Web Components",
    definition:
      "A set of web platform APIs that allow you to create new custom, reusable, encapsulated HTML tags.",
    type: "technology",
    difficulty: "medium",
    category: "Web Development",
    example:
      "Web Components consist of Custom Elements, Shadow DOM, and HTML Templates.",
    interviewImportance: "low",
  },
  {
    term: "Code Splitting",
    definition:
      "The technique of splitting your code into various bundles which can then be loaded on demand.",
    type: "technique",
    difficulty: "medium",
    category: "Performance",
    example:
      "Code splitting prevents loading unnecessary code and reduces initial load time.",
    interviewImportance: "medium",
  },
  {
    term: "Intersection Observer",
    definition:
      "Browser API that provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element.",
    type: "API",
    difficulty: "medium",
    category: "Browser APIs",
    example:
      "Intersection Observer is commonly used for lazy loading images and implementing infinite scroll.",
    interviewImportance: "low",
  },
  {
    term: "Micro-Frontends",
    definition:
      "An architectural style where independently deliverable frontend applications are composed into a greater whole.",
    type: "pattern",
    difficulty: "hard",
    category: "Software Architecture",
    example:
      "Micro-frontends allow teams to work independently on different parts of a frontend application.",
    interviewImportance: "medium",
  },
  {
    term: "CSS-in-JS",
    definition:
      "A styling technique where JavaScript is used to style components, eliminating the need for CSS stylesheets.",
    type: "technique",
    difficulty: "medium",
    category: "CSS Concepts",
    example:
      "Libraries like styled-components and Emotion allow developers to write CSS directly within JavaScript files.",
    interviewImportance: "medium",
  },
  {
    term: "Web Accessibility",
    definition:
      "The practice of making websites usable by as many people as possible, including those with disabilities.",
    type: "best practice",
    difficulty: "medium",
    category: "Web Development",
    example:
      "WCAG guidelines provide standards for creating accessible web content for users with diverse abilities.",
    interviewImportance: "high",
  },
  {
    term: "Server-Side Rendering",
    definition:
      "The process of rendering web pages on the server before sending them to the browser.",
    type: "technique",
    difficulty: "hard",
    category: "Performance",
    example:
      "Next.js is a popular framework that provides server-side rendering capabilities for React applications.",
    interviewImportance: "medium",
  },
  {
    term: "Web Sockets",
    definition:
      "A communication protocol that provides full-duplex communication channels over a single TCP connection.",
    type: "protocol",
    difficulty: "medium",
    category: "Web Development",
    example:
      "Web Sockets are commonly used for real-time applications like chat and live notifications.",
    interviewImportance: "medium",
  },
  {
    term: "JAMstack",
    definition:
      "A modern web development architecture based on client-side JavaScript, reusable APIs, and prebuilt Markup.",
    type: "concept",
    difficulty: "medium",
    category: "Software Architecture",
    example:
      "JAMstack websites deliver better performance, higher security, and lower cost of scaling.",
    interviewImportance: "low",
  },
];

// Thêm metadata bổ sung cho từng từ vựng mới
const enrichedVocabulary = newVocabulary.map((item) => ({
  id: generateId(),
  frequency: Math.floor(Math.random() * 100),
  description: item.definition,
  relatedTerms: [],
  codeExample: "",
  commonQuestions: [],
  createdAt: Date.now(),
  ...item,
}));

// Thêm từ vựng mới vào dữ liệu hiện có, tránh trùng lặp
const existingTerms = new Set(
  allVocabData.vocabulary.map((item) => item.term.toLowerCase())
);
const filteredNewVocabulary = enrichedVocabulary.filter(
  (item) => !existingTerms.has(item.term.toLowerCase())
);

console.log(`Thêm ${filteredNewVocabulary.length} từ vựng mới...`);
allVocabData.vocabulary = [
  ...allVocabData.vocabulary,
  ...filteredNewVocabulary,
];

// Cập nhật metadata
allVocabData.metadata.totalTerms = allVocabData.vocabulary.length;
allVocabData.metadata.lastUpdated = new Date().toISOString();

// Cập nhật danh sách categories (loại bỏ trùng lặp)
const uniqueCategories = new Set([
  ...allVocabData.metadata.categories,
  ...Array.from(new Set(filteredNewVocabulary.map((item) => item.category))),
]);
allVocabData.metadata.categories = Array.from(uniqueCategories);

// Lưu file cập nhật
fs.writeFileSync(ALL_VOCAB_PATH, JSON.stringify(allVocabData, null, 2), "utf8");
console.log(
  `Đã cập nhật file từ vựng với tổng số ${allVocabData.vocabulary.length} từ.`
);
console.log(
  'Chạy lệnh "npm run dev" để phân loại từ vựng và khởi động ứng dụng.'
);
