/**
 * Parallax Hero Controller
 * 
 * Hardware-accelerated parallax implementation using Intersection Observer
 * for optimal performance and cross-browser compatibility.
 * 
 * Features:
 * - GPU-accelerated transforms using translate3d()
 * - Intersection Observer for efficient viewport detection
 * - Throttled scroll events for 60fps performance
 * - Reduced motion support
 * - Mobile optimization
 * - Graceful fallback for older browsers
 */

interface ParallaxElement {
  container: HTMLElement;
  background: HTMLElement;
  isActive: boolean;
}

class ParallaxController {
  private elements: ParallaxElement[] = [];
  private observer: IntersectionObserver | null = null;
  private rafId: number | null = null;
  private lastScrollY: number = 0;
  private ticking: boolean = false;
  
  // Configuration
  private readonly parallaxIntensity = 0.5; // Multiplier for parallax effect
  private readonly mobileParallaxIntensity = 0.25; // Reduced intensity for mobile
  private readonly throttleDelay = 16; // ~60fps
  
  constructor() {
    this.init();
  }
  
  private init(): void {
    // Check for reduced motion preference
    if (this.shouldDisableParallax()) {
      return;
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  private shouldDisableParallax(): boolean {
    // Respect user's reduced motion preference
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  private setup(): void {
    this.findParallaxElements();
    this.initializeIntersectionObserver();
    this.attachEventListeners();
  }
  
  private findParallaxElements(): void {
    const containers = document.querySelectorAll('.parallax-hero');
    
    containers.forEach((container) => {
      const background = container.querySelector('.parallax-background') as HTMLElement;
      
      if (background) {
        this.elements.push({
          container: container as HTMLElement,
          background,
          isActive: false
        });
      }
    });
  }
  
  private initializeIntersectionObserver(): void {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without Intersection Observer
      this.enableAllParallax();
      return;
    }
    
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        root: null,
        rootMargin: '50px',
        threshold: [0, 0.1, 0.5, 1]
      }
    );
    
    this.elements.forEach((element) => {
      this.observer!.observe(element.container);
    });
  }
  
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      const element = this.elements.find(
        (el) => el.container === entry.target
      );
      
      if (element) {
        element.isActive = entry.isIntersecting;
        
        if (entry.isIntersecting) {
          this.updateParallax(element);
        }
      }
    });
  }
  
  private enableAllParallax(): void {
    // Fallback: enable parallax for all elements
    this.elements.forEach((element) => {
      element.isActive = true;
    });
    this.startScrollListener();
  }
  
  private attachEventListeners(): void {
    this.startScrollListener();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.throttle(() => this.handleResize(), 250);
    });
    
    // Handle reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addListener(() => {
      if (mediaQuery.matches) {
        this.destroy();
      }
    });
  }
  
  private startScrollListener(): void {
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
  }
  
  private onScroll(): void {
    this.lastScrollY = window.pageYOffset;
    
    if (!this.ticking) {
      this.requestUpdate();
    }
  }
  
  private requestUpdate(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    this.rafId = requestAnimationFrame(() => {
      this.updateActiveElements();
      this.ticking = false;
    });
    
    this.ticking = true;
  }
  
  private updateActiveElements(): void {
    this.elements.forEach((element) => {
      if (element.isActive) {
        this.updateParallax(element);
      }
    });
  }
  
  private updateParallax(element: ParallaxElement): void {
    const rect = element.container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how much of the element is visible
    const elementTop = rect.top;
    const elementHeight = rect.height;
    
    // Only apply parallax when element is in viewport
    if (elementTop < windowHeight && elementTop + elementHeight > 0) {
      // Calculate parallax offset based on scroll position
      const scrollProgress = (windowHeight - elementTop) / (windowHeight + elementHeight);
      const intensity = this.getParallaxIntensity();
      const parallaxOffset = (scrollProgress - 0.5) * 100 * intensity;
      
      // Apply hardware-accelerated transform
      this.applyTransform(element.background, parallaxOffset);
    }
  }
  
  private getParallaxIntensity(): number {
    // Reduce intensity on mobile for better performance
    return window.innerWidth <= 768 ? this.mobileParallaxIntensity : this.parallaxIntensity;
  }
  
  private applyTransform(element: HTMLElement, offset: number): void {
    // Use translate3d for hardware acceleration
    if (this.supportsTransform3d()) {
      element.style.transform = `translate3d(0, ${offset}px, 0)`;
    } else {
      // Fallback for very old browsers
      element.style.transform = `translateY(${offset}px)`;
    }
  }
  
  private supportsTransform3d(): boolean {
    const testElement = document.createElement('div');
    testElement.style.transform = 'translate3d(0, 0, 0)';
    return testElement.style.transform !== '';
  }
  
  private handleResize(): void {
    // Recalculate parallax on resize
    this.updateActiveElements();
  }
  
  private throttle(func: Function, limit: number): Function {
    let inThrottle: boolean;
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  public destroy(): void {
    // Clean up event listeners and observers
    if (this.observer) {
      this.observer.disconnect();
    }
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    // Reset transforms
    this.elements.forEach((element) => {
      element.background.style.transform = '';
    });
    
    // Remove event listeners
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.handleResize);
  }
}

// Initialize parallax controller
let parallaxController: ParallaxController | null = null;

// Auto-initialize
if (typeof window !== 'undefined') {
  // Initialize with more robust timing
  const initParallax = () => {
    parallaxController = new ParallaxController();
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
  } else {
    // DOM is already loaded
    setTimeout(initParallax, 100);
  }
}

// Export for manual control if needed
export { ParallaxController };
export default parallaxController;