import { forwardRef, useEffect, useMemo, useRef } from 'react';

const defaultMessage = (games: unknown[] = []) =>
  `Here's a little gift to brighten your day, ${games.length} mystery Steam games.  Who knows what they could be? Redeem and see.`;

export interface ParchmentProps extends React.HTMLProps<HTMLDivElement> {
  recipient?: string;
  message?: string;
  games?: {
    name: string;
    code: string;
  }[];
}

const Parchment = forwardRef<HTMLDivElement, ParchmentProps>(({ recipient, message, games, ...props }, ref) => {
  const innerRef = useRef<HTMLDivElement>(null);

  const svgHTML = useMemo(
    () =>
      (process.env.NEXT_PUBLIC_PARCHMENT_SVG || '').replace(
        '</svg>',
        ` <foreignObject x="20%" y="10%" width="60%" height="80%" xmlns="http://www.w3.org/1999/xhtml">
            <div class="content">
            ${recipient ? `<div class="recipient">${recipient},</div>` : ''}
            <div class="message">${message || defaultMessage(games)}</div>
            ${
              games && games.length > 0
                ? `<div class="games-wrapper">
                    <div class="games">${games
                      .map(
                        (game, i) =>
                          `<input
                              key="game-code-${i}-${game.code}"
                              class="code"
                              type="text"
                              value="${game.code}"
                              readOnly
                            />`
                      )
                      .join('')}</div>
                  </div>`
                : ''
            }
            <div class="message">Hope you have a great holidays and a happy new year!</div>
            <div class="signature">-Jay</div>
          </div>
          </foreignObject>
        </svg>`
      ),
    [games, message, recipient]
  );

  useEffect(() => {
    if (!innerRef.current) return;
    const svg = innerRef.current.getElementsByTagName('svg')[0];
    if (!svg) return;

    // ensure svg attributes good
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
  });

  return (
    <div className='parchment' {...props} ref={ref}>
      <div className='parchment-inner' ref={innerRef} dangerouslySetInnerHTML={{ __html: svgHTML }} />
    </div>
  );
});

Parchment.displayName = 'Parchment';

export default Parchment;
