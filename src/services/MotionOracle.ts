import { type Snippet } from '../data/snippets';
import { type DifficultyLevel, type MotionCategory } from '../types/Task';

export interface OracleResult {
  title: string;
  description: string;
  input: string;
  target: string;
  focusMotions: string[];
  category: MotionCategory;
  difficulty: DifficultyLevel;
  cursorStart: { line: number; column: number };
  cursorTarget: { line: number; column: number };
  hints: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isWordChar(c: string): boolean {
  return /[a-zA-Z0-9_]/.test(c);
}

/** Columns where a vim word starts on a line (transition from non-word to word-char) */
function wordStartsInLine(line: string): number[] {
  const positions: number[] = [];
  for (let i = 0; i < line.length; i++) {
    if (isWordChar(line[i]) && (i === 0 || !isWordChar(line[i - 1]))) {
      positions.push(i);
    }
  }
  return positions;
}

/** Columns where a vim word ends on a line (last char of a word run) */
function wordEndsInLine(line: string): number[] {
  const positions: number[] = [];
  for (let i = 0; i < line.length; i++) {
    if (isWordChar(line[i]) && (i === line.length - 1 || !isWordChar(line[i + 1]))) {
      positions.push(i);
    }
  }
  return positions;
}

function firstNonBlankCol(line: string): number {
  for (let i = 0; i < line.length; i++) {
    if (line[i] !== ' ' && line[i] !== '\t') return i;
  }
  return 0;
}

interface BracketPair {
  open: { line: number; col: number };
  close: { line: number; col: number };
  char: '(' | '[' | '{';
}

function findBracketPairs(lines: string[]): BracketPair[] {
  const pairs: BracketPair[] = [];
  const OPEN: Record<string, '(' | '[' | '{'> = { ')': '(', ']': '[', '}': '{' };
  const CLOSE: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
  const stack: Array<{ char: '(' | '[' | '{'; line: number; col: number }> = [];

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    for (let ci = 0; ci < line.length; ci++) {
      const ch = line[ci];
      if (ch === '(' || ch === '[' || ch === '{') {
        stack.push({ char: ch as '(' | '[' | '{', line: li, col: ci });
      } else if (ch in OPEN) {
        const top = stack[stack.length - 1];
        if (top && top.char === OPEN[ch]) {
          stack.pop();
          pairs.push({ open: { line: top.line, col: top.col }, close: { line: li, col: ci }, char: OPEN[ch] as '(' | '[' | '{' });
          void CLOSE; // suppress unused
        }
      }
    }
  }
  return pairs;
}

interface QuotePair {
  open: { line: number; col: number };
  close: { line: number; col: number };
  quote: '"' | "'" | '`';
}

function findQuotePairs(lines: string[]): QuotePair[] {
  const pairs: QuotePair[] = [];
  const QUOTES = ['"', "'", '`'] as const;

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    for (const q of QUOTES) {
      let i = 0;
      while (i < line.length) {
        if (line[i] === q) {
          // Find closing quote (simple, ignores escapes for task purposes)
          let j = i + 1;
          while (j < line.length && line[j] !== q) j++;
          if (j < line.length) {
            pairs.push({
              open: { line: li, col: i },
              close: { line: li, col: j },
              quote: q,
            });
            i = j + 1;
          } else {
            break;
          }
        } else {
          i++;
        }
      }
    }
  }
  return pairs;
}

function findBlankLines(lines: string[]): number[] {
  return lines.map((l, i) => ({ l, i })).filter(({ l }) => l.trim() === '').map(({ i }) => i);
}

function findDuplicateWords(lines: string[]): string[] {
  const code = lines.join('\n');
  const words = code.match(/\b[a-zA-Z_]\w{2,}\b/g) ?? [];
  const counts: Record<string, number> = {};
  words.forEach(w => { counts[w] = (counts[w] ?? 0) + 1; });
  return Object.keys(counts).filter(w => counts[w] > 1);
}

/** Chars interesting for f/F/t/T motions on a single line */
function interestingChars(line: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const c of line) {
    if (/[()[\]{};:.,=+\-*/<>!&|@#'"` ]/.test(c) && !seen.has(c)) {
      seen.add(c);
      result.push(c);
    }
  }
  return result;
}

/** Find all column positions of a char on a line */
function findCharPositions(line: string, char: string): number[] {
  const positions: number[] = [];
  for (let i = 0; i < line.length; i++) {
    if (line[i] === char) positions.push(i);
  }
  return positions;
}

