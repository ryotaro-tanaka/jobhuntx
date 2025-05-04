import { useEffect, useState } from 'react';
import { Client, Job } from '../../api/generated';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function JobList({ onJobClick, searchKey }: { onJobClick: (job: Job) => void; searchKey: string | null }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // await new Promise(res => setTimeout(res, 10000)); // ここで10秒待つ
        const client = new Client(API_BASE_URL); // Initialize the NSwag client
        const data = await client.jobs(searchKey ?? undefined);
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchKey]);

  return (
    <div role="main" className="pt-28 p-4">
      <ul
        className="mt-4 space-y-4"
        role="list"
        aria-label="Job Listings"
      >
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <li
                key={`loading-${i}`}
                className="p-4 border border-gray-200 rounded-md shadow-sm bg-gray-100 animate-pulse"
              >
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </li>
            ))
          : jobs.length === 0 ? (
              <li>
                <p className="mt-4 text-gray-600">No jobs found. Please try a different search.</p>
              </li>
            ) : (
              jobs.map((job) => (
                <li
                  key={job.id}
                  className="p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md cursor-pointer hover:bg-gray-100"
                  onClick={() => onJobClick(job)}
                >
                  <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  {job.location && (
                    <p className="text-sm text-gray-500">
                      <span>
                        {job.location.type ? `${job.location.type}` : ''}
                        {job.location.city ? `, ${job.location.city}` : ''}
                        {job.location.country ? `, ${job.location.country}` : ''}
                      </span>
                    </p>
                  )}
                  {job.salary && job.salary.min != null && job.salary.max != null && (
                    <p className="text-sm text-gray-500">
                      {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currencyCode}
                    </p>
                  )}
                </li>
              ))
            )
        }
      </ul>
    </div>
  );
}

export default JobList;
