import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import { ProductName } from '@vtex/product-details'
import BuyButton from '@vtex/buy-button'

import { createProduct } from './ProductFactory'
import Price from './Price'

import './product-details.css'

class ProductDetails extends Component {
  render() {
    const { product } = this.props

    return (
      <div className="vtex-product-details flex">
        <div className="vtex-product-details__images-container w-50 pr5">
          <div className="fr">Product Images</div>
        </div>
        <div className="vtex-product-details__details-container w-50 pl5">
          <div className="fl w-100">
            <div className="pv2">
              <ProductName
                name={product.productName}
                skuName={product.sku.name}
                brandName={product.brand}
              />
            </div>
            <div className="pt4">
              <Price
                listPrice={product.sku.seller.commertialOffer.ListPrice}
                sellingPrice={product.sku.seller.commertialOffer.Price}
                installments={product.sku.seller.commertialOffer.Installments}
                installmentPrice={
                  product.sku.seller.commertialOffer.InstallmentPrice
                }
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
                salesChannel="1"
                seller="1"
                skuId={product.sku.referenceId.Value}
                afterClick={event => event.stopPropagation()}>
                <FormattedMessage id="button-label" />
              </BuyButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  static propTypes = {
    /** Product that owns the informations */
    product: PropTypes.shape({
      /** Product's link text */
      linkText: PropTypes.string.isRequired,
      /** Product's name */
      productName: PropTypes.string.isRequired,
      /** Product's brand */
      brand: PropTypes.string.isRequired,
      /** Product's SKU */
      sku: PropTypes.shape({
        /** SKU name */
        name: PropTypes.string.isRequired,
        /** SKU reference id */
        referenceId: PropTypes.shape({
          /** Reference id value */
          Value: PropTypes.string.isRequired,
        }),
        /** SKU Image to be shown */
        image: PropTypes.shape({
          /** Image URL */
          imageUrl: PropTypes.string.isRequired,
          /** Image tag as string */
          imageTag: PropTypes.string.isRequired,
        }).isRequired,
        /** SKU seller */
        seller: PropTypes.shape({
          /** Seller comertial offer */
          commertialOffer: PropTypes.shape({
            /** Selling Price */
            Price: PropTypes.number.isRequired,
            /** List Price */
            ListPrice: PropTypes.number.isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired,
    }),
    /** intl property to format data */
    intl: intlShape.isRequired,
  }

  static defaultProps = {
    product: createProduct(),
  }
}

export default injectIntl(ProductDetails)
