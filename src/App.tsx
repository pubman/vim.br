import { useState, useEffect, useCallback, useRef } from 'react'
import Stats from './components/Stats'
import CodeWindow from './components/CodeWindow'
import { TaskGenerator } from './services/TaskGenerator'
import { type Task, type DifficultyLevel } from './types/Task'
import { ThemeProvider } from './contexts/ThemeContext'

// --- Persistence ---

interface PersistedStats {
  date: string; // YYYY-MM-DD, used to detect day rollover
  tasksCompletedToday: number;
  totalTimeToday: number; // ms
  motionCounts: Record<string, number>; // motion → completions count
  score: number;
}

const STORAGE_KEY = 'vimbr-stats';
const TODAY = new Date().toISOString().slice(0, 10);

function loadStats(): PersistedStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: PersistedStats = JSON.parse(raw);
      if (parsed.date === TODAY) return parsed;
    }
  } catch {}
  return { date: TODAY, tasksCompletedToday: 0, totalTimeToday: 0, motionCounts: {}, score: 0 };
}

function saveStats(stats: PersistedStats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function motionProgress(counts: Record<string, number>): Record<string, 'mastered' | 'learning' | 'locked'> {
  const LEARNING_THRESHOLD = 1;
  const MASTERED_THRESHOLD = 5;
  const allMotions = [
    'h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '^', '$', 'gg', 'G',
    'f', 'F', 't', 'T', '/', '?', 'n', 'N', '*', '#', '%', ';', ',',
    'i', 'a', 'o', 'O', 'A', 'I', 's', 'c', 'd', 'y', 'p', 'P', 'x', 'X', 'r', 'R',
    'iw', 'aw', 'i"', 'a"', 'i(', 'a(', 'i{', 'a{', 'it', 'at',
    'v', 'V', 'gv',
    'q', '@'
  ];
  const result: Record<string, 'mastered' | 'learning' | 'locked'> = {};
  for (const motion of allMotions) {
    const count = counts[motion] ?? 0;
    result[motion] = count >= MASTERED_THRESHOLD ? 'mastered' : count >= LEARNING_THRESHOLD ? 'learning' : 'locked';
  }
  return result;
}

const DAILY_GOAL_MS = 30 * 60 * 1000; // 30 minutes

// --- App ---

function App() {
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [taskGenerator] = useState(() => new TaskGenerator())
  const [currentDifficulty] = useState<DifficultyLevel>('beginner')
  const [taskSucceeded, setTaskSucceeded] = useState(false)
  const [persistedStats, setPersistedStats] = useState<PersistedStats>(loadStats)
  const taskStartTime = useRef<number>(Date.now())

  useEffect(() => {
    generateNewTask();
  }, []);

  const generateNewTask = useCallback(() => {
    const newTask = taskGenerator.generateTask({ difficulty: currentDifficulty });
    setCurrentTask(newTask);
    setTaskSucceeded(false);
    taskStartTime.current = Date.now();
  }, [taskGenerator, currentDifficulty]);

  const isNavTask = (task: Task) => task.input === task.target;

  const handleTaskCompleted = useCallback(() => {
    if (!currentTask || taskSucceeded) return;

    const elapsed = Date.now() - taskStartTime.current;

    setPersistedStats(prev => {
      const newCounts = { ...prev.motionCounts };
      for (const motion of currentTask.focusMotions) {
        newCounts[motion] = (newCounts[motion] ?? 0) + 1;
      }
      const updated: PersistedStats = {
        date: TODAY,
        tasksCompletedToday: prev.tasksCompletedToday + 1,
        totalTimeToday: prev.totalTimeToday + elapsed,
        motionCounts: newCounts,
        score: prev.score + 100,
      };
      saveStats(updated);
      return updated;
    });

    setTaskSucceeded(true);
    setTimeout(generateNewTask, 1200);
  }, [currentTask, taskSucceeded, generateNewTask]);

  const handleCursorChange = useCallback((cursor: { line: number; ch: number }) => {
    if (!currentTask || !isNavTask(currentTask) || !currentTask.cursorTarget || taskSucceeded) return;
    if (
      cursor.line === currentTask.cursorTarget.line &&
      cursor.ch === currentTask.cursorTarget.column
    ) {
      handleTaskCompleted();
    }
  }, [currentTask, taskSucceeded, handleTaskCompleted]);

  const handleCodeChange = useCallback((newCode: string) => {
    if (!currentTask || isNavTask(currentTask) || taskSucceeded) return;
    if (newCode.trim() === currentTask.target.trim()) {
      handleTaskCompleted();
    }
  }, [currentTask, taskSucceeded, handleTaskCompleted]);

  const handleMotionExecuted = (motion: string) => {
    if (motion === 'new' || motion === 'skip') {
      generateNewTask();
    } else if (motion === 'hint') {
      if (currentTask?.hints && currentTask.hints.length > 0) {
        // Hints shown in task description area — no-op for now
      }
    }
  };

  const progress = motionProgress(persistedStats.motionCounts);
  const dailyGoalProgress = Math.min((persistedStats.totalTimeToday / DAILY_GOAL_MS) * 100, 100);
  const dailyGoalCurrent = Math.round(persistedStats.totalTimeToday / 60000);

  const stats = {
    speed: 0,
    speedChange: 0,
    efficiency: 0,
    efficiencyChange: 0,
    score: persistedStats.score,
    scoreChange: 0,
    currentMotionCategory: currentTask?.category || 'navigation',
    efficiencyLessons: persistedStats.tasksCompletedToday,
    dailyGoalProgress,
    dailyGoalCurrent,
    dailyGoalTarget: 30,
    motionProgress: progress
  }

  const successCondition = currentTask?.cursorTarget && isNavTask(currentTask)
    ? { cursorPosition: { line: currentTask.cursorTarget.line, ch: currentTask.cursorTarget.column } }
    : undefined;

  return (
    <ThemeProvider>
      <div className="min-h-screen w-full bg-bg-primary text-text-primary pt-6 pb-12">
        <div className="w-[90%] max-w-7xl mx-auto flex flex-col gap-3">

          <Stats {...stats} />

          {currentTask && (
            <>
              {/* Task header */}
              <div className={`rounded-lg px-4 py-3 border transition-all duration-300 ${
                taskSucceeded
                  ? 'bg-green-900/20 border-green-500/60'
                  : 'bg-bg-secondary border-border-primary'
              }`}>
                {taskSucceeded ? (
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-mono font-bold text-lg">✓</span>
                    <span className="text-green-400 font-mono font-semibold">Nice! Loading next task…</span>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-text-primary font-mono font-semibold mb-1">
                        {currentTask.title}
                      </h2>
                      <p className="text-text-secondary text-sm">
                        {currentTask.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs flex-shrink-0 mt-0.5">
                      <span className="bg-vim-normal px-2 py-0.5 rounded text-white font-mono">
                        {currentTask.difficulty.toUpperCase()}
                      </span>
                      <span className="bg-bg-tertiary px-2 py-0.5 rounded text-text-secondary">
                        {isNavTask(currentTask) ? 'navigate' : 'edit'}
                      </span>
                      {currentTask.focusMotions.map((motion, idx) => (
                        <span key={idx} className="bg-vim-insert px-2 py-0.5 rounded text-white font-mono">
                          {motion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <CodeWindow
                currentCode={currentTask.input}
                targetCode={currentTask.target}
                cursorStart={currentTask.cursorStart
                  ? { line: currentTask.cursorStart.line, ch: currentTask.cursorStart.column }
                  : undefined}
                successCondition={successCondition}
                onCodeChange={handleCodeChange}
                onCursorChange={handleCursorChange}
                onMotionExecuted={handleMotionExecuted}
              />
            </>
          )}

          {!currentTask && (
            <div className="bg-bg-secondary rounded-lg p-8 text-center border border-border-primary">
              <p className="text-text-secondary">Loading task…</p>
            </div>
          )}

        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
