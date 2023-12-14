import { useEffect, useRef } from 'react';
import rectangleEmitter, { RectangleEmitterObject } from './RectangleEmitter';
import snow from './Snow';

export interface SnowfallProps {
  active?: boolean;
}

const Snowfall: React.FC<SnowfallProps> = ({ active }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (active && ref.current) {
      // https://github.com/daveWid/canvas-snow
      ref.current.width = window.innerWidth;
      ref.current.height = window.innerHeight;
      // Now the emitter
      var emitter: RectangleEmitterObject = Object.create(rectangleEmitter);
      emitter.setCanvas(ref.current);
      emitter.setBlastZone(0, -10, ref.current.width, 1);
      emitter.particle = snow;
      emitter.runAhead(0);
      emitter.start(60);

      return () => {
        emitter.stop();
      };
    }
  }, [active]);

  return <canvas ref={ref} />;
};

export default Snowfall;
