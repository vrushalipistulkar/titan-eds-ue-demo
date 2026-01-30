// Function to fetch all products from API
async function fetchAllProducts() {
  try {
    const apiUrl = 'https://author-p121857-e1908603.adobeaemcloud.com/content/titan-services/products';
    const credentials = btoa('internaluser:internaluser'); // Base64 encode credentials
    
    console.log('Fetching products from API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    // Handle both direct array and nested data structure
    let products = [];
    if (Array.isArray(data)) {
      products = data;
    } else if (data && data.data && Array.isArray(data.data)) {
      products = data.data;
    }
    
    console.log(`Found ${products.length} products`);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Function to calculate discount percentage
function calculateDiscount(price, salePrice) {
  if (!price || !salePrice) return 0;
  const discount = ((price - salePrice) / price) * 100;
  return Math.round(discount);
}

// Function to check if we're in author environment
function isAuthorEnvironment() {
  const { hostname } = window.location;
  return hostname.includes('author-') && hostname.includes('adobeaemcloud.com');
}

// Function to convert publish URL to author URL
function getImageUrl(imageUrl) {
  if (!imageUrl) return '';
  
  // Check if we're in author environment
  if (isAuthorEnvironment()) {
    // Replace publish domain with author domain
    return imageUrl.replace(
      'publish-p121857-e1908603.adobeaemcloud.com',
      'author-p121857-e1908603.adobeaemcloud.com'
    );
  }
  
  // Return original URL for non-author environments
  return imageUrl;
}

// Function to format price
function formatPrice(price, currency = 'INR') {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return '';
  
  if (currency === 'INR') {
    return `₹ ${numPrice.toLocaleString('en-IN')}`;
  }
  return `${currency} ${numPrice.toLocaleString()}`;
}

// Function to get the correct product details URL based on environment
function getProductDetailsUrl(sku) {
  const { hostname } = window.location;
  
  // Check if we're on author/publish (adobeaemcloud.com)
  if (hostname.includes('adobeaemcloud.com')) {
    // Author/Publish: Use full content path
    return `/content/titan/language-masters/en/product-details.html?sku=${sku}`;
  }
  
  // Local and Live (localhost or aem.live): Use simplified URL structure
  return `/en/product-details?sku=${sku}`;
}

// Function to create product card HTML
function createProductCard(product) {
  const mainImage = product.main_image || product.thumbnail_url || '';
  
  // Convert image URL to author if in author environment
  const convertedMainImage = getImageUrl(mainImage);
  
  // Add WebP optimization for AEM images
  const optimizedImage = convertedMainImage ? `${convertedMainImage}/_jcr_content/renditions/weboptimized.webp` : '';
  const salePrice = formatPrice(product.sale_price, product.currency);
  const originalPrice = product.price && product.price !== product.sale_price 
    ? formatPrice(product.price, product.currency) 
    : '';
  const discount = calculateDiscount(parseFloat(product.price), parseFloat(product.sale_price));
  
  // Product details URL - environment aware
  const productUrl = getProductDetailsUrl(product.sku);
  
  return `
    <div class="product-card" data-sku="${product.sku}" data-url="${productUrl}">
      <div class="product-card-image">
        <img src="${optimizedImage}" alt="${product.name || ''}" loading="lazy" width="300" height="300">
        ${discount > 0 ? `<div class="product-card-badge">${discount}% off</div>` : ''}
      </div>
      <div class="product-card-content">
        <h3 class="product-card-title">${product.name || ''}</h3>
        <div class="product-card-price">
          <span class="product-card-sale-price">${salePrice}</span>
          ${originalPrice ? `<span class="product-card-original-price">${originalPrice}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

// Main decorate function
export default async function decorate(block) {
  // Get category tag from authored content (first div)
  const categoryTagDiv = block.querySelector(':scope > div > div');
  const categoryTag = categoryTagDiv ? categoryTagDiv.textContent.trim() : '';
  
  console.log('Products List: Category Tag filter:', categoryTag);
  
  // Show loading state
  block.innerHTML = '<div class="products-list-loading">Loading products...</div>';
  
  // Fetch all products
  let products = await fetchAllProducts();
  
  // Filter products by category tag if specified
  if (categoryTag) {
    console.log(`Filtering products by category tag: "${categoryTag}"`);
    
    // Normalize function: lowercase and remove apostrophes
    const normalize = (str) => str.toLowerCase().replace(/'/g, '');
    const normalizedCategoryTag = normalize(categoryTag);
    
    products = products.filter(product => {
      // Check if product has a tag that matches the selected category
      const productTag = product.tag || '';
      const productCategory = product.category || '';
      
      // Normalize product fields
      const normalizedProductTag = normalize(productTag);
      const normalizedProductCategory = normalize(productCategory);
      
      // Match against tag or category field (case-insensitive, apostrophe-insensitive)
      const matches = normalizedProductTag.includes(normalizedCategoryTag) ||
                     normalizedProductCategory.includes(normalizedCategoryTag);
      
      console.log(`Product ${product.sku}: tag="${productTag}", category="${productCategory}", matches=${matches}`);
      return matches;
    });
    console.log(`Filtered to ${products.length} products`);
  }
  
  if (products.length === 0) {
    block.innerHTML = `
      <div class="products-list-error">
        <h2>No products found</h2>
        <p>${categoryTag ? `No products found for category "${categoryTag}".` : 'Unable to load products. Please try again later.'}</p>
      </div>
    `;
    return;
  }
  
  // Create products grid HTML
  console.log('Creating product cards HTML...');
  const productsHTML = products.map(product => {
    console.log('Processing product:', product.sku, product.name);
    return createProductCard(product);
  }).join('');
  
  console.log('Setting block innerHTML...');
  block.innerHTML = `
    <div class="products-list-container">
      <div class="products-list-header">
        <h2 class="products-list-title">${categoryTag ? categoryTag : 'Our Products'}</h2>
       <!-- <p class="products-list-count">${products.length} products available</p> -->
      </div>
      <div class="products-list-grid">
        ${productsHTML}
      </div>
    </div>
  `;
  
  console.log('Block innerHTML set, length:', block.innerHTML.length);
  
  // Add click handlers to product cards
  const productCards = block.querySelectorAll('.product-card');
  console.log('Found product cards:', productCards.length);
  
  productCards.forEach((card, index) => {
    console.log(`Setting up card ${index + 1}`);
    card.addEventListener('click', () => {
      const url = card.getAttribute('data-url');
      console.log('Card clicked, URL:', url);
      if (url) {
        window.location.href = url;
      }
    });
    
    // Add hover effect
    card.style.cursor = 'pointer';
  });
  
  console.log('Products list block setup complete!');
}
