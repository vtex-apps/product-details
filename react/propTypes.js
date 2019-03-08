import PropTypes from 'prop-types'

export const productShape = PropTypes.shape({
  /** Product's id */
  productId: PropTypes.string.isRequired,
  /** Product's name */
  productName: PropTypes.string.isRequired,
  /** Product's description */
  description: PropTypes.string,
  /** Product's technical specification */
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      /** The property name */
      name: PropTypes.string,
      /** The specification description */
      values: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  /** Product reference */
  productReference: PropTypes.string,
  /** Product's brand */
  brand: PropTypes.string,
  /** Product's SKUs */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      /** SKU id */
      itemId: PropTypes.string.isRequired,
      /** SKU name */
      name: PropTypes.string.isRequired,
      /** SKU Images to be shown */
      images: PropTypes.arrayOf(
        PropTypes.shape({
          /** Image id */
          imageId: PropTypes.string.isRequired,
          /** Image label */
          imageLabel: PropTypes.string,
          /** Image tag as string */
          imageTag: PropTypes.string,
          /** Image URL */
          imageUrl: PropTypes.string.isRequired,
          /** Image text */
          imageText: PropTypes.string.isRequired,
        })
      ).isRequired,
      /** SKU sellers */
      sellers: PropTypes.arrayOf(
        PropTypes.shape({
          /** Seller id */
          sellerId: PropTypes.string.isRequired,
          /** Seller comertial offer */
          commertialOffer: PropTypes.shape({
            /** SKU installments */
            Installments: PropTypes.arrayOf(
              PropTypes.shape({
                /** Installment value */
                Value: PropTypes.number.isRequired,
                /** Interest rate (zero if interest-free) */
                InterestRate: PropTypes.number.isRequired,
                /** Calculated total value */
                TotalValuePlusInterestRate: PropTypes.number,
                /** Number of installments */
                NumberOfInstallments: PropTypes.number.isRequired,
                /** Installments offer name */
                Name: PropTypes.string,
              })
            ),
            /** Selling Price */
            Price: PropTypes.number.isRequired,
            /** List Price */
            ListPrice: PropTypes.number.isRequired,
            /** available item quantity */
            AvailableQuantity: PropTypes.number,
          }).isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
})
