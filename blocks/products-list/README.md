# Products List Block

This block displays a grid of all products fetched from the Titan Services API. Each product card shows the product image, name, price, and discount (if applicable). Clicking on a product navigates to the product detail page.

## Features

- **Dynamic Product Loading**: Fetches all products from the API
- **Grid Layout**: Responsive grid that adapts to different screen sizes
- **Product Cards**: Each card displays:
  - Product image
  - Product name
  - Sale price
  - Original price (if different from sale price)
  - Discount percentage badge
- **Click Navigation**: Clicking any product card navigates to the product details page with the SKU parameter
- **Loading States**: Shows loading indicator while fetching data
- **Error Handling**: Displays error message if products cannot be loaded
- **Responsive Design**: Optimized for all screen sizes

## Usage

### In AEM Universal Editor

Simply add the `products-list` block to your page. The block will automatically:
1. Fetch all products from the API
2. Display them in a responsive grid
3. Handle click events to navigate to product details

### Test Page

Use the provided test page to see the products list in action:
```
http://localhost:3000/products-list-test.html
```

### API Configuration

The block fetches product data from:
- **API Endpoint**: `https://author-p121857-e1377564.adobeaemcloud.com/content/titan-services/products`
- **Authentication**: Basic Auth with credentials `internaluser:internaluser`

## Product Card Layout

Each product card contains:
- **Image**: Main product image (300px height on desktop)
- **Discount Badge**: Shows discount percentage if applicable
- **Title**: Product name (truncated to 2 lines)
- **Price**: 
  - Sale price (prominent, larger font)
  - Original price (crossed out, if different)

## Navigation

When a product card is clicked, the user is redirected to:
```
/content/titan/language-masters/en/product-details.html?sku={PRODUCT_SKU}
```

This URL structure is compatible with AEM Universal Editor and will work in both:
- Preview mode (`.html` extension)
- Live published pages

## Responsive Breakpoints

- **Desktop (> 1200px)**: 4-5 products per row (min 280px per card)
- **Tablet (768px - 1200px)**: 3-4 products per row (min 250px per card)
- **Mobile (480px - 768px)**: 2-3 products per row (min 200px per card)
- **Small Mobile (< 480px)**: 2 products per row (min 150px per card)

## Hover Effects

- Card lifts up slightly on hover
- Shadow becomes more prominent
- Product image scales up slightly
- Cursor changes to pointer

## Customization

### Styling

Modify `products-list.css` to customize:
- Grid layout and spacing
- Card appearance
- Hover effects
- Colors and typography

### Product Details URL

Update the `productUrl` in `products-list.js` if you need a different URL structure:

```javascript
const productUrl = `/content/titan/language-masters/en/product-details.html?sku=${product.sku}`;
```

### API Endpoint

Update the `apiUrl` in `products-list.js` to use a different API endpoint:

```javascript
const apiUrl = 'YOUR_API_ENDPOINT_HERE';
```

## Data Structure

The block expects the API to return products with the following fields:

```json
{
  "sku": "NTTH1782630",
  "name": "Product Name",
  "price": "13200",
  "sale_price": "10560",
  "currency": "INR",
  "main_image": "https://...",
  "thumbnail_url": "https://...",
  ...
}
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript support required
- Fetch API support required
- CSS Grid support required

## Performance

- Images use `loading="lazy"` for better performance
- Grid layout uses CSS Grid for optimal rendering
- Click handlers are added efficiently after render
- Console logging for debugging (can be removed in production)

## Error States

- **No Products**: Shows friendly error message if no products are returned
- **API Error**: Displays error with instructions to try again
- **Loading State**: Shows loading message while fetching data

## Integration with PDP Block

This block works seamlessly with the PDP (Product Detail Page) block:
1. User clicks a product card in the products-list
2. Browser navigates to `/content/titan/language-masters/en/product-details.html?sku=XXX`
3. PDP block reads the SKU parameter and displays the product details

## Testing

1. Start the AEM local dev server:
   ```bash
   npx @adobe/aem-cli up
   ```

2. Open the test page:
   ```
   http://localhost:3000/products-list-test.html
   ```

3. Verify:
   - Products load correctly
   - Images display properly
   - Prices and discounts are shown
   - Clicking a product navigates to the correct URL
   - Layout is responsive on different screen sizes
