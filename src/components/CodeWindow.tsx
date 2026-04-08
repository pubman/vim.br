import { useState, useCallback, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vim, getCM } from '@replit/codemirror-vim';
import { EditorView, WidgetType, Decoration, type DecorationSet } from '@codemirror/view';
import { type Range, EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { oneDarkHighlightStyle } from '@codemirror/theme-one-dark';
import { syntaxHighlighting } from '@codemirror/language';
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
  onCursorChange?: (cursor: { line: number; ch: number }) => void;
  onMotionExecuted: (motion: string) => void;
}

class CursorWidget extends WidgetType {
  color: string;
  constructor(color: string) { super(); this.color = color; }
  toDOM() {
    const el = document.createElement('span');
    el.style.cssText = `
      display: inline-block;
      width: 2px;
      background: ${this.color};
      height: 1.2em;
      animation: vimbr-blink 1s step-end infinite;
      pointer-events: none;
      vertical-align: text-bottom;
    `;
    return el;
  }
  eq(other: CursorWidget) { return other.color === this.color; }
}

export default function CodeWindow({
  currentCode,
  targetCode,
  successCondition,
  onCodeChange,
  onCursorChange,
  onMotionExecuted
}: CodeWindowProps) {
  const { currentTheme } = useTheme();
  const [vimMode, setVimMode] = useState('normal');
  const [vimStatus, setVimStatus] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ line: 0, ch: 0 });

  // Refs so closures inside CodeMirror extensions always see the latest callbacks
  const onCursorChangeRef = useRef(onCursorChange);
  const onCodeChangeRef = useRef(onCodeChange);
  useEffect(() => { onCursorChangeRef.current = onCursorChange; }, [onCursorChange]);
  useEffect(() => { onCodeChangeRef.current = onCodeChange; }, [onCodeChange]);

  const successConditionRef = useRef(successCondition);
  useEffect(() => { successConditionRef.current = successCondition; }, [successCondition]);

  const createTargetDecorations = useCallback((state: EditorState): DecorationSet => {
    const sc = successConditionRef.current;
    if (!sc) return Decoration.none;

    const decorations: Range<Decoration>[] = [];

    if (sc.cursorPosition) {
      const { line, ch } = sc.cursorPosition;
      try {
        const lineObj = state.doc.line(line + 1);
        const pos = Math.min(lineObj.from + ch, lineObj.to);
        decorations.push(
          Decoration.widget({
            widget: new CursorWidget(currentTheme.colors.vim.visual),
            side: 1
          }).range(pos)
        );
      } catch { /* skip */ }
    }

    if (sc.selections) {
      for (const sel of sc.selections) {
        try {
          const fromLine = state.doc.line(sel.from.line + 1);
          const toLine = state.doc.line(sel.to.line + 1);
          const from = Math.min(fromLine.from + sel.from.ch, fromLine.to);
          const to = Math.min(toLine.from + sel.to.ch, toLine.to);
          decorations.push(Decoration.mark({ class: 'cm-target-selection' }).range(from, to));
        } catch { /* skip */ }
      }
    }

    if (sc.highlights) {
      for (const hl of sc.highlights) {
        try {
          const fromLine = state.doc.line(hl.from.line + 1);
          const toLine = state.doc.line(hl.to.line + 1);
          const from = Math.min(fromLine.from + hl.from.ch, fromLine.to);
          const to = Math.min(toLine.from + hl.to.ch, toLine.to);
          decorations.push(Decoration.mark({ class: 'cm-target-highlight' }).range(from, to));
        } catch { /* skip */ }
      }
    }

    return Decoration.set(decorations, true);
  }, [currentTheme]);

  // Stable extensions — use refs for callbacks so the closure never goes stale
  const extensions = useRef([
    vim({ status: true }),
    javascript(),
    syntaxHighlighting(oneDarkHighlightStyle),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onCodeChangeRef.current(update.state.doc.toString());
      }
      if (update.selectionSet || update.docChanged) {
        const pos = update.state.selection.main.head;
        const line = update.state.doc.lineAt(pos);
        const cursor = { line: line.number - 1, ch: pos - line.from };
        setCursorPosition(cursor);
        onCursorChangeRef.current?.(cursor);
      }
    }),
  ]).current;

  // Recreate target extensions when theme changes (they depend on theme colors)
  const targetExtensions = [
    javascript(),
    syntaxHighlighting(oneDarkHighlightStyle),
    EditorView.theme({
      '&': { fontSize: '1rem', fontFamily: 'JetBrains Mono, monospace' },
      '.cm-content': {
        padding: '12px 16px',
        backgroundColor: currentTheme.colors.bg.tertiary,
        minHeight: '160px',
        opacity: '0.75',
      },
      '.cm-focused': { outline: 'none' },
      '.cm-editor': {
        border: `2px dashed ${currentTheme.colors.border.secondary}`,
        backgroundColor: currentTheme.colors.bg.tertiary,
        opacity: '0.9',
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
      '.cm-cursor': { display: 'none' },
      '.cm-activeLine': { backgroundColor: 'transparent' },
      '.cm-selection': { backgroundColor: 'transparent' },
    }),
    EditorView.decorations.of((view) => createTargetDecorations(view.state)),
    EditorState.readOnly.of(true),
    EditorView.editable.of(false),
  ];

  const editorTheme = EditorView.theme({
    '&': { fontSize: '1rem', fontFamily: 'JetBrains Mono, monospace' },
    '.cm-content': {
      padding: '12px 16px',
      backgroundColor: currentTheme.colors.bg.secondary,
      minHeight: '160px',
    },
    '.cm-focused': { outline: 'none' },
    '.cm-editor': {
      border: `1px solid ${currentTheme.colors.border.primary}`,
      backgroundColor: currentTheme.colors.bg.secondary,
    },
    '.cm-cursor': {
      borderLeftColor: currentTheme.colors.vim.normal,
      borderLeftWidth: '2px',
    },
    '.cm-activeLine': { backgroundColor: `${currentTheme.colors.vim.normal}1a` },
    '.cm-selection': { backgroundColor: `${currentTheme.colors.vim.normal}4d` },
  });

  const onEditorReady = useCallback((view: EditorView) => {
    const cm = getCM(view);
    if (cm) {
      const checkMode = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cmAny = cm as any;
        const mode = cmAny.mode?.name || 'normal';
        setVimMode(mode);
        const vimState = cmAny.state?.vim;
        if (vimState) setVimStatus(vimState.status || '');
      };
      const interval = setInterval(checkMode, 100);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      {/* Current code editor */}
      <div className="flex items-center px-3 py-1 bg-bg-tertiary border border-border-primary border-b-0 rounded-t-lg">
        <span className="text-text-tertiary text-xs font-mono uppercase tracking-wider">Current</span>
        <div className="ml-auto flex items-center gap-3 text-xs font-mono text-text-tertiary">
          <span className={`px-2 py-0.5 rounded ${
            vimMode === 'normal' ? 'bg-vim-normal text-white' :
            vimMode === 'insert' ? 'bg-vim-insert text-white' :
            vimMode === 'visual' ? 'bg-vim-visual text-white' :
            'bg-bg-tertiary text-text-secondary'
          }`}>{vimMode.toUpperCase()}</span>
          <span>{cursorPosition.line + 1}:{cursorPosition.ch + 1}</span>
          {vimStatus && <span className="text-text-secondary">{vimStatus}</span>}
        </div>
      </div>
      <div className="border border-border-primary rounded-b-lg overflow-hidden">
        <CodeMirror
          value={currentCode}
          extensions={[...extensions, editorTheme]}
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

      {/* Divider / action bar */}
      <div className="flex items-center gap-4 px-3 py-2 bg-bg-secondary border-x border-border-primary">
        <div className="h-px flex-1 bg-border-primary" />
        <button
          onClick={() => onMotionExecuted('hint')}
          className="text-vim-command hover:opacity-70 text-xs font-mono transition-opacity"
        >hint</button>
        <button
          onClick={() => onMotionExecuted('skip')}
          className="text-text-tertiary hover:text-text-secondary text-xs font-mono transition-colors"
        >skip</button>
        <button
          onClick={() => onMotionExecuted('new')}
          className="text-vim-insert hover:opacity-70 text-xs font-mono transition-opacity"
        >new</button>
        <div className="h-px flex-1 bg-border-primary" />
      </div>

      {/* Target code (read-only) */}
      <div className="flex items-center px-3 py-1 bg-bg-tertiary border border-border-primary border-b-0 rounded-t-lg">
        <span className="text-text-tertiary text-xs font-mono uppercase tracking-wider">Target</span>
      </div>
      <div className="border border-border-primary rounded-b-lg overflow-hidden">
        <CodeMirror
          value={targetCode}
          extensions={targetExtensions}
          basicSetup={{
            lineNumbers: true,
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
  );
}
