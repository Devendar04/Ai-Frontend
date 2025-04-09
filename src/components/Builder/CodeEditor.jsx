import React, { useRef } from 'react';
import Editor from "@monaco-editor/react";

export function CodeEditor({ content, language, onChange }) {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      value={content}
      theme="vs-dark"
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        automaticLayout: true,
        tabSize: 2,
        formatOnPaste: true,
        formatOnType: true,
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        folding: true,
        foldingStrategy: 'indentation',
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        autoIndent: 'full',
        cursorBlinking: 'blink',
        cursorSmoothCaretAnimation: true,
        smoothScrolling: true,
      }}
    />
  );
}