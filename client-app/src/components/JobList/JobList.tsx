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

function JobList() {
  return (
    <div>
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
  )
}

export default JobList
