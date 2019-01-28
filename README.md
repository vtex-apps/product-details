# Product Details

Product Details is a canonical component that any VTEX store can use.

## Release schedule
| Release  | Status              | Initial Release | Maintenance LTS Start | End-of-life | Dreamstore Compatibility
| :--:     | :---:               |  :---:          | :---:                 | :---:       | :---: 
| [0.x]    | **Maintenance LTS** |  2018-05-29     | 2018-11-28            | March 2019  | 1.x
| [1.x]    | **Current Release** |  2018-11-28     |                       |             | 2.x

## Usage

To use it, you need to add the dependency in your `manifest.json`

```json
{
  "dependencies": {
    "vtex.product-details": "0.x"
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

