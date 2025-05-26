// components/ErrorDisplay.jsx
export default function ErrorDisplay({ errors = [] }) {
  const errorTypes = {
    lexical: { 
      color: "text-yellow-300", 
      icon: "✗", 
      name: "Lexical Error",
      bg: "bg-yellow-900/20"
    },
    syntax: { 
      color: "text-red-400", 
      icon: "!", 
      name: "Syntax Error",
      bg: "bg-red-900/20" 
    },
    empty: { 
      color: "text-gray-400", 
      icon: "ⓘ", 
      name: "Info",
      bg: "bg-gray-800/20"
    }
  };

  return (
    <div className="h-full flex flex-col border border-gray-700 rounded-lg bg-gray-900 overflow-hidden">
      <div className="bg-gray-800 text-red-400 p-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span>⚠️</span>
          Errors {errors.length > 0 && `(${errors.length})`}
        </h2>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {errors.length === 0 ? (
          <div className="h-full flex items-center justify-center text-green-400">
            No errors detected
          </div>
        ) : (
          <ul className="space-y-2">
            {errors.map((err, idx) => {
              const typeInfo = errorTypes[err.type] || errorTypes.syntax;
              return (
                <li 
                  key={`${err.line}-${err.column}-${idx}`} 
                  className={`p-3 rounded-lg border ${typeInfo.bg} border-gray-700`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-lg ${typeInfo.color}`}>
                      {typeInfo.icon}
                    </span>
                    <div className="flex-1">
                      <div className={`text-sm font-mono ${typeInfo.color}`}>
                        {typeInfo.name} [L{err.line}:C{err.column}]
                      </div>
                      <div className="text-gray-200 mt-1 text-sm">
                        {err.message}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
