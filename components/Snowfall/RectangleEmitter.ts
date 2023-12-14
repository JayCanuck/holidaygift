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

export interface BlastZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LocationCoords {
  x: number;
  y: number;
}

export interface VelocityVectors {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  alpha: number;
  radius: number;
  velocity: VelocityVectors;
  draw: (context: CanvasRenderingContext2D) => void;
  update: () => void;
  randomize: (zone: BlastZone) => void;
  action: () => void;
  randomRange: (low: number, high: number) => number;
  getLocation: (zone: BlastZone) => LocationCoords;
}

export interface RectangleEmitterObject {
  canvas: null | HTMLCanvasElement;
  context: null | CanvasRenderingContext2D;
  blastZone: BlastZone;
  particle: null | Particle;
  particles: Particle[];
  maxParticles: number;
  fpsId: null | ReturnType<typeof setInterval>;
  tickId: null | ReturnType<typeof setInterval>;
  setCanvas: (canvas: HTMLCanvasElement) => void;
  setBlastZone: (x: number, y: number, width: number, height: number) => void;
  start: (fps: number) => void;
  pause: () => void;
  stop: () => void;
  clear: () => void;
  addParticle: (particle: Particle) => void;
  draw: () => void;
  update: () => void;
  applyActions: () => void;
  runAhead: (seconds: number) => void;
  frameUpdate: (emitter: RectangleEmitterObject) => void;
  tick: (emitter: RectangleEmitterObject) => void;
}

const rectangleEmitter: RectangleEmitterObject = {
  /**
   * The canvas object
   */
  canvas: null,

  /**
   * CanvasContext  The canvas context object
   */
  context: null,

  /**
   * Object The blast zone for particles.
   */
  blastZone: {
    x: 0,
    y: 0,
    width: 800,
    height: 600
  },

  /**
   * Particle The type of particle to create.
   */
  particle: null,

  /**
   * array The list of particles in the emitter.
   */
  particles: [],

  /**
   * The max number of particles.
   */
  maxParticles: 700,

  /**
   * The intervalID for the FPS interval
   */
  fpsId: null,

  /**
   * The interval ID for the seconds tick.
   */
  tickId: null,

  /**
   * Sets the canvas object.
   *
   * @param canvas DOMCanvasElement  The canvas to draw on.
   */
  setCanvas: function (canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  },

  /**
   * Sets the blast zone.
   *
   * @param x      int  The x coord
   * @param y      int  The y-coor
   * @param width  int  The width
   * @param height int  The height
   */
  setBlastZone: function (x, y, width, height) {
    this.blastZone = {
      x: x,
      y: y,
      width: width,
      height: height
    };
  },

  /** Starts the emitter.
   *
   * @param	fps	The frame rate or 30 by default
   */
  start: function (fps) {
    var rate = fps || 30;
    this.fpsId = setInterval(this.frameUpdate, 1000 / rate, this); // Framerate update
    this.tickId = setInterval(this.tick, 1000, this); // Every second tick...
  },

  /**
   * Pauses the emitter but doesn't clear the screen.
   */
  pause: function () {
    if (this.fpsId) clearInterval(this.fpsId);
    if (this.tickId) clearInterval(this.tickId);
  },

  /**
   * Stops the emitter and clears the screen.
   */
  stop: function () {
    if (this.fpsId) clearInterval(this.fpsId);
    if (this.tickId) clearInterval(this.tickId);
    this.clear();
  },

  /**
   * Clears off the particles.
   */
  clear: function () {
    this.context!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
  },

  /**
   * Adds a particle to the screen.
   *
   * @param	particle	The particle to add
   */
  addParticle: function (particle) {
    if (this.particles.length < this.maxParticles) {
      var p = Object.create(particle);
      p.randomize(this.blastZone);

      // Add the particle
      this.particles.push(p);
    }
  },

  /**
   * Draws the whole canvas.
   */
  draw: function () {
    this.clear();

    var i = this.particles.length;
    while (i--) {
      this.particles[i].draw(this.context!);
    }
  },

  /**
   * Updates the particles on the screen.
   */
  update: function () {
    var p;
    var i = this.particles.length;

    while (i--) {
      p = this.particles[i];
      p.update();

      // Remove the particle if it is "dead"
      if (p.y > this.canvas!.height) {
        this.particles.splice(i, 1);
      }
    }
  },

  /**
   * Applies actions to all of the particles.
   */
  applyActions: function () {
    var i = this.particles.length;

    while (i--) {
      this.particles[i].action();
    }
  },

  /**
   * Run the action ahead the number of seconds (so the screen isn't blank on init).
   *
   * @param seconds int  The number of seconds to run ahead.
   */
  runAhead: function (seconds) {
    for (let i = 0; i < seconds; i += 1) {
      this.frameUpdate(this);
    }
  },

  /**
   * The FPS update
   *
   * @param	self	The reference to the emitter that is lost during setInterval.
   */
  frameUpdate: function (self) {
    self.addParticle(self.particle!);
    self.update();
    self.draw();
  },

  /**
   * The seconds "tick" interval
   *
   * @param	self	The reference to the emitter that is lost during setInterval.
   */
  tick: function (self) {
    self.applyActions();
  }
};

export default rectangleEmitter;
