import { forwardRef, useCallback } from 'react';

interface MuteButtonProps extends Omit<React.HTMLProps<HTMLButtonElement>, 'onChange' | 'onClick'> {
  muted: boolean;
  onChange: (value: boolean) => void;
}

const MuteButton = forwardRef<HTMLButtonElement, MuteButtonProps>(({ muted, onChange, ...props }, ref) => {
  const handleToggle = useCallback(() => {
    onChange(!muted);
  }, [muted, onChange]);

  return (
    <button
      className='mute'
      {...props}
      type='button'
      title={muted ? 'Unmute' : 'Mute'}
      onClick={handleToggle}
      ref={ref}
    >
      {!muted ? (
        <svg
          fill='#000000'
          width='100%'
          height='100%'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
          preserveAspectRatio='xMidYMid meet'
        >
          <path
            fillRule='evenodd'
            d='M11.553 3.064A.75.75 0 0112 3.75v16.5a.75.75 0 01-1.255.555L5.46 16H2.75A1.75 1.75 0 011 14.25v-4.5C1 8.784 1.784 8 2.75 8h2.71l5.285-4.805a.75.75 0 01.808-.13zM10.5 5.445l-4.245 3.86a.75.75 0 01-.505.195h-3a.25.25 0 00-.25.25v4.5c0 .138.112.25.25.25h3a.75.75 0 01.505.195l4.245 3.86V5.445z'
          />
          <path d='M18.718 4.222a.75.75 0 011.06 0c4.296 4.296 4.296 11.26 0 15.556a.75.75 0 01-1.06-1.06 9.5 9.5 0 000-13.436.75.75 0 010-1.06z' />
          <path d='M16.243 7.757a.75.75 0 10-1.061 1.061 4.5 4.5 0 010 6.364.75.75 0 001.06 1.06 6 6 0 000-8.485z' />
        </svg>
      ) : (
        <svg
          fill='#000000'
          width='100%'
          height='100%'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
          preserveAspectRatio='xMidYMid meet'
        >
          <path
            fillRule='evenodd'
            d='M12 3.75a.75.75 0 00-1.255-.555L5.46 8H2.75A1.75 1.75 0 001 9.75v4.5c0 .966.784 1.75 1.75 1.75h2.71l5.285 4.805A.75.75 0 0012 20.25V3.75zM6.255 9.305l4.245-3.86v13.11l-4.245-3.86a.75.75 0 00-.505-.195h-3a.25.25 0 01-.25-.25v-4.5a.25.25 0 01.25-.25h3a.75.75 0 00.505-.195z'
          />
          <path d='M16.28 8.22a.75.75 0 10-1.06 1.06L17.94 12l-2.72 2.72a.75.75 0 101.06 1.06L19 13.06l2.72 2.72a.75.75 0 101.06-1.06L20.06 12l2.72-2.72a.75.75 0 00-1.06-1.06L19 10.94l-2.72-2.72z' />
        </svg>
      )}
    </button>
  );
});

MuteButton.displayName = 'MuteButton';

export default MuteButton;
