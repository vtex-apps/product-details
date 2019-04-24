import * as React from 'react'
import { ProductContext } from 'vtex.product-context'

export const withContext = (WrappedComponent, context, contextPropTypes) => {
  return class App extends React.Component {
    static childContextTypes = contextPropTypes

    getChildContext() {
      return context
    }

    render() {
      return (
        <ProductContext.Provider value={context}>
          <WrappedComponent {...this.props} />
        </ProductContext.Provider>
      )
    }
  }
}
