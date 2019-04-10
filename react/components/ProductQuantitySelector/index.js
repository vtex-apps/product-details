import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { NumericStepper } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import styles from './quantitySelector.css'

const ProductQuantitySelector = ({ selectedQuantity, onChange, availableQuantity, warningQuantityThreshold }) => {
  const showAvailable = availableQuantity <= warningQuantityThreshold
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