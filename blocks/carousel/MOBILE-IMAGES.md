# Carousel Mobile Images Feature

## Overview
The carousel block now supports separate mobile images that display on screens smaller than 768px, while desktop images display on larger screens.

## How to Use

### Authoring Structure
When authoring a carousel in your content, each slide row can now have up to 5 columns:

| Column 1 (Required) | Column 2 (Required) | Column 3 (Optional) | Column 4 (Optional) | Column 5 (Optional) |
|---------------------|---------------------|---------------------|---------------------|---------------------|
| Desktop Image       | Content/Text        | Card Style          | CTA Style           | Mobile Image        |

### Adding Mobile Images

1. **Without Mobile Image (Original/Backward Compatible)**
   - Use the standard 4-column structure
   - The desktop image will display on all screen sizes
   - Example:
     ```
     | Desktop Image | Content | Card Style | CTA Style |
     ```

2. **With Mobile Image (New Feature)**
   - Add a 5th column with your mobile-optimized image
   - Mobile image will display on screens < 768px
   - Desktop image will display on screens >= 768px
   - Example:
     ```
     | Desktop Image | Content | Card Style | CTA Style | Mobile Image |
     ```

## Technical Details

### Breakpoint
- **Mobile**: Screens with width < 768px
- **Desktop**: Screens with width >= 768px

### Image Optimization
- Both desktop and mobile images are optimized using the `createOptimizedPicture` function
- Responsive `<picture>` elements are created with `<source>` tags for proper media queries
- Fallback to desktop image if mobile image is not provided

### Browser Compatibility
- Uses standard HTML `<picture>` element with `<source>` tags
- Supported in all modern browsers
- Graceful fallback for older browsers

## Example Use Cases

1. **Portrait vs Landscape**: Use a portrait-oriented image for mobile and landscape for desktop
2. **Text Readability**: Use images with larger text/elements for mobile viewing
3. **Focus Areas**: Crop differently for mobile to focus on key elements
4. **File Size**: Provide smaller file sizes for mobile devices

## Backward Compatibility

✅ **Fully Backward Compatible**
- Existing carousels with 4 columns will continue to work without any changes
- No migration required for existing content
- The feature is opt-in - only add the 5th column when you need mobile images

## Notes

- If the 5th column is empty or doesn't contain an image, the desktop image will be used for all screen sizes
- Both desktop and mobile images support alt text for accessibility
- Images maintain their aspect ratios and styling based on card styles (image-top, image-left, etc.)

