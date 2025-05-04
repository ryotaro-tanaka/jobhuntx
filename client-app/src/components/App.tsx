import { useState } from 'react';
import { Job } from '../api/generated';
import FixedHeader from './FixedHeader/FixedHeader'
import JobList from './JobList/JobList'
import JobDetailModal from './JobDetail/JobDetailModal'

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
      <FixedHeader onSearch={handleSearch} />
      <JobList onJobClick={handleJobClick} searchKey={searchKey} />
      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={handleCloseDetail} />
      )}
    </div>
  );
}

export default App;
