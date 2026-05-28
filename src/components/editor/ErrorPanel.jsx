export default function ErrorPanel({ errors }) {
  return (
    <div style={{
      backgroundColor: '#31111D',
      border: '1px solid #F38BA8',
      borderRadius: '8px',
      padding: '1rem',
      color: '#F38BA8',
      marginTop: '1rem',
      overflowY: 'auto',
      maxHeight: '240px'
    }}>
      <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Errors Detected:</span>
      </h4>
      <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
        {errors.map((err, i) => (
          <li key={i} style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div>
              <strong>{err.type}:</strong> {err.message} {err.line && ` (Line ${err.line}, Col ${err.column})`}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
