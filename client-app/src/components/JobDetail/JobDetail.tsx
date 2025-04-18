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
        {job.location?.map((loc, index) => (
          <span key={index}>
            {loc.type ? `${loc.type}` : ''}
            {loc.city ? `, ${loc.city}` : ''}
            {loc.country ? `, ${loc.country}` : ''}
          </span>
        ))}
      </p>
      <p className="mt-4">{job.description}</p>
      <p className="mt-4 text-sm text-gray-500">
        Posted on: {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}
      </p>
    </div>
  );
}

export default JobDetail;
