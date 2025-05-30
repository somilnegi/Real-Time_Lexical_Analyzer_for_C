// src/components/FileUploader.jsx
export default function FileUploader({ setCode }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      setCode(event.target.result)
    }
    if (file) reader.readAsText(file)
  }

  return (
    <div className="border-2 border-blue-500 w-50">
      <input className="text-white" type="file" accept=".c,.txt" onChange={handleFileChange} />
    </div>
  )
}
