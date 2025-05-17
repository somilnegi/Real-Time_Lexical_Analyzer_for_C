import { useState } from "react";

const TOKEN_STYLES = {
  keyword: "text-blue-800 bg-[rgba(59,130,246,0.3)]",
  identifier: "text-purple-800 bg-[rgba(147,51,234,0.3)]",
  operator: "text-red-800 bg-[rgba(255,0,0,0.3)]",
  number: "text-orange-800 bg-[rgba(255,128,0,0.3)]",
  string_literal: "text-green-800 bg-[rgba(21,255,0,0.3)]",
  symbol: "text-gray-600 bg-[rgba(103,103,103,0.3)]",
  unknown: "text-black",
};

const TOKEN_TOOLTIPS = {
  keyword: "Reserved word in C (e.g., int, return)",
  identifier: "User-defined name (variable, function, etc.)",
  operator: "Symbol performing operations (e.g., +, -)",
  number: "Numeric literal (e.g., 42)",
  string_literal: "String literal (e.g., \"Hello\")",
  symbol: "Syntax symbol (e.g., ;, {, })",
  unknown: "Unrecognized or invalid token",
};

export default function TokenDisplay({ tokens }) {
  const [filter, setFilter] = useState("all");

  const tokensByLine = tokens.reduce((acc, token) => {
    acc[token.line] = acc[token.line] || [];
    acc[token.line].push(token);
    return acc;
  }, {});

  // Filter handler
  const filteredTokensByLine = Object.fromEntries(
    Object.entries(tokensByLine).map(([line, lineTokens]) => [
      line,
      filter === "all"
        ? lineTokens
        : lineTokens.filter((token) => token.type === filter),
    ])
  );

  const tokenTypes = Object.keys(TOKEN_STYLES);

  return (
    <div className="h-full bg-amber-200 flex flex-col rounded-2xl">
      <div className="rounded-t-xl top-0 px-4 py-2 bg-white dark:bg-gray-800 z-10 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tokens</h2>
        <select
          className="border-2 rounded-xl px-3 py-1 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option className="bg-gray-800" value="all">All</option>
          {tokenTypes.map((type) => (
            <option className="bg-gray-800" key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {tokens.length === 0 ? (
          <div className="h-full flex justify-center items-center text-black dark:text-black">
            No tokens to display
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(filteredTokensByLine).map(([line, lineTokens]) => (
              <div key={line} className="token-line relative animate-fadeIn">
                <div className="pl-12 flex flex-wrap gap-2">
                  {lineTokens.length === 0 ? (
                    <span className="text-black">
                      {/* No tokens of selected type */}
                    </span>
                  ) : (
                    lineTokens.map((token, index) => {
                      const colorClass =
                        TOKEN_STYLES[token.type] || "text-black";
                      const tooltip =
                        TOKEN_TOOLTIPS[token.type] || "Token";

                      return (
                        <span
                          key={`${token.line}-${token.column}-${index}`}
                          className={`inline-flex items-center px-2 py-1 rounded text-sm font-mono transition-all hover:shadow-md hover:scale-105 cursor-pointer ${colorClass}`}
                          title={tooltip}
                        >
                          <span className="text-xs mr-1.5 opacity-60">
                            {/* Line- {token.line} */}
                            {token.type}
                          </span>
                          {token.value.length > 30
                            ? `${token.value.substring(0, 30)}...`
                            : token.value}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
