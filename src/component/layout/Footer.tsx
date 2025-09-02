import { useTranslation } from "react-i18next";
import { Container } from "./Container";
import { ROUTES } from "../../constants/routes";
import logo from "../../assets/images/logo.svg";
import { Link } from "wouter";
import { InstagramIcon } from "../common/InstagramIcon";
import { LinkedInIcon } from "../common/LinkedInIcon";
import { BehanceIcon } from "../common/BehanceIcon";
import { useTransitionContext } from "../../contexts/TransitionContext";
import { useCallback } from "react";

export const Footer = () => {
  const { t } = useTranslation();
  const { navigateWithTransition } = useTransitionContext();
  const currentYear = new Date().getFullYear();

  const handleLegalClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithTransition(ROUTES.LEGAL);
  }, [navigateWithTransition]);

  const handleProjectsClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithTransition(ROUTES.PROJECTS);
  }, [navigateWithTransition]);

  const handleAboutClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithTransition(ROUTES.ABOUT);
  }, [navigateWithTransition]);

  const handleContactClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithTransition(ROUTES.CONTACT);
  }, [navigateWithTransition]);

  return (
    <footer className="text-white">
      <Container>
        <div className="py-12 md:py-16 border-t border-white/10 font-nord">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div className="flex items-center gap-4">
              <a href="/" className="flex-shrink-0">
                <img src={logo} alt="Utazon Logo" className="h-10 w-auto" />
              </a>
              <div className="flex flex-col">
                <a href="/" className="text-lg mb-1">
                  {t("common.utazon")}
                </a>
                <a href="/" className="text-muted text-sm">
                  {t("common.antoine_vernez")}
                </a>
              </div>
            </div>
            <nav className="flex flex-col items-start md:items-start">
              <h4 className="text-muted text-base mb-3">Menu</h4>
              <Link
                href={ROUTES.PROJECTS}
                onClick={handleProjectsClick}
                className="text-white hover:text-white transition-colors duration-200 mb-2"
              >
                {t("nav.projects")}
              </Link>
              <Link
                href={ROUTES.ABOUT}
                onClick={handleAboutClick}
                className="text-white hover:text-white transition-colors duration-200 mb-2"
              >
                {t("nav.about")}
              </Link>
              <Link
                href={ROUTES.CONTACT}
                onClick={handleContactClick}
                className="text-white hover:text-white transition-colors duration-200"
              >
                {t("nav.contact")}
              </Link>
            </nav>

            <div className="flex flex-col items-start gap-3">
              <h4 className="text-muted text-base mb-0">Socials</h4>
              <a
                href="https://instagram.com/utazon"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white"
                aria-label="Instagram"
              >
                <InstagramIcon width={20} height={20} />
                <span className="text">Instagram</span>
              </a>

              <a
                href="https://www.linkedin.com/in/antoine-vernez-b542b8290/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white"
                aria-label="LinkedIn"
              >
                <LinkedInIcon width={19} height={19} />
                <span className="text">LinkedIn</span>
              </a>

              <a
                href="https://behance.net/utazon"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white"
                aria-label="Behance"
              >
                <BehanceIcon width={19} height={19} />
                <span className="text">Behance</span>
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <p className="text-white text-xs">
                  © {currentYear} Antoine Vernez. {t("footer.allRightsReserved")}
                </p>
                <p className="text-white text-xs">
                  Designed by{" "}
                  <a
                    href="https://www.linkedin.com/in/r%C3%A9mi-inn-485692200/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white transition-colors duration-200 underline"
                  >
                    Rémi Inn
                  </a>
                  {" "}and developed by{" "}
                  <a
                    href="https://github.com/dirdr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white transition-colors duration-200 underline"
                  >
                    Adrien Pelfresne
                  </a>
                </p>
              </div>

              <div className="flex items-center gap-6">
                <Link
                  href="/legal"
                  onClick={handleLegalClick}
                  className="text-white hover:text-white transition-colors duration-200 text-xs"
                >
                  {t("footer.legalNotice")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
