export default function TokenDisplay({ tokens }) {
    return (
      <div className="w-full bg-green-50 border h-[100%] rounded flex flex-col items-center overflow-y-auto">
        <h2 className="text-lg font-semibold">Tokens</h2>
        <ul className="text-sm text-black">
          {tokens.map((token, idx) => (
            <li key={idx}>
              <strong>{token.type}</strong>: {token.value}
            </li>
          ))}
        </ul>
      </div>
    )
  }
  