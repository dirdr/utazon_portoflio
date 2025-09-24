import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocation } from 'wouter';
import { HomeState, HomeAction, HomeContextValue } from '../types/home';
import { useAppLoading } from './AppLoadingContext';

const initialState: HomeState = {
  isInitialLoad: false,
  showDiveInButton: false,
  showContent: false,
  videoStartTime: 0,
  isVideoPlaying: false,
  isPreloadComplete: false,
};

function homeReducer(state: HomeState, action: HomeAction): HomeState {
  switch (action.type) {
    case 'PRELOAD_COMPLETE':
      return {
        ...state,
        isPreloadComplete: true,
        showDiveInButton: state.isInitialLoad,
        showContent: !state.isInitialLoad,
      };
      
    case 'DIVE_IN_CLICKED':
      return {
        ...state,
        showDiveInButton: false,
        videoStartTime: 0,
      };
      
    case 'VIDEO_STARTED':
      return {
        ...state,
        isVideoPlaying: true,
      };
      
    case 'SHOW_CONTENT':
      return {
        ...state,
        showContent: true,
      };
      
    case 'RESET_FOR_SPA_NAVIGATION':
      return {
        ...state,
        isInitialLoad: false,
        showDiveInButton: false,
        showContent: true,
        videoStartTime: 8,
        isVideoPlaying: false,
        isPreloadComplete: true,
      };
      
    case 'SYNC_WITH_APP_LOADING':
      return {
        ...state,
        isInitialLoad: action.payload.isInitialLoad,
        showDiveInButton: action.payload.showDiveInButton,
        isPreloadComplete: action.payload.isPreloadComplete,
        showContent: action.payload.showContent,
        videoStartTime: action.payload.isInitialLoad ? 0 : 8,
      };
      
    default:
      return state;
  }
}

const HomeContext = createContext<HomeContextValue | null>(null);

export const useHome = (): HomeContextValue => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within HomeProvider');
  }
  return context;
};

interface HomeProviderProps {
  children: React.ReactNode;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(homeReducer, initialState);
  const [location] = useLocation();
  const { isFreshLoad, showDiveInButton, hideDiveInButton } = useAppLoading();
  
  const isHomePage = location === '/';
  
  useEffect(() => {
    dispatch({ 
      type: 'SYNC_WITH_APP_LOADING', 
      payload: {
        isInitialLoad: isFreshLoad,
        showDiveInButton: isHomePage ? showDiveInButton : false,
        isPreloadComplete: true,
        showContent: isHomePage ? (!isFreshLoad || (isFreshLoad && !showDiveInButton)) : false
      }
    });
  }, [isHomePage, isFreshLoad, showDiveInButton]);
  
  useEffect(() => {
    if (isHomePage && !isFreshLoad) {
      dispatch({ type: 'RESET_FOR_SPA_NAVIGATION' });
    }
  }, [isHomePage, isFreshLoad]);
  
  const shouldShowDiveIn = isHomePage && state.showDiveInButton && state.isPreloadComplete;

  const value: HomeContextValue = {
    state,
    dispatch,
    
    shouldShowDiveIn,
    shouldStartVideoAt: state.videoStartTime,
    shouldSkipAnimations: !state.isInitialLoad,
    
    hideDiveInButton,
  };
  
  return (
    <HomeContext.Provider value={value}>
      {children}
    </HomeContext.Provider>
  );
};