// ---------------------------------------------------------------------------
// Navigation motion computers
// ---------------------------------------------------------------------------

function compute$(lines: string[]): { start: { line: number; col: number }; target: { line: number; col: number } } | null {
  const eligible = lines
    .map((l, i) => ({ l, i }))
    .filter(({ l }) => l.length > 10);
  if (eligible.length === 0) return null;
  const { l, i } = randomPick(eligible);
  return { start: { line: i, col: 0 }, target: { line: i, col: l.length - 1 } };
}

function compute0(lines: string[]): { start: { line: number; col: number }; target: { line: number; col: number } } | null {
  const eligible = lines
    .map((l, i) => ({ l, i }))
    .filter(({ l }) => l.length > 5);
  if (eligible.length === 0) return null;
  const { l, i } = randomPick(eligible);
  const mid = Math.floor(l.length / 2);
  return { start: { line: i, col: mid }, target: { line: i, col: 0 } };
}

function computeCaret(lines: string[]): { start: { line: number; col: number }; target: { line: number; col: number } } | null {
  const eligible = lines
    .map((l, i) => ({ l, i }))
    .filter(({ l }) => /^ +\S/.test(l));
  if (eligible.length === 0) return null;
  const { l, i } = randomPick(eligible);
  const fnb = firstNonBlankCol(l);
  return { start: { line: i, col: 0 }, target: { line: i, col: fnb } };
}

function computeGG(lines: string[]): { start: { line: number; col: number }; target: { line: number; col: number } } | null {
  if (lines.length < 4) return null;
  const startLine = 2 + Math.floor(Math.random() * (lines.length - 2));
  return { start: { line: startLine, col: 0 }, target: { line: 0, col: 0 } };
}

function computeG(lines: string[]): { start: { line: number; col: number }; target: { line: number; col: number } } | null {
  if (lines.length < 4) return null;
  const half = Math.floor(lines.length / 2);
  const startLine = Math.floor(Math.random() * half);
  return { start: { line: startLine, col: 0 }, target: { line: lines.length - 1, col: 0 } };
}

function computeJ(lines: string[]): { start: { line: number; col: number }; target: { line: number; col: number } } | null {
  if (lines.length < 5) return null;
  // Pick a target line that's 2-4 lines from start
  const count = 2 + Math.floor(Math.random() * 3);
  const maxStart = lines.length - count - 1;
  if (maxStart < 1) return null;
  const startLine = Math.floor(Math.random() * maxStart) + 1;
  const targetLine = startLine + count;
  return { start: { line: startLine, col: 0 }, target: { line: targetLine, col: 0 } };
}

function computeK(lines: string[]): { start: { line: number; col: number }; target: { line: number; col: number } } | null {
  if (lines.length < 5) return null;
  const count = 2 + Math.floor(Math.random() * 3);
  const minStart = count + 1;
  if (minStart >= lines.length) return null;
  const startLine = minStart + Math.floor(Math.random() * (lines.length - minStart));
  const targetLine = startLine - count;
  return { start: { line: startLine, col: 0 }, target: { line: targetLine, col: 0 } };
}

function computeW(lines: string[]): { start: { line: number; col: number }; target: { line: number; col: number } } | null {
  // Gather all word starts across all lines as { line, col }
  const all: Array<{ line: number; col: number }> = [];
  for (let li = 0; li < lines.length; li++) {
    for (const col of wordStartsInLine(lines[li])) {
      all.push({ line: li, col });
    }
  }
  if (all.length < 6) return null;
  // Pick a start that has at least 3 word-starts ahead
  const maxIdx = all.length - 4;
  const startIdx = Math.floor(Math.random() * maxIdx);
  const jumpCount = 3 + Math.floor(Math.random() * 3);
  const targetIdx = Math.min(startIdx + jumpCount, all.length - 1);
  return { start: all[startIdx], target: all[targetIdx] };
}

function computeB(lines: string[]): { start: { line: number; col: number }; target: { line: number; col: number } } | null {
  const all: Array<{ line: number; col: number }> = [];
  for (let li = 0; li < lines.length; li++) {
    for (const col of wordStartsInLine(lines[li])) {
      all.push({ line: li, col });
    }
  }
  if (all.length < 6) return null;
  const minIdx = 3;
  const startIdx = minIdx + Math.floor(Math.random() * (all.length - minIdx));
  const jumpCount = 3 + Math.floor(Math.random() * 3);
  const targetIdx = Math.max(startIdx - jumpCount, 0);
  return { start: all[startIdx], target: all[targetIdx] };
}

