import React from 'react'
import { renderWithIntl } from 'intl-utils'

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
        product: {
          productId: 'productId',
          productName: 'productName',
          items: [
            {
              itemId: 'id',
              name: 'name',
              images: [
                {
                  imageId: 'imageId',
                  imageUrl: 'imageUrl',
                  imageText: 'imageText',
                },
              ],
              sellers: [
                {
                  sellerId: 'sellerId',
                  commertialOffer: {
                    Installments: [
                      {
                        Value: 1,
                        InterestRate: 0,
                        TotalValuePlusInterestRate: 1,
                        NumberOfInstallments: 1,
                        Name: 'Name',
                      },
                    ],
                    Price: 2,
                    ListPrice: 1,
                  },
                },
              ],
            },
          ],
        },
      },
    }

    const render = getComponentRender(props)
    const fragment = render.asFragment()
    expect(fragment).toMatchSnapshot()
  })
})
