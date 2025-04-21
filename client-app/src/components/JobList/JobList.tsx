import { useEffect, useState } from 'react';
import { Client, Job } from '../../api/generated';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function JobList({ onJobClick }: { onJobClick: (job: Job) => void }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const client = new Client(API_BASE_URL); // Initialize the NSwag client
        const data = await client.jobs(); // Fetch jobs using the generated client
        console.log('Fetched jobs:', data); // Debug fetched jobs
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
        {(jobs || []).map((job) => { // Ensure jobs is not null or undefined
          console.log('Rendering job:', job); // Debug each job object
          return (
            <li
              key={job.id}
              className="p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md cursor-pointer hover:bg-gray-100"
              onClick={() => onJobClick(job)} // Pass the selected job
            >
              <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-500">
                {job.location && (
                  <span>
                    {job.location.type ? `${job.location.type}` : ''}
                    {job.location.city ? `, ${job.location.city}` : ''}
                    {job.location.country ? `, ${job.location.country}` : ''}
                  </span>
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default JobList;
