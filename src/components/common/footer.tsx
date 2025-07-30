import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-gray-600 text-sm text-center md:text-left">
          © {new Date().getFullYear()} Sommaire AI. All rights reserved.
        </div>

        <div className="flex gap-4 text-sm text-gray-500">
          <a href="/privacy" className="hover:text-gray-800 transition-colors">
            Privacy
          </a>
          <a href="/terms" className="hover:text-gray-800 transition-colors">
            Terms
          </a>
          <a
            href="#"
            className="hover:text-gray-800 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400" />
    </footer>
  );
};

export default Footer;
