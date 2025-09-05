import LocomotiveScroll from 'locomotive-scroll';

interface ScrollPositionStore {
  currentPosition: number;
  preservedPosition: number;
  isTransitioning: boolean;
  locomotiveScrollInstance: LocomotiveScroll | null;
  setPosition: (position: number) => void;
  getPosition: () => number;
  setLocomotiveScroll: (instance: LocomotiveScroll | null) => void;
  scrollToTop: () => void;
  preservePosition: () => void;
  startTransition: () => void;
  endTransition: () => void;
}

// Global scroll position store that works outside React context
export const scrollPositionStore: ScrollPositionStore = {
  currentPosition: 0,
  preservedPosition: 0,
  isTransitioning: false,
  locomotiveScrollInstance: null,
  
  setPosition(position: number) {
    this.currentPosition = position;
  },
  
  getPosition() {
    return this.currentPosition;
  },
  
  setLocomotiveScroll(instance: LocomotiveScroll | null) {
    this.locomotiveScrollInstance = instance;
  },
  
  scrollToTop() {
    if (this.locomotiveScrollInstance) {
      // Use duration: 0 for instant scroll and force update
      this.locomotiveScrollInstance.scrollTo(0, { 
        disableLerp: true, 
        duration: 0 
      });
      // Force locomotive scroll to update after position change
      this.locomotiveScrollInstance.update();
      this.setPosition(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
      this.setPosition(0);
    }
  },
  
  preservePosition() {
    this.preservedPosition = this.currentPosition;
  },
  
  startTransition() {
    this.isTransitioning = true;
    this.preservePosition();
  },
  
  endTransition() {
    this.isTransitioning = false;
    this.preservedPosition = 0;
  }
};