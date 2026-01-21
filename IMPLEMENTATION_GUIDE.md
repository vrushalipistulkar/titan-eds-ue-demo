# Titan Products Implementation Guide

This guide covers the implementation of the dynamic product listing and product detail pages for the Titan watches website.

## 📦 Blocks Created

### 1. **PDP (Product Detail Page) Block**
Location: `/blocks/pdp/`

**Purpose**: Displays detailed product information based on SKU parameter in URL

**Files**:
- `pdp.js` - Main functionality
- `pdp.css` - Styling
- `README.md` - Documentation

**URL Format**:
```
/content/titan/language-masters/en/product-details.html?sku=NTTH1782630
```

**Features**:
- Fetches product data from API using SKU
- Displays up to 4 product images
- Shows specifications, pricing, availability
- Interactive image gallery
- Add to cart functionality
- Responsive design

---

### 2. **Products List Block**
Location: `/blocks/products-list/`

**Purpose**: Displays all available products in a grid layout

**Files**:
- `products-list.js` - Main functionality
- `products-list.css` - Styling
- `_products-list.json` - Block configuration
- `README.md` - Documentation

**Features**:
- Fetches all products from API
- Filters online and searchable products
- Grid layout with responsive columns
- Product cards with image, name, price, discount
- Click navigation to product details
- Hover effects and animations

---

## 🔌 API Integration

### API Endpoint
```
https://author-p121857-e1377564.adobeaemcloud.com/content/titan-services/products
```

### Authentication
- **Type**: Basic Auth
- **Username**: `internaluser`
- **Password**: `internaluser`

### Response Format
```json
[
  {
    "product_id": "NTTH1782630",
    "sku": "NTTH1782630",
    "name": "Tommy Hilfiger Quartz Analog Grey dial Watch",
    "description": "Product description...",
    "brand": "Tommy",
    "price": "13200",
    "sale_price": "10560",
    "currency": "INR",
    "image_url": "url1,url2,url3,url4",
    "main_image": "main-image-url",
    "availability_status": "In Stock",
    "online": "TRUE",
    "searchable": "TRUE",
    ...
  }
]
```

---

## 🧪 Testing

### Local Development Server

The AEM local development server is running at:
```
http://localhost:3000/
```

### Test Pages

#### 1. Products List Test
```
http://localhost:3000/products-list-test.html
```
Shows all products in a grid layout

#### 2. Product Detail Test
```
http://localhost:3000/pdp-test.html?sku=NTTH1782630
```
Shows details for a specific product

#### 3. Product Details Page (AEM Template)
```
http://localhost:3000/product-details.html?sku=NTTH1782630
```
Template that will be used in AEM UE

---

## 🎨 Design Features

### Products List Block

**Grid Layout**:
- Desktop: Auto-fill with min 280px columns
- Tablet: Auto-fill with min 250px columns
- Mobile: 2 columns

**Product Card Shows**:
- Product image (1:1 aspect ratio)
- Product name (max 2 lines)
- Current price (sale_price)
- Original price (struck-through if different)
- Discount percentage badge
- Availability status
- Product tag (if available)

**Interactions**:
- Hover: Card lifts with shadow
- Image zoom on hover
- Click: Navigate to product details

### PDP Block

**Layout**:
- Left: Image gallery (4 thumbnails + main image)
- Right: Product details (scrollable)

**Information Displayed**:
- Brand, name, SKU, tag
- Price, original price, discount
- Availability status
- Description
- Quantity selector
- Add to cart / Buy now buttons
- Complete specifications

---

## 🚀 Deployment to AEM

### For AEM Universal Editor

1. **Create Product Details Page**:
   - Path: `/content/titan/language-masters/en/product-details`
   - Add the PDP block to the page
   - The page will automatically read the `?sku=` parameter

2. **Create Products List Page**:
   - Add the Products List block to any page
   - Products will automatically load and display

