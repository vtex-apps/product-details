import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

const serverSide = !window.navigator

class FixedButton extends Component {
  constructor(props) {
    super(props)
    if (serverSide) return

    this.ref = React.createRef()
    this.state = { mounted: false }
    this.el = document.createElement('div')
  }

  componentDidMount() {
    if (serverSide) return
    this.fixedRoot = this.ref.current

    while (this.fixedRoot &&
          window.getComputedStyle(this.fixedRoot)
            .getPropertyValue('overflow') !== 'auto') { this.fixedRoot = this.fixedRoot.parentElement }

    if (!this.fixedRoot)this.fixedRoot = document.body

    this.fixedRoot && this.fixedRoot.appendChild(this.el)
    this.setState({ mounted: true })
  }

  componentWillUnmount() {
    if (serverSide) return
    this.fixedRoot && this.fixedRoot.removeChild(this.el)
  }

  render() {
    const children = this.props.children

    if (serverSide) return children

    const { mounted } = this.state

    if (!mounted) return <div ref={this.ref} />

    return ReactDOM.createPortal(
      <Fragment>
        <div className="o-0" tabIndex="-1">
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
