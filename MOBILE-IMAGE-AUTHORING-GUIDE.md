# Mobile Image Authoring Guide

## Overview
Both Carousel and Cards blocks now support separate mobile and desktop images that display responsively based on screen size.

---

## 📝 Traditional Authoring (Document-Based)

### Carousel Block Structure

When authoring in Google Docs/Word documents, use a table with **5 columns** (mobile image is optional):

| Column 1 | Column 2 | Column 3 | Column 4 | Column 5 |
|----------|----------|----------|----------|----------|
| **Desktop Image** | **Content/Text** | **Card Style** | **CTA Style** | **Mobile Image** |
| (Required) | (Required) | (Optional) | (Optional) | (Optional) |

### Example: Carousel with Mobile Images

```
Carousel
---------------------------------------------------
| Desktop-Image-1.jpg | ## Slide 1 Title          | image-top      | cta-button | Mobile-Image-1.jpg |
|                     | Description text here...   |                |            |                    |
|                     | [Learn More](#)           |                |            |                    |
---------------------------------------------------
| Desktop-Image-2.jpg | ## Slide 2 Title          | teaser-overlay | cta-button | Mobile-Image-2.jpg |
|                     | More content here...      |                |            |                    |
|                     | [Get Started](#)          |                |            |                    |
---------------------------------------------------
```

### Example: Carousel WITHOUT Mobile Images (Backward Compatible)

```
Carousel
-------------------------------------------
| Desktop-Image.jpg | ## Slide Title    | image-top | cta-button |
|                   | Description...     |           |            |
|                   | [Learn More](#)   |           |            |
-------------------------------------------
```

### Cards Block Structure

Same 5-column structure:

```
Cards
---------------------------------------------------
| Desktop-Image-1.jpg | ## Card 1 Title           | image-top | button | Mobile-Image-1.jpg |
|                     | Card description...       |           |        |                    |
|                     | [Read More](#)           |           |        |                    |
---------------------------------------------------
| Desktop-Image-2.jpg | ## Card 2 Title           | image-top | button | Mobile-Image-2.jpg |
|                     | Card description...       |           |        |                    |
---------------------------------------------------
```

---

## 🎨 Universal Editor Authoring

### Step-by-Step: Adding a Carousel with Mobile Images

1. **Add Carousel Block**
   - Click "+" to add component
   - Select "Carousel"

2. **Add Card Items**
   - Click "Add Card" or "+" inside carousel
   - Select "Card"

3. **Configure Each Card:**

   **Image (Desktop)**
   - Click "Select Image" or "Browse"
   - Choose your desktop/landscape image
   - Recommended: 1920x1080px or 16:9 aspect ratio

   **Text**
   - Add your heading, description, and CTA links
   - Use rich text formatting

   **Mobile Image** ⭐ NEW
   - Click "Select Image" under "Mobile Image"
   - Choose your mobile-optimized image
   - Recommended: Portrait orientation or 9:16 aspect ratio
   - Leave empty to use desktop image on all screens

   **Mobile Image Alt Text** ⭐ NEW
   - Add descriptive alt text for accessibility
   - Should describe the mobile image specifically

   **Style** (Optional)
   - Choose card layout:
     - `default` - Standard layout
     - `image-top` - Image above content
     - `image-bottom` - Image below content
     - `image-left` - Image on left, content on right
     - `image-right` - Image on right, content on left
     - `teaser-overlay` - Full overlay text
     - `teaser-card` - Card overlay at bottom

   **CTA Style** (Optional)
   - Choose button style:
     - `cta-link` - Text link
     - `cta-button` - Primary button
     - `cta-button-secondary` - Secondary button

4. **Repeat** for additional cards/slides

### Step-by-Step: Adding Cards with Mobile Images

Same process as Carousel:

1. Add "Cards" block
2. Add "Card" items
3. Fill in the same fields (Image, Text, Mobile Image, Mobile Image Alt Text, Style, CTA Style)

---

## 📱 How It Works

### Responsive Behavior

**Mobile Screens (< 768px)**
- Displays the Mobile Image (if provided)
- Falls back to Desktop Image if no mobile image provided

