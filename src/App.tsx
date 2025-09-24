import { useState, useEffect, useCallback } from 'react'
import Stats from './components/Stats'
import CodeWindow from './components/CodeWindow'
import ProfileSidebar from './components/ProfileSidebar'
import MotionHelper from './components/MotionHelper'
import { TaskGenerator } from './services/TaskGenerator'
import { Task, DifficultyLevel } from './types/Task'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [taskGenerator] = useState(() => new TaskGenerator())
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>('beginner')
  const [completedTasks, setCompletedTasks] = useState<string[]>([])

  // Generate initial task on app load
  useEffect(() => {
    generateNewTask();
  }, []);

  const generateNewTask = useCallback(() => {
    const newTask = taskGenerator.generateTask({
      difficulty: currentDifficulty,
      avoidRecentMotions: getRecentMotions()
    });
    setCurrentTask(newTask);
  }, [taskGenerator, currentDifficulty]);

  const getRecentMotions = () => {
    // Return motions from recently completed tasks to avoid repetition
    return completedTasks.slice(-5); // Last 5 completed task motions
  };

  const handleCodeChange = (newCode: string) => {
    if (currentTask) {
      // Check if user has achieved the target state
      if (newCode.trim() === currentTask.target.trim()) {
        handleTaskCompleted();
      }
    }
  };

  const handleTaskCompleted = () => {
    if (currentTask) {
      setCompletedTasks(prev => [...prev, ...currentTask.focusMotions]);
      // Generate new task after a brief delay
      setTimeout(generateNewTask, 1000);
    }
  };

  const handleMotionExecuted = (motion: string) => {
    console.log('Motion executed:', motion);

    // Handle special actions
    if (motion === 'new') {
      generateNewTask();
    } else if (motion === 'hint') {
      if (currentTask?.hints && currentTask.hints.length > 0) {
        const randomHint = currentTask.hints[Math.floor(Math.random() * currentTask.hints.length)];
        console.log('Hint:', randomHint);
        // In a real implementation, this would show a toast or modal
      }
    } else if (motion === 'skip') {
      generateNewTask();
    }
  };

  // Sample motion progress data - represents learning progress for each vim motion
  const motionProgress = {
    // Movement motions (mastered)
    'h': 'mastered', 'j': 'mastered', 'k': 'mastered', 'l': 'mastered',
    'w': 'mastered', 'b': 'mastered', 'e': 'mastered', '0': 'mastered',
    '^': 'learning', '$': 'learning', 'gg': 'learning', 'G': 'learning',

    // Search motions (mixed progress)
    'f': 'mastered', 'F': 'mastered', 't': 'learning', 'T': 'learning',
    '/': 'learning', '?': 'locked', 'n': 'locked', 'N': 'locked',
    '*': 'locked', '#': 'locked',

    // Edit motions (early learning)
    'i': 'mastered', 'a': 'mastered', 'o': 'learning', 'O': 'learning',
    's': 'learning', 'c': 'locked', 'd': 'locked', 'y': 'locked',
    'p': 'locked', 'P': 'locked', 'x': 'locked', 'X': 'locked',

    // Text object motions (mostly locked)
    'iw': 'learning', 'aw': 'learning', 'i"': 'locked', 'a"': 'locked',
    'i(': 'locked', 'a(': 'locked', 'i{': 'locked', 'a{': 'locked',
    'it': 'locked', 'at': 'locked',

    // Visual motions (basic)
    'v': 'mastered', 'V': 'learning', 'gv': 'locked',

    // Macro motions (locked)
    'q': 'locked', '@': 'locked'
  } as const;

  const stats = {
    speed: 64.3,
    speedChange: 7.0,
    efficiency: 95.7,
    efficiencyChange: -8.2,
    score: 2781,
    scoreChange: -428,
    currentMotionCategory: currentTask?.category || 'Movement',
    efficiencyLessons: completedTasks.length,
    dailyGoalProgress: Math.min((completedTasks.length * 10), 100), // Progress based on completed tasks
    dailyGoalCurrent: Math.floor(completedTasks.length * 2.5), // Estimate 2.5 minutes per task
    dailyGoalTarget: 30,
    motionProgress
  }

  return (
    <ThemeProvider>
      <div className="relative min-h-screen w-full bg-bg-primary mt-[20vh] text-text-primary">
        <ProfileSidebar
          isOpen={true}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className={`transition-all w-full h--full  flex flex-col items-center justify-center duration-300 ${sidebarOpen ? 'ml-88' : 'ml-0'}`}>

          <div className="flex-col max-w-2xl">
            <Stats {...stats} />

            {currentTask && (
              <>
                {/* Task Header */}
                <div className="bg-bg-secondary rounded-xl p-4 mb-4 border border-border-primary">
                  <h2 className="text-text-primary font-mono font-semibold text-lg mb-2">
                    {currentTask.title}
                  </h2>
                  <p className="text-bg-primary text-sm mb-3">
                    {currentTask.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="bg-vim-normal px-2 py-1 rounded text-white font-mono">
                      {currentTask.difficulty.toUpperCase()}
                    </span>
                    <span className="bg-bg-tertiary px-2 py-1 rounded text-text-secondary">
                      {currentTask.category}
                    </span>
                    <div className="flex space-x-1">
                      {currentTask.focusMotions.map((motion, idx) => (
                        <span key={idx} className="bg-vim-insert px-2 py-1 rounded text-white font-mono text-xs">
                          {motion}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <CodeWindow
                  currentCode={currentTask.input}
                  targetCode={currentTask.target}
                  onCodeChange={handleCodeChange}
                  onMotionExecuted={handleMotionExecuted}
                />
              </>
            )}

            {!currentTask && (
              <div className="bg-bg-secondary rounded-xl p-8 text-center border border-border-primary">
                <p className="text-text-secondary">Loading task...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
