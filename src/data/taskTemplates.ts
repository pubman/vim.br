import { type TaskTemplate } from '../types/Task';

export const TASK_TEMPLATES: TaskTemplate[] = [
  // ===== BEGINNER LEVEL TASKS =====
  // Basic navigation motions: h, j, k, l, w, b, e, 0, $

  {
    title: 'Jump to end of line',
    description: 'Use $ to jump to the last character on the line (the semicolon)',
    baseCode: `const message = "Welcome to VimMotion Trainer!";`,
    transformations: [],
    difficulty: 'beginner',
    category: 'navigation',
    focusMotions: ['$'],
    weight: 1.0,
    successConditions: {
      type: 'cursor-position',
      cursor: { line: 0, column: 47 }, // ';' is the last char (0-indexed: 47)
      description: 'Cursor on the last character of the line'
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
    title: 'Navigate to "firstNumber" using w',
    description: 'Use w to move forward word by word until you reach "firstNumber" (press w 3 times from the start)',
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
      cursor: { line: 0, column: 22 }, // 'firstNumber' starts at col 22 after '('
      description: 'Cursor at the start of "firstNumber"'
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
      cursor: { line: 3, column: 0 }, // Line with 'cherry' — col stays at 0 when pressing j from col 0
      description: 'Cursor anywhere on the "cherry" line'
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
    title: 'Find the first dot in the email regex',
    description: 'Use f. to jump to the first dot character in the regex pattern',
    baseCode: `const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;`,
    transformations: [],
    difficulty: 'intermediate',
    category: 'search',
    focusMotions: ['f', 'F'],
    weight: 1.0,
    successConditions: {
      type: 'cursor-position',
      cursor: { line: 0, column: 33 }, // first '.' is at col 33 inside [a-zA-Z0-9._...]
      description: 'Cursor on the first dot in the regex character class'
    }
  },

  {
    title: 'Navigate till the opening parenthesis in "formatName("',
    description: 'Use t( to move till (one before) the opening parenthesis in the function call',
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
      cursor: { line: 0, column: 18 }, // 'e' in formatName — one char before '(' at col 19
      description: 'Cursor one character before the opening parenthesis'
    }
  },

  {
    title: 'Jump to beginning and end',
    description: 'Use gg to go to first line, then G to go to the last line',
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
    weight: 1.0,
    successConditions: {
      type: 'cursor-position',
      cursor: { line: 17, column: 0 }, // '// End of file' is line index 17 (18th line)
      description: 'Cursor on the last line after pressing G'
    }
  },

  {
    title: 'Search for "admin" role',
    description: 'Use /admin to search forward and land on the first occurrence of "admin"',
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
    weight: 1.0,
    successConditions: {
      type: 'cursor-position',
      cursor: { line: 1, column: 26 }, // 'admin' starts at col 26 in "  { name: 'Alice', role: 'admin' },"
      description: "Cursor on 'admin' after searching /admin"
    }
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
  },

  // ===== EDITING TASKS (with real before/after transformations) =====

  {
    title: 'Fix the typo: remove the extra "s"',
    description: 'The word "consst" has a double "s". Position your cursor on the extra "s" and use x to delete it.',
    baseCode: `consst message = "hello world";`,
    targetCode: `const message = "hello world";`,
    transformations: [],
    difficulty: 'beginner',
    category: 'editing',
    focusMotions: ['x'],
    weight: 1.5,
    successConditions: {
      type: 'text-match',
      description: 'Delete the extra "s" to fix the typo'
    }
  },

  {
    title: 'Fix the version number',
    description: 'The version is "0" but should be "1". Move to the "0" and use r1 to replace it.',
    baseCode: `const VERSION = "0.0.0";`,
    targetCode: `const VERSION = "1.0.0";`,
    cursorStart: { line: 0, column: 16 },
    transformations: [],
    difficulty: 'beginner',
    category: 'editing',
    focusMotions: ['r'],
    weight: 1.5,
    successConditions: {
      type: 'text-match',
      description: 'Replace "0" with "1" using r'
    }
  },

  {
    title: 'Add the missing semicolon',
    description: 'The array declaration is missing a semicolon at the end. Use A to append to end of line and add ";".',
    baseCode: `const colors = ['red', 'green', 'blue']`,
    targetCode: `const colors = ['red', 'green', 'blue'];`,
    transformations: [],
    difficulty: 'intermediate',
    category: 'editing',
    focusMotions: ['A'],
    weight: 1.5,
    successConditions: {
      type: 'text-match',
      description: 'Add semicolon at end of line using A'
    }
  },

  {
    title: 'Remove the debug log line',
    description: 'Delete the console.log("debug") line using dd. Position your cursor on that line first.',
    baseCode: `function greet(name) {
  const msg = "Hello, " + name;
  console.log("debug");
  return msg;
}`,
    targetCode: `function greet(name) {
  const msg = "Hello, " + name;
  return msg;
}`,
    transformations: [],
    difficulty: 'intermediate',
    category: 'editing',
    focusMotions: ['dd'],
    weight: 1.5,
    successConditions: {
      type: 'text-match',
      description: 'Delete the debug log line using dd'
    }
  },

  {
    title: 'Add initialization comment',
    description: 'Open a new line below "function init() {" and type "  // initialized". Use o to open a line below.',
    baseCode: `function init() {
}`,
    targetCode: `function init() {
  // initialized
}`,
    transformations: [],
    difficulty: 'intermediate',
    category: 'editing',
    focusMotions: ['o'],
    weight: 1.0,
    successConditions: {
      type: 'text-match',
      description: 'Open a line below and add the comment'
    }
  },

  {
    title: 'Clear the string value',
    description: 'Use ci" to change the content inside the quotes of the greeting string to empty.',
    baseCode: `const greeting = "Hello, World!";`,
    targetCode: `const greeting = "";`,
    transformations: [],
    difficulty: 'advanced',
    category: 'editing',
    focusMotions: ['ci"'],
    weight: 1.5,
    successConditions: {
      type: 'text-match',
      description: 'Empty the string using ci"'
    }
  },

  {
    title: 'Remove the function call arguments',
    description: 'Use da( to delete "debugInfo" and the parentheses from the console.log call.',
    baseCode: `console.log(debugInfo);`,
    targetCode: `console.log;`,
    transformations: [],
    difficulty: 'advanced',
    category: 'editing',
    focusMotions: ['da('],
    weight: 1.0,
    successConditions: {
      type: 'text-match',
      description: 'Delete the argument list using da('
    }
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