export const getProduct = () => ({
  productId: 'productId',
  productName: 'productName',
  generalProperties: [{name: 'Warranty', values:['Enable']}],
  properties: [{name: 'Warranty', values:['Enable']}, {name: 'Free Shipping', values:['Enable']}],
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
})