function computeE(lines: string[]): { start: { line: number; col: number }; target: { line: number; col: number } } | null {
  const all: Array<{ line: number; col: number }> = [];
  for (let li = 0; li < lines.length; li++) {
    for (const col of wordEndsInLine(lines[li])) {
      all.push({ line: li, col });
    }
  }
  if (all.length < 6) return null;
  const maxIdx = all.length - 4;
  const startIdx = Math.floor(Math.random() * maxIdx);
  const jumpCount = 2 + Math.floor(Math.random() * 3);
  const targetIdx = Math.min(startIdx + jumpCount, all.length - 1);
  return { start: all[startIdx], target: all[targetIdx] };
}

function computeF(lines: string[]): { line: number; char: string; start: { line: number; col: number }; target: { line: number; col: number } } | null {
  // Find a line with an interesting char after col 2
  const eligible: Array<{ line: number; char: string; col: number }> = [];
  for (let li = 0; li < lines.length; li++) {
    const l = lines[li];
    if (l.length < 6) continue;
    for (const ch of interestingChars(l.slice(3))) {
      const positions = findCharPositions(l, ch).filter(p => p >= 3);
      if (positions.length > 0) {
        eligible.push({ line: li, char: ch, col: positions[0] });
      }
    }
  }
  if (eligible.length === 0) return null;
  const { line, char, col } = randomPick(eligible);
  return { line, char, start: { line, col: 0 }, target: { line, col } };
}

function computeCapF(lines: string[]): { line: number; char: string; start: { line: number; col: number }; target: { line: number; col: number } } | null {
  const eligible: Array<{ line: number; char: string; col: number }> = [];
  for (let li = 0; li < lines.length; li++) {
    const l = lines[li];
    if (l.length < 6) continue;
    for (const ch of interestingChars(l.slice(0, l.length - 3))) {
      const positions = findCharPositions(l, ch).filter(p => p < l.length - 3);
      if (positions.length > 0) {
        const col = positions[positions.length - 1];
        eligible.push({ line: li, char: ch, col });
      }
    }
  }
  if (eligible.length === 0) return null;
  const { line, char, col } = randomPick(eligible);
  return { line, char, start: { line, col: lines[line].length - 1 }, target: { line, col } };
}

function computeT(lines: string[]): { line: number; char: string; start: { line: number; col: number }; target: { line: number; col: number } } | null {
  const result = computeF(lines);
  if (!result || result.target.col === 0) return null;
  return { ...result, target: { line: result.target.line, col: result.target.col - 1 } };
}

function computeCapT(lines: string[]): { line: number; char: string; start: { line: number; col: number }; target: { line: number; col: number } } | null {
  const result = computeCapF(lines);
  if (!result) return null;
  const line = lines[result.target.line];
  if (result.target.col + 1 >= line.length) return null;
  return { ...result, target: { line: result.target.line, col: result.target.col + 1 } };
}

function computePercent(lines: string[]): { pair: BracketPair } | null {
  const pairs = findBracketPairs(lines).filter(p => {
    // require some content between brackets (different line OR same line with some chars)
    if (p.open.line !== p.close.line) return true;
    return p.close.col - p.open.col > 3;
  });
  if (pairs.length === 0) return null;
  return { pair: randomPick(pairs) };
}

function computeBraceOpen(lines: string[]): { start: { line: number; col: number }; target: { line: number; col: number } } | null {
  const blanks = findBlankLines(lines);
  if (blanks.length === 0) return null;
  // Target is a blank line; start is a few lines after the blank
  const bl = randomPick(blanks);
  const startLine = Math.min(bl + 2, lines.length - 1);
  if (startLine <= bl) return null;
  return { start: { line: startLine, col: 0 }, target: { line: bl, col: 0 } };
}

function computeBraceClose(lines: string[]): { start: { line: number; col: number }; target: { line: number; col: number } } | null {
  const blanks = findBlankLines(lines);
  if (blanks.length === 0) return null;
  const bl = randomPick(blanks);
  const startLine = Math.max(bl - 2, 0);
  if (startLine >= bl) return null;
  return { start: { line: startLine, col: 0 }, target: { line: bl, col: 0 } };
}

