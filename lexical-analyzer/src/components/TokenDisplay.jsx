const TOKEN_STYLES = {
  keyword: "text-blue-600",
  identifier: "text-purple-600",
  operator: "text-red-600",
  literal: "text-green-600",
  number: "text-orange-600",
  string: "text-pink-600",
  delimiter: "text-gray-600",
  comment: "text-gray-400 italic",
  unknown: "text-black bg-yellow-200",
};

const TOKEN_TOOLTIPS = {
  keyword: "Reserved word in C (e.g., int, return)",
  identifier: "User-defined name (variable, function, etc.)",
  operator: "Symbol performing operations (e.g., +, -)",
  literal: "Constant value (e.g., true, false)",
  number: "Numeric literal (e.g., 42)",
  string: "String literal (e.g., \"Hello\")",
  delimiter: "Syntax separator (e.g., ;, ,)",
  comment: "Ignored annotation for humans",
  unknown: "Unrecognized or invalid token",
};

export default function TokenDisplay({ tokens }) {
  const tokensByLine = tokens.reduce((acc, token) => {
    acc[token.line] = acc[token.line] || [];
    acc[token.line].push(token);
    return acc;
  }, {});

  return (
    <div className="h-full bg-amber-200 flex flex-col rounded-2xl">
      <div className="rounded-t-2xl top-0 px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
        <h2 className="text-lg font-semibold">Tokens</h2>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {tokens.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No tokens to display
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(tokensByLine).map(([line, lineTokens]) => (
              <div key={line} className="token-line relative animate-fadeIn">
                <div className="pl-12 flex flex-wrap gap-2">
                  {lineTokens.map((token, index) => {
                    const colorClass = TOKEN_STYLES[token.type] || "text-black";
                    const tooltip = TOKEN_TOOLTIPS[token.type] || "Token";

                    return (
                      <span
                        key={`${token.line}-${token.column}-${index}`}
                        className={`inline-flex items-center px-2 py-1 rounded text-sm font-mono transition-all hover:shadow-md hover:scale-105 cursor-pointer ${colorClass}`}
                        title={tooltip}
                      >
                        <span className="text-xs mr-1.5 opacity-60">
                          {token.type}
                        </span>
                        {token.value.length > 30
                          ? `${token.value.substring(0, 30)}...`
                          : token.value}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}