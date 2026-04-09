export type SnippetTag =
  | 'has-strings'
  | 'has-parens'
  | 'has-brackets'
  | 'has-braces'
  | 'has-comments'
  | 'has-blank-lines'
  | 'has-indentation'
  | 'has-duplicates'
  | 'has-numbers';

export interface Snippet {
  id: string;
  code: string;
  language: 'javascript' | 'typescript' | 'json';
  tags: SnippetTag[];
}

function computeTags(code: string): SnippetTag[] {
  const lines = code.split('\n');
  const tags: SnippetTag[] = [];
  if (/"[^"]*"|'[^']*'|`[^`]*`/.test(code)) tags.push('has-strings');
  if (/\(/.test(code))                        tags.push('has-parens');
  if (/\[/.test(code))                        tags.push('has-brackets');
  if (/\{/.test(code))                        tags.push('has-braces');
  if (/\/\/|\/\*/.test(code))                 tags.push('has-comments');
  if (lines.some(l => l.trim() === ''))       tags.push('has-blank-lines');
  if (lines.some(l => /^ +\S/.test(l)))       tags.push('has-indentation');
  if (/\d/.test(code))                        tags.push('has-numbers');
  const words = code.match(/\b[a-zA-Z_]\w{2,}\b/g) ?? [];
  const counts: Record<string, number> = {};
  words.forEach(w => { counts[w] = (counts[w] ?? 0) + 1; });
  if (Object.values(counts).some(n => n > 1)) tags.push('has-duplicates');
  return tags;
}

function snippet(id: string, language: Snippet['language'], code: string): Snippet {
  return { id, code: code.trim(), language, tags: computeTags(code) };
}

export const SNIPPETS: Snippet[] = [
  snippet('debounce', 'javascript', `
function debounce(fn, delay) {
  let timer = null;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

const search = debounce(fetchResults, 300);
`),

  snippet('event-emitter', 'javascript', `
class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return this;
  }

  emit(event, ...args) {
    const handlers = this.listeners.get(event) ?? [];
    handlers.forEach(handler => handler(...args));
  }

  off(event, callback) {
    const handlers = this.listeners.get(event) ?? [];
    this.listeners.set(event, handlers.filter(h => h !== callback));
  }
}
`),

  snippet('fetch-retry', 'javascript', `
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
`),

  snippet('group-by', 'javascript', `
function groupBy(array, keyFn) {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
}

function sortBy(array, keyFn) {
  return [...array].sort((a, b) => {
    const ka = keyFn(a);
    const kb = keyFn(b);
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  });
}
`),

  snippet('deep-merge', 'javascript', `
function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(target, source) {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    if (isObject(source[key]) && isObject(target[key])) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}
`),

  snippet('local-storage', 'javascript', `
class StorageManager {
  constructor(prefix = 'app') {
    this.prefix = prefix;
  }

  key(name) {
    return \`\${this.prefix}:\${name}\`;
  }

  get(name, fallback = null) {
    try {
      const raw = localStorage.getItem(this.key(name));
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  set(name, value) {
    localStorage.setItem(this.key(name), JSON.stringify(value));
  }

  remove(name) {
    localStorage.removeItem(this.key(name));
  }
}
`),

  snippet('parse-query', 'javascript', `
function parseQueryString(search) {
  if (!search || search === '?') return {};

  return search
    .replace(/^\?/, '')
    .split('&')
    .reduce((params, pair) => {
      const [key, value] = pair.split('=').map(decodeURIComponent);
      if (key) {
        params[key] = value ?? '';
      }
      return params;
    }, {});
}

function buildQueryString(params) {
  return Object.entries(params)
    .map(([k, v]) => \`\${encodeURIComponent(k)}=\${encodeURIComponent(v)}\`)
    .join('&');
}
`),

  snippet('binary-search', 'javascript', `
function binarySearch(array, target, compareFn) {
  let low = 0;
  let high = array.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const cmp = compareFn(array[mid], target);

    if (cmp === 0) return mid;
    if (cmp < 0) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}
`),

  snippet('queue', 'javascript', `
class Queue {
  constructor() {
    this.items = [];
    this.headIndex = 0;
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.headIndex];
    this.headIndex++;
    if (this.headIndex > this.items.length / 2) {
      this.items = this.items.slice(this.headIndex);
      this.headIndex = 0;
    }
    return item;
  }

  peek() {
    return this.items[this.headIndex];
  }

  get size() {
    return this.items.length - this.headIndex;
  }

  isEmpty() {
    return this.size === 0;
  }
}
`),

  snippet('memoize', 'javascript', `
function memoize(fn, keyFn = (...args) => JSON.stringify(args)) {
  const cache = new Map();

  return function (...args) {
    const key = keyFn(...args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const fibonacci = memoize(function fib(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});
`),

  snippet('format-date', 'javascript', `
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  const pad = n => String(n).padStart(2, '0');

  const tokens = {
    YYYY: d.getFullYear(),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => tokens[match]);
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return \`\${Math.floor(seconds / 60)} minutes ago\`;
  if (seconds < 86400) return \`\${Math.floor(seconds / 3600)} hours ago\`;
  return \`\${Math.floor(seconds / 86400)} days ago\`;
}
`),

  snippet('validate-form', 'javascript', `
const validators = {
  required: value => value.trim().length > 0,
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  minLength: min => value => value.length >= min,
  maxLength: max => value => value.length <= max,
  pattern: regex => value => regex.test(value),
};

function validateField(value, rules) {
  const errors = [];

  for (const [rule, arg] of Object.entries(rules)) {
    const validator = typeof arg === 'function' ? arg : validators[rule](arg);
    if (!validator(value)) {
      errors.push(rule);
    }
  }

  return errors;
}

function validateForm(data, schema) {
  const errors = {};
  for (const [field, rules] of Object.entries(schema)) {
    const fieldErrors = validateField(data[field] ?? '', rules);
    if (fieldErrors.length > 0) errors[field] = fieldErrors;
  }
  return errors;
}
`),

  snippet('router', 'javascript', `
class Router {
  constructor() {
    this.routes = new Map();
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  get(path, handler) {
    this.routes.set(\`GET:\${path}\`, handler);
    return this;
  }

  post(path, handler) {
    this.routes.set(\`POST:\${path}\`, handler);
    return this;
  }

  async handle(request) {
    const key = \`\${request.method}:\${request.path}\`;
    const handler = this.routes.get(key);

    if (!handler) {
      return { status: 404, body: 'Not Found' };
    }

    for (const middleware of this.middlewares) {
      await middleware(request);
    }

    return handler(request);
  }
}
`),

  snippet('app-config', 'javascript', `
const config = {
  app: {
    name: 'MyApplication',
    version: '2.1.0',
    environment: process.env.NODE_ENV ?? 'development',
  },
  server: {
    host: 'localhost',
    port: 3000,
    timeout: 30000,
  },
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: 5432,
    name: 'myapp_db',
    poolSize: 10,
  },
  cache: {
    ttl: 3600,
    maxSize: 1000,
    strategy: 'lru',
  },
  features: {
    darkMode: true,
    analytics: false,
    betaFeatures: false,
  },
};
`),

  snippet('api-response', 'javascript', `
const userResponse = {
  data: {
    id: 'usr_8f2k19a',
    username: 'alice_dev',
    email: 'alice@example.com',
    role: 'admin',
    createdAt: '2024-01-15T09:30:00Z',
    profile: {
      firstName: 'Alice',
      lastName: 'Johnson',
      avatar: 'https://cdn.example.com/avatars/alice.jpg',
      bio: 'Senior software engineer',
    },
    settings: {
      theme: 'dark',
      language: 'en',
      notifications: true,
    },
  },
  meta: {
    requestId: 'req_x9q2m',
    timestamp: Date.now(),
    version: 1,
  },
};
`),

  snippet('retry-backoff', 'javascript', `
async function withRetry(operation, options = {}) {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    factor = 2,
    onRetry = null,
  } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation(attempt);
    } catch (error) {
      if (attempt === maxAttempts) throw error;

      const delay = Math.min(baseDelay * Math.pow(factor, attempt - 1), maxDelay);
      const jitter = delay * 0.1 * Math.random();

      if (onRetry) onRetry(error, attempt, delay + jitter);
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }
}
`),

  snippet('observer', 'javascript', `
class Subject {
  constructor() {
    this.observers = new Set();
    this.state = null;
  }

  subscribe(observer) {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  setState(newState) {
    this.state = newState;
    this.notify();
  }

  notify() {
    this.observers.forEach(observer => observer(this.state));
  }
}

class Store extends Subject {
  constructor(reducer, initialState) {
    super();
    this.reducer = reducer;
    this.state = initialState;
  }

  dispatch(action) {
    this.setState(this.reducer(this.state, action));
  }
}
`),

  snippet('pipe-compose', 'javascript', `
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

const trim = str => str.trim();
const toLowerCase = str => str.toLowerCase();
const replace = (from, to) => str => str.replace(from, to);
const truncate = max => str => str.length > max ? str.slice(0, max) + '...' : str;

const sanitizeTitle = pipe(
  trim,
  toLowerCase,
  replace(/\s+/g, '-'),
  replace(/[^a-z0-9-]/g, ''),
  truncate(60)
);
`),

  snippet('reducer', 'javascript', `
const initialState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
  totalCount: 0,
};

function usersReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_USERS_START':
      return { ...state, loading: true, error: null };

    case 'FETCH_USERS_SUCCESS':
      return {
        ...state,
        loading: false,
        users: action.payload.users,
        totalCount: action.payload.total,
      };

    case 'FETCH_USERS_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'SELECT_USER':
      return { ...state, selectedUser: action.payload };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}
`),

  snippet('lru-cache', 'javascript', `
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }

  get size() {
    return this.cache.size;
  }
}
`),
];
