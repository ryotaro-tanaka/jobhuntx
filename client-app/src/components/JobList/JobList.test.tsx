import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import JobList from './JobList';
import { Job, Client } from '../../api/generated';

// Mocking
const mockJobs = [new Job({ id: "1", title: "Software Engineer", company: "Test Inc." })];
const mockSuggestedJobs = [new Job({ id: "2", title: "Recommended Job", company: "Suggest Corp." })];

vi.mock('../../api/generated', async (importOriginal) => {
  const mod = (await importOriginal()) as object;
  return {
    ...mod,
    Client: class {
      jobs(key?: string) {
        if (key === 'noresult') return Promise.resolve([]);
        if (key === undefined) return Promise.resolve(mockSuggestedJobs);
        return Promise.resolve(mockJobs);
      }
    },
  };
});

// Component tests
describe('<JobList />', () => {
  it('shows 5 skeletons while loading', () => {
    render(<JobList onJobClick={() => {}} searchKey={null} />);
    const skeletons = screen.getAllByRole('listitem');
    expect(skeletons.length).toBe(5);
  });

  it('shows a message and suggested jobs when there are no jobs', async () => {
    render(<JobList onJobClick={() => {}} searchKey="noresult" />);
    expect(await screen.findByText(/No jobs found/i)).toBeInTheDocument();
    expect(await screen.findByText(/Recommended Job/i)).toBeInTheDocument();
  });

  it('shows job list items when jobs exist', async () => {
    render(<JobList onJobClick={() => {}} searchKey="engineer" />);
    expect(await screen.findByText(/Software Engineer/i)).toBeInTheDocument();
  });
});