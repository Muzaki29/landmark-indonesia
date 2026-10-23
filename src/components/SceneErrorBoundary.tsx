import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ViewerFallback } from './ViewerFallback'

interface Props {
  children: ReactNode
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
    return this.state.failed ? <ViewerFallback /> : this.props.children
  }
}
