import React, { useMemo, useContext } from 'react'
import { ExtensionPoint, useRuntime } from 'vtex.render-runtime'
import { ProductContext } from 'vtex.product-context'
import { path } from 'ramda'
import classNames from 'classnames'

const getSkuId = path(['selectedItem', 'itemId'])
const getProductId = path(['product', 'productId'])
const getImages = path(['selectedItem', 'images'])

const ProductAddToListButton = () => {
  const {
    hints: { mobile },
  } = useRuntime()
  const productContext = useContext(ProductContext)
  
  const skuId = getSkuId(productContext)
  const productId = getProductId(productContext)

  const productProp = useMemo(() => ({
    skuId, productId, quantity: 1
  }), [skuId, productId])

  const images = getImages(productContext)
  const isMoreThanOneImage = images && images.length > 1
  
  const addonDetailsClasses = classNames('', {
    'ml-20-ns': isMoreThanOneImage
  })

  return (
    <div className={addonDetailsClasses}>
      <ExtensionPoint id="addon-details-btn" large={!mobile} product={productProp} />
    </div>
  )
}

export default ProductAddToListButton
