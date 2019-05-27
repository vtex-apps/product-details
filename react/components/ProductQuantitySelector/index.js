import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { NumericStepper } from 'vtex.styleguide'
import { injectIntl } from 'react-intl'
import { IOMessage } from 'vtex.native-types'

import styles from './quantitySelector.css'

const ProductQuantitySelector = ({
  selectedQuantity,
  onChange,
  availableQuantity,
  warningQuantityThreshold,
  ...props
}) => {
  const {
    intl,
    'product-details': { quantityText, quantityAvailableText },
  } = props
  const showAvailable = availableQuantity <= warningQuantityThreshold
  return (
    <div className={`${styles.quantitySelectorContainer} flex flex-column mb4`}>
      <div className="mb3 c-muted-2 t-body">
        <IOMessage id={quantityText} />
      </div>
      <NumericStepper
        size="small"
        value={selectedQuantity}
        minValue={1}
        maxValue={availableQuantity ? availableQuantity : undefined}
        onChange={useCallback(e => onChange(e.value), [])}
      />
      {showAvailable && (
        <div
          className={`${
            styles.availableQuantityContainer
          } mv4 c-muted-2 t-small`}
        >
          <IOMessage id={quantityText} values={{ availableQuantity }} />
        </div>
      )}
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
  warningQuantityThreshold: PropTypes.number.isRequired,
}

ProductQuantitySelector.schema = {
  title: 'admin/editor.product-quantity-selector.title',
  description: 'admin/editor.product-quantity-selector.description',
  type: 'object',
  properties: {
    warningQuantityThreshold: {
      title:
        'admin/editor.product-quantity-selector.warningQuantityThreshold.title',
      description:
        'admin/editor.product-quantity-selector.warningQuantityThreshold.title',
      type: 'number',
      default: 0,
    },
  },
}

export default injectIntl(ProductQuantitySelector)
