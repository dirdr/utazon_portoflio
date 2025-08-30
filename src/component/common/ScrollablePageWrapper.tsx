import React, { ReactNode } from 'react';
import { LocomotiveScrollProvider } from '../../contexts/LocomotiveScrollContext';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { useLocation } from 'wouter';
import { getPageConfig } from '../../config/pageConfig';

interface ScrollablePageWrapperProps {
  children: ReactNode;
  className?: string;
}

export const ScrollablePageWrapper: React.FC<ScrollablePageWrapperProps> = ({
  children,
  className = '',
}) => {
  const [location] = useLocation();
  const pageConfig = getPageConfig(location);

  return (
    <LocomotiveScrollProvider
      options={{
        smooth: true,
        multiplier: 0.4,
        smoothMobile: true,
        getDirection: true,
        getSpeed: true,
        lerp: 0.08,
      }}
      className="h-full"
    >
      <div data-scroll-section className={`min-h-screen flex flex-col ${className}`}>
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        {pageConfig.showFooter && <Footer />}
      </div>
    </LocomotiveScrollProvider>
  );
};