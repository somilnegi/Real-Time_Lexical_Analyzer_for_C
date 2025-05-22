import {Link} from 'react-router-dom'
export default function Navbar() {
    return (
      <nav className="w-full bg-gray-800 text-white py-3 px-6 shadow-md flex justify-between items-center">
        <div className="text-3xl font-bold ">Real-Time Lexical Analyzer</div>
        <div className="flex items-center gap-5 text-center text-xl">
          <Link to="/" className="!text-white hover:!text-blue-500 transition-all duration-300 ease-in-out">
            Home
          </Link>
          <span aria-hidden="true">|</span>
          <Link to="/docs" className="!text-white hover:!text-blue-500 transition-all duration-300 ease-in-out">
            Docs
          </Link>
        </div>
      </nav>
    )
  }