import React, { createContext, useContext, ReactNode } from 'react'
import { useJobSearch } from '../hooks/useJobSearch'
import { Job } from '../api/generated'

interface JobSearchContextType {
  selectedJob: Job | null
  searchKey: string | null
  isHeaderLarge: boolean
  isJobList: boolean
  setSelectedJob: (job: Job | null) => void
  setSearchKey: (key: string | null) => void
  setIsHeaderLarge: (isLarge: boolean) => void
  setIsJobList: (isJobList: boolean) => void
  handleJobClick: (job: Job) => void
  handleCloseDetail: () => void
  handleSearch: (key: string | null) => void
}

const JobSearchContext = createContext<JobSearchContextType | undefined>(
  undefined
)

export const JobSearchProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const jobSearch = useJobSearch()

  return (
    <JobSearchContext.Provider value={jobSearch}>
      {children}
    </JobSearchContext.Provider>
  )
}

export const useJobContext = () => {
  const context = useContext(JobSearchContext)
  if (context === undefined) {
    throw new Error('useJobContext must be used within a JobSearchProvider')
  }
  return context
}
