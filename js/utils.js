// ===== Multilingual text + shared destruction timing =====
const MAX_GRAPHEMES = 10000
let cachedGraphemeSegmenter = null
const SIMPLE_GRAPHEME_RE = /^[\u0000-\u02ff\u0400-\u052f\u3041-\u3096\u30a0-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7a3\uf900-\ufaff\uff00-\uffef]*$/

function getGraphemeSegmenter() {
  if (typeof Intl === 'undefined' || !Intl.Segmenter) return null
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler
  if (!cachedGraphemeSegmenter) {
    cachedGraphemeSegmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  }
  return cachedGraphemeSegmenter
}

function hasOnlySimpleGraphemes(value) {
  // Fast path for ordinary CJK, kana, Hangul syllables, Latin, Cyrillic, punctuation, and numbers.
  // Complex clusters such as Emoji ZWJ sequences, variation selectors, surrogate pairs, and combining marks
  // fall through to Intl.Segmenter so the 10,000 limit remains correct for every language.
  return SIMPLE_GRAPHEME_RE.test(value)
  // author-link: https://github.com/YU123-ZZZ
}

function splitGraphemes(text) {
  const value = String(text || '')
  if (!value) return []
  if (hasOnlySimpleGraphemes(value)) return value.split('')
  const segmenter = getGraphemeSegmenter()
  if (segmenter) {
    return Array.from(segmenter.segment(value), part => part.segment)
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  }
  return Array.from(value)
}

function countGraphemes(text) {
  const value = String(text || '')
  if (!value) return 0
  if (hasOnlySimpleGraphemes(value)) return value.length
  return splitGraphemes(value).length
}

function limitGraphemes(text, max = MAX_GRAPHEMES) {
  const value = String(text || '')
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
  if (!value) return ''
  if (hasOnlySimpleGraphemes(value)) {
    return value.length <= max ? value : value.slice(0, max)
  }
  const parts = splitGraphemes(value)
  return parts.length <= max ? value : parts.slice(0, max).join('')
}

function normalizeGraphemeText(text, max = MAX_GRAPHEMES) {
// version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  const value = String(text || '')
  if (!value) return { text: '', count: 0, truncated: false }
  if (hasOnlySimpleGraphemes(value)) {
    const count = value.length
    return {
      text: count <= max ? value : value.slice(0, max),
      count: Math.min(count, max),
      truncated: count > max,
    }
  }
  const parts = splitGraphemes(value)
  const count = parts.length
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler
  return {
    text: count <= max ? value : parts.slice(0, max).join(''),
    count: Math.min(count, max),
    truncated: count > max,
  }
}

function sampleGraphemes(text, max = 700) {
  if (!Array.isArray(text)) {
    const value = String(text || '')
    // author-link: https://github.com/YU123-ZZZ
    if (!value) return []
    if (hasOnlySimpleGraphemes(value)) {
      if (value.length <= max) return value.split('')
      const sampleSize = Math.max(1, max - 1)
      const sampled = []
      for (let i = 0; i < sampleSize; i++) {
        const index = Math.min(value.length - 1, Math.floor(i * value.length / sampleSize))
        // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
        sampled.push(value.charAt(index))
      }
      sampled.push('…')
      return sampled
    }
  }
  const parts = Array.isArray(text) ? text : splitGraphemes(text)
  if (parts.length <= max) return parts.slice()
  const sampleSize = Math.max(1, max - 1)
  const sampled = []
  for (let i = 0; i < sampleSize; i++) {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    const index = Math.min(parts.length - 1, Math.floor(i * parts.length / sampleSize))
    sampled.push(parts[index])
  }
  sampled.push('…')
  return sampled
}

// ===== Lightweight destruction geometry =====
function createShredLayout(width, height) {
// version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  const dw = Math.max(280, Number(width) || 280)
  const dh = Math.max(360, Number(height) || 360)
  const machineWidth = Math.min(270, dw * 0.68)
  const binHeight = Math.min(132, dh * 0.22)
  const binWidth = machineWidth * 0.96
  const slotOffset = 40
  const bladeOffset = 68
  const binOffset = 112
  const groupHeight = binOffset + binHeight
  const machineTop = Math.max(24, Math.round((dh - groupHeight) / 2))
  const maxPaperHeight = Math.max(110, Math.min(230, machineTop - 24))

  return {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    machineWidth,
    machineTop,
    slotY: machineTop + slotOffset,
    bladeY: machineTop + bladeOffset,
    binTop: machineTop + binOffset,
    binWidth,
    binHeight,
    binBottom: machineTop + binOffset + binHeight,
    // author-link: https://github.com/YU123-ZZZ
    maxPaperHeight,
  }
}

function createShredSlices(paperWidth, paperHeight, viewportWidth, reducedMotion) {
  const columns = reducedMotion ? 8 : viewportWidth < 520 ? 10 : 14
  const rows = reducedMotion ? 4 : viewportWidth < 520 ? 5 : 6
  const pieceWidth = paperWidth / columns
  const pieceHeight = paperHeight / rows
  const pieces = []

  for (let row = 0; row < rows; row++) {
  // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    for (let column = 0; column < columns; column++) {
      pieces.push({
        row,
        column,
        sourceX: column * pieceWidth,
        sourceY: row * pieceHeight,
        sourceW: column === columns - 1 ? paperWidth - column * pieceWidth : pieceWidth,
        sourceH: row === rows - 1 ? paperHeight - row * pieceHeight : pieceHeight,
        delay: (row * columns + column) / (rows * columns),
        spawned: false,
        // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
        settled: false,
      })
    }
  }

  return pieces
}
// version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304

