// src/components/ErrorDisplay.jsx
export default function ErrorDisplay({ errors }) {
    return (
      <div className="w-full bg-red-400 border p-4 h-[100%] rounded flex flex-col overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2 text-center">Errors</h2>
        {errors.length === 0 ? (
          <p className="text-green-600">No lexical errors</p>
        ) : (
          <ul className="text-sm text-black">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}
      </div>
    )
}

  