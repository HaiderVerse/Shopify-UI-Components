# Interactive Hotspot Component for Shopify

A fully customizable interactive hotspot/lookbook section for Shopify that allows you to highlight specific areas on an image with clickable points that reveal product information in tooltips.

![Hotspot Example](hotspot-example.png)

## 📋 Overview

This component creates an interactive image experience where users can click or hover over hotspot markers to reveal detailed product information, descriptions, and call-to-action buttons. Perfect for lookbooks, product showcases, and interactive product demonstrations.

## ✨ Features

- **Interactive Hotspots**: Clickable/hoverable points with animated pulse effect
- **Responsive Design**: Separate positioning for mobile and desktop views
- **Smart Tooltips**: Auto-positioning tooltips using Floating UI library
- **Product Integration**: Direct Shopify product linking with price display
- **Fully Customizable**: Extensive styling options through Shopify theme editor
- **Mobile Optimized**: Touch-friendly interactions for mobile devices
- **Animated Effects**: Pulse animations and smooth transitions
- **Multiple Hotspots**: Add unlimited hotspot points per image

## 🎨 Customization Options

### Section Settings

- **Background & Text Colors**: Customize section background and text colors
- **Container Options**: Enable/disable container wrapper with custom max-width
- **Header Alignment**: Left or center-aligned section header
- **Image Settings**: Separate images for mobile and desktop with border-radius control
- **Point Styling**: Custom color and size for hotspot markers
- **Tooltip Settings**: Width, text alignment, background, and text color
- **Spacing Controls**: Adjustable padding (top/bottom)

### Block Settings (Per Hotspot)

- **Content**: Title, subtitle, and description
- **Product Integration**: Link to Shopify products with optional price display
- **Custom Image**: Add product images to tooltips
- **CTA Button**: Customizable button text and product link
- **Position Control**: Separate positioning for mobile and desktop (percentage-based)

## 🚀 Installation

### Step 1: Add the Section File

1. In your Shopify admin, go to **Online Store > Themes**
2. Click **Actions > Edit code**
3. In the **Sections** folder, create a new section file named `hotspot.liquid`
4. Copy the entire contents of `hotspot.liquid` from this repository
5. Save the file

### Step 2: Add to Your Theme

1. Go to your theme editor (**Customize**)
2. Navigate to the page where you want to add the hotspot section
3. Click **Add section**
4. Search for "RS Hotspot" and select it

## 📖 Usage Guide

### Basic Setup

1. **Upload Images**:
   - Add a mobile image (recommended: 800px wide)
   - Add a desktop image (recommended: 1600px wide)

2. **Add Hotspot Points**:
   - Click "Add point" to create a new hotspot
   - Configure the title, subtitle, and description
   - Optionally link a product for automatic price display

3. **Position Hotspots**:
   - Use the position sliders to place hotspots on your image
   - Set different positions for mobile and desktop views
   - Use percentage values for responsive positioning

4. **Customize Appearance**:
   - Adjust colors, sizes, and spacing in section settings
   - Customize tooltip width and alignment
   - Set point diameter and animation color

### Positioning Tips

- Position values are percentage-based (0-100%)
- **Left**: Distance from the left edge (0% = far left, 100% = far right)
- **Top**: Distance from the top edge (0% = top, 100% = bottom)
- Preview on different screen sizes to ensure proper alignment

## 🎯 Use Cases

- **Product Lookbooks**: Showcase complete outfits with links to individual items
- **Pain Point Marketing**: Highlight specific benefits or features (like the example image)
- **Interactive Product Tours**: Guide users through product features
- **Before/After Showcases**: Mark specific areas of improvement
- **Ingredient Spotlights**: Highlight key ingredients or components
- **Feature Demonstrations**: Show off product capabilities interactively

## 💡 Technical Details

### Dependencies

The component automatically loads the following external libraries:
- **Floating UI Core** (v1.6.0): For intelligent tooltip positioning
- **Floating UI DOM** (v1.6.1): For DOM-specific tooltip calculations

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Internet Explorer not supported

### Performance

- Lazy loading images for better performance
- Optimized animations using CSS transforms
- Efficient event handling with proper cleanup
- Automatic script injection for dependencies

## 🔧 Customization Examples

### Change Hotspot Color
```liquid
Settings > Points > Point color: #D7342B
```

### Adjust Tooltip Width
```liquid
Settings > Tooltip > Tooltip width: 320px
```

### Position Hotspot on Mobile
```liquid
Block Settings > Point position - Mobile
Left: 20%
Top: 35%
```

### Add Product Link
```liquid
Block Settings > Product > Select your product
Button text: "BUY NOW"
Show price: ✓ Enabled
```

## 📱 Responsive Behavior

- **Desktop**: Tooltips appear on hover with auto-positioning
- **Mobile**: Tooltips appear on tap with click-outside-to-close functionality
- **Touch Devices**: Optimized touch targets and interactions
- **Small Screens**: Reduced tooltip sizes and adjusted spacing

## 🎨 Styling Hooks

Key CSS classes for custom styling:

- `.ks-lookbook`: Main container
- `.ks-lookbook-point-list-item`: Individual hotspot
- `.ks-tooltip`: Tooltip container
- `.ks-lookbook-product-img`: Product image in tooltip
- `.ks-lookbook-product-price`: Price display

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit pull requests.

## 📄 License

This component is available for use in Shopify themes. Please review your Shopify theme license for usage terms.

## 🆘 Support

For issues or questions:
1. Check the customization options in the theme editor
2. Verify image dimensions and positioning values
3. Test on different devices and browsers
4. Review browser console for any JavaScript errors

## 🔄 Version History

- **v1.0**: Initial release with core functionality
  - Interactive hotspots with tooltips
  - Product integration
  - Responsive positioning
  - Custom styling options

---

**Note**: This component uses custom web components (`<ks-lookbook>`) and requires modern browser support. The example image shows a "Pain Relief in a Bottle" campaign demonstrating the hotspot functionality for highlighting different body parts and their associated product benefits.
