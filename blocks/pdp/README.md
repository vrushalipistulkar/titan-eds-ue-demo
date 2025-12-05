# PDP (Product Detail Page) Block

A static, non-authorable block for displaying product details in an e-commerce layout.

## Features

- **Product Image Gallery**: Main image with thumbnail navigation (6 product images included)
- **Product Information**: Brand, title, SKU, ratings
- **Pricing**: Current price, original price, and discount display
- **Product Options**: Dial color, strap color, or other variant selectors
- **Quantity Selector**: Increase/decrease quantity controls
- **Action Buttons**: Add to Cart and Buy Now buttons
- **Product Features**: Bulleted list of key features
- **Specifications**: Detailed product specifications table
- **Fully Responsive**: Mobile-friendly layout

## Included Images

The block includes multiple product images in the `imgs` folder for the Titan Lagan watch series:

**Main Product (2656WM01 - Women's Watch):**
- `2656WM01_1.jpg` - Main product image
- `2656WM01_2 (1).jpg` - Alternate view
- `2656WM01_3 (1).jpg` - Side view
- `2656WM01_4 (1).jpg` - Detail shot
- `2656WM01_5 (1).jpg` - Wrist view
- `2656WM01_6 (1).jpg` - Additional angle
- `2656WM01_7 (1).jpg` - Extra view

**Additional Variants Available:**
- 2656BM01 series (6 images)
- 2656YL01 series (6 images)

You can easily switch between product variants by updating the image src attributes in the HTML.

## Usage

### In Franklin/AEM Authoring

1. Add a section to your page
2. Insert a block and name it `pdp`
3. The block will render with the static HTML structure defined in your content

### HTML Structure

The block expects the following structure (see `pdp-sample.html` for a complete example):

```html
<div class="pdp">
  <div class="pdp-container">
    <div class="product-wrapper">
      <div class="pdp-images">
        <!-- Image gallery -->
      </div>
      <div class="product-detail">
        <!-- Product details -->
      </div>
    </div>
  </div>
</div>
```

## Interactive Features

The JavaScript adds the following interactive functionality:

1. **Image Gallery**: Click thumbnails to change the main product image
2. **Quantity Controls**: Increase/decrease product quantity
3. **Add to Cart**: Button click handler (shows alert by default)

## Customization

### Styling

Edit `pdp.css` to customize:
- Colors (uses CSS variables like `--main-accent-color`)
- Spacing and layout
- Button styles
- Responsive breakpoints

### Functionality

Edit `pdp.js` to customize:
- Add to cart behavior
- Product options selection
- API integrations
- Analytics tracking

## CSS Variables Used

- `--main-accent-color`: Primary brand color for buttons and accents
- `--link-hover-color`: Hover state color
- `--text-color`: Main text color
- `--background-color`: Background color

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- ES6+ JavaScript

## Notes

This is a **static block** and is not designed to be authorable through the Universal Editor. If you need an authorable product block, consider creating a separate component with proper models and definitions.

