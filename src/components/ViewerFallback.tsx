interface ViewerFallbackProps {
  title?: string
  message?: string
}

export function ViewerFallback({
  title = '3D view unavailable',
  message = 'Your browser could not start the WebGL scene. Try updating the browser or enabling hardware acceleration.',
}: ViewerFallbackProps) {
  return (
    <div className="viewer-fallback" role="alert">
      <span aria-hidden="true">◇</span>
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  )
}