function computeStar(lines: string[]): { word: string; start: { line: number; col: number }; target: { line: number; col: number } } | null {
  const dupWords = findDuplicateWords(lines);
  if (dupWords.length === 0) return null;
  const word = randomPick(dupWords);
  const regex = new RegExp(`\\b${word}\\b`);
  const occurrences: Array<{ line: number; col: number }> = [];
  for (let li = 0; li < lines.length; li++) {
    let search = lines[li];
    let offset = 0;
    let m: RegExpExecArray | null;
    const re = new RegExp(`\\b${word}\\b`, 'g');
    while ((m = re.exec(search)) !== null) {
      occurrences.push({ line: li, col: offset + m.index });
    }
    void search; void regex; // suppress unused
  }
  if (occurrences.length < 2) return null;
  return { word, start: occurrences[0], target: occurrences[1] };
}

function computeHash(lines: string[]): { word: string; start: { line: number; col: number }; target: { line: number; col: number } } | null {
  const result = computeStar(lines);
  if (!result) return null;
  return { word: result.word, start: result.target, target: result.start };
}

// ---------------------------------------------------------------------------
// Editing motion computers (mutate code)
// ---------------------------------------------------------------------------

function replaceInCode(code: string, from: number, to: number, replacement: string): string {
  return code.slice(0, from) + replacement + code.slice(to);
}

function lineColToAbsPos(lines: string[], line: number, col: number): number {
  let pos = 0;
  for (let i = 0; i < line; i++) {
    pos += lines[i].length + 1; // +1 for newline
  }
  return pos + col;
}

function computeX(lines: string[]): { input: string; target: string; cursorStart: { line: number; col: number } } | null {
  // Find a word to add a duplicate letter to (creating a typo)
  const eligible: Array<{ line: number; col: number; word: string }> = [];
  for (let li = 0; li < lines.length; li++) {
    const starts = wordStartsInLine(lines[li]);
    for (const col of starts) {
      let end = col;
      while (end < lines[li].length && isWordChar(lines[li][end])) end++;
      const word = lines[li].slice(col, end);
      if (word.length >= 3) {
        eligible.push({ line: li, col, word });
      }
    }
  }
  if (eligible.length === 0) return null;

  const { line, col, word } = randomPick(eligible);
  // Duplicate a random char in the word
  const dupPos = Math.floor(Math.random() * word.length);
  const dupChar = word[dupPos];
  const typoWord = word.slice(0, dupPos + 1) + dupChar + word.slice(dupPos + 1);

  // target = original code, input = code with typo
  const absCol = lineColToAbsPos(lines, line, col);
  const code = lines.join('\n');
  const input = replaceInCode(code, absCol, absCol + word.length, typoWord);
  return {
    input,
    target: code,
    cursorStart: { line, col: col + dupPos + 1 }, // cursor on the duplicate char
  };
}

function computeR(lines: string[]): { input: string; target: string; cursorStart: { line: number; col: number }; replacement: string } | null {
  // Find a digit and replace it with another digit
  const digits: Array<{ line: number; col: number; digit: string }> = [];
  for (let li = 0; li < lines.length; li++) {
    for (let ci = 0; ci < lines[li].length; ci++) {
      if (/\d/.test(lines[li][ci])) {
        digits.push({ line: li, col: ci, digit: lines[li][ci] });
      }
    }
  }
  if (digits.length === 0) return null;
  const { line, col, digit } = randomPick(digits);

  // Pick a different digit
  const alternatives = '0123456789'.split('').filter(d => d !== digit);
  const replacement = randomPick(alternatives);

  const code = lines.join('\n');
  const absPos = lineColToAbsPos(lines, line, col);
  const target = replaceInCode(code, absPos, absPos + 1, replacement);

  return {
    input: code,
    target,
    cursorStart: { line, col },
    replacement,
  };
}

function computeDD(lines: string[]): { input: string; target: string; cursorStart: { line: number; col: number }; deletedLine: number } | null {
  // Pick any non-first, non-last line
  if (lines.length < 4) return null;
  const eligible = lines.slice(1, lines.length - 1).map((_, i) => i + 1);
  const deletedLine = randomPick(eligible);

  const input = lines.join('\n');
  const newLines = [...lines.slice(0, deletedLine), ...lines.slice(deletedLine + 1)];
  const target = newLines.join('\n');

  return {
    input,
    target,
    cursorStart: { line: deletedLine, col: 0 },
    deletedLine,
  };
}

