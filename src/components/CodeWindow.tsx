import { useState, useCallback, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vim, Vim, getCM } from '@replit/codemirror-vim';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { Decoration, DecorationSet } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { useTheme } from '../contexts/ThemeContext';

interface Position {
  line: number;
  ch: number;
}

interface Selection {
  from: Position;
  to: Position;
}

interface SuccessCondition {
  cursorPosition?: Position;
  selections?: Selection[];
  highlights?: Selection[];
}

interface CodeWindowProps {
  currentCode: string;
  targetCode: string;
  successCondition?: SuccessCondition;
  onCodeChange: (code: string) => void;
  onMotionExecuted: (motion: string) => void;
}

export default function CodeWindow({
  currentCode,
  targetCode,
  successCondition,
  onCodeChange,
  onMotionExecuted
}: CodeWindowProps) {
  const { currentTheme } = useTheme();
  const [vimMode, setVimMode] = useState('normal');
  const [vimStatus, setVimStatus] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ line: 0, ch: 0 });
  const editorRef = useRef(null);
  const targetEditorRef = useRef(null);

  const createTargetDecorations = useCallback((state: EditorState): DecorationSet => {
    if (!successCondition) return Decoration.none;

    const decorations = [];

    // Create cursor decoration
    if (successCondition.cursorPosition) {
      const { line, ch } = successCondition.cursorPosition;
      try {
        const lineObj = state.doc.line(line + 1);
        const pos = Math.min(lineObj.from + ch, lineObj.to);

        const cursorElement = document.createElement('span');
        cursorElement.className = 'cm-target-cursor';
        cursorElement.innerHTML = '&nbsp;';
        cursorElement.style.cssText = `
          display: inline-block;
          width: 0px;
          border-left: 2px solid ${currentTheme.colors.vim.visual};
          height: 1.2em;
          animation: blink 1s step-end infinite;
          pointer-events: none;
          position: relative;
          top: 0;
        `;

        decorations.push(
          Decoration.widget({
            widget: cursorElement,
            side: 0
          }).range(pos)
        );
      } catch (e) {
        console.warn('Invalid cursor position for target decoration');
      }
    }

    // Create selection decorations
    if (successCondition.selections) {
      successCondition.selections.forEach(selection => {
        try {
          const fromLineObj = state.doc.line(selection.from.line + 1);
          const toLineObj = state.doc.line(selection.to.line + 1);
          const fromPos = Math.min(fromLineObj.from + selection.from.ch, fromLineObj.to);
          const toPos = Math.min(toLineObj.from + selection.to.ch, toLineObj.to);

          decorations.push(
            Decoration.mark({
              class: 'cm-target-selection'
            }).range(fromPos, toPos)
          );
        } catch (e) {
          console.warn('Invalid selection for target decoration');
        }
      });
    }

    // Create highlight decorations
    if (successCondition.highlights) {
      successCondition.highlights.forEach(highlight => {
        try {
          const fromLineObj = state.doc.line(highlight.from.line + 1);
          const toLineObj = state.doc.line(highlight.to.line + 1);
          const fromPos = Math.min(fromLineObj.from + highlight.from.ch, fromLineObj.to);
          const toPos = Math.min(toLineObj.from + highlight.to.ch, toLineObj.to);

          decorations.push(
            Decoration.mark({
              class: 'cm-target-highlight'
            }).range(fromPos, toPos)
          );
        } catch (e) {
          console.warn('Invalid highlight for target decoration');
        }
      });
    }

    return Decoration.set(decorations);
  }, [successCondition]);

  const targetExtensions = [
    javascript(),
    EditorView.theme({
      '&': {
        fontSize: '1.125rem',
        fontFamily: 'JetBrains Mono, monospace',
      },
      '.cm-content': {
        padding: '16px',
        backgroundColor: currentTheme.colors.bg.tertiary,
        color: currentTheme.colors.text.secondary,
        minHeight: '300px',
      },
      '.cm-focused': {
        outline: 'none',
      },
      '.cm-editor': {
        borderRadius: '0.75rem',
        border: `2px dashed ${currentTheme.colors.border.secondary}`,
        backgroundColor: currentTheme.colors.bg.tertiary,
        opacity: '0.9',
      },
      '@keyframes blink': {
        '0%, 50%': { opacity: '1' },
        '51%, 100%': { opacity: '0' },
      },
      '.cm-target-cursor': {
        position: 'absolute',
        borderLeft: `2px solid ${currentTheme.colors.vim.visual}`,
        height: '1.2em',
        animation: 'blink 1s step-end infinite',
      },
      '.cm-target-selection': {
        backgroundColor: `${currentTheme.colors.vim.visual}33`,
        border: `1px solid ${currentTheme.colors.vim.visual}`,
        borderRadius: '2px',
      },
      '.cm-target-highlight': {
        backgroundColor: `${currentTheme.colors.vim.command}22`,
        border: `1px solid ${currentTheme.colors.vim.command}`,
        borderRadius: '2px',
      },
      '.cm-cursor': {
        display: 'none',
      },
      '.cm-activeLine': {
        backgroundColor: 'transparent',
      },
      '.cm-selection': {
        backgroundColor: 'transparent',
      },
    }),
    EditorView.decorations.of((view) => {
      return createTargetDecorations(view.state);
    }),
    EditorState.readOnly.of(true),
    EditorView.editable.of(false),
  ];

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


  const onTargetEditorReady = useCallback((view: EditorView) => {
    targetEditorRef.current = view;
  }, []);


  return (
    <div className="flex-1 flex flex-col">
      {/* Code display area */}
      <div className="flex-1 flex gap-0">
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
              autoFocus: true,
            }}
          />
        </div>

        {/* Target code (read-only) - 40% width */}
        <div className="w-[40%] relative">
          <div className="absolute bottom-0 right-2 z-10 bg-bg-primary text-text-secondary text-xs px-2 py-1 rounded border border-border-secondary font-mono">
            TARGET
          </div>
          <CodeMirror
            value={targetCode}
            extensions={targetExtensions}
            onCreateEditor={onTargetEditorReady}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: false,
              bracketMatching: false,
              closeBrackets: false,
              autocompletion: false,
              highlightSelectionMatches: false,
              searchKeymap: false,
            }}
          />
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
