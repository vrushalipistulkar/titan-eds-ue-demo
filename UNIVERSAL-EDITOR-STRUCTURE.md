# Universal Editor HTML Structure for Cards with Mobile Images

## Current Structure (What You're Seeing)

```html
<li data-aue-resource="..." data-aue-model="card" class="active">
  <!-- Column 1: Desktop Image -->
  <div>
    <picture>
      <source type="image/webp" srcset="...aloha-spirits-in-northern-norway.jpg...">
      <img loading="lazy" alt="" 
           src="...aloha-spirits-in-northern-norway.jpg..." 
           data-aue-prop="image" 
           data-aue-label="Image" 
           data-aue-type="media">
    </picture>
  </div>
  
  <!-- Column 2: Text Content -->
  <div>
    <div data-aue-prop="text" 
         data-aue-label="Text" 
         data-aue-filter="text" 
         data-aue-type="richtext">
      <p>Vrushali</p>
    </div>
  </div>
</li>
```

## Expected Structure (With Mobile Image Field)

```html
<li data-aue-resource="..." data-aue-model="card" class="active">
  <!-- Column 1: Desktop Image -->
  <div>
    <picture>
      <source type="image/webp" srcset="...aloha-spirits-in-northern-norway.jpg...">
      <img loading="lazy" alt="" 
           src="...aloha-spirits-in-northern-norway.jpg..." 
           data-aue-prop="image" 
           data-aue-label="Image" 
           data-aue-type="media">
    </picture>
  </div>
  
  <!-- Column 2: Text Content -->
  <div>
    <div data-aue-prop="text" 
         data-aue-label="Text" 
         data-aue-filter="text" 
         data-aue-type="richtext">
      <p>Vrushali</p>
    </div>
  </div>
  
  <!-- Column 3: Mobile Image (THIS IS MISSING) -->
  <div>
    <picture>
      <source type="image/webp" srcset="...default-banner-image.png...">
      <img loading="lazy" alt="" 
           src="...default-banner-image.png..." 
           data-aue-prop="mobileImage" 
           data-aue-label="Mobile Image" 
           data-aue-type="media">
    </picture>
  </div>
  
  <!-- Column 4: Mobile Image Alt Text (if needed) -->
  <div>
    <div data-aue-prop="mobileImageAlt" 
         data-aue-label="Mobile Image Alt Text" 
         data-aue-type="text">
      Alt text here
    </div>
  </div>
</li>
```

## Issue

The mobile image field (`mobileImage`) is defined in the card model but is NOT being rendered into the HTML DOM by Universal Editor. This is why our JavaScript cannot find it.

## Possible Causes

1. **Empty Field Optimization**: Universal Editor might not render empty or optional fields
2. **Field Type**: The `reference` type field might need special handling
3. **Rendering Configuration**: The field might need explicit rendering configuration

## Solutions

### Solution 1: Check Universal Editor Console (Immediate)

The `mobileImage` and `mobileImageAlt` fields should appear in the card editing panel (as shown in your screenshot). After filling them in:

1. Save/Publish the content
2. Refresh the page
3. Inspect the HTML to see if the fields now render

### Solution 2: Verify Field is Saving (Debug)

1. Open browser DevTools
2. Check Network tab when saving
3. Verify the `mobileImage` value is being sent to the server

### Solution 3: Update Card Rendering (If fields don't render)

If Universal Editor still doesn't render the fields, we may need to:

1. Check if there's a card template that controls rendering
2. Update the template to explicitly include mobileImage fields
3. Or modify our JavaScript to read from the content model API

## Testing Steps

1. **Fill in both fields in Universal Editor:**
   - Image: Select "default-banner-image.png"
   - Mobile Image: Select "default-banner-image.png" 
   - Mobile Image Alt Text: "Mobile banner"

2. **Save and Publish**

3. **Inspect the rendered HTML:**
   ```javascript
   // In browser console
   document.querySelector('[data-aue-model="card"]').innerHTML
   ```

4. **Look for:**
   ```
   data-aue-prop="mobileImage"
   ```

## Current JavaScript Logic

Our carousel.js is set up to handle mobile images in TWO ways:

### Way 1: Traditional Authoring (Column-based)
```javascript
// Reads from columns[4] (5th column)
const mobileImageColumn = columns[4];
```

### Way 2: Universal Editor (Data attribute-based)
```javascript
// Looks for data-aue-prop="mobileImage" element
const mobileImageElement = cardItem.querySelector('[data-aue-prop="mobileImage"]');
```

Both methods will work ONCE the mobile image field is rendered into the DOM.

## Next Steps

1. ✅ The model is correct (fields are defined)
2. ✅ The UI is correct (fields appear in editor)
3. ❓ The rendering needs verification (fields should appear in HTML)
4. ✅ The JavaScript is ready (will process once fields render)

**ACTION REQUIRED**: We need to verify that when you save a card with a mobile image in Universal Editor, that mobile image renders as a `<div>` element with `data-aue-prop="mobileImage"` in the published HTML.

