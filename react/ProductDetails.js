import React, { Component } from 'react'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { graphql } from 'react-apollo'

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

import './global.css'

const { account } = global.__RUNTIME__

class ProductDetails extends Component {
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
    const {
      intl,
      data: { product, loading },
    } = this.props

    if (loading || !product) {
      return (
        <div className="pt6 tc">
          <Spinner />
        </div>
      )
    }

    const [{ itemId: initialItem }] = product.items

    const skuItems = product.items.slice()
    skuItems.sort(this.compareSku)

    const initialItemIndex = skuItems.findIndex(
      item => item.itemId === initialItem
    )

    let selectedItem = skuItems[this.state.skuIndex]
    if (selectedItem == null) {
      selectedItem = skuItems[initialItemIndex]
    }

    const [{ commertialOffer }] = selectedItem.sellers
    const sellerId = parseInt(selectedItem.sellers[0].sellerId)

    return (
      <div className="vtex-product-details flex flex-wrap pa6">
        <div className="vtex-product-details__images-container w-50-ns w-100-s pr5-ns">
          <div className="fr-ns w-100 h-100">
            <div className="flex justify-center">
              <ProductImages
                images={selectedItem.images}
                thumbnailSliderOrientation="HORIZONTAL"
              />
            </div>
          </div>
        </div>
        <div className="vtex-product-details__details-container w-50-ns w-100-s pl5-ns">
          <div className="fl-ns w-100">
            <div className="vtex-product-details__name-container pv2">
              <ProductName
                name={product.productName}
                skuName={selectedItem.name}
                brandName={product.brand}
                productReference={product.productReference}
              />
            </div>
            {commertialOffer.AvailableQuantity > 0 && (
              <div className="vtex-product-details__price-container pt1">
                <ProductPrice
                  listPrice={commertialOffer.ListPrice}
                  sellingPrice={commertialOffer.Price}
                  installments={commertialOffer.Installments}
                  showListPrice
                  showLabels
                  showInstallments
                  showSavings
                />
              </div>
            )}
            <div className="pv2">
              <hr className="o-30" size="1" />
            </div>
            <div>
              <div className="f7">
                <FormattedMessage id="sku-label" />
              </div>
              <SKUSelector
                skuItems={skuItems}
                defaultIndex={initialItemIndex}
                onSKUSelected={this.handleSkuChange}
              />
            </div>
            <div className="pv2">
              <hr className="o-30" size="1" />
            </div>
            {commertialOffer.AvailableQuantity > 0 ? (
              <div>
                <div className="pv2">
                  <BuyButton seller={sellerId} skuId={selectedItem.itemId}>
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
                <AvailabilitySubscriber skuId={selectedItem.itemId} />
              </div>
            )}
            <div className="flex w-100 pv2">
              <div className="pv2 pr3 f6">
                <FormattedMessage id="share.label" />:
              </div>
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
            </div>
          </div>
        </div>
        <div className="pv4 w-100">
          <hr className="b--black-10" size="0" />
        </div>
        <div className="vtex-product-details__description-container pv2 w-100 h-100">
          <ProductDescription
            specifications={product.properties}
            skuName={selectedItem.name}>
            <span className="measure-wide">{product.description}</span>
          </ProductDescription>
        </div>
      </div>
    )
  }
}

const options = {
  options: ({ slug }) => ({
    variables: {
      slug,
    },
  }),
}

const productDetailsComponent = graphql(productQuery, options)(
  injectIntl(ProductDetails)
)

ProductDetails.propTypes = ProductDetailsPropTypes
productDetailsComponent.propTypes = {
  ...ProductDetailsPropTypes,
  /** intl property to format data */
  intl: intlShape.isRequired,
}

productDetailsComponent.getSchema = props => {
  const shareSchema = Share.schema || Share.getSchema(props)
  return {
    title: 'editor.product-details.title',
    description: 'editor.product-details.description',
    type: 'object',
    properties: {
      share: shareSchema,
    },
  }
}

export default productDetailsComponent
