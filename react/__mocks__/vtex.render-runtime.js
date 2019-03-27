import React from 'react'

export const ExtensionPoint = ({ children, id }) => (
  <div className={`extensionPoint-mock-${id}`}>{children}</div>
)

export const withRuntimeContext = Comp => {
  const runtime = { account: 'account', culture: { country: 'country' } }
  return props => <Comp runtime={runtime} {...props} />
}

export const NoSSR = ({ children }) => (
  <div className="NoSSR-mock">{children}</div>
)
export const useRuntime = () => {
  return { account: 'storecomponents', culture: { country: 'Brasil' } }
}