function computeA(lines: string[]): { input: string; target: string; cursorStart: { line: number; col: number } } | null {
  // Find a line ending in ; (will strip it, task is to use A to add it back)
  const eligible = lines
    .map((l, i) => ({ l: l.trimEnd(), i }))
    .filter(({ l }) => l.endsWith(';') && l.length > 3);
  if (eligible.length === 0) return null;

  const { l, i } = randomPick(eligible);
  const code = lines.join('\n');
  // input = code with semicolon stripped
  const lineStart = lineColToAbsPos(lines, i, 0);
  const semiPos = lineStart + l.length - 1;
  const input = replaceInCode(code, semiPos, semiPos + 1, '');

  return {
    input,
    target: code,
    cursorStart: { line: i, col: 0 },
  };
}

function computeCiQuote(lines: string[]): { input: string; target: string; cursorStart: { line: number; col: number }; quote: string } | null {
  const pairs = findQuotePairs(lines).filter(p => p.close.col - p.open.col > 3);
  if (pairs.length === 0) return null;
  const pair = randomPick(pairs);

  const code = lines.join('\n');
  // target = code with content between quotes cleared
  const openPos = lineColToAbsPos(lines, pair.open.line, pair.open.col);
  const closePos = lineColToAbsPos(lines, pair.close.line, pair.close.col);
  // content between quotes: openPos+1 to closePos
  const target = replaceInCode(code, openPos + 1, closePos, '');

  return {
    input: code,
    target,
    cursorStart: { line: pair.open.line, col: pair.open.col + 1 },
    quote: pair.quote,
  };
}

function computeDaOpen(lines: string[]): { input: string; target: string; cursorStart: { line: number; col: number } } | null {
  // Find a single-line ( pair with content
  const pairs = findBracketPairs(lines)
    .filter(p => p.char === '(' && p.open.line === p.close.line && p.close.col - p.open.col > 2);
  if (pairs.length === 0) return null;
  const pair = randomPick(pairs);

  const code = lines.join('\n');
  const openPos = lineColToAbsPos(lines, pair.open.line, pair.open.col);
  const closePos = lineColToAbsPos(lines, pair.close.line, pair.close.col);
  // da( deletes including parens
  const target = replaceInCode(code, openPos, closePos + 1, '');

  return {
    input: code,
    target,
    cursorStart: { line: pair.open.line, col: pair.open.col },
  };
}

function computeDiOpen(lines: string[]): { input: string; target: string; cursorStart: { line: number; col: number } } | null {
  // Find a single-line ( pair with content
  const pairs = findBracketPairs(lines)
    .filter(p => p.char === '(' && p.open.line === p.close.line && p.close.col - p.open.col > 2);
  if (pairs.length === 0) return null;
  const pair = randomPick(pairs);

  const code = lines.join('\n');
  const openPos = lineColToAbsPos(lines, pair.open.line, pair.open.col);
  const closePos = lineColToAbsPos(lines, pair.close.line, pair.close.col);
  // di( deletes content inside parens, keeping parens
  const target = replaceInCode(code, openPos + 1, closePos, '');

  return {
    input: code,
    target,
    cursorStart: { line: pair.open.line, col: pair.open.col + 1 },
  };
}

function computeDaBrace(lines: string[]): { input: string; target: string; cursorStart: { line: number; col: number } } | null {
  // Find a single-line { pair with content
  const pairs = findBracketPairs(lines)
    .filter(p => p.char === '{' && p.open.line === p.close.line && p.close.col - p.open.col > 2);
  if (pairs.length === 0) return null;
  const pair = randomPick(pairs);

  const code = lines.join('\n');
  const openPos = lineColToAbsPos(lines, pair.open.line, pair.open.col);
  const closePos = lineColToAbsPos(lines, pair.close.line, pair.close.col);
  const target = replaceInCode(code, openPos, closePos + 1, '');

  return {
    input: code,
    target,
    cursorStart: { line: pair.open.line, col: pair.open.col },
  };
}

// ---------------------------------------------------------------------------
// Main dispatch
// ---------------------------------------------------------------------------

