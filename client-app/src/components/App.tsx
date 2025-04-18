import { useState } from 'react';
import { Job } from '../api/generated';
import FixedHeader from './FixedHeader/FixedHeader'
import JobList from './JobList/JobList'
import JobDetail from './JobDetail/JobDetail'

function App() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job); // Set the selected job
  };

  const handleCloseDetail = () => {
    setSelectedJob(null); // Clear the selected job
  };

  return (
    <div className="relative overflow-hidden bg-white">
      <FixedHeader />
      <div className="pt-32 p-4">
        <JobList onJobClick={handleJobClick} />
      </div>
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black bg-opacity-50"
          onClick={handleCloseDetail}
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
