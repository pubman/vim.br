import { useTheme } from '../contexts/ThemeContext';

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
  const { currentTheme } = useTheme();

  const formatChange = (change: number) => {
    if (change === 0) return '';
    const sign = change > 0 ? '+' : '';
    return `(${sign}${change.toFixed(1)})`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return { color: currentTheme.colors.vim.insert };
    if (change < 0) return { color: currentTheme.colors.vim.command };
    return { color: currentTheme.colors.text.tertiary };
  };

  const getMotionStatusStyle = (status: 'mastered' | 'learning' | 'locked') => {
    switch (status) {
      case 'mastered':
        return {
          backgroundColor: currentTheme.colors.vim.insert,
          color: 'white'
        };
      case 'learning':
        return {
          backgroundColor: currentTheme.colors.vim.visual,
          color: 'white'
        };
      case 'locked':
        return {
          backgroundColor: currentTheme.colors.bg.tertiary,
          color: currentTheme.colors.text.tertiary
        };
      default:
        return {
          backgroundColor: currentTheme.colors.bg.tertiary,
          color: currentTheme.colors.text.tertiary
        };
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
          <span className="text-xs font-mono" style={getChangeColor(speedChange)}>
            {formatChange(speedChange)}
          </span>
        </div>

        {/* Efficiency */}
        <div className="flex items-baseline space-x-2">
          <span className="text-text-secondary text-stat font-medium">Efficiency:</span>
          <span className="text-text-primary font-mono text-lg font-semibold">
            {efficiency.toFixed(1)}%
          </span>
          <span className="text-xs font-mono" style={getChangeColor(efficiencyChange)}>
            {formatChange(efficiencyChange)}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-baseline space-x-2">
          <span className="text-text-secondary text-stat font-medium">Score:</span>
          <span className="text-text-primary font-mono text-lg font-semibold">
            {score.toLocaleString()}
          </span>
          <span className="text-xs font-mono" style={getChangeColor(scoreChange)}>
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
                      className="w-8 h-6 rounded text-xs flex items-center justify-center font-mono font-medium"
                      style={getMotionStatusStyle(status)}
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
        <div className="w-full space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-stat font-medium flex-shrink-0">Daily goal:</span>
            <div className="flex-1 min-w-0 bg-red-300 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-red-500 transition-all duration-300"
                style={{
                  width: `${Math.min(dailyGoalProgress, 100)}%`,
                }}
              />
            </div>
            <span className="text-text-tertiary text-xs font-mono flex-shrink-0 min-w-fit">
              {dailyGoalCurrent}m/{dailyGoalTarget}m
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
