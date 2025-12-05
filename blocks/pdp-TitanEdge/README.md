# PDP TitanEdge (Product Detail Page) Block

A static, non-authorable block for displaying Titan Edge ceramic watch products.

## Features

- **Product Image Gallery**: Main image with thumbnail navigation (6 product images)
- **Product Information**: Brand (Titan Edge), title, SKU, ratings
- **Pricing**: Current price, original price, and discount display
- **Product Options**: Dial color (Black/Silver/Blue), Strap material selectors
- **Quantity Selector**: Increase/decrease quantity controls
- **Action Buttons**: Add to Cart and Buy Now buttons
- **Product Features**: Bulleted list of key features
- **Specifications**: Detailed product specifications table
- **Fully Responsive**: Mobile-friendly layout
- **Sticky Images**: Left side images stay visible while scrolling product details

## Image Setup

Place your Titan Edge product images in the `imgs` folder with the following naming convention:

**Black Dial (Default):**
- `edge_1.jpg` through `edge_6.jpg`

**Silver Dial:**
- `edge_silver_1.jpg` through `edge_silver_6.jpg`

**Blue Dial:**
- `edge_blue_1.jpg` through `edge_blue_6.jpg`

## Usage

### In Franklin/AEM Universal Editor

1. Add a section to your page
2. Insert a block and select "PDP TitanEdge"
3. The block will automatically render with the default content

### Customization

Edit `pdp-TitanEdge.js` to:
- Update product details (title, price, SKU, description)
- Change image filenames
- Modify color options
- Adjust specifications

## Features

- **Auto-generating**: Block creates HTML structure automatically when added in UE
- **Interactive**: Image gallery, quantity controls, color selection
- **Responsive**: Desktop and mobile optimized
- **Sticky layout**: Images stay visible while scrolling details

## Image Guidelines

- **Format**: JPG recommended
- **Thumbnails**: 80x80px display size
- **Main images**: High resolution (600px+ width)
- **File naming**: Use simple names without spaces or special characters

## CSS Variables

The block uses these CSS variables for theming:
- `--main-accent-color`: Primary button and accent color
- `--link-hover-color`: Hover state color
- `--text-color`: Main text color

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- ES6+ JavaScript

