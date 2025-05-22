export default function ErrorDisplay({ errors }) {
  const errorTypes = {
    lexical: { color: "text-yellow-300", icon: "✗", name: "Lexical Error" },
    syntax: { color: "text-red-400", icon: "!", name: "Syntax Error" },
    empty: { color: "text-gray-400", icon: "ⓘ", name: "Info" }
  };

  return (
    <div className="h-full flex flex-col border border-gray-700 rounded-lg bg-gray-900 overflow-hidden">
      <div className="bg-gray-800 text-red-400 p-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span>⚠️</span>
          Errors {errors.length > 0 && `(${errors.length})`}
        </h2>
      </div>

      <div className="flex-1 overflow-auto p-4" style={{ maxHeight: 'calc(70vh - 150px)' }}>
        {errors.length === 0 ? (
          <div className="text-center text-green-400 py-8">
            No errors detected
          </div>
        ) : (
          <ul className="space-y-3">
            {errors.map((err, idx) => {
              const typeInfo = errorTypes[err.type] || errorTypes.lexical;
              return (
                <li key={idx} className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-start gap-3">
                    <span className={`text-lg ${typeInfo.color}`}>{typeInfo.icon}</span>
                    <div>
                      <p className={`text-sm font-mono ${typeInfo.color}`}>
                        {typeInfo.name} [L{err.line}:C{err.column}]
                      </p>
                      <p className="text-gray-200 mt-1">
                        {err.message}
                      </p>
                      {err.type === 'lexical' && (
                        <p className="text-xs text-gray-500 mt-1">
                          Tip: Check for typos or invalid characters
                        </p>
                      )}
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