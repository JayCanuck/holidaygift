import 'normalize.css';
import '@/styles/components.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        /* @import url('https://fonts.googleapis.com/css2?family=Peralta&family=Sriracha&family=Signika&family=Amaranth&family=Acme&display=swap'); */
        @import url('https://fonts.googleapis.com/css2?family=Peralta&family=Sriracha&family=Amaranth&display=swap');
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
