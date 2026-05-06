import { useEffect, useState } from 'react'
import { Job, Candidate } from '../../api/generated'
import { createApiClient } from '../../api/clientFactory'
import { useJobContext } from '../../contexts/JobSearchContext'
import JobList from './JobList'

export default function JobListContainer() {
  const { searchKey, isJobList, isHeaderLarge, handleJobClick } =
    useJobContext()
  const [jobs, setJobs] = useState<Job[]>([])
  const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [talentLoading, setTalentLoading] = useState(true)
  const [candidates, setCandidates] = useState<Candidate[]>([])

  // talent pool
  useEffect(() => {
    const fetchCandidates = async () => {
      setTalentLoading(true)
      try {
        const client = createApiClient()
        const data = await client.candidates()
        setCandidates(data ?? [])
      } catch (error) {
        console.error('Failed to fetch candidates:', error)
      } finally {
        setTalentLoading(false)
      }
    }
    fetchCandidates()
  }, [])

  // jobs pool
  useEffect(() => {
    const fetchJobs = async () => {
      setJobsLoading(true)
      try {
        const client = createApiClient()
        const data = await client.jobs(searchKey ?? undefined)
        setJobs(data.jobs ?? [])

        // If 0 results, fetch all jobs for suggestions
        if (searchKey && data.totalCount === 0) {
          const allJobsData = await client.jobs(undefined)
          setSuggestedJobs(allJobsData.jobs ?? [])
        } else {
          setSuggestedJobs([])
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      } finally {
        setJobsLoading(false)
      }
    }

    fetchJobs()
  }, [searchKey])

  return (
    <JobList
      jobs={jobs}
      suggestedJobs={suggestedJobs}
      candidates={candidates}
      jobsLoading={jobsLoading}
      talentLoading={talentLoading}
      isJobList={isJobList}
      headerIsLarge={isHeaderLarge}
      onJobClick={handleJobClick}
    />
  )
}
