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
      maxHeight: '200px'
    }}>
      <h4 style={{ margin: '0 0 0.5rem 0' }}>Errors Detected:</h4>
      <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
        {errors.map((err, i) => (
          <li key={i}>
            <strong>{err.type}:</strong> {err.message} 
            {err.line && ` (Line ${err.line}, Col ${err.column})`}
          </li>
        ))}
      </ul>
    </div>
  );
}
