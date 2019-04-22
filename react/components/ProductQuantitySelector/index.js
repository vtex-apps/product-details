import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { NumericStepper } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { ProductContext } from 'vtex.product-context'
import { path } from 'ramda'

import styles from './quantitySelector.css'

const ProductQuantitySelector = ({ warningQuantityThreshold }) => {
  const { selectedItem, selectedQuantity, onChangeQuantity } = React.useContext(ProductContext)
  // const { component, dispatch } = React.useContext(ProductContext.Context)

  // const { selectedQuantity } = component.state
  // const { selectedItem } = component.props

  const availableQuantity = path(['sellers', 0, 'commertialOffer', 'AvailableQuantity'], selectedItem)
  const showAvailable = availableQuantity <= warningQuantityThreshold

  // const handleChange = (value) => {
  //   return dispatch({ type: 'SET_STATE', payload: {
  //     state: {
  //       selectedQuantity: value,
  //     },
  //   }})
  // }
  const handleChange = (value) => {
    return onChangeQuantity(value)
  }

  return (
    <div className={`${styles.quantitySelectorContainer} flex flex-column mb4`}>
      <div className="mb3 c-muted-2 t-body">
        <FormattedMessage id="product-details.quantity" />
      </div>
      <NumericStepper
        size="small"
        value={selectedQuantity}
        minValue={1}
        maxValue={availableQuantity ? availableQuantity : undefined}
        onChange={useCallback(e => handleChange(e.value), [])}
      />
      {showAvailable && 
        <div className={`${styles.availableQuantityContainer} mv4 c-muted-2 t-small`}>
          <FormattedMessage id="product-details.quantity-available" values={{ availableQuantity }} />
        </div>}
    </div>
  )
}

ProductQuantitySelector.defaultProps = {
  warningQuantityThreshold: 0,
  onChange: () => {},
}

ProductQuantitySelector.propTypes = {
  selectedQuantity: PropTypes.number.isRequired,
  availableQuantity: PropTypes.number,
  onChange: PropTypes.func,
  warningQuantityThreshold: PropTypes.number.isRequired
}

ProductQuantitySelector.schema = {
  title: 'editor.product-quantity-selector.title',
  description: 'editor.product-quantity-selector.description',
  type: 'object',
  properties: {
    warningQuantityThreshold: {
      title: 'editor.product-quantity-selector.warningQuantityThreshold.title',
      description: 'editor.product-quantity-selector.warningQuantityThreshold.title',
      type: 'number',
      default: 0,
    },
  },
}

export default ProductQuantitySelector