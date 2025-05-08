import type React from "react"
import { Github, Linkedin, Mail } from "lucide-react"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  return (
    <footer className="w-full bg-gray-900 text-white py-12 px-6">
      
      <div className="w-400 mx-auto">
        {/* Top section with columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 border-y border-gray-800 py-12 px-2">
          {/* About column */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Satyam Kumar Jha</h3>
            <p className="text-gray-300 mb-4">
              Turning ideas into reality through code and innovation. Specializing in AI/ML and full-stack development.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://github.com/Satyamkumarjha4" target="_blank" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Github size={30} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://linkedin.com/in/satyamkumarjha4" target="_blank" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Linkedin size={30} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="mailto:satyamjha4@gmail.com" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Mail size={30} />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a onClick={() => navigateTo('/')}  className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                  <span className="transition-transform duration-300 p-1 hover:scale-110 hover:bg-gray-800 rounded-md">Home</span>
                </a>
              </li>
              <li>
                <a onClick={() => navigateTo('/About')}  className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                  <span className="transition-transform duration-300 p-1 hover:scale-110 hover:bg-gray-800 rounded-md">About</span>
                </a>
              </li>
              <li>
                <a onClick={() => navigateTo('/Projects')}  className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                  <span className="transition-transform duration-300 p-1 hover:scale-110 hover:bg-gray-800 rounded-md">Projects</span>
                </a>
              </li>
              <li>
                <a onClick={() => navigateTo('/Contact')}  className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                  <span className="transition-transform duration-300 p-1 hover:scale-110 hover:bg-gray-800 rounded-md">Contact</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Made Using</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                <span className="transition-transform duration-300 p-1 hover:scale-110 hover:bg-gray-800 rounded-md">React</span>
              </li>
              <li className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                <span className="transition-transform duration-300 p-1 hover:scale-110 hover:bg-gray-800 rounded-md">TypeScript</span>
              </li>
              <li className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                <span className="transition-transform duration-300 p-1 hover:scale-110 hover:bg-gray-800 rounded-md">Tailwind CSS</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="text-center text-gray-400 text-sm">
          <p>© {currentYear} Satyam Kumar Jha. All rights reserved.</p>
          <p className="mt-2">
            <span className="inline-flex items-center">
              Built with
              <span className="text-red-500 mx-1">❤</span>
              using React & Tailwind CSS
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
