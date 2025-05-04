import { useState, useEffect } from 'react';
import { Job } from '../api/generated';
import FixedHeader from './FixedHeader/FixedHeader'
import JobList from './JobList/JobList'
import JobDetailModal from './JobDetail/JobDetailModal'

function App() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchKey, setSearchKey] = useState<string | null>(null); // /api/job?key={searchKey}
  const [isHeaderLarge, setIsHeaderLarge] = useState(true);

  // スクロール検知
  useEffect(() => {
    const onScroll = () => setIsHeaderLarge(window.scrollY < 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <div className="relative overflow-hidden bg-white font-sans">
      <FixedHeader
        onSearch={handleSearch}
        isLarge={isHeaderLarge}
        setIsLarge={setIsHeaderLarge}
      />
      <JobList
        onJobClick={handleJobClick}
        searchKey={searchKey}
        headerIsLarge={isHeaderLarge}
      />
      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={handleCloseDetail} />
      )}
    </div>
  );
}

export default App;
