import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

const IntlInjector = ({ children, intl }) => children(intl)

IntlInjector.propTypes = {
  children: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
}

export default injectIntl(IntlInjector)
