import React from 'react'
import PropTypes from 'prop-types'

import { renderWithIntl } from 'intl-utils'
import { withContext } from 'context-utils'
import { getProduct } from 'product-mock'

import ProductQuantitySelector from '../ProductQuantitySelector'

describe('<ProductQuantitySelector /> component', () => {
  const product = getProduct()
  const defaultContext = {
    categories: ['Shirt', 'Shoes'],
    product,
    selectedItem: product.items[0],
    selectedQuantity: 1,
    onChangeQuantity: () => {},
  }
  const defaultProps = {
    selectedQuantity: 1,
    availableQuantity: 50,
    warningQuantityThreshold: 10,
  }

  const renderComponent = (customProps, customContext) => {
    const props = { ...defaultProps, ...customProps }
    const context = { ...defaultContext, ... customContext }

    const Component = withContext(ProductQuantitySelector, context, {
      product: PropTypes.object,
      categories: PropTypes.array,
      selectedItem: PropTypes.object,
      selectedQuantity: PropTypes.number,
      onChangeQuantity: PropTypes.func,
    })

    return renderWithIntl(<Component { ...props } />)
  }

  it('should render and not show available quantity view', () => {
    const component = renderComponent()
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })
  it('should render and show available quantity view', () => {
    const customSelectedItem = defaultContext.selectedItem
    customSelectedItem.sellers[0].commertialOffer.AvailableQuantity = 5

    const component = renderComponent({}, { selectedItem: customSelectedItem })
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })
})