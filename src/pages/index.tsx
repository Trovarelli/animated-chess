import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ChessGame = dynamic(() => import('@/components/ChessGame'), {
  ssr: false,
});

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#fff', color: '#000', height: '100vh' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.message}</pre>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: '#f5f5f5',
        color: '#666'
      }}>
        Loading Game Environment...
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ChessGame />
    </ErrorBoundary>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
