import FixedHeaderContainer from './FixedHeader/FixedHeaderContainer'
import JobListContainer from './JobList/JobListContainer'
import JobDetailModalContainer from './JobDetail/JobDetailModalContainer'
import Footer from './Footer/Footer'

function App() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-white font-sans">
      <FixedHeaderContainer />
      <div className="flex-1">
        <JobListContainer />
        <JobDetailModalContainer />
      </div>
      <Footer />
    </div>
  )
}

export default App
