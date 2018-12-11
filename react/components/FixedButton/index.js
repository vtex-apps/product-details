import React, { Fragment } from 'react'
import BottomExtraSpace from './BottomExtraSpace'
import { NoSSR } from 'render'

export default props => (
  <Fragment>
    <div className="fixed bottom-0 left-0 w-100 z-4">
      {props.children}
    </div>
    <NoSSR>
      <BottomExtraSpace>
        {props.children}
      </BottomExtraSpace>
    </NoSSR>
  </Fragment>)

