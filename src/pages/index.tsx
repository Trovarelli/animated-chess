import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ChessGame = dynamic(() => import('@/components/ChessGame'), {
  ssr: false,
});

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div style={{ padding: '20px' }}>Loading environment...</div>;

  return <ChessGame />;
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
