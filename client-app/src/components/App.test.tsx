import { render, screen } from '@testing-library/react'
import App from './App'
import { JobSearchProvider } from '../contexts/JobSearchContext'

// UI test (component test)
describe('<App />', () => {
  it('display sub components', async () => {
    render(
      <JobSearchProvider>
        <App />
      </JobSearchProvider>
    )

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(await screen.findByRole('main')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

// Unit test
// Mock
// snapshot test
