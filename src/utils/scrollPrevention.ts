export class ScrollPrevention {
  private static originalStyles: {
    body: string;
    html: string;
  } | null = null;

  static prevent() {
    if (this.originalStyles) return; // Already prevented

    const body = document.body;
    const html = document.documentElement;

    console.log("🚫 SCROLL PREVENTION: Preventing scroll", {
      timestamp: Date.now(),
      currentScrollY: window.scrollY
    });

    // Store original styles
    this.originalStyles = {
      body: body.style.cssText,
      html: html.style.cssText,
    };

    // Prevent scrolling
    body.style.overflow = 'hidden';
    body.style.touchAction = 'none';
    body.style.height = '100dvh';
    html.style.overflow = 'hidden';
    html.style.touchAction = 'none';
    html.style.height = '100dvh';

    console.log("🚫 SCROLL PREVENTION: Applied, scrollY now:", window.scrollY);
  }

  static restore() {
    if (!this.originalStyles) return;

    console.log("✅ SCROLL PREVENTION: Restoring scroll", {
      timestamp: Date.now(),
      currentScrollY: window.scrollY
    });

    const body = document.body;
    const html = document.documentElement;

    // Restore original styles
    body.style.cssText = this.originalStyles.body;
    html.style.cssText = this.originalStyles.html;

    this.originalStyles = null;

    console.log("✅ SCROLL PREVENTION: Restored, scrollY now:", window.scrollY);
  }
}