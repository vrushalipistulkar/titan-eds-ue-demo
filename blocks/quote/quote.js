export default async function decorate(block) {
  // Check if blockquote already exists (from model-driven structure)
  let blockquote = block.querySelector('blockquote');
  
  if (!blockquote) {
    // Create blockquote if it doesn't exist
    blockquote = document.createElement('blockquote');
    
    // Find quotation - check for data-richtext-prop, data-aue-prop, or nested structure
    let quotation = block.querySelector('[data-richtext-prop="quotation"]') 
      || block.querySelector('[data-aue-prop="quotation"]')
      || block.querySelector('.quote-quotation');
    
    // If not found, check first child div
    if (!quotation) {
      const firstChild = block.firstElementChild;
      if (firstChild) {
        quotation = firstChild.querySelector('[data-richtext-prop="quotation"]') 
          || firstChild.querySelector('[data-aue-prop="quotation"]')
          || firstChild;
      }
    }
    
    // Find attribution - check for data-richtext-prop, data-aue-prop, or nested structure
    let attribution = block.querySelector('[data-richtext-prop="attribution"]')
      || block.querySelector('[data-aue-prop="attribution"]')
      || block.querySelector('.quote-attribution');
    
    // If not found, check second child div
    if (!attribution) {
      const children = [...block.children];
      if (children.length > 1) {
        const secondChild = children[1];
        attribution = secondChild.querySelector('[data-richtext-prop="attribution"]')
          || secondChild.querySelector('[data-aue-prop="attribution"]')
          || secondChild;
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
        // Move existing paragraphs
        existingParagraphs.forEach(p => quoteDiv.appendChild(p.cloneNode(true)));
      } else {
        // No paragraphs found, create one with the text content
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
        // Move existing paragraphs
        existingParagraphs.forEach(p => attrDiv.appendChild(p.cloneNode(true)));
      } else {
        // No paragraphs found, create one with the text content
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
    
    block.innerHTML = '';
    block.append(blockquote);
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