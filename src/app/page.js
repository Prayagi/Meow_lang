import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      backgroundColor: '#1E1E2E',
      color: '#CDD6F4',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#F38BA8' }}>Welcome to Meowsie 🐾</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Your emotional cat companion coding engine.</p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/playground/1" style={{
          padding: '1rem 2rem',
          backgroundColor: '#89B4FA',
          color: '#11111B',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }}>
          Enter Playground
        </Link>
        <Link href="/dashboard" style={{
          padding: '1rem 2rem',
          backgroundColor: '#A6E3A1',
          color: '#11111B',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }}>
          View Dashboard
        </Link>
      </div>
    </main>
  );
}
