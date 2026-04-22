# Shopify Dawn Theme - Custom PDP Logic Implementation

## Context
- Theme: Dawn
- Page: Product (PDP)
- Goal: Fully dynamic variant-based UI + AJAX cart behavior
- Use Shopify AJAX Cart API for all cart operations  
  (e.g. `/cart/add.js`, `/cart/change.js`)

---

## 1. Product Images Logic

### Requirements

- Replace dummy images with actual product images
- If product has ONLY 1 image:
  - Disable Swiper slider
  - Show single static image
  - Hide thumbnails:
    - `.product-intro_showOnDesktopOnly__qAyia`

- If product has MULTIPLE images:
  - Enable Swiper slider
  - Show thumbnails

### Popup
- Apply same logic inside popup gallery

---

## 2. Variant Listing

### Container
```
.pane_pane__h9PPS
```

### Behavior
- Render all product variants dynamically

---

## 3. Variant Image (Metafield)

### Selector
```
.product-shade-selector_shadeImageWrapper__roXhZ
```

### Logic
- Load image from variant metafield:
```
variant.metafields.custom.shades_image
```

---

## 4. Out of Stock State

### Class
```
.product-shade-selector_outOfStock__4dIoQ
```

### Apply When
- `variant.available == false`

---

## 5. Dynamic Price

### Container
```
.product-stacked-price_priceInfo__Imdcp
```

### Behavior
- Update price on variant change
- Use selected variant price

---

## 6. Add to Bag vs Quantity Selector (CRITICAL)

### Rule: Variant-based logic (NOT product-based)

---

### Case A: Variant NOT in Cart
- Show:
  - Add to Bag button
- Hide:
  - Quantity selector

---

### Case B: Variant ALREADY in Cart
- Hide:
  - Add to Bag button
- Show:
  - `.product-actions_quantitySelectorPrio__uEyhI`

---

### Must Work:
- On page load
- On variant change (runtime)

---

### Example Flow

- Suppose  variant A selected
- If not in cart → show Add to Bag
- Add variant A → show quantity selector
- Switch to variant B:
  - If not in cart → show Add to Bag

---

## 7. Cart Buttons Logic

### Buttons
```
.beacon-cart-mod-btn
```

### Behavior (based on aria-label)
- `"Increase quantity"` → increment
- `"Decrease quantity"` → decrement

---

## 8. Quantity Input

### Selector
```
.quantity-selector_quantityInput__ZG_I4
```

### Requirements

#### Dynamic Value
- Reflect current variant quantity in cart

#### Max Limit
- Must not exceed:
```
variant.inventory_quantity
```

Example:
- Stock = 10 → user cannot add >10

---

## 9. Cart State Handling

### Requirement
- Maintain variant-specific cart state

Example:
- Variant A → quantity selector
- Variant B → Add to Bag

---

## 10. Wishlist

- Keep static (no logic required)

---

## 11. Product Tabs

### Container
```
.product-more-info_pdpTabs__8bOJN
```

### Behavior
- Only FIRST tab (Description) should be dynamic
- Ignore other tabs

---

## 12. Technical Implementation Notes

### Use AJAX Cart API

#### Add to Cart
```js
POST /cart/add.js
```

#### Update Quantity
```js
POST /cart/change.js
```

#### Get Cart
```js
GET /cart.js
```

---

### Important

- Do NOT reload page on cart actions
- Update UI dynamically after every cart change
- Sync UI with latest cart state

---

## Final Goal

Build a fully dynamic PDP where:

- Images adapt based on count
- Variants control UI behavior
- Cart state is variant-specific
- Quantity respects inventory
- No page reloads (AJAX based)
