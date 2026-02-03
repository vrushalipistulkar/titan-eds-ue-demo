// Import readBlockConfig from aem.js if available
function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    if (row.children && row.children.length === 2) {
      const key = row.children[0].textContent.trim();
      const value = row.children[1].textContent.trim();
      config[key] = value;
    } else if (row.children && row.children.length === 1) {
      const value = row.children[0].textContent.trim();
      if (value) config.default = value;
    }
  });
  return config;
}

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

// Import getMetadata function (same pattern as page properties)
function getMetadata(name, doc = document) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = [...doc.head.querySelectorAll(`meta[${attr}="${name}"]`)]
    .map((m) => m.content)
    .join(', ');
  return meta || '';
}

// Function to fetch block properties from AEM resource
async function fetchBlockProperties(resourcePath) {
  try {
    // Extract the actual JCR path from the URN
    const path = resourcePath.replace('urn:aemconnection:', '');
    
    // In author environment, we can access the content directly
    // Try the direct path with .json selector
    const jsonUrl = `${path}.json`;
    
    console.log('Fetching block properties from:', jsonUrl);
    
    const response = await fetch(jsonUrl);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Block properties fetched:', data);
      
      // The cq:tags property should be directly in the data
      if (data['cq:tags']) {
        console.log('Found cq:tags in response:', data['cq:tags']);
        return data['cq:tags'];
      }
      
      // Also log all properties to see what's available
      console.log('Available properties:', Object.keys(data));
      return null;
    } else {
      console.log('❌ Failed to fetch, status:', response.status);
    }
  } catch (error) {
    console.log('❌ Error fetching block properties:', error);
  }
  return null;
}

// Main decorate function
export default async function decorate(block) {
  // Get category tag from authored content
  console.log('=== Products List Block Debug ===');
  console.log('Block element:', block);
  console.log('Block innerHTML:', block.innerHTML);
  console.log('Block children count:', block.children.length);
  
  let categoryTag = '';
  
  // Try to read block configuration from HTML (works on published site)
  const blockConfig = readBlockConfig(block);
  console.log('Block config from HTML:', blockConfig);
  
  // Method 1: Read from block config (table structure) - works on live/published
  if (blockConfig['cq:tags']) {
    categoryTag = blockConfig['cq:tags'];
    console.log('✅ Found tag in block config (cq:tags):', categoryTag);
  } else if (blockConfig['Category Tag']) {
    categoryTag = blockConfig['Category Tag'];
    console.log('✅ Found tag in block config (Category Tag):', categoryTag);
  } else if (blockConfig.default) {
    categoryTag = blockConfig.default;
    console.log('✅ Found tag in block config (default):', categoryTag);
  }
  
  // Method 2: If in Universal Editor/Author (no children), fetch from AEM resource
  if (!categoryTag && block.children.length === 0) {
    const resourcePath = block.getAttribute('data-aue-resource');
    if (resourcePath) {
      console.log('🔄 In Universal Editor/Author - fetching properties from AEM');
      categoryTag = await fetchBlockProperties(resourcePath);
      
      if (categoryTag) {
        console.log('✅ Retrieved category tag from AEM:', categoryTag);
      } else {
        console.log('⚠️ No category tag found in AEM resource');
      }
    }
  }
  
  console.log('Final Category Tag:', `"${categoryTag}"`);
  console.log('Category Tag length:', categoryTag.length);
  
  // Show loading state with debug info
  block.innerHTML = `
    <div class="products-list-loading">
      Loading products...
      <div style="background: yellow; padding: 10px; margin-top: 10px; font-size: 12px;">
        <strong>Debug Info:</strong><br>
        Raw Category Tag: "${categoryTag}"<br>
        Tag Length: ${categoryTag.length}
      </div>
    </div>
  `;
  
  // Fetch all products
  let products = await fetchAllProducts();
  
  // Filter products by category tag if specified
  if (categoryTag) {
    console.log(`Filtering products by category tag (raw): "${categoryTag}"`);
    
    // Extract tag value after colon if present (e.g., "Titan : Womens Watch" -> "Womens Watch")
    const tagValue = categoryTag.includes(':') 
      ? categoryTag.split(':')[1].trim() 
      : categoryTag.trim();
    
    console.log(`Extracted tag value: "${tagValue}"`);
    
    // Normalize function: lowercase and remove apostrophes
    const normalize = (str) => str.toLowerCase().replace(/'/g, '').trim();
    const normalizedCategoryTag = normalize(tagValue);
    
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
    // Extract clean tag value for error message
    const cleanTagValue = categoryTag 
      ? (categoryTag.includes(':') ? categoryTag.split(':')[1].trim() : categoryTag.trim())
      : '';
    
    block.innerHTML = `
      <div class="products-list-error">
        <h2>No products found</h2>
        <p>${cleanTagValue ? `No products found for category "${cleanTagValue}".` : 'Unable to load products. Please try again later.'}</p>
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
  
  // Extract clean tag value for display title
  const displayTitle = categoryTag 
    ? (categoryTag.includes(':') ? categoryTag.split(':')[1].trim() : categoryTag.trim())
    : 'Our Products';
  
  block.innerHTML = `
    <div class="products-list-container">
      <div class="products-list-header">
        <h2 class="products-list-title">${displayTitle}</h2>
        <div style="background: #f0f0f0; padding: 10px; margin: 10px 0; border: 1px solid #ccc; font-size: 12px;">
          <strong>🔍 Filter Debug:</strong><br>
          Raw Tag: "${categoryTag}"<br>
          Extracted Tag: "${categoryTag.includes(':') ? categoryTag.split(':')[1].trim() : categoryTag}"<br>
          Products Found: ${products.length}
        </div>
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
