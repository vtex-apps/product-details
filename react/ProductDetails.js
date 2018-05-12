import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { graphql } from 'react-apollo'

import BuyButton from 'vtex.storecomponents/BuyButton'
import ProductDescription from 'vtex.storecomponents/ProductDescription'
import ProductName from 'vtex.storecomponents/ProductName'

import Spinner from '@vtex/styleguide/lib/Spinner'

import Price from './Price'
import ProductImages from './ProductImages'

import productQuery from './graphql/productQuery.gql'

import './global.css'

class ProductDetails extends Component {
  render() {
    const { product } = this.props.data
    if (!product) {
      return (
        <div className="w-100 flex justify-center">
          <div className="w-10">
            <Spinner />
          </div>
        </div>
      )
    }

    const selectedItem = product.items[0]
    const { commertialOffer } = selectedItem.sellers[0]

    return (
      <div className="vtex-product-details flex flex-wrap ph6">
        <div className="vtex-product-details__images-container w-50-ns w-100-s pr5-ns">
          <div className="fr-ns w-100 h-100">
            <div className="db">
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
              />
            </div>
            <div className="vtex-product-details__price-container pt4">
              <Price
                listPrice={commertialOffer.ListPrice}
                sellingPrice={commertialOffer.Price}
                installments={commertialOffer.Installments}
                installmentPrice={commertialOffer.InstallmentPrice}
                showListPrice
                showLabels
                showInstallments
                showSavings
              />
            </div>
            <div className="pv2">
              <hr className="b--black-10" size="0" />
            </div>
            <div>
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
          <ProductDescription>
            <span className="measure-wide">{product.description}</span>
          </ProductDescription>
        </div>
      </div>
    )
  }

  static propTypes = {
    /** Product slug */
    slug: PropTypes.string.isRequired,
    /** Product that owns the informations */
    data: PropTypes.shape({
      product: PropTypes.shape({
        /** Product's id */
        productId: PropTypes.string.isRequired,
        /** Product's name */
        productName: PropTypes.string.isRequired,
        /** Product's brand */
        brand: PropTypes.string.isRequired,
        /** Product's SKUs */
        items: PropTypes.arrayOf(
          PropTypes.shape({
            /** SKU id */
            itemId: PropTypes.string.isRequired,
            /** SKU name */
            name: PropTypes.string.isRequired,
            /** SKU Images to be shown */
            images: PropTypes.arrayOf(
              PropTypes.shape({
                /** Image id */
                imageId: PropTypes.string.isRequired,
                /** Image label */
                imageLabel: PropTypes.string.isRequired,
                /** Image tag as string */
                imageTag: PropTypes.string.isRequired,
                /** Image URL */
                imageUrl: PropTypes.string.isRequired,
                /** Image text */
                imageText: PropTypes.string.isRequired,
              })
            ).isRequired,
            /** SKU sellers */
            sellers: PropTypes.arrayOf(
              PropTypes.shape({
                /** Seller id */
                sellerId: PropTypes.string.isRequired,
                /** Seller comertial offer */
                commertialOffer: PropTypes.shape({
                  /** Selling Price */
                  Price: PropTypes.number.isRequired,
                  /** List Price */
                  ListPrice: PropTypes.number.isRequired,
                }).isRequired,
              })
            ).isRequired,
          })
        ).isRequired,
      }),
    }),
    /** intl property to format data */
    intl: intlShape.isRequired,
  }
}

const options = {
  options: ({ slug }) => ({
    variables: {
      slug,
    },
  }),
}

export default graphql(productQuery, options)(injectIntl(ProductDetails))
