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

// Function to format price
function formatPrice(price, currency = 'INR') {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return '';
  
  if (currency === 'INR') {
    return `₹ ${numPrice.toLocaleString('en-IN')}`;
  }
  return `${currency} ${numPrice.toLocaleString()}`;
}

// Function to create product card HTML
function createProductCard(product) {
  const mainImage = product.main_image || product.thumbnail_url || '';
  const salePrice = formatPrice(product.sale_price, product.currency);
  const originalPrice = product.price && product.price !== product.sale_price 
    ? formatPrice(product.price, product.currency) 
    : '';
  const discount = calculateDiscount(parseFloat(product.price), parseFloat(product.sale_price));
  
  // Product details URL
  const productUrl = `/content/titan/language-masters/en/product-details.html?sku=${product.sku}`;
  
  return `
    <div class="product-card" data-sku="${product.sku}" data-url="${productUrl}">
      <div class="product-card-image">
        <img src="${mainImage}" alt="${product.name || ''}" loading="lazy" width="300" height="300">
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
  // Show loading state
  block.innerHTML = '<div class="products-list-loading">Loading products...</div>';
  
  // Fetch all products
  const products = await fetchAllProducts();
  
  if (products.length === 0) {
    block.innerHTML = `
      <div class="products-list-error">
        <h2>No products found</h2>
        <p>Unable to load products. Please try again later.</p>
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
        <h2 class="products-list-title">Our Products</h2>
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
