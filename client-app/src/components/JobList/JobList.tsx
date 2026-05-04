import { Job, Candidate } from '../../api/generated'
import { LocationType } from '../../api/clientFactory'

interface JobListProps {
  jobs: Job[]
  suggestedJobs: Job[]
  candidates: Candidate[]
  jobsLoading: boolean
  talentLoading: boolean
  isJobList: boolean
  headerIsLarge: boolean
  onJobClick: (job: Job) => void
}

function JobList({
  jobs,
  suggestedJobs,
  candidates,
  jobsLoading,
  talentLoading,
  isJobList,
  headerIsLarge,
  onJobClick
}: JobListProps) {
  return (
    <div
      role="main"
      className={`transition-all duration-300 ${
        headerIsLarge ? 'pt-48' : 'pt-20'
      } p-4`}
    >
      <ul
        className="mt-4 space-y-4"
        role="list"
        aria-label={isJobList ? 'Job Listings' : 'Talent Listings'}
      >
        {isJobList ? (
          jobsLoading ? (
            <LoadingSkeletonList />
          ) : jobs.length === 0 ? (
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
        ) : talentLoading ? (
          <LoadingSkeletonList />
        ) : candidates.length === 0 ? (
          <li>
            <p className="mt-4 text-gray-600">No talent found.</p>
          </li>
        ) : (
          candidates.map((candidate) => (
            <CandidateListItem key={candidate.id} candidate={candidate} />
          ))
        )}
      </ul>
    </div>
  )
}

export default JobList

function LoadingSkeletonList() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={`loading-${i}`}
          role="listitem"
          className="animate-pulse rounded-md border border-gray-200 bg-gray-100 p-4 shadow-sm"
        >
          <div className="mb-2 h-6 w-1/3 rounded bg-gray-300"></div>
          <div className="mb-1 h-4 w-1/4 rounded bg-gray-200"></div>
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        </li>
      ))}
    </>
  )
}

function JobListItem({
  job,
  onClick
}: {
  job: Job
  onClick: (job: Job) => void
}) {
  return (
    <li
      className="cursor-pointer rounded-md border border-gray-200 p-4 shadow-sm hover:bg-gray-100 hover:shadow-md"
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
          {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}{' '}
          {job.salary.currencyCode}
        </p>
      )}
    </li>
  )
}

function EmptyJobList() {
  return (
    <li>
      <p className="mt-4 text-gray-600">
        No jobs found. Please try a different search.
      </p>
    </li>
  )
}

function CandidateListItem({ candidate }: { candidate: Candidate }) {
  const handleClick = () => {
    if (candidate.profileUrl) {
      window.open(candidate.profileUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const baseClass =
    'p-4 rounded-md shadow-sm cursor-pointer transition hover:shadow-md'
  const specialClass =
    'border-2 border-yellow-400 bg-yellow-50 hover:bg-yellow-100'
  const normalClass = 'border border-gray-200 bg-white hover:bg-gray-100'

  return (
    <li
      className={
        baseClass + ' ' + (candidate.isSpecial ? specialClass : normalClass)
      }
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={`Open profile for ${candidate.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick()
      }}
    >
      <h3
        className={`text-lg font-medium ${
          candidate.isSpecial
            ? 'animate-pulse text-yellow-700'
            : 'text-gray-900'
        }`}
      >
        {candidate.name}
        {candidate.isSpecial && (
          <span
            className="ml-2 inline-block align-middle"
            title="Special Talent"
          >
            ✨
          </span>
        )}
      </h3>
      {candidate.skills && candidate.skills.length > 0 && (
        <p className="text-sm text-gray-600">
          Skills: {candidate.skills.join(', ')}
        </p>
      )}
      {candidate.summary && (
        <p className="text-sm text-gray-500">{candidate.summary}</p>
      )}
      {candidate.location && (
        <p className="text-sm text-gray-500">
          <span>
            {candidate.location.type !== undefined
              ? `${LocationType[candidate.location.type]}`
              : ''}
            {candidate.location.city ? `, ${candidate.location.city}` : ''}
            {candidate.location.country
              ? `, ${candidate.location.country}`
              : ''}
          </span>
        </p>
      )}
    </li>
  )
}
