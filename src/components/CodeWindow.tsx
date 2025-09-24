import { useState, useCallback, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vim, Vim, getCM } from '@replit/codemirror-vim';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { useTheme } from '../contexts/ThemeContext';

interface CodeWindowProps {
  currentCode: string;
  targetCode: string;
  onCodeChange: (code: string) => void;
  onMotionExecuted: (motion: string) => void;
}

export default function CodeWindow({
  currentCode,
  targetCode,
  onCodeChange,
  onMotionExecuted
}: CodeWindowProps) {
  const { currentTheme } = useTheme();
  const [vimMode, setVimMode] = useState('normal');
  const [vimStatus, setVimStatus] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ line: 0, ch: 0 });
  const editorRef = useRef(null);

  const extensions = [
    vim({
      status: true,
      statusContainer: null, // We'll handle status display ourselves
    }),
    javascript(),
    EditorView.updateListener.of((update) => {
      if (update.selectionSet) {
        const pos = update.state.selection.main.head;
        const line = update.state.doc.lineAt(pos);
        setCursorPosition({
          line: line.number - 1,
          ch: pos - line.from
        });
      }
    }),
    EditorView.theme({
      '&': {
        fontSize: '1.125rem',
        fontFamily: 'JetBrains Mono, monospace',
      },
      '.cm-content': {
        padding: '16px',
        backgroundColor: currentTheme.colors.bg.secondary,
        color: currentTheme.colors.text.primary,
        minHeight: '300px',
      },
      '.cm-focused': {
        outline: 'none',
      },
      '.cm-editor': {
        borderRadius: '0.75rem',
        border: `1px solid ${currentTheme.colors.border.primary}`,
        backgroundColor: currentTheme.colors.bg.secondary,
      },
      '.cm-cursor': {
        borderLeftColor: currentTheme.colors.vim.normal,
        borderLeftWidth: '2px',
      },
      '.cm-activeLine': {
        backgroundColor: `${currentTheme.colors.vim.normal}1a`,
      },
      '.cm-selection': {
        backgroundColor: `${currentTheme.colors.vim.normal}4d`,
      },
    }),
  ];

  const handleCodeChange = useCallback((value: string) => {
    onCodeChange(value);
  }, [onCodeChange]);

  const onEditorReady = useCallback((view: EditorView) => {
    editorRef.current = view;

    // Set up vim mode detection
    const cm = getCM(view);
    if (cm) {
      // Track vim mode changes
      const checkMode = () => {
        const mode = cm.mode?.name || 'normal';
        setVimMode(mode);

        // Get vim status if available
        const vimState = cm.state?.vim;
        if (vimState) {
          setVimStatus(vimState.status || '');
        }
      };

      // Check mode periodically
      const interval = setInterval(checkMode, 100);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    // Track motions and cursor changes for training validation
    onMotionExecuted(`cursor:${cursorPosition.line}:${cursorPosition.ch}`);
  }, [cursorPosition, onMotionExecuted]);

  const renderStaticCode = (code: string) => (
    <div className="font-mono text-code leading-relaxed text-text-primary bg-bg-secondary rounded-xl min-h-[300px] p-4">
      {code.split('\n').map((line, index) => (
        <div key={index} className="min-h-[1.75rem]">
          {line || '\u00A0'}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Code display area */}
      <div className="flex-1 flex gap-6 p-6">
        {/* Interactive code editor - 60% width */}
        <div className="w-[60%] bg-bg-secondary rounded-xl border border-border-primary">
          <CodeMirror
            value={currentCode}
            onChange={handleCodeChange}
            extensions={extensions}
            onCreateEditor={onEditorReady}
            basicSetup={{
              lineNumbers: true,
              foldGutter: false,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: false,
              highlightSelectionMatches: false,
              searchKeymap: false,
            }}
          />
        </div>

        {/* Target code (read-only) - 40% width */}
        <div className="w-[40%] bg-bg-secondary rounded-xl border border-border-primary">
          {renderStaticCode(targetCode)}
        </div>
      </div>

      {/* Vim status bar */}
      <div className="bg-bg-secondary border-t border-border-primary px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-text-secondary text-sm font-medium">Mode:</span>
              <span className={`text-sm font-mono px-2 py-1 rounded ${vimMode === 'normal' ? 'bg-vim-normal text-white' :
                vimMode === 'insert' ? 'bg-vim-insert text-white' :
                  vimMode === 'visual' ? 'bg-vim-visual text-white' :
                    'bg-bg-tertiary text-text-secondary'
                }`}>
                {vimMode.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-text-secondary text-sm">Position:</span>
              <span className="text-text-primary text-sm font-mono">
                {cursorPosition.line + 1}:{cursorPosition.ch + 1}
              </span>
            </div>
            {vimStatus && (
              <div className="flex items-center space-x-2">
                <span className="text-text-secondary text-sm">Status:</span>
                <span className="text-text-primary text-sm font-mono">{vimStatus}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onMotionExecuted('hint')}
              className="text-vim-command hover:opacity-80 text-sm font-medium transition-opacity"
            >
              Hint
            </button>
            <button
              onClick={() => onMotionExecuted('skip')}
              className="text-text-tertiary hover:text-text-secondary text-sm font-medium transition-colors"
            >
              Skip
            </button>
            <button
              onClick={() => onMotionExecuted('new')}
              className="text-vim-insert hover:opacity-80 text-sm font-medium transition-opacity"
            >
              New Problem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
