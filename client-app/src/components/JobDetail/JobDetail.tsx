import { Job } from '../../api/generated';
import DOMPurify from 'dompurify';

function JobDetail({ job }: { job: Job }) {
  if (!job) {
    return <p>No job selected.</p>;
  }

  const isHtml = (text: string) => /<\/?[a-z][\s\S]*>/i.test(text);

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold">{job.title}</h2>
      <p className="mt-2 text-gray-600">{job.company}</p>
      {job.location && (
        <p className="mt-2 text-sm text-gray-500">
          <span>
            {job.location.type ? `${job.location.type}` : ''}
            {job.location.city ? `, ${job.location.city}` : ''}
            {job.location.country ? `, ${job.location.country}` : ''}
          </span>
        </p>
      )}
      {job.salary && (
        <p className="mt-2 text-sm text-gray-500">
          {job.salary.min != null && job.salary.max != null
            ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${job.salary.currencyCode}`
            : job.salary.min != null
            ? `${job.salary.min.toLocaleString()} ${job.salary.currencyCode} or more`
            : job.salary.max != null
            ? `${job.salary.max.toLocaleString()} ${job.salary.currencyCode} or less`
            : null}
        </p>
      )}
      <div className="mt-4 text-gray-800">
        {job.description && isHtml(job.description) ? (
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.description) }} />
        ) : (
          <p>{job.description}</p>
        )}
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Posted by: {job.posterName || job.company || 'unknown'}
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
