import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

// TODO: When the npm-storecomponents turn into apps, delete this and use the Price Component.
/**
 * The Price component. Shows the prices information of the Product Summary.
 */
class Price extends Component {
  static contextTypes = {
    culture: PropTypes.object,
  }

  render() {
    const {
      sellingPrice,
      listPrice,
      installments,
      installmentPrice,
      showInstallments,
      showLabels,
      showSavings,
      intl: { formatNumber },
    } = this.props

    const differentPrices =
      this.props.showListPrice && sellingPrice !== listPrice

    const currencyOptions = {
      style: 'currency',
      currency: this.context.culture.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }

    const formattedInstallmentPrice = formatNumber(
      installmentPrice,
      currencyOptions
    )

    const [installmentsElement, installmentPriceElement, timesElement] = [
      installments,
      formattedInstallmentPrice,
      <span key="times">&times;</span>,
    ].map((element, index) => (
      <span className="f4-ns f5-s ph1" key={index}>
        {element}
      </span>
    ))

    return (
      <div className="vtex-price flex flex-column justify-around">
        {differentPrices && (
          <div className="pv1 f6-ns f7-s normal">
            {showLabels && (
              <div className="vtex-price-list__label dib strike">
                <FormattedMessage id="pricing.from" />
              </div>
            )}
            <div className="vtex-price-list dib ph2 strike">
              {formatNumber(listPrice, currencyOptions)}
            </div>
          </div>
        )}
        <div className="pv1 b f4-ns f5-s">
          {showLabels && (
            <div className="vtex-selling-price__label f2 dib">
              <FormattedMessage id="pricing.to" />
            </div>
          )}
          <div className="vtex-selling-price dib ph2 f2-ns f2-s">
            {formatNumber(sellingPrice, currencyOptions)}
          </div>
        </div>
        {showInstallments &&
          installments &&
          installmentPrice && (
          <div className="f6-ns f7-s">
            <div className="vtex-price-installments dib">
              {showLabels ? (
                <FormattedMessage
                  id="pricing.installment-display"
                  values={{
                    installments: installmentsElement,
                    installmentPrice: installmentPriceElement,
                    times: timesElement,
                  }}
                />
              ) : (
                <span>
                  {installmentsElement} {timesElement}{' '}
                  {installmentPriceElement}
                </span>
              )}
            </div>
          </div>
        )}
        {differentPrices &&
          showSavings && (
          <div className="f6-ns f7-s">
            <div className="vtex-price-savings dib">
              <FormattedMessage
                id="pricing.savings"
                values={{
                  savings: formatNumber(
                    listPrice - sellingPrice,
                    currencyOptions
                  ),
                }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}

Price.propTypes = {
  /** Product selling price */
  sellingPrice: PropTypes.number.isRequired,
  /** Product list price */
  listPrice: PropTypes.number.isRequired,
  /** Determines if the list price is shown or not */
  showListPrice: PropTypes.bool.isRequired,
  /** Determines if the labels are shown. If false, only the values will be shown */
  showLabels: PropTypes.bool.isRequired,
  /** Determines if the installments are shown */
  showInstallments: PropTypes.bool.isRequired,
  /** Available number of installments */
  installments: PropTypes.number,
  /** Single installment price */
  installmentPrice: PropTypes.number,
  /** Determines if the savings information is shown */
  showSavings: PropTypes.bool,
  /** intl property to format data */
  intl: intlShape.isRequired,
}

Price.defaultProps = {
  showListPrice: true,
  showLabels: true,
  showInstallments: false,
}

export default injectIntl(Price)