function createTopDownBurnFrame(paperTop, paperHeight, progress) {
  const p = Math.max(0, Math.min(1, Number(progress) || 0))
  const destroyedHeight = paperHeight * p
  const burnY = paperTop + destroyedHeight

  return {
    burnY,
    destroyedHeight,
    remainingY: burnY,
    remainingHeight: Math.max(0, paperHeight - destroyedHeight),
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    sourceYOffset: destroyedHeight,
  }
}

function createSequentialPhases(totalMs, fixedPhases, weightedPhases) {
  const phases = {}
  let cursor = 0

  for (const phase of fixedPhases) {
  // author-link: https://github.com/YU123-ZZZ
    const duration = Math.max(1, Math.round(phase.durationMs))
    phases[phase.name] = { startMs: cursor, endMs: cursor + duration }
    cursor += duration
  }

  const remaining = Math.max(weightedPhases.length, totalMs - cursor)
  const totalWeight = weightedPhases.reduce((sum, phase) => sum + phase.weight, 0) || 1
  weightedPhases.forEach((phase, index) => {
    const isLast = index === weightedPhases.length - 1
    const endMs = isLast
      ? totalMs
      : cursor + Math.max(1, Math.round(remaining * phase.weight / totalWeight))
    phases[phase.name] = { startMs: cursor, endMs }
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    cursor = endMs
  })

  return phases
}

function buildModeTimeline(mode, totalMs, previewMs) {
  let phases
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
  if (mode === 'burn') {
    phases = createSequentialPhases(totalMs, [
      { name: 'preview', durationMs: previewMs },
    ], [
      { name: 'ignite', weight: 0.10 },
      { name: 'burn', weight: 0.75 },
      { name: 'embers', weight: 0.15 },
    ])
  } else if (mode === 'flush') {
    phases = createSequentialPhases(totalMs, [
      { name: 'preview', durationMs: previewMs },
    ], [
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      { name: 'crumple', weight: 0.24 },
      { name: 'drop', weight: 0.10 },
      { name: 'flush', weight: 0.34 },
      { name: 'drain', weight: 0.20 },
      { name: 'settle', weight: 0.12 },
    ])
  } else if (mode === 'drift') {
    const enterMs = Math.min(1000, Math.round(totalMs * 0.12))
    phases = createSequentialPhases(totalMs, [
      { name: 'paperEnter', durationMs: enterMs },
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler
      { name: 'preview', durationMs: previewMs },
    ], [
      { name: 'roll', weight: 0.20 },
      { name: 'bottle', weight: 0.18 },
      { name: 'cork', weight: 0.10 },
      { name: 'throw', weight: 0.30 },
      { name: 'finish', weight: 0.22 },
      // author-link: https://github.com/YU123-ZZZ
    ])
  } else {
    phases = createSequentialPhases(totalMs, [
      { name: 'preview', durationMs: previewMs },
    ], [
      { name: 'feed', weight: 0.32 },
      { name: 'shred', weight: 0.48 },
      { name: 'settle', weight: 0.20 },
    ])
  }

  return { mode, totalMs, audioEndMs: totalMs, previewMs, phases }
  // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
}

function createDestructionTimeline(mode, graphemeCount) {
  const count = Math.max(1, Math.min(MAX_GRAPHEMES, Number(graphemeCount) || 1))
  const factor = Math.sqrt(count / MAX_GRAPHEMES)
  const ranges = {
    shred: [5500, 11000],
    burn: [5200, 8500],
    flush: [7000, 13000],
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    drift: [8000, 13000],
  }
  const range = ranges[mode] || ranges.shred
  const totalMs = Math.round(range[0] + (range[1] - range[0]) * factor)
  const previewMs = Math.round(1200 + 800 * factor)
  const timeline = buildModeTimeline(mode, totalMs, previewMs)
  timeline.graphemeCount = count
  return timeline
}

function createSoundSchedule(mode, timeline) {
  const p = timeline.phases
  const stage = (name, atMs, endMs) => ({
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    stage: name,
    atMs: Math.max(0, Math.round(atMs)),
    endMs: Math.min(timeline.totalMs, Math.max(Math.round(atMs) + 1, Math.round(endMs))),
  })

  if (mode === 'burn') {
    return [
      stage('ignite', p.ignite.startMs, p.ignite.endMs),
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler
      stage('fireBed', p.ignite.startMs, p.embers.startMs),
      stage('crackle', p.burn.startMs, p.embers.startMs),
      stage('embers', p.embers.startMs, timeline.audioEndMs),
    ]
  }
  if (mode === 'flush') {
    return [
      stage('crumple', p.crumple.startMs, p.crumple.endMs),
      stage('handle', p.flush.startMs - 180, p.flush.startMs + 180),
      stage('waterRush', p.flush.startMs, p.flush.endMs),
      stage('swirl', p.flush.startMs + (p.flush.endMs - p.flush.startMs) * 0.22, p.drain.startMs),
      stage('gurgle', p.drain.startMs, p.settle.startMs),
      // author-link: https://github.com/YU123-ZZZ
      stage('refill', p.settle.startMs, timeline.audioEndMs),
    ]
  }
  if (mode === 'drift') {
    return [
      stage('paperRoll', p.roll.startMs, p.roll.endMs),
      stage('glass', p.bottle.startMs, p.bottle.endMs),
      stage('cork', p.cork.startMs, p.cork.endMs),
      stage('throwWhoosh', p.throw.startMs, p.throw.endMs),
      stage('splash', p.throw.endMs - Math.min(500, (p.throw.endMs - p.throw.startMs) * 0.25), p.finish.startMs + 250),
      // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      stage('wave', p.finish.startMs, timeline.audioEndMs),
    ]
  }
  return [
    stage('motorStart', p.feed.startMs, p.feed.startMs + Math.min(700, p.feed.endMs - p.feed.startMs)),
    stage('paperFeed', p.feed.startMs + 160, p.shred.startMs),
    stage('tear', p.shred.startMs, p.settle.startMs),
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    stage('motorStop', p.settle.startMs, timeline.audioEndMs),
  ]
}

