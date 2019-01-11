import React, { Fragment } from 'react'
import BottomExtraSpace from './BottomExtraSpace'
import { NoSSR } from 'render'

import productDetails from '../../productDetails'
export default props => (
  <Fragment>
    <div className={`${productDetails.fixedButton} fixed bottom-0 left-0 w-100 z-999`}>
      {props.children}
    </div>
    <NoSSR>
      <BottomExtraSpace>
        {props.children}
      </BottomExtraSpace>
    </NoSSR>
  </Fragment>)

