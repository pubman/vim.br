import { TaskTemplate } from '../types/Task';

export const TASK_TEMPLATES: TaskTemplate[] = [
  // ===== BEGINNER LEVEL TASKS =====
  // Basic navigation motions: h, j, k, l, w, b, e, 0, $

  {
    title: 'Navigate to the exclamation mark in "Trainer!"',
    description: 'Use $ to jump to the end of the line and position your cursor on the exclamation mark',
    baseCode: `const message = "Welcome to VimMotion Trainer!";`,
    transformations: [],
    difficulty: 'beginner',
    category: 'navigation',
    focusMotions: ['$'],
    weight: 1.0,
    successConditions: {
      type: 'cursor-position',
      cursor: { line: 0, column: 41 }, // Position of '!' character
      description: 'Cursor positioned on the exclamation mark at the end of "Trainer!"'
    }
  },

  {
    title: 'Navigate to the very beginning of the indented line',
    description: 'Use 0 to jump to column 0, before the indentation spaces',
    baseCode: `    const indentedVariable = "practice with indentation";`,
    transformations: [],
    difficulty: 'beginner',
    category: 'navigation',
    focusMotions: ['0'],
    weight: 1.0,
    successConditions: {
      type: 'cursor-position',
      cursor: { line: 0, column: 0 }, // Very beginning of line
      description: 'Cursor positioned at column 0, before the indentation'
    }
  },

  {
    title: 'Navigate from "function" to "firstNumber"',
    description: 'Use w to move forward word by word until you reach "firstNumber" parameter',
    baseCode: `function calculateSum(firstNumber, secondNumber) {
  return firstNumber + secondNumber;
}`,
    transformations: [],
    difficulty: 'beginner',
    category: 'navigation',
    focusMotions: ['w', 'b'],
    weight: 1.5,
    successConditions: {
      type: 'cursor-position',
      cursor: { line: 0, column: 19 }, // Start of "firstNumber"
      description: 'Cursor positioned at the start of "firstNumber" parameter'
    }
  },

  {
    title: 'Navigate to the end of "userSettings"',
    description: 'Use e to jump to the last letter "s" in "userSettings"',
    baseCode: `const userSettings = {
  theme: 'dark',
  fontSize: 14,
  autoSave: true
};`,
    transformations: [],
    difficulty: 'beginner',
    category: 'navigation',
    focusMotions: ['e'],
    weight: 1.0,
    successConditions: {
      type: 'cursor-position',
      cursor: { line: 0, column: 17 }, // End of "userSettings" (last 's')
      description: 'Cursor positioned at the end of "userSettings" on the final "s"'
    }
  },

  {
    title: 'Navigate down to the "cherry" line',
    description: 'Use j to move down the array until your cursor is on the line containing "cherry"',
    baseCode: `const fruits = [
  'apple',
  'banana',
  'cherry',
  'date',
  'elderberry'
];`,
    transformations: [],
    difficulty: 'beginner',
    category: 'navigation',
    focusMotions: ['j', 'k'],
    weight: 1.0,
    successConditions: {
      type: 'cursor-position',
      cursor: { line: 3, column: 2 }, // Line with 'cherry', positioned at start of string
      description: 'Cursor positioned on line 4 at the beginning of "cherry"'
    }
  },

  // ===== INTERMEDIATE LEVEL TASKS =====
  // Line navigation, search, first non-blank character

  {
    title: 'Navigate to "const" in the indented line',
    description: 'Use ^ to jump to the first non-whitespace character on the indented line with "const data"',
    baseCode: `function processData() {
    const data = fetchData();

    if (data) {
        return processResults(data);
    }

    return null;
}`,
    transformations: [],
    difficulty: 'intermediate',
    category: 'navigation',
    focusMotions: ['^'],
    weight: 1.0,
    successConditions: {
      type: 'cursor-position',
      cursor: { line: 1, column: 4 }, // Start of "const" after indentation
      description: 'Cursor positioned at the start of "const" on the indented line'
    }
  },

  {
    title: 'Find the underscore in "api_key"',
    description: 'Use f_ to find and navigate to the underscore character in "api_key"',
    baseCode: `const config = { api_key: "abc123", timeout: 5000, retries: 3 };`,
    transformations: [],
    difficulty: 'intermediate',
    category: 'search',
    focusMotions: ['f'],
    weight: 1.5,
    successConditions: {
      type: 'cursor-position',
      cursor: { line: 0, column: 20 }, // Position of '_' in "api_key"
      description: 'Cursor positioned on the underscore in "api_key"'
    }
  },

  {
    title: 'Find the first dot in the email regex backwards',
    description: 'Starting from the end, use F. to find the first dot character backwards in the regex',
    baseCode: `const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;`,
    transformations: [],
    difficulty: 'intermediate',
    category: 'search',
    focusMotions: ['F'],
    weight: 1.0,
    successConditions: {
      type: 'cursor-position',
      cursor: { line: 0, column: 47 }, // Position of '.' before the escape sequence
      description: 'Cursor positioned on the dot before the escaped dot sequence'
    }
  },

  {
    title: 'Navigate till the opening parenthesis in "formatName("',
    description: 'Use t( to move till (before) the opening parenthesis in the function call',
    baseCode: `function formatName(firstName, lastName) {
  return firstName + " " + lastName;
}`,
    transformations: [],
    difficulty: 'intermediate',
    category: 'search',
    focusMotions: ['t', 'T'],
    weight: 1.0,
    successConditions: {
      type: 'cursor-position',
      cursor: { line: 0, column: 17 }, // Position just before '(' in "formatName("
      description: 'Cursor positioned just before the opening parenthesis in "formatName("'
    }
  },

  {
    title: 'Jump to beginning and end',
    description: 'Use gg to go to first line and G to go to last line',
    baseCode: `// Header comment
class DatabaseManager {
  constructor() {
    this.connection = null;
  }

  connect() {
    // Connection logic here
    this.connection = createConnection();
  }

  disconnect() {
    if (this.connection) {
      this.connection.close();
    }
  }
}
// End of file`,
    transformations: [],
    difficulty: 'intermediate',
    category: 'navigation',
    focusMotions: ['gg', 'G'],
    weight: 1.0
  },

  {
    title: 'Search for patterns',
    description: 'Use /pattern to search forward and ?pattern to search backward',
    baseCode: `const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Charlie', role: 'admin' },
  { name: 'David', role: 'user' }
];`,
    transformations: [],
    difficulty: 'intermediate',
    category: 'search',
    focusMotions: ['/', '?', 'n', 'N'],
    weight: 1.0
  },

  // ===== ADVANCED LEVEL TASKS =====
  // Text objects, complex combinations

  {
    title: 'Select the word "trimmedInput" using text objects',
    description: 'Navigate to "trimmedInput" and use iw to select the inner word',
    baseCode: `function validateInput(userInput) {
  const trimmedInput = userInput.trim();

  if (trimmedInput.length === 0) {
    throw new Error('Input cannot be empty');
  }

  return trimmedInput;
}`,
    transformations: [],
    difficulty: 'advanced',
    category: 'text-objects',
    focusMotions: ['iw', 'aw'],
    weight: 1.5,
    successConditions: {
      type: 'text-contains',
      contains: ['trimmedInput'],
      cursor: { line: 1, column: 8 }, // Position within "trimmedInput"
      description: 'Word "trimmedInput" selected using inner word text object'
    }
  },

  {
    title: 'Select text inside quotes for "Operation completed successfully"',
    description: 'Navigate to the success message and use i" to select the text inside the quotes',
    baseCode: `const messages = {
  success: "Operation completed successfully",
  error: "An error occurred while processing",
  warning: "Please check your input"
};`,
    transformations: [],
    difficulty: 'advanced',
    category: 'text-objects',
    focusMotions: ['i"', 'a"', "i'", "a'"],
    weight: 1.5,
    successConditions: {
      type: 'text-contains',
      contains: ['Operation completed successfully'],
      cursor: { line: 1, column: 12 }, // Position within the quoted text
      description: 'Text inside quotes "Operation completed successfully" selected'
    }
  },

  {
    title: 'Navigate parentheses and brackets',
    description: 'Use i( a( i[ a[ i{ a{ to work with different bracket types',
    baseCode: `const complexObject = {
  nested: {
    array: [1, 2, { key: 'value' }],
    function: (x, y) => {
      return Math.max(x, y);
    }
  }
};`,
    transformations: [],
    difficulty: 'advanced',
    category: 'text-objects',
    focusMotions: ['i(', 'a(', 'i[', 'a[', 'i{', 'a{'],
    weight: 1.0
  },

  {
    title: 'Combine motions with operators',
    description: 'Practice using ci, ca, di, da with text objects',
    baseCode: `function processUser(userData) {
  const { name, email, preferences } = userData;

  if (!isValidEmail(email)) {
    throw new ValidationError('Invalid email format');
  }

  return createUserProfile(name, email, preferences);
}`,
    transformations: [],
    difficulty: 'advanced',
    category: 'editing',
    focusMotions: ['ci', 'ca', 'di', 'da'],
    weight: 1.5
  },

  // ===== EXPERT LEVEL TASKS =====
  // Complex combinations, optimization challenges

  {
    title: 'Match brackets and parentheses',
    description: 'Use % to jump between matching brackets',
    baseCode: `function fibonacci(n) {
  if (n <= 1) {
    return n;
  }

  const memo = {};

  function fib(num) {
    if (num in memo) {
      return memo[num];
    }

    memo[num] = fib(num - 1) + fib(num - 2);
    return memo[num];
  }

  return fib(n);
}`,
    transformations: [],
    difficulty: 'expert',
    category: 'navigation',
    focusMotions: ['%'],
    weight: 1.0
  },

  {
    title: 'Search for word under cursor',
    description: 'Use * to search forward and # to search backward for current word',
    baseCode: `class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        callback(...args);
      });
    }
  }
}`,
    transformations: [],
    difficulty: 'expert',
    category: 'search',
    focusMotions: ['*', '#'],
    weight: 1.0
  },

  {
    title: 'Navigate code blocks',
    description: 'Use { and } to move between paragraphs/blocks',
    baseCode: `// Configuration setup
const config = {
  development: {
    database: 'dev_db',
    debug: true
  },

  production: {
    database: 'prod_db',
    debug: false
  }
};

// Helper functions
function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

function getConfig() {
  return isDevelopment() ? config.development : config.production;
}

// Main application logic
function startApplication() {
  const currentConfig = getConfig();
  console.log('Starting with config:', currentConfig);
}`,
    transformations: [],
    difficulty: 'expert',
    category: 'navigation',
    focusMotions: ['{', '}'],
    weight: 1.0
  },

  // ===== MASTER LEVEL TASKS =====
  // Speed optimization, complex scenarios

  {
    title: 'Efficient multi-line editing',
    description: 'Combine multiple motions for optimal editing efficiency',
    baseCode: `const apiEndpoints = {
  users: '/api/v1/users',
  posts: '/api/v1/posts',
  comments: '/api/v1/comments',
  categories: '/api/v1/categories',
  tags: '/api/v1/tags',
  settings: '/api/v1/settings'
};

async function fetchData(endpoint) {
  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}`,
    transformations: [],
    difficulty: 'master',
    category: 'mixed',
    focusMotions: ['ci', 'ca', '%', 'f', 'gg', 'G'],
    weight: 1.0
  },

  {
    title: 'Visual mode selections',
    description: 'Practice visual mode operations with v, V, and Ctrl+v',
    baseCode: `const matrix = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16]
];

function transposeMatrix(matrix) {
  return matrix[0].map((_, colIndex) =>
    matrix.map(row => row[colIndex])
  );
}`,
    transformations: [],
    difficulty: 'master',
    category: 'visual',
    focusMotions: ['v', 'V'],
    weight: 1.0
  }
];

// Export function to get templates by criteria
export function getTemplatesByDifficulty(difficulty: TaskTemplate['difficulty']): TaskTemplate[] {
  return TASK_TEMPLATES.filter(template => template.difficulty === difficulty);
}

export function getTemplatesByCategory(category: TaskTemplate['category']): TaskTemplate[] {
  return TASK_TEMPLATES.filter(template => template.category === category);
}

export function getTemplatesWithMotions(motions: string[]): TaskTemplate[] {
  return TASK_TEMPLATES.filter(template =>
    template.focusMotions.some(motion => motions.includes(motion))
  );
}

export default TASK_TEMPLATES;