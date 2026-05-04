import { useJobContext } from '../../contexts/JobSearchContext'
import FixedHeader from './FixedHeader'

export default function FixedHeaderContainer() {
  const {
    handleSearch,
    isHeaderLarge,
    setIsHeaderLarge,
    isJobList,
    setIsJobList
  } = useJobContext()

  return (
    <FixedHeader
      onSearch={handleSearch}
      isLarge={isHeaderLarge}
      setIsLarge={setIsHeaderLarge}
      isJobList={isJobList}
      setIsJobList={setIsJobList}
    />
  )
}
