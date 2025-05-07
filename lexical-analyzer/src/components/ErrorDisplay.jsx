// src/components/ErrorDisplay.jsx
export default function ErrorDisplay({ errors }) {
    return (
      <div className="w-full bg-red-400 border h-[100%] rounded-2xl flex flex-col overflow-y-auto">
        <div className="rounded-t-2xl top-0 px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
          <h2 className="text-lg font-semibold">Errors</h2>
        </div>
        {errors.length === 0 ? (
          <p className="text-green-800">No lexical errors</p>
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

  