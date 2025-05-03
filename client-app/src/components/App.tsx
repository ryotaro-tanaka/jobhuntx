import { useState } from 'react';
import { Job } from '../api/generated';
import FixedHeader from './FixedHeader/FixedHeader'
import JobList from './JobList/JobList'
import JobDetail from './JobDetail/JobDetail'

function App() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchKey, setSearchKey] = useState<string | null>(null); // /api/job?key={searchKey}

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  const handleCloseDetail = () => {
    setSelectedJob(null);
  };

  const handleSearch = (key: string | null) => {
    setSearchKey(key);
  };

  return (
    <div className="relative overflow-hidden bg-white">
      <FixedHeader onSearch={handleSearch} /> {/* 検索イベントを渡す */}
      <div className="pt-32 p-4">
        <JobList onJobClick={handleJobClick} searchKey={searchKey} /> {/* 動的URLを渡す */}
      </div>
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black bg-opacity-50"
          onClick={handleCloseDetail}
          role="dialog"
          aria-modal="true"
          aria-label="Job Detail Modal"
        >
          <div
            className="w-full md:w-3/4 h-3/4 bg-white rounded-lg shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <div className="h-full overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={handleCloseDetail}
              >
                Close
              </button>
              <JobDetail job={selectedJob} /> {/* Pass the selected job */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
