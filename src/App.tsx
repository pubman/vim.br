import { useState } from 'react'
import Stats from './components/Stats'
import CodeWindow from './components/CodeWindow'
import ProfileSidebar from './components/ProfileSidebar'
import MotionHelper from './components/MotionHelper'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentCode, setCurrentCode] = useState(`grace why brought far forced dad which gold best
always call continued pushed met ground screamed
friend saying headed`)

  const targetCode = `grace why brought far forced dad which gold best
always call continued pushed met ground screamed
friend saying headed`

  const handleCodeChange = (newCode: string) => {
    setCurrentCode(newCode);
  };

  const handleMotionExecuted = (motion: string) => {
    console.log('Motion executed:', motion);
    // TODO: Implement motion tracking and validation
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
    currentMotionCategory: 'Movement',
    efficiencyLessons: 2,
    dailyGoalProgress: 33, // 33% progress (10 out of 30 minutes)
    dailyGoalCurrent: 10,
    dailyGoalTarget: 30,
    motionProgress
  }

  return (
    <div className="min-h-screen w-full bg-dark-900 text-dark-100">
      <ProfileSidebar
        isOpen={true}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className={`transition-all w-full h-screen flex flex-col items-center justify-center duration-300 ${sidebarOpen ? 'ml-88' : 'ml-0'}`}>


        <div className="flex-col max-w-2xl">
          <Stats {...stats} />
          <CodeWindow
            currentCode={currentCode}
            targetCode={targetCode}
            onCodeChange={handleCodeChange}
            onMotionExecuted={handleMotionExecuted}
          />

          {/* <div className="w-80 p-6"> */}
          {/*   <MotionHelper */}
          {/*     currentMotion="w" */}
          {/*     suggestions={['3w', 'dw', 'cw']} */}
          {/*   /> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  )
}

export default App
