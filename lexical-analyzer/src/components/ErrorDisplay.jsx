// src/components/ErrorDisplay.jsx
export default function ErrorDisplay({ errors }) {
    return (
      <div className="bg-red-400 h-full rounded-2xl flex flex-col">
        <div className="rounded-t-xl top-0 px-4 py-2 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-lg font-semibold">Errors</h2>
        </div>
        <div className="overflow-auto p-2">
        {errors.length === 0 ? (
          <p className=" h-full flex justify-center items-center text-black">No lexical errors</p>
        ) : (
          <ul className="text-sm px-2 font-semibold text-black">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}
        </div>
      </div>
    )
}

  