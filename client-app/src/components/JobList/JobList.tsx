import { useEffect, useState } from 'react';
import { Job, Candidate } from '../../api/generated';
import { createApiClient, LocationType } from '../../api/clientFactory';

function JobList({ onJobClick, searchKey, headerIsLarge, isJobList }: { onJobClick: (job: Job) => void; searchKey: string | null, headerIsLarge: boolean, isJobList: boolean }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // talent pool
  useEffect(() => {
    const fetchCandidates = async () => {
      // setLoading(true);
      try {
        const client = createApiClient();
        const data = await client.candidates();
        setCandidates(data ?? []);
      } catch (error) {
        console.error('Failed to fetch candidates:', error);
      } finally {
        // setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // jobs pool
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const client = createApiClient();
        const data = await client.jobs(searchKey ?? undefined);
        setJobs(data.jobs ?? []);
        
        // If 0 results, fetch all jobs for suggestions
        if ((searchKey && data.totalCount === 0)) {
          const allJobsData = await client.jobs(undefined);
          setSuggestedJobs(allJobsData.jobs ?? []);
        } else {
          setSuggestedJobs([]);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchKey]);

  return (
    <div
      role="main"
      className={`transition-all duration-300 ${headerIsLarge ? 'pt-48' : 'pt-20'} p-4`}
    >
      <ul
        className="mt-4 space-y-4"
        role="list"
        aria-label={isJobList ? "Job Listings" : "Talent Listings"}
      >
        {loading ? (
          <LoadingSkeletonList />
        ) : isJobList ? (
          jobs.length === 0 ? (
            <>
              <EmptyJobList />
              {suggestedJobs.map((job) => (
                <JobListItem key={job.id} job={job} onClick={onJobClick} />
              ))}
            </>
          ) : (
            jobs.map((job) => (
              <JobListItem key={job.id} job={job} onClick={onJobClick} />
            ))
          )
        ) : (
          candidates.length === 0 ? (
            <li>
              <p className="mt-4 text-gray-600">No talent found.</p>
            </li>
          ) : (
            candidates.map((candidate) => (
              <CandidateListItem key={candidate.id} candidate={candidate} />
            ))
          )
        )}
      </ul>
    </div>
  );
}

export default JobList;

function LoadingSkeletonList() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={`loading-${i}`}
          role="listitem"
          className="p-4 border border-gray-200 rounded-md shadow-sm bg-gray-100 animate-pulse"
        >
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </li>
      ))}
    </>
  );
}

function JobListItem({ job, onClick }: { job: Job; onClick: (job: Job) => void }) {
  return (
    <li
      className="p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md cursor-pointer hover:bg-gray-100"
      onClick={() => onClick(job)}
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
  );
}

function EmptyJobList() {
  return (
    <li>
      <p className="mt-4 text-gray-600">No jobs found. Please try a different search.</p>
    </li>
  );
}

function CandidateListItem({ candidate }: { candidate: Candidate }) {
  const handleClick = () => {
    if (candidate.profileUrl) {
      window.open(candidate.profileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // スタイルをisSpecialで分岐
  const baseClass =
    "p-4 rounded-md shadow-sm cursor-pointer transition hover:shadow-md";
  const specialClass =
    "border-2 border-yellow-400 bg-yellow-50 hover:bg-yellow-100";
  const normalClass =
    "border border-gray-200 bg-white hover:bg-gray-100";

  return (
    <li
      className={
        baseClass +
        " " +
        (candidate.isSpecial ? specialClass : normalClass)
      }
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={`Open profile for ${candidate.name}`}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
    >
      <h3 className={`text-lg font-medium ${candidate.isSpecial ? "text-yellow-700 animate-pulse" : "text-gray-900"}`}>
        {candidate.name}
        {candidate.isSpecial && (
          <span className="ml-2 inline-block align-middle" title="Special Talent">✨</span>
        )}
      </h3>
      {candidate.skills && candidate.skills.length > 0 && (
        <p className="text-sm text-gray-600">Skills: {candidate.skills.join(', ')}</p>
      )}
      {candidate.summary && (
        <p className="text-sm text-gray-500">{candidate.summary}</p>
      )}
      {candidate.location && (
        <p className="text-sm text-gray-500">
          <span>
            {candidate.location.type !== undefined ? `${LocationType[candidate.location.type]}` : ''}
            {candidate.location.city ? `, ${candidate.location.city}` : ''}
            {candidate.location.country ? `, ${candidate.location.country}` : ''}
          </span>
        </p>
      )}
    </li>
  );
}
