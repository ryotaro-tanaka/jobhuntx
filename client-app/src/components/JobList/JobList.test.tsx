import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach, type Mock } from 'vitest';
import JobList from './JobList';
import { Job, Salary, Location, LocationType, Candidate } from '../../api/generated';
import { createApiClient } from '../../api/clientFactory';

vi.mock('../../api/clientFactory', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, any>),
    createApiClient: vi.fn(),
  };
});

describe('JobList Component', () => {
  const mockOnJobClick = vi.fn();
  const mockJobs: Job[] = [
    new Job({
      id: '1',
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: new Location({ city: 'San Francisco', country: 'USA', type: LocationType._0 }),
      salary: new Salary({ min: 80000, max: 120000, currencyCode: 'USD' }),
    }),
    new Job({
      id: '2',
      title: 'Product Manager',
      company: 'Innovate Ltd',
      location: new Location({ city: 'New York', country: 'USA', type: LocationType._1 }),
      salary: new Salary({ min: 90000, max: 130000, currencyCode: 'USD' }),
    }),
  ];

  const mockCandidates: Candidate[] = [
    new Candidate({
      id: 'c1',
      name: 'Alice',
      isSpecial: true,
      skills: ['React', 'TypeScript'],
      summary: 'Frontend specialist',
      location: new Location({ city: 'Tokyo', country: 'Japan', type: LocationType._0 }),
      profileUrl: 'https://example.com/alice'
    }),
    new Candidate({
      id: 'c2',
      name: 'Bob',
      isSpecial: false,
      skills: ['Go', 'Kubernetes'],
      summary: 'Backend engineer',
      location: new Location({ city: 'Osaka', country: 'Japan', type: LocationType._1 }),
      profileUrl: 'https://example.com/bob'
    }),
  ];

  let jobsMock: Mock;
  let candidatesMock: Mock;

  beforeEach(() => {
    jobsMock = vi.fn();
    candidatesMock = vi.fn();
    (createApiClient as unknown as Mock).mockReturnValue({
      jobs: jobsMock,
      candidates: candidatesMock,
    });
    mockOnJobClick.mockClear();
  });

  it('shows LoadingSkeletonList when jobsLoading is true and isJobList is true', () => {
    // keep in mind that LoadingSkeletonList is a placeholder for loading state
    render(<JobList onJobClick={mockOnJobClick} searchKey={null} headerIsLarge={true} isJobList={true} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });

  it('shows EmptyJobList and suggested jobs when jobs.length === 0 and isJobList is true', async () => {
    jobsMock
      .mockResolvedValueOnce({ jobs: [], totalCount: 0 })
      .mockResolvedValueOnce({ jobs: mockJobs, totalCount: 2 }); // suggested jobs
    candidatesMock.mockResolvedValue([]);
    render(<JobList onJobClick={mockOnJobClick} searchKey="nonexistent" headerIsLarge={true} isJobList={true} />);
    expect(await screen.findByText('No jobs found. Please try a different search.')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('shows JobListItem for each job when jobs.length > 0 and isJobList is true', async () => {
    jobsMock.mockResolvedValueOnce({ jobs: mockJobs, totalCount: 2 });
    candidatesMock.mockResolvedValueOnce([]);
    render(<JobList onJobClick={mockOnJobClick} searchKey={null} headerIsLarge={true} isJobList={true} />);
    expect(await screen.findByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('shows LoadingSkeletonList when talentLoading is true and isJobList is false', () => {
    render(<JobList onJobClick={mockOnJobClick} searchKey={null} headerIsLarge={true} isJobList={false} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });

  it('shows "No talent found." when candidates.length === 0 and isJobList is false', async () => {
    jobsMock.mockResolvedValueOnce({ jobs: [], totalCount: 0 });
    candidatesMock.mockResolvedValueOnce([]);
    render(<JobList onJobClick={mockOnJobClick} searchKey={null} headerIsLarge={true} isJobList={false} />);
    expect(await screen.findByText('No talent found.')).toBeInTheDocument();
  });

  it('shows CandidateListItem for each candidate when candidates.length > 0 and isJobList is false', async () => {
    jobsMock.mockResolvedValueOnce({ jobs: [], totalCount: 0 });
    candidatesMock.mockResolvedValueOnce(mockCandidates);
    render(<JobList onJobClick={mockOnJobClick} searchKey={null} headerIsLarge={true} isJobList={false} />);
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders loading skeleton while fetching jobs', async () => {
    jobsMock.mockResolvedValueOnce({ jobs: [], totalCount: 0 });
    candidatesMock.mockResolvedValueOnce([]);
    render(<JobList onJobClick={mockOnJobClick} searchKey={null} headerIsLarge={true} isJobList={true} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });

  it('renders job list when jobs are fetched', async () => {
    jobsMock.mockResolvedValueOnce({ jobs: mockJobs, totalCount: 2 });
    candidatesMock.mockResolvedValueOnce([]);
    render(<JobList onJobClick={mockOnJobClick} searchKey={null} headerIsLarge={true} isJobList={true} />);
    expect(await screen.findByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('renders empty state and suggested jobs when no jobs match searchKey', async () => {
    jobsMock
      .mockResolvedValueOnce({ jobs: [], totalCount: 0 }) // No jobs for searchKey
      .mockResolvedValueOnce({ jobs: mockJobs, totalCount: 2 }); // Suggested jobs
    candidatesMock.mockResolvedValue([]);
    render(<JobList onJobClick={mockOnJobClick} searchKey="nonexistent" headerIsLarge={true} isJobList={true} />);
    expect(await screen.findByText('No jobs found. Please try a different search.')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('calls onJobClick when a job is clicked', async () => {
    jobsMock.mockResolvedValueOnce({ jobs: mockJobs, totalCount: 2 });
    candidatesMock.mockResolvedValueOnce([]);
    render(<JobList onJobClick={mockOnJobClick} searchKey={null} headerIsLarge={true} isJobList={true} />);
    const jobItem = await screen.findByText('Software Engineer');
    fireEvent.click(jobItem);
    expect(mockOnJobClick).toHaveBeenCalledWith(mockJobs[0]);
  });

  it('renders candidate list when isJobList is false', async () => {
    jobsMock.mockResolvedValueOnce({ jobs: [], totalCount: 0 });
    candidatesMock.mockResolvedValueOnce(mockCandidates);
    render(<JobList onJobClick={mockOnJobClick} searchKey={null} headerIsLarge={true} isJobList={false} />);
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText(/Frontend specialist/)).toBeInTheDocument();
    expect(screen.getByText(/Backend engineer/)).toBeInTheDocument();
  });

  it('renders empty state when no candidates found', async () => {
    jobsMock.mockResolvedValueOnce({ jobs: [], totalCount: 0 });
    candidatesMock.mockResolvedValueOnce([]);
    render(<JobList onJobClick={mockOnJobClick} searchKey={null} headerIsLarge={true} isJobList={false} />);
    expect(await screen.findByText('No talent found.')).toBeInTheDocument();
  });
});