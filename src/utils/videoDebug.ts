const DEBUG_ENABLED = process.env.NODE_ENV === 'development';

export const debugVideo = (message: string, data?: unknown) => {
  if (DEBUG_ENABLED) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🎥 [VIDEO ${timestamp}] ${message}`, data || '');
  }
};

export const debugVideoError = (message: string, error?: unknown) => {
  if (DEBUG_ENABLED) {
    const timestamp = new Date().toLocaleTimeString();
    console.error(`❌ [VIDEO ${timestamp}] ${message}`, error || '');
  }
};

export const debugVideoSuccess = (message: string, data?: unknown) => {
  if (DEBUG_ENABLED) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`✅ [VIDEO ${timestamp}] ${message}`, data || '');
  }
};

// Mobile-specific debug helper
export const debugMobile = (message: string, data?: unknown) => {
  if (DEBUG_ENABLED) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`📱 [MOBILE ${timestamp}] ${message}`, data || '');
  }
};

// App loading debug helper
export const debugApp = (message: string, data?: unknown) => {
  if (DEBUG_ENABLED) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🚀 [APP ${timestamp}] ${message}`, data || '');
  }
};