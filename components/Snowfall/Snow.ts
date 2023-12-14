/*
 * Original rectangle emitter code by Codrops
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

import type { LocationCoords, Particle } from './RectangleEmitter';

const snow: Particle = {
  /**
   * float  The current x position
   */
  x: 0,

  /**
   * float  The current y position
   */
  y: 0,

  /**
   * float  Alpha
   */
  alpha: 0.5,

  /**
   * float  The radius of the circle.
   */
  radius: 3,

  /**
   * Velocity for the particle.
   */
  velocity: {
    x: 0,
    y: 5
  },

  /**
   * Draws the particle onto the canvas in context.
   *
   * @param	c	 The canvas context to draw onto
   */
  draw: function (c) {
    c.fillStyle = 'rgba(255,255,255,' + this.alpha + ')';
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    c.fill();
  },

  /**
   * Updates the particle.
   */
  update: function () {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  },

  /**
   * Randomizes the settings for the particle
   *
   * @param	zone	The blastZone
   */
  randomize: function (zone) {
    // Get a random point inside the blastzone and set the x/y
    var s = this.getLocation(zone);
    this.x = s.x;
    this.y = s.y;

    this.alpha = this.randomRange(0.3, 1);
    this.radius = this.randomRange(1, 5);

    this.velocity = {
      x: this.randomRange(-0.35, 0.35),
      y: this.randomRange(0.75, 1.5)
    };
  },

  /**
   * Adds a random drift type motion to the particle.
   * Taken from the Flint particle system....
   */
  action: function () {
    this.velocity.x += (Math.random() - 0.5) * 0.1;
  },

  /**
   * Take a low and high number and gets a random number between them.
   *
   * @param	low		The low number
   * @param	high	The high number
   * @return	Number
   */
  randomRange: function (low, high) {
    return Math.random() * (high - low) + low;
  },

  /**
   * Gets a random starting point for the particle.
   * Taken from the Flint particle system in AS3
   *
   * @param	zone	The zone to get a location from
   * @return	Object
   */
  getLocation: function (z) {
    var p = {} as LocationCoords;
    p.x = z.x + Math.random() * z.width;
    p.y = z.y + Math.random() * z.height;
    return p;
  }
};

export default snow;
