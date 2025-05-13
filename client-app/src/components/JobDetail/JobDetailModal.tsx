import { Job } from '../../api/generated';
import JobDetail from './JobDetail';
import closeIcon from '../../assets/close.svg';

type JobDetailModalProps = {
  job: Job;
  onClose: () => void;
};

export default function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Job Detail Modal"
    >
      <div
        className="
          w-full h-full
          md:w-[90vw] md:min-w-[768px] md:h-[90vh]
          bg-white rounded-lg shadow-lg overflow-hidden
        "
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-2"
          onClick={onClose}
          aria-label="close"
        >
          <img src={closeIcon} alt="close" className="w-6 h-6" />
        </button>
        <div className="h-full overflow-y-auto">
          <JobDetail job={job} />
        </div>
      </div>
    </div>
  );
}