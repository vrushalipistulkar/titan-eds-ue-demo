export default async function decorate(block) {
  // Static block - no dynamic decoration needed
  // All content is pre-rendered in the HTML
  
  // Product image sets for different dial colors
  const imageSets = {
    silver: {
      main: 'imgs/2656WM01_1.jpg',
      thumbnails: [
        'imgs/2656WM01_1.jpg',
        'imgs/2656WM01_2%20(1).jpg',
        'imgs/2656WM01_3%20(1).jpg',
        'imgs/2656WM01_4%20(1).jpg',
        'imgs/2656WM01_5%20(1).jpg',
        'imgs/2656WM01_6%20(1).jpg',
      ],
    },
    white: {
      main: 'imgs/2656BM01_1%20(1).jpg',
      thumbnails: [
        'imgs/2656BM01_1%20(1).jpg',
        'imgs/2656BM01_2%20(1).jpg',
        'imgs/2656BM01_3%20(1).jpg',
        'imgs/2656BM01_4%20(1).jpg',
        'imgs/2656BM01_5%20(1).jpg',
        'imgs/2656BM01_6%20(1).jpg',
      ],
    },
    blue: {
      main: 'imgs/2656YL01_1%20(1).jpg',
      thumbnails: [
        'imgs/2656YL01_1%20(1).jpg',
        'imgs/2656YL01_2%20(1).jpg',
        'imgs/2656YL01_3.jpg',
        'imgs/2656YL01_4.jpg',
        'imgs/2656YL01_5%20(1).jpg',
        'imgs/2656YL01_6%20(1).jpg',
      ],
    },
  };
  
  // Image gallery functionality
  const imageGallery = block.querySelector('.pdp-image-gallery');
  const thumbnails = block.querySelectorAll('.pdp-thumbnail');
  const mainImage = block.querySelector('.pdp-main-image img');
  
  if (imageGallery && thumbnails.length > 0 && mainImage) {
    thumbnails.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const newSrc = thumb.querySelector('img').src;
        mainImage.src = newSrc;
        
        // Update active thumbnail
        thumbnails.forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }
  
  // Function to change product images
  function changeProductImages(colorKey) {
    const imageSet = imageSets[colorKey];
    if (!imageSet) return;
    
    // Update main image
    if (mainImage) {
      mainImage.src = imageSet.main;
    }
    
    // Update thumbnails
    const thumbImgs = block.querySelectorAll('.pdp-thumbnail img');
    thumbImgs.forEach((img, index) => {
      if (imageSet.thumbnails[index]) {
        img.src = imageSet.thumbnails[index];
      }
    });
    
    // Reset active thumbnail to first one
    thumbnails.forEach((t, i) => {
      if (i === 0) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
  }
  
  // Dial Color options functionality
  const dialColorOptions = block.querySelectorAll('.pdp-option-values .pdp-option-value');
  dialColorOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const colorText = option.textContent.trim().toLowerCase();
      
      // Update selected state
      const parent = option.closest('.pdp-option');
      if (parent) {
        parent.querySelectorAll('.pdp-option-value').forEach((opt) => {
          opt.classList.remove('selected');
        });
        option.classList.add('selected');
      }
      
      // Change images based on color selection
      changeProductImages(colorText);
    });
  });
  
  // Quantity selector
  const decreaseBtn = block.querySelector('.quantity-decrease');
  const increaseBtn = block.querySelector('.quantity-increase');
  const quantityInput = block.querySelector('.quantity-input');
  
  if (decreaseBtn && increaseBtn && quantityInput) {
    decreaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value, 10);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
    
    increaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value, 10);
      quantityInput.value = currentValue + 1;
    });
  }
  
  // Add to cart button
  const addToCartBtn = block.querySelector('.pdp-add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      // eslint-disable-next-line no-alert
      alert('Product added to cart!');
    });
  }
}

