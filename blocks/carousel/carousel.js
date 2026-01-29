import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import createSlider from '../../scripts/slider.js';


function setCarouselItems(list, number) {
  list?.style.setProperty('--items-per-view', number);
}

const VARIANT_CLASSES = ['single-slide-carousel', 'multislide-carousel'];

function setupSingleSlideNavigation(block, slider) {
  const slides = Array.from(slider.children);
  if (!slides.length) return;

  let activeIndex = slides.findIndex((slide) => slide.classList.contains('active'));
  if (activeIndex < 0) activeIndex = 0;

  const applyState = () => {
    slides.forEach((slide, idx) => {
      if (idx === activeIndex) {
        slide.classList.add('active');
        slide.classList.remove('opacity');
      } else {
        slide.classList.remove('active');
        slide.classList.add('opacity');
      }
    });
  };

  applyState();

  const nextBtn = block.querySelector('.button.next');
  const prevBtn = block.querySelector('.button.prev');

  // Replace arrow icons with custom carousel navigation arrow
  if (nextBtn || prevBtn) {
    const arrowIconPath = `${window.hlx?.codeBasePath || ''}/icons/caoruseNaviagationArrow.svg`;
    
    // Update next button icon
    if (nextBtn) {
      const nextIcon = nextBtn.querySelector('img');
      if (nextIcon) {
        nextIcon.src = arrowIconPath;
        nextIcon.dataset.iconName = 'caoruseNaviagationArrow';
        nextIcon.style.transform = 'scaleX(-1)'; // Mirror the arrow
      }
    }
    
    // Update prev button icon (mirrored)
    if (prevBtn) {
      const prevIcon = prevBtn.querySelector('img');
      if (prevIcon) {
        prevIcon.src = arrowIconPath;
        prevIcon.dataset.iconName = 'caoruseNaviagationArrow';
        
      }
    }
  }

  const move = (delta) => {
    activeIndex = (activeIndex + delta + slides.length) % slides.length;
    applyState();
  };

  const handleClick = (delta) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    move(delta);
    // Reset auto-play timer on manual navigation
    resetAutoPlay();
  };

  nextBtn?.addEventListener('click', handleClick(1), true);
  prevBtn?.addEventListener('click', handleClick(-1), true);

  // Auto-play functionality - transition to next slide every 3 seconds
  let autoPlayInterval;
  
  const startAutoPlay = () => {
    autoPlayInterval = setInterval(() => {
      move(1); // Move to next slide
    }, 3000); // 3 seconds
  };

  const stopAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  };

  const resetAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
  };

  // Pause auto-play on hover
  block.addEventListener('mouseenter', stopAutoPlay);
  block.addEventListener('mouseleave', startAutoPlay);

  // Start auto-play
  startAutoPlay();

  // Clean up on block removal
  const observer = new MutationObserver((mutations) => {
    if (!document.body.contains(block)) {
      stopAutoPlay();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function detectVariantText(root) {
  if (!root) return '';
  const paragraphs = root.querySelectorAll('p');
  for (const p of paragraphs) {
    const text = p.textContent.trim();
    if (VARIANT_CLASSES.includes(text)) {
      return text;
    }
  }
  const text = root.textContent.trim();
  if (VARIANT_CLASSES.includes(text)) {
    return text;
  }
  return '';
}

function removeVariantRow(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return '';
  const firstRowVariant = detectVariantText(firstRow);
  if (firstRowVariant) {
    block.removeChild(firstRow);
    return firstRowVariant;
  }
  return '';
}

export default function decorate(block) {
  let variantClass = '';

  // Check the sibling wrapper first (author markup)
  const siblingWrapper = block.previousElementSibling;
  if (siblingWrapper && siblingWrapper.classList.contains('default-content-wrapper')) {
    const variantParagraph = [...siblingWrapper.querySelectorAll('p')]
      .find((p) => VARIANT_CLASSES.includes(p.textContent.trim()));
    if (variantParagraph) {
      variantClass = variantParagraph.textContent.trim();
      siblingWrapper.removeChild(variantParagraph);
      if (!siblingWrapper.textContent.trim()) {
        siblingWrapper.remove();
      }
    }
  }

  // Fallback inside block rows (publish markup)
  if (!variantClass) {
    variantClass = removeVariantRow(block);
  }

  // If still not found, inspect placeholder inside block
  if (!variantClass) {
    const variantElement = block.querySelector('p[data-aue-prop="carouselVariant"]');
    if (variantElement) {
      variantClass = variantElement.textContent.trim();
      const variantRow = variantElement.closest(':scope > div') || variantElement.closest('div');
      if (variantRow && variantRow.parentElement === block) {
        variantRow.remove();
      } else {
        variantElement.remove();
      }
    }
  }

  const isSingleSlide = block.classList.contains('single-slide-carousel');
  const isMultiSlide = block.classList.contains('multislide-carousel');

  let i = 0;
  const slider = document.createElement('ul');
  if (VARIANT_CLASSES.includes(variantClass)) {
    slider.classList.add(variantClass);
  } else if (isSingleSlide) {
    slider.classList.add('single-slide-carousel');
  } else if (isMultiSlide) {
    slider.classList.add('multislide-carousel');
  }
  const leftContent = document.createElement('div');
  const rows = [...block.children];
  rows.forEach((row, index) => {
    const rowVariant = detectVariantText(row);
    if (rowVariant) {
      if (!variantClass) {
        variantClass = rowVariant;
        slider.classList.add(rowVariant);
      }
      row.remove();
      return;
    }

    const columns = Array.from(row.children);
    const firstColumnHasMedia = columns[0]?.querySelector('picture, img, video');
    const isSlideRow = columns.length >= 4 && firstColumnHasMedia;

    if (isSlideRow) {
      const li = document.createElement('li');

      const configColumns = columns.slice(2);
      const styleParagraph = configColumns[0]?.querySelector('p');
      const cardStyle = styleParagraph?.textContent?.trim() || 'default';
      if (cardStyle && cardStyle !== 'default') {
        li.classList.add(cardStyle);
      }

      const ctaParagraph = configColumns[1]?.querySelector('p');
      const ctaStyle = ctaParagraph?.textContent?.trim() || 'default';

      moveInstrumentation(row, li);
      columns.slice(0, 2).forEach((column) => {
        li.append(column);
      });

      const buttonContainers = li.querySelectorAll('p.button-container');
      buttonContainers.forEach((buttonContainer) => {
        buttonContainer.classList.remove('default', 'cta-button', 'cta-button-secondary', 'cta-button-dark', 'cta-default');
        buttonContainer.classList.add(ctaStyle);
      });

      if (index === 0) {
        li.classList.add('active');
      }

      slider.append(li);
      row.remove();
    } else {
      // Skip rows that contain images - they should not be in leftContent
      // This prevents images from appearing outside/above the carousel
      const hasImage = row.querySelector('img') || row.querySelector('picture');
      if (!hasImage) {
        moveInstrumentation(row, leftContent);
        while (row.firstElementChild) leftContent.append(row.firstElementChild);
        leftContent.className = 'default-content-wrapper';
      }
      row.remove();
    }
  });

  slider.querySelectorAll('picture > img').forEach((img, index) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { media: '(min-width: 1024px)', width: '2000' },
      { media: '(min-width: 768px)', width: '1400' },
      { width: '1000' }
    ]);
    
    // Optimize LCP: First image should be eagerly loaded with high priority
    const optimizedImg = optimizedPic.querySelector('img');
    if (index === 0) {
      optimizedImg.setAttribute('loading', 'eager');
      optimizedImg.setAttribute('fetchpriority', 'high');
    }
    
    moveInstrumentation(img, optimizedImg);
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Accessibility: preserve visual style but expose proper heading level to AT
  // Use aria-level so we don't change font sizes. Default to level 3, or infer from data-heading-level on the block.
  const base = parseInt(block?.dataset?.headingLevel, 10);
  const ariaLevel = Number.isFinite(base) ? Math.min(Math.max(base, 1) + 1, 6) : 3;
  slider.querySelectorAll('h4,h5,h6').forEach((node) => {
    node.setAttribute('role', 'heading');
    node.setAttribute('aria-level', String(ariaLevel));
  });

  if (slider.classList.contains('single-slide-carousel')) {
    setCarouselItems(slider, 1);
    if (slider.classList.contains('single-slide-carousel')) {
      block.classList.add('single-slide-carousel-wrapper');
    }
  } else if (slider.classList.contains('multislide-carousel')) {
    setCarouselItems(slider, 5);
  } else {
    setCarouselItems(slider, 3);
  }

  block.textContent = '';
  block.parentNode.parentNode.prepend(leftContent);
  block.append(slider);
  createSlider(block);

  if (slider.classList.contains('single-slide-carousel')) {
    block.classList.add('single-slide-carousel-wrapper');
    setupSingleSlideNavigation(block, slider);
  }
}
