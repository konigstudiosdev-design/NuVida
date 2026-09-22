import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[NuVida ErrorBoundary] Uncaught Error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F7F6F3',
            color: '#131210',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E0DBD2',
              borderRadius: 16,
              padding: 32,
              maxWidth: 480,
              boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌿</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#14432C', margin: '0 0 8px' }}>
              Ocurrió una pausa inesperada
            </h2>
            <p style={{ fontSize: 13, color: '#7C7870', margin: '0 0 20px', lineHeight: 1.5 }}>
              NuVida protegió la integridad de tu sesión. Haz clic abajo para recargar la sección de forma segura.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              style={{
                padding: '10px 22px',
                background: '#14432C',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🔄 Recargar Vista
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
