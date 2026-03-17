import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('UI error boundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-error-boundary">
          <h2>Un problème est survenu.</h2>
          <p>Veuillez recharger la page. Si le problème persiste, contactez l’administrateur.</p>
          <button type="button" className="app-error-reload" onClick={() => window.location.reload()}>
            Recharger
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
