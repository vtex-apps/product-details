import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { NumericStepper } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import styles from './quantitySelector.css'

const ProductQuantitySelector = ({ selectedQuantity, onChange, availableQuantity, maximumAvailableQuantity }) => {
  const showAvailable = availableQuantity <= maximumAvailableQuantity
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
        onChange={useCallback(e => onChange(e.value), [])}
      />
      {showAvailable && <div className="mv4 c-muted-2 t-small">
        <FormattedMessage id="product-details.quantity-available" values={{ availableQuantity }} />
      </div>}
    </div>
  )
}

ProductQuantitySelector.defaultProps = {
  maximumAvailableQuantity: 0,
}

ProductQuantitySelector.propTypes = {
  selectedQuantity: PropTypes.number.isRequired,
  availableQuantity: PropTypes.number,
  onChange: PropTypes.func,
  maximumAvailableQuantity: PropTypes.number.isRequired
}

ProductQuantitySelector.schema = {
  title: 'editor.product-quantity-selector.title',
  description: 'editor.product-quantity-selector.description',
  type: 'object',
  properties: {
    maximumAvailableQuantity: {
      title: 'editor.product-quantity-selector.maximumAvailableQuantity.title',
      description: 'editor.product-quantity-selector.maximumAvailableQuantity.title',
      type: 'number',
      default: 0,
    },
  },
}

export default ProductQuantitySelector