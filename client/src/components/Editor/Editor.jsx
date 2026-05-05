import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, setCode, theme = 'vs-dark' }) => {
  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
    <div className="animated-border">
      <div className="editor-container glass">
        <Editor
          height="100%"
          defaultLanguage="cpp"
          defaultValue={code}
          theme={theme}
          onChange={handleEditorChange}
          options={{
            fontSize: 16,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 20 },
            cursorBlinking: 'smooth',
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            autoIndent: 'full',
          }}
          onMount={(editor, monaco) => {
            // Define custom theme if needed
            monaco.editor.defineTheme('nex-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [],
              colors: {
                'editor.background': '#0d111700', // Transparent for glass effect
              }
            });
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
