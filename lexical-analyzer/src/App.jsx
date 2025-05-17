import Navbar from './components/Navbar'
import Editor from './components/Editor'
import TokenDisplay from './components/TokenDisplay'
import ErrorDisplay from './components/ErrorDisplay'
import FileUploader from './components/FileUploader'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from "react"

export default function App() {
  const [code, setCode] = useState('')
  const [tokens, setTokens] = useState([])
  const [errors, setErrors] = useState([])

  return (
    <div className="flex flex-col w-full h-screen p-4 bg-slate-700">
      <Navbar/>
      <FileUploader setCode={setCode} />
      <div className="flex gap-4 mt- h-full overflow-y-auto">
        <div className="flex-1 overflow-auto h-full">
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
  )
}
