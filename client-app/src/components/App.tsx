import FixedHeader from './FixedHeader/FixedHeader'
import JobList from './JobList/JobList'

function App() {
  return (
    <div className="relative overflow-hidden bg-white">
      <FixedHeader />
      <div className="pt-20 p-4">
        <JobList />
      </div>
    </div>
  )
}

export default App
