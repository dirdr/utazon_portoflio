import { Button } from "../common/Button";
import logo from "../../assets/images/logo.svg";
import { useState } from "react";
import { NAVIGATION_ITEMS, ROUTES } from "../../constants/routes";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useVideo } from "../../contexts/video";
import { Container } from "./Container";
import { NavLink } from "./NavLink";
import { useAutoCloseMobileMenu } from "../../hooks/useAutoCloseMobileMenu";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { currentPage } = useVideo();

  const isHomePage = currentPage === ROUTES.HOME;
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const menuRef = useAutoCloseMobileMenu({
    isOpen: isMenuOpen,
    onClose: closeMenu,
  });

  const WrapperContent = () => (
    <>
      <div className="flex items-center justify-between h-16">
        <div className="flex flex-col items-start">
          <a href="/" className="text font-nord">
            UTAZON
          </a>
          <a href="/" className="font-nord text-muted text-sm">
            ANTOINE VERNEZ
          </a>
        </div>

        {!isHomePage && (
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <a href="/">
              <img src={logo} alt="Utazon Logo" className="h-10 w-auto" />
            </a>
          </div>
        )}

        <nav
          className="hidden md:flex lg:flex items-center space-x-6 lg:space-x-12"
          role="navigation"
          aria-label="Main navigation"
        >
          {NAVIGATION_ITEMS.map(({ label, href }) => (
            <NavLink key={href} href={href} label={label} />
          ))}
          <Button glint={true} href={ROUTES.CONTACT} className="text-base">
            {t("nav.contact")}
          </Button>
          <LanguageSwitcher />
        </nav>

        <button
          onClick={toggleMenu}
          className="md:hidden text-foreground hover:text-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          <span className="sr-only">
            {isMenuOpen ? "Close menu" : "Open menu"}
          </span>
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

      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "transform translate-y-0 opacity-100 mt-4 pb-4 border-t border-muted/20"
            : "transform -translate-y-4 opacity-0 max-h-0"
        }`}
      >
        <nav
          className="flex flex-col space-y-4 pt-4"
          role="navigation"
          aria-label="Mobile navigation"
        >
          {NAVIGATION_ITEMS.map(({ label, href }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              onClick={closeMenu}
              className="text-center py-2"
            />
          ))}

          <div className="flex justify-center pt-4">
            <Button
              className="text-base"
              href={ROUTES.CONTACT}
              onClick={closeMenu}
            >
              {t("nav.contact")}
            </Button>
          </div>

          <div className="flex justify-center pt-2">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </>
  );

  return (
    <nav
      className={`w-full z-50 ${isHomePage ? "absolute top-0 left-0" : ""}`}
      ref={menuRef}
    >
      {isHomePage ? (
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-4 sm:py-8 md:py-12">
          <WrapperContent />
        </div>
      ) : (
        <Container className="py-4 sm:py-12">
          <WrapperContent />
        </Container>
      )}
    </nav>
  );
};
