import logo from 'assets/logo.svg'
import logoWide from 'assets/logo-wide.svg'

function FixedHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-white border-b border-gray-300 shadow-md">
      <img src={logoWide} alt="JobHuntX Logo" className="h-10" />
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search for jobs..."
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Search
        </button>
      </div>
    </div>
  )
}

export default FixedHeader
