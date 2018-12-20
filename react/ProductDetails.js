import React, { Component } from 'react'
import { mapObjIndexed, mergeDeepRight, path } from 'ramda'
import { FormattedMessage } from 'react-intl'
import {
  AvailabilitySubscriber,
  BuyButton,
  ProductDescription,
  ProductImages,
  ProductName,
  ProductPrice,
  Share,
  ShippingSimulator,
  SKUSelector,
} from 'vtex.store-components'
import { ExtensionPoint, withRuntimeContext } from 'render'
import { changeImageUrlSize } from './utils/generateUrl'
import FixedButton from './components/FixedButton'

import IntlInjector from './components/IntlInjector'
import ProductDetailsPropTypes from './propTypes'

import productDetails from './productDetails.css'

const { account } = global.__RUNTIME__
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

class ProductDetails extends Component {
  static defaultProps = {
    price: {
      showListPrice: true,
      showLabels: true,
      showInstallments: true,
      showSavings: true,
    },
    name: {
      showProductReference: false,
      showBrandName: false,
      showSku: false,
    },
    displayVertically: false,
  }

  static propTypes = ProductDetailsPropTypes

  static getSchema = props => {
    const shareSchema = Share.schema || Share.getSchema(props)
    const priceSchema = mergeSchemaAndDefaultProps(
      ProductPrice.schema || ProductPrice.getSchema(props),
      'price'
    )
    const nameSchema = ProductName.schema || ProductName.getSchema(props)

    return {
      title: 'editor.product-details.title',
      description: 'editor.product-details.description',
      type: 'object',
      properties: {
        displayVertically: {
          title: 'editor.product-details.displayVertically.title',
          type: 'boolean',
          default: false,
          isLayout: true,
        },
        share: shareSchema,
        price: priceSchema,
        name: nameSchema,
      },
    }
  }

  state = { selectedQuantity: 1 }

  compareSku = (item, otherItem) => {
    const [
      {
        commertialOffer: { AvailableQuantity: quantity, Price: price },
      },
    ] = item.sellers
    const [
      {
        commertialOffer: {
          AvailableQuantity: otherQuantity,
          Price: otherPrice,
        },
      },
    ] = otherItem.sellers

    return quantity === 0
      ? 1
      : (otherQuantity === 0 && -1) || price - otherPrice
  }

  get skuItems() {
    const items = path(['productQuery', 'product', 'items'], this.props) || []
    const skuItems = items.slice()
    skuItems.sort(this.compareSku)
    return skuItems
  }

  get selectedItem() {
    const items = path(['productQuery', 'product', 'items'], this.props) || []
    if (!this.props.query.skuId) return items[0]
    const [selected] = items.filter(sku => sku.itemId === this.props.query.skuId)
    return selected
  }

  get commertialOffer() {
    return path(['sellers', 0, 'commertialOffer'], this.selectedItem)
  }

  get sellerId() {
    return parseInt(path(['sellers', 0, 'sellerId'], this.selectedItem))
  }

  getImages() {
    const images = path(['images'], this.selectedItem)

    return images ? images.map(
      image => ({
        imageUrls: imageSizes.map(size => changeImageUrlSize(image.imageUrl, size)),
        thresholds,
        thumbnailUrl: changeImageUrlSize(image.imageUrl, thumbnailSize),
        imageText: image.imageText,
      })) : []
  }

