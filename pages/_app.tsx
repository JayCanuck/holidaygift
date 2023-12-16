import type { AppProps } from 'next/app';
import { Amaranth, Peralta, Sriracha } from 'next/font/google';
import 'normalize.css';
import '@/styles/components.css';

const amaranth = Amaranth({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-amaranth'
});

const peralta = Peralta({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-peralta'
});

const sriracha = Sriracha({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-sriracha'
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${amaranth.variable} ${peralta.variable} ${sriracha.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}
