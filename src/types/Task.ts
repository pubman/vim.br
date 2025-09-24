// Task system types for VimMotion Trainer

export interface Task {
  id: string;
  title: string;
  description: string;
  input: string;           // Starting code state
  target: string;          // Target code state (what the result should look like)
  motions: string[];       // Array of optimal vim motion sequences
  difficulty: DifficultyLevel;
  category: MotionCategory;
  focusMotions: string[];  // Specific motions this task is designed to practice
  hints?: string[];        // Optional hints for the user
  cursorStart?: CursorPosition; // Starting cursor position
  cursorTarget?: CursorPosition; // Target cursor position
}

export interface CursorPosition {
  line: number;    // 0-indexed line number
  column: number;  // 0-indexed column number
}

export type DifficultyLevel =
  | 'beginner'     // Basic navigation (hjkl, w, b, e)
  | 'intermediate' // Line operations, search
  | 'advanced'     // Text objects, complex combinations
  | 'expert'       // Optimization challenges, macros
  | 'master';      // Competition scenarios, speed tests

export type MotionCategory =
  | 'navigation'   // Basic cursor movement
  | 'search'       // Find, till, search patterns
  | 'editing'      // Insert, append, change, delete
  | 'text-objects' // Word objects, bracket objects
  | 'visual'       // Visual mode operations
  | 'macros'       // Macro recording and execution
  | 'mixed';       // Combination of multiple categories

export interface TaskTemplate {
  title: string;
  description: string;
  baseCode: string;
  transformations: CodeTransformation[];
  difficulty: DifficultyLevel;
  category: MotionCategory;
  focusMotions: string[];
  weight: number; // Probability weight for random selection
}

export interface CodeTransformation {
  type: 'insert' | 'delete' | 'replace' | 'move-cursor';
  position: CursorPosition;
  content?: string;
  length?: number; // For delete operations
  target?: CursorPosition; // For move-cursor operations
}

export interface TaskGenerationOptions {
  difficulty: DifficultyLevel;
  category?: MotionCategory;
  focusMotions?: string[];
  userProgress?: Record<string, 'mastered' | 'learning' | 'locked'>;
  avoidRecentMotions?: string[];
}

export interface TaskValidationResult {
  isComplete: boolean;
  currentState: string;
  targetState: string;
  accuracy: number; // 0-100
  efficiency: number; // Motions used vs optimal
  feedback: string;
}

// Motion definitions for task generation
export const MOTION_DEFINITIONS = {
  // Navigation motions
  navigation: {
    basic: ['h', 'j', 'k', 'l'],
    word: ['w', 'b', 'e', 'ge', 'W', 'B', 'E'],
    line: ['0', '^', '$', 'g_'],
    jump: ['gg', 'G', '{number}G', 'H', 'M', 'L'],
    screen: ['zz', 'zt', 'zb', 'Ctrl+u', 'Ctrl+d', 'Ctrl+f', 'Ctrl+b']
  },
  // Search motions
  search: {
    character: ['f{char}', 'F{char}', 't{char}', 'T{char}', ';', ','],
    pattern: ['/{pattern}', '?{pattern}', 'n', 'N', '*', '#'],
    bracket: ['%', '[{', ']}', '[(', ')]']
  },
  // Editing motions
  editing: {
    insert: ['i', 'I', 'a', 'A', 'o', 'O', 's', 'S'],
    change: ['c{motion}', 'cc', 'C', 'r{char}', 'R'],
    delete: ['d{motion}', 'dd', 'D', 'x', 'X'],
    copy: ['y{motion}', 'yy', 'Y'],
    paste: ['p', 'P'],
    undo: ['u', 'Ctrl+r']
  },
  // Text objects
  textObjects: {
    word: ['iw', 'aw', 'iW', 'aW'],
    sentence: ['is', 'as'],
    paragraph: ['ip', 'ap'],
    quotes: ['i"', 'a"', "i'", "a'", 'i`', 'a`'],
    brackets: ['i(', 'a(', 'i)', 'a)', 'i[', 'a[', 'i]', 'a]', 'i{', 'a{', 'i}', 'a}'],
    tags: ['it', 'at']
  },
  // Visual mode
  visual: {
    selection: ['v', 'V', 'Ctrl+v', 'gv'],
    operations: ['d', 'c', 'y', '>', '<', '=']
  }
} as const;

export type MotionType = keyof typeof MOTION_DEFINITIONS;