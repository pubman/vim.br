interface MetricsProps {
  speed: number;
  speedChange: number;
  efficiency: number;
  efficiencyChange: number;
  score: number;
  scoreChange: number;
  currentMotionCategory: string;
  efficiencyLessons: number;
  dailyGoalProgress: number; // 0-100
  dailyGoalCurrent: number; // minutes
  dailyGoalTarget: number; // minutes
  motionProgress: Record<string, 'mastered' | 'learning' | 'locked'>;
}

export default function Stats({
  speed,
  speedChange,
  efficiency,
  efficiencyChange,
  score,
  scoreChange,
  currentMotionCategory,
  efficiencyLessons,
  dailyGoalProgress,
  dailyGoalCurrent,
  dailyGoalTarget,
  motionProgress
}: MetricsProps) {
  const formatChange = (change: number) => {
    if (change === 0) return '';
    const sign = change > 0 ? '+' : '';
    return `(${sign}${change.toFixed(1)})`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-correct-500';
    if (change < 0) return 'text-incorrect-500';
    return 'text-dark-400';
  };

  const getMotionStatusColor = (status: 'mastered' | 'learning' | 'locked') => {
    switch (status) {
      case 'mastered': return 'bg-correct-500 text-white';
      case 'learning': return 'bg-vim-visual text-white';
      case 'locked': return 'bg-dark-600 text-dark-400';
      default: return 'bg-dark-600 text-dark-400';
    }
  };

  const motionCategories = [
    { name: 'Move', motions: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '^', '$', 'gg', 'G'] },
    { name: 'Search', motions: ['f', 'F', 't', 'T', '/', '?', 'n', 'N', '*', '#'] },
    { name: 'Edit', motions: ['i', 'a', 'o', 'O', 's', 'c', 'd', 'y', 'p', 'P', 'x', 'X'] },
    { name: 'Text', motions: ['iw', 'aw', 'i"', 'a"', 'i(', 'a(', 'i{', 'a{', 'it', 'at'] },
    { name: 'Visual', motions: ['v', 'V', 'gv'] },
    { name: 'Macro', motions: ['q', '@'] }
  ];

  return (
    <div className="bg-bg-secondary border-b border-border-primary px-6 py-4 space-y-4">
      {/* Top metrics row */}
      <div className="flex items-center space-x-8">
        {/* Speed */}
        <div className="flex items-baseline space-x-2">
          <span className="text-text-secondary text-stat font-medium">Speed:</span>
          <span className="text-text-primary font-mono text-lg font-semibold">
            {speed.toFixed(1)}mpm
          </span>
          <span className={`text-xs font-mono ${getChangeColor(speedChange)}`}>
            {formatChange(speedChange)}
          </span>
        </div>

        {/* Efficiency */}
        <div className="flex items-baseline space-x-2">
          <span className="text-text-secondary text-stat font-medium">Efficiency:</span>
          <span className="text-text-primary font-mono text-lg font-semibold">
            {efficiency.toFixed(1)}%
          </span>
          <span className={`text-xs font-mono ${getChangeColor(efficiencyChange)}`}>
            {formatChange(efficiencyChange)}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-baseline space-x-2">
          <span className="text-text-secondary text-stat font-medium">Score:</span>
          <span className="text-text-primary font-mono text-lg font-semibold">
            {score.toLocaleString()}
          </span>
          <span className={`text-xs font-mono ${getChangeColor(scoreChange)}`}>
            {formatChange(scoreChange)}
          </span>
        </div>
      </div>

      {/* All motions section */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-text-secondary text-stat font-medium">All motions:</span>
          <div className="flex flex-wrap gap-1">
            {motionCategories.map((category) => (
              <div key={category.name} className="flex gap-1">
                {category.motions.map((motion) => {
                  const status = motionProgress[motion] || 'locked';
                  return (
                    <div
                      key={motion}
                      className={`w-8 h-6 rounded text-xs flex items-center justify-center font-mono font-medium ${getMotionStatusColor(status)}`}
                    >
                      {motion.length > 2 ? motion.substring(0, 2) : motion}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom info section */}
      <div className="flex flex-col items-start justify-between">
        {/* Current motion */}
        <div className="flex items-center space-x-2">
          <span className="text-text-secondary text-stat font-medium">Current motion:</span>
          <span className="text-text-primary text-sm">
            {currentMotionCategory} motions are unlocked.
          </span>
        </div>

        {/* Efficiency lessons */}
        <div className="flex items-center space-x-2">
          <span className="text-text-secondary text-stat font-medium">Efficiency:</span>
          <span className="text-text-primary text-sm">
            {efficiencyLessons} lessons with {efficiency.toFixed(0)}% efficiency.
          </span>
        </div>

        {/* Daily goal */}
        <div className="flex w-full items-center space-x-2">
          <span className="text-text-secondary text-stat font-medium">Daily goal: <span className="text-text-tertiary text-xs font-mono">
            {dailyGoalCurrent}m/{dailyGoalTarget} minutes
          </span></span>

          <div className="w-full bg-bg-tertiary rounded-full h-2">
            <div
              className="bg-status-success h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(dailyGoalProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