const MOTION_DIFFICULTY: Record<string, DifficultyLevel> = {
  '$': 'beginner', '0': 'beginner', '^': 'beginner',
  'w': 'beginner', 'b': 'beginner', 'e': 'beginner',
  'j': 'beginner', 'k': 'beginner',
  'x': 'beginner', 'r': 'beginner',
  'gg': 'intermediate', 'G': 'intermediate',
  'f': 'intermediate', 'F': 'intermediate', 't': 'intermediate', 'T': 'intermediate',
  'dd': 'intermediate', 'A': 'intermediate',
  '{': 'intermediate', '}': 'intermediate',
  '%': 'advanced', '*': 'advanced', '#': 'advanced',
  'ci"': 'advanced', 'di"': 'advanced',
  'da(': 'advanced', 'di(': 'advanced',
  'ci(': 'expert', 'da{': 'expert', 'di{': 'expert', 'ci{': 'expert',
};

const MOTION_CATEGORY: Record<string, MotionCategory> = {
  '$': 'navigation', '0': 'navigation', '^': 'navigation',
  'w': 'navigation', 'b': 'navigation', 'e': 'navigation',
  'j': 'navigation', 'k': 'navigation',
  'gg': 'navigation', 'G': 'navigation', '{': 'navigation', '}': 'navigation',
  'f': 'search', 'F': 'search', 't': 'search', 'T': 'search',
  '%': 'search', '*': 'search', '#': 'search',
  'x': 'editing', 'r': 'editing', 'dd': 'editing', 'A': 'editing',
  'ci"': 'text-objects', 'di"': 'text-objects',
  'da(': 'text-objects', 'di(': 'text-objects',
  'ci(': 'text-objects', 'da{': 'text-objects', 'di{': 'text-objects', 'ci{': 'text-objects',
};

