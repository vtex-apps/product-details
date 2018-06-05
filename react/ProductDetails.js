import React, { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
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
  AvailabilitySubscriber 
} from 'vtex.store-components'

import Spinner from '@vtex/styleguide/lib/Spinner'

import ProductDetailsPropTypes from './propTypes'
import productQuery from './graphql/productQuery.gql'

import './global.css'

class ProductDetails extends Component {
  state = {
    skuIndex: 0
  }

  handleSkuChange = skuIndex => {
    this.setState({ skuIndex })
  }
  
  compareSku = (item1, item2) => {
    if (item1.sellers[0].commertialOffer.AvailableQuantity === 0) {
      return 1
    } else if (item2.sellers[0].commertialOffer.AvailableQuantity === 0) {
      return -1
    }
    return item1.sellers[0].commertialOffer.Price - item2.sellers[0].commertialOffer.Price
  }

  render() {
    const { product } = this.props.data
    if (!product) {
      return (
        <div className="pt6 tc">
          <Spinner />
        </div>
      )
    }

    let skuItems = product.items.slice()
    skuItems.sort(this.compareSku)

    const selectedItem = skuItems[this.state.skuIndex]
    const { commertialOffer } = selectedItem.sellers[0]
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
            {commertialOffer.AvailableQuantity > 0 && 
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
            }
            <div className="pv2">
              <hr className="o-30" size="1"/>
            </div>
            <div>
              <div className="f7">
                <FormattedMessage id="sku-label" />
              </div>
              <SKUSelector
                skuItems={skuItems}
                onSKUSelected={this.handleSkuChange}
              />
            </div>
            <div className="pv2">
              <hr className="o-30" size="1"/>
            </div>
            {commertialOffer.AvailableQuantity > 0 ?
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
                  <ShippingSimulator skuId={selectedItem.itemId} seller={sellerId} country="BRA" />
                </div>
              </div> :
              <div className="pv4">
                <AvailabilitySubscriber skuId={selectedItem.itemId} />
              </div>
            }
            <div className="flex w-100 pv2">
              <div className="pv2 pr3 f6">
                <FormattedMessage id="share-label" />:
              </div>
              <Share
                options={{ 'size': 25 }}
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

  static propTypes = ProductDetailsPropTypes
}

const options = {
  options: ({ slug }) => ({
    variables: {
      slug,
    },
  }),
}

export default graphql(productQuery, options)(injectIntl(ProductDetails))
