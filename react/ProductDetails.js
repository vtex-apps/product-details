import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  mapObjIndexed,
  mergeDeepRight,
  path,
  filter,
  compose,
  flip,
  prop,
  map,
  contains,
  reject,
  propOr,
  pathOr,
} from 'ramda'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

import { ExtensionPoint, withRuntimeContext } from 'vtex.render-runtime'
import { Container } from 'vtex.store-components'

import { changeImageUrlSize } from './utils/generateUrl'
import FixedButton from './components/FixedButton'
import { productShape } from './propTypes'

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

const allSpecificationsProduct = {
  value: true,
  choose: false,
  specifications: 'allSpecifications',
}

const specificationsProduct = {
  all: {
    value: true,
    name: 'All Specifications',
  },
  choose: {
    value: false,
    name: 'Choose default highlight',
  },
  allSpecifications: 'allSpecifications',
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
    showSpecificationsTab: false,
  }

  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.string),
    /** Whether to display the preview images on the vertical or not */
    displayVertically: PropTypes.bool,
    intl: intlShape,
    /** Product name schema configuration */
    name: PropTypes.object,
    /** Query */
    productQuery: PropTypes.shape({
      product: productShape,
      loading: PropTypes.bool.isRequired,
    }),
    /** Product price schema configuration */
    price: PropTypes.object,
    /** URL query parameters */
    query: PropTypes.shape({
      skuId: PropTypes.string,
    }),
    runtime: PropTypes.object,
    /** Share Schema properties */
    share: PropTypes.shape({
      /** Social Networks configuration */
      social: PropTypes.object.isRequired,
    }),
    /** Product slug */
    slug: PropTypes.string.isRequired,
    /** Product specifications tab mode */
    showSpecificationsTab: PropTypes.bool,

    /** Define the highlight group select to display  */
    highlightGroup: PropTypes.string,
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
    return items.find(sku => sku.itemId === this.props.query.skuId)
  }

  get commertialOffer() {
    return path(['sellers', 0, 'commertialOffer'], this.selectedItem)
  }

  get sellerId() {
    return parseInt(path(['sellers', 0, 'sellerId'], this.selectedItem))
  }

  getImages() {
    const images = path(['images'], this.selectedItem)

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
  }

  filterSpecifications() {
    const {
      productQuery: { product },
    } = this.props
    const allSpecifications = propOr([], 'properties', product)
    const generalSpecifications = propOr([], 'generalProperties', product)
    const highlights = this.getHighlights()
    const specifications = reject(
      compose(
        flip(contains)(map(x => x.name, generalSpecifications)),
        prop('name')
      ),
      allSpecifications
    )
    return {
      specifications,
      highlights,
    }
  }

  getHighlights() {
    const {
      productQuery: { product },
      conditional,
    } = this.props
    const typeHighlight = propOr('', 'typeHighlight', conditional)
    const typeSpecifications = propOr('', 'typeSpecifications', conditional)
    let highlights
    const choose = propOr('', 'highlight', conditional)
    const highlightsFromGroup = () => {
      const highlightName = typeHighlight.trim()
      const names = highlightName.split(',')
      const specificationGroups = propOr([], 'specificationGroups', product)
      highlights = names.reduce((acc, item) => {
        const highlightSpecificationGroup = specificationGroups.filter(
          x => x.name.toLowerCase() === item.trim().toLowerCase()
        )[0]
        const highlight = propOr([], 'specifications', highlightSpecificationGroup)
        return acc.concat(highlight)
      }, [])
    }
    const highlightsFromSpecifications = () => {
      const specificationNames = typeSpecifications.trim().split(',')
      const allSpecifications = propOr([], 'properties', product)
      highlights = specificationNames.reduce((acc, item) => {
        const highlight = allSpecifications.filter(x => x.name.toLowerCase() === item.trim().toLowerCase())
        return acc.concat(highlight)
      }, [])
    }

    const highlightsFromAllSpecifications = () => {
      const allSpecifications = propOr([], 'properties', product)
      const generalSpecifications = propOr([], 'generalProperties', product)
      highlights = reject(
        compose(
          flip(contains)(map(x => x.name, generalSpecifications)),
          prop('name')
        ),
        allSpecifications
      )
    }


    if (choose === 'editor.product-details.highlights.chooseDefault') {
      highlightsFromGroup()
    } else if (choose === 'editor.product-details.highlights.chooseDefaultSpecification') {
      highlightsFromSpecifications()
    } else if (choose === 'editor.product-details.highlights.allSpecifications') {
      highlightsFromAllSpecifications()
    }
    return highlights

  }

  render() {
    const {
      productQuery: { product },
      slug,
      categories,
      runtime: {
        account,
        culture: { country },
      },
      intl,
      showSpecificationsTab,
      showHighlight,
    } = this.props
    const { selectedQuantity } = this.state

    const showBuyButton =
      Number.isNaN(+path(['AvailableQuantity'], this.commertialOffer)) || // Show the BuyButton loading information
      path(['AvailableQuantity'], this.commertialOffer) > 0

    const skuName = path(['name'], this.selectedItem)
    const description = path(['description'], product)
    const { specifications, highlights } = this.filterSpecifications()
    const buyButtonProps = {
      skuItems: this.selectedItem &&
        this.sellerId && [
          {
            skuId: this.selectedItem.itemId,
            quantity: selectedQuantity,
            seller: this.sellerId,
            name: this.selectedItem.nameComplete,
            price: this.commertialOffer.Price,
            variant: this.selectedItem.name,
            brand: product.brand,
            index: 0,
            detailUrl: `/${product.linkText}/p`,
            imageUrl: path(['images', '0', 'imageUrl'], this.selectedItem),
            listPrice: path(
              ['sellers', '0', 'commertialOffer', 'ListPrice'],
              this.selectedItem
            ),
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
      className: 't-heading-4',
      tag: 'h1',
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
    const showProductPrice =
      Number.isNaN(+availableQuantity) || availableQuantity > 0

    return (
      <Container
        className={`${productDetails.container} pt6 pb8 justify-center flex`}
      >
        <div className="w-100 mw9">
          <article className="mb7">
            {categories && (
              <ExtensionPoint
                id="breadcrumb"
                term={path(['productName'], product)}
                categories={categories}
              />
            )}

            <div
              className={`${productDetails.nameContainer} c-on-base mb4 dn-l`}
            >
              <ExtensionPoint id="product-name" {...productNameProps} />
            </div>
            <div className="flex flex-wrap">
              <div className="w-60-l w-100">
                <div className="fr-ns w-100 h-100">
                  <div className="flex justify-center">
                    <ExtensionPoint
                      id="product-images"
                      images={this.getImages()}
                    />
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
                {showProductPrice && (
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
                    this.selectedItem.variations &&
                    this.selectedItem.variations.length > 0 && (
                      <ExtensionPoint
                        id="sku-selector"
                        skuItems={this.skuItems}
                        skuSelected={this.selectedItem}
                        productSlug={product.linkText}
                      />
                    )}
                  {showProductPrice && (
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
                  {showBuyButton ? (
                    <div className="pv2 dn db-l mt8">
                      <ExtensionPoint id="buy-button" {...buyButtonProps}>
                        <FormattedMessage id="addToCartButton.label" />
                      </ExtensionPoint>
                    </div>
                  ) : (
                      <div className="pv4">
                        <ExtensionPoint
                          id="availability-subscriber"
                          skuId={this.selectedItem.itemId}
                        />
                      </div>
                    )}
                  <FixedButton>
                    <div className="dn-l bg-base w-100 ph5 pv3">
                      <ExtensionPoint id="buy-button" {...buyButtonProps}>
                        <FormattedMessage id="addToCartButton.label" />
                      </ExtensionPoint>
                    </div>
                  </FixedButton>
                  <div className="mt8">
                    <ExtensionPoint
                      id="shipping-simulator"
                      skuId={path(['itemId'], this.selectedItem)}
                      seller={this.sellerId}
                      country={country}
                    />
                  </div>
                  <div className="flex w-100 mt7">
                    <ExtensionPoint
                      id="share"
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
                showSpecificationsTab ? 'flex-wrap' : 'justify-between'
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
              {specifications && (
                <div className="pv2 mt8 h-100 w-100">
                  <ExtensionPoint
                    id="product-specifications"
                    tabsMode={showSpecificationsTab}
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
}

export function getHighlightsName(props) {
  const names = []
  const specificationGroups = pathOr(
    [],
    ['productQuery', 'product', 'specificationGroups'],
    props
  )
  for (const k in specificationGroups) {
    names.push(specificationGroups[k].name)
  }
  return names
}

ProductDetails.getSchema = props => {
  return {
    title: 'editor.product-details.title',
    description: 'editor.product-details.description',
    type: 'object',
    widget: {
      'ui:options': {
        inline: false,
      },
      'ui:widget': 'radio',
    },
    definitions: {
      highlightGroupDefault: {
        title: 'Person',
        type: 'object',
        properties: {
          highlight: {
            title: 'editor.product-details.highlights.default',
            type: 'string',
            enum: [
              'editor.product-details.highlights.allSpecifications',
              'editor.product-details.highlights.chooseDefault',
              'editor.product-details.highlights.chooseDefaultSpecification',
            ],
            default: 'editor.product-details.highlights.chooseDefault',
          },
        },
        required: ['highlight'],
        dependencies: {
          highlight: {
            oneOf: [
              {
                properties: {
                  highlight: {
                    enum: [
                      'editor.product-details.highlights.allSpecifications',
                    ],
                  },
                },
              },
              {
                properties: {
                  highlight: {
                    enum: ['editor.product-details.highlights.chooseDefault'],
                  },
                  typeHighlight: {
                    type: 'string',
                    title: 'editor.product-details.highlights.title',
                  },
                },
                required: [''],
              },
              {
                properties: {
                  highlight: {
                    enum: ['editor.product-details.highlights.chooseDefaultSpecification'],
                  },
                  typeSpecifications: {
                    type: 'string',
                    title: 'editor.product-details.highlights.typeSpecifications.title',
                  },
                },
                required: [''],
              },
            ],
          },
        },
      },
    },
    properties: {
      conditional: {
        title: 'Conditional',
        $ref: '#/definitions/highlightGroupDefault',

      },
      showHighlight: {
        type: 'boolean',
        title: 'editor.product-details.showHighlight.title',
        default: true,
        isLayout: false,
      },
    },
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

export default withRuntimeContext(injectIntl(ProductDetails))
