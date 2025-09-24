import {
  type Task,
  type TaskTemplate,
  type TaskGenerationOptions,
  type DifficultyLevel,
  type MotionCategory,
  type CursorPosition,
  MOTION_DEFINITIONS
} from '../types/Task';
import { TASK_TEMPLATES } from '../data/taskTemplates';

export class TaskGenerator {
  private taskTemplates: TaskTemplate[] = [];

  constructor() {
    this.initializeTemplates();
  }

  /**
   * Generate a new task based on options and user progress
   */
  generateTask(options: TaskGenerationOptions): Task {
    const eligibleTemplates = this.filterTemplates(options);

    if (eligibleTemplates.length === 0) {
      // Fallback to basic navigation task if no templates match
      return this.createFallbackTask(options.difficulty);
    }

    const template = this.selectWeightedRandom(eligibleTemplates);
    return this.createTaskFromTemplate(template, options);
  }

  /**
   * Filter templates based on generation options
   */
  private filterTemplates(options: TaskGenerationOptions): TaskTemplate[] {
    return this.taskTemplates.filter(template => {
      // Filter by difficulty
      if (template.difficulty !== options.difficulty) {
        return false;
      }

      // Filter by category if specified
      if (options.category && template.category !== options.category) {
        return false;
      }

      // Filter by focus motions if specified
      if (options.focusMotions && options.focusMotions.length > 0) {
        const hasMatchingMotion = template.focusMotions.some(motion =>
          options.focusMotions!.includes(motion)
        );
        if (!hasMatchingMotion) {
          return false;
        }
      }

      // Avoid recent motions if specified
      if (options.avoidRecentMotions && options.avoidRecentMotions.length > 0) {
        const hasRecentMotion = template.focusMotions.some(motion =>
          options.avoidRecentMotions!.includes(motion)
        );
        if (hasRecentMotion) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Select a template using weighted random selection
   */
  private selectWeightedRandom(templates: TaskTemplate[]): TaskTemplate {
    const totalWeight = templates.reduce((sum, template) => sum + template.weight, 0);
    let random = Math.random() * totalWeight;

    for (const template of templates) {
      random -= template.weight;
      if (random <= 0) {
        return template;
      }
    }

    // Fallback to first template
    return templates[0];
  }

  /**
   * Create a task from a template with variations
   */
  private createTaskFromTemplate(template: TaskTemplate, options: TaskGenerationOptions): Task {
    const variations = this.generateVariations(template);
    const selectedVariation = variations[Math.floor(Math.random() * variations.length)];

    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      id: taskId,
      title: selectedVariation.title,
      description: template.description,
      input: selectedVariation.input,
      target: selectedVariation.target,
      motions: selectedVariation.optimalMotions,
      difficulty: template.difficulty,
      category: template.category,
      focusMotions: template.focusMotions,
      hints: this.generateHints(template.focusMotions),
      cursorStart: selectedVariation.cursorStart,
      cursorTarget: selectedVariation.cursorTarget
    };
  }

  /**
   * Generate variations of a template by applying different transformations
   */
  private generateVariations(template: TaskTemplate): {
    title: string;
    input: string;
    target: string;
    optimalMotions: string[];
    cursorStart: CursorPosition;
    cursorTarget: CursorPosition;
  }[] {
    // For now, return a single variation
    // In the future, this could generate multiple random variations
    const baseCode = template.baseCode;

    // Apply transformations based on template
    const variation = this.applyTransformations(template);

    return [variation];
  }

  /**
   * Apply transformations to create input/target states
   */
  private applyTransformations(template: TaskTemplate): {
    title: string;
    input: string;
    target: string;
    optimalMotions: string[];
    cursorStart: CursorPosition;
    cursorTarget: CursorPosition;
  } {
    // This is a simplified implementation
    // In a full implementation, this would apply the template transformations

    const lines = template.baseCode.split('\n');
    const randomLine = Math.floor(Math.random() * lines.length);
    const randomCol = Math.floor(Math.random() * (lines[randomLine]?.length || 0));

    return {
      title: template.title,
      input: template.baseCode,
      target: template.baseCode, // For now, same as input
      optimalMotions: template.focusMotions,
      cursorStart: { line: 0, column: 0 },
      cursorTarget: { line: randomLine, column: randomCol }
    };
  }

  /**
   * Generate hints based on focus motions
   */
  private generateHints(focusMotions: string[]): string[] {
    const hints: string[] = [];

    for (const motion of focusMotions) {
      switch (motion) {
        case 'w':
          hints.push('Try using "w" to move forward by words');
          break;
        case 'b':
          hints.push('Use "b" to move backward by words');
          break;
        case '$':
          hints.push('Press "$" to jump to the end of the line');
          break;
        case '0':
          hints.push('Press "0" to jump to the beginning of the line');
          break;
        case 'f':
          hints.push('Use "f{character}" to find the next occurrence of a character');
          break;
        case 'gg':
          hints.push('Press "gg" to jump to the first line');
          break;
        case 'G':
          hints.push('Press "G" to jump to the last line');
          break;
        default:
          hints.push(`Focus on using the "${motion}" motion`);
      }
    }

    return hints;
  }

  /**
   * Create a fallback task when no templates match
   */
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
      motions: ['w', 'w', 'w'],
      difficulty,
      category: 'navigation',
      focusMotions: ['w'],
      hints: ['Use "w" to move forward by words'],
      cursorStart: { line: 0, column: 0 },
      cursorTarget: { line: 0, column: 9 }
    };
  }

  /**
   * Initialize the task templates database
   */
  private initializeTemplates(): void {
    // Use the comprehensive task templates
    this.taskTemplates = TASK_TEMPLATES;
  }

  /**
   * Add a new task template to the generator
   */
  addTemplate(template: TaskTemplate): void {
    this.taskTemplates.push(template);
  }

  /**
   * Get available motion categories for a difficulty level
   */
  getAvailableCategories(difficulty: DifficultyLevel): MotionCategory[] {
    const categories = new Set<MotionCategory>();

    this.taskTemplates
      .filter(template => template.difficulty === difficulty)
      .forEach(template => categories.add(template.category));

    return Array.from(categories);
  }

  /**
   * Get recommended motions for a difficulty level
   */
  getRecommendedMotions(difficulty: DifficultyLevel): string[] {
    switch (difficulty) {
      case 'beginner':
        return ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$'];
      case 'intermediate':
        return ['f', 'F', 't', 'T', '^', 'gg', 'G', '/', '?'];
      case 'advanced':
        return ['iw', 'aw', 'i"', 'a"', 'ci', 'ca', 'di', 'da'];
      case 'expert':
        return ['%', '*', '#', 'n', 'N', '{', '}', '(', ')'];
      case 'master':
        return ['q', '@', 'Ctrl+v', 'gv', 'zz', 'zt', 'zb'];
      default:
        return ['h', 'j', 'k', 'l', 'w', 'b'];
    }
  }
}
