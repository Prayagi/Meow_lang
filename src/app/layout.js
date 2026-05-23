import './globals.css';

export const metadata = {
  title: 'Meow — Learn to Code with Your Cat Companion 🐱',
  description: 'A playful, immersive coding ecosystem that makes programming feel fun, emotionally rewarding, and non-intimidating. Code without feeling like you\'re studying!',
  keywords: ['coding', 'programming', 'learn to code', 'beginner programming', 'cat', 'fun coding', 'meow language'],
  authors: [{ name: 'Meow Team' }],
  openGraph: {
    title: 'Meow — Code Without Feeling Like You\'re Studying 🐱',
    description: 'A playful coding ecosystem with a cat companion, missions, and rewards.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div className="bg-animated" />
        {children}
      </body>
    </html>
  );
}
