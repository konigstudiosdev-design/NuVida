interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  icon = '📋',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        background: 'var(--card)',
        border: '1px border-dashed var(--border)',
        borderRadius: 14,
        textAlign: 'center',
        margin: '12px 0',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
          marginBottom: 14,
        }}
      >
        {icon}
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', margin: '0 0 6px' }}>
        {title}
      </h3>

      <p style={{ fontSize: 13, color: 'var(--muted-foreground)', maxWidth: 380, margin: '0 0 18px', lineHeight: 1.5 }}>
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: '9px 18px',
            background: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-jakarta)',
            boxShadow: '0 2px 6px rgba(20,67,44,0.15)',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
