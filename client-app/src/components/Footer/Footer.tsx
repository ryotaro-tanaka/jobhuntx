import githubLogo from '../../assets/github.svg'

const Footer = () => (
  <footer className="relative flex w-full flex-col items-center justify-center bg-gray-100 py-4 text-sm text-gray-500 md:flex-row">
    <span className="mx-auto md:mx-0">
      © {new Date().getFullYear()} Ryotaro Tanaka. All rights reserved.
    </span>
    <a
      href="https://github.com/ryotaro-tanaka/jobhuntx"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex items-center gap-1 text-gray-600 hover:text-black md:absolute md:right-8 md:mt-0"
    >
      <img src={githubLogo} alt="GitHub" width={20} height={20} />
    </a>
  </footer>
)

export default Footer
