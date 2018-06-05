# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Add `SkuSelector` and `Share` components.

### Updated
- Sku items sorted by the each one's price.

### Changed
- Update props passed to `ShippingSimulator`.

## [0.2.0] - 2018-05-29
### Changed
- Requesting ProductReference info from product and passing it to `vtex.store-components/ProductName`

## [0.2.0] - 2018-05-29
### Changed
- Integration with `vtex.store-components/TechnicalSpecifications`, this component is inside of `vtex.store-components/ProductDescription`.

### Fixed
- Fix Product query to get SKU installments.

## [0.1.1] - 2018-05-24
### Added
- Integrate with `vtex.store-components/TechnicalSpecifications`.

### Changed
- Update `store-components` version/name.

## [0.1.0] - 2018-05-21
### Added
- Integrate with `vtex.store-components/Slider`.
- Add `vtex.store-components/ShippingSimulator`.

### Changed
- Remove `@vtex/product-details` dependency and _Price_ Component and use `vtex.store-components`.
- Update `vtex.store-components` dependency version to `1.x`.
- Remove _ProductImages_ Component to use `vtex.store-components` updated version.

## [0.0.6] - 2018-05-14
### Fixed
- Fix bug of different images size
- Update the spinner to be in the center.
- `ProductImages` component not updating selected image when props changed.
- Fix arrows z-index

## [0.0.5] - 2018-05-12
### Fixed
- Fix warning of required properties on images of product details

## [0.0.4] - 2018-05-12
### Fixed
- Fix responsivity of mobile product images

## [0.0.3] - 2018-05-12
### Added
- Add _ProductDescription_ Component and savings information in _Price_ Component.

### Fixed
- Remove padding and use _ProductName_ from `vtex.store-components`.

## [0.0.2] - 2018-05-10
### Fixed
- Parse `sellerId` to int on buy button call.

## [0.0.1] - 2018-05-09
### Added
- Add the Mobile version to the Component.
- Add the _ProductImages_ Component.
- Add the Product Query and remove _ProductFactory_ (mocks).
- Add the _ProductName_, _Price_ and _BuyButton_ Components.
* Add the initial files to link the App.

### Changed
- Update _BuyButton_ version.
