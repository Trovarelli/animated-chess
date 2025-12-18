import dynamic from 'next/dynamic';

const ChessGame = dynamic(() => import('@/components/ChessGame'), {
  ssr: false,
});

export default function Home() {
  return <ChessGame />;
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
