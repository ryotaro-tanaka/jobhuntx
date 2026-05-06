import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, vi, expect } from 'vitest'
import JobList from './JobList'
import {
  Job,
  Salary,
  Location,
  LocationType,
  Candidate
} from '../../api/generated'

describe('JobList Component', () => {
  const mockOnJobClick = vi.fn()
  const mockJobs: Job[] = [
    new Job({
      id: '1',
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: new Location({
        city: 'San Francisco',
        country: 'USA',
        type: LocationType._0
      }),
      salary: new Salary({ min: 80000, max: 120000, currencyCode: 'USD' })
    }),
    new Job({
      id: '2',
      title: 'Product Manager',
      company: 'Innovate Ltd',
      location: new Location({
        city: 'New York',
        country: 'USA',
        type: LocationType._1
      }),
      salary: new Salary({ min: 90000, max: 130000, currencyCode: 'USD' })
    })
  ]

  const mockCandidates: Candidate[] = [
    new Candidate({
      id: 'c1',
      name: 'Alice',
      isSpecial: true,
      skills: ['React', 'TypeScript'],
      summary: 'Frontend specialist',
      location: new Location({
        city: 'Tokyo',
        country: 'Japan',
        type: LocationType._0
      }),
      profileUrl: 'https://example.com/alice'
    }),
    new Candidate({
      id: 'c2',
      name: 'Bob',
      isSpecial: false,
      skills: ['Go', 'Kubernetes'],
      summary: 'Backend engineer',
      location: new Location({
        city: 'Osaka',
        country: 'Japan',
        type: LocationType._1
      }),
      profileUrl: 'https://example.com/bob'
    })
  ]

  const defaultProps = {
    jobs: [],
    suggestedJobs: [],
    candidates: [],
    jobsLoading: false,
    talentLoading: false,
    isJobList: true,
    headerIsLarge: true,
    onJobClick: mockOnJobClick
  }

  it('shows LoadingSkeletonList when jobsLoading is true and isJobList is true', () => {
    render(<JobList {...defaultProps} jobsLoading={true} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })

  it('shows EmptyJobList and suggested jobs when jobs.length === 0 and isJobList is true', () => {
    render(<JobList {...defaultProps} jobs={[]} suggestedJobs={mockJobs} />)
    expect(
      screen.getByText('No jobs found. Please try a different search.')
    ).toBeInTheDocument()
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('Product Manager')).toBeInTheDocument()
  })

  it('shows JobListItem for each job when jobs.length > 0 and isJobList is true', () => {
    render(<JobList {...defaultProps} jobs={mockJobs} />)
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('Product Manager')).toBeInTheDocument()
  })

  it('shows LoadingSkeletonList when talentLoading is true and isJobList is false', () => {
    render(<JobList {...defaultProps} isJobList={false} talentLoading={true} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })

  it('shows "No talent found." when candidates.length === 0 and isJobList is false', () => {
    render(<JobList {...defaultProps} isJobList={false} candidates={[]} />)
    expect(screen.getByText('No talent found.')).toBeInTheDocument()
  })

  it('shows CandidateListItem for each candidate when candidates.length > 0 and isJobList is false', () => {
    render(
      <JobList
        {...defaultProps}
        isJobList={false}
        candidates={mockCandidates}
      />
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('calls onJobClick when a job is clicked', () => {
    render(<JobList {...defaultProps} jobs={mockJobs} />)
    const jobItem = screen.getByText('Software Engineer')
    fireEvent.click(jobItem)
    expect(mockOnJobClick).toHaveBeenCalledWith(mockJobs[0])
  })
})
