import { type Task, type TaskGenerationOptions, type DifficultyLevel } from '../types/Task';
import { SNIPPETS } from '../data/snippets';
import { computeTask } from './MotionOracle';

// ---------------------------------------------------------------------------
// Motion pools per difficulty
// ---------------------------------------------------------------------------

const MOTION_POOL: Record<DifficultyLevel, string[]> = {
  beginner:     ['$', '0', '^', 'w', 'b', 'e', 'j', 'k', 'x', 'r'],
  intermediate: ['gg', 'G', 'f', 'F', 't', 'T', 'dd', 'A', '{', '}'],
  advanced:     ['%', '*', '#', 'ci"', 'di"', 'da(', 'di('],
  expert:       ['ci(', 'da{', 'di{', 'ci{'],
  master:       ['$', 'w', 'b', 'f', 't', '*', 'dd', 'A'], // fallback to varied
};

// Snippet tags required for a given motion to be applicable
const MOTION_REQUIRED_TAGS: Record<string, string[]> = {
  '^':   ['has-indentation'],
  '{':   ['has-blank-lines'],
  '}':   ['has-blank-lines'],
  '*':   ['has-duplicates'],
  '#':   ['has-duplicates'],
  '%':   [], // findBracketPairs handles filtering
  'ci"': ['has-strings'],
  'di"': ['has-strings'],
  'da(': ['has-parens'],
  'di(': ['has-parens'],
  'ci(': ['has-parens'],
  'da{': ['has-braces'],
  'di{': ['has-braces'],
  'ci{': ['has-braces'],
  'r':   ['has-numbers'],
};

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// TaskGenerator
// ---------------------------------------------------------------------------

export class TaskGenerator {
  generateTask(options: TaskGenerationOptions): Task {
    const pool = MOTION_POOL[options.difficulty] ?? MOTION_POOL.beginner;
    const motion = options.focusMotions?.[0] ?? randomPick(pool);

    const requiredTags = MOTION_REQUIRED_TAGS[motion] ?? [];

    // Filter snippets to those that have all required tags
    const eligible = SNIPPETS.filter(s =>
      requiredTags.every(tag => s.tags.includes(tag as never))
    );

    const candidates = eligible.length > 0 ? eligible : SNIPPETS;

    // Try up to 10 random snippets until oracle returns non-null
    for (let i = 0; i < 10; i++) {
      const snippet = randomPick(candidates);
      const result = computeTask(snippet, motion);
      if (result) {
        return {
          id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          title: result.title,
          description: result.description,
          input: result.input,
          target: result.target,
          motions: result.focusMotions,
          difficulty: result.difficulty,
          category: result.category,
          focusMotions: result.focusMotions,
          hints: result.hints,
          cursorStart: { line: result.cursorStart.line, column: result.cursorStart.column },
          cursorTarget: { line: result.cursorTarget.line, column: result.cursorTarget.column },
        };
      }
    }

    return this.createFallbackTask(options.difficulty);
  }

  private createFallbackTask(difficulty: DifficultyLevel): Task {
    const code = `function example() {
  const message = "Hello, World!";
  console.log(message);
  return message.length;
}`;

    return {
      id: `fallback_${Date.now()}`,
      title: 'Navigate to function parameter',
      description: 'Practice basic navigation motions',
      input: code,
      target: code,
      motions: ['w'],
      difficulty,
      category: 'navigation',
      focusMotions: ['w'],
      hints: ['Use "w" to move forward by words'],
      cursorStart: { line: 0, column: 0 },
      cursorTarget: { line: 0, column: 9 },
    };
  }

  // Keep for backwards compatibility / Stats panel
  getAvailableCategories() { return ['navigation', 'search', 'editing', 'text-objects']; }
  getRecommendedMotions(difficulty: DifficultyLevel): string[] {
    return MOTION_POOL[difficulty] ?? MOTION_POOL.beginner;
  }
}
