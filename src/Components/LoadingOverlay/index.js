const LoadingOverlay = () => {
  return (
    <div
      style={{ 
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed', 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        top: 0, 
        left: 0, 
        zIndex: 9999 
      }}>
      <div 
        className="spinner-border" 
        role="status">
      </div>
    </div>
  )
}

export default LoadingOverlay