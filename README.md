# Product Details

Product Details is a canonical component that any VTEX store can use.

## Usage

To use it, you need to add the dependency in your `manifest.json`

```json
{
  "dependencies": {
    "vtex.product-details": "0.2.x"
  }
}
```

You can use it in your code like so

```jsx
<ExtensionPoint id="product-details" />
```

And in your `pages.json`

```json
{
  "extensions": {
    "product-details": {
      "component": "vtex.product-details/ProductDetails"
    }
  }
}
```

