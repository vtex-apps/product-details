# VTEX Product Details

## Description

The VTEX Category Menu app shows the details of a product like image, name and price. THis app is used by store theme.

:loudspeaker: **Disclaimer:** Don't fork this project. Use, contribute, or open issue with your feature request.

## Release schedule

| Release | Status              | Initial Release | Maintenance LTS Start | End-of-life | Dreamstore Compatibility |
| :-----: | :-----------------: | :-------------: | :-------------------: | :---------: | :----------------------: |
| [1.x]   | **Current Release** | 2018-11-28      |                       |             | 2.x                      |
| [0.x]   | **Maintenance LTS** | 2018-05-29      | 2018-11-28            | March 2019  | 1.x                      |

See our [LTS policy](https://github.com/vtex-apps/awesome-io#lts-policy) for more information.

## Table of Contents

- [VTEX Product Details](#vtex-product-details)
  - [Description](#description)
  - [Release schedule](#release-schedule)
  - [Table of Contents](#table-of-contents)
  - [Usage](#usage)
    - [Blocks API](#blocks-api)
      - [Configuration](#configuration)
    - [Styles API](#styles-api)
      - [CSS namespaces](#css-namespaces)
  - [Troubleshooting](#troubleshooting)
  - [Tests](#tests)
    - [Travis CI](#travis-ci)

## Usage

This app uses our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

We add the product-details as a block in our [Store Header](https://github.com/vtex-apps/store-header/blob/master/store/interfaces.json).

To configure or customize this app, you need to import it in your dependencies in `manifest.json`.

```json
  dependencies: {
    "vtex.product-details": "1.x"
  }
```

Then, add `product-details` block into your app theme, like we do in our [Store theme app](https://github.com/vtex-apps/store-theme/blob/master/store/blocks.json).

Now, you can change the behavior of the `product-details` block that is in the store header. See an example of how to configure:

```json
  "product-details": {
    "blocks": [
      "breadcrumb",
      "product-name",
      "product-images",
      "product-price",
      "product-description",
      "product-specifications",
      "buy-button",
      "sku-selector",
      "shipping-simulator",
      "availability-subscriber",
      "share"
    ],
    "props": {
      "displayVertically": true,
      "share": {
        "social": {
          "Facebook": true,
          "WhatsApp": true,
          "Twitter": false
        }
      },
      "price": {
        "labelSellingPrice": null,
        "showListPrice": true,
        "showLabels": true,
        "showInstallments": true,
        "showSavings": true
      },
      "name": {
        "showBrandName": false,
        "showSku": false,
        "showProductReference": false
      }
    }
  }
```

### Blocks API

When implementing this app as a block, various inner blocks may be available. The following interface lists the available blocks within `product-details` and describes if they are required or optional.

```json
{
  "product-details": {
    "required": [
      "product-images",
      "product-name",
      "product-price",
      "sku-selector",
      "buy-button",
      "product-description",
      "product-specifications"
    ],
    "allowed": [
      "breadcrumb",
      "shipping-simulator",
      "availability-subscriber",
      "share",
      "product-highlights",
      "product-quantity-selector",
      "flex-layout"
    ],
    "component": "ProductDetailsLegacy"
  }
}
```

#### Configuration

Through the Storefront you can change the behavior and interface of `ProductDetails`. But, you can also make adjusts in your theme app, like Store does.

| Prop name               | Type      | Description                                                       | Default Value |
| ----------------------- | --------- | ----------------------------------------------------------------- | ------------- |
| `price`                 | `Object`  | Configures the product price area (More info on the table bellow) | false         |
| `name`                  | `Object`  | Configures the product name area (More info on the table bellow)  | false         |
| `displayVertically`     | `Boolean` | Whether to display the preview images on the vertical or not      | false         |
| `showSpecificationsTab` | `Boolean` | Whether to display the product specification on tab mode or not   | false         |

Price:

| Prop name           | Type      | Description                                    |
| ------------------- | --------- | ---------------------------------------------- |
| `showListPrice`     | `Boolean` | Shows the list prices                          | true   |
| `showLabels`        | `Boolean` | Shows the labels in the price and installments | true   |
| `showInstallments`  | `Boolean` | Shows the installments information             | true   |
| `showSavings`       | `Boolean` | Shows the savings information                  | true   |
| `labelSellingPrice` | `String`  | Text of the label before the price             | `null` |

Name:

| Prop name              | Type      | Description                          |
| ---------------------- | --------- | ------------------------------------ |
| `showProductReference` | `Boolean` | Shows the product reference          | false |
| `showBrandName`        | `Boolean` | Shows the brand name of the product  | false |
| `showSku`              | `Boolean` | Shows the sku value for this product | false |

Highlight:

| Prop name          | Type      | Description                                                                                                            |
| ------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------- |
| `defaultHighlight` | `boolean` | Indicates whether the group chosen as the highlight will contain all the properties in product or a group typed entry. |
| true               |
| `showHighlights`   | `Boolean` | Shows the highlights of the product                                                                                    | true |
| `highlightGroup`   |

Specification:

| Prop name             | Type      | Description                                                                                        |
| --------------------- | --------- | -------------------------------------------------------------------------------------------------- |
| `showSpecifications`  | `boolean` | Show the specifications of the product                                                             |
| `specificationGroups` | `object`  | Define if will be displayed all the specifications of the product or a set of this specifications. |
| `viewMode`            | `string`  | Define what is the current view mode for the specifications.                                       |
| `typeSpecifications`  | `string`  | indicates which specifications will be displayed                                                   |

Also, you can configure the `share` that is defined on `ProductDetails`. See [here](https://github.com/vtex-apps/store-components/blob/master/react/components/Share/README.md) the `Share` API.

### Styles API

This app provides some CSS classes as an API for style customization.

To use this CSS API, you must add the `styles` builder and create an app styling CSS file.

1. Add the `styles` builder to your `manifest.json`:

```json
  "builders": {
    "styles": "1.x"
  }
```

2. Create a file called `vtex.product-details.css` inside the `styles/css` folder. Add your custom styles:

```css
.container {
  margin-top: 10px;
}
```

#### CSS namespaces

Below, we describe the namespaces that is define in the `ProductDetails`.

| Class name              | Description                              | Component Source                                            |
| ----------------------- | ---------------------------------------- | ----------------------------------------------------------- |
| `container`             | The main container of Product Details    | [productDetails](/react/productDetails.js)                  |
| `nameContainer`         | The container of the name area           | [productDetails](/react/productDetails.js)                  |
| `detailsContainer`      | The container of the details area        | [productDetails](/react/productDetails.js)                  |
| `priceContainer`        | The container of the price area          | [productDetails](/react/productDetails.js)                  |
| `informationsContainer` | The container of the information area    | [productDetails](/react/productDetails.js)                  |
| `fixedButton`           | The product buy button                   | [FixedButton/index](/react/components/FixedButton/index.js) |
| `highlightsContainer`   | The container of product highlights area | [productDetails](/react/productDetails.js)                  |

## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/product-details/issues). Also feel free to [open issues](https://github.com/vtex-apps/product-details/issues/new) or contribute with pull requests.

## Tests

To execute our tests go to `react/` folder and run `yarn test`

### Travis CI

[![Build Status](https://travis-ci.org/vtex-apps/product-details.svg?branch=master)](https://travis-ci.org/vtex-apps/product-details)
