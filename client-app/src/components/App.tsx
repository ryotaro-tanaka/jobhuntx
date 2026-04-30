import { useJobSearch } from '../hooks/useJobSearch';
import FixedHeader from './FixedHeader/FixedHeader'
import JobList from './JobList/JobList'
import JobDetailModal from './JobDetail/JobDetailModal'
import Footer from './Footer/Footer';

function App() {
  const {
    selectedJob,
    searchKey,
    isHeaderLarge,
    isJobList,
    setIsHeaderLarge,
    setIsJobList,
    handleJobClick,
    handleCloseDetail,
    handleSearch,
  } = useJobSearch();

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
