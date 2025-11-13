export default async function decorate(block) {
  // Check if blockquote already exists (from model-driven structure)
  let blockquote = block.querySelector('blockquote');
  
  if (!blockquote) {
    // Create blockquote if it doesn't exist
    blockquote = document.createElement('blockquote');
    
    // Get quotation and attribution from block children
    const [quotation, attribution] = [...block.children].map((c) => c.firstElementChild);
    
    // Handle quotation - find the actual content div
    if (quotation) {
      const quoteDiv = quotation.querySelector('[data-aue-prop="quotation"]') || quotation;
      quoteDiv.className = 'quote-quotation';
      blockquote.append(quoteDiv);
    }
    
    // Handle attribution - find the actual content div
    if (attribution) {
      const attrDiv = attribution.querySelector('[data-aue-prop="attribution"]') || attribution;
      attrDiv.className = 'quote-attribution';
      blockquote.append(attrDiv);
      
      // Convert em tags to cite tags
      const ems = attrDiv.querySelectorAll('em');
      ems.forEach((em) => {
        const cite = document.createElement('cite');
        cite.innerHTML = em.innerHTML;
        em.replaceWith(cite);
      });
    }
    
    block.innerHTML = '';
    block.append(blockquote);
  } else {
    // Blockquote already exists - ensure proper structure and classes
    let quotation = blockquote.querySelector('.quote-quotation');
    if (!quotation) {
      quotation = blockquote.querySelector('[data-aue-prop="quotation"]');
      if (quotation) {
        quotation.className = 'quote-quotation';
      }
    }
    
    let attribution = blockquote.querySelector('.quote-attribution');
    if (!attribution) {
      attribution = blockquote.querySelector('[data-aue-prop="attribution"]');
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