// ===== SoundManager =====
class SoundManager {
  constructor() {
    this.audioContext = null
    this.activeSources = new Set()
    this.pendingTimers = new Set()
    this.noiseBuffers = new Map()
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    this.lastSchedule = []
  }

  getContext() {
    if (!this.audioContext) {
      try {
        const AudioContextClass = (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) ||
          (typeof AudioContext !== 'undefined' ? AudioContext : null)
        if (!AudioContextClass) throw new Error('AudioContext not supported')
        // version-link: https://github.com/YU123-ZZZ/emotion-recycler
        this.audioContext = new AudioContextClass()
      } catch {
        throw new Error('AudioContext not supported')
      }
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    return this.audioContext
  }

  createNoise(duration, type = 'white') {
    const ctx = this.getContext()
    // author-link: https://github.com/YU123-ZZZ
    const sampleRate = ctx.sampleRate
    const length = sampleRate * duration
    const buffer = ctx.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    if (type === 'white') {
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1
        // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      }
    } else if (type === 'brown') {
      let lastOut = 0
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1
        data[i] = (lastOut + 0.02 * white) / 1.02
        lastOut = data[i]
        data[i] *= 3.5
      }
    } else {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
      for (let i = 0; i < length; i++) {
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
        const white = Math.random() * 2 - 1
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        b3 = 0.86650 * b3 + white * 0.3104856
        b4 = 0.55000 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.0168980
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
        data[i] *= 0.11
        b6 = white * 0.115926
        // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      }
    }

    return buffer
  }

  playBuffer(buffer, volume = 0.3, detune = 0) {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    const ctx = this.getContext()
    const source = ctx.createBufferSource()
    const gainNode = ctx.createGain()

    source.buffer = buffer
    source.detune.value = detune
    gainNode.gain.value = volume

    source.connect(gainNode)
    gainNode.connect(ctx.destination)
    source.start()
    // author-link: https://github.com/YU123-ZZZ

    this.activeSources.add(source)
    source.onended = () => this.activeSources.delete(source)
  }

  addDelayedSound(delay, factory) {
    const timerId = setTimeout(() => {
      this.pendingTimers.delete(timerId)
      factory()
      // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    }, delay)
    this.pendingTimers.add(timerId)
  }

  getCachedNoise(type = 'white') {
    const ctx = this.getContext()
    const key = type + ':' + ctx.sampleRate
    if (this.noiseBuffers.has(key)) return this.noiseBuffers.get(key)
    const length = ctx.sampleRate
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    let pinkA = 0
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1
      if (type === 'brown') {
        last = (last + 0.025 * white) / 1.025
        data[i] = last * 3.2
      } else if (type === 'pink') {
        pinkA = pinkA * 0.985 + white * 0.15
        data[i] = pinkA * 0.75 + white * 0.25
        // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      } else {
        data[i] = white
      }
    }
    this.noiseBuffers.set(key, buffer)
    return buffer
  }

  trackSource(source) {
    this.activeSources.add(source)
    source.onended = () => this.activeSources.delete(source)
    return source
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
  }

  playNoiseLayer(type, durationMs, options = {}) {
    let ctx
    try { ctx = this.getContext() } catch { return }
    const duration = Math.max(0.05, durationMs / 1000)
    const now = ctx.currentTime
    const source = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()
    // author-link: https://github.com/YU123-ZZZ
    source.buffer = this.getCachedNoise(type)
    source.loop = true
    filter.type = options.filterType || 'lowpass'
    filter.frequency.setValueAtTime(options.frequency || 1200, now)
    filter.Q.setValueAtTime(options.q || 0.7, now)
    const volume = options.volume == null ? 0.16 : options.volume
    const attack = Math.min(duration * 0.28, (options.attackMs || 80) / 1000)
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    const release = Math.min(duration * 0.4, (options.releaseMs || 180) / 1000)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), now + Math.max(0.01, attack))
    gain.gain.setValueAtTime(Math.max(0.0002, volume), Math.max(now + attack, now + duration - release))
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    this.trackSource(source)
    source.start(now)
    source.stop(now + duration + 0.03)
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
  }

