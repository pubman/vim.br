import { useState, useCallback, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vim, Vim, getCM } from '@replit/codemirror-vim';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';

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
        backgroundColor: '#2a2a2a',
        color: '#cccccc',
        minHeight: '300px',
      },
      '.cm-focused': {
        outline: 'none',
      },
      '.cm-editor': {
        borderRadius: '0.75rem',
        border: '1px solid #3a3a3a',
        backgroundColor: '#2a2a2a',
      },
      '.cm-cursor': {
        borderLeftColor: '#8b5cf6',
        borderLeftWidth: '2px',
      },
      '.cm-activeLine': {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
      },
      '.cm-selection': {
        backgroundColor: 'rgba(139, 92, 246, 0.3)',
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
    <div className="p-4 font-mono text-code leading-relaxed text-dark-200 bg-dark-800 rounded-xl border border-dark-600 min-h-[300px]">
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
      <div className="flex-1 grid grid-cols-2 gap-6 p-6">
        {/* Interactive code editor */}
        <div className="bg-dark-700 rounded-xl p-6 border border-dark-600">
          <h3 className="text-dark-300 text-sm font-medium mb-4 border-b border-dark-600 pb-2">
            Interactive Code (Vim Mode)
          </h3>
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

        {/* Target code (read-only) */}
        <div className="bg-dark-700 rounded-xl p-6 border border-dark-600">
          <h3 className="text-dark-300 text-sm font-medium mb-4 border-b border-dark-600 pb-2">
            Target Code
          </h3>
          {renderStaticCode(targetCode)}
        </div>
      </div>

      {/* Vim status bar */}
      <div className="bg-dark-700 border-t border-dark-600 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-dark-300 text-sm font-medium">Mode:</span>
              <span className={`text-sm font-mono px-2 py-1 rounded ${
                vimMode === 'normal' ? 'bg-vim-normal text-white' :
                vimMode === 'insert' ? 'bg-vim-insert text-white' :
                vimMode === 'visual' ? 'bg-vim-visual text-white' :
                'bg-dark-600 text-dark-300'
              }`}>
                {vimMode.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-dark-300 text-sm">Position:</span>
              <span className="text-dark-200 text-sm font-mono">
                {cursorPosition.line + 1}:{cursorPosition.ch + 1}
              </span>
            </div>
            {vimStatus && (
              <div className="flex items-center space-x-2">
                <span className="text-dark-300 text-sm">Status:</span>
                <span className="text-dark-200 text-sm font-mono">{vimStatus}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onMotionExecuted('hint')}
              className="text-vim-command hover:text-green-400 text-sm font-medium transition-colors"
            >
              Hint
            </button>
            <button
              onClick={() => onMotionExecuted('skip')}
              className="text-dark-400 hover:text-dark-300 text-sm font-medium transition-colors"
            >
              Skip
            </button>
            <button
              onClick={() => onMotionExecuted('new')}
              className="text-vim-insert hover:text-cyan-400 text-sm font-medium transition-colors"
            >
              New Problem
            </button>
          </div>
        </div>
      </div>

      {/* Quick reference */}
      <div className="bg-dark-800 border-t border-dark-600 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="text-dark-400 text-sm">Quick Reference:</span>
            <div className="flex items-center space-x-3">
              {['hjkl', 'w', 'b', '$', '0', 'gg', 'G', 'f', 'F', 't', 'T'].map((motion) => (
                <span key={motion} className="text-dark-300 font-mono text-sm bg-dark-700 px-2 py-1 rounded">
                  {motion}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-dark-400 text-sm">Difficulty:</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-full ${
                    level <= 2 ? 'bg-vim-normal' : 'bg-dark-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}