import React from 'react'
import { renderWithIntl } from 'intl-utils'
import ProductDetails from '../ProductDetails'

describe('<ProductDetails /> component', () => {
  const getComponentRender = customProps => {
    const props = {
      slug: 'productSlug',
      ...customProps,
    }
    const component = <ProductDetails {...props} />
    return renderWithIntl(component)
  }

  it('should match the snapshot', () => {
    const render = getComponentRender()
    const fragment = render.asFragment()
    expect(fragment).toMatchSnapshot()
  })
})
