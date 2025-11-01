import React from 'react';
import { Heart, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-dark-card border-t dark:border-dark-border mt-auto transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="text-blue-600 dark:text-blue-400" size={24} />
              <span className="text-lg font-bold text-gray-800 dark:text-dark-text">
                MindCare
              </span>
            </div>
            <p className="text-gray-600 dark:text-dark-muted text-sm">
              Your safe, anonymous space for mental wellness support. Built with care for Indian youth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/resources"
                  className="text-gray-600 dark:text-dark-muted hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Resources
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-600 dark:text-dark-muted hover:text-blue-600 dark:hover:text-blue-400"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-gray-600 dark:text-dark-muted hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-4">
              Emergency Helplines
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-dark-muted">
              <li>Vandrevala: 1860-2662-345</li>
              <li>AASRA: 9820466726</li>
              <li>iCall: 9152987821</li>
            </ul>
          </div>
        </div>

        <div className="border-t dark:border-dark-border mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 dark:text-dark-muted transition-colors duration-300">
          <p>© 2024 MindCare. Made with ❤️ for Indian Youth</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a
              href="mailto:support@mindcare.com"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Mail size={20} />
            </a>
            <a
              href="https://github.com"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
