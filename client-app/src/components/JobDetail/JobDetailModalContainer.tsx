import { useJobContext } from '../../contexts/JobSearchContext'
import JobDetailModal from './JobDetailModal'

export default function JobDetailModalContainer() {
  const { selectedJob, handleCloseDetail } = useJobContext()

  if (!selectedJob) return null

  return <JobDetailModal job={selectedJob} onClose={handleCloseDetail} />
}
