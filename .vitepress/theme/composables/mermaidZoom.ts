// Mermaid diagram zoom functionality
// This script makes mermaid diagrams clickable and shows them in a lightbox

export function setupMermaidZoom() {
  if (typeof window === 'undefined') return;

  // Function to create lightbox
  function createLightbox(diagramElement: Element) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'mermaid-lightbox';

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mermaid-lightbox-close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close');

    // Clone the diagram content
    const content = document.createElement('div');
    content.className = 'mermaid-lightbox-content';

    // Find SVG element - try direct query first
    let svg = diagramElement.querySelector('svg');

    // If no direct SVG, try parsing innerHTML
    if (!svg && diagramElement.innerHTML.includes('<svg')) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = diagramElement.innerHTML;
      svg = tempDiv.querySelector('svg');
    }

    if (svg) {
      // Clone the SVG deeply
      const svgClone = svg.cloneNode(true) as SVGElement;

      // Get or compute viewBox
      let viewBox = svg.getAttribute('viewBox');

      if (!viewBox) {
        // Try to compute viewBox from dimensions
        try {
          const bbox = svg.getBBox();
          viewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
        } catch (e) {
          // Fallback: use width and height attributes
          const width = svg.getAttribute('width') || '800';
          const height = svg.getAttribute('height') || '600';
          viewBox = `0 0 ${width} ${height}`;
        }
      }

      // Apply viewBox and make SVG responsive
      if (viewBox) {
        svgClone.setAttribute('viewBox', viewBox);
      }

      // Remove fixed dimensions
      svgClone.removeAttribute('width');
      svgClone.removeAttribute('height');

      // Set styles for proper display
      svgClone.style.width = '100%';
      svgClone.style.height = 'auto';
      svgClone.style.display = 'block';
      svgClone.style.margin = 'auto';
      svgClone.style.maxWidth = 'none';
      svgClone.style.maxHeight = '75vh';

      content.appendChild(svgClone);
    } else {
      // Fallback: use innerHTML
      content.innerHTML = diagramElement.innerHTML;
      const contentSvg = content.querySelector('svg');
      if (contentSvg) {
        (contentSvg as SVGElement).style.width = '100%';
        (contentSvg as SVGElement).style.height = 'auto';
      }
    }

    lightbox.appendChild(closeBtn);
    lightbox.appendChild(content);
    document.body.appendChild(lightbox);

    // SVG zoom functionality
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const svgElement = content.querySelector('svg') as SVGElement;

    if (svgElement) {
      // Add smooth transition
      svgElement.style.transition = 'transform 0.1s ease-out';
      svgElement.style.cursor = 'grab';

      // Update SVG transform
      const updateTransform = () => {
        svgElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      };

      // Mouse wheel zoom
      content.addEventListener('wheel', (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = scale * delta;

        // Limit zoom range: 0.5x to 5x
        if (newScale >= 0.5 && newScale <= 5) {
          // Get mouse position relative to content
          const rect = content.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          // Calculate zoom center point
          const beforeZoomX = (mouseX - translateX) / scale;
          const beforeZoomY = (mouseY - translateY) / scale;

          scale = newScale;

          // Adjust translation to keep the zoom centered on mouse position
          translateX = mouseX - beforeZoomX * scale;
          translateY = mouseY - beforeZoomY * scale;

          updateTransform();
        }
      }, { passive: false });

      // Mouse drag to pan
      svgElement.addEventListener('mousedown', (e: MouseEvent) => {
        if (e.button === 0) { // Left mouse button
          isDragging = true;
          startX = e.clientX - translateX;
          startY = e.clientY - translateY;
          svgElement.style.cursor = 'grabbing';
          svgElement.style.transition = 'none';
          e.preventDefault();
        }
      });

      document.addEventListener('mousemove', (e: MouseEvent) => {
        if (isDragging) {
          translateX = e.clientX - startX;
          translateY = e.clientY - startY;
          updateTransform();
        }
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          svgElement.style.cursor = 'grab';
          svgElement.style.transition = 'transform 0.1s ease-out';
        }
      });

      // Double-click to reset zoom
      svgElement.addEventListener('dblclick', (e: MouseEvent) => {
        e.stopPropagation();
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
      });
    }

    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';

    // Function to close lightbox
    function closeLightbox() {
      lightbox.style.animation = 'fadeOut 0.2s ease';
      setTimeout(() => {
        lightbox.remove();
        document.body.style.overflow = '';
      }, 200);
    }

    // Close on clicking background or close button
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on ESC key
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // Prevent closing when clicking on the diagram content
    content.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Function to attach click handlers to mermaid diagrams
  function attachHandlers() {
    const mermaidDiagrams = document.querySelectorAll('.mermaid');

    mermaidDiagrams.forEach((diagram) => {
      const diagramEl = diagram as HTMLElement;

      // Skip if already has handler
      if (diagramEl.dataset.zoomEnabled) return;

      // Mark as having zoom enabled
      diagramEl.dataset.zoomEnabled = 'true';

      // Add click handler
      diagramEl.addEventListener('click', (e) => {
        e.preventDefault();
        createLightbox(diagram);
      });

      // Add keyboard accessibility
      diagramEl.setAttribute('tabindex', '0');
      diagramEl.setAttribute('role', 'button');
      diagramEl.setAttribute('aria-label', 'Click to enlarge diagram');

      diagramEl.addEventListener('keydown', (e) => {
        const keyEvent = e as KeyboardEvent;
        if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
          keyEvent.preventDefault();
          createLightbox(diagram);
        }
      });
    });
  }

  // Initial setup with delay to ensure mermaid is rendered
  setTimeout(attachHandlers, 1000);

  // Re-attach handlers when content changes (for SPA navigation)
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      let shouldReattach = false;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const el = node as Element;
            if (el.classList?.contains('mermaid') ||
                el.querySelector?.('.mermaid')) {
              shouldReattach = true;
            }
          }
        });
      });

      if (shouldReattach) {
        // Delay to ensure mermaid has finished rendering
        setTimeout(attachHandlers, 500);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Re-attach on route change (VitePress specific)
  if (typeof window !== 'undefined') {
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args: any[]) {
      originalPushState.apply(this, args as [any, string, string?]);
      setTimeout(attachHandlers, 300);
    };
  }
}

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMermaidZoom);
  } else {
    setupMermaidZoom();
  }
}

