import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav className=" w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-gray-800 text-xl font-bold">
              Digital Housing
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition duration-150">
              Home
            </Link>
            <Link to="/about" className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition duration-150">
              About
            </Link>
            <Link to="/properties" className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition duration-150">
              Browse Properties
            </Link>
            <Link to="/contact" className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition duration-150">
              Contact
            </Link>
            <Button className="ml-4 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition duration-150">
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <span className="text-2xl">✕</span>
              ) : (
                <span className="text-2xl">☰</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 w-full text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 w-full text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/properties" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 w-full text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Browse Properties
          </Link>
          <Link 
            to="/contact" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 w-full text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <Button 
            className="mt-2 w-full flex justify-center bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;