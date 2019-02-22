import React from 'react'

export const ExtensionPoint = props => (
  <div class="ExtensionPoint-mock">{props.children}</div>
)

export const withRuntimeContext = comp => comp
export const NoSSR = comp => comp
