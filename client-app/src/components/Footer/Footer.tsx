import githubLogo from '../../assets/github.svg';

const Footer = () => (
  <footer className="w-full bg-gray-100 py-4 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-center relative">
    <span className="mx-auto md:mx-0">
      © {new Date().getFullYear()} Ryotaro Tanaka. All rights reserved.
    </span>
    <a
      href="https://github.com/ryotaro-tanaka/jobhuntx"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 md:mt-0 md:absolute md:right-8 inline-flex items-center gap-1 text-gray-600 hover:text-black"
    >
      <img src={githubLogo} alt="GitHub" width={20} height={20} />
    </a>
  </footer>
);

export default Footer;