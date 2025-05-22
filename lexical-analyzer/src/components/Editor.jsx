import Editor from '@monaco-editor/react';
import { useEffect } from 'react';
import { analyzeCode } from '../utils/lexer';

export default function CodeEditor({ code, setCode, setTokens, setErrors }) {
  const handleChange = (value) => {
    setCode(value); // Update code state immediately
  };

  // Secondary analysis to catch any missed updates
  useEffect(() => {
    const { tokens, errors } = analyzeCode(code);
    setTokens(tokens);
    setErrors(errors);
  }, [code, setTokens, setErrors]);

  return (
    <div className="w-full h-full rounded-2xl p-4 bg-amber-100">
      <Editor
        language="c"
        theme="vs-dark"
        value={code}
        onChange={handleChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
        }}
      />
    </div>
  );
}