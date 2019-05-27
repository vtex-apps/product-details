import React from 'react'
import { renderWithIntl } from 'intl-utils'

import ProductQuantitySelector from '../ProductQuantitySelector'

describe('<ProductQuantitySelector /> component', () => {
  const getComponentRender = customProps => {
    const props = {
      'product-details': {
        addToCart: 'store/addToCartButton.label',
        quantityAvailableText: 'store/product-details.quantity-available',
        quantityText: 'store/product-details.quantity',
        shareTitleText: 'store/share.title',
      },
      ...customProps,
    }
    return renderWithIntl(<ProductQuantitySelector {...props} />)
  }

  it('should render and not show available quantity view', () => {
    const customProps = {
      selectedQuantity: 1,
      availableQuantity: 50,
      warningQuantityThreshold: 10,
    }
    const component = getComponentRender(customProps)
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })
  it('should render and show available quantity view', () => {
    const customProps = {
      selectedQuantity: 1,
      availableQuantity: 5,
      warningQuantityThreshold: 10,
    }
    const component = getComponentRender(customProps)
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })
})
