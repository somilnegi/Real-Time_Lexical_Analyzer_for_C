import Navbar from './components/Navbar'
import Editor from './components/Editor'
import TokenDisplay from './components/TokenDisplay'
import ErrorDisplay from './components/ErrorDisplay'
import FileUploader from './components/FileUploader'
import { useState } from "react"

export default function App() {
  const [code, setCode] = useState('')
  const [tokens, setTokens] = useState([])
  const [errors, setErrors] = useState([])

  return (
    <div className="flex flex-col w-full h-screen p-4 bg-slate-700">
      <Navbar/>
      <FileUploader setCode={setCode} />
      <div className="flex gap-4 mt-4 h-full">
        <div className="flex-1 overflow-auto h-full">
          <Editor code={code} setCode={setCode} setTokens={setTokens} setErrors={setErrors} />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className='flex-1'>
            <TokenDisplay tokens={tokens} />
          </div>
          <div className='flex-1'>
            <ErrorDisplay errors={errors} />
          </div>
        </div>
      </div>
    </div>
  )
}
