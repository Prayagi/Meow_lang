export default function RunButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '1rem 2rem',
        backgroundColor: '#A6E3A1',
        color: '#11111B',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        cursor: 'pointer',
        alignSelf: 'flex-start'
      }}
    >
      Run Code ▶
    </button>
  );
}
