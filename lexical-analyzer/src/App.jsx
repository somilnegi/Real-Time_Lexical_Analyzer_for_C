import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Editor from './components/Editor';
import TokenDisplay from './components/TokenDisplay';
import ErrorDisplay from './components/ErrorDisplay';
import FileUploader from './components/FileUploader';
import DocsPage from './components/DocsPage';
import { analyzeCode } from './utils/lexer';
import { parse } from './utils/syntax';

function HomePage() {
  const [code, setCode] = useState('int main() {\n  return 0;\n}');
  const [tokens, setTokens] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    try {
      // Run lexical analysis
      const lexResult = analyzeCode(code);
      setTokens(lexResult.tokens);

      // Prepare errors array
      let allErrors = [...lexResult.lexicalErrors.map(err => ({
        ...err,
        type: "lexical"
      }))];

      // Only run syntax analysis if no lexical errors
      if (lexResult.lexicalErrors.length === 0) {
        const parseResult = parse(lexResult.tokens);
        allErrors = [
          ...allErrors,
          ...parseResult.errors.map(err => ({
            message: typeof err === 'string' ? err : err.message,
            line: err.line || 0,
            column: err.column || 0,
            type: "syntax"
          }))
        ];
      }

      setErrors(allErrors);
    } catch (error) {
      console.error("Analysis error:", error);
      setErrors([{
        message: "Analysis failed: " + error.message,
        type: "syntax",
        line: 0,
        column: 0
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  return (
    <div className="flex flex-col w-full h-[90%] p-4 bg-slate-700">
      <FileUploader setCode={setCode} />
      <div className="flex mt-2 gap-4 h-full overflow-y-auto">
        <div className="flex-1 overflow-auto h-full rounded-xl">
          <Editor code={code} setCode={setCode} />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="h-[60%] overflow-y-auto">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-white">
                Analyzing code...
              </div>
            ) : (
              <TokenDisplay tokens={tokens} />
            )}
          </div>
          <div className='h-[40%] overflow-y-auto'>
            <ErrorDisplay errors={errors} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col w-full h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