  render() {
    const {
      productQuery: { product },
      term,
      slug,
      categories,
      runtime,
    } = this.props
    const { selectedQuantity } = this.state

    const showBuyButton =
      Number.isNaN(+path(['AvailableQuantity'], this.commertialOffer)) || // Show the BuyButton loading information
      path(['AvailableQuantity'], this.commertialOffer) > 0
    const country = path(['culture', 'country'], runtime)

    const specifications = path(['properties'], product)
    const skuName = path(['name'], this.selectedItem)
    const description = path(['description'], product)

    const buyButtonProps = {
      skuItems:
        this.selectedItem &&
        this.sellerId && [
          {
            skuId: this.selectedItem.itemId,
            quantity: selectedQuantity,
            seller: this.sellerId,
          },
        ],
      large: true,
      available: showBuyButton,
    }

    const productNameProps = {
      styles: productNameLoaderStyles,
      name: path(['productName'], product),
      skuName: path(['name'], this.selectedItem),
      brandName: path(['brand'], product),
      productReference: path(['productReference'], product),
      ...this.props.name,
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
      listPrice: path(['ListPrice'], this.commertialOffer),
      sellingPrice: path(['Price'], this.commertialOffer),
      installments: path(['Installments'], this.commertialOffer),
      ...this.props.price,
    }

    const availableQuantity = path(['AvailableQuantity'], this.commertialOffer)
    const showProductPrice = (Number.isNaN(+availableQuantity) || availableQuantity > 0)

    return (
      <IntlInjector>
        {intl => (
          <div className="mw9 mt6 mb8 center">
            <div className="ph5 ph0-ns mb7">
              {slug && categories && <ExtensionPoint
                id="breadcrumb"
                term={term}
                slug={slug}
                categories={categories}
              />}

              <div className={`${productDetails.nameContainer} c-on-base t-heading-4 mb4 dn-l`}>
                <ProductName {...productNameProps} />
              </div>

              <div className="flex flex-wrap">
                <div className="w-60-l w-100">
                  <div className="fr-ns w-100 h-100">
                    <div className="flex justify-center">
                      <ProductImages images={this.getImages()} />
                    </div>
                  </div>
                </div>
                <div className={`${productDetails.detailsContainer} pl8-l w-40-l w-100`}>
                  <div className={`${productDetails.nameContainer} c-on-base dn db-l t-heading-4 mb4`}>
                    <ProductName {...productNameProps} />
                  </div>
                  {showProductPrice && (
                    <div className={`${productDetails.priceContainer} pt1 dn db-l`}>
                      <ProductPrice {...productPriceProps} />
                    </div>
                  )}
                  <div className="mv2 mt5 dn db-l">
                    <hr className="o-30" size="1" />
                  </div>
                  <div className="mt6">
                    {product && this.selectedItem.variations &&
                    this.selectedItem.variations.length > 0 &&
                    (
                      <SKUSelector
                        skuItems={this.skuItems}
                        skuSelected={this.selectedItem}
                        productSlug={product.linkText}
                      />
                    )}
                    {showProductPrice && (
                      <div className={`${productDetails.priceContainer} pt1 mt mt7 mt4-l dn-l`}>
                        <ProductPrice {...productPriceProps} />
                      </div>
                    )}
                    {showBuyButton ? (
                      <div className="pv2 dn db-l mt8">
                        <BuyButton {...buyButtonProps}>
                          <FormattedMessage id="addToCartButton.label" />
                        </BuyButton>
                      </div>
                    ) : (
                      <div className="pv4">
                        <AvailabilitySubscriber skuId={this.selectedItem.itemId} />
                      </div>
                    )}
                    <FixedButton>
                      <div className="dn-l bg-base w-100 ph5 pv3">
                        <BuyButton {...buyButtonProps}>
                          <FormattedMessage id="addToCartButton.label" />
                        </BuyButton>
                      </div>
                    </FixedButton>
                    <div className="mt8">
                      <ShippingSimulator
                        skuId={path(['itemId'], this.selectedItem)}
                        seller={this.sellerId}
                        country={country}
                      />
                    </div>
                    <div className="flex w-100 mt7">
                      <Share
                        shareLabelClass="c-muted-2 t-small mb3"
                        className="db"
                        {...this.props.share}
                        loading={!path(['name'], this.selectedItem)}
                        title={intl.formatMessage(
                          { id: 'share.title' },
                          {
                            product: path(['productName'], product),
                            sku: path(['name'], this.selectedItem),
                            store: account,
                          }
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {description && specifications && (
              <div className="ph3 ph0-ns">
                <div className="mv4">
                  <hr className="o-30 db" size="1" />
                </div>
                <div className="pv2 w-100 mt8 h-100">
                  <ProductDescription
                    specifications={specifications}
                    skuName={skuName}
                    description={description}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </IntlInjector>
    )
  }
}

function mergeSchemaAndDefaultProps(schema, propName) {
  return mergeDeepRight(schema, {
    properties: {
      ...mapObjIndexed(
        value => ({ default: value }),
        ProductDetails.defaultProps[propName]
      ),
    },
  })
}

export default withRuntimeContext(ProductDetails)
