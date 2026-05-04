import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import '../index.css'
import App from 'components/App'
import { JobSearchProvider } from './contexts/JobSearchContext'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  <JobSearchProvider>
    <App />
  </JobSearchProvider>
)
