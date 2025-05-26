import Editor from "@monaco-editor/react";
import { useEffect } from "react";

export default function CodeEditor({ code, setCode }) {
  // Handle editor mounting
  useEffect(() => {
    console.log("Editor mounted");
    return () => console.log("Editor unmounted");
  }, []);

  const renderClasses = () => {
    if (dark) {
      return;
    } else {
      return;
    }
  };

  return (
    <div
      className={"w-full dark: h-full rounded-2xl bg-gray-900 overflow-hidden"}
    >
      <Editor
        height="100%"
        language="c"
        theme="vs-dark"
        value={code}
        onChange={setCode}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
        onMount={(editor) => {
          console.log("Editor mounted successfully");
          editor.focus();
        }}
      />
    </div>
  );
}
