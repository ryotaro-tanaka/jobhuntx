import { render, screen } from '@testing-library/react'
import App from './App'

// UI test (component test)
describe('<App />', () => {
  it('display sub components', async () => {
    render(<App />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(await screen.findByRole('main')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

// Unit test
// Mock
// snapshot test
