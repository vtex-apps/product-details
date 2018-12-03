import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

class FixedButton extends Component {
  constructor(props) {
    super(props)

    this.ref = React.createRef()
    this.state = { mounted: false }
    this.el = document.createElement('div')
  }

  componentDidMount() {
    this.fixedRoot = this.ref.current

    while (this.fixedRoot &&
          window.getComputedStyle(this.fixedRoot)
            .getPropertyValue('overflow') !== 'auto') { this.fixedRoot = this.fixedRoot.parentElement }

    if (!this.fixedRoot)this.fixedRoot = document.body

    this.fixedRoot && this.fixedRoot.appendChild(this.el)
    this.setState({ mounted: true })
  }

  componentWillUnmount() {
    this.fixedRoot && this.fixedRoot.removeChild(this.el)
  }

  render() {
    const { mounted } = this.state

    if (!mounted) return <div ref={this.ref} />

    const children = this.props.children

    return ReactDOM.createPortal(
      <Fragment>
        <div className="o-0">
          {children}
        </div>
        <div className="fixed bottom-0 left-0 w-100 z-999">
          {children}
        </div>
      </Fragment>,
      this.el,
    )
  }
}

FixedButton.propTypes = {
  children: PropTypes.node,
}

export default FixedButton
