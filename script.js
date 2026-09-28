const VIDEO_PRESETS = [{name:'itachi',url:'videos/itachi.webm'},
                       {name:'goku',url:'videos/goku.webm'},
                       {name:'car',url:'videos/car.webm'},
                       {name:'bat',url:'videos/bat.webm'},
                       {name:'miles',url:'videos/miles.webm'},
                       {name:'minecraft',url:'videos/minecraft.webm'},
                       {name:'luffy',url:'videos/luffy.webm'}

];
/* ═══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const FLIP_MS = 620;

  /* ---------- Gradient presets ---------- */
  const BG_PRESETS = [
    { name: 'Aurora',  css: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
    { name: 'Sunset',  css: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)' },
    { name: 'Ocean',   css: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' },
    { name: 'Neon',    css: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
    { name: 'Forest',  css: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
    { name: 'Rose',    css: 'linear-gradient(135deg, #5f2c82 0%, #49a09d 100%)' },
    { name: 'Vapor',   css: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)' },
    { name: 'Mono',    css: 'linear-gradient(135deg, #232526 0%, #414345 100%)' },
  ];

  /* ---------- Sounds ---------- */
  const sounds = {
    ctx: null,
    enabled: true,
    _lastClick: 0,
    _lastTick: 0,

    ensure() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
      }
      return this.ctx;
    },

    _run(fn) {
      const ctx = this.ensure();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().then(() => fn(ctx)).catch(() => {});
      else fn(ctx);
    },

    click() {
      if (!this.enabled) return;
      const now = performance.now();
      if (now - this._lastClick < 18) return;
      this._
