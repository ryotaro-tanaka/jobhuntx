import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import FixedHeader from './FixedHeader'

describe('<FixedHeader />', () => {
  const onSearch = vi.fn()
  const setIsLarge = vi.fn()

  beforeEach(() => {
    onSearch.mockClear()
    setIsLarge.mockClear()
  })

  it('renders logo and search form', () => {
    render(<FixedHeader onSearch={onSearch} isLarge={true} setIsLarge={setIsLarge} />)
    expect(screen.getByAltText(/JobHuntX Logo/)).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(screen.getByRole('search')).toBeInTheDocument()
  })

  it('calls onSearch when form is submitted', () => {
    render(<FixedHeader onSearch={onSearch} isLarge={true} setIsLarge={setIsLarge} />)
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'engineer' } })
    fireEvent.submit(input)
    expect(onSearch).toHaveBeenCalledWith('engineer')
  })

  it('calls setIsLarge(true) on input focus', () => {
    render(<FixedHeader onSearch={onSearch} isLarge={false} setIsLarge={setIsLarge} />)
    const input = screen.getByRole('searchbox')
    fireEvent.focus(input)
    expect(setIsLarge).toHaveBeenCalledWith(true)
  })
})