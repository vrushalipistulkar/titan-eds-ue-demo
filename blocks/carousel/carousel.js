import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import createSlider from '../../scripts/slider.js';


function setCarouselItems(list, number) {
  list?.style.setProperty('--items-per-view', number);
}

const VARIANT_CLASSES = ['single-slide-carousel', 'multislide-carousel'];

function extractVariantFromRow(row) {
  if (!row) return '';
  const directParagraph = row.querySelector(':scope > p');
  if (directParagraph) {
    const paragraphText = directParagraph.textContent.trim();
    if (VARIANT_CLASSES.includes(paragraphText)) {
      return paragraphText;
    }
  }
  const text = (row.textContent || '').trim();
  if (VARIANT_CLASSES.includes(text)) {
    return text;
  }
  return '';
}

export default function decorate(block) {
  let variantClass = '';

  const variantElement = block.querySelector('p[data-aue-prop="carouselVariant"]');
  if (variantElement) {
    variantClass = variantElement.textContent.trim();
    let variantRow = variantElement.closest(':scope > div');
    if (!variantRow || variantRow.parentElement !== block) {
      variantRow = variantElement.closest('div');
    }
    if (variantRow && variantRow.parentElement === block) {
      variantRow.remove();
    }
  }

  if (!variantClass) {
    const firstRow = block.firstElementChild;
    const detectedVariant = extractVariantFromRow(firstRow);
    if (detectedVariant) {
      variantClass = detectedVariant;
      block.removeChild(firstRow);
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
  rows.forEach((row) => {
    const rowVariant = extractVariantFromRow(row);
    if (rowVariant) {
      row.remove();
      if (!variantClass) {
        variantClass = rowVariant;
      }
      return;
    }

    if (i > 3) {
      const li = document.createElement('li');
      
      // Read card style from the third div (index 2)
      const styleDiv = row.children[2];
      const styleParagraph = styleDiv?.querySelector('p');
      const cardStyle = styleParagraph?.textContent?.trim() || 'default';
      if (cardStyle && cardStyle !== 'default') {
        li.className = cardStyle;
      }
      
      // Read CTA style from the fourth div (index 3)
      const ctaDiv = row.children[3];
      const ctaParagraph = ctaDiv?.querySelector('p');
      const ctaStyle = ctaParagraph?.textContent?.trim() || 'default';

      moveInstrumentation(row, li);
      while (row.firstElementChild) li.append(row.firstElementChild);
      
      // Process the li children to identify and style them correctly
      [...li.children].forEach((div, index) => {
        // First div (index 0) - Image
        if (index === 0) {
          div.className = 'cards-card-image';
        }
        // Second div (index 1) - Content with button
        else if (index === 1) {
          div.className = 'cards-card-body';
        }
        // Third div (index 2) - Card style configuration
        else if (index === 2) {
          div.className = 'cards-config';
          const p = div.querySelector('p');
          if (p) {
            p.style.display = 'none'; // Hide the configuration text
          }
        }
        // Fourth div (index 3) - CTA style configuration
        else if (index === 3) {
          div.className = 'cards-config';
          const p = div.querySelector('p');
          if (p) {
            p.style.display = 'none'; // Hide the configuration text
          }
        }
        // Any other divs
        else {
          div.className = 'cards-card-body';
        }
      });
      
      // Apply CTA styles to button containers
      const buttonContainers = li.querySelectorAll('p.button-container');
      buttonContainers.forEach((buttonContainer) => {
        // Remove any existing CTA classes
        buttonContainer.classList.remove('default', 'cta-button', 'cta-button-secondary', 'cta-button-dark', 'cta-default');
        // Add the correct CTA class
        buttonContainer.classList.add(ctaStyle);
      });
      
      slider.append(li);
    } else {
      if (row.firstElementChild?.firstElementChild) {
        leftContent.append(row.firstElementChild.firstElementChild);
      }
      if (row.firstElementChild) {
        leftContent.append(row.firstElementChild.firstElementChild || '');
      }
      leftContent.className = 'default-content-wrapper';
    }
    i += 1;
  });

  slider.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  if (slider.classList.contains('single-slide-carousel')) {
    setCarouselItems(slider, 1);
  } else if (slider.classList.contains('multislide-carousel')) {
    setCarouselItems(slider, 5);
  } else {
    setCarouselItems(slider, 2);
  }

  block.textContent = '';
  block.parentNode.parentNode.prepend(leftContent);
  block.append(slider);
  createSlider(block);
}
