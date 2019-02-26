export const getProduct = () => ({
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
})
