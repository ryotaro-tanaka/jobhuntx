import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import FixedHeader from './FixedHeader'

// mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        roles: [],
        skills: [],
        domains: [],
        employment: [],
        locations: [],
      }),
    text: () => Promise.resolve(''),
    status: 200,
    headers: {},
  })
) as any

describe('<FixedHeader />', () => {
  const onSearch = vi.fn()
  const setIsLarge = vi.fn()
  const setIsJobList = vi.fn()

  beforeEach(() => {
    onSearch.mockClear()
    setIsLarge.mockClear()
    setIsJobList.mockClear()
  })

  it('renders both logos and search form', () => {
    render(
      <FixedHeader
        onSearch={onSearch}
        isLarge={true}
        setIsLarge={setIsLarge}
        isJobList={true}
        setIsJobList={setIsJobList}
      />
    )
    // Both logos should be present
    expect(screen.getByAltText('JobHuntX Logo')).toBeInTheDocument()
    expect(screen.getByAltText('JobHuntX Logo Small')).toBeInTheDocument()
    // Search form and searchbox
    expect(screen.getByRole('search')).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    // Toggle buttons
    expect(screen.getByRole('button', { name: /Jobs/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Talent/i })).toBeInTheDocument()
  })

  it('calls onSearch when form is submitted', () => {
    render(
      <FixedHeader
        onSearch={onSearch}
        isLarge={true}
        setIsLarge={setIsLarge}
        isJobList={true}
        setIsJobList={setIsJobList}
      />
    )
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'engineer' } })
    fireEvent.submit(screen.getByRole('search'))
    expect(onSearch).toHaveBeenCalledWith('engineer')
  })

  it('calls setIsLarge(true) on input focus', () => {
    render(
      <FixedHeader
        onSearch={onSearch}
        isLarge={false}
        setIsLarge={setIsLarge}
        isJobList={true}
        setIsJobList={setIsJobList}
      />
    )
    const input = screen.getByRole('searchbox')
    fireEvent.focus(input)
    expect(setIsLarge).toHaveBeenCalledWith(true)
  })

  // it('calls setIsJobList when toggle buttons are clicked', () => {
  //   render(
  //     <FixedHeader
  //       onSearch={onSearch}
  //       isLarge={true}
  //       setIsLarge={setIsLarge}
  //       isJobList={true}
  //       setIsJobList={setIsJobList}
  //     />
  //   )
  //   fireEvent.click(screen.getByRole('button', { name: /Talent/i }))
  //   expect(setIsJobList).toHaveBeenCalledWith(false)
  //   fireEvent.click(screen.getByRole('button', { name: /Jobs/i }))
  //   expect(setIsJobList).toHaveBeenCalledWith(true)
  // })
})