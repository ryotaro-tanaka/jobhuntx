import { useState, useEffect } from 'react';
import { Job } from '../api/generated';
import FixedHeader from './FixedHeader/FixedHeader'
import JobList from './JobList/JobList'
import JobDetailModal from './JobDetail/JobDetailModal'
import Footer from './Footer/Footer';

function App() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchKey, setSearchKey] = useState<string | null>(null); // /api/job?key={searchKey}
  const [isHeaderLarge, setIsHeaderLarge] = useState(true);
  const [isJobList, setIsJobList] = useState(true);

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
    <div className="relative overflow-hidden bg-white font-sans min-h-screen flex flex-col">
      <FixedHeader
        onSearch={handleSearch}
        isLarge={isHeaderLarge}
        setIsLarge={setIsHeaderLarge}
        isJobList={isJobList}
        setIsJobList={setIsJobList}
      />
      <div className="flex-1">
        <JobList
          onJobClick={handleJobClick}
          searchKey={searchKey}
          headerIsLarge={isHeaderLarge}
          isJobList={isJobList}
        />
        {selectedJob && (
          <JobDetailModal job={selectedJob} onClose={handleCloseDetail} />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
