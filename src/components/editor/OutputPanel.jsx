export default function OutputPanel({ output }) {
  return (
    <div style={{
      flex: 1,
      backgroundColor: '#11111B',
      border: '1px solid #313244',
      borderRadius: '8px',
      padding: '1rem',
      fontFamily: 'monospace',
      color: '#CDD6F4',
      overflowY: 'auto'
    }}>
      {output.length === 0 ? (
        <span style={{ color: '#6C7086' }}>Ready...</span>
      ) : (
        output.map((line, i) => <div key={i}>{line}</div>)
      )}
    </div>
  );
}
