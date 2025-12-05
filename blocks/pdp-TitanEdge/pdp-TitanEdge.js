export default async function decorate(block) {
  // Get the base path for images (relative to the block)
  const basePath = new URL('.', import.meta.url).pathname;
  const imgPath = `${basePath}imgs`;
  
  // Check if block is empty (when added in UE)
  if (!block.querySelector('.pdp-container')) {
    // Create the default HTML structure
    block.innerHTML = `
      <div class="pdp-container">
        <div class="product-wrapper">
          <div class="pdp-images">
            <div class="pdp-image-gallery">
              <div class="pdp-thumbnail active">
                <img src="${imgPath}/2777KD01_1 (1).jpg" alt="Product Image 1">
              </div>
              <div class="pdp-thumbnail">
                <img src="${imgPath}/2777KD01_2 (1).jpg" alt="Product Image 2">
              </div>
              <div class="pdp-thumbnail">
                <img src="${imgPath}/2777KD01_3 (1).jpg" alt="Product Image 3">
              </div>
              <div class="pdp-thumbnail">
                <img src="${imgPath}/2777KD01_4 (1).jpg" alt="Product Image 4">
              </div>
              <div class="pdp-thumbnail">
                <img src="${imgPath}/2777KD01_5 (1).jpg" alt="Product Image 5">
              </div>
              <div class="pdp-thumbnail">
                <img src="${imgPath}/2777KD01_6 (1).jpg" alt="Product Image 6">
              </div>
            </div>
            <div class="pdp-main-image">
              <img src="${imgPath}/2777KD01_1 (1).jpg" alt="Product Main Image">
            </div>
          </div>
          <div class="product-detail">
            <div class="pdp-brand">Titan Edge</div>
            <h1 class="pdp-title">Titan Edge Ceramic Slim Watch - Ultra-Thin Design with Premium Finish</h1>
            <div class="pdp-sku">SKU: EDGE001</div>
            
            <div class="pdp-rating">
              <span class="pdp-stars">★★★★★</span>
              <span class="pdp-rating-count">(342 reviews)</span>
            </div>

            <div class="pdp-price">
              <span class="pdp-current-price">₹15,995</span>
              <span class="pdp-original-price">₹19,995</span>
              <span class="pdp-discount">20% OFF</span>
            </div>

            <div class="pdp-description">
              <p>Experience ultra-slim elegance with the Titan Edge ceramic watch. Featuring cutting-edge design and premium materials, this watch is perfect for those who appreciate minimalist sophistication and contemporary style.</p>
            </div>

            <div class="pdp-options">
              <div class="pdp-option">
                <label class="pdp-option-label">Dial Color</label>
                <div class="pdp-option-values">
                  <div class="pdp-option-value selected">Black</div>
                  <div class="pdp-option-value">Silver</div>
                  <div class="pdp-option-value">Blue</div>
                </div>
              </div>

              <div class="pdp-option">
                <label class="pdp-option-label">Strap Material</label>
                <div class="pdp-option-values">
                  <div class="pdp-option-value selected">Ceramic</div>
                  <div class="pdp-option-value">Leather</div>
                  <div class="pdp-option-value">Steel</div>
                </div>
              </div>
            </div>

            <div class="pdp-quantity">
              <span class="pdp-quantity-label">Quantity</span>
              <div class="pdp-quantity-selector">
                <button class="quantity-decrease" aria-label="Decrease quantity">−</button>
                <input type="number" class="quantity-input" value="1" min="1" readonly>
                <button class="quantity-increase" aria-label="Increase quantity">+</button>
              </div>
            </div>

            <div class="pdp-actions">
              <button class="pdp-add-to-cart">Add to Cart</button>
              <button class="pdp-buy-now">Buy Now</button>
            </div>

            <div class="pdp-features">
              <h3 class="pdp-features-title">Key Features</h3>
              <ul class="pdp-features-list">
                <li>Ultra-slim ceramic case - only 5mm thin</li>
                <li>Scratch-resistant sapphire crystal</li>
                <li>Premium Japanese quartz movement</li>
                <li>Water resistant up to 50 meters</li>
                <li>2 years international warranty</li>
                <li>Hypoallergenic and skin-friendly materials</li>
              </ul>
            </div>

            <div class="pdp-specifications">
              <h3 class="pdp-specifications-title">Specifications</h3>
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Case Material:</div>
                <div class="pdp-spec-value">Ceramic</div>
              </div>
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Strap Material:</div>
                <div class="pdp-spec-value">Ceramic</div>
              </div>
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Dial Color:</div>
                <div class="pdp-spec-value">Black</div>
              </div>
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Case Diameter:</div>
                <div class="pdp-spec-value">38mm</div>
              </div>
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Case Thickness:</div>
                <div class="pdp-spec-value">5mm</div>
              </div>
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Movement Type:</div>
                <div class="pdp-spec-value">Japanese Quartz</div>
              </div>
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Water Resistance:</div>
                <div class="pdp-spec-value">50 meters</div>
              </div>
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Warranty:</div>
                <div class="pdp-spec-value">2 Years International Warranty</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Product image sets for different dial colors
  const imageSets = {
    black: {
      main: `${imgPath}/2777KD01_1 (1).jpg`,
      mainLarge: [
        `${imgPath}/2777KD01_1 (1).jpg`,
        `${imgPath}/2777KD01_2 (1).jpg`,
        `${imgPath}/2777KD01_3 (1).jpg`,
        `${imgPath}/2777KD01_4 (1).jpg`,
        `${imgPath}/2777KD01_5 (1).jpg`,
        `${imgPath}/2777KD01_6 (1).jpg`,
      ],
      thumbnails: [
        `${imgPath}/2777KD01_1 (1).jpg`,
        `${imgPath}/2777KD01_2 (1).jpg`,
        `${imgPath}/2777KD01_3 (1).jpg`,
        `${imgPath}/2777KD01_4 (1).jpg`,
        `${imgPath}/2777KD01_5 (1).jpg`,
        `${imgPath}/2777KD01_6 (1).jpg`,
      ],
    },
    silver: {
      main: `${imgPath}/2777KD01_1 (1).jpg`,
      mainLarge: [
        `${imgPath}/2777KD01_1 (1).jpg`,
        `${imgPath}/2777KD01_2 (1).jpg`,
        `${imgPath}/2777KD01_3 (1).jpg`,
        `${imgPath}/2777KD01_4 (1).jpg`,
        `${imgPath}/2777KD01_5 (1).jpg`,
        `${imgPath}/2777KD01_6 (1).jpg`,
      ],
      thumbnails: [
        `${imgPath}/2777KD01_1 (1).jpg`,
        `${imgPath}/2777KD01_2 (1).jpg`,
        `${imgPath}/2777KD01_3 (1).jpg`,
        `${imgPath}/2777KD01_4 (1).jpg`,
        `${imgPath}/2777KD01_5 (1).jpg`,
        `${imgPath}/2777KD01_6 (1).jpg`,
      ],
    },
    blue: {
      main: `${imgPath}/2777KD01_1 (1).jpg`,
      mainLarge: [
        `${imgPath}/2777KD01_1 (1).jpg`,
        `${imgPath}/2777KD01_2 (1).jpg`,
        `${imgPath}/2777KD01_3 (1).jpg`,
        `${imgPath}/2777KD01_4 (1).jpg`,
        `${imgPath}/2777KD01_5 (1).jpg`,
        `${imgPath}/2777KD01_6 (1).jpg`,
      ],
      thumbnails: [
        `${imgPath}/2777KD01_1 (1).jpg`,
        `${imgPath}/2777KD01_2 (1).jpg`,
        `${imgPath}/2777KD01_3 (1).jpg`,
        `${imgPath}/2777KD01_4 (1).jpg`,
        `${imgPath}/2777KD01_5 (1).jpg`,
        `${imgPath}/2777KD01_6 (1).jpg`,
      ],
    },
  };
  
  // Image gallery functionality
  const imageGallery = block.querySelector('.pdp-image-gallery');
  const thumbnails = block.querySelectorAll('.pdp-thumbnail');
  const mainImage = block.querySelector('.pdp-main-image img');
  
  // Store the current color variant
  let currentVariant = 'black';
  
  if (imageGallery && thumbnails.length > 0 && mainImage) {
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        // Use the high-res image for main display
        const imageSet = imageSets[currentVariant];
        if (imageSet && imageSet.mainLarge && imageSet.mainLarge[index]) {
          mainImage.src = imageSet.mainLarge[index];
        }
        
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
    
    // Update current variant
    currentVariant = colorKey;
    
    // Update main image with high-res version
    if (mainImage) {
      mainImage.src = imageSet.main;
    }
    
    // Update thumbnails with small versions
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

