import { useState, useEffect } from 'react'
import { Job } from '../api/generated'

export function useJobSearch() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [searchKey, setSearchKey] = useState<string | null>(null)
  const [isHeaderLarge, setIsHeaderLarge] = useState(true)
  const [isJobList, setIsJobList] = useState(true)

  // スクロール検知
  useEffect(() => {
    const onScroll = () => setIsHeaderLarge(window.scrollY < 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleJobClick = (job: Job) => {
    setSelectedJob(job)
  }

  const handleCloseDetail = () => {
    setSelectedJob(null)
  }

  const handleSearch = (key: string | null) => {
    setSearchKey(key)
  }

  return {
    selectedJob,
    searchKey,
    isHeaderLarge,
    isJobList,
    setSelectedJob,
    setSearchKey,
    setIsHeaderLarge,
    setIsJobList,
    handleJobClick,
    handleCloseDetail,
    handleSearch
  }
}
