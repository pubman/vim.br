interface MotionHelperProps {
  currentMotion?: string;
  suggestions?: string[];
}

export default function MotionHelper({ currentMotion, suggestions = [] }: MotionHelperProps) {
  const motionCategories = [
    {
      title: 'Navigation',
      motions: [
        { key: 'h', desc: 'Left' },
        { key: 'j', desc: 'Down' },
        { key: 'k', desc: 'Up' },
        { key: 'l', desc: 'Right' },
        { key: 'w', desc: 'Next word' },
        { key: 'b', desc: 'Previous word' },
        { key: 'e', desc: 'End of word' },
      ]
    },
    {
      title: 'Line Movement',
      motions: [
        { key: '0', desc: 'Start of line' },
        { key: '^', desc: 'First non-blank' },
        { key: '$', desc: 'End of line' },
        { key: 'gg', desc: 'First line' },
        { key: 'G', desc: 'Last line' },
      ]
    },
    {
      title: 'Search',
      motions: [
        { key: 'f{char}', desc: 'Find character' },
        { key: 'F{char}', desc: 'Find backward' },
        { key: 't{char}', desc: 'Till character' },
        { key: 'T{char}', desc: 'Till backward' },
        { key: '/{pattern}', desc: 'Search forward' },
      ]
    },
    {
      title: 'Text Objects',
      motions: [
        { key: 'ci"', desc: 'Change inside quotes' },
        { key: 'da(', desc: 'Delete around parens' },
        { key: 'yi{', desc: 'Yank inside braces' },
        { key: 'ca[', desc: 'Change around brackets' },
      ]
    }
  ];

  return (
    <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-text-primary font-semibold">Motion Helper</h3>
        <div className="w-3 h-3 bg-vim-command rounded-full animate-pulse-slow"></div>
      </div>

      {/* Current motion highlight */}
      {currentMotion && (
        <div className="mb-6 p-3 bg-vim-normal bg-opacity-20 border border-vim-normal border-opacity-30 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-vim-normal font-mono font-bold">{currentMotion}</span>
            <span className="text-text-secondary text-sm">Current motion</span>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-text-secondary text-sm font-medium mb-2">Suggestions</h4>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <span
                key={index}
                className="bg-vim-insert bg-opacity-20 text-vim-insert border border-vim-insert border-opacity-30 px-3 py-1 rounded-full font-mono text-sm"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Motion categories */}
      <div className="space-y-4">
        {motionCategories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h4 className="text-text-secondary text-sm font-medium mb-2">{category.title}</h4>
            <div className="grid grid-cols-1 gap-1">
              {category.motions.map((motion, motionIndex) => (
                <div
                  key={motionIndex}
                  className="flex items-center justify-between py-1 px-2 rounded hover:bg-bg-tertiary transition-colors group"
                >
                  <span className="font-mono text-sm text-text-primary group-hover:text-vim-normal transition-colors">
                    {motion.key}
                  </span>
                  <span className="text-text-tertiary text-xs">{motion.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Practice mode indicator */}
      <div className="mt-6 pt-4 border-t border-border-primary">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-tertiary">Practice Mode</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-status-success rounded-full"></div>
            <span className="text-text-tertiary">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}