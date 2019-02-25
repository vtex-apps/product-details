import React from 'react'

export const ExtensionPoint = ({ children, id }) => (
  <div className={`ExtensionPoint-mock-${id}`}>{children}</div>
)

export const withRuntimeContext = Comp => {
  const runtime = { account: 'account', culture: { country: 'country' } }
  return props => <Comp runtime={runtime} {...props} />
}
export const NoSSR = ({ children }) => children
