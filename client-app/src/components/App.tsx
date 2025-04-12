import Avatar from 'components/Avatar'
import logo from 'assets/logo.svg'

const randoms = [
  [1, 2],
  [3, 4, 5],
  [6, 7]
]

const jobs = [
  { id: 1, title: 'Frontend Developer', company: 'TechCorp', location: 'Tokyo, Japan' },
  { id: 2, title: 'Backend Engineer', company: 'CodeWorks', location: 'Osaka, Japan' },
  { id: 3, title: 'Data Scientist', company: 'AI Innovations', location: 'Kyoto, Japan' },
  { id: 4, title: 'Product Manager', company: 'Startup Inc.', location: 'Remote' },
  { id: 5, title: 'DevOps Engineer', company: 'Cloud Solutions', location: 'Fukuoka, Japan' },
  { id: 6, title: 'UI/UX Designer', company: 'Design Studio', location: 'Nagoya, Japan' },
  { id: 7, title: 'Mobile App Developer', company: 'Appify', location: 'Sapporo, Japan' },
  { id: 8, title: 'Cybersecurity Specialist', company: 'SecureTech', location: 'Tokyo, Japan' },
  { id: 9, title: 'AI Researcher', company: 'DeepMind Labs', location: 'Remote' },
]

function App() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-white border-b border-gray-300 shadow-md">
        <img src={logo} alt="JobHuntX Logo" className="h-10" />
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
      <div className="pt-20 p-4">
        <h2 className="text-xl font-semibold text-gray-800">Job Listings</h2>
        <ul className="mt-4 space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md"
            >
              <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
