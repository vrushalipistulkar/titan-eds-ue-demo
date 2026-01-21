# Product Detail Page (PDP) Block

This block displays product details dynamically by fetching data from the Titan Services API based on a SKU parameter in the URL.

## Features

- **Dynamic Data Fetching**: Automatically fetches product information from the API based on SKU parameter
- **Image Gallery**: Displays up to 4 product images with thumbnail navigation
- **Product Details**: Shows name, brand, price, discount, availability, and description
- **Specifications**: Displays comprehensive product specifications
- **Interactive Elements**: Quantity selector, Add to Cart, and Buy Now buttons
- **Responsive Design**: Optimized for all screen sizes

## Usage

### URL Parameter

Add the `sku` parameter to the URL to load a specific product:

```
https://yoursite.com/pdp?sku=NTTH1782630
```

### API Configuration

The block fetches product data from:
- **API Endpoint**: `https://author-p121857-e1377564.adobeaemcloud.com/content/titan-services/products`
- **Authentication**: Basic Auth with credentials `internaluser:internaluser`

### Data Structure

The API should return a JSON response with the following structure:

```json
{
  "data": [
    {
      "product_id": "NTTH1782630",
      "sku": "NTTH1782630",
      "name": "Tommy Hilfiger Quartz Analog Grey dial Stainless Steel Strap Watch for Women",
      "description": "Product description...",
      "brand": "Tommy",
      "category": "Watches/Sale",
      "gender": "Women",
      "price": "13200",
      "currency": "INR",
      "sale_price": "10560",
      "availability_status": "In Stock",
      "image_url": "url1,url2,url3,url4",
      "main_image": "main-image-url",
      "warranty": "24 Months",
      "warranty_detail": "Warranty details...",
      "glass_material": "Mineral Glass",
      "strap_material": "Stainless Steel",
      "strap_color": "Grey",
      "function": "Analog",
      "lock_mechanism": "Push Button Clasp",
      "movement": "Quartz",
      "dial_color": "Grey",
      "case_shape": "Round",
      "case_material": "Stainless Steel",
      "case_length": "34 mm",
      "case_width": "34 mm",
      "case_thickness": "8.1 mm",
      "country_of_origin": "India",
      "tag": "Women's Watch"
    }
  ]
}
```

## Image Handling

- **Thumbnail Images**: Up to 4 images displayed on the left side from `image_url` field (comma-separated)
- **Main Image**: Primary display uses `main_image` field, falls back to first image in `image_url`
- **Interactive Gallery**: Click thumbnails to change the main image

## Specifications Displayed

The block automatically displays the following specifications (if available):
- Brand
- Gender
- Glass Material
- Strap Material
- Strap Color
- Function
- Lock Mechanism
- Movement
- Dial Color
- Case Shape
- Case Material
- Case Length
- Case Width
- Case Thickness
- Warranty
- Warranty Detail
- Country of Origin

## Interactive Features

### Image Gallery
- Click on any thumbnail to view it in the main image area
- Active thumbnail is highlighted with a border

### Quantity Selector
- Increase/decrease quantity using + and - buttons
- Minimum quantity is 1

### Action Buttons
- **Add to Cart**: Adds the product with selected quantity to cart
- **Buy Now**: Proceeds to checkout with the selected product

## Error States

- **No SKU**: Shows message to provide SKU parameter
- **Product Not Found**: Shows error message if SKU is not found in API
- **Loading State**: Shows loading message while fetching data

## Testing

Use the provided `pdp-test.html` file to test the PDP block:

```
http://localhost:3000/pdp-test.html?sku=NTTH1782630
```

## Customization

### Styling
Modify `pdp.css` to customize the appearance of the product detail page.

### API Endpoint
Update the `apiUrl` in `pdp.js` to point to a different API endpoint if needed.

### Authentication
Change the credentials in the `fetchProductData` function if different authentication is required.

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript support required
- Fetch API support required