**Desktop Screens (≥ 768px)**
- Always displays the Desktop Image

### Technical Implementation

The system creates responsive HTML `<picture>` elements:

```html
<picture>
  <!-- Mobile image for screens < 768px -->
  <source srcset="mobile-image.jpg" media="(max-width: 767px)">
  
  <!-- Desktop image for screens >= 768px -->
  <source srcset="desktop-image.jpg" media="(min-width: 768px)">
  
  <!-- Fallback -->
  <img src="desktop-image.jpg" alt="Description">
</picture>
```

---

## 💡 Best Practices

### When to Use Mobile Images

✅ **Good Use Cases:**
- Portrait vs landscape orientations
- Different focal points (close-up for mobile, wide shot for desktop)
- Text-heavy images that need larger text on mobile
- Different compositions optimized for screen size
- Reducing file size for mobile users

❌ **Skip Mobile Image When:**
- Desktop image works well on all screens
- Simple images without text
- Square or already mobile-friendly images

### Image Recommendations

**Desktop Images:**
- Aspect ratio: 16:9 or 3:2
- Resolution: 1920x1080px or higher
- Format: JPEG for photos, PNG for graphics
- Optimize file size (< 500KB)

**Mobile Images:**
- Aspect ratio: 9:16, 3:4, or 1:1
- Resolution: 1080x1920px (portrait) or 1080x1080px (square)
- Format: JPEG for photos, PNG for graphics
- Optimize file size (< 300KB for faster mobile loading)

### Accessibility

- **Always** provide alt text for both images
- Alt text should describe the image content
- Mobile image alt text can differ if content differs

---

## 🔍 Examples

### Example 1: Hero Carousel with Different Crops

**Desktop Image:** Wide landscape shot showing entire scene (1920x1080)
**Mobile Image:** Portrait crop focusing on main subject (1080x1920)

### Example 2: Product Carousel

**Desktop Image:** Product with environment context (16:9)
**Mobile Image:** Close-up of product (1:1 or 3:4)

### Example 3: Text-Heavy Banner

**Desktop Image:** Banner with small text (readable on large screens)
**Mobile Image:** Same banner with larger, simplified text

### Example 4: Cards Grid - No Mobile Image Needed

**Desktop Image Only:** Simple product photos that work on all screens
**Mobile Image:** Leave empty - desktop image will display everywhere

---

## ✅ Backward Compatibility

### Existing Content (4 columns)
All existing carousels and cards with only 4 columns will continue to work without any changes:

| Desktop Image | Content | Style | CTA Style |
|---------------|---------|-------|-----------|
| ✅ Works as before | ✅ | ✅ | ✅ |

### New Content (5 columns)
Optionally add mobile image as 5th column:

| Desktop Image | Content | Style | CTA Style | Mobile Image |
|---------------|---------|-------|-----------|--------------|
| ✅ | ✅ | ✅ | ✅ | ✨ Optional |

---

## 🎯 Quick Reference

### Column Structure
1. **Desktop Image** - Required
2. **Content/Text** - Required
3. **Card Style** - Optional (default, image-top, image-left, etc.)
4. **CTA Style** - Optional (cta-link, cta-button, etc.)
5. **Mobile Image** - Optional ⭐ NEW

### Breakpoint
- Mobile: `< 768px`
- Desktop: `≥ 768px`

### Applies To
- ✅ Carousel Block
- ✅ Cards Block

---

## 🆘 Troubleshooting

**Q: Mobile image not showing on mobile?**
- Check that mobile image is in column 5 (or Mobile Image field in Universal Editor)
- Verify image is uploaded and accessible
- Clear browser cache and test

**Q: Desktop image showing on mobile instead of mobile image?**
- Ensure mobile image field is filled
- Check image path/URL is correct
- Test on actual mobile device or resize browser below 768px

**Q: Styles broken after adding mobile image?**
- Verify you're using 5 columns (not 6+)
- Check that style config is in column 3, CTA in column 4
- Mobile image should be in column 5 only

**Q: Can I use mobile images with all card styles?**
- Yes! Mobile images work with all style variants (image-top, image-left, teaser-overlay, etc.)

