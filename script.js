/* ═══════════════════════════════════════════════════════════════════════
   🎬  GIF WALLPAPERS — ADD YOUR OWN HERE
   ─────────────────────────────────────────────────────────────────────
   Paste direct .gif URLs between the brackets below. They'll appear as
   clickable thumbnails in the "GIF wallpapers" section of the menu,
   separate from the presets. Enables glass mode automatically.

   Format (one per line):
       { name: 'Short label', url: 'https://.../file.gif' },

   Example:
       { name: 'Matrix',  url: 'https://media.giphy.com/media/xxx/giphy.gif' },
       { name: 'Neon',    url: 'https://example.com/neon-loop.gif' },

   Leave the array empty to show the "add GIF URLs in the code" hint.
   ═══════════════════════════════════════════════════════════════════════ */
const GIF_PRESETS = [
  // 👇 ADD YOUR GIFs HERE — one per line, keep the comma at the end
  // { name: 'My GIF', url: 'https://example.com/animation.gif' },
  // { name: 'Cool loop', url: 'https://example.com/loop.gif' },
];
/* ═══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const FLIP_MS = 620;

  /* ---------- Presets (solid CSS gradients, no glass) ---------- */
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
    ctx: null, enabled: true, _lastClick: 0, _lastTick: 0,

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
      this._lastClick = now;
      this._run((ctx) => {
        const t = ctx.currentTime;
        const len = Math.floor(ctx.sampleRate * 0.008);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random()*2-1) * Math.pow(1-i/len, 2);
        const noise = ctx.createBufferSource(); noise.buffer = buf;
        const hpN = ctx.createBiquadFilter(); hpN.type = 'highpass'; hpN.frequency.value = 1400;
        const ng = ctx.createGain(); ng.gain.value = 0.55;
        noise.connect(hpN).connect(ng).connect(ctx.destination);
        noise.start(t);

        const o = ctx.createOscillator();
        o.type = 'square';
        o.frequency.setValueAtTime(2800, t);
        o.frequency.exponentialRampToValueAtTime(1100, t + 0.012);
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 700;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.30, t + 0.001);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.024);
        o.connect(hp).connect(g).connect(ctx.destination);
        o.start(t); o.stop(t + 0.03);
      });
    },
    tick() {
      if (!this.enabled) return;
      const now = performance.now();
      if (now - this._lastTick < 35) return;
      this._lastTick = now;
      this._run((ctx) => {
        const t = ctx.currentTime;
        const o = ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.setValueAtTime(1800, t);
        o.frequency.exponentialRampToValueAtTime(420, t + 0.030);
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3800;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.40, t + 0.002);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.058);
        o.connect(lp).connect(g).connect(ctx.destination);
        o.start(t); o.stop(t + 0.07);

        const len = Math.floor(ctx.sampleRate * 0.005);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random()*2-1) * Math.pow(1-i/len, 2);
        const noise = ctx.createBufferSource(); noise.buffer = buf;
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 1.2;
        const ng = ctx.createGain(); ng.gain.value = 0.18;
        noise.connect(bp).connect(ng).connect(ctx.destination);
        noise.start(t);
      });
    }
  };

  ['pointerdown', 'mousedown', 'touchstart', 'keydown'].forEach(ev =>
    window.addEventListener(ev, () => sounds.ensure(), { once: true, capture: true })
  );

  /* ---------- Palettes ---------- */
  const PALETTES = {
    green: { label:'Green', digit:'#e3eed7', cardBg:'#0b120e', glow:'90,170,110',
             panel:['#55795e','#33503c','#1a2c20','#0c1510'], knob:['#4a5a4c','#1d2620','#33423a','#131a15'] },
    red:   { label:'Red',   digit:'#ffd0d0', cardBg:'#140606', glow:'255,90,90',
             panel:['#7a4a4a','#503030','#2c1a1a','#150c0c'], knob:['#5a2a2a','#261010','#422020','#150808'] },
    blue:  { label:'Blue',  digit:'#cfe3ff', cardBg:'#060a14', glow:'90,140,255',
             panel:['#4a5a7a','#303a50','#1a1f2c','#0c0f15'], knob:['#2a3a5a','#10182a','#203048','#08101e'] },
    pink:  { label:'Pink',  digit:'#ffd0e8', cardBg:'#14060e', glow:'255,100,180',
             panel:['#7a4a6a','#503050','#2c1a26','#150c12'], knob:['#5a2a45','#26101e','#422032','#15081a'] },
    black: { label:'Black', digit:'#f5f5f5', cardBg:'#050505', glow:'80,80,80',
             panel:['#3a3a3a','#252525','#151515','#080808'], knob:['#3a3a3a','#151515','#282828','#0a0a0a'] },
    white: { label:'White', digit:'#1a1a1a', cardBg:'#e8e8e8', glow:'255,255,255',
             panel:['#f0f0f0','#e0e0e0','#d0d0d0','#b8b8b8'], knob:['#d8d8d8','#a8a8a8','#c0c0c0','#909090'] }
  };

  /* ---------- FlipCard ---------- */
  class FlipCard {
    constructor(parent, instant = false) {
      const el = document.createElement('div');
      el.className = 'card';
      el.innerHTML =
        '<div class="half static-top"><span class="digit">0</span></div>' +
        '<div class="half static-bottom"><span class="digit">0</span></div>' +
        '<div class="half flap flap-top"><span class="digit">0</span></div>' +
        '<div class="half flap flap-bottom"><span class="digit">0</span></div>' +
        '<div class="seam"></div>';
      parent.appendChild(el);
      this.el = el; this.instant = instant; this.current = '0'; this.timer = null;
      this.st = el.querySelector('.static-top .digit');
      this.sb = el.querySelector('.static-bottom .digit');
      this.ft = el.querySelector('.flap-top .digit');
      this.fb = el.querySelector('.flap-bottom .digit');
    }
    setInstant(v) {
      if (v === this.current) return;
      this.current = v;
      this.st.textContent = v; this.sb.textContent = v;
    }
    flipTo(value) {
      if (value === this.current) return;
      if (this.instant) return this.setInstant(value);
      if (this.timer) { clearTimeout(this.timer); this.timer = null; }
      if (this.el.classList.contains('flipping')) {
        this.el.classList.remove('flipping');
        this.sb.textContent = this.current;
        void this.el.offsetWidth;
      }
      const oldValue = this.current;
      this.current = value;
      this.st.textContent = value;
      this.sb.textContent = oldValue;
      this.ft.textContent = oldValue;
      this.fb.textContent = value;
      void this.el.offsetWidth;
      this.el.classList.add('flipping');
      sounds.tick();
      this.timer = setTimeout(() => {
        this.timer = null;
        this.sb.textContent = value;
        this.el.classList.remove('flipping');
      }, FLIP_MS);
    }
  }

  /* ---------- State ---------- */
  const state = {
    mode: 'clock',
    clockOffsetMs: 0,
    alarm: { h: 7, m: 0, s: 0, on: false },
    ringing: false,
    sw: { running: false, start: 0, elapsed: 0 },
    knobOffset: 0,
    fmt: 12,
    color: 'green',
    minimal: false,
    bgType: 'none',         // 'none' | 'preset' | 'image'
    bgValue: null,
    presetId: null,
    gifId: null
  };

  const clockEl  = document.getElementById('clock');
  const knobEl   = document.getElementById('knob');
  const panelEl  = document.getElementById('panel');
  const statusEl = document.getElementById('status');
  const menuBtn  = document.getElementById('menuBtn');
  const menuEl   = document.getElementById('menu');

  let cards = [], colons = [];

  const makeColon = () => { const c = document.createElement('div'); c.className='colon'; c.innerHTML='<i></i><i></i>'; colons.push(c); return c; };
  const makeGroup = () => { const g = document.createElement('div'); g.className='group'; return g; };

  function build() {
    clockEl.innerHTML = ''; cards = []; colons = [];
    const instantLastPair = (state.mode === 'stopwatch');
    for (let g = 0; g < 3; g++) {
      if (g > 0) clockEl.appendChild(makeColon());
      const group = makeGroup();
      const instant = instantLastPair && g === 2;
      cards.push(new FlipCard(group, instant), new FlipCard(group, instant));
      clockEl.appendChild(group);
    }
    cards.forEach(c => c.setInstant('0'));
  }

  const pad = n => String(n).padStart(2, '0');

  function clockDigits() {
    const d = new Date(Date.now() + state.clockOffsetMs);
    let h = d.getHours();
    if (state.fmt === 12) { h = h % 12; if (h === 0) h = 12; }
    return pad(h) + pad(d.getMinutes()) + pad(d.getSeconds());
  }
  function stopwatchDigits() {
    let ms = state.sw.elapsed;
    if (state.sw.running) ms += Date.now() - state.sw.start;
    const cs  = Math.floor(ms / 10) % 100;
    const sec = Math.floor(ms / 1000) % 60;
    const min = Math.floor(ms / 60000) % 100;
    return pad(min) + pad(sec) + pad(cs);
  }
  function alarmDigits() {
    let h = state.alarm.h;
    if (state.fmt === 12) { h = h % 12; if (h === 0) h = 12; }
    return pad(h) + pad(state.alarm.m) + pad(state.alarm.s);
  }

  function tick() {
    const str =
      state.mode === 'clock'     ? clockDigits()     :
      state.mode === 'stopwatch' ? stopwatchDigits() :
                                   alarmDigits();
    for (let i = 0; i < cards.length && i < str.length; i++) cards[i].flipTo(str[i]);
    const blink = state.mode === 'stopwatch' && !state.sw.running &&
                  state.sw.elapsed > 0 && Math.floor(Date.now() / 500) % 2 === 0;
    colons.forEach(c => c.classList.toggle('blink', blink));
  }
  function loop() { tick(); requestAnimationFrame(loop); }

  function setMode(m) {
    if (state.mode === m) return;
    state.mode = m;
    build();
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.mode === m));
    updateStatus(); tick();
  }

  function updateStatus() {
    if (state.ringing) return;
    if (state.mode === 'clock') {
      const mins = Math.round(state.clockOffsetMs / 60000);
      statusEl.textContent = mins === 0 ? 'Clock' : `Clock ${mins > 0 ? '+' : ''}${mins} min`;
    } else if (state.mode === 'stopwatch') {
      statusEl.textContent = state.sw.running ? 'Stopwatch · running' :
        (state.sw.elapsed > 0 ? 'Stopwatch · paused' : 'Stopwatch · click clock to start');
    } else {
      statusEl.textContent = state.alarm.on
        ? 'Alarm ON · click clock to disarm' : 'Alarm off · click clock to arm';
    }
  }

  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => setMode(t.dataset.mode)));

  /* ---------- Panel ---------- */
  panelEl.addEventListener('click', () => {
    sounds.ensure();
    if (state.ringing) { stopRinging(); return; }
    sounds.click();

    if (state.mode === 'stopwatch') {
      if (state.sw.running) { state.sw.elapsed += Date.now() - state.sw.start; state.sw.running = false; }
      else { state.sw.start = Date.now(); state.sw.running = true; }
      updateStatus();
    } else if (state.mode === 'alarm') {
      state.alarm.on = !state.alarm.on;
      updateStatus();
    }
  });

  panelEl.addEventListener('contextmenu', e => {
    if (state.mode === 'stopwatch') {
      e.preventDefault();
      state.sw.elapsed = 0; state.sw.running = false; updateStatus();
    }
  });

  /* ---------- Knob ---------- */
  let drag = null;
  const CLICK_RAD = Math.PI / 12;

  knobEl.addEventListener('mousedown', e => {
    e.preventDefault(); e.stopPropagation();
    sounds.ensure();
    const r = knobEl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    drag = { cx, cy, lastAngle: Math.atan2(e.clientY - cy, e.clientX - cx), accumulated: 0, clickAccum: 0 };
    document.body.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', e => {
    if (!drag) return;
    const angle = Math.atan2(e.clientY - drag.cy, e.clientX - drag.cx);
    let delta = angle - drag.lastAngle;
    if (delta >  Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;
    drag.lastAngle = angle;
    drag.accumulated += delta;

    state.knobOffset += delta * 45;
    knobEl.style.setProperty('--ridge', state.knobOffset + 'px');

    drag.clickAccum += delta;
    while (Math.abs(drag.clickAccum) >= CLICK_RAD) {
      sounds.click();
      drag.clickAccum -= Math.sign(drag.clickAccum) * CLICK_RAD;
    }
    applyKnob((delta / (Math.PI * 2)) * 60);
  });

  document.addEventListener('mouseup', () => {
    if (!drag) return;
    const wasStopwatch = state.mode === 'stopwatch';
    const spunFar = Math.abs(drag.accumulated) > Math.PI * 1.5;
    drag = null;
    document.body.style.cursor = '';
    if (wasStopwatch && spunFar) { state.sw.elapsed = 0; state.sw.running = false; updateStatus(); }
    if (state.mode === 'clock') snapClockOffset();
  });

  function applyKnob(units) {
    if (state.mode === 'clock') {
      state.clockOffsetMs += units * 60000;
      const H12 = 12 * 3600 * 1000;
      if (state.clockOffsetMs >  H12) state.clockOffsetMs =  H12;
      if (state.clockOffsetMs < -H12) state.clockOffsetMs = -H12;
      tick(); updateStatus();
    } else if (state.mode === 'alarm') {
      let total = state.alarm.h * 60 + state.alarm.m;
      total = ((Math.round(total + units) % 1440) + 1440) % 1440;
      state.alarm.h = Math.floor(total / 60);
      state.alarm.m = total % 60;
      state.alarm.s = 0;
      tick(); updateStatus();
    }
  }

  let snapTimer = null;
  function snapClockOffset() {
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      state.clockOffsetMs = Math.round(state.clockOffsetMs / 60000) * 60000;
      tick(); updateStatus();
    }, 250);
  }

  /* ---------- Alarm ---------- */
  let audioCtx = null;
  let beepTimer = null;

  function checkAlarm() {
    if (!state.alarm.on || state.ringing) return;
    const d = new Date();
    if (d.getHours()   === state.alarm.h &&
        d.getMinutes() === state.alarm.m &&
        d.getSeconds() === state.alarm.s) {
      startRinging();
    }
  }
  setInterval(checkAlarm, 200);

  function startRinging() {
    state.ringing = true;
    statusEl.textContent = 'ALARM — click to stop';
    statusEl.classList.add('ringing');

    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const beep = () => {
        if (!state.ringing) return;
        const t = audioCtx.currentTime;
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(880, t);
        o.frequency.setValueAtTime(1180, t + 0.12);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.30, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.30);
        o.connect(g).connect(audioCtx.destination);
        o.start(t);
        o.stop(t + 0.32);
        beepTimer = setTimeout(beep, 480);
      };
      beep();
    } catch (err) {}
  }

  function stopRinging() {
    state.ringing = false;
    state.alarm.on = false;
    clearTimeout(beepTimer);
    if (audioCtx) { try { audioCtx.close(); } catch (e) {} audioCtx = null; }
    statusEl.classList.remove('ringing');
    updateStatus();
    tick();
  }

  /* ---------- Palette ---------- */
  function applyPalette(name) {
    const p = PALETTES[name];
    if (!p) return;
    const r = document.documentElement.style;
    r.setProperty('--digit-color', p.digit);
    r.setProperty('--card-bg', p.cardBg);
    r.setProperty('--glow-rgb', p.glow);
    p.panel.forEach((c, i) => r.setProperty('--panel-' + (i+1), c));
    p.knob.forEach((c, i) => r.setProperty('--knob-' + 'abcd'[i], c));
    state.color = name;
    document.querySelectorAll('.swatch').forEach(s => s.classList.toggle('active', s.dataset.color === name));
  }

  function setMinimal(on) { state.minimal = on; document.body.classList.toggle('minimal', on); }

  function setFmt(f) {
    state.fmt = f;
    document.querySelectorAll('.seg button').forEach(b => b.classList.toggle('active', +b.dataset.fmt === f));
    tick(); updateStatus();
  }

  /* ---------- Background system ---------- */
  const VIGNETTE = 'radial-gradient(ellipse at 50% 45%, transparent 25%, rgba(0,0,0,.55) 100%)';

  function applyBackground() {
    const b = document.body.style;

    if (state.bgType === 'none') {
      document.body.classList.remove('has-bg');
      b.backgroundImage = 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(60,100,70,.22), transparent 70%)';
      b.backgroundSize = 'cover';
      b.backgroundPosition = 'center';
      b.backgroundRepeat = 'no-repeat';
    } else if (state.bgType === 'preset') {
      document.body.classList.remove('has-bg');
      b.backgroundImage = state.bgValue;
      b.backgroundSize = 'cover';
      b.backgroundPosition = 'center';
      b.backgroundRepeat = 'no-repeat';
    } else if (state.bgType === 'image') {
      document.body.classList.add('has-bg');
      b.backgroundImage = VIGNETTE + ', url("' + state.bgValue + '")';
      b.backgroundSize = 'cover, cover';
      b.backgroundPosition = 'center, center';
      b.backgroundRepeat = 'no-repeat, no-repeat';
    }

    document.querySelectorAll('.tile').forEach(t => {
      t.classList.toggle('active',
        (t.dataset.type === state.bgType && t.dataset.id === (state.presetId || state.gifId)));
    });
  }

  function choosePreset(idx) {
    const p = BG_PRESETS[idx];
    if (!p) return;
    state.bgType = 'preset';
    state.bgValue = p.css;
    state.presetId = String(idx);
    state.gifId = null;
    applyBackground();
  }

  function chooseGif(idx) {
    const g = GIF_PRESETS[idx];
    if (!g) return;
    state.bgType = 'image';
    state.bgValue = g.url;
    state.gifId = String(idx);
    state.presetId = null;
    applyBackground();
  }

  function clearBackground() {
    state.bgType = 'none';
    state.bgValue = null;
    state.presetId = null;
    state.gifId = null;
    document.getElementById('bgUpload').value = '';
    applyBackground();
  }

  function uploadImage(dataUrl) {
    state.bgType = 'image';
    state.bgValue = dataUrl;
    state.presetId = null;
    state.gifId = null;
    applyBackground();
  }

  /* ---------- Preset tiles ---------- */
  const presetGrid = document.getElementById('presetGrid');
  BG_PRESETS.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.className = 'tile';
    btn.dataset.type = 'preset';
    btn.dataset.id = String(i);
    btn.style.backgroundImage = p.css;
    btn.title = p.name;
    btn.addEventListener('click', () => choosePreset(i));
    presetGrid.appendChild(btn);
  });

  /* ---------- GIF tiles ---------- */
  const gifGrid = document.getElementById('gifGrid');
  function renderGifGrid() {
    gifGrid.innerHTML = '';
    if (GIF_PRESETS.length === 0) {
      const hint = document.createElement('div');
      hint.className = 'tile-empty';
      hint.style.gridColumn = 'span 4';
      hint.innerHTML = '🎬 Empty<br><span style="color:rgba(255,180,80,.5)">Add GIF URLs in the code</span>';
      gifGrid.appendChild(hint);
      return;
    }
    GIF_PRESETS.forEach((g, i) => {
      const btn = document.createElement('button');
      btn.className = 'tile';
      btn.dataset.type = 'image';
      btn.dataset.id = String(i);
      btn.style.backgroundImage = 'url("' + g.url + '")';
      btn.title = g.name || ('GIF ' + (i+1));
      btn.addEventListener('click', () => chooseGif(i));
      gifGrid.appendChild(btn);
    });
  }
  renderGifGrid();

  /* ---------- Swatches ---------- */
  const swatchWrap = document.getElementById('swatches');
  Object.entries(PALETTES).forEach(([key, p]) => {
    const b = document.createElement('button');
    b.className = 'swatch';
    b.dataset.color = key;
    b.style.background = p.digit;
    b.title = p.label;
    b.addEventListener('click', () => applyPalette(key));
    swatchWrap.appendChild(b);
  });

  /* ---------- Toggles ---------- */
  document.getElementById('flatToggle').addEventListener('change', e => setMinimal(!e.target.checked));
  document.getElementById('soundToggle').addEventListener('change', e => {
    sounds.enabled = e.target.checked;
    if (sounds.enabled) { sounds.ensure(); setTimeout(() => sounds.click(), 30); }
  });

  document.getElementById('presetClear').addEventListener('click', clearBackground);
  document.getElementById('bgClear').addEventListener('click', clearBackground);

  document.getElementById('bgUpload').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => uploadImage(ev.target.result);
    reader.readAsDataURL(f);
  });

  document.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => setFmt(+b.dataset.fmt)));

  /* ---------- Music ---------- */
  const musicAudio = new Audio();
  musicAudio.loop = true;
  musicAudio.volume = 0.5;
  const musicUpload = document.getElementById('musicUpload');
  const musicPlayBtn = document.getElementById('musicPlay');
  const musicClearBtn = document.getElementById('musicClear');
  const musicVolEl = document.getElementById('musicVol');
  const musicNameEl = document.getElementById('musicName');

  function updateMusicUI() {
    const has = !!musicAudio.src;
    musicPlayBtn.disabled = !has;
    musicClearBtn.disabled = !has;
    if (!has) { musicPlayBtn.textContent = 'Play'; musicNameEl.textContent = 'No track loaded'; return; }
    musicPlayBtn.textContent = musicAudio.paused ? 'Play' : 'Pause';
  }
  musicUpload.addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    musicAudio.src = URL.createObjectURL(f);
    musicNameEl.textContent = f.name;
    musicAudio.play().then(updateMusicUI).catch(updateMusicUI);
    updateMusicUI();
  });
  musicPlayBtn.addEventListener('click', () => {
    if (!musicAudio.src) return;
    if (musicAudio.paused) musicAudio.play().catch(() => {});
    else musicAudio.pause();
    updateMusicUI();
  });
  musicClearBtn.addEventListener('click', () => {
    musicAudio.pause();
    musicAudio.removeAttribute('src');
    musicAudio.load();
    musicUpload.value = '';
    updateMusicUI();
  });
  musicVolEl.addEventListener('input', e => { musicAudio.volume = +e.target.value; });
  musicAudio.addEventListener('play', updateMusicUI);
  musicAudio.addEventListener('pause', updateMusicUI);

  /* ---------- Menu ---------- */
  menuBtn.addEventListener('click', e => {
    e.stopPropagation();
    menuEl.classList.toggle('open');
    menuBtn.classList.toggle('open');
    sounds.ensure(); sounds.click();
  });
  document.addEventListener('click', e => {
    if (menuEl.classList.contains('open') && !menuEl.contains(e.target) && e.target !== menuBtn) {
      menuEl.classList.remove('open');
      menuBtn.classList.remove('open');
    }
  });
  menuEl.addEventListener('click', e => e.stopPropagation());

  /* ---------- Keyboard ---------- */
  document.addEventListener('keydown', e => {
    if (e.key === '1') setMode('alarm');
    if (e.key === '2') setMode('clock');
    if (e.key === '3') setMode('stopwatch');
    if (e.key === ' ') { e.preventDefault(); panelEl.click(); }
    if (e.key === 'Escape') { menuEl.classList.remove('open'); menuBtn.classList.remove('open'); }
  });

  /* ---------- Init ---------- */
  applyPalette('green');
  setFmt(12);
  setMinimal(false);
  applyBackground();
  build();
  tick();
  updateStatus();
  requestAnimationFrame(loop);
})();