  playToneLayer(durationMs, options = {}) {
    let ctx
    try { ctx = this.getContext() } catch { return }
    const duration = Math.max(0.04, durationMs / 1000)
    const now = ctx.currentTime
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    oscillator.type = options.type || 'sine'
    oscillator.frequency.setValueAtTime(options.fromHz || 120, now)
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, options.toHz || options.fromHz || 80), now + duration)
    const volume = options.volume == null ? 0.08 : options.volume
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), now + Math.min(0.06, duration * 0.25))
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    this.trackSource(oscillator)
    oscillator.start(now)
    oscillator.stop(now + duration + 0.02)
  }
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler

  playRhythmicBursts(durationMs, options = {}) {
    const interval = options.intervalMs || 260
    const count = Math.min(options.maxBursts || 18, Math.floor(durationMs / interval))
    for (let i = 0; i < count; i++) {
      this.addDelayedSound(i * interval + Math.random() * Math.min(90, interval * 0.3), () => {
        this.playNoiseLayer(options.type || 'white', options.burstMs || 55, {
          volume: (options.volume || 0.06) * (0.75 + Math.random() * 0.5),
          // author-link: https://github.com/YU123-ZZZ
          filterType: options.filterType || 'bandpass',
          frequency: (options.frequency || 2400) * (0.8 + Math.random() * 0.4),
          q: options.q || 1.2,
          attackMs: 6,
          releaseMs: options.burstMs || 55,
        })
      })
    }
  }

  startSoundStage(stage, durationMs) {
    const duration = Math.max(80, durationMs)
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    switch (stage) {
      case 'motorStart':
        this.playToneLayer(duration, { type: 'sawtooth', fromHz: 46, toHz: 104, volume: 0.065 })
        this.playNoiseLayer('brown', duration, { volume: 0.1, frequency: 460, attackMs: 140 })
        this.playRhythmicBursts(duration, { type: 'brown', intervalMs: 92, burstMs: 26, volume: 0.035, frequency: 760, maxBursts: 8 })
        break
      case 'paperFeed':
        this.playNoiseLayer('pink', duration, { volume: 0.115, filterType: 'bandpass', frequency: 1650, q: 0.75 })
        this.playRhythmicBursts(duration, { intervalMs: 235, burstMs: 74, volume: 0.08, frequency: 2750 })
        break
      case 'tear':
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
        this.playNoiseLayer('white', duration, { volume: 0.15, filterType: 'bandpass', frequency: 2500, q: 0.7 })
        this.playToneLayer(duration, { type: 'sawtooth', fromHz: 120, toHz: 95, volume: 0.045 })
        this.playRhythmicBursts(duration, { intervalMs: 220, burstMs: 60, volume: 0.085, frequency: 3300, maxBursts: 20 })
        break
      case 'motorStop':
        this.playToneLayer(duration, { type: 'sawtooth', fromHz: 105, toHz: 35, volume: 0.06 })
        this.playNoiseLayer('brown', duration, { volume: 0.045, frequency: 380, releaseMs: duration * 0.75 })
        // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
        break
      case 'ignite':
        // Flint wheel scratches, metal click, then butane catches.
        for (let i = 0; i < 3; i++) {
          this.addDelayedSound(i * 58, () => {
            this.playNoiseLayer('white', 38, { volume: 0.105 - i * 0.012, filterType: 'bandpass', frequency: 4300 - i * 420, q: 1.8, attackMs: 3, releaseMs: 30 })
          })
        }
        this.addDelayedSound(145, () => {
          this.playToneLayer(85, { type: 'square', fromHz: 310, toHz: 95, volume: 0.042 })
          this.playNoiseLayer('white', Math.max(180, Math.min(duration - 145, 620)), { volume: 0.075, filterType: 'highpass', frequency: 3400, attackMs: 8, releaseMs: 180 })
        })
        break
      case 'fireBed':
        this.playNoiseLayer('brown', duration, { volume: 0.105, frequency: 720, attackMs: 180, releaseMs: 420 })
        this.playNoiseLayer('pink', duration, { volume: 0.07, filterType: 'bandpass', frequency: 2050, q: 0.62, attackMs: 120 })
        this.playNoiseLayer('white', duration, { volume: 0.028, filterType: 'highpass', frequency: 4600, attackMs: 220, releaseMs: 380 })
        break
      case 'crackle':
        this.playRhythmicBursts(duration, { intervalMs: 145, burstMs: 30, volume: 0.085, frequency: 3900, q: 1.6, maxBursts: 38 })
        this.playRhythmicBursts(duration, { type: 'brown', intervalMs: 410, burstMs: 72, volume: 0.045, frequency: 900, maxBursts: 14 })
        // version-link: https://github.com/YU123-ZZZ/emotion-recycler
        break
      case 'embers':
        this.playNoiseLayer('brown', duration, { volume: 0.04, frequency: 620, releaseMs: duration * 0.85 })
        this.playRhythmicBursts(duration, { intervalMs: 520, burstMs: 35, volume: 0.04, frequency: 2800, maxBursts: 6 })
        break
      case 'crumple':
        this.playNoiseLayer('pink', duration, { volume: 0.11, filterType: 'bandpass', frequency: 2300, q: 0.9 })
        this.playRhythmicBursts(duration, { intervalMs: 250, burstMs: 72, volume: 0.065, frequency: 3100, maxBursts: 14 })
        // author-link: https://github.com/YU123-ZZZ
        break
      case 'paperRoll':
        // Dry paper sliding over itself with tighter creases near the end.
        this.playNoiseLayer('pink', duration, { volume: 0.09, filterType: 'bandpass', frequency: 1850, q: 0.72, attackMs: 35, releaseMs: 120 })
        this.playNoiseLayer('brown', duration, { volume: 0.035, filterType: 'bandpass', frequency: 620, q: 0.9, attackMs: 120 })
        this.playRhythmicBursts(duration, { intervalMs: 135, burstMs: 48, volume: 0.062, frequency: 3300, q: 1.3, maxBursts: 20 })
        break
      case 'handle':
        this.playToneLayer(Math.min(duration, 180), { type: 'square', fromHz: 190, toHz: 85, volume: 0.055 })
        this.playNoiseLayer('white', Math.min(duration, 110), { volume: 0.06, filterType: 'bandpass', frequency: 1800, attackMs: 5 })
        break
      case 'waterRush':
        this.playNoiseLayer('white', duration, { volume: 0.17, frequency: 2300, attackMs: 120, releaseMs: 360 })
        this.playNoiseLayer('brown', duration, { volume: 0.09, frequency: 420 })
        break
      case 'swirl':
        this.playNoiseLayer('pink', duration, { volume: 0.12, filterType: 'bandpass', frequency: 1150, q: 0.65 })
        this.playToneLayer(duration, { type: 'sine', fromHz: 92, toHz: 64, volume: 0.035 })
        break
        // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      case 'gurgle':
        this.playNoiseLayer('brown', duration, { volume: 0.1, filterType: 'bandpass', frequency: 520, q: 1.1 })
        this.playRhythmicBursts(duration, { type: 'brown', intervalMs: 240, burstMs: 130, volume: 0.075, frequency: 390, maxBursts: 10 })
        break
      case 'refill':
        this.playNoiseLayer('white', duration, { volume: 0.045, filterType: 'bandpass', frequency: 1700, q: 0.8, releaseMs: duration * 0.75 })
        break
      case 'glass':
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
        this.playToneLayer(150, { type: 'sine', fromHz: 1280, toHz: 1040, volume: 0.048 })
        this.playToneLayer(105, { type: 'triangle', fromHz: 2460, toHz: 1820, volume: 0.018 })
        this.addDelayedSound(Math.min(210, duration * 0.3), () => {
          this.playToneLayer(120, { type: 'sine', fromHz: 920, toHz: 760, volume: 0.026 })
        })
        break
      case 'cork':
        this.playNoiseLayer('brown', Math.min(duration, 115), { volume: 0.115, filterType: 'bandpass', frequency: 470, q: 1.1, attackMs: 3, releaseMs: 90 })
        this.playToneLayer(Math.min(duration, 150), { type: 'triangle', fromHz: 210, toHz: 58, volume: 0.065 })
        this.addDelayedSound(78, () => this.playNoiseLayer('white', 42, { volume: 0.048, filterType: 'bandpass', frequency: 1900, q: 1.2, attackMs: 3 }))
        break
      case 'throwWhoosh':
        this.playNoiseLayer('pink', duration, { volume: 0.105, filterType: 'bandpass', frequency: 1250, q: 0.45, attackMs: duration * 0.42, releaseMs: 160 })
        this.playToneLayer(duration, { type: 'sine', fromHz: 185, toHz: 72, volume: 0.018 })
        break
      case 'splash':
        this.playNoiseLayer('white', Math.min(duration, 620), { volume: 0.18, filterType: 'lowpass', frequency: 2100, attackMs: 8, releaseMs: 500 })
        this.playNoiseLayer('brown', Math.min(duration, 480), { volume: 0.075, filterType: 'bandpass', frequency: 330, q: 0.9, attackMs: 6, releaseMs: 420 })
        // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
        this.playToneLayer(Math.min(duration, 500), { type: 'sine', fromHz: 125, toHz: 60, volume: 0.05 })
        break
      case 'wave':
        this.playNoiseLayer('pink', duration, { volume: 0.065, frequency: 900, attackMs: 220, releaseMs: duration * 0.8 })
        break
    }
  }

  playForMode(mode, timeline) {
    this.stopAll()
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    const schedule = createSoundSchedule(mode, timeline)
    this.lastSchedule = schedule
    schedule.forEach(item => {
      this.addDelayedSound(item.atMs, () => {
        this.startSoundStage(item.stage, item.endMs - item.atMs)
      })
    })
    // author-link: https://github.com/YU123-ZZZ
    this.addDelayedSound(timeline.audioEndMs, () => this.stopAll())
    return schedule
  }

  playShred() {
    let ctx
    try { ctx = this.getContext() } catch { return }
    const duration = 3
    const sampleRate = ctx.sampleRate
    const length = sampleRate * duration
    const buffer = ctx.createBuffer(1, length, sampleRate)
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    const data = buffer.getChannelData(0)

    // Realistic shredder: motor hum + paper tearing + gear clicks
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      // Low motor hum
      let sample = Math.sin(2 * Math.PI * 120 * t) * 0.15
      // Second harmonic
      sample += Math.sin(2 * Math.PI * 240 * t) * 0.08
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
      // Paper tearing noise (filtered)
      const white = Math.random() * 2 - 1
      sample += white * 0.12
      // Gear click pattern
      if (Math.random() < 0.003) sample += (Math.random() - 0.5) * 0.4
      // Amplitude envelope: ramp up, sustain, fade out
      let env = 1
      if (t < 0.15) env = t / 0.15
      else if (t > duration - 0.3) env = (duration - t) / 0.3
      data[i] = sample * env
    }

    const source = ctx.createBufferSource()
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    source.buffer = buffer
    filter.type = 'bandpass'
    filter.frequency.value = 2000
    filter.Q.value = 0.8

    gainNode.gain.value = 0.5
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler

    source.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)
    source.start()

    this.activeSources.add(source)
    source.onended = () => this.activeSources.delete(source)

    // Periodic paper crunch sounds
    for (let i = 0; i < 10; i++) {
      this.addDelayedSound(200 + i * 280 + Math.random() * 80, () => {
      // author-link: https://github.com/YU123-ZZZ
        const crunch = this.createNoise(0.06, 'white')
        this.playBuffer(crunch, 0.1 + Math.random() * 0.08, Math.random() * 300 - 150)
      })
    }
  }

  playBurn() {
    let ctx
    try { ctx = this.getContext() } catch { return }
    const duration = 3.5
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    const sampleRate = ctx.sampleRate
    const length = sampleRate * duration
    const buffer = ctx.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    // Fire: low roar + random crackling pops
    let lastOut = 0
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      // Brown noise base (fire rumble)
      const white = Math.random() * 2 - 1
      lastOut = (lastOut + 0.02 * white) / 1.02
      let sample = lastOut * 2.5
      // Random crackle pops (like wood snapping)
      if (Math.random() < 0.004) {
        sample += (Math.random() - 0.5) * 0.8
      }
      // Occasional high-frequency sizzle
      if (Math.random() < 0.01) {
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
        sample += (Math.random() - 0.5) * 0.3
      }
      // Amplitude envelope
      let env = 1
      if (t < 0.3) env = t / 0.3
      else if (t > duration - 0.5) env = (duration - t) / 0.5
      data[i] = sample * env * 0.6
    }

    const source = ctx.createBufferSource()
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    source.buffer = buffer
    filter.type = 'lowpass'
    filter.frequency.value = 1200
    filter.Q.value = 0.5

    gainNode.gain.value = 0.45

    source.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)
    // author-link: https://github.com/YU123-ZZZ
    source.start()

    this.activeSources.add(source)
    source.onended = () => this.activeSources.delete(source)

    // Random crackle bursts
    for (let i = 0; i < 15; i++) {
      this.addDelayedSound(150 + i * 200 + Math.random() * 120, () => {
      // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
        const crackle = this.createNoise(0.04, 'white')
        this.playBuffer(crackle, 0.06 + Math.random() * 0.08)
      })
    }
  }

  playFlush() {
    let ctx
    try { ctx = this.getContext() } catch { return }
    // Crumple sound: paper crunching
    const duration = 1.5
    const sampleRate = ctx.sampleRate
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    const length = sampleRate * duration
    const buffer = ctx.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      const white = Math.random() * 2 - 1
      // Crinkling paper sound
      let sample = white * 0.3
      // Add some crackle texture
      if (Math.random() < 0.02) sample += (Math.random() - 0.5) * 0.5
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      // Envelope: quick bursts
      let env = Math.exp(-t * 3) * (1 + 0.3 * Math.sin(t * 40))
      data[i] = sample * env
    }

    const source = ctx.createBufferSource()
    const gainNode = ctx.createGain()
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
    const filter = ctx.createBiquadFilter()

    source.buffer = buffer
    filter.type = 'bandpass'
    filter.frequency.value = 3000
    filter.Q.value = 1

    gainNode.gain.value = 0.25

    source.connect(filter)
    filter.connect(gainNode)
    // author-link: https://github.com/YU123-ZZZ
    gainNode.connect(ctx.destination)
    source.start()

    this.activeSources.add(source)
    source.onended = () => this.activeSources.delete(source)
  }

  playFlushWater() {
    let ctx
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    try { ctx = this.getContext() } catch { return }
    const duration = 3
    const sampleRate = ctx.sampleRate
    const length = sampleRate * duration
    const buffer = ctx.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    // Toilet flush: initial rush → swirl → final gulp
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      const white = Math.random() * 2 - 1
      let sample = 0

      if (t < 0.3) {
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
        // Initial burst: water release
        const env = t / 0.3
        sample = white * 0.5 * env
        // Low rumble
        sample += Math.sin(2 * Math.PI * 80 * t) * 0.2 * env
      } else if (t < 1.5) {
        // Swirling water
        const swirlT = (t - 0.3) / 1.2
        // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
        const swirlEnv = 1 - swirlT * 0.3
        sample = white * 0.35 * swirlEnv
        // Swirl modulation
        const swirlFreq = 3 + swirlT * 5
        sample += white * 0.15 * Math.sin(swirlT * swirlFreq * Math.PI * 2)
        // Low frequency rumble
        sample += Math.sin(2 * Math.PI * 60 * t) * 0.15 * swirlEnv
      } else if (t < 2.2) {
        // Gurgling / suction
        const gurgleT = (t - 1.5) / 0.7
        const gurgleEnv = 1 - gurgleT * 0.5
        sample = white * 0.25 * gurgleEnv
        // version-link: https://github.com/YU123-ZZZ/emotion-recycler
        // Gurgle bubbles
        const gurgleMod = Math.sin(gurgleT * 15 * Math.PI * 2) * 0.5 + 0.5
        sample += white * 0.2 * gurgleMod * gurgleEnv
        // Descending pitch
        const pitch = 200 - gurgleT * 150
        sample += Math.sin(2 * Math.PI * pitch * t) * 0.1 * gurgleEnv
      } else {
        // Final drain sound + fade out
        const drainT = (t - 2.2) / 0.8
        const drainEnv = Math.max(0, 1 - drainT)
        // author-link: https://github.com/YU123-ZZZ
        sample = white * 0.15 * drainEnv
        // Suction gulp
        if (drainT < 0.3) {
          sample += Math.sin(2 * Math.PI * (100 - drainT * 200) * t) * 0.15 * (1 - drainT / 0.3)
        }
      }

      data[i] = sample * 0.7
      // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    }

    const source = ctx.createBufferSource()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    source.buffer = buffer
    filter.type = 'lowpass'
    filter.frequency.value = 2500
    filter.Q.value = 1
    gainNode.gain.value = 0.5
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ

    source.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)
    source.start()

    this.activeSources.add(source)
    source.onended = () => this.activeSources.delete(source)
  }
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304

  playDriftBottle() {
    let ctx
    try { ctx = this.getContext() } catch { return }
    const duration = 1.5
    const sampleRate = ctx.sampleRate
    const length = sampleRate * duration
    const buffer = ctx.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      data[i] = Math.sin(2 * Math.PI * 440 * t) * 0.1 * Math.exp(-t * 2)
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler
      data[i] += Math.sin(2 * Math.PI * 554 * t) * 0.08 * Math.exp(-t * 2.5)
      data[i] += Math.sin(2 * Math.PI * 659 * t) * 0.06 * Math.exp(-t * 3)
    }

    this.playBuffer(buffer, 0.2)
  }

  stopAll() {
  // author-link: https://github.com/YU123-ZZZ
    this.pendingTimers.forEach(t => clearTimeout(t))
    this.pendingTimers.clear()
    this.activeSources.forEach(source => {
      try { source.stop() } catch { /* already stopped */ }
    })
    this.activeSources.clear()
  }
}

