/*
 * Based on code by Codrops
 * Copyright 2013, Codrops http://www.codrops.com
 * https://tympanus.net/codrops/2013/12/24/merry-christmas-with-a-bursting-gift-box/
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Nextjs Typescript ES6 port by Jason Robitaille with alterations to suit game gifting purpose
 * Copyright 2023, Jason Robitaille https://jrobitaille.dev
 * Updates licensed under the Apache-2.0 license.
 * https://www.apache.org/licenses/LICENSE-2.0.txt
 */

import { Inter } from 'next/font/google';
import Head from 'next/head';
import { useCallback, useRef, useState } from 'react';
import Background from '@/components/Background';
import Giftbox from '@/components/Giftbox';
import Icons from '@/components/Icons';
import Snowfall from '@/components/Snowfall';

interface Game {
  name: string;
  code: string;
}

const inter = Inter({ subsets: ['latin'] });

const stepTimes = [1000, 1000, 2000, 2000, 2000];

// http://stackoverflow.com/a/2450976
function shuffle<T = unknown>(array: T[]) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const [snowActive, setSnowActive] = useState(false);
  const [msgActive, setMsgActive] = useState(false);
  const [name, setName] = useState<string>();
  const [games, setGames] = useState<Game[]>();

  const incStep = useCallback((step: number) => {
    if (!ref.current) return;

    const prev = `step-${step - 1}`;
    const next = `step-${step}`;

    if (ref.current.classList.contains(prev)) {
      ref.current.classList.remove(prev);
    }
    if (!ref.current.classList.contains(next)) {
      ref.current.classList.add(next);
    }
  }, []);

  const setGridDelays = useCallback(() => {
    if (!ref.current) return;

    ([] as Element[]).slice.call(ref.current.querySelectorAll('.row')).forEach(function (row, i) {
      var itemsrow = ([] as HTMLSpanElement[]).slice.call(row.querySelectorAll('span')),
        itemsrowCount = itemsrow.length,
        factor = (itemsrowCount - 1) * 0.01,
        delays = [itemsrowCount - 1];

      for (var k = 0; k < itemsrowCount; ++k) delays[k] = k * 0.01 + (itemsrowCount - 1 - i) * factor;

      shuffle(itemsrow);

      itemsrow.forEach(function (item, j) {
        var delay = delays[j];
        item.style.webkitTransition = '-webkit-transform 0.4s ease-out ' + delay + 's, opacity 0.4s ' + delay + 's';
        item.style.transition = 'transform 0.4s ease-out ' + delay + 's, opacity 0.4s ' + delay + 's';
      });
    });
  }, []);

  const runAnimation = useCallback(
    (step: number) => {
      incStep(step);

      if (step === 5) {
        setMsgActive(true);
        return;
      }

      if (step === 4) {
        const params = new URLSearchParams(window.location.search);
        let id = params.get('id');
        if (id === '0') id = '00000000-0000-0000-0000-000000000000'; // shorthand debug uuid alias

        fetch(`/api/games?id=${id}`)
          .then(res => res.json())
          .then((details: { name?: string; games: Game[] }) => {
            if (details.name) setName(details.name);
            setGames(details.games);
            if (ref.current) {
              /*const bg = ref.current.querySelector<HTMLDivElement>('div.background');
              if (bg) {
                bg.style.webkitTransition = 'opacity 0.6s';
                bg.style.transition = 'opacity 0.6s';
              }*/
              ref.current.querySelectorAll<HTMLSpanElement>('span.letter').forEach(letter => {
                letter.style.opacity = '0';
              });
            }
            setTimeout(runAnimation, stepTimes[4], 5);
          })
          .catch(err => {
            console.error(err);
            setGames([]);
          });

        setSnowActive(true);
        return;
      }

      if (step === 3) {
        // set different delays for each item
        setGridDelays();
      }

      setTimeout(runAnimation, stepTimes[step - 1], step + 1);
    },
    [incStep, setGridDelays]
  );

  const giftClicked = useCallback(() => {
    runAnimation(1);
  }, [runAnimation]);

  console.log({ active: msgActive, name, games });

  return (
    <>
      <Head>
        <title>Happy Holidays!</title>
        <meta name='description' content='Jay sent you a holiday surprise' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={`container ${inter.className}`}>
        <Snowfall active={snowActive} />
        <div className='merrywrap' ref={ref}>
          <Giftbox onClick={giftClicked} />
          <Icons />
          <Background />
        </div>
      </div>
    </>
  );
}
