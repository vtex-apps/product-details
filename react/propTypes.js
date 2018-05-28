import PropTypes from 'prop-types'
import { intlShape } from 'react-intl'

export default {
  /** Product slug */
  slug: PropTypes.string.isRequired,
  /** Product that owns the informations */
  data: PropTypes.shape({
    product: PropTypes.shape({
      /** Product's id */
      productId: PropTypes.string.isRequired,
      /** Product's name */
      productName: PropTypes.string.isRequired,
      /** Product's brand */
      brand: PropTypes.string.isRequired,
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
              }).isRequired,
            })
          ).isRequired,
        })
      ).isRequired,
    }),
  }),
  /** intl property to format data */
  intl: intlShape.isRequired,
}
