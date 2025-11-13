export default async function decorate(block) {
  // Check if blockquote already exists (from model-driven structure)
  let blockquote = block.querySelector('blockquote');
  
  if (!blockquote) {
    // Create blockquote if it doesn't exist
    blockquote = document.createElement('blockquote');
    
    // Find quotation - search deeply for data-richtext-prop, data-aue-prop
    let quotation = block.querySelector('[data-richtext-prop="quotation"]') 
      || block.querySelector('[data-aue-prop="quotation"]')
      || block.querySelector('.quote-quotation');
    
    // If not found, check children recursively
    if (!quotation) {
      const firstChild = block.firstElementChild;
      if (firstChild) {
        // Check first child and its descendants
        quotation = firstChild.querySelector('[data-richtext-prop="quotation"]') 
          || firstChild.querySelector('[data-aue-prop="quotation"]')
          || (firstChild.hasAttribute('data-richtext-prop') && firstChild.getAttribute('data-richtext-prop') === 'quotation' ? firstChild : null)
          || (firstChild.hasAttribute('data-aue-prop') && firstChild.getAttribute('data-aue-prop') === 'quotation' ? firstChild : null);
        
        // If still not found, use first child as fallback
        if (!quotation && firstChild) {
          quotation = firstChild;
        }
      }
    }
    
    // Find attribution - search deeply for data-richtext-prop, data-aue-prop
    let attribution = block.querySelector('[data-richtext-prop="attribution"]')
      || block.querySelector('[data-aue-prop="attribution"]')
      || block.querySelector('.quote-attribution');
    
    // If not found, check children recursively
    if (!attribution) {
      const children = [...block.children];
      // Try to find in second child, or search all children
      for (let i = 1; i < children.length; i++) {
        const child = children[i];
        attribution = child.querySelector('[data-richtext-prop="attribution"]')
          || child.querySelector('[data-aue-prop="attribution"]')
          || (child.hasAttribute('data-richtext-prop') && child.getAttribute('data-richtext-prop') === 'attribution' ? child : null)
          || (child.hasAttribute('data-aue-prop') && child.getAttribute('data-aue-prop') === 'attribution' ? child : null);
        if (attribution) break;
      }
      
      // If still not found, use second child as fallback
      if (!attribution && children.length > 1) {
        attribution = children[1];
      }
    }
    
    // Handle quotation
    if (quotation) {
      // Create a wrapper div
      const quoteDiv = document.createElement('div');
      quoteDiv.className = 'quote-quotation';
      
      // Check if quotation has paragraph elements
      const existingParagraphs = quotation.querySelectorAll('p');
      if (existingParagraphs.length > 0) {
        // Move existing paragraphs (move, not clone, to preserve structure)
        existingParagraphs.forEach(p => quoteDiv.appendChild(p));
      } else {
        // No paragraphs found, check if there's text content
        const text = quotation.textContent?.trim() || quotation.innerText?.trim();
        if (text) {
          const p = document.createElement('p');
          p.textContent = text;
          quoteDiv.appendChild(p);
        } else {
          // Move all children if any
          while (quotation.firstChild) {
            quoteDiv.appendChild(quotation.firstChild);
          }
        }
      }
      
      blockquote.append(quoteDiv);
    }
    
    // Handle attribution
    if (attribution) {
      // Create a wrapper div
      const attrDiv = document.createElement('div');
      attrDiv.className = 'quote-attribution';
      
      // Check if attribution has paragraph elements
      const existingParagraphs = attribution.querySelectorAll('p');
      if (existingParagraphs.length > 0) {
        // Move existing paragraphs (move, not clone, to preserve structure)
        existingParagraphs.forEach(p => attrDiv.appendChild(p));
      } else {
        // No paragraphs found, check if there's text content
        const text = attribution.textContent?.trim() || attribution.innerText?.trim();
        if (text) {
          const p = document.createElement('p');
          p.textContent = text;
          attrDiv.appendChild(p);
        } else {
          // Move all children if any
          while (attribution.firstChild) {
            attrDiv.appendChild(attribution.firstChild);
          }
        }
      }
      
      // Convert em tags to cite tags
      const ems = attrDiv.querySelectorAll('em');
      ems.forEach((em) => {
        const cite = document.createElement('cite');
        cite.innerHTML = em.innerHTML;
        em.replaceWith(cite);
      });
      
      blockquote.append(attrDiv);
    }
    
    // Clear block and add blockquote
    // If block is inside a <p> tag, we need to move blockquote outside the paragraph
    const parent = block.parentElement;
    if (parent && parent.tagName === 'P') {
      // Keep the quote class on the block element, add blockquote inside
      block.innerHTML = '';
      block.append(blockquote);
      // Move the entire quote block (with blockquote) outside the paragraph
      parent.replaceWith(block);
    } else {
      // Normal case - clear block and add blockquote
      block.innerHTML = '';
      block.append(blockquote);
    }
  } else {
    // Blockquote already exists - ensure proper structure and classes
    let quotation = blockquote.querySelector('.quote-quotation');
    if (!quotation) {
      quotation = blockquote.querySelector('[data-richtext-prop="quotation"]')
        || blockquote.querySelector('[data-aue-prop="quotation"]');
      if (quotation) {
        quotation.className = 'quote-quotation';
      }
    }
    
    let attribution = blockquote.querySelector('.quote-attribution');
    if (!attribution) {
      attribution = blockquote.querySelector('[data-richtext-prop="attribution"]')
        || blockquote.querySelector('[data-aue-prop="attribution"]');
      if (attribution) {
        attribution.className = 'quote-attribution';
      }
    }
    
    // Convert em tags to cite tags in attribution
    if (attribution) {
      const ems = attribution.querySelectorAll('em');
      ems.forEach((em) => {
        const cite = document.createElement('cite');
        cite.innerHTML = em.innerHTML;
        em.replaceWith(cite);
      });
    }
  }
}