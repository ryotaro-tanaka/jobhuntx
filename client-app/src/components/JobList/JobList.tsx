import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Job = {
  id: string;
  title: string;
  company: string;
  location: { type: string | null; city: string | null; country: string | null }[];
  language: string;
  description: string;
  name: string;
  postedDate: string;
  url: string;
};

function JobList({ onJobClick }: { onJobClick: () => void }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/jobs`);
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800">Job Listings</h2>
      <ul className="mt-4 space-y-4">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md cursor-pointer hover:bg-gray-100"
            onClick={onJobClick}
          >
            <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.company}</p>
            <p className="text-sm text-gray-500">
              {job.location.map((loc, index) => (
                <span key={index}>
                  {loc.type ? `${loc.type}` : ''}
                  {loc.city ? `, ${loc.city}` : ''}
                  {loc.country ? `, ${loc.country}` : ''}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobList;
