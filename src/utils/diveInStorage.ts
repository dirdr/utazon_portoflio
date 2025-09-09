const PAGE_LOAD_KEY = "page_load_id";

const getCurrentPageLoadId = (): string => {
  try {
    let pageLoadId = sessionStorage.getItem(PAGE_LOAD_KEY);
    if (!pageLoadId) {
      pageLoadId = Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem(PAGE_LOAD_KEY, pageLoadId);
    }
    return pageLoadId;
  } catch {
    return "fallback";
  }
};

let diveInPageLoadId: string | null = null;

export const isDiveInCompleted = (): boolean => {
  try {
    const currentPageLoadId = getCurrentPageLoadId();

    if (!diveInPageLoadId || diveInPageLoadId !== currentPageLoadId) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export const markDiveInCompleted = (): void => {
  try {
    const currentPageLoadId = getCurrentPageLoadId();
    diveInPageLoadId = currentPageLoadId;
  } catch {}
};

