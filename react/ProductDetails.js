import React, { useContext, useMemo, useCallback } from 'react'
import { path, prop, propOr, pathOr } from 'ramda'
import { injectIntl, FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { ProductContext } from 'vtex.product-context'

import classNames from 'classnames'

import { ExtensionPoint } from 'vtex.render-runtime'
import { Container } from 'vtex.store-components'

import { changeImageUrlSize } from './utils/generateUrl'
import FixedButton from './components/FixedButton'

import { schema } from './utils/schema'

import productDetails from './productDetails.css'

const productNameLoaderStyles = {
  'vtex-product-name__brand--loader': {
    x: 0,
    width: '100%',
    height: '1.631em',
  },
  'vtex-product-name__sku--loader': {
    x: 0,
    y: '2.569em',
    width: '10.311em',
    height: '1.045em',
  },
}

const productPriceLoaderStyles = {
  'vtex-price-list__container--loader': {
    x: 0,
    width: '7.219em',
    height: '0.56em',
  },
  'vtex-price-selling__label--loader': {
    x: 0,
    y: '2em',
    width: '2.85em',
    height: '1.08em',
  },
  'vtex-price-selling--loader': {
    x: '3.25em',
    y: '0.86em',
    width: '14.572em',
    height: '2.176em',
  },
  'vtex-price-installments--loader': {
    x: 0,
    y: '3.75em',
    width: '12em',
    height: '0.825em',
  },
  'vtex-price-savings--loader': {
    x: 0,
    y: '5em',
    width: '10em',
    height: '0.686em',
  },
}
const thresholds = [640]
const imageSizes = [1280, 1920]
const thumbnailSize = 160

const useSpecifications = (product, specificationsDefault) => {
  return useMemo(() => {
    const option = path(
      ['specificationGroups', 'specification'],
      specificationsDefault
    )
    const allSpecifications = propOr([], 'properties', product)
    const getFromProperties = () => {
      const typedSpecifications = pathOr(
        '',
        ['specificationGroups', 'typeSpecifications'],
        specificationsDefault
      )
      const specificationNames = typedSpecifications.trim().split(',')
      const specifications = specificationNames.reduce((acc, item) => {
        const specification = allSpecifications.filter(
          spec => spec.name.toLowerCase() === item.trim().toLowerCase()
        )
        return acc.concat(specification)
      }, [])
      return specifications
    }
  
    switch (option) {
      case 'admin/editor.product-details.product-specifications.chooseDefaultSpecification':
        return getFromProperties()
      default:
        return allSpecifications
    }
  }, [product, specificationsDefault])
}

const useHighlights = (product, highlightGroupDefault) => {
  return useMemo(() => {
    const option = pathOr(
      '',
      ['highlightGroupDefault', 'highlight'],
      highlightGroupDefault
    )
    const highlightsFromGroup = () => {
      const typeHighlight = pathOr(
        '',
        ['highlightGroupDefault', 'typeHighlight'],
        highlightGroupDefault
      )
      const highlightName = typeHighlight.trim()
      const names = highlightName.split(',')
      const specificationGroups = propOr([], 'specificationGroups', product)
      const highlights = names.reduce((acc, item) => {
        const highlightSpecificationGroup = specificationGroups.filter(
          x => x.name.toLowerCase() === item.trim().toLowerCase()
        )[0]
        const highlight = propOr(
          [],
          'specifications',
          highlightSpecificationGroup
        )
        return acc.concat(highlight)
      }, [])
      return highlights
    }
    const highlightsFromSpecifications = () => {
      const typeSpecifications = pathOr(
        '',
        ['highlightGroupDefault', 'typeSpecifications'],
        highlightGroupDefault
      )
      const specificationNames = typeSpecifications.trim().split(',')
      const allSpecifications = propOr([], 'properties', product)
      const highlights = specificationNames.reduce((acc, item) => {
        const highlight = allSpecifications.filter(
          x => x.name.toLowerCase() === item.trim().toLowerCase()
        )
        return acc.concat(highlight)
      }, [])
      return highlights
    }
  
    const highlightsFromAllSpecifications = () => {
      return propOr([], 'properties', product)
    }
  
    switch (option) {
      case 'admin/editor.product-details.highlights.chooseDefault':
        return highlightsFromGroup()
      case 'admin/editor.product-details.highlights.chooseDefaultSpecification':
        return highlightsFromSpecifications()
      case 'admin/editor.product-details.highlights.allSpecifications':
        return highlightsFromAllSpecifications()
    }
  }, [product, highlightGroupDefault])
}

const useImages = (selectedItem) => {
  return useMemo(() => {
    const images = path(['images'], selectedItem)

    return images
      ? images.map(image => ({
          imageUrls: imageSizes.map(size =>
            changeImageUrlSize(image.imageUrl, size)
          ),
          thresholds,
          thumbnailUrl: changeImageUrlSize(image.imageUrl, thumbnailSize),
          imageText: image.imageText,
        }))
      : []
  }, [selectedItem])
}

const ProductDetails = ({ 
  price,
  name,
  intl,
  thumbnailPosition,
  highlightGroupDefault,
  specificationsDefault,
  showSpecificationsTab: showSpecificationsTabProp,
  share,
}) => {
  const productContext = useContext(ProductContext)
  const { account, culture: { country }, hints: { mobile }} = useRuntime()

  const { selectedItem, selectedQuantity, onChangeQuantity: setQuantity } = productContext
  const product = productContext.product || {}

  const commertialOffer = path(['sellers', 0, 'commertialOffer'], selectedItem)
  const sellerId = path(['sellers', 0, 'sellerId'], selectedItem)

  const showHighlight = prop('showHighlights', highlightGroupDefault)

  const showSpecificationsTab =
      showSpecificationsTabProp == null
        ? propOr(true, 'showSpecifications', specificationsDefault)
        : showSpecificationsTabProp

    const viewMode = prop('viewMode', specificationsDefault) || 'tab'

    const viewSpecificationsMode = viewMode === 'tab'
    const isAvailable = Number.isNaN(+path(['AvailableQuantity'], commertialOffer)) || path(['AvailableQuantity'], commertialOffer) > 0

    const skuName = path(['name'], selectedItem)
    const description = path(['description'], product)
    const specifications = useSpecifications(product, specificationsDefault)
    const highlights = useHighlights(product, highlightGroupDefault)
    const buyButtonProps = {
      skuItems: selectedItem && sellerId && [
          {
            skuId: selectedItem.itemId,
            quantity: selectedQuantity,
            seller: sellerId,
            name: selectedItem.nameComplete,
            price: commertialOffer.Price,
            variant: selectedItem.name,
            brand: product.brand,
            index: 0,
            detailUrl: `/${product.linkText}/p`,
            imageUrl: path(['images', '0', 'imageUrl'], selectedItem),
            listPrice: path(
              ['sellers', '0', 'commertialOffer', 'ListPrice'],
              selectedItem
            ),
          },
        ],
      large: true,
      available: isAvailable,
    }

    const productNameProps = {
      styles: productNameLoaderStyles,
      name: path(['productName'], product),
      skuName: path(['name'], selectedItem),
      brandName: path(['brand'], product),
      productReference: path(['productReference'], product),
      className: 't-heading-4',
      tag: 'h1',
      ...name,
    }

    const productPriceProps = {
      styles: productPriceLoaderStyles,
      listPriceContainerClass: 't-small-s t-small-ns c-muted-2 mb2',
      sellingPriceLabelClass: 't-heading-6-s t-heading-5-ns dib',
      listPriceLabelClass: 'dib strike',
      listPriceClass: 'ph2 dib strike',
      sellingPriceContainerClass: 'pv1 b c-on-base',
      sellingPriceClass: 't-heading-2-s dib ph2',
      installmentContainerClass: 't-mini-s t-small-ns c-on-base',
      installmentClass: 't-body',
      interestRateClass: 'dib ph2',
      savingsContainerClass: 'c-success mt3',
      savingsClass: 'dib t-small',
      loaderClass: 'h4-s mw6-s pt2-s',
      listPrice: path(['ListPrice'], commertialOffer),
      sellingPrice: path(['Price'], commertialOffer),
      installments: path(['Installments'], commertialOffer),
      ...price,
    }
    const productImageUrl = path(['items', 0, 'images', 0, 'imageUrl'], product)
    const availableQuantity = path(['AvailableQuantity'], commertialOffer)
    const images = useImages(selectedItem)
    const addonDetailsClasses = classNames('absolute z-3 left-0', {
      'ml-20-ns':
      images.length > 1 &&
        (!thumbnailPosition || thumbnailPosition === 'left'),
    })
  const addonDetailsProduct = useMemo(() => ({
    quantity: 1,
    skuId: path(['itemId'], selectedItem),
    productId: path(['productId'], product),
  }), [selectedItem, product])

  const onChangeQuantity = useCallback(value => setQuantity(value), [setQuantity])
  return (
    <Container
      className={`${productDetails.container} pt6 pb8 justify-center flex`}
    >
      <div className="w-100 mw9">
        <article className="mb7">
          <ExtensionPoint id="breadcrumb" />
          <div
            className={`${productDetails.nameContainer} c-on-base mb4 dn-l`}
          >
            <ExtensionPoint id="product-name" {...productNameProps} />
          </div>
          <div className="flex flex-wrap">
            <div className="w-60-l w-100">
              <div className="fr-ns w-100 h-100">
                <div className="relative flex justify-center z-3">
                  <ExtensionPoint
                    id="product-images"
                    images={images}
                    position={thumbnailPosition}
                  />
                  <div className={addonDetailsClasses}>
                    <ExtensionPoint
                      id="addon-details-btn"
                      large={!mobile}
                      product={addonDetailsProduct}
                    />
                  </div>
                </div>
              </div>
            </div>
            <aside
              className={`${
                productDetails.detailsContainer
              } pl8-l w-40-l w-100`}
            >
              <div
                className={`${
                  productDetails.nameContainer
                } c-on-base dn db-l mb4`}
              >
                <ExtensionPoint id="product-name" {...productNameProps} />
              </div>
              {highlights && showHighlight && (
                <div className={productDetails.highlightsContainer}>
                  <ExtensionPoint
                    id="product-highlights"
                    highlights={highlights}
                  />
                </div>
              )}
              {isAvailable && (
                <div
                  className={`${productDetails.priceContainer} pt1 dn db-l`}
                >
                  <ExtensionPoint id="product-price" {...productPriceProps} />
                </div>
              )}
              <div className="mv2 mt5 dn db-l">
                <hr className="o-30" size="1" />
              </div>
              <div className="mt6">
                {product &&
                  selectedItem &&
                  selectedItem.variations &&
                  selectedItem.variations.length > 0 && (
                    <ExtensionPoint
                      id="sku-selector"
                      skuItems={pathOr([], ['items'], product)}
                      skuSelected={selectedItem}
                    />
                  )}
                {isAvailable && (
                  <div
                    className={`${
                      productDetails.priceContainer
                    } pt1 mt mt7 mt4-l dn-l`}
                  >
                    <ExtensionPoint
                      id="product-price"
                      {...productPriceProps}
                    />
                  </div>
                )}
                {isAvailable ? (
                  <div className="pv2 dn db-l mt8">
                    <ExtensionPoint
                      id="product-quantity-selector"
                      selectedQuantity={selectedQuantity}
                      onChange={onChangeQuantity}
                      availableQuantity={availableQuantity}
                    />
                    <ExtensionPoint id="buy-button" {...buyButtonProps}>
                      <FormattedMessage id="store/addToCartButton.label" />
                    </ExtensionPoint>
                  </div>
                ) : (
                  <div className="pv4">
                    <ExtensionPoint
                      id="availability-subscriber"
                      skuId={selectedItem.itemId}
                      available={isAvailable}
                    />
                  </div>
                )}
                <FixedButton>
                  <div className="dn-l bg-base w-100 ph5 pv3">
                    <ExtensionPoint id="buy-button" {...buyButtonProps}>
                      <FormattedMessage id="store/addToCartButton.label" />
                    </ExtensionPoint>
                  </div>
                </FixedButton>
                <div className="mt8">
                  <ExtensionPoint
                    id="shipping-simulator"
                    skuId={path(['itemId'], selectedItem)}
                    seller={sellerId}
                    country={country}
                  />
                </div>
                <div className="flex w-100 mt7">
                  <ExtensionPoint
                    id="share"
                    shareLabelClass="c-muted-2 t-small mb3"
                    className="db"
                    imageUrl={productImageUrl}
                    {...share}
                    loading={!path(['name'], selectedItem)}
                    title={intl.formatMessage(
                      { id: 'store/share.title' },
                      {
                        product: path(['productName'], product),
                        sku: path(['name'], selectedItem),
                        store: account,
                      }
                    )}
                  />
                </div>
              </div>
            </aside>
          </div>
        </article>
        <footer
          className={`${productDetails.informationsContainer} ph5 ph0-ns`}
        >
          <div className="mv4">
            <hr className="o-30 db" size="1" />
          </div>
          <div
            className={`flex ${
              viewSpecificationsMode ? 'flex-wrap' : 'justify-between'
            }`}
          >
            {description && (
              <div className="pv2 mt8 h-100 w-100">
                <ExtensionPoint
                  id="product-description"
                  skuName={skuName}
                  description={description}
                />
              </div>
            )}
            {specifications && showSpecificationsTab && (
              <div className="pv2 mt8 h-100 w-100">
                <ExtensionPoint
                  id="product-specifications"
                  tabsMode={viewSpecificationsMode}
                  specifications={specifications}
                />
              </div>
            )}
          </div>
        </footer>
      </div>
    </Container>
  )
}

ProductDetails.schema = schema

export default injectIntl(ProductDetails)
