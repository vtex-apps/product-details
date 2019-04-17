import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { path, pathOr } from 'ramda'
import { ProductContext } from 'vtex.product-context'
import { Container } from 'vtex.store-components'

import { productShape } from './propTypes'
import productDetails from './productDetails.css'

class ProductDetails extends Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.string),
    /** Query */
    productQuery: PropTypes.shape({
      product: productShape,
      loading: PropTypes.bool.isRequired,
    }),
    /** Product price schema configuration */
    query: PropTypes.shape({
      skuId: PropTypes.string,
    }),
    runtime: PropTypes.object,
    /** Product slug */
    slug: PropTypes.string.isRequired,
  }

  get skuItems() {
    return pathOr([], ['productQuery', 'product', 'items'], this.props)
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
    return path(['sellers', 0, 'sellerId'], this.selectedItem)
  }

  render() {
    const {
      productQuery: { product },
      categories,
    } = this.props

    return (
      <Container
        className={`${productDetails.container} pt6 pb8 justify-center flex`}
      >
        <div className="w-100 mw9">
          <ProductContext.Provider 
            value={{
              product,
              categories,
              selectedItem: this.selectedItem,
            }}
          >
            {this.props.children}
          </ProductContext.Provider>
        </div>
      </Container>
    )
  }
}

export default ProductDetails
