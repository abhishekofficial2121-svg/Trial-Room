# Integration — Trial Room V1

## JavaScript embed

```html
<script src="https://cdn.trialroom.example/widget.js" data-merchant-id="merchant_123"></script>
<button data-trial-room data-product-id="product_123">Try It On</button>
```

The widget must receive the currently selected product and variant. If the shopper changes the variant, the widget uses the corresponding product image and metadata.

## Widget delivery

Framework-independent browser bundle (custom element or iframe — decision pending Phase 1 review).