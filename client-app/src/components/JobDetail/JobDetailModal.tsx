import { Job } from '../../api/generated'
import JobDetail from './JobDetail'
import closeIcon from '../../assets/close.svg'

type JobDetailModalProps = {
  job: Job
  onClose: () => void
}

export default function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Job Detail Modal"
    >
      <div
        className="
          size-full overflow-hidden
          rounded-lg bg-white shadow-lg
          md:h-[90vh] md:w-[90vw] md:min-w-[768px]
        "
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-2 top-2 p-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="close"
        >
          <img src={closeIcon} alt="close" className="size-6" />
        </button>
        <div className="h-full overflow-y-auto">
          <JobDetail job={job} />
        </div>
      </div>
    </div>
  )
}
