/*
import { patternDecorate } from '../../scripts/blockTemplate.js';

export default async function decorate(block) {
  patternDecorate(block);
}
*/

import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
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
    
    // Check for mobile image in column 4 (5th column)
    const mobileImageDiv = row.children[4];
    const mobileImageElement = mobileImageDiv?.querySelector('picture, img');
    
    // Store mobile image data if it exists
    if (mobileImageElement) {
      const mobileImg = mobileImageElement.tagName === 'IMG' ? mobileImageElement : mobileImageElement.querySelector('img');
      if (mobileImg && mobileImg.src) {
        // Add a data attribute to the desktop image div to indicate mobile image exists
        row.children[0]?.setAttribute('data-mobile-image-src', mobileImg.src);
        row.children[0]?.setAttribute('data-mobile-image-alt', mobileImg.alt || '');
      }
    }
    
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
        div.style.display = 'none'; // Hide the configuration
      }
      // Fourth div (index 3) - CTA style configuration
      else if (index === 3) {
        div.className = 'cards-config';
        div.style.display = 'none'; // Hide the configuration
      }
      // Fifth div (index 4) - Mobile image configuration
      else if (index === 4) {
        div.className = 'cards-config';
        div.style.display = 'none'; // Hide the mobile image source
      }
      // Any other divs (should not happen in normal cases)
      else {
        div.className = 'cards-card-body';
      }
    });
    
    // Apply CTA styles to button containers
    const buttonContainers = li.querySelectorAll('p.button-container');
    buttonContainers.forEach(buttonContainer => {
      // Remove any existing CTA classes
      buttonContainer.classList.remove('default', 'cta-button', 'cta-button-secondary', 'cta-button-dark', 'cta-default');
      // Add the correct CTA class
      buttonContainer.classList.add(ctaStyle);
    });
    
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const imageContainer = img.closest('[data-mobile-image-src]');
    const hasMobileImage = imageContainer && imageContainer.hasAttribute('data-mobile-image-src');
    
    if (hasMobileImage) {
      // Get mobile image data
      const mobileImageSrc = imageContainer.getAttribute('data-mobile-image-src');
      const mobileImageAlt = imageContainer.getAttribute('data-mobile-image-alt');
      
      // Create optimized pictures for both desktop and mobile
      const desktopPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const mobilePic = createOptimizedPicture(mobileImageSrc, mobileImageAlt, false, [{ width: '750' }]);
      
      // Create a new picture element with responsive sources
      const responsivePicture = document.createElement('picture');
      
      // Add mobile source (for screens < 768px)
      const mobileSource = mobilePic.querySelector('source');
      if (mobileSource) {
        mobileSource.setAttribute('media', '(max-width: 767px)');
        responsivePicture.appendChild(mobileSource);
      }
      
      // Add desktop sources (for screens >= 768px)
      const desktopSources = desktopPic.querySelectorAll('source');
      desktopSources.forEach((source) => {
        const clonedSource = source.cloneNode(true);
        const existingMedia = clonedSource.getAttribute('media');
        if (existingMedia) {
          clonedSource.setAttribute('media', `(min-width: 768px) and ${existingMedia}`);
        } else {
          clonedSource.setAttribute('media', '(min-width: 768px)');
        }
        responsivePicture.appendChild(clonedSource);
      });
      
      // Add the default img tag (fallback)
      const defaultImg = desktopPic.querySelector('img');
      if (defaultImg) {
        moveInstrumentation(img, defaultImg);
        responsivePicture.appendChild(defaultImg);
      }
      
      // Replace the original picture
      img.closest('picture').replaceWith(responsivePicture);
      
      // Clean up data attributes
      imageContainer.removeAttribute('data-mobile-image-src');
      imageContainer.removeAttribute('data-mobile-image-alt');
    } else {
      // No mobile image, use standard optimization
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
 
  block.textContent = '';
  block.append(ul);
}
