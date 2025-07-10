import { Button } from "../common/Button";
import logo from "../../assets/images/logo.svg";
import { useState } from "react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="absolute top-0 left-0 w-full z-50">
      <div className="mx-auto px-4 sm:px-16 py-4 sm:py-12">
        <div className="flex items-center justify-between h-16">
          <div className="flex flex-col items-start">
            <a href="/" className="text-lg font-nord">
              UTAZON
            </a>
            <a href="/" className="font-nord text-muted text-sm">
              ANTOINE VERNEZ
            </a>
          </div>

          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <a href="/">
              <img src={logo} alt="Utazon Logo" className="h-12 w-auto" />
            </a>
          </div>

          <div className="hidden lg:flex items-center space-x-16">
            <a href="/projets" className="hover:text-muted font-nord">
              PROJETS
            </a>
            <a href="/about" className="hover:text-muted font-nord">
              À PROPOS
            </a>
            <Button href="/contact">ME CONTACTER</Button>
          </div>

          <button
            onClick={toggleMenu}
            className="lg:hidden text-foreground hover:text-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          id="mobile-menu"
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100 mt-4 pb-4 border-t border-muted/20"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col space-y-4 pt-4">
            <nav className="flex flex-col space-y-4" role="navigation">
              <a
                href="/projets"
                className="hover:text-muted font-nord text-center py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                PROJETS
              </a>
              <a
                href="/about"
                className="hover:text-muted font-nord text-center py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                À PROPOS
              </a>
              <div className="flex justify-center pt-2">
                <Button href="/contact" onClick={() => setIsMenuOpen(false)}>
                  ME CONTACTER
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
};
