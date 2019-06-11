import React, { useContext } from 'react'
import { ExtensionPoint, useRuntime } from 'vtex.render-runtime'
import { ProductContext } from 'vtex.product-context'
import { path } from 'ramda'
import classNames from 'classnames'

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
    
    const isMoreThanOneImage = () => {
        const images =  path(['selectedItem', 'images'], valuesFromContext)
        return images && images.length > 1
    }

    const addonDetailsClasses = classNames('', {
        'ml-20-ns': isMoreThanOneImage()
    })

    return (
        <div className={addonDetailsClasses}>
            <ExtensionPoint id="addon-details-btn" large={!mobile} product={product} />
        </div>
    )
}

export default AddonWrapper
