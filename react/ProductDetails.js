import * as React from 'react'
import { path } from 'ramda'
import { ProductContext } from 'vtex.product-context'
import { Container } from 'vtex.store-components'

import productDetails from './productDetails.css'

const ProductDetails = ({ productQuery, categories, query, slug, runtime, children }) => {
  const { product } = productQuery
  const { dispatch } = React.useContext(ProductContext.Context)

  const getSelectedItem = () => {
    const items = path(['items'], product) || []
    if (!query.skuId) return items[0]

    return items.find(sku => sku.itemId === query.skuId)
  }

  // @TODO: it should also listen to query changes
  React.useEffect(() => {
    const payload = {
      props: {
        product,
        categories,
        selectedItem: getSelectedItem(),
      },
    }

    return dispatch({ type: 'SET_PROPS', payload })
  }, [])

  return (
    <Container className={`${productDetails.container} pt6 pb8 justify-center flex`}>
      <div className="w-100 mw9">
        {children}
      </div>
    </Container>
  )
}

export default (props) => (
  <ProductContext.Provider>
    <ProductDetails { ...props } />
  </ProductContext.Provider>
)
