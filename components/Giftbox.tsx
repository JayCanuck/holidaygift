import { forwardRef } from 'react';

/*
 * Original giftbox code by Codrops
 * Copyright 2013, Codrops http://www.codrops.com
 * https://tympanus.net/codrops/2013/12/24/merry-christmas-with-a-bursting-gift-box/
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Typescript ES6 port by Jason Robitaille
 * Copyright 2023, Jason Robitaille https://jrobitaille.dev
 * Updates licensed under the Apache-2.0 license.
 * https://www.apache.org/licenses/LICENSE-2.0.txt
 */

const Giftbox = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>((props, ref) => (
  <div className='giftbox' {...props} ref={ref}>
    <div className='cover'>
      <div></div>
    </div>
    <div className='box'></div>
  </div>
));

Giftbox.displayName = 'Giftbox';

export default Giftbox;
