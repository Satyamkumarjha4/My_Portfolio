import type React from "react"
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-gray-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top section with columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 border-b border-gray-800 pb-12">
          {/* About column */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Satyam Kumar Jha</h3>
            <p className="text-gray-300 mb-4">
              Turning ideas into reality through code and innovation. Specializing in AI/ML and full-stack development.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Mail size={20} />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                  <span>About</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                  <span>Projects</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                  <span>Skills</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Get In Touch</h3>
            <div className="space-y-3">
              <p className="text-gray-300 flex items-center">
                <Mail size={18} className="mr-2 text-indigo-400" />
                <a href="mailto:satyamjha4@gmail.com" className="hover:text-indigo-400 transition-colors">
                  satyamjha4@gmail.com
                </a>
              </p>
              <div className="mt-6">
                <a
                  href="#contact"
                  className="bg-indigo-500 text-white px-5 py-2 rounded-full hover:bg-indigo-600 transition duration-300 inline-flex items-center"
                >
                  Contact Me
                  <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
            </div>
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
