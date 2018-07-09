import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Query } from 'react-apollo'
import { mergeDeepRight, mapObjIndexed } from 'ramda'

import {
  BuyButton,
  ProductDescription,
  ProductName,
  ProductPrice,
  ProductImages,
  ShippingSimulator,
  SKUSelector,
  Share,
  AvailabilitySubscriber,
} from 'vtex.store-components'

import Spinner from '@vtex/styleguide/lib/Spinner'

import ProductDetailsPropTypes from './propTypes'
import productQuery from './graphql/productQuery.gql'
import IntlInjector from './components/IntlInjector'

import './global.css'

const { account } = global.__RUNTIME__

class ProductDetails extends Component {
  static defaultProps = {
    price: {
      showListPrice: true,
      showLabels: true,
      showInstallments: true,
      showSavings: true,
    },
  }

  static propTypes = ProductDetailsPropTypes

  static getSchema = props => {
    const shareSchema = Share.schema || Share.getSchema(props)
    const priceSchema = mergeSchemaAndDefaultProps(
      ProductPrice.schema || ProductPrice.getSchema(props),
      'price'
    )

    return {
      title: 'editor.product-details.title',
      description: 'editor.product-details.description',
      type: 'object',
      properties: {
        share: shareSchema,
        price: priceSchema,
        displayVertically: {
          title: 'editor.product-details.displayVertically.title',
          type: 'boolean',
          default: false,
          isLayout: true,
        },
      },
    }
  }

  state = {
    skuIndex: null,
  }

  handleSkuChange = skuIndex => {
    this.setState({ skuIndex })
  }

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

  render() {
    const { slug, displayVertically } = this.props

    return (
      <IntlInjector>
        {intl => (
          <Query query={productQuery} variables={{ slug }}>
            {({ loading, data: { product } }) => {
              const shouldDisplayLoader = loading || !product
              let selectedItem,
                commertialOffer,
                sellerId,
                skuItems,
                initialItemIndex
              if (!shouldDisplayLoader) {
                const [{ itemId: initialItem }] = product.items

                skuItems = product.items.slice()
                skuItems.sort(this.compareSku)

                initialItemIndex = skuItems.findIndex(
                  item => item.itemId === initialItem
                )

                selectedItem = skuItems[this.state.skuIndex]
                if (selectedItem == null) {
                  selectedItem = skuItems[initialItemIndex]
                }

                [{ commertialOffer }] = selectedItem.sellers
                sellerId = parseInt(selectedItem.sellers[0].sellerId)
              }

              return (
                <div className="vtex-product-details flex flex-wrap pa6">
                  <div className="vtex-product-details__images-container w-50-ns w-100-s pr5-ns">
                    <div className="fr-ns w-100 h-100">
                      <div className="flex justify-center">
                        {!shouldDisplayLoader ? (
                          <ProductImages
                            images={selectedItem.images}
                            loading
                            thumbnailSliderOrientation={
                              displayVertically ? 'VERTICAL' : 'HORIZONTAL'
                            }
                          />
                        ) : (
                          <ProductImages
                            loading={shouldDisplayLoader}
                            thumbnailSliderOrientation={
                              displayVertically ? 'VERTICAL' : 'HORIZONTAL'
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="vtex-product-details__details-container w-50-ns w-100-s pl5-ns">
                    <div className="fl-ns w-100">
                      <div className="vtex-product-details__name-container pv2">
                        {!shouldDisplayLoader ? (
                          <ProductName
                            name={product.productName}
                            skuName={selectedItem.name}
                            brandName={product.brand}
                            productReference={product.productReference}
                          />
                        ) : null}
                      </div>
                      {!shouldDisplayLoader
                        ? commertialOffer.AvailableQuantity > 0 && (
                        <div className="vtex-product-details__price-container pt1">
                            <ProductPrice
                              listPrice={commertialOffer.ListPrice}
                              sellingPrice={commertialOffer.Price}
                              installments={commertialOffer.Installments}
                              {...this.props.price}
                            />
                          </div>
                        )
                        : null}
                      <div className="pv2">
                        <hr className="o-30" size="1" />
                      </div>
                      <div>
                        <div className="f7">
                          <FormattedMessage id="sku-label" />
                        </div>
                        {!shouldDisplayLoader ? (
                          <SKUSelector
                            skuItems={skuItems}
                            defaultIndex={initialItemIndex}
                            onSKUSelected={this.handleSkuChange}
                          />
                        ) : null}
                      </div>
                      <div className="pv2">
                        <hr className="o-30" size="1" />
                      </div>
                      {!shouldDisplayLoader ? (
                        commertialOffer.AvailableQuantity > 0 ? (
                          <div>
                            <div className="pv2">
                              <BuyButton
                                seller={sellerId}
                                skuId={selectedItem.itemId}
                              >
                                <FormattedMessage id="button-label" />
                              </BuyButton>
                            </div>
                            <div className="pv4">
                              {/* FIXME: Get this country data correctly */}
                              <ShippingSimulator
                                skuId={selectedItem.itemId}
                                seller={sellerId}
                                country="BRA"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="pv4">
                            <AvailabilitySubscriber
                              skuId={selectedItem.itemId}
                            />
                          </div>
                        )
                      ) : null}
                      <div className="flex w-100 pv2">
                        <div className="pv2 pr3 f6">
                          <FormattedMessage id="share.label" />:
                        </div>
                        {!shouldDisplayLoader ? (
                          <Share
                            {...this.props.share}
                            title={intl.formatMessage(
                              { id: 'share.title' },
                              {
                                product: product.productName,
                                sku: selectedItem.name,
                                store: account,
                              }
                            )}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="pv4 w-100">
                    <hr className="b--black-10" size="0" />
                  </div>
                  <div className="vtex-product-details__description-container pv2 w-100 h-100">
                    {!shouldDisplayLoader ? (
                      <ProductDescription
                        specifications={product.properties}
                        skuName={selectedItem.name}
                        description={product.description}
                      />
                    ) : null}
                  </div>
                </div>
              )
            }}
          </Query>
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

export default ProductDetails
