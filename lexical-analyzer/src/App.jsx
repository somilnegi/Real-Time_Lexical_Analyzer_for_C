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
    <div className="flex flex-col w-full h-screen p-4">
      <Navbar/>
      <FileUploader setCode={setCode} />
      <div className="flex w-full flex-1 gap-4 mt-4 h-[60%]">
        <div className="w-[70%]">
          <Editor code={code} setCode={setCode} setTokens={setTokens} setErrors={setErrors} />
        </div>

        <div className="w-[30%]">
          <TokenDisplay tokens={tokens} />
        </div>
      </div>
      <div className="w-[69%] mt-4 h-[40%]">
      <ErrorDisplay errors={errors} />
    </div>
      </div>
  )
}
