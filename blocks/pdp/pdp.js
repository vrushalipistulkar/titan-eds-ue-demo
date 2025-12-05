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
                <img src="${imgPath}/2656WM01_1.jpg" alt="Product Image 1">
              </div>
              <div class="pdp-thumbnail">
                <img src="${imgPath}/2656WM01_2.jpg" alt="Product Image 2">
              </div>
              <div class="pdp-thumbnail">
                <img src="${imgPath}/2656WM01_3.jpg" alt="Product Image 3">
              </div>
              <div class="pdp-thumbnail">
                <img src="${imgPath}/2656WM01_4.jpg" alt="Product Image 4">
              </div>
              <div class="pdp-thumbnail">
                <img src="${imgPath}/2656WM01_5.jpg" alt="Product Image 5">
              </div>
              <div class="pdp-thumbnail">
                <img src="${imgPath}/2656WM01_6.jpg" alt="Product Image 6">
              </div>
            </div>
            <div class="pdp-main-image">
              <img src="${imgPath}/2656WM01_1.jpg" alt="Product Main Image">
            </div>
          </div>
          <div class="product-detail">
            <div class="pdp-brand">Titan</div>
            <h1 class="pdp-title">Titan Lagan Quartz Analog with Day and Date Women Watch - Silver Dial with Rose Gold Colour Metal Strap</h1>
            <div class="pdp-sku">SKU: 2656WM01</div>
            
            <div class="pdp-rating">
              <span class="pdp-stars">★★★★☆</span>
              <span class="pdp-rating-count">(248 reviews)</span>
            </div>

            <div class="pdp-price">
              <span class="pdp-current-price">₹8,995</span>
              <span class="pdp-original-price">₹12,995</span>
              <span class="pdp-discount">31% OFF</span>
            </div>

            <div class="pdp-description">
              <p>Elevate your style with this elegant Titan Lagan watch featuring a sophisticated quartz analog movement with day and date display. The silver dial perfectly complements the rose gold metal strap, creating a timeless piece for any occasion.</p>
            </div>

            <div class="pdp-options">
              <div class="pdp-option">
                <label class="pdp-option-label">Dial Color</label>
                <div class="pdp-option-values">
                  <div class="pdp-option-value selected">Silver</div>
                  <div class="pdp-option-value">White</div>
                  <div class="pdp-option-value">Blue</div>
                </div>
              </div>

              <div class="pdp-option">
                <label class="pdp-option-label">Strap Color</label>
                <div class="pdp-option-values">
                  <div class="pdp-option-value selected">Rose Gold</div>
                  <div class="pdp-option-value">Silver</div>
                  <div class="pdp-option-value">Gold</div>
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
                <li>Quartz analog movement with day and date display</li>
                <li>Premium metal strap with rose gold finish</li>
                <li>Silver dial with elegant design</li>
                <li>Water resistant up to 30 meters</li>
                <li>2 years manufacturer warranty</li>
                <li>Perfect for formal and casual wear</li>
              </ul>
            </div>

            <div class="pdp-specifications">
              <h3 class="pdp-specifications-title">Specifications</h3>
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Case Material:</div>
                <div class="pdp-spec-value">Brass</div>
              </div>
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Strap Material:</div>
                <div class="pdp-spec-value">Metal</div>
              </div>
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Dial Color:</div>
                <div class="pdp-spec-value">Silver</div>
              </div>
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Case Diameter:</div>
                <div class="pdp-spec-value">32mm</div>
              </div>
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Movement Type:</div>
                <div class="pdp-spec-value">Quartz</div>
              </div>
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Water Resistance:</div>
                <div class="pdp-spec-value">30 meters</div>
              </div>
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Warranty:</div>
                <div class="pdp-spec-value">2 Years Manufacturer Warranty</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Product image sets for different dial colors
  const imageSets = {
    silver: {
      main: `${imgPath}/2656WM01_1.jpg`,
      mainLarge: [
        `${imgPath}/2656WM01_1.jpg`,
        `${imgPath}/2656WM01_2.jpg`,
        `${imgPath}/2656WM01_3.jpg`,
        `${imgPath}/2656WM01_4.jpg`,
        `${imgPath}/2656WM01_5.jpg`,
        `${imgPath}/2656WM01_6.jpg`,
      ],
      thumbnails: [
        `${imgPath}/2656WM01_1.jpg`,
        `${imgPath}/2656WM01_2.jpg`,
        `${imgPath}/2656WM01_3.jpg`,
        `${imgPath}/2656WM01_4.jpg`,
        `${imgPath}/2656WM01_5.jpg`,
        `${imgPath}/2656WM01_6.jpg`,
      ],
    },
    white: {
      main: `${imgPath}/2656BM01_1.jpg`,
      mainLarge: [
        `${imgPath}/2656BM01_1.jpg`,
        `${imgPath}/2656BM01_2.jpg`,
        `${imgPath}/2656BM01_3.jpg`,
        `${imgPath}/2656BM01_4.jpg`,
        `${imgPath}/2656BM01_5.jpg`,
        `${imgPath}/2656BM01_6.jpg`,
      ],
      thumbnails: [
        `${imgPath}/2656BM01_1.jpg`,
        `${imgPath}/2656BM01_2.jpg`,
        `${imgPath}/2656BM01_3.jpg`,
        `${imgPath}/2656BM01_4.jpg`,
        `${imgPath}/2656BM01_5.jpg`,
        `${imgPath}/2656BM01_6.jpg`,
      ],
    },
    blue: {
      main: `${imgPath}/2656YL01_1.jpg`,
      mainLarge: [
        `${imgPath}/2656YL01_1.jpg`,
        `${imgPath}/2656YL01_2.jpg`,
        `${imgPath}/2656YL01_3.jpg`,
        `${imgPath}/2656YL01_4.jpg`,
        `${imgPath}/2656YL01_5.jpg`,
        `${imgPath}/2656YL01_6.jpg`,
      ],
      thumbnails: [
        `${imgPath}/2656YL01_1.jpg`,
        `${imgPath}/2656YL01_2.jpg`,
        `${imgPath}/2656YL01_3.jpg`,
        `${imgPath}/2656YL01_4.jpg`,
        `${imgPath}/2656YL01_5.jpg`,
        `${imgPath}/2656YL01_6.jpg`,
      ],
    },
  };
  
  // Image gallery functionality
  const imageGallery = block.querySelector('.pdp-image-gallery');
  const thumbnails = block.querySelectorAll('.pdp-thumbnail');
  const mainImage = block.querySelector('.pdp-main-image img');
  
  // Store the current color variant
  let currentVariant = 'silver';
  
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

