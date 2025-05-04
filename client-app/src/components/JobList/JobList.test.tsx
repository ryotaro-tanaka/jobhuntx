import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import JobList from './JobList';
import { Job } from '../../api/generated';

describe('<JobList />', () => {
  it('shows 5 skeletons while loading', () => {
    render(<JobList onJobClick={() => {}} searchKey={null} />);
    const skeletons = screen.getAllByRole('listitem');
    expect(skeletons.length).toBe(5);
  });

  it('shows a message when there are no jobs', async () => {
    render(<JobList onJobClick={() => {}} searchKey="noresult" />);
    const msg = await screen.findByText(/No jobs found/i);
    expect(msg).toBeInTheDocument();
  });

  it('shows job list items when jobs exist', async () => {
    render(<JobList onJobClick={() => {}} searchKey="engineer" />);
  });
});