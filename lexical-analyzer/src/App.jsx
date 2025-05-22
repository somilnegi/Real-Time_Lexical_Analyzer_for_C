import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Editor from './components/Editor';
import TokenDisplay from './components/TokenDisplay';
import ErrorDisplay from './components/ErrorDisplay';
import FileUploader from './components/FileUploader';
import { analyzeCode } from './utils/lexer';

function HomePage() {
  const [code, setCode] = useState('');
  const [tokens, setTokens] = useState([]);
  const [errors, setErrors] = useState([]);

  // Initialize analysis when code changes
  useEffect(() => {
    const { tokens, errors } = analyzeCode(code);
    setTokens(tokens);
    setErrors(errors);
  }, [code]);

  return (
    <div className="flex flex-col w-full h-[90%] p-4 bg-slate-700">
      <FileUploader setCode={setCode} />
      <div className="flex mt-2 gap-4 h-full overflow-y-auto">
        <div className="flex-1 overflow-auto h-full rounded-xl">
          <Editor code={code} setCode={setCode} setTokens={setTokens} setErrors={setErrors} />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="h-[60%] overflow-y-auto">
            <TokenDisplay tokens={tokens} />
          </div>
          <div className='h-[40%] overflow-y-auto'>
            <ErrorDisplay errors={errors} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DocsPage() {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-slate-700 text-white text-3xl">
      Documentation Page (You can customize me!)
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
        </Routes>
      </div>
    </Router>
  );
}