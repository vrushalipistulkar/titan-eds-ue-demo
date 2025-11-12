import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import createSlider from '../../scripts/slider.js';


function setCarouselItems(list, number) {
  list?.style.setProperty('--items-per-view', number);
}

const VARIANT_CLASSES = ['single-slide-carousel', 'multislide-carousel'];

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
  rows.forEach((row) => {
    const rowVariant = detectVariantText(row);
    if (rowVariant) {
      if (!variantClass) {
        variantClass = rowVariant;
        slider.classList.add(rowVariant);
      }
      row.remove();
      return;
    }

    const columns = row.querySelectorAll(':scope > div');
    const isCardRow = columns.length >= 4;

    if (isCardRow) {
      const li = document.createElement('li');

      const styleDiv = columns[2];
      const styleParagraph = styleDiv?.querySelector('p');
      const cardStyle = styleParagraph?.textContent?.trim() || 'default';
      if (cardStyle && cardStyle !== 'default') {
        li.className = cardStyle;
      }

      const ctaDiv = columns[3];
      const ctaParagraph = ctaDiv?.querySelector('p');
      const ctaStyle = ctaParagraph?.textContent?.trim() || 'default';

      moveInstrumentation(row, li);
      while (row.firstElementChild) {
        li.append(row.firstElementChild);
      }

      li.querySelectorAll('.cards-config').forEach((configCol) => {
        configCol.remove();
      });

      const buttonContainers = li.querySelectorAll('p.button-container');
      buttonContainers.forEach((buttonContainer) => {
        buttonContainer.classList.remove('default', 'cta-button', 'cta-button-secondary', 'cta-button-dark', 'cta-default');
        buttonContainer.classList.add(ctaStyle);
      });

      slider.append(li);
      row.remove();
    } else {
      moveInstrumentation(row, leftContent);
      while (row.firstElementChild) leftContent.append(row.firstElementChild);
      leftContent.className = 'default-content-wrapper';
      row.remove();
    }
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