export function computeTask(snippet: Snippet, motion: string): OracleResult | null {
  const code = snippet.code;
  const lines = code.split('\n');
  const difficulty: DifficultyLevel = MOTION_DIFFICULTY[motion] ?? 'beginner';
  const category: MotionCategory = MOTION_CATEGORY[motion] ?? 'navigation';

  // Nav tasks: input === target, success is cursor position
  // Edit tasks: input !== target, success is text match

  switch (motion) {
    case '$': {
      const r = compute$(lines);
      if (!r) return null;
      return {
        title: `Jump to end of line ${r.target.line + 1}`,
        description: 'Use $ to move the cursor to the last character of the line',
        input: code, target: code,
        focusMotions: ['$'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: ['Press $ to jump to the last character on the line'],
      };
    }

    case '0': {
      const r = compute0(lines);
      if (!r) return null;
      return {
        title: `Jump to start of line ${r.target.line + 1}`,
        description: 'Use 0 to move the cursor to column 0',
        input: code, target: code,
        focusMotions: ['0'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: ['Press 0 to jump to the beginning of the line'],
      };
    }

    case '^': {
      const r = computeCaret(lines);
      if (!r) return null;
      return {
        title: `Jump to first non-blank character on line ${r.target.line + 1}`,
        description: 'Use ^ to move to the first non-whitespace character',
        input: code, target: code,
        focusMotions: ['^'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: ['Press ^ to jump to the first non-blank character on the line'],
      };
    }

    case 'gg': {
      const r = computeGG(lines);
      if (!r) return null;
      return {
        title: 'Jump to the top of the file',
        description: 'Use gg to move to the first line',
        input: code, target: code,
        focusMotions: ['gg'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: ['Press gg to jump to the very first line'],
      };
    }

    case 'G': {
      const r = computeG(lines);
      if (!r) return null;
      return {
        title: 'Jump to the bottom of the file',
        description: 'Use G to move to the last line',
        input: code, target: code,
        focusMotions: ['G'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: ['Press G to jump to the last line'],
      };
    }

    case 'j': {
      const r = computeJ(lines);
      if (!r) return null;
      const count = r.target.line - r.start.line;
      return {
        title: `Move down ${count} line${count > 1 ? 's' : ''} from line ${r.start.line + 1}`,
        description: `Starting at line ${r.start.line + 1}, use j (or ${count}j) to move the cursor down to line ${r.target.line + 1}`,
        input: code, target: code,
        focusMotions: ['j'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: [`Press ${count}j to move down ${count} lines at once`],
      };
    }

    case 'k': {
      const r = computeK(lines);
      if (!r) return null;
      const count = r.start.line - r.target.line;
      return {
        title: `Move up ${count} line${count > 1 ? 's' : ''} from line ${r.start.line + 1}`,
        description: `Starting at line ${r.start.line + 1}, use k (or ${count}k) to move the cursor up to line ${r.target.line + 1}`,
        input: code, target: code,
        focusMotions: ['k'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: [`Press ${count}k to move up ${count} lines at once`],
      };
    }

    case 'w': {
      const r = computeW(lines);
      if (!r) return null;
      return {
        title: `Move forward by words to line ${r.target.line + 1}`,
        description: 'Use w to move forward one word at a time',
        input: code, target: code,
        focusMotions: ['w'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: ['Press w repeatedly to jump to the start of each next word'],
      };
    }

    case 'b': {
      const r = computeB(lines);
      if (!r) return null;
      return {
        title: 'Move backward by words',
        description: 'Use b to move backward one word at a time',
        input: code, target: code,
        focusMotions: ['b'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: ['Press b to jump back to the start of the previous word'],
      };
    }

    case 'e': {
      const r = computeE(lines);
      if (!r) return null;
      return {
        title: 'Move to end of words',
        description: 'Use e to move to the end of each word',
        input: code, target: code,
        focusMotions: ['e'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: ['Press e to jump to the last character of the current or next word'],
      };
    }

    case 'f': {
      const r = computeF(lines);
      if (!r) return null;
      return {
        title: `Find '${r.char}' on line ${r.line + 1}`,
        description: `Use f${r.char} to jump to the next '${r.char}' character`,
        input: code, target: code,
        focusMotions: ['f'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: [`Press f${r.char} to jump directly to '${r.char}'`],
      };
    }

    case 'F': {
      const r = computeCapF(lines);
      if (!r) return null;
      return {
        title: `Find '${r.char}' backwards on line ${r.line + 1}`,
        description: `Use F${r.char} to jump backwards to '${r.char}'`,
        input: code, target: code,
        focusMotions: ['F'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: [`Press F${r.char} to jump backwards to '${r.char}'`],
      };
    }

    case 't': {
      const r = computeT(lines);
      if (!r) return null;
      return {
        title: `Move till '${r.char}' on line ${r.line + 1}`,
        description: `Use t${r.char} to jump just before '${r.char}'`,
        input: code, target: code,
        focusMotions: ['t'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: [`Press t${r.char} to land one character before '${r.char}'`],
      };
    }

    case 'T': {
      const r = computeCapT(lines);
      if (!r) return null;
      return {
        title: `Move till '${r.char}' backwards`,
        description: `Use T${r.char} to jump just after '${r.char}' moving backwards`,
        input: code, target: code,
        focusMotions: ['T'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: [`Press T${r.char} to land one character after '${r.char}' when moving backward`],
      };
    }

    case '%': {
      const r = computePercent(lines);
      if (!r) return null;
      const { pair } = r;
      const closeChar = pair.char === '(' ? ')' : pair.char === '[' ? ']' : '}';
      return {
        title: `Jump to matching ${closeChar} on line ${pair.close.line + 1}`,
        description: `Use % to jump between matching ${pair.char}${closeChar} brackets`,
        input: code, target: code,
        focusMotions: ['%'], category, difficulty,
        cursorStart: { line: pair.open.line, column: pair.open.col },
        cursorTarget: { line: pair.close.line, column: pair.close.col },
        hints: [`Press % when on a bracket to jump to its matching pair`],
      };
    }

    case '{': {
      const r = computeBraceOpen(lines);
      if (!r) return null;
      return {
        title: 'Jump to previous blank line',
        description: 'Use { to move to the previous empty line (paragraph start)',
        input: code, target: code,
        focusMotions: ['{'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: ['Press { to jump backwards to the nearest blank line'],
      };
    }

    case '}': {
      const r = computeBraceClose(lines);
      if (!r) return null;
      return {
        title: 'Jump to next blank line',
        description: 'Use } to move to the next empty line (paragraph end)',
        input: code, target: code,
        focusMotions: ['}'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: ['Press } to jump forward to the nearest blank line'],
      };
    }

    case '*': {
      const r = computeStar(lines);
      if (!r) return null;
      return {
        title: `Find next occurrence of '${r.word}'`,
        description: `Use * to search forward for the word under the cursor`,
        input: code, target: code,
        focusMotions: ['*'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: [`Place cursor on '${r.word}' and press * to find the next occurrence`],
      };
    }

    case '#': {
      const r = computeHash(lines);
      if (!r) return null;
      return {
        title: `Find previous occurrence of '${r.word}'`,
        description: `Use # to search backward for the word under the cursor`,
        input: code, target: code,
        focusMotions: ['#'], category, difficulty,
        cursorStart: { line: r.start.line, column: r.start.col },
        cursorTarget: { line: r.target.line, column: r.target.col },
        hints: [`Place cursor on '${r.word}' and press # to find the previous occurrence`],
      };
    }

    case 'x': {
      const r = computeX(lines);
      if (!r) return null;
      return {
        title: 'Fix the duplicate character',
        description: 'Use x to delete the extra character',
        input: r.input, target: r.target,
        focusMotions: ['x'], category, difficulty,
        cursorStart: { line: r.cursorStart.line, column: r.cursorStart.col },
        cursorTarget: { line: r.cursorStart.line, column: r.cursorStart.col },
        hints: ['Press x to delete the character under the cursor'],
      };
    }

    case 'r': {
      const r = computeR(lines);
      if (!r) return null;
      return {
        title: 'Replace the digit',
        description: `Use r to replace a single character`,
        input: r.input, target: r.target,
        focusMotions: ['r'], category, difficulty,
        cursorStart: { line: r.cursorStart.line, column: r.cursorStart.col },
        cursorTarget: { line: r.cursorStart.line, column: r.cursorStart.col },
        hints: [`Press r${r.replacement} to replace the digit with ${r.replacement}`],
      };
    }

    case 'dd': {
      const r = computeDD(lines);
      if (!r) return null;
      return {
        title: `Delete line ${r.deletedLine + 1}`,
        description: 'Use dd to delete the entire current line',
        input: r.input, target: r.target,
        focusMotions: ['dd'], category, difficulty,
        cursorStart: { line: r.cursorStart.line, column: r.cursorStart.col },
        cursorTarget: { line: r.cursorStart.line, column: r.cursorStart.col },
        hints: ['Press dd to delete the current line'],
      };
    }

    case 'A': {
      const r = computeA(lines);
      if (!r) return null;
      return {
        title: 'Append semicolon at end of line',
        description: 'Use A to append to the end of the line, then add the missing semicolon',
        input: r.input, target: r.target,
        focusMotions: ['A'], category, difficulty,
        cursorStart: { line: r.cursorStart.line, column: r.cursorStart.col },
        cursorTarget: { line: r.cursorStart.line, column: r.cursorStart.col },
        hints: ['Press A to jump to the end of the line and enter insert mode'],
      };
    }

    case 'ci"':
    case 'di"': {
      const r = computeCiQuote(lines);
      if (!r) return null;
      return {
        title: `Clear the string content on line ${r.cursorStart.line + 1}`,
        description: `Use ${motion} to delete the content inside the quotes`,
        input: r.input, target: r.target,
        focusMotions: [motion], category, difficulty,
        cursorStart: { line: r.cursorStart.line, column: r.cursorStart.col },
        cursorTarget: { line: r.cursorStart.line, column: r.cursorStart.col },
        hints: [`Press ${motion} while inside or on a ${r.quote}string${r.quote} to clear its content`],
      };
    }

    case 'da(':
      case 'ci(': {
      const r = computeDaOpen(lines);
      if (!r) return null;
      return {
        title: 'Delete the argument list',
        description: `Use ${motion} to delete the content and parentheses`,
        input: r.input, target: r.target,
        focusMotions: [motion], category, difficulty,
        cursorStart: { line: r.cursorStart.line, column: r.cursorStart.col },
        cursorTarget: { line: r.cursorStart.line, column: r.cursorStart.col },
        hints: [`Press ${motion} while inside parentheses to delete them and their content`],
      };
    }

    case 'di(': {
      const r = computeDiOpen(lines);
      if (!r) return null;
      return {
        title: 'Clear the parentheses content',
        description: 'Use di( to delete content inside parentheses, keeping them',
        input: r.input, target: r.target,
        focusMotions: ['di('], category, difficulty,
        cursorStart: { line: r.cursorStart.line, column: r.cursorStart.col },
        cursorTarget: { line: r.cursorStart.line, column: r.cursorStart.col },
        hints: ['Press di( to delete only what is inside the parentheses'],
      };
    }

    case 'da{':
    case 'di{':
    case 'ci{': {
      const r = computeDaBrace(lines);
      if (!r) return null;
      return {
        title: 'Delete the braces and content',
        description: `Use ${motion} to delete inside or around curly braces`,
        input: r.input, target: r.target,
        focusMotions: [motion], category, difficulty,
        cursorStart: { line: r.cursorStart.line, column: r.cursorStart.col },
        cursorTarget: { line: r.cursorStart.line, column: r.cursorStart.col },
        hints: [`Press ${motion} while inside braces`],
      };
    }

    default:
      return null;
  }
}
