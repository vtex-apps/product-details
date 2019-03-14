import React from 'react'
import { render } from 'react-testing-library'
import { IntlProvider } from 'react-intl'
import defautMessages from '../../messages/en.json'

export const renderWithIntl = (node, options) => {
  const rendered = render(
    <IntlProvider messages={defautMessages} locale="en-US">
      {node}
    </IntlProvider>,
    options
  )

  return {
    ...rendered,
    rerender: newUi =>
      renderWithIntl(newUi, {
        container: rendered.container,
        baseElement: rendered.baseElement,
      }),
  }
}
