import React, { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { graphql } from 'react-apollo'

import BuyButton from 'vtex.store-components/BuyButton'
import ProductDescription from 'vtex.store-components/ProductDescription'
import ProductName from 'vtex.store-components/ProductName'
import Price from 'vtex.store-components/ProductPrice'
import ProductImages from 'vtex.store-components/ProductImages'
import ShippingSimulator from 'vtex.store-components/ShippingSimulator'

import Spinner from '@vtex/styleguide/lib/Spinner'

import ProductDetailsPropTypes from './propTypes'
import productQuery from './graphql/productQuery.gql'

import './global.css'

class ProductDetails extends Component {
  render() {
    const { product } = this.props.data
    if (!product) {
      return (
        <div className="pt6 tc">
          <Spinner />
        </div>
      )
    }

    const selectedItem = product.items[0]
    const { commertialOffer } = selectedItem.sellers[0]

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
                ean={selectedItem.ean}
              />
            </div>
            <div className="vtex-product-details__price-container pt4">
              <Price
                listPrice={commertialOffer.ListPrice}
                sellingPrice={commertialOffer.Price}
                installments={commertialOffer.Installments}
                showListPrice
                showLabels
                showInstallments
                showSavings
              />
            </div>
            <div className="pv2">
              <hr className="b--black-10" size="0" />
            </div>
            <div className="pv2">
              <ShippingSimulator />
            </div>
            <div className="pv2">
              {/* TODO: Implement something after click and use real Seller and SalesChannel*/}
              <BuyButton
                seller={parseInt(selectedItem.sellers[0].sellerId)}
                skuId={selectedItem.itemId}
                afterClick={() => null}>
                <FormattedMessage id="button-label" />
              </BuyButton>
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
