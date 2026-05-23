export default function CodeEditor({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: '#181825',
        color: '#A6E3A1',
        border: '1px solid #313244',
        borderRadius: '8px',
        padding: '1rem',
        fontFamily: 'monospace',
        fontSize: '1.1rem',
        resize: 'none',
        outline: 'none'
      }}
    />
  );
}
