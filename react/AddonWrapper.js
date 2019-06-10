import React, { useContext } from 'react'
import { ExtensionPoint, useRuntime } from 'vtex.render-runtime'
import { ProductContext } from 'vtex.product-context'
import { path } from 'ramda'

const AddonWrapper = () => {
    const {
        hints: { mobile },
    } = useRuntime()
    
    const valuesFromContext = useContext(ProductContext)
    
    const product= {
        quantity: 1,
        skuId: path(['selectedItem', 'itemId'], valuesFromContext),
        productId: path(['product', 'productId'], valuesFromContext)
    }
    
    return <ExtensionPoint id="addon-details-btn" large={!mobile} product={product} />
}

export default AddonWrapper