3. **Navigation Setup**:
   - All product cards link to: `/content/titan/language-masters/en/product-details.html?sku={SKU}`
   - Works on both author and publish instances

### URL Structure

**Author Environment**:
```
https://author-p121857-e1377564.adobeaemcloud.com/content/titan/language-masters/en/product-details.html?sku=NTTH1782630
```

**Publish Environment**:
```
https://publish-p121857-e1377564.adobeaemcloud.com/content/titan/language-masters/en/product-details.html?sku=NTTH1782630
```

**Live Site** (after vanity URL configuration):
```
https://www.titan.co.in/product-details.html?sku=NTTH1782630
```

---

## 🔧 Configuration

### Modify Product Detail URL

Edit `products-list.js` line 34-44:

```javascript
function getProductDetailUrl(sku) {
  // Change this path as needed
  return `/content/titan/language-masters/en/product-details.html?sku=${sku}`;
}
```

### Filter Products

Edit `products-list.js` line 142-145:

```javascript
const availableProducts = products.filter(p => 
  p.online === 'TRUE' && 
  p.searchable === 'TRUE'
  // Add more filters here
);
```

### Customize Number of Images

Edit `pdp.js` line 53:

```javascript
const imageUrls = productData.image_url ? productData.image_url.split(',').slice(0, 4) : [];
// Change 4 to any number
```

---

## 📱 Responsive Breakpoints

### Products List
- Desktop: > 1200px
- Tablet: 768px - 1200px
- Mobile: 480px - 768px
- Small Mobile: < 480px

### PDP
- Desktop: > 768px (side-by-side layout)
- Mobile: < 768px (stacked layout)

---

## ⚠️ Important Notes

### CORS Considerations
- The API is configured for the AEM domain
- Local testing may require CORS proxy or browser extensions
- Production environment should have proper CORS headers

### URL Parameters
- The SKU parameter is case-sensitive
- Must match the `sku` field in the API response exactly
- Missing SKU shows error message

### Performance
- Products are fetched once on page load
- Images use lazy loading
- Filters run client-side for better performance

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript required
- CSS Grid required
- Fetch API required

---

## 🐛 Troubleshooting

### Product Not Found
**Check**:
1. Console logs for API response
2. SKU matches exactly (case-sensitive)
3. Product has `online: "TRUE"` and `searchable: "TRUE"`
4. API is accessible and returning data

### Images Not Loading
**Check**:
1. Image URLs are accessible
2. CORS headers allow image loading
3. Image URLs are comma-separated in `image_url` field
4. `main_image` field is populated

### Navigation Not Working
**Check**:
1. URL structure matches your AEM setup
2. Product details page exists at the specified path
3. Click event is not prevented by other scripts

### Styling Issues
**Check**:
1. `styles.css` is loaded
2. Block CSS files are loaded
3. No conflicting styles from other blocks
4. CSS custom properties are defined

---

## 📞 Support

For issues or questions:
1. Check browser console for error messages
2. Review the README files in each block folder
3. Verify API response structure matches expected format
4. Check AEM logs for server-side issues

---

## 🎯 Next Steps

1. **Test locally**: Verify both blocks work correctly
2. **Deploy to AEM**: Upload blocks and create pages
3. **Configure vanity URLs**: Set up friendly URLs
4. **Add analytics**: Integrate tracking for product views and clicks
5. **Optimize images**: Configure AEM Dynamic Media
6. **Add filters**: Implement category, brand, price filters
7. **Add sorting**: Implement sort by price, name, popularity
8. **Add search**: Integrate search functionality

---

## ✅ Checklist

- [x] PDP block created
- [x] Products List block created
- [x] API integration working
- [x] Responsive design implemented
- [x] Test pages created
- [x] Documentation written
- [ ] Deploy to AEM Author
- [ ] Test in AEM Universal Editor
- [ ] Deploy to AEM Publish
- [ ] Configure production URLs
- [ ] Add analytics tracking
- [ ] Performance optimization
- [ ] SEO optimization

