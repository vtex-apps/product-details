import React from 'react'
import { renderWithIntl } from 'intl-utils'
import { querySelector } from 'react-testing-library'
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
    }

    const render = getComponentRender(props)
    const fragment = render.asFragment()
    expect(fragment).toMatchSnapshot()
  })

  it('should match the snapshot with product', () => {
    const props = {
      productQuery: {
        loading: false,
        product: getProduct(),
      },
    }

    const render = getComponentRender(props)
    const fragment = render.asFragment()
    expect(fragment).toMatchSnapshot()
  })

  it('should render categories', () => {
    const props = {
      categories: ['Shirt', 'Shoes'],
      productQuery: {
        loading: false,
        product: getProduct(),
      },
    }

    const { container } = getComponentRender(props)
    const productName = container.querySelector(
      '.extensionPoint-mock-product-name'
    )
    expect(productName).toBeTruthy()
  })
})
