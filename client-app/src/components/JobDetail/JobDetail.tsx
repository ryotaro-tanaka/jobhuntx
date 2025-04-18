import { Job } from '../../api/generated';

function JobDetail({ job }: { job: Job }) {
  if (!job) {
    return <p>No job selected.</p>;
  }

  console.log('Job Details:', JSON.stringify(job, null, 2)); // Log the Job object as JSON

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{job.title}</h2>
      <p className="mt-2 text-gray-600">{job.company}</p>
      <p className="mt-2 text-sm text-gray-500">
        {job.location && (
          <span>
            {job.location.type ? `${job.location.type}` : ''}
            {job.location.city ? `, ${job.location.city}` : ''}
            {job.location.country ? `, ${job.location.country}` : ''}
          </span>
        )}
      </p>
      <p className="mt-4">{job.description}</p>
      <p className="mt-4 text-sm text-gray-500">
        Posted by: {job.posterName || 'Unknown'}
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Posted on: {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}
      </p>
      {job.url && (
        <div className="mt-6">
          <button
            className="flex items-center justify-center px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none"
            onClick={() => window.open(job.url, '_blank')}
          >
            Open Original Job Posting
          </button>
        </div>
      )}
    </div>
  );
}

export default JobDetail;
