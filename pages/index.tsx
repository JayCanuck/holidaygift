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

import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';
import Background from '@/components/Background';
import Giftbox from '@/components/Giftbox';
import Icons from '@/components/Icons';
import MuteButton from '@/components/MuteButton';
import Parchment from '@/components/Parchment';
import Snowfall from '@/components/Snowfall';

interface Game {
  name: string;
  code: string;
}

const stepTimes = [1000, 1000, 2000, 2000, 2000];

// https://stackoverflow.com/questions/7451508/html5-audio-playback-with-fade-in-and-fade-out
function audioVolumeIn(q: HTMLAudioElement, targetVolume: number) {
  if (q.volume) {
    let InT = 0;
    let setVolume = targetVolume; // Target volume level for new song
    let speed = 0.005; // Rate of increase
    q.volume = InT;
    let eAudio = setInterval(function () {
      InT += speed;
      q.volume = parseFloat(InT.toFixed(1));
      if (parseFloat(InT.toFixed(1)) >= setVolume) {
        clearInterval(eAudio);
        //alert('clearInterval eAudio'+ InT.toFixed(1));
      }
    }, 50);
  }
}

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
  const [muted, setMuted] = useState(false);
  const [snowActive, setSnowActive] = useState(false);
  const fetchRes = useRef<{ name?: string; games: Game[] }>();
  const [name, setName] = useState<string>();
  const [games, setGames] = useState<Game[]>();

  const handleMute = useCallback((value: boolean) => {
    setMuted(value);

    window.localStorage.setItem('mute', JSON.stringify(value));

    document.querySelectorAll('audio').forEach(ele => {
      ele.muted = value;
    });
  }, []);

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

  const getStep = useCallback(() => {
    if (!ref.current) return;

    for (let i = 0; i < ref.current.classList.length; i++) {
      const className = ref.current.classList[i];

      if (className.startsWith('step-')) {
        return parseInt(className.replace('step-', ''));
      }
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

  const messageIfReady = useCallback(
    (cb: () => void = () => {}) => {
      if (ref.current && getStep() === 4) {
        const bg = ref.current.querySelector<HTMLDivElement>('div.background');
        if (bg) {
          bg.style.webkitTransition = 'opacity 0.4s';
          bg.style.transition = 'opacity 0.4s';
        }
        ref.current.querySelectorAll<HTMLSpanElement>('span.letter').forEach(letter => {
          letter.style.opacity = '0';
        });
        cb();
      }
    },
    [getStep]
  );

  const runAnimation = useCallback(
    (step: number) => {
      incStep(step);

      if (step === 1) {
        (document.getElementById('wrapping-rustle') as HTMLAudioElement).volume = 0.5;
        (document.getElementById('wrapping-rustle') as HTMLAudioElement)?.play();
        setTimeout(() => (document.getElementById('box-opening') as HTMLAudioElement)?.play(), 650);
      }

      if (step === 2) {
        setTimeout(() => (document.getElementById('bg-music') as HTMLAudioElement)?.play(), 500);
      }

      if (step === 5) {
        return;
      }

      if (step === 4) {
        (document.getElementById('bell') as HTMLAudioElement).volume = 0.1;
        setTimeout(() => (document.getElementById('bell') as HTMLAudioElement)?.play(), 1000);
        if (fetchRes.current) {
          messageIfReady(() => setTimeout(runAnimation, stepTimes[4], 5));
        }

        setSnowActive(true);
        return;
      }

      if (step === 3) {
        // set different delays for each item
        setGridDelays();
      }

      setTimeout(runAnimation, stepTimes[step - 1], step + 1);
    },
    [incStep, messageIfReady, setGridDelays]
  );

  const giftClicked = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    let id = params.get('id');
    if (id === '0') id = '00000000-0000-0000-0000-000000000000'; // shorthand debug uuid alias

    runAnimation(1);

    if (id) {
      // fetch gift details in background while animation runs
      fetch(`/api/games?id=${id}`)
        .then(res => res.json())
        .then((details: { name?: string; games: Game[] }) => {
          fetchRes.current = details;
          if (details.name) setName(details.name);
          setGames(details.games);
          messageIfReady(() => setTimeout(runAnimation, stepTimes[4], 5));
        })
        .catch(err => {
          console.error(err);
          setGames(undefined);
        });
    }
  }, [messageIfReady, runAnimation]);

  useEffect(() => {
    try {
      const value = window.localStorage.getItem('mute');
      if (value) {
        const parsed = JSON.parse(value);
        setMuted(parsed);
        document.querySelectorAll('audio').forEach(ele => {
          ele.muted = parsed;
        });
      }
    } catch (e) {
      console.error('failed to load mute state from localstorage', e);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Happy Holidays!</title>
        <meta name='description' content='Jay sent you a holiday surprise' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='container'>
        <MuteButton muted={muted} onChange={handleMute} />
        <Snowfall active={snowActive} />
        <div className='merrywrap' ref={ref}>
          <Giftbox onClick={giftClicked} />
          <Icons />
          <Background />
          <Parchment
            recipient={name}
            games={games}
            // easter egg: special styling for Dom as they liked that font
            style={name === 'Dom' ? { fontFamily: 'var(--font-sriracha) !important' } : undefined}
          />
        </div>
      </div>
      <audio id='wrapping-rustle' preload='auto' src='/wrapping-paper-rustle.mp3' />
      <audio id='box-opening' preload='auto' src='/box-open.mp3' />
      <audio id='bell' preload='auto' src='/bell.mp3' />
      <audio
        id='bg-music'
        preload='auto'
        loop
        src='/piano-trio-mix-festive-fireside.mp3'
        onPlay={ev => audioVolumeIn(ev.target as HTMLAudioElement, 0.5)}
      />
    </>
  );
}
