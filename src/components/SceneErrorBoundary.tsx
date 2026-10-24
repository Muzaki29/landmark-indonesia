import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ViewerFallback } from './ViewerFallback'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  failed: boolean
}

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unable to render the landmark scene.', error, info.componentStack)
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? <ViewerFallback />) : this.props.children
  }
}
