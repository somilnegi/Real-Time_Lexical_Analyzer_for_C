const TOKEN_STYLES = {
  keyword: "bg-blue-900 text-blue-200 border border-blue-700 hover:scale-107",
  identifier: "bg-purple-900 text-purple-200 border border-purple-700 hover:scale-107",
  operator: "bg-red-900 text-red-200 border border-red-700 hover:scale-107",
  literal: "bg-green-900 text-green-200 border border-green-700 hover:scale-107",
  number: "bg-orange-900 text-orange-200 border border-orange-700 hover:scale-107",
  string: "bg-pink-900 text-pink-200 border border-pink-700 hover:scale-107",
  delimiter: "bg-gray-700 text-gray-200 border border-gray-600 hover:scale-107",
  comment: "bg-gray-800 text-gray-400 italic border border-gray-700 hover:scale-107",
  unknown: "bg-yellow-900 text-yellow-200 border border-yellow-700 hover:scale-107",
  symbol: "bg-indigo-900 text-indigo-200 border border-indigo-700 hover:scale-107",
  preprocessor: "bg-purple-900 text-purple-200 border border-purple-700 hover:scale-107",
};

export default function TokenDisplay({ tokens }) {
  // Group tokens by line number
  const groupedTokens = tokens.reduce((acc, token) => {
    const lineNumber = token.line + 1;
    if (!acc[lineNumber]) {
      acc[lineNumber] = [];
    }
    
    // Special handling for #include
    const processedToken = {
      ...token,
      type: token.value.startsWith('#include') ? 'preprocessor' : token.type
    };
    
    acc[lineNumber].push(processedToken);
    return acc;
  }, {});

  const lineNumbers = Object.keys(groupedTokens).sort((a, b) => a - b);

  return (
    <div className="h-full flex flex-col border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
      {/* Header with dark theme */}
      <div className="bg-gray-800 text-purple-200 p-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            
          </svg>
          Tokens
        </h2>
      </div>
      
      {/* Scrollable content area with dark theme */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(70vh - 150px)' }}>
          {lineNumbers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tokens to display
            </div>
          ) : (
            <div className="space-y-4">
              {lineNumbers.map((lineNum) => (
                <div key={lineNum} className="flex flex-col">
                  {/* Line number indicator */}
                  <div className="flex items-baseline mb-2">
                    <span className="text-xs font-mono bg-gray-800 text-gray-300 px-2 py-1 rounded mr-2">
                      Line {lineNum}
                    </span>
                    <div className="border-t border-gray-700 flex-grow"></div>
                  </div>
                  
                  {/* Tokens row */}
                  <div className="flex flex-wrap gap-2 pl-6">
                    {groupedTokens[lineNum].map((token, idx) => (
                      <div
                        key={`${lineNum}-${idx}`}
                        className={`px-3 py-1 rounded-md text-sm font-mono flex items-center ${TOKEN_STYLES[token.type] || 'bg-gray-800 text-gray-200'}`}
                        title={`${token.type} at line ${lineNum}, column ${token.column + 1}`}
                      >
                        <span className="font-medium">{token.value}</span>
                        <span className="text-xs opacity-70 ml-1">- {token.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}