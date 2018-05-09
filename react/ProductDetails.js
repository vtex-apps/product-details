import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { graphql } from 'react-apollo'

import { ProductName } from '@vtex/product-details'
import BuyButton from '@vtex/buy-button'
import Spinner from '@vtex/styleguide/lib/Spinner'

import Price from './Price'
import ProductImages from './ProductImages'

import productQuery from './graphql/productQuery.gql'

import './product-details.css'

class ProductDetails extends Component {
  render() {
    const { product } = this.props.data
    if (!product) {
      return (
        <div className="w-100 flex justify-center" >
          <div className="w-10">
            <Spinner />
          </div>
        </div >
      )
    }

    const selectedItem = product.items[0]
    const { commertialOffer } = selectedItem.sellers[0]

    return (
      <div className="vtex-product-details flex">
        <div className="vtex-product-details__images-container w-50 pr5">
          <div className="fr">
            {/* TODO: Manage screen resize */}
            <ProductImages
              images={selectedItem.images}
              thumbnailSliderOrientation="HORIZONTAL"
            />
          </div>
        </div>
        <div className="vtex-product-details__details-container w-50 pl5">
          <div className="fl w-100">
            <div className="pv2">
              <ProductName
                name={product.productName}
                skuName={selectedItem.name}
                brandName={product.brand}
              />
            </div>
            <div className="pt4">
              <Price
                listPrice={commertialOffer.ListPrice}
                sellingPrice={commertialOffer.Price}
                installments={commertialOffer.Installments}
                installmentPrice={commertialOffer.InstallmentPrice}
                showListPrice
                showLabels
                showInstallments
              />
            </div>
            <div className="pv2">
              <hr className="b--black-10" />
            </div>
            <div>
              {/* TODO: Implement something after click and use real Seller and SalesChannel*/}
              <BuyButton
                seller={selectedItem.sellers[0].sellerId}
                skuId={selectedItem.itemId}
                afterClick={() => null}>
                <FormattedMessage id="button-label" />
              </BuyButton>
            </div>
          </div>
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
      }).isRequired,
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
