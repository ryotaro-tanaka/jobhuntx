import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, vi, expect, beforeEach } from 'vitest'
import FixedHeader from './FixedHeader'
import { JobSearchProvider } from '../../contexts/JobSearchContext'

global.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        roles: [],
        skills: [],
        domains: [],
        employment: [],
        locations: []
      }),
    text: () => Promise.resolve(''),
    status: 200,
    headers: {}
  } as unknown as Response)
)

describe('<FixedHeader />', () => {
  const onSearch = vi.fn()
  const setIsLarge = vi.fn()
  const setIsJobList = vi.fn()

  beforeEach(() => {
    onSearch.mockClear()
    setIsLarge.mockClear()
    setIsJobList.mockClear()
  })

  it('renders correctly', () => {
    render(
      <JobSearchProvider>
        <FixedHeader
          onSearch={onSearch}
          isLarge={true}
          setIsLarge={setIsLarge}
          isJobList={true}
          setIsJobList={setIsJobList}
        />
      </JobSearchProvider>
    )
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Keyword')).toBeInTheDocument()
  })

  it('calls onSearch when search button is clicked', () => {
    render(
      <JobSearchProvider>
        <FixedHeader
          onSearch={onSearch}
          isLarge={true}
          setIsLarge={setIsLarge}
          isJobList={true}
          setIsJobList={setIsJobList}
        />
      </JobSearchProvider>
    )
    const searchButton = screen.getByRole('button', { name: /search/i })
    fireEvent.click(searchButton)
    expect(onSearch).toHaveBeenCalled()
  })

  it('toggles between Jobs and Talent', () => {
    render(
      <JobSearchProvider>
        <FixedHeader
          onSearch={onSearch}
          isLarge={true}
          setIsLarge={setIsLarge}
          isJobList={true}
          setIsJobList={setIsJobList}
        />
      </JobSearchProvider>
    )
    const talentButton = screen.getByText('Talent')
    fireEvent.click(talentButton)
    expect(setIsJobList).toHaveBeenCalledWith(false)
  })

  it('updates input value on change', () => {
    render(
      <JobSearchProvider>
        <FixedHeader
          onSearch={onSearch}
          isLarge={true}
          setIsLarge={setIsLarge}
          isJobList={true}
          setIsJobList={setIsJobList}
        />
      </JobSearchProvider>
    )
    const input = screen.getByPlaceholderText('Keyword')
    fireEvent.change(input, { target: { value: 'react' } })
    expect(input).toHaveValue('react')
  })
})