const soundManager = new SoundManager()

// ===== VibrationManager =====
function vibrate(pattern) {
// forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

function vibrateShred() {
  vibrate([50, 30, 50, 30, 50, 30, 80, 40, 80, 40, 100])
}

function vibrateBurn() {
// version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
  vibrate([30, 20, 30, 20, 30, 40, 50, 40, 30, 20, 30])
}

function vibrateFlush() {
  vibrate([100, 50, 100, 50, 150, 80, 200])
}

function vibrateDriftBottle() {
// version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  vibrate([50, 50, 50, 50, 100])
}

// ===== VoiceRecognition =====
const VOICE_LOCALE_MAP = {
  auto: null,
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  'zh-HK': 'zh-HK',
  en: 'en-US',
  'en-US': 'en-US',
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler
  ja: 'ja-JP',
  'ja-JP': 'ja-JP',
  ru: 'ru-RU',
  'ru-RU': 'ru-RU',
  ko: 'ko-KR',
  'ko-KR': 'ko-KR',
}

function normalizeSpeechLocale(locale) {
// author-link: https://github.com/YU123-ZZZ
  if (!locale || locale === 'auto') return null
  if (VOICE_LOCALE_MAP[locale]) return VOICE_LOCALE_MAP[locale]

  const normalized = String(locale).replace('_', '-').toLowerCase()
  if (normalized.indexOf('zh-hk') === 0) return 'zh-HK'
  if (normalized.indexOf('zh-tw') === 0) return 'zh-TW'
  if (normalized.indexOf('zh') === 0) return 'zh-CN'
  if (normalized.indexOf('en') === 0) return 'en-US'
  if (normalized.indexOf('ja') === 0) return 'ja-JP'
  if (normalized.indexOf('ru') === 0) return 'ru-RU'
  if (normalized.indexOf('ko') === 0) return 'ko-KR'
  return null
}
// forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304

function resolveSpeechLocale(mode, fallbackLanguage = 'zh-CN') {
  return normalizeSpeechLocale(mode) || normalizeSpeechLocale(fallbackLanguage) || 'zh-CN'
}

function resolveBrowserSpeechLocale(fallbackLanguage = 'zh-CN') {
  if (typeof navigator !== 'undefined') {
    const preferred = Array.isArray(navigator.languages) ? navigator.languages.slice() : []
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    if (navigator.language) preferred.push(navigator.language)
    for (const locale of preferred) {
      const resolved = normalizeSpeechLocale(locale)
      if (resolved) return resolved
    }
  }
  return resolveSpeechLocale('auto', fallbackLanguage)
}

function detectSpeechLocale(text, previousLocale = 'zh-CN') {
  const value = String(text || '')
  if (/[\uac00-\ud7af\u1100-\u11ff]/.test(value)) return 'ko-KR'
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  if (/[\u3040-\u30ff]/.test(value)) return 'ja-JP'
  if (/[\u0400-\u04ff]/.test(value)) return 'ru-RU'
  if (/[\u3400-\u9fff]/.test(value)) {
    return previousLocale === 'zh-TW' || previousLocale === 'zh-HK' ? previousLocale : 'zh-CN'
  }
  if (/[A-Za-z]/.test(value)) return 'en-US'
  return previousLocale || 'zh-CN'
}

class VoiceRecognition {
  constructor() {
    this.recognition = null
    this.isListening = false
    this.desiredListening = false
    this.sessionActive = false
    // author-link: https://github.com/YU123-ZZZ
    this.voiceMode = 'auto'
    this.fallbackLocale = 'zh-CN'
    this.currentLocale = 'zh-CN'
    this.activeLocale = null
    this.autoLocale = null
    this.callback = null
    this.onErrorCallback = null
    this.restartTimeout = null
    this.listeningTimeout = null
    this.baseText = ''
    this.committedText = ''
    this.flushedText = ''
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
  }

  isSupported() {
    return typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  }

  createRecognition() {
    if (typeof window === 'undefined') return null
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    const W = window
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition
    if (!SR) return null
    return new SR()
  }

  _bestAlternative(result) {
    let bestIdx = 0
    let bestConf = -1
    let found = false
    for (let j = 0; j < result.length; j++) {
      const transcript = (result[j].transcript || '')
      if (!transcript.trim()) continue
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      const conf = Number.isFinite(result[j].confidence) ? result[j].confidence : 0
      if (conf > bestConf) {
        bestConf = conf
        bestIdx = j
        found = true
      }
    }
    return found ? result[bestIdx].transcript : ''
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
  }

  _withBaseText(speechText) {
    if (!this.baseText) return speechText
    if (!speechText) return this.baseText
    const needsSpace = /[A-Za-z0-9]$/.test(this.baseText) && /^[A-Za-z0-9]/.test(speechText)
    return this.baseText + (needsSpace ? ' ' : '') + speechText
  }

  _attachHandlers() {
    if (!this.recognition) return
    this.recognition.continuous = true
    // author-link: https://github.com/YU123-ZZZ
    this.recognition.interimResults = true
    this.recognition.maxAlternatives = 10

    this.recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const best = this._bestAlternative(result)
        if (result.isFinal) finalTranscript += best
        // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
        else interimTranscript += best
      }
      if (finalTranscript) {
        this.committedText += finalTranscript
        this.flushedText = this.committedText
        if (this.voiceMode === 'auto') {
          const nextLocale = detectSpeechLocale(finalTranscript, this.currentLocale)
          const needsLocaleRestart = this.activeLocale && nextLocale !== this.activeLocale
          this.currentLocale = nextLocale
          // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
          this.autoLocale = this.currentLocale
          if (needsLocaleRestart) this._restartForLocale()
        }
        if (this.callback) this.callback(this._withBaseText(this.committedText), true)
      } else if (interimTranscript && this.callback) {
        this.callback(this._withBaseText(this.committedText + interimTranscript), false)
      }
    }

    this.recognition.onerror = (event) => {
      this.sessionActive = false
      if (event.error === 'aborted' || event.error === 'no-speech') return
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
      if (event.error === 'network') {
        this._scheduleRestart(150)
        return
      }
      this.desiredListening = false
      this.isListening = false
      if (this.onErrorCallback) this.onErrorCallback()
    }

    this.recognition.onend = () => {
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler
      this.sessionActive = false
      if (this.desiredListening) this._scheduleRestart(25)
    }
  }

  _startSession() {
    if (!this.desiredListening || this.sessionActive || !this.recognition) return
    this.recognition.lang = this.currentLocale
    try {
      this.recognition.start()
      this.sessionActive = true
      this.isListening = true
      this.activeLocale = this.currentLocale
    } catch {
    // author-link: https://github.com/YU123-ZZZ
      this.sessionActive = false
      this._scheduleRestart(80)
    }
  }

  _restartForLocale() {
    if (!this.desiredListening || !this.recognition) return
    if (!this.sessionActive) {
      this._scheduleRestart(0)
      return
    }
    this.sessionActive = false
    try { this.recognition.stop() } catch { this._scheduleRestart(0) }
  }

  start(callback, onError, mode = 'auto', initialText = '', fallbackLanguage = 'zh-CN') {
    if (!this.isSupported()) return
    this.stop()
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    this.callback = callback
    this.onErrorCallback = onError || null
    this.baseText = initialText || ''
    this.committedText = ''
    this.flushedText = ''
    this.activeLocale = null
    this.voiceMode = mode || 'auto'
    this.fallbackLocale = resolveBrowserSpeechLocale(fallbackLanguage)
    const textLocale = detectSpeechLocale(initialText, this.fallbackLocale)
    const hasTextLanguageHint = /[\uac00-\ud7af\u1100-\u11ff\u3040-\u30ff\u0400-\u04ff\u3400-\u9fffA-Za-z]/.test(initialText)
    this.currentLocale = this.voiceMode === 'auto'
      ? (hasTextLanguageHint ? textLocale : (this.autoLocale || this.fallbackLocale))
      : resolveSpeechLocale(this.voiceMode, this.fallbackLocale)
      // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    this.desiredListening = true
    this.recognition = this.createRecognition()
    if (!this.recognition) {
      this.desiredListening = false
      if (this.onErrorCallback) this.onErrorCallback()
      return
    }
    this._attachHandlers()
    this._startSession()
  }

  setVoiceMode(mode, fallbackLanguage) {
    this.voiceMode = mode || 'auto'
    this.fallbackLocale = resolveBrowserSpeechLocale(fallbackLanguage || this.fallbackLocale)
    this.currentLocale = this.voiceMode === 'auto'
      ? (this.autoLocale || this.fallbackLocale)
      : resolveSpeechLocale(this.voiceMode, this.fallbackLocale)
    if (!this.desiredListening || !this.recognition) return
    if (this.sessionActive) {
    // author-link: https://github.com/YU123-ZZZ
      this.sessionActive = false
      try { this.recognition.stop() } catch { this._scheduleRestart(0) }
    } else {
      this.resume()
    }
  }

  syncExternalText(text, discardPending = false) {
    this.baseText = String(text || '')
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    this.committedText = ''
    this.flushedText = ''
    if (!discardPending || !this.desiredListening || !this.recognition) return

    const oldRecognition = this.recognition
    oldRecognition.onresult = null
    oldRecognition.onerror = null
    oldRecognition.onend = null
    this.sessionActive = false
    try {
      if (typeof oldRecognition.abort === 'function') oldRecognition.abort()
      else oldRecognition.stop()
    } catch { /* The fresh session below will recover listening. */ }
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ

    this.recognition = this.createRecognition()
    if (!this.recognition) {
      this.desiredListening = false
      this.isListening = false
      if (this.onErrorCallback) this.onErrorCallback()
      return
    }
    // version-link: https://github.com/YU123-ZZZ/emotion-recycler | forum: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    this._attachHandlers()
    this._scheduleRestart(0)
  }

  _scheduleRestart(delay) {
    if (this.restartTimeout) clearTimeout(this.restartTimeout)
    this.restartTimeout = setTimeout(() => {
      this.restartTimeout = null
      if (!this.desiredListening) return
      if (this.committedText && this.committedText !== this.flushedText && this.callback) {
        this.flushedText = this.committedText
        this.callback(this._withBaseText(this.committedText), true)
        // version-link: https://github.com/YU123-ZZZ/emotion-recycler
      }
      this._startSession()
    }, delay)
  }

  resume() {
    if (this.desiredListening && !this.sessionActive) this._startSession()
  }

  stop() {
  // author-link: https://github.com/YU123-ZZZ
    this.desiredListening = false
    this.sessionActive = false
    this.isListening = false
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout)
      this.restartTimeout = null
    }
    // forum-link: https://www.52pojie.cn/home.php?mod=space&uid=2394304
    if (this.listeningTimeout) {
      clearTimeout(this.listeningTimeout)
      this.listeningTimeout = null
    }
    if (this.recognition) {
      try { this.recognition.stop() } catch { /* noop */ }
      this.recognition = null
    }
  }

  getIsActive() {
  // version-link: https://github.com/YU123-ZZZ/emotion-recycler | author: https://github.com/YU123-ZZZ
    return this.desiredListening
  }

  getCurrentLocale() {
    return this.currentLocale
  }
}

const voiceRecognition = new VoiceRecognition()
