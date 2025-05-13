import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import JobDetailModal from './JobDetailModal';
import { Job } from '../../api/generated';

const dummyJob = {} as Job;

describe('<JobDetailModal />', () => {
  it('renders modal with job details', () => {
    render(<JobDetailModal job={dummyJob} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByAltText(/close/i)).toBeInTheDocument();
  });

  it('calls onClose when background is clicked', () => {
    const handleClose = vi.fn();
    render(<JobDetailModal job={dummyJob} onClose={handleClose} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(handleClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<JobDetailModal job={dummyJob} onClose={handleClose} />);
    fireEvent.click(screen.getByLabelText(/close/i));
    expect(handleClose).toHaveBeenCalled();
  });
});