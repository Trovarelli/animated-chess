export default function Home() {
  return (
    <div style={{ color: 'red', fontSize: '50px', padding: '50px' }}>
      Vercel Test: If you see this in Red, basic rendering works.
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
