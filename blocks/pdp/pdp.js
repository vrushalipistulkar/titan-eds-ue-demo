// Function to get URL parameter
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Function to fetch product data from API
async function fetchProductData(sku) {
  try {
    const apiUrl = 'https://author-p121857-e1908603.adobeaemcloud.com/content/titan-services/products';
    const credentials = btoa('internaluser:internaluser'); // Base64 encode credentials
    
    console.log('Fetching from API:', apiUrl);
    console.log('Authorization header:', `Basic ${credentials}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response OK:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('API Response:', data);
    console.log('Looking for SKU:', sku);
    
    // Find the product with matching SKU
    // Handle both direct array and nested data structure
    let products = [];
    if (Array.isArray(data)) {
      products = data;
    } else if (data && data.data && Array.isArray(data.data)) {
      products = data.data;
    }
    
    const product = products.find(p => p.sku === sku);
    console.log('Found product:', product);
    
    return product || null;
  } catch (error) {
    console.error('Error fetching product data:', error);
    return null;
  }
}

// Function to calculate discount percentage
function calculateDiscount(price, salePrice) {
  if (!price || !salePrice) return 0;
  const discount = ((price - salePrice) / price) * 100;
  return Math.round(discount);
}

// Function to create PDP HTML from product data
function createPDPHTML(productData, sku) {
  if (!productData) {
    return `<div class="pdp-error">
      <h2>Product not found</h2>
      <p>SKU "${sku}" was not found in the product catalog.</p>
      <p>Please check the browser console for more details.</p>
    </div>`;
  }
  
  // Parse images - limit to 4 images
  const imageUrls = productData.image_url ? productData.image_url.split(',').slice(0, 4) : [];
  const mainImage = productData.main_image || (imageUrls.length > 0 ? imageUrls[0] : '');
  
  // Create thumbnail HTML
  const thumbnailsHTML = imageUrls.map((url, index) => `
    <div class="pdp-thumbnail ${index === 0 ? 'active' : ''}">
      <img src="${url.trim()}" alt="Product Image ${index + 1}" width="100" height="100" loading="lazy">
    </div>
  `).join('');
  
  // Calculate discount
  const discount = calculateDiscount(parseFloat(productData.price), parseFloat(productData.sale_price));
  
  // Create specifications HTML
  const specifications = [
    { label: 'Brand', value: productData.brand },
    { label: 'Gender', value: productData.gender },
    { label: 'Glass Material', value: productData.glass_material },
    { label: 'Strap Material', value: productData.strap_material },
    { label: 'Strap Color', value: productData.strap_color },
    { label: 'Function', value: productData.function },
    { label: 'Lock Mechanism', value: productData.lock_mechanism },
    { label: 'Movement', value: productData.movement },
    { label: 'Dial Color', value: productData.dial_color },
    { label: 'Case Shape', value: productData.case_shape },
    { label: 'Case Material', value: productData.case_material },
    { label: 'Case Length', value: productData.case_length },
    { label: 'Case Width', value: productData.case_width },
    { label: 'Case Thickness', value: productData.case_thickness },
  ].filter(spec => spec.value); // Only include specs with values
  
  const specificationsHTML = specifications.map(spec => `
    <div class="pdp-spec-row">
      <div class="pdp-spec-label">${spec.label}:</div>
      <div class="pdp-spec-value">${spec.value}</div>
    </div>
  `).join('');
  
  return `
    <div class="pdp-container">
      <div class="product-wrapper">
        <div class="pdp-images">
          <div class="pdp-image-gallery">
            ${thumbnailsHTML}
          </div>
          <div class="pdp-main-image">
            <img src="${mainImage}" alt="${productData.name}" width="600" height="600" loading="eager" fetchpriority="high">
          </div>
        </div>
        <div class="product-detail">
          <div class="pdp-brand">${productData.brand || ''}</div>
          <h1 class="pdp-title">${productData.name || ''}</h1>
          <div class="pdp-sku">${productData.sku || ''}</div>
          <div class="pdp-tag">${productData.tag || ''}</div>
          
          <div class="pdp-price">
            <span class="pdp-current-price">${productData.currency} ${parseFloat(productData.sale_price).toLocaleString('en-IN')}</span>
            ${productData.price && productData.price !== productData.sale_price ? `
              <span class="pdp-original-price">${productData.currency} ${parseFloat(productData.price).toLocaleString('en-IN')}</span>
              <span class="pdp-discount">${discount}% OFF</span>
            ` : ''}
          </div>

          <div class="pdp-availability">
            <span class="pdp-availability-status ${productData.availability_status === 'In Stock' ? 'in-stock' : 'out-of-stock'}">
              ${productData.availability_status || 'Check Availability'}
            </span>
          </div>

          <div class="pdp-description">
            <p>${productData.description || ''}</p>
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
            <div class="pdp-feature-item">
              <img src="/blocks/pdp/icons/usp-shipping-d.svg" alt="Free Shipping" class="pdp-feature-icon">
              <div class="pdp-feature-text">
                <div class="pdp-feature-title">Free Shipping</div>
                <div class="pdp-feature-subtitle">Countrywide</div>
              </div>
            </div>
            <div class="pdp-feature-item">
              <img src="/blocks/pdp/icons/usp-return-d.svg" alt="Easy Return" class="pdp-feature-icon">
              <div class="pdp-feature-text">
                <div class="pdp-feature-title">Easy</div>
                <div class="pdp-feature-subtitle">Return</div>
              </div>
            </div>
            <div class="pdp-feature-item">
              <img src="/blocks/pdp/icons/usp-pod-d.svg" alt="Pay on Delivery" class="pdp-feature-icon">
              <div class="pdp-feature-text">
                <div class="pdp-feature-title">Pay on Delivery</div>
                <div class="pdp-feature-subtitle">Available</div>
              </div>
            </div>
            <div class="pdp-feature-item">
              <img src="/blocks/pdp/icons/usp-service-d.svg" alt="Serviced" class="pdp-feature-icon">
              <div class="pdp-feature-text">
                <div class="pdp-feature-title">Serviced</div>
                <div class="pdp-feature-subtitle">Across India</div>
              </div>
            </div>
          </div>

          <div class="pdp-specifications">
            <h3 class="pdp-specifications-title">Specifications</h3>
            ${specificationsHTML}
            ${productData.warranty ? `
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Warranty:</div>
                <div class="pdp-spec-value">${productData.warranty}</div>
              </div>
            ` : ''}
            ${productData.warranty_detail ? `
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Warranty Detail:</div>
                <div class="pdp-spec-value">${productData.warranty_detail}</div>
              </div>
            ` : ''}
            ${productData.country_of_origin ? `
              <div class="pdp-spec-row">
                <div class="pdp-spec-label">Country of Origin:</div>
                <div class="pdp-spec-value">${productData.country_of_origin}</div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

export default async function decorate(block) {
  // Get SKU from URL parameter first
  let sku = getUrlParameter('sku');
  
  // Get hideSku setting from authored content (second div)
  const hideSkuDiv = block.querySelector(':scope > div:nth-child(2) > div');
  const hideSku = hideSkuDiv ? hideSkuDiv.textContent.trim().toLowerCase() === 'true' : false;
  
  // Get hideFeatures setting from authored content (third div)
  const hideFeaturesDiv = block.querySelector(':scope > div:nth-child(3) > div');
  const hideFeatures = hideFeaturesDiv ? hideFeaturesDiv.textContent.trim().toLowerCase() === 'true' : false;
  
  // If no SKU in URL, try to get it from authored content in UE
  if (!sku) {
    // Check for authored SKU in block content (first div > div structure)
    const skuDiv = block.querySelector(':scope > div > div');
    if (skuDiv) {
      const authoredSku = skuDiv.textContent.trim();
      if (authoredSku) {
        sku = authoredSku;
        console.log('PDP Block: Using authored SKU from UE:', sku);
      }
    }
  } else {
    console.log('PDP Block: SKU from URL:', sku);
  }
  
  console.log('PDP Block: Hide SKU setting:', hideSku);
  console.log('PDP Block: Hide Features setting:', hideFeatures);
  
  if (sku) {
    // Show loading state
    block.innerHTML = '<div class="pdp-loading">Loading product...</div>';
    
    // Fetch product data
    const productData = await fetchProductData(sku);
    
    // Create and set PDP HTML
    block.innerHTML = createPDPHTML(productData, sku);
    
    // Hide SKU display if hideSku is enabled
    if (hideSku) {
      const skuElement = block.querySelector('.pdp-sku');
      if (skuElement) {
        skuElement.style.display = 'none';
      }
    }
    
    // Hide features panel if hideFeatures is enabled
    if (hideFeatures) {
      const featuresElement = block.querySelector('.pdp-features');
      if (featuresElement) {
        featuresElement.style.display = 'none';
      }
    }
  } else {
    // No SKU from either URL or authored content
    block.innerHTML = '<div class="pdp-error">Please provide a SKU parameter in the URL (e.g., ?sku=NTTH1782630) or author a SKU in the Universal Editor.</div>';
  }
  
  // Set up image gallery functionality
  const thumbnails = block.querySelectorAll('.pdp-thumbnail');
  const mainImage = block.querySelector('.pdp-main-image img');
  
  if (thumbnails.length > 0 && mainImage) {
    thumbnails.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const thumbImg = thumb.querySelector('img');
        if (thumbImg) {
          mainImage.src = thumbImg.src;
          
          // Update active thumbnail
          thumbnails.forEach((t) => t.classList.remove('active'));
          thumb.classList.add('active');
        }
      });
    });
  }
  
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
      const quantity = quantityInput ? quantityInput.value : 1;
      const skuValue = getUrlParameter('sku');
      // eslint-disable-next-line no-alert
      alert(`Product ${skuValue} added to cart! Quantity: ${quantity}`);
    });
  }
  
  // Buy now button
  const buyNowBtn = block.querySelector('.pdp-buy-now');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      const quantity = quantityInput ? quantityInput.value : 1;
      const skuValue = getUrlParameter('sku');
      // eslint-disable-next-line no-alert
      alert(`Proceeding to checkout with ${skuValue}! Quantity: ${quantity}`);
    });
  }
}

