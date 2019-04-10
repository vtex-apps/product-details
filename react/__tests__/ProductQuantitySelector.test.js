import React from 'react'
import { renderWithIntl } from 'intl-utils'

import ProductQuantitySelector from '../ProductQuantitySelector'

describe('<ProductQuantitySelector /> component', () => {
  it('should render and not show available quantity view', () => {
    const component = renderWithIntl(<ProductQuantitySelector selectedQuantity={1} availableQuantity={50} maximumAvailableQuantity={10}/>)
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })
  it('should render and show available quantity view', () => {
    const component = renderWithIntl(<ProductQuantitySelector selectedQuantity={1} availableQuantity={5} maximumAvailableQuantity={10}/>)
    expect(component).toBeDefined()
    expect(component.asFragment()).toMatchSnapshot()
  })
})