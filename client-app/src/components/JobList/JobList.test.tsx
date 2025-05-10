import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach, type Mock } from 'vitest';
import JobList from './JobList';
import { Job, Salary, Location, LocationType } from '../../api/generated';
import { createApiClient } from '../../api/clientFactory';

vi.mock('../../api/clientFactory', async () => {
  return {
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

  let jobsMock: Mock;

  beforeEach(() => {
    jobsMock = vi.fn();
    (createApiClient as unknown as Mock).mockReturnValue({
      jobs: jobsMock,
    });
  });

  it('renders loading skeleton while fetching jobs', async () => {
    jobsMock.mockResolvedValueOnce({ jobs: [], totalCount: 0 });

    render(<JobList onJobClick={mockOnJobClick} searchKey={null} headerIsLarge={true} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });

  it('renders job list when jobs are fetched', async () => {
    jobsMock.mockResolvedValueOnce({ jobs: mockJobs, totalCount: 2 });

    render(<JobList onJobClick={mockOnJobClick} searchKey={null} headerIsLarge={true} />);
    expect(await screen.findByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('renders empty state and suggested jobs when no jobs match searchKey', async () => {
    jobsMock
      .mockResolvedValueOnce({ jobs: [], totalCount: 0 }) // No jobs for searchKey
      .mockResolvedValueOnce({ jobs: mockJobs, totalCount: 2 }); // Suggested jobs

    render(<JobList onJobClick={mockOnJobClick} searchKey="nonexistent" headerIsLarge={true} />);

    expect(await screen.findByText('No jobs found. Please try a different search.')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('calls onJobClick when a job is clicked', async () => {
    jobsMock.mockResolvedValueOnce({ jobs: mockJobs, totalCount: 2 });

    render(<JobList onJobClick={mockOnJobClick} searchKey={null} headerIsLarge={true} />);

    const jobItem = await screen.findByText('Software Engineer');
    fireEvent.click(jobItem);

    expect(mockOnJobClick).toHaveBeenCalledWith(mockJobs[0]);
  });
});