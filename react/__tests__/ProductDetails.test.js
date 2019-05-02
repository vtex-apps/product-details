import React from 'react'
import { renderWithIntl } from 'intl-utils'
import { getProduct } from 'product-mock'

import ProductDetails from '../ProductDetails'

describe('<ProductDetails /> component', () => {
  const getComponentRender = customProps => {
    const props = {
      slug: 'productSlug',
      query: {
        skuId: 'id',
      },
      ...customProps,
    }

    return renderWithIntl(<ProductDetails {...props} />)
  }

  it('should match the loading snapshot', () => {
    const props = {
      productQuery: {
        loading: true,
      },
      push: (args) => { }
    }

    const render = getComponentRender(props)
    const fragment = render.asFragment()
    expect(fragment).toMatchSnapshot()
  })

  it('should match the snapshot with product', () => {
    const props = {
      categories: ['Shirt', 'Shoes'],
      productQuery: {
        loading: false,
        product: getProduct(),
      },
      push: (args) => { }
    }

    const render = getComponentRender(props)
    const fragment = render.asFragment()
    expect(fragment).toMatchSnapshot()
  })

  it('should render breadcrumbs', () => {
    const props = {
      categories: ['Shirt', 'Shoes'],
      productQuery: {
        loading: false,
        product: getProduct(),
      },
      push: (args) => { }
    }

    const { container } = getComponentRender(props)
    const productName = container.querySelector(
      '.extensionPoint-mock-breadcrumb'
    )
    expect(productName).toBeTruthy()
  })

  it('should render fixed button', () => {
    const props = {
      productQuery: {
        loading: false,
        product: getProduct(),
      },
      push: (args) => { }
    }

    const { container } = getComponentRender(props)
    const productName = container.querySelector('.fixedButton')
    expect(productName).toBeTruthy()
  })
})
