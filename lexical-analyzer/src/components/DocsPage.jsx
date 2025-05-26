// components/DocsPage.jsx
import { Link } from "react-router-dom";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Code Analyzer Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A comprehensive tool for analyzing C code with lexical and syntax
            error detection
          </p>
        </header>

        {/* Navigation */}
        <nav className="mb-12 bg-gray-800 rounded-lg p-4 sticky top-4 z-10 shadow-lg">
          <ul className="flex flex-wrap justify-between gap-4">
            <li>
              <a
                href="#overview"
                className="hover:text-amber-50 transition-all duration-300"
              >
                Overview
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-blue-400 transition">
                Features
              </a>
            </li>
            <li>
              <a href="#lexical" className="hover:text-blue-400 transition">
                Lexical Analysis
              </a>
            </li>
            <li>
              <a href="#syntax" className="hover:text-blue-400 transition">
                Syntax Analysis
              </a>
            </li>
            <li>
              <a href="#usage" className="hover:text-blue-400 transition">
                Usage Guide
              </a>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="space-y-16">
          {/* Overview Section */}
          <section
            id="overview"
            className="bg-gray-800/50 p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-6 text-blue-400">
              Project Overview
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                The Code Analyzer is a powerful tool designed to help developers
                identify and understand errors in their C code. It performs both
                lexical and syntax analysis, providing detailed feedback about
                potential issues in your codebase.
              </p>
              <p>
                This tool is particularly useful for learning C programming,
                debugging existing code, or understanding compiler error
                messages.
              </p>
              <div className="mt-6 p-4 bg-gray-700 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-bold text-lg mb-2">Key Benefits:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Real-time code analysis</li>
                  <li>Detailed error explanations</li>
                  <li>Visual token representation</li>
                  <li>Educational tool for understanding compiler processes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section
            id="features"
            className="bg-gray-800/50 p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600 hover:border-purple-500 transition">
                <h3 className="text-xl font-semibold mb-3 text-blue-300">
                  Lexical Analysis
                </h3>
                <p className="text-gray-300">
                  Breaks down source code into tokens and identifies lexical
                  errors like invalid characters, malformed numbers, or
                  incorrect identifiers.
                </p>
              </div>
              <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600 hover:border-purple-500 transition">
                <h3 className="text-xl font-semibold mb-3 text-blue-300">
                  Syntax Analysis
                </h3>
                <p className="text-gray-300">
                  Checks the grammatical structure of your code against C
                  language rules, identifying misplaced symbols, incorrect
                  statements, and structural errors.
                </p>
              </div>
              <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600 hover:border-purple-500 transition">
                <h3 className="text-xl font-semibold mb-3 text-blue-300">
                  Error Visualization
                </h3>
                <p className="text-gray-300">
                  Clearly displays errors with line numbers, column positions,
                  and detailed explanations to help you quickly identify and fix
                  issues.
                </p>
              </div>
              <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600 hover:border-purple-500 transition">
                <h3 className="text-xl font-semibold mb-3 text-blue-300">
                  Token Display
                </h3>
                <p className="text-gray-300">
                  Shows the tokenized version of your code, color-coded by token
                  type (keywords, identifiers, operators, etc.) for better
                  understanding.
                </p>
              </div>
            </div>
          </section>

          {/* Lexical Analysis Section */}
          <section
            id="lexical"
            className="bg-gray-800/50 p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-6 text-green-400">
              Lexical Analysis
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-700/50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-green-300">
                  What is Lexical Analysis?
                </h3>
                <p className="text-gray-300">
                  Lexical analysis is the first phase of compilation where the
                  source code is broken down into meaningful tokens. It checks
                  for basic language compliance at the character level.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-700/50 p-6 rounded-lg">
                  <h4 className="font-bold mb-2 text-yellow-300">
                    Common Lexical Errors
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li>Invalid characters (e.g., @, $ in identifiers)</li>
                    <li>Malformed numbers (e.g., 123abc)</li>
                    <li>Unclosed string literals</li>
                    <li>Overlong identifiers</li>
                    <li>Invalid escape sequences</li>
                  </ul>
                </div>
                <div className="bg-gray-700/50 p-6 rounded-lg">
                  <h4 className="font-bold mb-2 text-yellow-300">
                    Example Errors
                  </h4>
                  <div className="font-mono bg-gray-800 p-4 rounded overflow-x-auto">
                    <p className="text-red-400">
                      Error: Invalid character '@' at line 5, column 12
                    </p>
                    <p className="text-yellow-400">
                      Warning: Number constant too long at line 8, column 3
                    </p>
                    <p className="text-red-400">
                      Error: Unclosed string literal at line 10, column 5
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Syntax Analysis Section */}
          <section
            id="syntax"
            className="bg-gray-800/50 p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-6 text-red-400">
              Syntax Analysis
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-700/50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-red-300">
                  What is Syntax Analysis?
                </h3>
                <p className="text-gray-300">
                  Syntax analysis (or parsing) checks whether the sequence of
                  tokens forms valid statements according to the grammar rules
                  of the C language.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-700/50 p-6 rounded-lg">
                  <h4 className="font-bold mb-2 text-orange-300">
                    Common Syntax Errors
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li>Missing semicolons</li>
                    <li>Mismatched parentheses/brackets</li>
                    <li>Incorrect function declarations</li>
                    <li>Invalid expressions</li>
                    <li>Control structure errors</li>
                  </ul>
                </div>
                <div className="bg-gray-700/50 p-6 rounded-lg">
                  <h4 className="font-bold mb-2 text-orange-300">
                    Example Errors
                  </h4>
                  <div className="font-mono bg-gray-800 p-4 rounded overflow-x-auto">
                    <p className="text-red-400">
                      Error: Expected ';' at line 5, column 15
                    </p>
                    <p className="text-red-400">
                      Error: Mismatched parentheses at line 8, column 20
                    </p>
                    <p className="text-red-400">
                      Error: Invalid function declaration at line 12, column 1
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-lg">
                <h4 className="font-bold mb-2 text-orange-300">
                  Syntax vs Lexical Errors
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-gray-300 border-collapse">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="p-3 text-left">Lexical Errors</th>
                        <th className="p-3 text-left">Syntax Errors</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-700">
                        <td className="p-3">Occur at character/token level</td>
                        <td className="p-3">
                          Occur at statement/expression level
                        </td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-3">Detected during tokenization</td>
                        <td className="p-3">Detected during parsing</td>
                      </tr>
                      <tr>
                        <td className="p-3">Example: Invalid character</td>
                        <td className="p-3">Example: Missing semicolon</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Usage Guide Section */}
          <section
            id="usage"
            className="bg-gray-800/50 p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-6 text-blue-400">
              Usage Guide
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-700/50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-blue-300">
                  How to Use the Analyzer
                </h3>
                <ol className="list-decimal pl-5 space-y-4 text-gray-300">
                  <li>
                    <strong>Enter your C code</strong> in the editor panel on
                    the left
                  </li>
                  <li>
                    <strong>View tokens</strong> in the top-right panel showing
                    the tokenized output
                  </li>
                  <li>
                    <strong>Check for errors</strong> in the bottom-right panel
                    which shows both lexical and syntax errors
                  </li>
                  <li>
                    <strong>Hover over tokens</strong> to see detailed
                    information about each token
                  </li>
                  <li>
                    <strong>Click on errors</strong> to jump to the problematic
                    line in the editor
                  </li>
                </ol>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-lg">
                <h4 className="font-bold mb-2 text-blue-300">
                  Tips for Effective Use
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>
                    Start with small code snippets to understand error messages
                  </li>
                  <li>
                    Fix lexical errors first as they often cause syntax errors
                  </li>
                  <li>
                    Use the token display to understand how your code is being
                    interpreted
                  </li>
                  <li>
                    Pay attention to line and column numbers in error messages
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-16 text-center text-gray-400 border-t border-gray-700 pt-8">
            <p>Code Analyzer Project - Educational Tool for C Programming</p>
            <p className="mt-2">
              Created with React, Monaco Editor, and Tailwind CSS
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
