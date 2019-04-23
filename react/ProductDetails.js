import * as React from 'react'
import { path } from 'ramda'
import { ProductContext } from 'vtex.product-context'
import { Container } from 'vtex.store-components'

import productDetails from './productDetails.css'

const ProductDetails = ({ productQuery, categories, query, slug, runtime, children }) => {
  const [ selectedQuantity, setSelectedQuantity ] = React.useState(1)
  const { product } = productQuery

  const getSelectedItem = () => {
    const items = path(['items'], product) || []
    if (!query.skuId) return items[0]

    return items.find(sku => sku.itemId === query.skuId)
  }

  return (
    <Container className={`${productDetails.container} pt6 pb8 justify-center flex`}>
      <div className="w-100 mw9">
        <ProductContext.Provider value={{
          product,
          categories,
          selectedItem: getSelectedItem(),
          onChangeQuantity: setSelectedQuantity,
          selectedQuantity,
        }}>
          {children}
        </ProductContext.Provider>
      </div>
    </Container>
  )
}

ProductDetails.schema = {
  title: 'editor.product-details.title',
  description: 'editor.product-details.description',
}

export default ProductDetails
